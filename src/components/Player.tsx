import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Radio,
  Smartphone,
  Trophy,
  Tv,
} from 'lucide-react';
import { useKaraoke } from '../context/KaraokeContext';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const Player: React.FC = () => {
  const {
    currentSong,
    queue,
    isPlaying,
    setIsPlaying,
    togglePlayPause,
    audioVolume,
    setAudioVolume,
    isMuted,
    setIsMuted,
    skipNextSong,
    replayCurrentSong,
    evaluateCurrentSong,
    handlePlayerEnded,
    playerRef,
    triggerSoundFx,
    setIsTvMode,
    remoteConnectedDevices,
    roomId,
    activeReactions,
  } = useKaraoke();

  const internalPlayerRef = useRef<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  // Load YouTube IFrame API script
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    if (!document.getElementById('youtube-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const prevOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevOnReady) prevOnReady();
      initPlayer();
    };
  }, []);

  // Initialize YT.Player
  const initPlayer = useCallback(() => {
    if (!window.YT || !window.YT.Player || internalPlayerRef.current) return;

    try {
      const playerInstance = new window.YT.Player('karaoke-yt-iframe-target', {
        height: '100%',
        width: '100%',
        videoId: currentSong?.id || 'nCbzF356088',
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          fs: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            setIsPlayerReady(true);
            playerRef.current = event.target;
            internalPlayerRef.current = event.target;
            event.target.setVolume(audioVolume);
          },
          onStateChange: (event: any) => {
            if (event.data === 0) {
              handlePlayerEnded();
            } else if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2) {
              setIsPlaying(false);
            }
          },
          onError: (event: any) => {
            console.warn('YouTube Player error code:', event.data);
            setPlayerError('Video ini dibatasi atau tidak dapat disematkan oleh pengunggah.');
          },
        },
      });
    } catch (err) {
      console.error('Error instantiating YT player:', err);
    }
  }, [currentSong?.id, audioVolume, handlePlayerEnded, setIsPlaying, playerRef]);

  // Load new video when currentSong changes
  useEffect(() => {
    if (currentSong && internalPlayerRef.current && isPlayerReady) {
      try {
        setPlayerError(null);
        internalPlayerRef.current.loadVideoById(currentSong.id);
        setIsPlaying(true);
      } catch (e) {
        console.warn('Error loading video by ID:', e);
      }
    }
  }, [currentSong?.id, isPlayerReady, setIsPlaying]);

  // Sync volume with player
  useEffect(() => {
    if (internalPlayerRef.current && isPlayerReady) {
      try {
        if (isMuted) {
          internalPlayerRef.current.mute();
        } else {
          internalPlayerRef.current.unMute();
          internalPlayerRef.current.setVolume(audioVolume);
        }
      } catch (e) {
        // ignore
      }
    }
  }, [audioVolume, isMuted, isPlayerReady]);

  // Synchronize internal YouTube player with remote play/pause state
  useEffect(() => {
    if (!internalPlayerRef.current || !isPlayerReady) return;
    try {
      const state = internalPlayerRef.current.getPlayerState?.();
      if (isPlaying && state !== 1 && state !== 3) {
        internalPlayerRef.current.playVideo?.();
      } else if (!isPlaying && state === 1) {
        internalPlayerRef.current.pauseVideo?.();
      }
    } catch (e) {
      // ignore
    }
  }, [isPlaying, isPlayerReady]);

  const nextInQueue = queue.length > 0 ? queue[0] : null;

  return (
    <div className="flex flex-col rounded-2xl border-2 border-sky-900/80 bg-[#07132c]/95 shadow-2xl backdrop-blur-xl overflow-hidden hud-corner">
      {/* Cockpit / Tactical Top Bar Indicator */}
      <div className="px-3 sm:px-4 py-2 bg-[#050e22] border-b border-sky-900/60 flex items-center justify-between text-[11px] font-mono text-sky-400 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-sky-400 animate-pulse shrink-0" />
          <span className="font-bold tracking-widest text-sky-300">PUSKODAL DISKOMLEKAU // MONITOR UTAMA</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Fixed Room Code & Connection Info (No Popup) */}
          <div className="flex items-center gap-1.5 rounded-lg bg-[#07132c] px-2.5 py-1 text-[10px] font-mono font-bold text-sky-200 border border-sky-700/70 shadow-inner">
            <Smartphone className="h-3 w-3 text-sky-400" />
            <span>ROOM: <strong className="text-amber-300">{roomId}</strong></span>
            <span className="text-emerald-400">({remoteConnectedDevices} HP)</span>
          </div>

          <span className="hidden md:inline text-sky-500 font-mono">FREQ: 124.85 MHz</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            STANDBY
          </span>
        </div>
      </div>

      {/* Video Screen Container (16:9 Aspect Ratio) */}
      <div className="relative aspect-video w-full bg-black overflow-hidden group">
        <div id="karaoke-yt-iframe-target" className="h-full w-full" />

        {/* Video Overlays if Error */}
        {playerError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center">
            <Radio className="h-10 w-10 text-amber-400 mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-amber-300">{playerError}</p>
            <p className="text-xs text-sky-200/80 mt-1 max-w-md">
              Tekan tombol lewati untuk melanjutkan ke lagu giliran prajurit berikutnya di antrean.
            </p>
            <button
              onClick={() => skipNextSong()}
              className="mt-4 rounded-xl bg-sky-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-sky-600/30 hover:bg-sky-500 border border-sky-400/30"
            >
              Lewati ke Lagu Berikutnya &rarr;
            </button>
          </div>
        )}

        {/* Floating Ticker: Current Song & Next Up */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#060e22]/90 via-[#060e22]/50 to-transparent p-3 pointer-events-none transition-opacity duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Current Playing Marquee */}
            <div className="flex items-center gap-2 max-w-full sm:max-w-md bg-[#07132c]/90 backdrop-blur-md rounded-full px-3 py-1 border border-sky-500/40 shadow-lg">
              <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-ping" />
              <span className="font-bold text-sky-300 text-[11px] uppercase tracking-wider">
                SEDANG MENGUDARA:
              </span>
              <span className="truncate font-semibold text-white text-[13px]">
                {currentSong ? currentSong.title : 'Pilih lagu untuk memulai'}
              </span>
            </div>

            {/* Next Up Singer Announcement */}
            {nextInQueue && (
              <div className="hidden sm:flex items-center gap-2 bg-[#091838]/90 backdrop-blur-md rounded-full px-3 py-1 border border-amber-500/40 text-slate-200">
                <span className="text-amber-400 font-bold text-[11px]">SIAP-SIAP:</span>
                <span className="font-semibold text-white truncate max-w-[180px]">
                  {nextInQueue.song.title}
                </span>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 font-extrabold border border-amber-500/30">
                  🎖️ {nextInQueue.singerName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Real-time On-Screen Reaction Banners (HUUU, Cheers, etc.) */}
        {activeReactions.length > 0 && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none p-4 space-y-3">
            {activeReactions.map((rx) => {
              const isHuuu = rx.type === 'boo';
              return (
                <div
                  key={rx.id}
                  className={`animate-in zoom-in-75 fade-in slide-in-from-bottom-4 duration-300 flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-xl border-2 shadow-2xl text-center ${
                    isHuuu
                      ? 'bg-rose-950/95 border-rose-500 shadow-rose-900/60 text-rose-100 scale-105'
                      : 'bg-[#07132c]/95 border-sky-400 shadow-sky-950/80 text-white'
                  }`}
                >
                  <span className="text-3xl animate-bounce">{rx.emoji}</span>
                  <div className="text-left">
                    <p className={`text-sm font-extrabold ${isHuuu ? 'text-amber-300' : 'text-sky-300'}`}>
                      {rx.label}
                    </p>
                    <p className="text-[11px] text-slate-200">
                      Dari: <span className="font-bold text-white underline">{rx.senderName} (HP)</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Control Deck & Soundboard */}
      <div className="p-4 bg-[#050e22] border-t border-sky-900/60 flex flex-col gap-3">
        {/* Playback Controls & Volume */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Main Controls: Replay, Play/Pause, Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={replayCurrentSong}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b1c3e] border border-sky-900/70 text-sky-200 hover:bg-sky-900/50 hover:text-white transition"
              title="Ulangi Lagu Dari Awal"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => togglePlayPause()}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-700 text-white shadow-lg shadow-sky-500/30 hover:brightness-110 active:scale-95 transition border border-sky-400/40"
              title={isPlaying ? 'Jeda Lagu' : 'Putar Lagu'}
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => skipNextSong()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b1c3e] border border-sky-900/70 text-sky-200 hover:bg-sky-900/50 hover:text-white transition"
              title="Lagu Berikutnya (Skip Next)"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Volume Control & Audio Routing Toggle (Cegah Suara Duplikasi) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition shadow ${
                isMuted
                  ? 'bg-amber-950/80 border border-amber-500/70 text-amber-300'
                  : 'bg-emerald-950/80 border border-emerald-500/70 text-emerald-300'
              }`}
              title="Ganti rute suara untuk mencegah suara ganda antara tablet dan layar TV"
            >
              {isMuted ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-amber-400" />
                  <span>Audio: Layar TV (Tablet Senyap)</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Audio: Tablet Aktif</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 bg-[#091838] px-3 py-1.5 rounded-xl border border-sky-900/60">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-sky-300 hover:text-white transition"
                title={isMuted ? 'Buka Suara Tablet' : 'Bisukan Suara Tablet'}
              >
                {isMuted || audioVolume === 0 ? (
                  <VolumeX className="h-4 w-4 text-rose-400" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : audioVolume}
                onChange={(e) => {
                  setAudioVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 sm:w-24 accent-sky-400 h-1.5 bg-[#0b1c3e] rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-mono text-sky-300 w-7 text-right">
                {isMuted ? '0%' : `${audioVolume}%`}
              </span>
            </div>
          </div>

          {/* Scoring Button */}
          <button
            onClick={evaluateCurrentSong}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/60 bg-gradient-to-r from-amber-600/30 to-amber-700/40 px-3 py-1.5 text-xs font-bold text-amber-300 hover:from-amber-600 hover:to-amber-700 hover:text-white transition active:scale-95 shadow-md shadow-amber-950"
            title="Selesaikan lagu & tampilkan hasil penilaian dewan juri Puskodal"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>Nilai Lagu (Skor)</span>
          </button>

          {/* Open TV Screen on Second Display / Tab */}
          <button
            onClick={() => window.open(`/?mode=tv&room=${encodeURIComponent(roomId)}`, '_blank')}
            className="flex items-center gap-1.5 rounded-xl border border-sky-500/70 bg-sky-950/80 px-3 py-1.5 text-xs font-bold text-sky-200 hover:bg-sky-600 hover:text-white transition active:scale-95 shadow"
            title="Buka Layar TV Panggung di Tab Baru / Layar Kedua (HDMI / Smart TV)"
          >
            <Tv className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Layar TV (Layar Kedua)</span>
          </button>

          {/* Fullscreen TV Mode */}
          <button
            onClick={() => setIsTvMode(true)}
            className="flex items-center gap-1.5 rounded-xl border border-sky-900/70 bg-[#091838] px-3 py-1.5 text-xs font-semibold text-sky-200 hover:border-sky-400 hover:text-white transition"
            title="Layar Puskodal Penuh"
          >
            <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Layar Panggung TV</span>
          </button>
        </div>

        {/* Tactical Soundboard */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-sky-900/40 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-300 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Papan Efek Pangkalan:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => triggerSoundFx('applause')}
              className="flex items-center gap-1 rounded-lg bg-[#0a1a3a] hover:bg-sky-900/50 border border-sky-800/80 px-2.5 py-1 text-xs text-sky-200 hover:text-white transition active:scale-95"
            >
              <span>👏</span>
              <span className="font-semibold text-[11px]">Tepuk Pasukan</span>
            </button>

            <button
              onClick={() => triggerSoundFx('cheer')}
              className="flex items-center gap-1 rounded-lg bg-[#0a1a3a] hover:bg-sky-900/50 border border-sky-800/80 px-2.5 py-1 text-xs text-sky-200 hover:text-white transition active:scale-95"
            >
              <span>🎉</span>
              <span className="font-semibold text-[11px]">Sorak Komando</span>
            </button>

            <button
              onClick={() => triggerSoundFx('airhorn')}
              className="flex items-center gap-1 rounded-lg bg-[#0a1a3a] hover:bg-sky-900/50 border border-sky-800/80 px-2.5 py-1 text-xs text-sky-200 hover:text-white transition active:scale-95"
            >
              <span>📢</span>
              <span className="font-semibold text-[11px]">Sirine Tempur</span>
            </button>

            <button
              onClick={() => triggerSoundFx('ding')}
              className="flex items-center gap-1 rounded-lg bg-[#0a1a3a] hover:bg-sky-900/50 border border-sky-800/80 px-2.5 py-1 text-xs text-sky-200 hover:text-white transition active:scale-95"
            >
              <span>🔔</span>
              <span className="font-semibold text-[11px]">Bel Apel</span>
            </button>

            <button
              onClick={() => triggerSoundFx('rimshot')}
              className="flex items-center gap-1 rounded-lg bg-[#0a1a3a] hover:bg-sky-900/50 border border-sky-800/80 px-2.5 py-1 text-xs text-sky-200 hover:text-white transition active:scale-95"
            >
              <span>🥁</span>
              <span className="font-semibold text-[11px]">Drum Band</span>
            </button>

            <button
              onClick={() => triggerSoundFx('boo')}
              className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-950 to-rose-900 hover:from-rose-900 hover:to-rose-800 border-2 border-rose-500/80 px-2.5 py-1 text-xs text-rose-200 font-extrabold hover:text-white transition active:scale-95 shadow-md shadow-rose-950"
              title="Sorak Huuu Pasukan (Lucu: Suara Hancur)"
            >
              <span>👎</span>
              <span className="font-black text-[11px]">Sorak HUUU!</span>
            </button>

            <button
              onClick={() => triggerSoundFx('laugh')}
              className="flex items-center gap-1 rounded-lg bg-[#0a1a3a] hover:bg-sky-900/50 border border-sky-800/80 px-2.5 py-1 text-xs text-amber-300 hover:text-white transition active:scale-95"
              title="Tawa Pasukan"
            >
              <span>😂</span>
              <span className="font-semibold text-[11px]">Tawa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
