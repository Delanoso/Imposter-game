import { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  ShieldAlert, 
  Clock, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Sparkles, 
  Play, 
  Plus, 
  Minus,
  Edit2,
  Check
} from 'lucide-react';
import type { GameSettings, Player } from '../types/game';

interface SetupScreenProps {
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  players: Player[];
  onSetPlayerCount: (count: number) => void;
  onUpdatePlayerName: (id: string, name: string) => void;
  onUpdatePlayerAvatar: (id: string, avatar: string) => void;
  onBack: () => void;
  onStartGame: () => void;
}

const AVATAR_OPTIONS = ['🦊', '🐼', '🐯', '🦁', '🐸', '🐨', '🐙', '🦄', '🦉', '🐺', '🐱', '🐶', '🐵', '🦖', '🚀', '⭐', '🔥', '👑'];

export const SetupScreen = ({
  settings,
  onUpdateSettings,
  players,
  onSetPlayerCount,
  onUpdatePlayerName,
  onUpdatePlayerAvatar,
  onBack,
  onStartGame
}: SetupScreenProps) => {
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [showAvatarPickerForId, setShowAvatarPickerForId] = useState<string | null>(null);

  const startRename = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditingName(player.name);
  };

  const saveRename = (id: string) => {
    if (editingName.trim()) {
      onUpdatePlayerName(id, editingName.trim());
    }
    setEditingPlayerId(null);
  };

  const maxImposters = Math.max(1, Math.floor((settings.playerCount - 1) / 2));

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white tracking-wide">Game Setup</h2>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <div className="flex flex-col gap-5">
        {/* Player Count Selector */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span className="font-semibold text-white">Players</span>
            </div>
            <span className="text-xl font-extrabold text-indigo-300">{settings.playerCount}</span>
          </div>

          <div className="flex items-center justify-between gap-3 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <button
              onClick={() => onSetPlayerCount(Math.max(3, settings.playerCount - 1))}
              disabled={settings.playerCount <= 3}
              className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold disabled:opacity-30 active:scale-95 transition"
            >
              <Minus className="w-5 h-5" />
            </button>

            <div className="flex-1 flex justify-center gap-1.5 overflow-x-auto py-1">
              {[3, 4, 5, 6, 7, 8, 10, 12, 16].map(num => (
                <button
                  key={num}
                  onClick={() => onSetPlayerCount(num)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                    settings.playerCount === num 
                      ? 'bg-indigo-600 text-white shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={() => onSetPlayerCount(Math.min(20, settings.playerCount + 1))}
              disabled={settings.playerCount >= 20}
              className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold disabled:opacity-30 active:scale-95 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Players List Customization */}
          <div className="mt-4 flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
            {players.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-sm"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <button
                    onClick={() => setShowAvatarPickerForId(showAvatarPickerForId === p.id ? null : p.id)}
                    className="text-lg w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:scale-110 transition shrink-0"
                  >
                    {p.avatar}
                  </button>

                  {editingPlayerId === p.id ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="bg-slate-800 text-white px-2 py-1 rounded text-xs w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        autoFocus
                        maxLength={15}
                      />
                      <button
                        onClick={() => saveRename(p.id)}
                        className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="font-medium text-slate-200 truncate">
                      {p.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-2">
                  <span className="text-xs text-slate-500 font-mono">#{idx + 1}</span>
                  <button
                    onClick={() => startRename(p)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Avatar selector popup */}
          {showAvatarPickerForId && (
            <div className="mt-3 p-3 bg-slate-950 border border-slate-700 rounded-xl shadow-xl">
              <div className="text-xs text-slate-400 mb-2 font-medium">Select Avatar:</div>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onUpdatePlayerAvatar(showAvatarPickerForId, emoji);
                      setShowAvatarPickerForId(null);
                    }}
                    className="text-xl p-1.5 rounded-lg hover:bg-slate-800 active:scale-90 transition text-center"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Imposter Count */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span className="font-semibold text-white">Number of Imposters</span>
            </div>
            <span className="text-lg font-bold text-rose-300">{settings.imposterCount}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(num => {
              const disabled = num > maxImposters;
              const isSelected = settings.imposterCount === num;
              return (
                <button
                  key={num}
                  disabled={disabled}
                  onClick={() => onUpdateSettings({ imposterCount: num })}
                  className={`py-2 px-3 rounded-xl font-bold text-sm transition border flex flex-col items-center gap-0.5 ${
                    isSelected
                      ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-900/30'
                      : disabled
                      ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{num} {num === 1 ? 'Imposter' : 'Imposters'}</span>
                  {disabled && <span className="text-[10px] font-normal">Min {num * 2 + 1} players</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Game Mode */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-white">Game Mode</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateSettings({ gameMode: 'classic' })}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                settings.gameMode === 'classic'
                  ? 'bg-indigo-900/50 border-indigo-500 text-white'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="font-bold text-sm text-indigo-300">Classic</span>
              <span className="text-xs text-slate-400 mt-1">Imposter sees no word and must bluff blindly.</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ gameMode: 'undercover' })}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                settings.gameMode === 'undercover'
                  ? 'bg-purple-900/50 border-purple-500 text-white'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="font-bold text-sm text-purple-300">Undercover</span>
              <span className="text-xs text-slate-400 mt-1">Imposter gets a similar word (e.g. Pizza vs Burger).</span>
            </button>
          </div>

          {/* Optional Roles & Hints */}
          <div className="mt-4 pt-4 border-t border-slate-700/60 flex flex-col gap-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-sm font-medium text-slate-200">Helpful Hint for Imposter</div>
                <div className="text-xs text-slate-400">Gives imposter a broad category hint (e.g. "Fast food")</div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableHintsForImposter}
                onChange={(e) => onUpdateSettings({ enableHintsForImposter: e.target.checked })}
                className="w-5 h-5 rounded text-indigo-600 accent-indigo-600 bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-sm font-medium text-slate-200">Confused Innocent Role</div>
                <div className="text-xs text-slate-400">One innocent receives a 3rd secret word unknowingly!</div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableConfusedRole}
                onChange={(e) => onUpdateSettings({ enableConfusedRole: e.target.checked })}
                className="w-5 h-5 rounded text-purple-600 accent-purple-600 bg-slate-900 border-slate-700"
              />
            </label>
          </div>
        </div>

        {/* Discussion Timer */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold text-white">Discussion Timer</span>
            </div>
            <span className="text-sm font-bold text-cyan-300">
              {settings.discussionTimeSeconds === 0 ? 'Untimed' : `${settings.discussionTimeSeconds}s`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '30s', val: 30 },
              { label: '60s', val: 60 },
              { label: '90s', val: 90 },
              { label: 'Off', val: 0 }
            ].map(item => (
              <button
                key={item.label}
                onClick={() => onUpdateSettings({ discussionTimeSeconds: item.val })}
                className={`py-2 rounded-xl font-bold text-xs transition border ${
                  settings.discussionTimeSeconds === item.val
                    ? 'bg-cyan-600 border-cyan-400 text-white shadow-md'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sound & Haptics */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-around shadow-md">
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition ${
              settings.soundEnabled 
                ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Sound {settings.soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition ${
              settings.vibrationEnabled 
                ? 'bg-indigo-950/40 border-indigo-600 text-indigo-300' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Vibrate className="w-4 h-4" />
            <span>Haptics {settings.vibrationEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Floating Bottom Action */}
      <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4">
        <button
          onClick={onStartGame}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-extrabold text-lg shadow-xl shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/20"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>START ROUND</span>
        </button>
      </div>
    </div>
  );
};
