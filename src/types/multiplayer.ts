export type MultiPlayerRole = 'civilian' | 'imposter' | 'confused';

export interface RoomPlayer {
  id: string; // socket.id or unique player id
  name: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  role?: MultiPlayerRole;
  word?: string;
  hint?: string;
  hasViewedCard?: boolean;
  score: number;
  votesReceived?: number;
}

export type RoomPhase = 'lobby' | 'role-reveal' | 'clues' | 'voting' | 'results';

export interface RoomSettings {
  imposterCount: number;
  gameMode: 'classic' | 'undercover';
  enableHints: boolean;
  enableConfusedRole: boolean;
  discussionTimeSeconds: number;
  selectedCategoryIds: string[];
}

export interface MultiplayerRoomState {
  roomCode: string;
  hostId: string;
  phase: RoomPhase;
  settings: RoomSettings;
  players: RoomPlayer[];
  categoryName: string;
  civilianWord: string;
  imposterWord: string;
  confusedWord?: string;
  hint?: string;
  firstPlayerIndex: number;
  timerSecondsLeft: number;
  isTimerRunning: boolean;
  eliminatedPlayerId?: string | null;
  winner?: 'civilians' | 'imposters' | 'draw' | null;
  votes: Record<string, string>; // voterId -> targetId
}
