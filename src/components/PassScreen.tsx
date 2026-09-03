import { AlertTriangle, Eye } from 'lucide-react';
import type { Player } from '../types/game';

interface PassScreenProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  categoryName: string;
  onReadyToReveal: () => void;
}

export const PassScreen = ({
  player,
  playerIndex,
  totalPlayers,
  categoryName,
  onReadyToReveal,
}: PassScreenProps) => {
  return (
    <div className="flex flex-col min-h-[90vh] max-w-md mx-auto justify-between px-4 py-8 text-center animate-fade-in">
      {/* Category Indicator & Progress */}
      <div className="flex flex-col items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
          Category: <span className="text-indigo-400 font-bold">{categoryName}</span>
        </span>
        <div className="flex gap-1 mt-1">
          {Array.from({ length: totalPlayers }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === playerIndex
                  ? 'w-6 bg-indigo-500'
                  : i < playerIndex
                  ? 'w-3 bg-emerald-500'
                  : 'w-3 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Pass Prompt Card */}
      <div className="flex flex-col items-center justify-center my-auto p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="w-20 h-20 rounded-2xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-4xl mb-4 shadow-lg animate-bounce">
          {player.avatar}
        </div>

        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
          Pass Phone To
        </h3>
        <h2 className="text-3xl font-extrabold text-white mt-1 mb-4 truncate max-w-xs">
          {player.name}
        </h2>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>Make sure nobody else is peeking at the screen!</span>
        </div>
      </div>

      {/* Action to Reveal */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onReadyToReveal}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 text-white font-bold text-lg shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 border border-white/20"
        >
          <Eye className="w-5 h-5" />
          <span>I AM {player.name.toUpperCase()} (REVEAL)</span>
        </button>

        <p className="text-xs text-slate-500">
          Player {playerIndex + 1} of {totalPlayers}
        </p>
      </div>
    </div>
  );
};
