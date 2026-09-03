import { Server as SocketIOServer } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categoriesPath = path.join(__dirname, 'categories.json');
const DEFAULT_CATEGORIES = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));

export function setupSocketServer(httpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const rooms = new Map();
  const timerIntervals = new Map();

  function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return rooms.has(code) ? generateRoomCode() : code;
  }

  function getSanitizedRoomForPlayer(room, playerId) {
    // Hide secret roles/words during role-reveal, clues, and voting except for the specific player's own card
    const isSecretPhase = room.phase === 'role-reveal' || room.phase === 'clues' || room.phase === 'voting';
    
    const sanitizedPlayers = room.players.map(p => {
      if (isSecretPhase && p.id !== playerId) {
        return {
          ...p,
          role: undefined,
          word: undefined,
          hint: undefined
        };
      }
      return p;
    });

    return {
      ...room,
      civilianWord: isSecretPhase ? '' : room.civilianWord,
      imposterWord: isSecretPhase ? '' : room.imposterWord,
      confusedWord: isSecretPhase ? undefined : room.confusedWord,
      players: sanitizedPlayers,
      votes: room.phase === 'results' ? room.votes : {} // hide live votes until results
    };
  }

  function broadcastRoomState(room) {
    room.players.forEach(p => {
      const sanitized = getSanitizedRoomForPlayer(room, p.id);
      io.to(p.socketId).emit('room:state', sanitized);
    });
  }

  function stopRoomTimer(roomCode) {
    const existing = timerIntervals.get(roomCode);
    if (existing) {
      clearInterval(existing);
      timerIntervals.delete(roomCode);
    }
  }

  function startRoomTimer(room) {
    stopRoomTimer(room.roomCode);
    if (room.timerSecondsLeft <= 0) return;

    room.isTimerRunning = true;
    broadcastRoomState(room);

    const interval = setInterval(() => {
      const currentRoom = rooms.get(room.roomCode);
      if (!currentRoom || !currentRoom.isTimerRunning) {
        clearInterval(interval);
        return;
      }

      currentRoom.timerSecondsLeft--;
      if (currentRoom.timerSecondsLeft <= 0) {
        currentRoom.timerSecondsLeft = 0;
        currentRoom.isTimerRunning = false;
        clearInterval(interval);
        timerIntervals.delete(room.roomCode);
        io.to(room.roomCode).emit('room:timer-ended');
      }

      broadcastRoomState(currentRoom);
    }, 1000);

    timerIntervals.set(room.roomCode, interval);
  }

  function startNewRound(room) {
    stopRoomTimer(room.roomCode);

    // Filter categories
    let pool = DEFAULT_CATEGORIES.filter(c => room.settings.selectedCategoryIds.includes(c.id));
    if (pool.length === 0) pool = DEFAULT_CATEGORIES;

    const randomCategory = pool[Math.floor(Math.random() * pool.length)];
    const randomWordPair = randomCategory.words[Math.floor(Math.random() * randomCategory.words.length)];

    // Shuffle roles
    const playerIndices = room.players.map((_, i) => i);
    for (let i = playerIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [playerIndices[i], playerIndices[j]] = [playerIndices[j], playerIndices[i]];
    }

    const imposterCount = Math.min(room.settings.imposterCount, Math.max(1, Math.floor((room.players.length - 1) / 2)));
    const imposterIndices = new Set(playerIndices.slice(0, imposterCount));

    let confusedIndex = null;
    if (room.settings.enableConfusedRole && room.players.length >= 4 && playerIndices.length > imposterCount + 1) {
      confusedIndex = playerIndices[imposterCount];
    }

    let confusedWord = randomWordPair.imposterWord;
    const alternativePair = randomCategory.words.find(w => w.civilianWord !== randomWordPair.civilianWord);
    if (alternativePair) {
      confusedWord = alternativePair.civilianWord;
    }

    room.players = room.players.map((p, idx) => {
      let role = 'civilian';
      let word = randomWordPair.civilianWord;
      let hint = undefined;

      if (imposterIndices.has(idx)) {
        role = 'imposter';
        word = room.settings.gameMode === 'undercover' ? randomWordPair.imposterWord : '??? (You are the Imposter)';
        if (room.settings.enableHints && randomWordPair.hint) {
          hint = randomWordPair.hint;
        }
      } else if (confusedIndex === idx) {
        role = 'confused';
        word = confusedWord;
      }

      return {
        ...p,
        role,
        word,
        hint,
        hasViewedCard: false,
        votesReceived: 0
      };
    });

    room.categoryName = randomCategory.name;
    room.civilianWord = randomWordPair.civilianWord;
    room.imposterWord = randomWordPair.imposterWord;
    room.confusedWord = confusedIndex !== null ? confusedWord : undefined;
    room.hint = randomWordPair.hint;
    room.firstPlayerIndex = Math.floor(Math.random() * room.players.length);
    room.timerSecondsLeft = room.settings.discussionTimeSeconds || 60;
    room.isTimerRunning = false;
    room.eliminatedPlayerId = null;
    room.winner = null;
    room.votes = {};
    room.phase = 'role-reveal';

    broadcastRoomState(room);
  }

  function evaluateVotesAndEndRound(room, manualEliminatedId) {
    stopRoomTimer(room.roomCode);

    let eliminatedId = null;

    if (manualEliminatedId !== undefined) {
      eliminatedId = manualEliminatedId;
    } else {
      // Calculate from room.votes
      const countMap = {};
      room.players.forEach(p => countMap[p.id] = 0);
      Object.values(room.votes).forEach(targetId => {
        if (countMap[targetId] !== undefined) {
          countMap[targetId]++;
        }
      });

      let maxVotes = 0;
      let mostVoted = [];
      Object.entries(countMap).forEach(([pid, v]) => {
        if (v > maxVotes) {
          maxVotes = v;
          mostVoted = [pid];
        } else if (v === maxVotes && maxVotes > 0) {
          mostVoted.push(pid);
        }
      });

      eliminatedId = mostVoted.length === 1 ? mostVoted[0] : null;

      room.players = room.players.map(p => ({
        ...p,
        votesReceived: countMap[p.id] || 0
      }));
    }

    const eliminatedPlayer = room.players.find(p => p.id === eliminatedId);
    let winner = 'draw';

    if (eliminatedPlayer && eliminatedPlayer.role === 'imposter') {
      winner = 'civilians';
      room.players = room.players.map(p => {
        if (p.role === 'civilian') return { ...p, score: p.score + 2 };
        return p;
      });
    } else {
      winner = 'imposters';
      room.players = room.players.map(p => {
        if (p.role === 'imposter') return { ...p, score: p.score + 3 };
        return p;
      });
    }

    room.eliminatedPlayerId = eliminatedId;
    room.winner = winner;
    room.phase = 'results';

    broadcastRoomState(room);
  }

  io.on('connection', (socket) => {
    let currentRoomCode = null;
    let currentPlayerId = null;

    // Create a new room
    socket.on('room:create', ({ playerName, avatar }) => {
      const roomCode = generateRoomCode();
      const playerId = 'p_' + Math.random().toString(36).substring(2, 9);
      currentRoomCode = roomCode;
      currentPlayerId = playerId;

      socket.join(roomCode);

      const hostPlayer = {
        id: playerId,
        socketId: socket.id,
        name: playerName || 'Host',
        avatar: avatar || '👑',
        isHost: true,
        isReady: true,
        score: 0
      };

      const newRoom = {
        roomCode,
        hostId: playerId,
        phase: 'lobby',
        settings: {
          imposterCount: 1,
          gameMode: 'classic',
          enableHints: false,
          enableConfusedRole: false,
          discussionTimeSeconds: 60,
          selectedCategoryIds: DEFAULT_CATEGORIES.map(c => c.id)
        },
        players: [hostPlayer],
        categoryName: '',
        civilianWord: '',
        imposterWord: '',
        firstPlayerIndex: 0,
        timerSecondsLeft: 60,
        isTimerRunning: false,
        votes: {}
      };

      rooms.set(roomCode, newRoom);
      socket.emit('room:joined', { roomCode, playerId, isHost: true });
      broadcastRoomState(newRoom);
    });

    // Join existing room
    socket.on('room:join', ({ roomCode, playerName, avatar, existingPlayerId }) => {
      const code = roomCode.toUpperCase().trim();
      const room = rooms.get(code);

      if (!room) {
        socket.emit('room:error', { message: `Room "${code}" not found.` });
        return;
      }

      currentRoomCode = code;
      socket.join(code);

      // Check if reconnecting
      let player = existingPlayerId ? room.players.find(p => p.id === existingPlayerId) : null;

      if (player) {
        player.socketId = socket.id;
        currentPlayerId = player.id;
        if (playerName) player.name = playerName;
        if (avatar) player.avatar = avatar;
      } else {
        const playerId = 'p_' + Math.random().toString(36).substring(2, 9);
        currentPlayerId = playerId;

        player = {
          id: playerId,
          socketId: socket.id,
          name: playerName || `Player ${room.players.length + 1}`,
          avatar: avatar || '🦊',
          isHost: room.players.length === 0,
          isReady: false,
          score: 0
        };

        if (room.players.length === 0) {
          room.hostId = playerId;
        }

        room.players.push(player);
      }

      socket.emit('room:joined', { roomCode: code, playerId: player.id, isHost: player.isHost });
      broadcastRoomState(room);
    });

    // Update settings (Host only)
    socket.on('room:settings', ({ settings }) => {
      if (!currentRoomCode) return;
      const room = rooms.get(currentRoomCode);
      if (!room || room.hostId !== currentPlayerId) return;

      room.settings = { ...room.settings, ...settings };
      broadcastRoomState(room);
    });

    // Toggle player ready in lobby
    socket.on('player:ready', ({ isReady }) => {
      if (!currentRoomCode || !currentPlayerId) return;
      const room = rooms.get(currentRoomCode);
      if (!room) return;

      const player = room.players.find(p => p.id === currentPlayerId);
      if (player) {
        player.isReady = isReady;
        broadcastRoomState(room);
      }
    });

    // Start Game Round (Host only)
    socket.on('room:start-round', () => {
      if (!currentRoomCode) return;
      const room = rooms.get(currentRoomCode);
      if (!room || room.hostId !== currentPlayerId) return;

      startNewRound(room);
    });

    // Player acknowledged their card
    socket.on('player:card-viewed', () => {
      if (!currentRoomCode || !currentPlayerId) return;
      const room = rooms.get(currentRoomCode);
      if (!room) return;

      const player = room.players.find(p => p.id === currentPlayerId);
      if (player) {
        player.hasViewedCard = true;
      }

      // Check if all players viewed card -> proceed to clues & discussion
      const allViewed = room.players.every(p => p.hasViewedCard);
      if (allViewed && room.phase === 'role-reveal') {
        room.phase = 'clues';
        if (room.settings.discussionTimeSeconds > 0) {
          startRoomTimer(room);
        }
      }

      broadcastRoomState(room);
    });

    // Host manually advances from role-reveal to clues
    socket.on('room:advance-to-clues', () => {
      if (!currentRoomCode) return;
      const room = rooms.get(currentRoomCode);
      if (!room || room.hostId !== currentPlayerId) return;

      room.phase = 'clues';
      if (room.settings.discussionTimeSeconds > 0) {
        startRoomTimer(room);
      }
      broadcastRoomState(room);
    });

    // Timer controls (Host only)
    socket.on('room:toggle-timer', () => {
      if (!currentRoomCode) return;
      const room = rooms.get(currentRoomCode);
      if (!room) return;

      if (room.isTimerRunning) {
        stopRoomTimer(room.roomCode);
        room.isTimerRunning = false;
        broadcastRoomState(room);
      } else {
        startRoomTimer(room);
      }
    });

    socket.on('room:reset-timer', () => {
      if (!currentRoomCode) return;
      const room = rooms.get(currentRoomCode);
      if (!room) return;

      stopRoomTimer(room.roomCode);
      room.timerSecondsLeft = room.settings.discussionTimeSeconds || 60;
      room.isTimerRunning = false;
      broadcastRoomState(room);
    });

    // Advance to voting phase
    socket.on('room:start-voting', () => {
      if (!currentRoomCode) return;
      const room = rooms.get(currentRoomCode);
      if (!room) return;

      stopRoomTimer(room.roomCode);
      room.phase = 'voting';
      room.votes = {};
      broadcastRoomState(room);
    });

    // Cast vote from player's device
    socket.on('player:vote', ({ targetId }) => {
      if (!currentRoomCode || !currentPlayerId) return;
      const room = rooms.get(currentRoomCode);
      if (!room || room.phase !== 'voting') return;

      room.votes[currentPlayerId] = targetId;

      // Check if all active players cast their vote
      const allVoted = room.players.every(p => room.votes[p.id]);
      if (allVoted) {
        evaluateVotesAndEndRound(room);
      } else {
        broadcastRoomState(room);
      }
    });

    // Manual consensus decision (Host only)
    socket.on('room:group-decision', ({ eliminatedId }) => {
      if (!currentRoomCode) return;
      const room = rooms.get(currentRoomCode);
      if (!room || room.hostId !== currentPlayerId) return;

      evaluateVotesAndEndRound(room, eliminatedId);
    });

    // Imposter Guess secret word in results
    socket.on('imposter:guess-word', ({ guess }) => {
      if (!currentRoomCode || !currentPlayerId) return;
      const room = rooms.get(currentRoomCode);
      if (!room || room.phase !== 'results') return;

      const player = room.players.find(p => p.id === currentPlayerId);
      if (!player || player.role !== 'imposter') return;

      const normalizedGuess = guess.trim().toLowerCase();
      const normalizedTarget = room.civilianWord.trim().toLowerCase();
      const isCorrect = normalizedGuess === normalizedTarget || 
        (normalizedGuess.length > 2 && normalizedTarget.includes(normalizedGuess));

      if (isCorrect) {
        room.winner = 'imposters';
        room.players = room.players.map(p => {
          if (p.role === 'imposter') return { ...p, score: p.score + 2 };
          return p;
        });
        io.to(room.roomCode).emit('imposter:guess-result', { correct: true, guess, civilianWord: room.civilianWord });
      } else {
        io.to(room.roomCode).emit('imposter:guess-result', { correct: false, guess, civilianWord: room.civilianWord });
      }

      broadcastRoomState(room);
    });

    // Reset scores
    socket.on('room:reset-scores', () => {
      if (!currentRoomCode) return;
      const room = rooms.get(currentRoomCode);
      if (!room || room.hostId !== currentPlayerId) return;

      room.players = room.players.map(p => ({ ...p, score: 0 }));
      broadcastRoomState(room);
    });

    // Leave room
    socket.on('room:leave', () => {
      if (!currentRoomCode || !currentPlayerId) return;
      const room = rooms.get(currentRoomCode);
      if (room) {
        room.players = room.players.filter(p => p.id !== currentPlayerId);
        if (room.players.length === 0) {
          stopRoomTimer(room.roomCode);
          rooms.delete(room.roomCode);
        } else if (room.hostId === currentPlayerId) {
          room.hostId = room.players[0].id;
          room.players[0].isHost = true;
          broadcastRoomState(room);
        } else {
          broadcastRoomState(room);
        }
      }
      socket.leave(currentRoomCode);
      currentRoomCode = null;
      currentPlayerId = null;
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (!currentRoomCode || !currentPlayerId) return;
      const room = rooms.get(currentRoomCode);
      if (room) {
        // If in lobby, remove player; if mid-game, keep player for reconnect
        if (room.phase === 'lobby') {
          room.players = room.players.filter(p => p.id !== currentPlayerId);
          if (room.players.length === 0) {
            stopRoomTimer(room.roomCode);
            rooms.delete(room.roomCode);
          } else if (room.hostId === currentPlayerId) {
            room.hostId = room.players[0].id;
            room.players[0].isHost = true;
            broadcastRoomState(room);
          } else {
            broadcastRoomState(room);
          }
        }
      }
    });
  });
}
