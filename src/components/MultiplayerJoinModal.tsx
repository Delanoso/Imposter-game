import { useState } from 'react';
import { Globe, Plus } from 'lucide-react';

interface MultiplayerJoinModalProps {
  initialRoomCode?: string;
  onJoin: (roomCode: string, name: string, avatar: string) => void;
  onCreate: (name: string, avatar: string) => void;
  onClose: () => void;
}

const AVATARS = ['🦊', '🐼', '🐯', '🦁', '🐸', '🐨', '🐙', '🦄', '🦉', '🐺', '🐱', '🐶', '🐵', '🦖', '🚀', '⭐', '🔥', '👑'];

export const MultiplayerJoinModal = ({
  initialRoomCode = '',
  onJoin,
  onCreate,
  onClose,
}: MultiplayerJoinModalProps) => {
  const [tab, setTab] = useState<'join' | 'create'>(initialRoomCode ? 'join' : 'create');
  const [roomCode, setRoomCode] = useState(initialRoomCode.toUpperCase());
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦊');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    onJoin(roomCode.trim().toUpperCase(), name.trim() || 'Player', avatar);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(name.trim() || 'Host', avatar);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-white text-lg">Online Multiplayer</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setTab('join')}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              tab === 'join' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Join Room
          </button>
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              tab === 'create' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Room
          </button>
        </div>

        {/* Profile customization */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Choose Avatar</label>
          <div className="grid grid-cols-6 gap-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800">
            {AVATARS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setAvatar(emoji)}
                className={`text-2xl p-1.5 rounded-lg text-center transition ${
                  avatar === emoji ? 'bg-indigo-600 scale-110 shadow' : 'hover:bg-slate-800 opacity-80'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {tab === 'join' ? (
          <form onSubmit={handleJoin} className="flex flex-col gap-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">4-Letter Room Code</label>
              <input
                type="text"
                placeholder="e.g. ABCD"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-3 text-center text-2xl font-mono tracking-widest uppercase text-white focus:outline-none focus:border-indigo-500 font-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!roomCode.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-40 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition border border-white/20"
            >
              JOIN MATCH
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition border border-white/20 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>CREATE NEW ROOM</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
