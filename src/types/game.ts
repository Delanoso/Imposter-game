export type GameMode = 'classic' | 'undercover' | 'confused';

export type GameScreen = 
  | 'home'
  | 'setup'
  | 'category-select'
  | 'custom-packs'
  | 'pass-screen'
  | 'role-reveal'
  | 'discussion-clues'
  | 'voting'
  | 'results'
  | 'leaderboard'
  | 'how-to-play';

export type PlayerRole = 'civilian' | 'imposter' | 'confused';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  role?: PlayerRole;
  word?: string;
  hint?: string;
  hasViewedCard?: boolean;
  score: number;
  votesReceived?: number;
}

export interface GameSettings {
  playerCount: number;
  imposterCount: number;
  enableConfusedRole: boolean; // Confused gets a 3rd slightly different word but is innocent
  enableHintsForImposter: boolean;
  gameMode: GameMode;
  discussionTimeSeconds: number; // e.g. 90s or 0 for untimed
  clueRounds: number; // 1 or 2
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  selectedCategoryIds: string[];
}

export interface ActiveRoundData {
  categoryName: string;
  civilianWord: string;
  imposterWord: string;
  confusedWord?: string;
  hint?: string;
  firstPlayerIndex: number; // Who gives the first clue
  currentPlayerRevealIndex: number;
  players: Player[];
  eliminatedPlayerId?: string | null;
  imposterGuessedWordCorrectly?: boolean | null;
  winner?: 'civilians' | 'imposters' | 'draw' | null;
}
