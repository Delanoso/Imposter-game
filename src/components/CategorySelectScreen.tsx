import { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles
} from 'lucide-react';
import type { Category, WordPair } from '../data/wordCategories';

interface CategorySelectScreenProps {
  categories: Category[];
  selectedIds: string[];
  onToggleCategory: (id: string) => void;
  onSelectAll: () => void;
  onAddCustomCategory: (cat: Omit<Category, 'id' | 'isCustom'>) => void;
  onRemoveCustomCategory: (id: string) => void;
  onBack: () => void;
}

export const CategorySelectScreen = ({
  categories,
  selectedIds,
  onToggleCategory,
  onSelectAll,
  onAddCustomCategory,
  onRemoveCustomCategory,
  onBack,
}: CategorySelectScreenProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('📦');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [wordsText, setWordsText] = useState('');

  const handleCreatePack = () => {
    if (!newCatName.trim()) return;

    // Parse lines into pairs or word with imposter variant
    const lines = wordsText.split('\n').map(l => l.trim()).filter(Boolean);
    const parsedWords: WordPair[] = [];

    lines.forEach(line => {
      // Formats: "Civilian / Imposter" or "Word, AltWord" or single word
      if (line.includes('/')) {
        const parts = line.split('/').map(p => p.trim());
        parsedWords.push({ civilianWord: parts[0], imposterWord: parts[1] || parts[0] + '?' });
      } else if (line.includes(',')) {
        const parts = line.split(',').map(p => p.trim());
        parsedWords.push({ civilianWord: parts[0], imposterWord: parts[1] || parts[0] + '?' });
      } else {
        parsedWords.push({ civilianWord: line, imposterWord: line + ' (Alt)' });
      }
    });

    if (parsedWords.length === 0) {
      parsedWords.push(
        { civilianWord: 'Example Word 1', imposterWord: 'Example Word 2' },
        { civilianWord: 'Item Alpha', imposterWord: 'Item Beta' }
      );
    }

    onAddCustomCategory({
      name: newCatName.trim(),
      emoji: newCatEmoji || '📦',
      description: newCatDesc.trim() || `${parsedWords.length} custom words`,
      words: parsedWords
    });

    setNewCatName('');
    setNewCatDesc('');
    setWordsText('');
    setShowAddModal(false);
  };

  const allSelected = selectedIds.length === categories.length;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-5 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white">Word Packs</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 rounded-full bg-indigo-600/80 border border-indigo-500 text-white hover:bg-indigo-500 transition active:scale-90 shadow-sm"
          title="Create Custom Pack"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-semibold text-slate-400">
          {selectedIds.length} of {categories.length} selected
        </span>
        <button
          onClick={onSelectAll}
          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Category List */}
      <div className="flex flex-col gap-2.5">
        {categories.map((cat) => {
          const isSelected = selectedIds.includes(cat.id);
          return (
            <div
              key={cat.id}
              onClick={() => onToggleCategory(cat.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-gradient-to-r from-slate-800/90 to-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-950/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <span className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 flex-shrink-0">
                  {cat.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white truncate">{cat.name}</span>
                    {cat.isCustom && (
                      <span className="text-[10px] bg-purple-900/80 text-purple-300 border border-purple-700/50 px-1.5 py-0.2 rounded font-semibold">
                        Custom
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{cat.description}</p>
                  <span className="text-[11px] text-indigo-400/90 font-medium mt-1 inline-block">
                    {cat.words.length} words
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-2">
                {cat.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCustomCategory(cat.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Pack Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Create Custom Word Pack</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-2">
              <div className="w-16">
                <label className="text-xs font-semibold text-slate-400 block mb-1">Emoji</label>
                <input
                  type="text"
                  value={newCatEmoji}
                  onChange={(e) => setNewCatEmoji(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center text-xl text-white focus:outline-none focus:border-indigo-500"
                  maxLength={2}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-400 block mb-1">Pack Name</label>
                <input
                  type="text"
                  placeholder="e.g. Inside Jokes, Anime, Tech"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  maxLength={30}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Short Description</label>
              <input
                type="text"
                placeholder="Optional pack theme description"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                maxLength={60}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-400">Words (One per line)</label>
                <span className="text-[10px] text-slate-500">Format: Civilian / Imposter</span>
              </div>
              <textarea
                rows={5}
                placeholder={`Batman / Superman\nApple / Orange\nTokyo / Seoul`}
                value={wordsText}
                onChange={(e) => setWordsText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePack}
                disabled={!newCatName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 disabled:opacity-40 text-white font-bold text-sm hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
              >
                Save Pack
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
