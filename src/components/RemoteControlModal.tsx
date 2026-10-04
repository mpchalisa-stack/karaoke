import React, { useState } from 'react';
import {
  Smartphone,
  X,
  Radio,
  Play,
  Pause,
  SkipForward,
  Sparkles,
  Search,
  Plus,
  Send,
  Code2,
  CheckCircle2,
  Radar,
  Rocket,
  Shield,
} from 'lucide-react';
import { useKaraoke } from '../context/KaraokeContext';
import { CURATED_LIBRARY } from '../services/youtube';

export const RemoteControlModal: React.FC = () => {
  const {
    isRemoteModalOpen,
    setIsRemoteModalOpen,
    roomId,
    remoteConnectedDevices,
    isPlaying,
    setIsPlaying,
    skipNextSong,
    triggerSoundFx,
    addToQueue,
    defaultSingerName,
  } = useKaraoke();

  const [activeTab, setActiveTab] = useState<'remotePad' | 'codeArchitecture'>('remotePad');
  const [remoteSinger, setRemoteSinger] = useState(defaultSingerName);
  const [remoteSongQuery, setRemoteSongQuery] = useState('');
  const [remoteSuccessMsg, setRemoteSuccessMsg] = useState('');

  if (!isRemoteModalOpen) return null;

  const handleRemoteSendQuickSong = (title: string, artist: string, id: string) => {
    addToQueue(
      {
        id,
        title: `${artist} - ${title} (Karaoke)`,
        channelTitle: artist,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      },
      remoteSinger
    );
    setRemoteSuccessMsg(`Lagu "${title}" berhasil dikirim ke antrean utama!`);
    setTimeout(() => setRemoteSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl border-2 border-sky-500/40 bg-[#07132c] p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-sky-900/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-white">
                  Remote Kontrol HP Prajurit (Sync)
                </h3>
                <span className="rounded bg-sky-950 px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-sky-700">
                  Room: {roomId}
                </span>
              </div>
              <p className="text-xs text-sky-300/70">
                Pilih lagu dari HP tanpa mengganggu layar utama Puskodal Diskomlekau
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRemoteModalOpen(false)}
            className="rounded-lg p-1 text-sky-400/80 hover:bg-sky-900/40 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex border-b border-sky-900/60 gap-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('remotePad')}
            className={`flex items-center gap-1.5 pb-2.5 transition border-b-2 ${
              activeTab === 'remotePad'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Simulasi Remote HP</span>
          </button>

          <button
            onClick={() => setActiveTab('codeArchitecture')}
            className={`flex items-center gap-1.5 pb-2.5 transition border-b-2 ${
              activeTab === 'codeArchitecture'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Protokol WebSocket</span>
          </button>
        </div>

        {/* Tab 1: Remote Pad Simulator */}
        {activeTab === 'remotePad' && (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-sky-900/80 bg-[#050e22] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-sky-200">
                  📱 Panel Remote Prajurit (HP):
                </span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Koneksi Aktif
                </span>
              </div>

              {/* Singer Name field on phone */}
              <div className="mb-3">
                <label className="text-[11px] font-semibold text-sky-300/80">Callsign / Nama Anda:</label>
                <input
                  type="text"
                  value={remoteSinger}
                  onChange={(e) => setRemoteSinger(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-sky-800 bg-[#07132c] px-3 py-1.5 text-xs text-white outline-none focus:border-sky-400"
                  placeholder="Ketik callsign Anda..."
                />
              </div>

              {/* Quick Playback remote controls */}
              <div className="flex items-center justify-center gap-3 py-2 border-y border-sky-900/60 my-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 rounded-xl bg-sky-900/60 border border-sky-600/50 px-4 py-2 text-xs font-bold text-white hover:bg-sky-600 active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>Pause Layar</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      <span>Play Layar</span>
                    </>
                  )}
                </button>

                <button
                  onClick={skipNextSong}
                  className="flex items-center gap-1.5 rounded-xl bg-sky-900/60 border border-sky-600/50 px-4 py-2 text-xs font-bold text-white hover:bg-sky-600 active:scale-95"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                  <span>Lewati Lagu</span>
                </button>
              </div>

              {/* Remote Sound FX triggers */}
              <div className="pt-1">
                <p className="text-[11px] text-sky-300/80 mb-2 font-semibold">
                  Kirim Efek Suara Pangkalan ke Layar TV:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => triggerSoundFx('applause')}
                    className="flex flex-col items-center justify-center rounded-xl border border-sky-900/70 bg-[#07132c] p-2 text-xs text-sky-200 hover:border-sky-400 active:scale-95"
                  >
                    <span className="text-xl">👏</span>
                    <span className="text-[10px] mt-1 font-bold">Tepuk</span>
                  </button>
                  <button
                    onClick={() => triggerSoundFx('cheer')}
                    className="flex flex-col items-center justify-center rounded-xl border border-sky-900/70 bg-[#07132c] p-2 text-xs text-sky-200 hover:border-sky-400 active:scale-95"
                  >
                    <span className="text-xl">🎉</span>
                    <span className="text-[10px] mt-1 font-bold">Sorak</span>
                  </button>
                  <button
                    onClick={() => triggerSoundFx('airhorn')}
                    className="flex flex-col items-center justify-center rounded-xl border border-sky-900/70 bg-[#07132c] p-2 text-xs text-sky-200 hover:border-sky-400 active:scale-95"
                  >
                    <span className="text-xl">📢</span>
                    <span className="text-[10px] mt-1 font-bold">Sirine</span>
                  </button>
                  <button
                    onClick={() => triggerSoundFx('boo')}
                    className="flex flex-col items-center justify-center rounded-xl border border-rose-900/70 bg-[#07132c] p-2 text-xs text-rose-300 hover:border-rose-400 active:scale-95"
                  >
                    <span className="text-xl">👎</span>
                    <span className="text-[10px] mt-1 font-bold">Huuu</span>
                  </button>
                </div>
              </div>

              {/* Quick Remote Song Push */}
              <div className="mt-4 pt-3 border-t border-sky-900/60">
                <p className="text-[11px] text-sky-300/80 mb-2 font-semibold">
                  Kirim Lagu Instan ke Layar Puskodal:
                </p>
                <div className="space-y-1.5">
                  <div
                    onClick={() =>
                      handleRemoteSendQuickSong('November Rain', 'Guns N Roses', '8SbUCzKW9vQ')
                    }
                    className="flex items-center justify-between rounded-lg bg-[#07132c] p-2 text-xs hover:bg-[#0a1c42] cursor-pointer border border-sky-900"
                  >
                    <span className="font-semibold text-slate-200">Guns N Roses - November Rain</span>
                    <span className="rounded bg-sky-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      + Kirim
                    </span>
                  </div>
                  <div
                    onClick={() =>
                      handleRemoteSendQuickSong('Could You Be Loved', 'Bob Marley', 'CHekNnySAfM')
                    }
                    className="flex items-center justify-between rounded-lg bg-[#07132c] p-2 text-xs hover:bg-[#0a1c42] cursor-pointer border border-sky-900"
                  >
                    <span className="font-semibold text-slate-200">Bob Marley - Could You Be Loved</span>
                    <span className="rounded bg-sky-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      + Kirim
                    </span>
                  </div>
                  <div
                    onClick={() => handleRemoteSendQuickSong('Kangen', 'Dewa 19', 't-iX_3e1aQo')}
                    className="flex items-center justify-between rounded-lg bg-[#07132c] p-2 text-xs hover:bg-[#0a1c42] cursor-pointer border border-sky-900"
                  >
                    <span className="font-semibold text-slate-200">Dewa 19 - Kangen</span>
                    <span className="rounded bg-sky-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      + Kirim
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {remoteSuccessMsg && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{remoteSuccessMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Code Architecture for WebSockets */}
        {activeTab === 'codeArchitecture' && (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-sky-900/80 bg-[#050e22] p-3.5 text-xs text-slate-300">
              <p className="font-bold text-sky-400 mb-1">
                🔌 Protokol WebSocket Siap Operasional
              </p>
              <p className="text-[11px] text-sky-300/80 leading-relaxed">
                Aplikasi telah siap terhubung dengan event-driven protocol sinkron melalui <code>BroadcastChannel</code> dan dapat langsung diarahkan ke server WebSocket (<code>ws://...</code> atau <code>wss://...</code>).
              </p>
            </div>

            <div className="rounded-xl border border-sky-900 bg-[#040915] p-3 font-mono text-[11px] text-sky-300 overflow-x-auto">
              <pre className="text-sky-300">
{`const socket = new WebSocket(\`wss://diskomlekau-karaoke.mil/ws?room=\${roomId}\`);

socket.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  switch (msg.type) {
    case 'ADD_QUEUE_ITEM':
      addToQueue(msg.payload.song, msg.payload.singerName);
      break;
    case 'SKIP_NEXT':
      skipNextSong();
      break;
    case 'PLAY_SOUND_FX':
      triggerSoundFx(msg.payload.sound);
      break;
  }
};`}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end border-t border-sky-900/60 pt-3">
          <button
            onClick={() => setIsRemoteModalOpen(false)}
            className="rounded-xl bg-sky-900/70 border border-sky-600/50 px-5 py-2 text-xs font-bold text-white hover:bg-sky-600"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
