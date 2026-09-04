import { 
  Play, 
  Settings, 
  HelpCircle, 
  Trophy, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  UserPlus, 
  Flame,
  Globe,
  Download
} from 'lucide-react';
import type { GameScreen, GameSettings } from '../types/game';

interface HomeScreenProps {
  onNavigate: (screen: GameScreen) => void;
  onStartQuickGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenMultiplayer: () => void;
  onOpenInstallModal: () => void;
  settings: GameSettings;
  playerCount: number;
}

export const HomeScreen = ({
  onNavigate,
  onStartQuickGame,
  onOpenHowToPlay,
  onOpenMultiplayer,
  onOpenInstallModal,
  settings,
  playerCount,
}: HomeScreenProps) => {
  return (
    <div className="flex flex-col min-h-[90vh] max-w-md mx-auto justify-between px-4 py-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => onNavigate('leaderboard')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-amber-400 font-medium text-sm hover:bg-slate-700/80 transition active:scale-95 shadow-sm"
        >
          <Trophy className="w-4 h-4" />
          <span>Scores</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-indigo-300 font-medium text-sm hover:bg-slate-700/80 transition active:scale-95 shadow-sm"
            title="Install App"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Install</span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 font-medium text-sm hover:bg-slate-700/80 transition active:scale-95 shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Rules</span>
          </button>
        </div>
      </div>

      {/* Hero Branding */}
      <div className="flex flex-col items-center text-center my-auto py-6">
        <div className="relative mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-500 flex items-center justify-center shadow-2xl shadow-purple-500/25 animate-float border-2 border-white/10">
            <ShieldAlert className="w-14 h-14 sm:w-16 sm:h-16 text-white drop-shadow-md" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-lg border-2 border-slate-900 flex items-center gap-1">
            <Flame className="w-3 h-3 fill-current" />
            PARTY
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent my-1">
          BULLSHITTER
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xs mt-1 font-medium">
          Everyone knows the secret word, except one of you. Can you find the Bullshitter?
        </p>

        {/* Quick status badge */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/40 text-indigo-300 text-xs font-semibold flex items-center gap-1">
            <UserPlus className="w-3 h-3" />
            {playerCount} Players
          </span>
          <span className="px-3 py-1 rounded-full bg-rose-950/60 border border-rose-700/40 text-rose-300 text-xs font-semibold flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            {settings.imposterCount} Bullshitter{settings.imposterCount > 1 ? 's' : ''}
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-700/40 text-purple-300 text-xs font-semibold capitalize flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {settings.gameMode} Mode
          </span>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col gap-3 w-full">
        {/* Pass & Play */}
        <button
          onClick={onStartQuickGame}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-bold text-lg shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-white/20"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>PASS & PLAY (1 PHONE)</span>
        </button>

        {/* Online Multiplayer with Link/QR */}
        <button
          onClick={onOpenMultiplayer}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-900/90 via-slate-800 to-indigo-950/90 hover:border-indigo-500/80 text-white font-bold text-base shadow-lg border border-indigo-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
        >
          <Globe className="w-5 h-5 text-indigo-400" />
          <span>MULTIPLAYER (INVITE VIA LINK)</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('setup')}
            className="py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-white font-semibold text-sm transition active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
          >
            <Settings className="w-4 h-4 text-slate-300" />
            <span>Players & Rules</span>
          </button>

          <button
            onClick={() => onNavigate('category-select')}
            className="py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-white font-semibold text-sm transition active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Word Packs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
