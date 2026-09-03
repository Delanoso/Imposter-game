import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Vote, 
  Flame, 
  MessageSquare, 
  Sparkles, 
  Users 
} from 'lucide-react';
import type { MultiplayerRoomState, RoomPlayer } from '../types/multiplayer';

interface MultiplayerCluesScreenProps {
  roomState: MultiplayerRoomState;
  localPlayer: RoomPlayer;
  isHost: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onStartVoting: () => void;
}

export const MultiplayerCluesScreen = ({
  roomState,
  localPlayer,
  isHost,
  onToggleTimer,
  onResetTimer,
  onStartVoting,
}: MultiplayerCluesScreenProps) => {
  // Format timer
  const minutes = Math.floor(roomState.timerSecondsLeft / 60);
  const seconds = roomState.timerSecondsLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Reorder players starting from firstPlayerIndex
  const orderedPlayers = [
    ...roomState.players.slice(roomState.firstPlayerIndex),
    ...roomState.players.slice(0, roomState.firstPlayerIndex)
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-5 pb-24">
      {/* Category header & Round badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            Category: <strong className="text-indigo-400">{roomState.categoryName}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-purple-950/60 border border-purple-700/50 px-2.5 py-1 rounded-full text-purple-300 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-purple-400" />
          <span>Live Round</span>
        </div>
      </div>

      {/* Synchronized Timer Section */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col items-center relative overflow-hidden mb-5">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Discussion Timer</span>
        </div>

        <div className={`text-5xl font-black font-mono tracking-tight my-2 ${
          roomState.timerSecondsLeft <= 10 && roomState.timerSecondsLeft > 0
            ? 'text-rose-400 animate-pulse'
            : roomState.timerSecondsLeft === 0
            ? 'text-rose-500'
            : 'text-white'
        }`}>
          {timeFormatted}
        </div>

        {/* Timer Controls (Host only) */}
        {isHost ? (
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={onToggleTimer}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                roomState.isTimerRunning
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 hover:bg-amber-600/40'
                  : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600/40'
              }`}
            >
              {roomState.isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{roomState.isTimerRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={onResetTimer}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-[11px] text-slate-500 font-medium mt-1">
            {roomState.isTimerRunning ? '⏱️ Timer running...' : '⏸️ Timer paused'}
          </span>
        )}
      </div>

      {/* Speaking Turn Order */}
      <div className="flex flex-col gap-2 mb-4 flex-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            Speaking Order (One Clue Each)
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {orderedPlayers.map((player, idx) => {
            const isMe = player.id === localPlayer.id;
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition ${
                  isMe
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-950/50'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                    idx === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>

                  <span className="text-xl">{player.avatar}</span>
                  <div>
                    <span className="font-bold text-sm text-slate-200">{player.name}</span>
                    {isMe && <span className="text-[11px] text-indigo-300 ml-1.5">(You)</span>}
                  </div>
                </div>

                {idx === 0 && (
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Starts First
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules reminder banner */}
      <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 flex flex-col gap-1 mb-2">
        <div className="font-semibold text-slate-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Clue Giving Rules:
        </div>
        <p>• Speak out loud on your turn: exactly <strong>ONE WORD</strong> only.</p>
        <p>• Imposter must blend in and mimic tone!</p>
      </div>

      {/* Floating Bottom Action */}
      <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4">
        {isHost ? (
          <button
            onClick={onStartVoting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white font-extrabold text-base shadow-xl shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 border border-white/20"
          >
            <Vote className="w-5 h-5" />
            <span>START VOTING PHASE (ALL PLAYERS)</span>
          </button>
        ) : (
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Give your clues! Host will start the voting phase.</span>
          </div>
        )}
      </div>
    </div>
  );
};
