import React, { useState } from 'react';
import { KeyRound, Check, X, ExternalLink, AlertCircle, ShieldCheck, RefreshCw, Shield } from 'lucide-react';
import { useKaraoke } from '../context/KaraokeContext';

export const ApiKeyModal: React.FC = () => {
  const { apiKey, setApiKey, isApiKeyModalOpen, setIsApiKeyModalOpen, executeSearch } = useKaraoke();
  const [inputVal, setInputVal] = useState(apiKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isApiKeyModalOpen) return null;

  const handleSave = () => {
    setApiKey(inputVal.trim());
    setIsApiKeyModalOpen(false);
    if (inputVal.trim()) {
      executeSearch();
    }
  };

  const handleClear = () => {
    setInputVal('');
    setApiKey('');
    setTestResult(null);
  };

  const testApiKey = async () => {
    if (!inputVal.trim()) {
      setTestResult({ success: false, message: 'Masukkan API Key terlebih dahulu.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=karaoke&type=video&key=${inputVal.trim()}`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setTestResult({
          success: true,
          message: 'Berhasil! Kunci YouTube Data API v3 aktif dan valid.',
        });
      } else {
        const errorMsg = data?.error?.message || 'Kunci API tidak valid atau kuota habis.';
        setTestResult({
          success: false,
          message: `Gagal: ${errorMsg}`,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Koneksi gagal: ${err.message || 'Cek internet Anda'}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border-2 border-sky-500/40 bg-[#07132c] p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-sky-900/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Frekuensi & Kunci YouTube API
              </h3>
              <p className="text-xs text-sky-300/70">
                Pencarian jutaan video karaoke langsung dari YouTube
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsApiKeyModalOpen(false)}
            className="rounded-lg p-1 text-sky-400/80 hover:bg-sky-900/40 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-sky-200">
              Kunci API Opsional (Google Cloud Console):
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 rounded-xl border border-sky-700 bg-[#040b1a] px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 outline-none focus:border-sky-400"
              />
              <button
                type="button"
                onClick={testApiKey}
                disabled={isTesting || !inputVal.trim()}
                className="flex items-center gap-1.5 rounded-xl border border-sky-700 bg-[#0b1c3e] px-3.5 py-2 text-xs font-bold text-sky-200 hover:bg-sky-900/50 disabled:opacity-50"
              >
                {isTesting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Uji Kunci'}
              </button>
            </div>
          </div>

          {/* Test Status feedback */}
          {testResult && (
            <div
              className={`flex items-start gap-2 rounded-xl p-3 text-xs ${
                testResult.success
                  ? 'border border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : 'border border-rose-500/40 bg-rose-950/40 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Information box */}
          <div className="rounded-xl border border-sky-500/30 bg-[#050e22] p-3.5 text-xs text-sky-200/90 space-y-2">
            <p className="font-bold text-sky-300 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-sky-400" />
              <span>Aplikasi Tetap Berfungsi 100% Tanpa Kunci API!</span>
            </p>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Karaoke Diskomlekau dilengkapi mesin radar server internal (<strong>Live Search Bebas API Key</strong>). Prajurit dapat mencari lagu apa saja secara langsung, memilih rekomendasi pangkalan (Slow Rock, Roots Reggae, Roots Dub), atau menempel tautan video YouTube apa pun tanpa perlu kunci API.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-between border-t border-sky-900/60 pt-4">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-sky-400/80 hover:text-sky-200"
          >
            Hapus Kunci (Gunakan Radar Default)
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsApiKeyModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:bg-sky-900/40 hover:text-white"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-sky-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-sky-600/30 hover:bg-sky-500 border border-sky-400/30"
            >
              Simpan & Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
