import { useState } from 'react';
import { 
  EyeOff, 
  ShieldAlert, 
  Sparkles, 
  Lock,
  CheckCircle2,
  Users
} from 'lucide-react';
import type { MultiplayerRoomState, RoomPlayer } from '../types/multiplayer';
import { soundFx } from '../utils/audio';

interface MultiplayerRoleRevealProps {
  roomState: MultiplayerRoomState;
  localPlayer: RoomPlayer;
  isHost: boolean;
  onCardViewed: () => void;
  onAdvanceToClues: () => void;
}

export const MultiplayerRoleReveal = ({
  roomState,
  localPlayer,
  isHost,
  onCardViewed,
  onAdvanceToClues,
}: MultiplayerRoleRevealProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const isImposter = localPlayer.role === 'imposter';

  const handleToggleReveal = () => {
    // Both imposter and civilians play the exact same reveal sound
    if (!isRevealed) {
      soundFx.playReveal();
    } else {
      soundFx.playClick();
    }
    setIsRevealed(!isRevealed);
  };

  const handleAcknowledge = () => {
    onCardViewed();
  };

  const viewedCount = roomState.players.filter(p => p.hasViewedCard).length;
  const totalPlayers = roomState.players.length;

  return (
    <div className="flex flex-col min-h-[90vh] max-w-md mx-auto justify-between px-4 py-6 text-center animate-fade-in">
      {/* Category header */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          Category: <span className="text-indigo-400 font-bold">{roomState.categoryName}</span>
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
          {localPlayer.name}
        </span>
      </div>

      {/* Secret Card */}
      <div className="my-auto flex flex-col items-center">
        <div 
          onClick={handleToggleReveal}
          className={`w-full max-w-xs h-72 rounded-3xl border-2 transition-all duration-300 cursor-pointer p-6 flex flex-col items-center justify-between shadow-2xl relative select-none ${
            isRevealed
              ? isImposter
                ? 'bg-gradient-to-b from-rose-950 via-slate-900 to-rose-950 border-rose-500/80 shadow-rose-950/60'
                : 'bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 border-indigo-500/80 shadow-indigo-950/60'
              : 'bg-slate-900 border-slate-700 hover:border-slate-600 shadow-black/50'
          }`}
        >
          {/* Card Top Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-semibold text-slate-300">
            {isRevealed ? (
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isRevealed ? 'Tap to hide' : 'Tap to reveal role'}</span>
          </div>

          {/* Card Center Content */}
          <div className="flex flex-col items-center my-auto">
            {isRevealed ? (
              isImposter ? (
                <div className="animate-fade-in flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center mb-3">
                    <ShieldAlert className="w-9 h-9 text-rose-400 animate-pulse" />
                  </div>
                  <h3 className="text-rose-400 font-extrabold text-2xl tracking-wider uppercase">
                    YOU ARE THE BULLSHITTER!
                  </h3>
                  {localPlayer.word && localPlayer.word.includes('???') ? (
                    <p className="text-xs text-slate-400 mt-2 max-w-[200px]">
                      You don't know the secret word. Bluff and blend in!
                    </p>
                  ) : (
                    <div className="mt-2">
                      <span className="text-[11px] text-slate-400 uppercase tracking-widest block">Your Undercover Word:</span>
                      <span className="text-xl font-black text-rose-200">{localPlayer.word}</span>
                    </div>
                  )}

                  {localPlayer.hint && (
                    <div className="mt-3 px-3 py-1 rounded-lg bg-rose-900/40 border border-rose-700/50 text-[11px] text-rose-300">
                      💡 Hint: {localPlayer.hint}
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-fade-in flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mb-3">
                    <Sparkles className="w-8 h-8 text-indigo-400" />
                  </div>
                  <span className="text-xs text-indigo-300 uppercase font-semibold tracking-widest">
                    Secret Word
                  </span>
                  <h3 className="text-3xl font-black text-white mt-1 mb-2 tracking-wide">
                    {localPlayer.word}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Give one-word clues to prove you know it!
                  </span>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <div className="text-4xl mb-2">{localPlayer.avatar}</div>
                <p className="text-base font-bold text-slate-200">{localPlayer.name}</p>
                <p className="text-xs text-slate-500 mt-1">Tap this card to view your role</p>
              </div>
            )}
          </div>

          {/* Card Bottom Hint */}
          <div className="text-[11px] text-slate-500 font-medium">
            {isRevealed ? 'Remember your word & tap I am Ready' : 'Confidential'}
          </div>
        </div>

        {/* Players ready counter */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Users className="w-4 h-4 text-indigo-400" />
          <span>{viewedCount} of {totalPlayers} players ready</span>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col gap-2">
        {!localPlayer.hasViewedCard ? (
          <button
            onClick={handleAcknowledge}
            disabled={!isRevealed}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 border ${
              isRevealed
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-white/20 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-800/60 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>I AM READY</span>
          </button>
        ) : (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>You're ready! Waiting for all players...</span>
          </div>
        )}

        {isHost && (
          <button
            onClick={onAdvanceToClues}
            className="text-xs text-slate-500 hover:text-indigo-300 py-1"
          >
            (Host: Force Start Clues)
          </button>
        )}
      </div>
    </div>
  );
};
