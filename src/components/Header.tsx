import React, { useState } from 'react';
import {
  Radio,
  Tv,
  Smartphone,
  KeyRound,
  ListMusic,
  UserCheck,
  Shield,
  Radar,
  Rocket,
  Volume2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useKaraoke } from '../context/KaraokeContext';

export const Header: React.FC = () => {
  const {
    queue,
    apiKey,
    setIsApiKeyModalOpen,
    setIsRemoteModalOpen,
    remoteConnectedDevices,
    isTvMode,
    setIsTvMode,
    isQueueOpenMobile,
    setIsQueueOpenMobile,
    defaultSingerName,
    setDefaultSingerName,
    triggerSoundFx,
    roomId,
  } = useKaraoke();

  const [isEditingSinger, setIsEditingSinger] = useState(false);
  const [singerInput, setSingerInput] = useState(defaultSingerName);

  const handleSingerSave = () => {
    if (singerInput.trim()) {
      setDefaultSingerName(singerInput.trim());
    }
    setIsEditingSinger(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-sky-900/50 bg-[#07132c]/95 backdrop-blur-md px-3 sm:px-6 py-2.5 shadow-xl shadow-sky-950/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* Brand Logo & Military Insignia: Radar & Rudal (Missile) */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-700 to-indigo-950 shadow-xl shadow-sky-500/30 border-2 border-sky-400/50 shrink-0">
            {/* Tactical Radar sweep */}
            <Radar className="h-7 w-7 text-sky-300 animate-spin [animation-duration:8s]" />
            {/* Tactical Missile / Rudal */}
            <Rocket className="h-5 w-5 text-amber-400 absolute rotate-45 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-black shadow">
              ★
            </div>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
              <span className="font-display text-xs sm:text-sm font-extrabold tracking-widest text-sky-300/90 uppercase">
                KARAOKE
              </span>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(56,189,248,0.55)]">
                  DISKOMLEK<span className="text-sky-400">AU</span>
                </span>
                <span className="rounded bg-sky-900/80 px-2 py-0.5 text-[10px] sm:text-xs font-black text-sky-200 border border-sky-400/50 tracking-wider shadow-sm">
                  TNI AU
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-bold text-amber-400 italic tracking-wide mt-0.5">
              "Prajurit Yang Pantang Mundur Walau Suara Hancur"
            </p>
          </div>
        </div>

        {/* Singer / Callsign Quick Badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg bg-[#0b1c3e] px-3 py-1.5 border border-sky-900/80 shadow-inner">
          <Shield className="h-4 w-4 text-sky-400" />
          {isEditingSinger ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={singerInput}
                onChange={(e) => setSingerInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSingerSave()}
                className="w-36 rounded bg-[#061026] px-2 py-0.5 text-xs text-white outline-none border border-sky-500 focus:ring-1 focus:ring-sky-400"
                autoFocus
              />
              <button
                onClick={handleSingerSave}
                className="rounded bg-sky-600 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-sky-500"
              >
                Simpan
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setSingerInput(defaultSingerName);
                setIsEditingSinger(true);
              }}
              className="group flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
              title="Klik untuk mengganti callsign / nama prajurit"
            >
              <span className="text-sky-400/80 font-mono text-[11px]">CALLSIGN:</span>
              <span className="font-bold text-sky-200 group-hover:underline">
                {defaultSingerName}
              </span>
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Real-time Room Sync Badge (Tablet / Desktop / TV) */}
          <div className="hidden md:flex items-center gap-1.5 rounded-xl bg-[#07132c] px-2.5 py-1.5 border border-sky-700/80 text-[11px] font-mono shadow-inner">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-sky-300 font-bold">Sinkron TV:</span>
            <span className="text-amber-300 font-black">{roomId}</span>
          </div>

          {/* Fixed Room & Connected HP Badge (Zero Popups) */}
          <div className="flex items-center gap-1.5 rounded-xl border border-sky-500/50 bg-[#091b3e] px-2.5 py-1.5 text-xs font-mono shadow-md">
            <Smartphone className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-sky-300 font-bold hidden sm:inline">Room:</span>
            <span className="text-amber-300 font-black">{roomId}</span>
            <span className="flex items-center gap-1 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-emerald-300 border border-emerald-400/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              {remoteConnectedDevices} HP
            </span>
          </div>

          {/* Quick Sound FX Bar */}
          <div className="hidden xl:flex items-center gap-1 bg-[#091838] border border-sky-900/60 rounded-lg p-1">
            <button
              onClick={() => triggerSoundFx('applause')}
              className="rounded px-2 py-1 text-xs font-medium text-slate-200 hover:bg-sky-900/60 hover:text-sky-300 transition flex items-center gap-1"
              title="Tepuk Tangan Pasukan"
            >
              👏 <span className="text-[11px]">Tepuk</span>
            </button>
            <button
              onClick={() => triggerSoundFx('cheer')}
              className="rounded px-2 py-1 text-xs font-medium text-slate-200 hover:bg-sky-900/60 hover:text-sky-300 transition flex items-center gap-1"
              title="Sorak Komando"
            >
              🎉 <span className="text-[11px]">Sorak</span>
            </button>
            <button
              onClick={() => triggerSoundFx('airhorn')}
              className="rounded px-2 py-1 text-xs font-medium text-slate-200 hover:bg-sky-900/60 hover:text-sky-300 transition flex items-center gap-1"
              title="Sirine Pangkalan"
            >
              📢 <span className="text-[11px]">Sirine</span>
            </button>
            <button
              onClick={() => triggerSoundFx('boo')}
              className="rounded px-2 py-1 text-xs font-bold text-rose-300 hover:bg-rose-950/60 transition flex items-center gap-1"
              title="Sorak Huuu (Lucu)"
            >
              👎 <span className="text-[11px]">Huuu</span>
            </button>
          </div>

          {/* TV Stage Mode Button & Second Screen Launcher */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsTvMode(!isTvMode)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition shadow ${
                isTvMode
                  ? 'border-sky-400 bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'border-sky-900/70 bg-[#0a1a3a] text-slate-200 hover:border-sky-400 hover:bg-sky-900/40'
              }`}
              title="Tampilkan Layar Puskodal TV Penuh (ESC untuk kembali)"
            >
              <Tv className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">Layar TV</span>
            </button>
            <button
              onClick={() => window.open(`/?mode=tv&room=${encodeURIComponent(roomId)}`, '_blank')}
              className="hidden md:flex items-center justify-center h-8 w-8 rounded-xl border border-sky-800 bg-[#0a1a3a] text-sky-300 hover:bg-sky-600 hover:text-white transition shadow"
              title="Buka Layar TV di Tab Baru / Layar Kedua (HDMI / TV Proyektor)"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* YouTube API Key Modal Trigger */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-950/40 px-3 py-1.5 text-xs font-medium text-sky-300 hover:bg-sky-900/40 transition"
            title="Status Frekuensi Pencarian Live YouTube"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden md:inline">
              {apiKey ? 'API Khusus' : 'Radar Live Aktif'}
            </span>
            <span className="rounded bg-sky-400/20 px-1.5 py-0.2 text-[9px] font-bold text-sky-300 border border-sky-400/30">
              FREE
            </span>
          </button>

          {/* Mobile Queue Toggle Drawer Trigger */}
          <button
            onClick={() => setIsQueueOpenMobile(!isQueueOpenMobile)}
            className="relative flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-sky-600/30 transition hover:bg-sky-500 lg:hidden"
            aria-label="Buka Antrean Lagu"
          >
            <ListMusic className="h-4 w-4" />
            <span>Antrean</span>
            {queue.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black text-slate-950">
                {queue.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

