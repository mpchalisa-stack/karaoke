import React from 'react';
import { Flame, Sun, Radio, Music, Disc, Sparkles, Radar, Rocket, Shield } from 'lucide-react';
import { CATEGORY_PRESETS } from '../services/youtube';
import { useKaraoke } from '../context/KaraokeContext';

const ICON_MAP: Record<string, React.ReactNode> = {
  Flame: <Flame className="h-3.5 w-3.5" />,
  Sun: <Sun className="h-3.5 w-3.5" />,
  Radio: <Radio className="h-3.5 w-3.5" />,
  Music: <Music className="h-3.5 w-3.5" />,
  Disc: <Disc className="h-3.5 w-3.5" />,
  Sparkles: <Sparkles className="h-3.5 w-3.5" />,
};

export const CategoryChips: React.FC = () => {
  const { executeSearch, activeCategory, setSearchQuery } = useKaraoke();

  const handleChipClick = (id: string, query: string) => {
    setSearchQuery(query);
    executeSearch(query, id);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-400/90 flex items-center gap-1.5">
          <Radar className="h-3.5 w-3.5 text-sky-400 animate-spin [animation-duration:12s]" />
          <span>Sektor Musik & Rekomendasi Radar Pangkalan:</span>
        </span>
        <span className="text-[11px] text-sky-400/60">Pilih genre lagu siap tempur</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        {CATEGORY_PRESETS.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleChipClick(cat.id, cat.query)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'border-sky-400 bg-gradient-to-r from-sky-600/40 to-blue-700/40 text-sky-100 shadow-md shadow-sky-500/30 scale-[1.02]'
                  : 'border-sky-900/70 bg-[#091838] text-slate-300 hover:border-sky-500 hover:bg-[#0c204c] hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-sky-300' : 'text-sky-400/70'}>
                {ICON_MAP[cat.iconName] || <Music className="h-3.5 w-3.5" />}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
