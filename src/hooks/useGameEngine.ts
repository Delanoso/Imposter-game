import type { 
  GameSettings, 
  GameScreen, 
  Player, 
  ActiveRoundData, 
  PlayerRole 
} from '../types/game';
import { 
  DEFAULT_CATEGORIES, 
  STORAGE_CUSTOM_CATEGORIES_KEY, 
  STORAGE_SCORES_KEY, 
  STORAGE_SETTINGS_KEY 
} from '../data/wordCategories';
import type { Category } from '../data/wordCategories';
import { soundFx, triggerHaptic } from '../utils/audio';
import confetti from 'canvas-confetti';
import { useState, useEffect } from 'react';

const DEFAULT_AVATARS = ['🦊', '🐼', '🐯', '🦁', '🐸', '🐨', '🐙', '🦄', '🦉', '🐺', '🐱', '🐶', '🐵', '🦖'];

const DEFAULT_SETTINGS: GameSettings = {
  playerCount: 4,
  imposterCount: 1,
  enableConfusedRole: false,
  enableHintsForImposter: false,
  gameMode: 'classic',
  discussionTimeSeconds: 60,
  clueRounds: 1,
  soundEnabled: true,
  vibrationEnabled: true,
  selectedCategoryIds: ['food-drinks', 'animals-nature', 'pop-culture', 'everyday-items', 'places-travel', 'professions-roles', 'sports-hobbies', 'spicy-party']
};

