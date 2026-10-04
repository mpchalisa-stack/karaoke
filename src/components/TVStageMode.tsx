import React, { useEffect, useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import {
  Radar,
  Rocket,
  QrCode,
  Smartphone,
  Radio,
  AlertTriangle,
  Play,
  Pause,
  SkipForward,
  Tablet,
  Globe2,
  Check,
  Copy,
} from 'lucide-react';
import { useKaraoke } from '../context/KaraokeContext';
import { fetchServerNetworkInfo, getUniversalBarcodeUrl, NetworkInfo } from '../services/network';

interface TVStageModeProps {
  standalone?: boolean;
}

export const TVStageMode: React.FC<TVStageModeProps> = ({ standalone = false }) => {
  const {
    isTvMode,
    setIsTvMode,
    currentSong,
    queue,
    roomId,
    remoteConnectedDevices,
    triggerSoundFx,
    activeReactions,
    isPlaying,
    togglePlayPause,
    skipNextSong,
  } = useKaraoke();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [tvQrUrl, setTvQrUrl] = useState<string>('');
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Fetch server detected URL on mount
  useEffect(() => {
    fetchServerNetworkInfo().then((info) => {
      if (info) setNetworkInfo(info);
    });
  }, []);

  // Synchronize TV YouTube iframe with play/pause state from Tablet / HP
  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: isPlaying ? 'playVideo' : 'pauseVideo',
          args: '',
        }),
        '*'
      );
    } catch (e) {}
  }, [isPlaying]);

  const clientUrl = getUniversalBarcodeUrl(roomId, networkInfo);

  // Instant fallback QR code URL so it never renders blank
  const instantFallbackQr = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    clientUrl
  )}&color=000000&bgcolor=ffffff&margin=2`;

  // High-definition local QRCode generation with pure black high-contrast optics
  useEffect(() => {
    if (!isTvMode && !standalone) return;
    let isMounted = true;

    QRCode.toDataURL(clientUrl, {
      width: 360,
      margin: 2,
      color: {
        dark: '#000000', // Pure black for instant camera recognition on TV screens
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) setTvQrUrl(url);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [isTvMode, standalone, clientUrl]);

  const handleExit = () => {
    if (standalone) {
      window.location.href = `/?room=${encodeURIComponent(roomId)}`;
    } else {
      setIsTvMode(false);
    }
  };

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(clientUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = clientUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [clientUrl]);

  // Keyboard shortcut listener:
  // ESC = Exit TV, Space = Toggle Play/Pause, 1-5 = Sound effects (NO POPUP MODALS)
  useEffect(() => {
    if (!isTvMode && !standalone) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleExit();
      } else if (e.key === ' ' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === '1') {
        triggerSoundFx('applause');
      } else if (e.key === '2') {
        triggerSoundFx('cheer');
      } else if (e.key === '3') {
        triggerSoundFx('airhorn');
      } else if (e.key === '4') {
        triggerSoundFx('boo');
      } else if (e.key === '5') {
        triggerSoundFx('laugh');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTvMode, standalone, togglePlayPause, triggerSoundFx]);

  if (!isTvMode && !standalone) return null;

  const nextSong = queue.length > 0 ? queue[0] : null;
  const currentQrImage = tvQrUrl || instantFallbackQr;

  // Check if any active reaction is a HUUU / BOO for screen alerts
  const latestBooReaction = activeReactions.find((r) => r.type === 'boo');

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#040915] text-white select-none overflow-hidden font-sans">
      {/* Red screen alert when HUUU reaction arrives */}
      {latestBooReaction && (
        <div className="absolute inset-0 z-40 border-8 border-rose-500/70 pointer-events-none animate-pulse bg-rose-950/20 transition-all duration-300" />
      )}

      {/* Top Floating Tactical Command Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-[#050e22]/95 via-[#050e22]/70 to-transparent border-b border-sky-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-700 to-indigo-950 text-white shadow-xl shadow-sky-500/40 border-2 border-sky-400/50 shrink-0">
            <Radar className="h-6 w-6 text-sky-200 animate-spin [animation-duration:8s]" />
            <Rocket className="h-4 w-4 text-amber-400 absolute rotate-45 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-black shadow">
              ★
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xs sm:text-sm font-extrabold tracking-widest text-sky-300 uppercase">
                KARAOKE
              </span>
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-white drop-shadow-[0_0_20px_rgba(56,189,248,0.55)]">
                DISKOMLEK<span className="text-sky-400">AU</span>
              </h1>
              <span className="rounded bg-sky-900/90 px-2 py-0.5 text-[10px] sm:text-xs font-black text-sky-200 border border-sky-400/50 shadow">
                PUSKODAL TV
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-amber-400 italic">
              "Prajurit Yang Pantang Mundur Walau Suara Hancur"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Sound effect trigger buttons on TV stage */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#081533]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-900/80 shadow-md">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mr-1">
              Sorak:
            </span>
            <button
              onClick={() => triggerSoundFx('boo')}
              className="px-2 py-1 text-xs bg-rose-950/70 hover:bg-rose-900/90 rounded-lg text-rose-200 font-extrabold border border-rose-600/70 transition shadow flex items-center gap-1"
              title="Tombol 4: Sorak HUUU Suara Hancur"
            >
              <span>👎 [4]</span>
              <span>HUUU!</span>
            </button>
            <button
              onClick={() => triggerSoundFx('applause')}
              className="px-2 py-1 text-xs hover:bg-sky-900/60 rounded-lg text-sky-200 transition"
              title="Tombol 1: Tepuk Pasukan"
            >
              👏 [1] Tepuk
            </button>
            <button
              onClick={() => triggerSoundFx('cheer')}
              className="px-2 py-1 text-xs hover:bg-sky-900/60 rounded-lg text-sky-200 transition"
              title="Tombol 2: Sorak Komando"
            >
              🎉 [2] Sorak
            </button>
            <button
              onClick={() => triggerSoundFx('airhorn')}
              className="px-2 py-1 text-xs hover:bg-sky-900/60 rounded-lg text-sky-200 transition"
              title="Tombol 3: Sirine Pangkalan"
            >
              📢 [3] Sirine
            </button>
            <button
              onClick={() => triggerSoundFx('laugh')}
              className="px-2 py-1 text-xs hover:bg-sky-900/60 rounded-lg text-amber-300 transition"
              title="Tombol 5: Tawa Pasukan"
            >
              😂 [5] Tawa
            </button>
          </div>

          {/* TV Stage Direct Playback Controls */}
          <div className="flex items-center gap-1.5 bg-[#081533]/90 backdrop-blur-md px-2 py-1 rounded-xl border border-sky-800 shadow">
            <button
              onClick={() => togglePlayPause()}
              className="flex items-center gap-1 rounded-lg bg-sky-900/60 hover:bg-sky-800 px-2.5 py-1 text-xs font-bold text-white transition active:scale-95"
              title={isPlaying ? 'Jeda Lagu di TV (Spasi)' : 'Putar Lagu di TV (Spasi)'}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current text-amber-300" /> : <Play className="h-3.5 w-3.5 fill-current text-emerald-400" />}
              <span className="hidden md:inline">{isPlaying ? 'Jeda' : 'Putar'}</span>
            </button>

            <button
              onClick={() => skipNextSong()}
              className="flex items-center gap-1 rounded-lg bg-sky-900/60 hover:bg-sky-800 px-2.5 py-1 text-xs font-bold text-white transition active:scale-95"
              title="Ganti ke Lagu Berikutnya di Antrean TV"
            >
              <SkipForward className="h-3.5 w-3.5 text-sky-300" />
              <span className="hidden md:inline">Ganti</span>
            </button>
          </div>

          {/* Mode Tablet / Exit TV Mode */}
          <button
            onClick={handleExit}
            className="flex items-center gap-1.5 rounded-xl bg-sky-950/90 backdrop-blur-md border border-sky-600/50 px-3.5 py-1.5 text-xs font-bold text-sky-200 hover:bg-sky-600 hover:text-white transition shadow-sm"
            title="Beralih ke Tampilan Tablet / Layar Sentuh Konsol (ESC)"
          >
            <Tablet className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Mode Tablet (ESC)</span>
            <span className="sm:hidden">Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Full-Scale YouTube Player Stage */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black overflow-hidden">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${
            currentSong?.id || 'nCbzF356088'
          }?autoplay=1&enablejsapi=1&rel=0&iv_load_policy=3&playsinline=1`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="Karaoke Diskomlekau TV Player"
        />

        {/* Top-Right Sleek Room Status Badge (Zero video obstruction, zero popups) */}
        <div
          onClick={handleCopyLink}
          className="absolute top-18 right-4 z-20 flex items-center gap-2 rounded-full border border-sky-400/50 bg-[#07132c]/85 px-3 py-1.5 text-xs font-mono font-bold text-sky-200 shadow-xl backdrop-blur-md cursor-pointer hover:bg-sky-900 transition"
          title="Klik untuk menyalin link HP"
        >
          <Smartphone className="h-3.5 w-3.5 text-sky-400" />
          <span>ROOM:</span>
          <span className="text-amber-300 font-black">{roomId}</span>
          <span className="text-emerald-400">({remoteConnectedDevices} HP)</span>
          {isCopied && <Check className="h-3.5 w-3.5 text-emerald-300" />}
        </div>

        {/* ON-SCREEN REACTION OVERLAY: HUUU, CHEERS, APPLAUSE, AIRHORN */}
        {activeReactions.length > 0 && (
          <div className="absolute inset-x-4 top-24 bottom-20 z-35 flex flex-col items-center justify-center pointer-events-none space-y-4">
            {activeReactions.map((rx) => {
              const isHuuu = rx.type === 'boo';

              return (
                <div
                  key={rx.id}
                  className={`animate-in zoom-in-75 fade-in slide-in-from-bottom-6 duration-300 flex flex-col items-center text-center p-4 sm:p-6 rounded-3xl backdrop-blur-xl border-3 shadow-2xl max-w-lg mx-auto ${
                    isHuuu
                      ? 'bg-gradient-to-b from-rose-950/95 via-rose-900/90 to-red-950/95 border-rose-500 shadow-rose-900/70 text-rose-100 scale-105'
                      : 'bg-[#091838]/95 border-sky-400 shadow-sky-950/70 text-white'
                  }`}
                >
                  {/* Warning banner for HUUU */}
                  {isHuuu && (
                    <div className="flex items-center gap-1.5 rounded-full bg-rose-500/30 px-3 py-0.5 text-xs font-black text-rose-200 uppercase tracking-widest border border-rose-400/50 mb-2 animate-bounce">
                      <AlertTriangle className="h-4 w-4 text-amber-300" />
                      <span>PERINGATAN SUARA HANCUR!</span>
                    </div>
                  )}

                  {/* Reaction Emoji & Main Title */}
                  <div className="flex items-center gap-3">
                    <span className="text-5xl sm:text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] animate-bounce">
                      {rx.emoji}
                    </span>
                    <h2
                      className={`font-display text-2xl sm:text-4xl font-black tracking-wider drop-shadow-lg ${
                        isHuuu ? 'text-amber-300' : 'text-sky-300'
                      }`}
                    >
                      {rx.label}
                    </h2>
                  </div>

                  {/* Sender Name */}
                  <p className="mt-2 text-xs sm:text-sm font-extrabold text-white/90">
                    Dikirim oleh:{' '}
                    <span className="text-amber-300 font-black underline decoration-sky-400">
                      🎖️ {rx.senderName} (HP)
                    </span>
                  </p>

                  {/* Slogan for Huuu */}
                  {isHuuu && (
                    <p className="mt-1 text-xs italic font-bold text-rose-200">
                      "Prajurit Yang Pantang Mundur Walau Suara Hancur!" 💨
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Ticker Marquee & Song Information + Permanent Non-Obtrusive High-Res Barcode */}
      <div className="bg-[#050e22] border-t border-sky-900/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 z-20">
        {/* Current Song */}
        <div className="flex items-center gap-2 max-w-lg truncate">
          <span className="flex h-2.5 w-2.5 rounded-full bg-sky-400 animate-ping shrink-0" />
          <span className="text-xs font-bold text-sky-300 uppercase tracking-wider shrink-0">
            Sedang Mengudara:
          </span>
          <span className="text-sm font-bold text-white truncate">
            {currentSong ? currentSong.title : 'Pilih lagu...'}
          </span>
        </div>

        {/* Next Singer info */}
        {nextSong ? (
          <div className="hidden sm:flex items-center gap-2 bg-[#091838] rounded-full px-4 py-1 border border-sky-800 shrink-0">
            <span className="text-xs text-amber-400 font-bold">Persiapan Terbang:</span>
            <span className="text-xs font-medium text-white max-w-[200px] truncate">
              {nextSong.song.title}
            </span>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-black text-amber-300 border border-amber-500/30">
              🎖️ {nextSong.singerName}
            </span>
          </div>
        ) : (
          <div className="hidden sm:block text-xs text-sky-400/60 font-mono">
            Manifest antrean siap diisi dari HP prajurit
          </div>
        )}

        {/* Permanent Scannable Barcode in Bottom Ticker (Zero popup modals) */}
        <div
          onClick={handleCopyLink}
          className="flex items-center gap-3 bg-[#081533] border-2 border-sky-500/70 p-1.5 rounded-2xl transition-all shrink-0 group shadow-lg cursor-pointer"
          title="Arahkan kamera HP ke barcode untuk memilih lagu dari tempat duduk (Klik untuk salin tautan)"
        >
          {/* Crisp, Sharp 44px QR code */}
          <div className="rounded-xl bg-white p-1 shrink-0 shadow">
            <img
              src={currentQrImage}
              alt="Scan Barcode HP"
              className="h-11 w-11 object-contain rounded"
            />
          </div>

          <div className="flex flex-col text-left pr-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold">
              <span className="text-sky-300">SCAN HP:</span>
              <span className="text-amber-300 font-black">{roomId}</span>
              <span className="text-emerald-400 text-[10px]">({remoteConnectedDevices} HP)</span>
            </div>
            <span className="text-[10px] text-slate-300 font-medium group-hover:text-amber-300">
              {isCopied ? '✓ Link Tersalin!' : 'Arahkan kamera HP ke sini'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
