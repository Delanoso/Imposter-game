import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import type { MultiplayerRoomState } from '../types/multiplayer';
import { soundFx, triggerHaptic } from '../utils/audio';
import confetti from 'canvas-confetti';

export function useMultiplayerRoom() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [roomState, setRoomState] = useState<MultiplayerRoomState | null>(null);
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedVoteId, setSelectedVoteId] = useState<string | null>(null);
  const [guessNotification, setGuessNotification] = useState<{ correct: boolean; guess: string; civilianWord: string } | null>(null);

  const localPlayer = roomState?.players.find(p => p.id === localPlayerId);

  // Initialize socket connection
  useEffect(() => {
    const s = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    s.on('connect', () => {
      setIsConnected(true);
    });

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    s.on('room:joined', (data: { roomCode: string; playerId: string; isHost: boolean }) => {
      setLocalPlayerId(data.playerId);
      setErrorMessage(null);
      try {
        localStorage.setItem('imposter_multi_pid', data.playerId);
      } catch {
        // ignore
      }
    });

    s.on('room:state', (state: MultiplayerRoomState) => {
      setRoomState(state);
    });

    s.on('room:error', (err: { message: string }) => {
      setErrorMessage(err.message);
    });

    s.on('room:timer-ended', () => {
      soundFx.playBuzzer();
      triggerHaptic(300);
    });

    s.on('imposter:guess-result', (data: { correct: boolean; guess: string; civilianWord: string }) => {
      setGuessNotification(data);
      if (data.correct) {
        soundFx.playVictory();
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
      } else {
        soundFx.playBuzzer();
      }
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Host action: Create room
  const createRoom = (playerName: string, avatar: string) => {
    soundFx.playClick();
    if (socket) {
      socket.emit('room:create', { playerName, avatar });
    }
  };

  // Join existing room
  const joinRoom = (roomCode: string, playerName: string, avatar: string) => {
    soundFx.playClick();
    if (socket) {
      const existingPlayerId = localStorage.getItem('imposter_multi_pid') || undefined;
      socket.emit('room:join', { roomCode, playerName, avatar, existingPlayerId });
    }
  };

  // Update room settings (Host only)
  const updateSettings = (settings: Partial<MultiplayerRoomState['settings']>) => {
    soundFx.playClick();
    if (socket) {
      socket.emit('room:settings', { settings });
    }
  };

  // Toggle ready status in lobby
  const toggleReady = (isReady: boolean) => {
    soundFx.playClick();
    if (socket) {
      socket.emit('player:ready', { isReady });
    }
  };

  // Host starts game round
  const startRound = () => {
    soundFx.playClick();
    if (socket) {
      socket.emit('room:start-round');
    }
  };

  // Player flips card & acknowledges role
  const markCardViewed = () => {
    soundFx.playReveal();
    if (socket) {
      socket.emit('player:card-viewed');
    }
  };

  // Host advances to clues phase
  const advanceToClues = () => {
    soundFx.playClick();
    if (socket) {
      socket.emit('room:advance-to-clues');
    }
  };

  // Timer controls
  const toggleTimer = () => {
    soundFx.playClick();
    if (socket) {
      socket.emit('room:toggle-timer');
    }
  };

  const resetTimer = () => {
    soundFx.playClick();
    if (socket) {
      socket.emit('room:reset-timer');
    }
  };

  // Host advances to voting
  const startVoting = () => {
    soundFx.playClick();
    if (socket) {
      socket.emit('room:start-voting');
      setSelectedVoteId(null);
    }
  };

  // Cast vote
  const castVote = (targetId: string) => {
    soundFx.playClick();
    setSelectedVoteId(targetId);
    if (socket) {
      socket.emit('player:vote', { targetId });
    }
  };

  // Host manual group consensus decision
  const submitGroupDecision = (eliminatedId: string | null) => {
    soundFx.playClick();
    if (socket) {
      socket.emit('room:group-decision', { eliminatedId });
    }
  };

  // Imposter guesses secret word
  const submitImposterGuess = (guess: string) => {
    if (socket && guess.trim()) {
      socket.emit('imposter:guess-word', { guess: guess.trim() });
    }
  };

  // Reset scores
  const resetScores = () => {
    soundFx.playClick();
    if (socket) {
      socket.emit('room:reset-scores');
    }
  };

  // Leave room
  const leaveRoom = () => {
    soundFx.playClick();
    if (socket) {
      socket.emit('room:leave');
    }
    setRoomState(null);
    setLocalPlayerId(null);
    setSelectedVoteId(null);
    setGuessNotification(null);
    try {
      localStorage.removeItem('imposter_multi_pid');
    } catch {
      // ignore
    }
  };

  return {
    isConnected,
    roomState,
    localPlayerId,
    localPlayer,
    isHost: roomState?.hostId === localPlayerId,
    errorMessage,
    setErrorMessage,
    selectedVoteId,
    setSelectedVoteId,
    guessNotification,
    createRoom,
    joinRoom,
    updateSettings,
    toggleReady,
    startRound,
    markCardViewed,
    advanceToClues,
    toggleTimer,
    resetTimer,
    startVoting,
    castVote,
    submitGroupDecision,
    submitImposterGuess,
    resetScores,
    leaveRoom
  };
}
