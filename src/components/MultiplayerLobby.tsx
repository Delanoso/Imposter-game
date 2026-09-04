import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Share2, 
  Users, 
  Sparkles, 
  ShieldAlert, 
  QrCode, 
  Play, 
  Crown,
  Settings
} from 'lucide-react';
import QRCode from 'qrcode';
import type { MultiplayerRoomState } from '../types/multiplayer';

interface MultiplayerLobbyProps {
  roomState: MultiplayerRoomState;
  localPlayerId: string;
  isHost: boolean;
  onUpdateSettings: (settings: Partial<MultiplayerRoomState['settings']>) => void;
  onToggleReady: (ready: boolean) => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

export const MultiplayerLobby = ({
  roomState,
  localPlayerId,
  isHost,
  onUpdateSettings,
  onStartGame,
  onLeaveRoom,
}: MultiplayerLobbyProps) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const joinUrl = `${window.location.origin}/?room=${roomState.roomCode}`;

  // Generate QR Code
  useEffect(() => {
    QRCode.toDataURL(joinUrl, { width: 240, margin: 2, color: { dark: '#000000', light: '#ffffff' } })
      .then(url => setQrDataUrl(url))
      .catch(() => {});
  }, [joinUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Bullshitter Game!',
          text: `Join our Bullshitter party room! Room Code: ${roomState.roomCode}`,
          url: joinUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const canStart = roomState.players.length >= 3;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-5 pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onLeaveRoom}
          className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-700/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-indigo-200">Online Room</span>
        </div>

        {isHost ? (
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition active:scale-90"
          >
            <Settings className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-9" />
        )}
      </div>

      {/* Room Code & Invite Card */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col items-center text-center relative overflow-hidden mb-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
          Room Invite Code
        </div>
        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 tracking-widest my-1 font-mono">
          {roomState.roomCode}
        </div>

        <p className="text-xs text-slate-400 max-w-xs mt-1 mb-4">
          Share this code or link with friends to join on their own phones!
        </p>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2.5 w-full">
          <button
            onClick={handleShare}
            className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Link</span>
          </button>

          <button
            onClick={() => setShowQrModal(true)}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95"
          >
            <QrCode className="w-4 h-4 text-purple-400" />
            <span>Show QR</span>
          </button>
        </div>

        {copied && (
          <div className="mt-2 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Link copied to clipboard!</span>
          </div>
        )}
      </div>

      {/* Players in Lobby */}
      <div className="flex flex-col gap-2 mb-4 flex-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-400" />
            Players ({roomState.players.length})
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Min 3 players to start
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
          {roomState.players.map((p) => {
            const isMe = p.id === localPlayerId;
            return (
              <div
                key={p.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                  isMe
                    ? 'bg-indigo-950/40 border-indigo-500/70'
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
                      {p.isHost && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 text-amber-400" />
                          Host
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Score: {p.score} pts</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-300 font-medium">Connected</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules Summary Card */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-col gap-1.5 mb-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Mode: <strong className="text-white capitalize">{roomState.settings.gameMode}</strong>
          </span>
          <span className="text-rose-400 font-semibold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            {roomState.settings.imposterCount} Bullshitter{roomState.settings.imposterCount > 1 ? 's' : ''}
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Timer: {roomState.settings.discussionTimeSeconds === 0 ? 'Untimed' : `${roomState.settings.discussionTimeSeconds}s`} | {roomState.settings.selectedCategoryIds.length} categories active
        </div>
      </div>

      {/* Host / Player Bottom Action */}
      <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4">
        {isHost ? (
          <button
            onClick={onStartGame}
            disabled={!canStart}
            className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all flex items-center justify-center gap-2 border ${
              canStart
                ? 'bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-600/40 border-white/20 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-800/60 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{canStart ? 'START MULTIPLAYER MATCH' : `WAITING FOR ${3 - roomState.players.length} MORE PLAYER(S)`}</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Waiting for Host ({roomState.players.find(p => p.isHost)?.name || 'Host'}) to start the round...</span>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xs w-full flex flex-col items-center text-center shadow-2xl">
            <h3 className="font-extrabold text-white text-base mb-1">Scan to Join Room</h3>
            <p className="text-xs text-slate-400 mb-4">Point your phone camera at this QR code</p>

            {qrDataUrl && (
              <img src={qrDataUrl} alt="Room QR Code" className="w-52 h-52 rounded-2xl bg-white p-2 shadow-lg mb-4" />
            )}

            <div className="text-xs font-mono font-bold text-amber-400 mb-4 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              Code: {roomState.roomCode}
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Host Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-sm w-full flex flex-col gap-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Host Room Settings</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Bullshitter count */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Number of Bullshitters</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(num => (
                  <button
                    key={num}
                    onClick={() => onUpdateSettings({ imposterCount: num })}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      roomState.settings.imposterCount === num
                        ? 'bg-rose-600 border-rose-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {num} Bullshitter{num > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Game mode */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Game Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateSettings({ gameMode: 'classic' })}
                  className={`p-2.5 rounded-xl text-left border text-xs font-bold transition ${
                    roomState.settings.gameMode === 'classic'
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <div>Classic</div>
                  <div className="text-[10px] font-normal opacity-80">Bullshitter gets ???</div>
                </button>
                <button
                  onClick={() => onUpdateSettings({ gameMode: 'undercover' })}
                  className={`p-2.5 rounded-xl text-left border text-xs font-bold transition ${
                    roomState.settings.gameMode === 'undercover'
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <div>Undercover</div>
                  <div className="text-[10px] font-normal opacity-80">Similar word</div>
                </button>
              </div>
            </div>

            {/* Timer */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Discussion Timer</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: '30s', val: 30 },
                  { label: '60s', val: 60 },
                  { label: '90s', val: 90 },
                  { label: 'Off', val: 0 }
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => onUpdateSettings({ discussionTimeSeconds: item.val })}
                    className={`py-1.5 rounded-lg text-xs font-bold transition border ${
                      roomState.settings.discussionTimeSeconds === item.val
                        ? 'bg-cyan-600 border-cyan-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Bullshitter Hints</span>
                <input
                  type="checkbox"
                  checked={roomState.settings.enableHints}
                  onChange={(e) => onUpdateSettings({ enableHints: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Confused Role</span>
                <input
                  type="checkbox"
                  checked={roomState.settings.enableConfusedRole}
                  onChange={(e) => onUpdateSettings({ enableConfusedRole: e.target.checked })}
                  className="w-4 h-4 accent-purple-600"
                />
              </label>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs mt-2"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