export function useGameEngine() {
  const [screen, setScreen] = useState<GameScreen>('home');
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [customCategories, setCustomCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_CATEGORIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Player 1', avatar: '🦊', score: 0 },
    { id: '2', name: 'Player 2', avatar: '🐼', score: 0 },
    { id: '3', name: 'Player 3', avatar: '🐯', score: 0 },
    { id: '4', name: 'Player 4', avatar: '🦁', score: 0 }
  ]);

  const [activeRound, setActiveRound] = useState<ActiveRoundData | null>(null);
  const [isCardRevealed, setIsCardRevealed] = useState<boolean>(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [selectedVotePlayerId, setSelectedVotePlayerId] = useState<string | null>(null);
  const [votingTurnIndex, setVotingTurnIndex] = useState<number>(0);
  const [votesMap, setVotesMap] = useState<Record<string, string>>({}); // voterId -> targetId
  const [imposterGuessInput, setImposterGuessInput] = useState<string>('');
  const [showHowToPlayModal, setShowHowToPlayModal] = useState<boolean>(false);

  // Sync settings soundFx
  useEffect(() => {
    soundFx.setEnabled(settings.soundEnabled);
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Sync custom categories
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_CATEGORIES_KEY, JSON.stringify(customCategories));
    } catch {
      // ignore
    }
  }, [customCategories]);

  // Load persistent scores
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SCORES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPlayers(prev => prev.map(p => ({
          ...p,
          score: parsed[p.name] !== undefined ? parsed[p.name] : p.score
        })));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save persistent scores
  const saveScoresToStorage = (playerList: Player[]) => {
    try {
      const scoreMap: Record<string, number> = {};
      playerList.forEach(p => {
        scoreMap[p.name] = p.score;
      });
      localStorage.setItem(STORAGE_SCORES_KEY, JSON.stringify(scoreMap));
    } catch {
      // ignore
    }
  };

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];

  const updateSettings = (partial: Partial<GameSettings>) => {
    soundFx.playClick();
    setSettings(prev => ({ ...prev, ...partial }));
  };

  // Adjust player count
  const handleSetPlayerCount = (count: number) => {
    soundFx.playClick();
    const clamped = Math.max(3, Math.min(20, count));
    setPlayers(prev => {
      const next = [...prev];
      if (clamped > prev.length) {
        for (let i = prev.length; i < clamped; i++) {
          const avatar = DEFAULT_AVATARS[i % DEFAULT_AVATARS.length];
          next.push({
            id: String(i + 1),
            name: `Player ${i + 1}`,
            avatar,
            score: 0
          });
        }
      } else if (clamped < prev.length) {
        return next.slice(0, clamped);
      }
      return next;
    });

    // Auto-balance imposters
    const maxImposters = Math.max(1, Math.floor((clamped - 1) / 2));
    const nextImposters = Math.min(settings.imposterCount, maxImposters);
    setSettings(prev => ({ ...prev, playerCount: clamped, imposterCount: nextImposters }));
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  };

  const updatePlayerAvatar = (id: string, avatar: string) => {
    soundFx.playClick();
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, avatar } : p));
  };

  // Start a new match round
  const startNewRound = () => {
    soundFx.playClick();
    if (settings.vibrationEnabled) triggerHaptic(80);

    // Filter available categories
    let pool = allCategories.filter(c => settings.selectedCategoryIds.includes(c.id));
    if (pool.length === 0) pool = DEFAULT_CATEGORIES;

    // Pick random category
    const randomCategory = pool[Math.floor(Math.random() * pool.length)];
    const randomWordPair = randomCategory.words[Math.floor(Math.random() * randomCategory.words.length)];

    // Shuffle player indices for roles
    const playerIndices = players.map((_, idx) => idx);
    for (let i = playerIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [playerIndices[i], playerIndices[j]] = [playerIndices[j], playerIndices[i]];
    }

    const imposterIndices = new Set(playerIndices.slice(0, settings.imposterCount));
    let confusedIndex: number | null = null;
    if (settings.enableConfusedRole && settings.playerCount >= 4 && playerIndices.length > settings.imposterCount + 1) {
      confusedIndex = playerIndices[settings.imposterCount];
    }

    // Pick a confused word from same category if needed
    let confusedWord = randomWordPair.imposterWord;
    const alternativePair = randomCategory.words.find(w => w.civilianWord !== randomWordPair.civilianWord);
    if (alternativePair) {
      confusedWord = alternativePair.civilianWord;
    }

    const assignedPlayers: Player[] = players.map((player, idx) => {
      let role: PlayerRole = 'civilian';
      let word = randomWordPair.civilianWord;
      let hint: string | undefined = undefined;

      if (imposterIndices.has(idx)) {
        role = 'imposter';
        if (settings.gameMode === 'undercover') {
          word = randomWordPair.imposterWord;
        } else {
          word = '??? (You are the Bullshitter)';
        }
        if (settings.enableHintsForImposter && randomWordPair.hint) {
          hint = randomWordPair.hint;
        }
      } else if (confusedIndex === idx) {
        role = 'confused';
        word = confusedWord;
      }

      return {
        ...player,
        role,
        word,
        hint,
        hasViewedCard: false,
        votesReceived: 0
      };
    });

    const firstPlayerIndex = Math.floor(Math.random() * assignedPlayers.length);

    setActiveRound({
      categoryName: randomCategory.name,
      civilianWord: randomWordPair.civilianWord,
      imposterWord: randomWordPair.imposterWord,
      confusedWord: confusedIndex !== null ? confusedWord : undefined,
      hint: randomWordPair.hint,
      firstPlayerIndex,
      currentPlayerRevealIndex: 0,
      players: assignedPlayers,
      eliminatedPlayerId: null,
      imposterGuessedWordCorrectly: null,
      winner: null
    });

    setIsCardRevealed(false);
    setTimerSecondsLeft(settings.discussionTimeSeconds || 60);
    setIsTimerRunning(false);
    setVotesMap({});
    setSelectedVotePlayerId(null);
    setVotingTurnIndex(0);
    setImposterGuessInput('');
    setScreen('pass-screen');
  };

  // Reveal next card or proceed to discussion
  const onCardRevealAcknowledge = () => {
    soundFx.playClick();
    if (!activeRound) return;

    const nextIndex = activeRound.currentPlayerRevealIndex + 1;
    if (nextIndex < activeRound.players.length) {
      setActiveRound(prev => prev ? ({
        ...prev,
        currentPlayerRevealIndex: nextIndex
      }) : null);
      setIsCardRevealed(false);
      setScreen('pass-screen');
    } else {
      // All cards revealed -> go to discussion & clues
      setIsCardRevealed(false);
      setTimerSecondsLeft(settings.discussionTimeSeconds || 60);
      setIsTimerRunning(settings.discussionTimeSeconds > 0);
      setScreen('discussion-clues');
    }
  };

  // Timer Tick
  useEffect(() => {
    let interval: number | null = null;
    if (screen === 'discussion-clues' && isTimerRunning && timerSecondsLeft > 0) {
      interval = window.setInterval(() => {
        setTimerSecondsLeft(prev => {
          if (prev <= 1) {
            soundFx.playBuzzer();
            if (settings.vibrationEnabled) triggerHaptic(300);
            return 0;
          }
          if (prev <= 6) {
            soundFx.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [screen, isTimerRunning, timerSecondsLeft, settings.vibrationEnabled]);

  // Proceed to voting
  const startVotingPhase = () => {
    soundFx.playClick();
    setIsTimerRunning(false);
    setVotingTurnIndex(0);
    setSelectedVotePlayerId(null);
    setVotesMap({});
    setScreen('voting');
  };

  // Cast vote for current player turn (In-App Pass & Vote)
  const submitCurrentVote = (targetId: string) => {
    soundFx.playClick();
    if (!activeRound) return;

    const currentVoter = activeRound.players[votingTurnIndex];
    const newVotes = { ...votesMap, [currentVoter.id]: targetId };
    setVotesMap(newVotes);

    const nextVoterIdx = votingTurnIndex + 1;
    if (nextVoterIdx < activeRound.players.length) {
      setVotingTurnIndex(nextVoterIdx);
      setSelectedVotePlayerId(null);
    } else {
      // All votes recorded, calculate results
      evaluateVotingResults(newVotes);
    }
  };

  // Skip in-app voting and go straight to manual group discussion decision
  const skipToGroupDecision = (eliminatedId: string | null) => {
    soundFx.playClick();
    if (!activeRound) return;

    finalizeRound(eliminatedId);
  };

  const evaluateVotingResults = (finalVotes: Record<string, string>) => {
    if (!activeRound) return;

    // Count votes
    const countMap: Record<string, number> = {};
    activeRound.players.forEach(p => countMap[p.id] = 0);
    Object.values(finalVotes).forEach(targetId => {
      if (countMap[targetId] !== undefined) {
        countMap[targetId]++;
      }
    });

    // Find highest vote count
    let maxVotes = 0;
    let mostVotedPlayers: string[] = [];
    Object.entries(countMap).forEach(([pid, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        mostVotedPlayers = [pid];
      } else if (votes === maxVotes && maxVotes > 0) {
        mostVotedPlayers.push(pid);
      }
    });

    const updatedPlayersWithVotes = activeRound.players.map(p => ({
      ...p,
      votesReceived: countMap[p.id] || 0
    }));

    // If tie or no clear majority, no single player is eliminated
    const eliminatedId = mostVotedPlayers.length === 1 ? mostVotedPlayers[0] : null;

    setActiveRound(prev => prev ? ({
      ...prev,
      players: updatedPlayersWithVotes
    }) : null);

    finalizeRound(eliminatedId);
  };

  const finalizeRound = (eliminatedId: string | null) => {
    if (!activeRound) return;

    const eliminatedPlayer = activeRound.players.find(p => p.id === eliminatedId);
    let winner: 'civilians' | 'imposters' | 'draw' = 'draw';

    let nextPlayers = [...activeRound.players];

    if (eliminatedPlayer && (eliminatedPlayer.role === 'imposter')) {
      // Imposter caught! Civilians win (unless imposter guesses the word later in results screen)
      winner = 'civilians';
      soundFx.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Award 2 points to each civilian
      nextPlayers = nextPlayers.map(p => {
        if (p.role === 'civilian') return { ...p, score: p.score + 2 };
        return p;
      });
    } else {
      // Imposter survived or innocent eliminated -> Imposters win!
      winner = 'imposters';
      soundFx.playImposterReveal();

      // Award 3 points to imposter(s)
      nextPlayers = nextPlayers.map(p => {
        if (p.role === 'imposter') return { ...p, score: p.score + 3 };
        return p;
      });
    }

    setPlayers(nextPlayers);
    saveScoresToStorage(nextPlayers);

    setActiveRound(prev => prev ? ({
      ...prev,
      players: nextPlayers,
      eliminatedPlayerId: eliminatedId,
      winner
    }) : null);

    setScreen('results');
  };

  // Imposter guesses secret word on the results screen for bonus points
  const handleImposterGuessWord = (guessedWord: string) => {
    if (!activeRound) return;

    const normalizedGuess = guessedWord.trim().toLowerCase();
    const normalizedTarget = activeRound.civilianWord.trim().toLowerCase();

    const isCorrect = normalizedGuess === normalizedTarget || 
      (normalizedGuess.length > 2 && normalizedTarget.includes(normalizedGuess));

    if (isCorrect) {
      soundFx.playVictory();
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
      const updated = players.map(p => {
        if (p.role === 'imposter') return { ...p, score: p.score + 2 };
        return p;
      });
      setPlayers(updated);
      saveScoresToStorage(updated);
      setActiveRound(prev => prev ? ({
        ...prev,
        imposterGuessedWordCorrectly: true,
        winner: 'imposters'
      }) : null);
    } else {
      soundFx.playBuzzer();
      setActiveRound(prev => prev ? ({
        ...prev,
        imposterGuessedWordCorrectly: false
      }) : null);
    }
  };

  const resetAllScores = () => {
    soundFx.playClick();
    const zeroed = players.map(p => ({ ...p, score: 0 }));
    setPlayers(zeroed);
    saveScoresToStorage(zeroed);
  };

  const addCustomCategory = (category: Omit<Category, 'id' | 'isCustom'>) => {
    soundFx.playClick();
    const newCat: Category = {
      ...category,
      id: 'custom-' + Date.now(),
      isCustom: true
    };
    setCustomCategories(prev => [...prev, newCat]);
    setSettings(prev => ({
      ...prev,
      selectedCategoryIds: [...prev.selectedCategoryIds, newCat.id]
    }));
  };

  const removeCustomCategory = (id: string) => {
    soundFx.playClick();
    setCustomCategories(prev => prev.filter(c => c.id !== id));
    setSettings(prev => ({
      ...prev,
      selectedCategoryIds: prev.selectedCategoryIds.filter(cid => cid !== id)
    }));
  };

  return {
    screen,
    setScreen,
    settings,
    updateSettings,
    players,
    handleSetPlayerCount,
    updatePlayerName,
    updatePlayerAvatar,
    allCategories,
    customCategories,
    addCustomCategory,
    removeCustomCategory,
    activeRound,
    startNewRound,
    isCardRevealed,
    setIsCardRevealed,
    onCardRevealAcknowledge,
    timerSecondsLeft,
    setTimerSecondsLeft,
    isTimerRunning,
    setIsTimerRunning,
    startVotingPhase,
    votingTurnIndex,
    selectedVotePlayerId,
    setSelectedVotePlayerId,
    submitCurrentVote,
    skipToGroupDecision,
    imposterGuessInput,
    setImposterGuessInput,
    handleImposterGuessWord,
    resetAllScores,
    showHowToPlayModal,
    setShowHowToPlayModal
  };
}
