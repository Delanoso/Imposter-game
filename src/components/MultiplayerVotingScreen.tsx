import { useState } from 'react';
import { 
  Vote, 
  Check, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import type { MultiplayerRoomState, RoomPlayer } from '../types/multiplayer';

interface MultiplayerVotingScreenProps {
  roomState: MultiplayerRoomState;
  localPlayer: RoomPlayer;
  isHost: boolean;
  selectedTargetId: string | null;
  onSelectTarget: (id: string) => void;
  onSubmitVote: (targetId: string) => void;
  onSubmitGroupDecision: (eliminatedId: string | null) => void;
}

export const MultiplayerVotingScreen = ({
  roomState,
  localPlayer,
  isHost,
  selectedTargetId,
  onSelectTarget,
  onSubmitVote,
  onSubmitGroupDecision,
}: MultiplayerVotingScreenProps) => {
  const [useGroupConsensus, setUseGroupConsensus] = useState(false);
  const [manualEliminatedId, setManualEliminatedId] = useState<string | null>(null);

  const hasVoted = Boolean(roomState.votes[localPlayer.id]);
  const eligibleTargets = roomState.players.filter(p => p.id !== localPlayer.id);

  const totalVotedCount = Object.keys(roomState.votes).length;
  const totalPlayers = roomState.players.length;

  if (useGroupConsensus && isHost) {
    return (
      <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Group Consensus (Host)</h2>
          <button
            onClick={() => setUseGroupConsensus(false)}
            className="text-xs text-indigo-400 font-semibold hover:underline"
          >
            Back to Live Voting
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Did your group discuss and point at a suspect together in person? Select them to eliminate:
        </p>

        <div className="flex flex-col gap-2 mb-6">
          {roomState.players.map((p) => {
            const isSelected = manualEliminatedId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setManualEliminatedId(isSelected ? null : p.id)}
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
            onClick={() => onSubmitGroupDecision(manualEliminatedId)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-rose-600/30 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 border border-white/20"
          >
            <span>{manualEliminatedId ? 'Eliminate Selected Player' : 'No Consensus (Skip Elimination)'}</span>
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
          <h2 className="text-lg font-bold text-white">Live Secret Vote</h2>
        </div>
        {isHost && (
          <button
            onClick={() => setUseGroupConsensus(true)}
            className="text-xs text-slate-400 hover:text-indigo-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 font-medium"
          >
            Host Consensus
          </button>
        )}
      </div>

      {/* Progress status */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-1 bg-slate-800 rounded-xl">{localPlayer.avatar}</span>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Your Ballot
            </div>
            <div className="text-base font-extrabold text-white">
              {hasVoted ? 'Vote Submitted' : 'Choose Your Suspect'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-indigo-400 font-mono">
            {totalVotedCount} / {totalPlayers}
          </div>
          <div className="text-[10px] text-slate-500">Votes In</div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-3 px-1">
        {hasVoted 
          ? 'Waiting for remaining players to submit their votes...' 
          : 'Tap the player you believe is the Imposter:'}
      </p>

      {/* Target Candidates List */}
      <div className="flex flex-col gap-2.5 mb-4 max-h-72 overflow-y-auto pr-1">
        {eligibleTargets.map((candidate) => {
          const isSelected = selectedTargetId === candidate.id;
          return (
            <div
              key={candidate.id}
              onClick={() => {
                if (!hasVoted) onSelectTarget(candidate.id);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-gradient-to-r from-rose-950/80 to-slate-900 border-rose-500 shadow-lg shadow-rose-950/50'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              } ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        {!hasVoted ? (
          <button
            onClick={() => {
              if (selectedTargetId) onSubmitVote(selectedTargetId);
            }}
            disabled={!selectedTargetId}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 border ${
              selectedTargetId
                ? 'bg-gradient-to-r from-rose-600 to-purple-600 border-white/20 text-white shadow-xl shadow-rose-600/30 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-800/50 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>CONFIRM SECRET VOTE</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 text-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Vote recorded! Waiting for others ({totalVotedCount}/{totalPlayers})...</span>
          </div>
        )}
      </div>
    </div>
  );
};
