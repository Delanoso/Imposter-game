import { useState } from 'react';
import { 
  RotateCcw, 
  Home, 
  Sparkles, 
  Award
} from 'lucide-react';
import type { MultiplayerRoomState, RoomPlayer } from '../types/multiplayer';

interface MultiplayerResultsScreenProps {
  roomState: MultiplayerRoomState;
  localPlayer: RoomPlayer;
  isHost: boolean;
  onPlayNextRound: () => void;
  onLeaveRoom: () => void;
  onImposterGuess: (guess: string) => void;
}

export const MultiplayerResultsScreen = ({
  roomState,
  localPlayer,
  isHost,
  onPlayNextRound,
  onLeaveRoom,
  onImposterGuess,
}: MultiplayerResultsScreenProps) => {
  const [guessInput, setGuessInput] = useState('');

  const isImposter = localPlayer.role === 'imposter';
  const eliminatedPlayer = roomState.players.find(p => p.id === roomState.eliminatedPlayerId);
  const isImposterCaught = eliminatedPlayer && eliminatedPlayer.role === 'imposter';
  const civiliansWin = roomState.winner === 'civilians';

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-6 pb-28">
      {/* Outcome Banner */}
      <div className={`p-6 rounded-3xl border-2 text-center shadow-2xl relative overflow-hidden mb-6 ${
        civiliansWin
          ? 'bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 border-indigo-500/80 shadow-indigo-950/60'
          : 'bg-gradient-to-b from-rose-950 via-slate-900 to-rose-950 border-rose-500/80 shadow-rose-950/60'
      }`}>
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center text-3xl mb-3 shadow-inner">
          {civiliansWin ? '🎉' : '😈'}
        </div>

        <h2 className="text-2xl font-black text-white tracking-wide uppercase">
          {civiliansWin ? 'CIVILIANS WIN!' : 'IMPOSTER WINS!'}
        </h2>
        
        <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
          {civiliansWin 
            ? 'The group successfully caught the imposter!'
            : isImposterCaught
            ? 'The imposter guessed the secret word and stole victory!'
            : 'The imposter deceived everyone and got away with it!'}
        </p>

        {/* Secret Word Reveal Box */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Secret Word Was:
          </span>
          <span className="text-2xl font-extrabold text-amber-300 mt-0.5">
            "{roomState.civilianWord}"
          </span>
          <span className="text-[11px] text-slate-400 mt-1">
            Category: {roomState.categoryName}
          </span>
        </div>
      </div>

      {/* Role Reveal Breakdown */}
      <div className="flex flex-col gap-2 mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-indigo-400" />
          Players & Revealed Roles
        </h3>

        <div className="flex flex-col gap-2">
          {roomState.players.map((p) => {
            const isImp = p.role === 'imposter';
            const isConf = p.role === 'confused';
            const isElim = p.id === roomState.eliminatedPlayerId;
            const isMe = p.id === localPlayer.id;

            return (
              <div
                key={p.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                  isImp
                    ? 'bg-rose-950/40 border-rose-700/60'
                    : isConf
                    ? 'bg-purple-950/40 border-purple-700/60'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.avatar}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white">{p.name}</span>
                      {isMe && (
                        <span className="text-[10px] bg-indigo-600/60 text-indigo-200 px-1.5 py-0.2 rounded font-semibold">
                          You
                        </span>
                      )}
                      {isElim && (
                        <span className="text-[10px] bg-rose-600/80 text-white font-bold px-1.5 py-0.2 rounded">
                          Eliminated
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${
                      isImp ? 'text-rose-400' : isConf ? 'text-purple-400' : 'text-slate-400'
                    }`}>
                      {isImp ? '😈 Imposter' : isConf ? '😵 Confused Innocent' : '🛡️ Civilian'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400 block font-mono">
                    {p.score} pts
                  </span>
                  {p.votesReceived !== undefined && p.votesReceived > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {p.votesReceived} vote{p.votesReceived > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Imposter Bonus Guessing (for caught imposter on their phone) */}
      {isImposter && isImposterCaught && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Your Redemption Chance
            </h4>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Guess the exact civilian secret word to flip the victory!
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter secret word guess..."
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={() => {
                if (guessInput.trim()) {
                  onImposterGuess(guessInput.trim());
                  setGuessInput('');
                }
              }}
              disabled={!guessInput.trim()}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition"
            >
              Guess
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Buttons */}
      <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4 flex flex-col gap-2">
        {isHost ? (
          <button
            onClick={onPlayNextRound}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-extrabold text-base shadow-xl shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 border border-white/20"
          >
            <RotateCcw className="w-5 h-5" />
            <span>START NEXT ROUND (HOST)</span>
          </button>
        ) : (
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center text-xs text-slate-300">
            Waiting for Host to start the next round...
          </div>
        )}

        <button
          onClick={onLeaveRoom}
          className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-700 transition flex items-center justify-center gap-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Exit to Main Menu</span>
        </button>
      </div>
    </div>
  );
};
