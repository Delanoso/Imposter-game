import { 
  Vote, 
  Check, 
  SkipForward, 
  Lock,
  ArrowRight
} from 'lucide-react';
import type { Player } from '../types/game';
import { soundFx } from '../utils/audio';
import { useState } from 'react';

interface VotingScreenProps {
  players: Player[];
  currentVoterIndex: number;
  selectedTargetId: string | null;
  onSelectTarget: (id: string) => void;
  onSubmitVote: (targetId: string) => void;
  onSkipToGroupDecision: (eliminatedId: string | null) => void;
}

export const VotingScreen = ({
  players,
  currentVoterIndex,
  selectedTargetId,
  onSelectTarget,
  onSubmitVote,
  onSkipToGroupDecision,
}: VotingScreenProps) => {
  const [useManualDiscussion, setUseManualDiscussion] = useState(false);
  const [manualEliminatedId, setManualEliminatedId] = useState<string | null>(null);

  const currentVoter = players[currentVoterIndex];
  const eligibleTargets = players.filter(p => p.id !== currentVoter?.id);

  if (useManualDiscussion) {
    return (
      <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Group Consensus</h2>
          <button
            onClick={() => setUseManualDiscussion(false)}
            className="text-xs text-indigo-400 font-semibold hover:underline"
          >
            Switch to Secret Voting
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Did the group point and agree on who they want to eliminate? Select the suspect below:
        </p>

        <div className="flex flex-col gap-2 mb-6">
          {players.map((p) => {
            const isSelected = manualEliminatedId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  soundFx.playClick();
                  setManualEliminatedId(isSelected ? null : p.id);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-rose-950/60 border-rose-500 text-white shadow-lg shadow-rose-950/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.avatar}</span>
                  <span className="font-bold text-sm">{p.name}</span>
                </div>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                  isSelected ? 'bg-rose-600 border-rose-400 text-white' : 'border-slate-700 bg-slate-900'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4 flex flex-col gap-2">
          <button
            onClick={() => onSkipToGroupDecision(manualEliminatedId)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-rose-600/30 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 border border-white/20"
          >
            <span>{manualEliminatedId ? 'Eliminate Selected Suspect' : 'No Consensus (Skip Elimination)'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Vote className="w-5 h-5 text-rose-400" />
          <h2 className="text-lg font-bold text-white">Secret In-App Vote</h2>
        </div>
        <button
          onClick={() => setUseManualDiscussion(true)}
          className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 font-medium bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span>Quick Vote</span>
        </button>
      </div>

      {/* Pass phone banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-1 bg-slate-800 rounded-xl">{currentVoter?.avatar}</span>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Voter {currentVoterIndex + 1} of {players.length}
            </div>
            <div className="text-lg font-extrabold text-white">{currentVoter?.name}'s Turn</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2 py-1 rounded-lg">
          <Lock className="w-3.5 h-3.5" />
          <span>Private</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-3 px-1">
        Who do you suspect is the Imposter? (Your vote is kept secret until results):
      </p>

      {/* Target Candidates List */}
      <div className="flex flex-col gap-2.5 mb-4 max-h-72 overflow-y-auto pr-1">
        {eligibleTargets.map((candidate) => {
          const isSelected = selectedTargetId === candidate.id;
          return (
            <div
              key={candidate.id}
              onClick={() => {
                soundFx.playClick();
                onSelectTarget(candidate.id);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-gradient-to-r from-rose-950/80 to-slate-900 border-rose-500 shadow-lg shadow-rose-950/50'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{candidate.avatar}</span>
                <span className="font-bold text-sm text-slate-200">{candidate.name}</span>
              </div>

              <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                isSelected ? 'bg-rose-600 border-rose-400 text-white shadow-sm' : 'border-slate-700 bg-slate-900'
              }`}>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Action */}
      <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4">
        <button
          onClick={() => {
            if (selectedTargetId) {
              onSubmitVote(selectedTargetId);
            }
          }}
          disabled={!selectedTargetId}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 border ${
            selectedTargetId
              ? 'bg-gradient-to-r from-rose-600 to-purple-600 border-white/20 text-white shadow-xl shadow-rose-600/30 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-slate-800/50 border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <span>Submit Vote & Pass Phone</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
