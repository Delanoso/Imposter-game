import { useState } from 'react';
import { Download, Share2, Smartphone, Check, X } from 'lucide-react';

interface InstallAppModalProps {
  onClose: () => void;
}

export const InstallAppModal = ({ onClose }: InstallAppModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-white text-lg">Install / Download Free</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          This app is built as a <strong>Progressive Web App (PWA)</strong>. Anyone can install it directly to their home screen on iPhone and Android without App Store fees or downloads!
        </p>

        {/* iOS Safari Instructions */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>iPhone (Safari)</span>
          </div>
          <ol className="text-xs text-slate-400 list-decimal list-inside flex flex-col gap-1.5 pl-1">
            <li>Open this link in <strong>Safari</strong> on your iPhone.</li>
            <li>Tap the <strong>Share</strong> icon (square with arrow up at the bottom).</li>
            <li>Scroll down and tap <strong>"Add to Home Screen"</strong> (➕).</li>
            <li>Tap <strong>Add</strong> in the top-right corner.</li>
          </ol>
        </div>

        {/* Android Chrome Instructions */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Android (Chrome)</span>
          </div>
          <ol className="text-xs text-slate-400 list-decimal list-inside flex flex-col gap-1.5 pl-1">
            <li>Open this link in <strong>Chrome</strong>.</li>
            <li>Tap the <strong>Three Dots (⋮)</strong> in the top right.</li>
            <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.</li>
          </ol>
        </div>

        {/* Share Link Button */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied to Clipboard!' : 'Copy App URL to Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
