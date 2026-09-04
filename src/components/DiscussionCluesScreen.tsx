import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Vote, 
  Flame, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import type { Player } from '../types/game';
import { soundFx } from '../utils/audio';
import { useState } from 'react';

interface DiscussionCluesScreenProps {
  categoryName: string;
  players: Player[];
  firstPlayerIndex: number;
  timerSecondsLeft: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onProceedToVoting: () => void;
}

export const DiscussionCluesScreen = ({
  categoryName,
  players,
  firstPlayerIndex,
  timerSecondsLeft,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  onProceedToVoting,
}: DiscussionCluesScreenProps) => {
  const [clueRound, setClueRound] = useState(1);

  // Format timer
  const minutes = Math.floor(timerSecondsLeft / 60);
  const seconds = timerSecondsLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Reorder players starting from firstPlayerIndex
  const orderedPlayers = [
    ...players.slice(firstPlayerIndex),
    ...players.slice(0, firstPlayerIndex)
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-5 pb-24">
      {/* Category header & Round badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            Category: <strong className="text-indigo-400">{categoryName}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-purple-950/60 border border-purple-700/50 px-2.5 py-1 rounded-full text-purple-300 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-purple-400" />
          <span>Clue Round {clueRound}</span>
        </div>
      </div>

      {/* Timer Section */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col items-center relative overflow-hidden mb-5">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Discussion Timer</span>
        </div>

        <div className={`text-5xl font-black font-mono tracking-tight my-2 ${
          timerSecondsLeft <= 10 && timerSecondsLeft > 0
            ? 'text-rose-400 animate-pulse'
            : timerSecondsLeft === 0
            ? 'text-rose-500'
            : 'text-white'
        }`}>
          {timeFormatted}
        </div>

        {/* Timer Controls */}
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={() => {
              soundFx.playClick();
              onToggleTimer();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              isTimerRunning
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 hover:bg-amber-600/40'
                : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600/40'
            }`}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onResetTimer();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Clue Turn Order */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            Speaking Order (One Clue Each)
          </span>
          <button
            onClick={() => setClueRound(r => r === 1 ? 2 : 1)}
            className="text-[11px] text-indigo-400 font-semibold hover:underline"
          >
            Switch to Round {clueRound === 1 ? 2 : 1}
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {orderedPlayers.map((player, idx) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition ${
                idx === 0
                  ? 'bg-indigo-950/50 border-indigo-500/80 shadow-md shadow-indigo-950/50'
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
                <span className="font-bold text-sm text-slate-200">{player.name}</span>
              </div>

              {idx === 0 && (
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Starts First
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rules reminder banner */}
      <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 flex flex-col gap-1">
        <div className="font-semibold text-slate-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Clue Giving Rules:
        </div>
        <p>• Say exactly <strong>ONE WORD</strong> only.</p>
        <p>• No repeating or saying the secret word directly.</p>
        <p>• Bullshitters should mimic tone and blend in!</p>
      </div>

      {/* Floating Bottom Action */}
      <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4">
        <button
          onClick={onProceedToVoting}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white font-extrabold text-base shadow-xl shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 border border-white/20"
        >
          <Vote className="w-5 h-5" />
          <span>VOTE WHO IS THE BULLSHITTER</span>
        </button>
      </div>
    </div>
  );
};
