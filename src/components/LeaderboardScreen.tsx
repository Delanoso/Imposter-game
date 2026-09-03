import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react';
import type { Player } from '../types/game';

interface LeaderboardScreenProps {
  players: Player[];
  onResetScores: () => void;
  onBack: () => void;
}

export const LeaderboardScreen = ({
  players,
  onResetScores,
  onBack,
}: LeaderboardScreenProps) => {
  // Sort players descending by score
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-5 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white">Party Leaderboard</h2>
        </div>
        <button
          onClick={onResetScores}
          className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 transition active:scale-90"
          title="Reset All Scores"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Podium for Top 3 */}
      {sorted.length >= 3 && (
        <div className="flex items-end justify-center gap-3 my-4 mb-8 px-2">
          {/* 2nd Place */}
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl mb-1">{sorted[1].avatar}</span>
            <span className="text-xs font-bold text-slate-300 truncate max-w-[80px]">{sorted[1].name}</span>
            <span className="text-xs font-extrabold text-indigo-400 font-mono">{sorted[1].score} pts</span>
            <div className="w-full h-20 bg-slate-800/90 border-t-2 border-slate-400 rounded-t-xl flex items-center justify-center text-slate-400 font-black text-lg mt-2">
              2
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center flex-1">
            <div className="relative">
              <span className="text-4xl mb-1 block">{sorted[0].avatar}</span>
              <span className="absolute -top-3 -right-2 text-base">👑</span>
            </div>
            <span className="text-xs font-bold text-amber-300 truncate max-w-[90px]">{sorted[0].name}</span>
            <span className="text-sm font-extrabold text-amber-400 font-mono">{sorted[0].score} pts</span>
            <div className="w-full h-28 bg-gradient-to-b from-amber-600/40 to-slate-800/90 border-t-2 border-amber-400 rounded-t-xl flex items-center justify-center text-amber-300 font-black text-2xl mt-2 shadow-lg shadow-amber-500/10">
              1
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl mb-1">{sorted[2].avatar}</span>
            <span className="text-xs font-bold text-slate-300 truncate max-w-[80px]">{sorted[2].name}</span>
            <span className="text-xs font-extrabold text-orange-400 font-mono">{sorted[2].score} pts</span>
            <div className="w-full h-14 bg-slate-800/90 border-t-2 border-orange-600/80 rounded-t-xl flex items-center justify-center text-orange-400 font-black text-base mt-2">
              3
            </div>
          </div>
        </div>
      )}

      {/* Score list */}
      <div className="flex flex-col gap-2">
        {sorted.map((p, idx) => (
          <div
            key={p.id}
            className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
              idx === 0
                ? 'bg-amber-950/30 border-amber-500/40'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                idx === 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                #{idx + 1}
              </span>

              <span className="text-2xl">{p.avatar}</span>
              <span className="font-bold text-sm text-slate-200">{p.name}</span>
            </div>

            <span className="text-base font-extrabold text-amber-400 font-mono">
              {p.score} <span className="text-xs text-slate-500 font-normal">pts</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
