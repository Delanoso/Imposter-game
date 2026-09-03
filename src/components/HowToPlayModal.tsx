import { X, Sparkles, AlertTriangle } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal = ({ onClose }: HowToPlayModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-5 max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-lg tracking-wide">HOW TO PLAY IMPOSTER</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-4 text-sm text-slate-300">
          {/* Step 1 */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center font-bold text-indigo-300 flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-0.5">Pass the Phone & View Secret Roles</h4>
              <p className="text-xs text-slate-400">
                Each player secretly peeks at their card. Everyone sees the exact same secret word — except the <strong className="text-rose-400">Imposter</strong>!
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center font-bold text-purple-300 flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-0.5">Give One-Word Clues in Order</h4>
              <p className="text-xs text-slate-400">
                In speaking order, each player says exactly <strong className="text-white">ONE WORD</strong> related to the secret word.
              </p>
              <div className="mt-1.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold">Example (Word is "Pizza"):</span> "Cheese", "Crust", "Italian", "Slice".
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center font-bold text-rose-300 flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-0.5">Debate & Vote</h4>
              <p className="text-xs text-slate-400">
                When the timer expires, vote for who you think is faking and bluffing! You can use in-app private voting or point together.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center font-bold text-amber-300 flex-shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-0.5">Scoring & Word Guessing</h4>
              <p className="text-xs text-slate-400">
                • <strong>Civilians win (+2 pts)</strong> if the imposter is unmasked.<br/>
                • <strong>Imposter wins (+3 pts)</strong> if they evade detection.<br/>
                • If caught, the imposter can attempt to guess the secret word for a redemption win!
              </p>
            </div>
          </div>
        </div>

        {/* Important Rules */}
        <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-600/30 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <strong>Golden Rule:</strong> Only single words allowed for clues. No sentences, no spelling hints, and no saying the secret word directly!
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
        >
          Got It, Let's Play!
        </button>
      </div>
    </div>
  );
};
