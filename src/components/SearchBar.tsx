import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Filter, Link as LinkIcon, Plus, Check, Radio } from 'lucide-react';
import { useKaraoke } from '../context/KaraokeContext';
import { SuffixFilter } from '../types/karaoke';
import { buildKaraokeQuery } from '../services/youtube';

export const SearchBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    suffixFilter,
    setSuffixFilter,
    executeSearch,
    isSearching,
    addDirectVideoUrl,
    defaultSingerName,
  } = useKaraoke();

  const [activeTab, setActiveTab] = useState<'search' | 'directLink'>('search');
  const [directUrl, setDirectUrl] = useState('');
  const [directSinger, setDirectSinger] = useState('');
  const [directSuccess, setDirectSuccess] = useState(false);
  const [directError, setDirectError] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeSearch();
    }
  };

  const handleDirectAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setDirectError('');
    if (!directUrl.trim()) return;

    const ok = await addDirectVideoUrl(directUrl.trim(), directSinger.trim() || defaultSingerName);
    if (ok) {
      setDirectSuccess(true);
      setDirectUrl('');
      setDirectSinger('');
      setTimeout(() => setDirectSuccess(false), 3000);
    } else {
      setDirectError('Format tautan atau Video ID tidak valid. Contoh: https://youtu.be/xxx atau nCbzF356088');
    }
  };

  const currentProcessedQuery = buildKaraokeQuery(searchQuery, suffixFilter);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border-2 border-sky-900/60 bg-[#07132c]/85 p-4 shadow-xl backdrop-blur-md">
      {/* Tabs: Radar Pencarian Lagu vs Tempel Tautan Radar */}
      <div className="flex items-center justify-between border-b border-sky-900/50 pb-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'search'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="h-3.5 w-3.5 text-sky-400" />
            <span>Radar Pencarian Lagu</span>
          </button>

          <button
            onClick={() => setActiveTab('directLink')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'directLink'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="h-3.5 w-3.5 text-sky-400" />
            <span>Tempel Tautan / ID Video</span>
          </button>
        </div>

        {/* Filter Suffix Badge */}
        {activeTab === 'search' && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-sky-300/80">
            <span className="text-[11px] text-sky-400/60">Filter Otomatis:</span>
            <span className="rounded bg-[#091838] px-2 py-0.5 font-mono text-[11px] text-sky-300 border border-sky-800">
              +{suffixFilter}
            </span>
          </div>
        )}
      </div>

      {activeTab === 'search' ? (
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search Input Box */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sky-400/80">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik judul lagu atau band (misal: November Rain, Pupus, Bob Marley)..."
                className="w-full rounded-xl border border-sky-900/80 bg-[#040b1a] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400 hover:text-white"
                >
                  Bersihkan
                </button>
              )}
            </div>

            {/* Suffix Filter Options */}
            <div className="flex items-center gap-1 bg-[#040b1a] border border-sky-900/80 rounded-xl p-1 shrink-0">
              {(['karaoke', 'no vocal', 'instrumental'] as SuffixFilter[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSuffixFilter(mode)}
                  className={`rounded-lg px-2.5 py-2 text-xs font-bold transition ${
                    suffixFilter === mode
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-sky-300/70 hover:bg-[#091838] hover:text-white'
                  }`}
                >
                  +{mode}
                </button>
              ))}
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-600/30 transition hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 border border-sky-400/40"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-sky-200" />
                  <span>Memindai...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Pindai Lagu</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Query Suffix Indicator */}
          {searchQuery.trim() && (
            <div className="flex items-center gap-1.5 text-[11px] text-sky-300/70 pl-1">
              <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
              <span>Target kueri pencarian:</span>
              <span className="font-mono text-sky-300 font-bold">"{currentProcessedQuery}"</span>
            </div>
          )}
        </form>
      ) : (
        /* Direct URL Paste Form */
        <form onSubmit={handleDirectAdd} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            placeholder="Tempel link YouTube (https://www.youtube.com/watch?v=... atau video ID)"
            className="flex-1 rounded-xl border border-sky-900/80 bg-[#040b1a] py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
          />

          <input
            type="text"
            value={directSinger}
            onChange={(e) => setDirectSinger(e.target.value)}
            placeholder={`Callsign (${defaultSingerName})`}
            className="w-full sm:w-44 rounded-xl border border-sky-900/80 bg-[#040b1a] py-3 px-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400"
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-600/30 transition hover:bg-sky-500 active:scale-98 shrink-0 border border-sky-400/40"
          >
            {directSuccess ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>Masuk Manifest!</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Tambah Antrean</span>
              </>
            )}
          </button>
        </form>
      )}

      {directError && <p className="text-xs text-rose-400 mt-1 font-semibold">{directError}</p>}
    </div>
  );
};
