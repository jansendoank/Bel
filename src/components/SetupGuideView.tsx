import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Copy, 
  Check, 
  Smartphone, 
  QrCode, 
  Key, 
  Cpu, 
  AlertCircle, 
  Layers, 
  ExternalLink 
} from 'lucide-react';

export const SetupGuideView: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<string>('');

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(id);
    setTimeout(() => setCopiedStep(''), 2000);
  };

  const codeBlocks = {
    prereq: `sudo apt update && sudo apt install -y nodejs npm ffmpeg libvips-dev build-essential`,
    clone: `# Clone repository dari github
git clone https://github.com/Rifza123/Experimental-Bell.git
cd Experimental-Bell

# Atau ekstrak file zip yang sudah diunduh
unzip Experimental-Bell-master.zip
cd Experimental-Bell-master`,
    install: `# Install dependensi Node.js
npm install

# Catatan: Jika ada kendala pada canvas atau baileys
npm install --legacy-peer-deps`,
    config: `// Edit file: toolkit/set/config.json
{
  "owner": ["6281234567890"],      // Ganti dengan nomor WhatsApp Anda
  "coowner": ["6281234567890"],
  "botname": "-▪︎ Bella-AI",
  "botfullname": "Bell",
  "botnickname": "bella",
  "ownername": "NamaAnda",
  "locale": "id"
}`,
    run: `# Jalankan bot secara langsung
npm start

# Atau jalankan dengan PM2 agar aktif 24 jam di background:
npm install -g pm2
pm2 start index.js --name "bella-bot"
pm2 save
pm2 startup`,
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          Panduan Deployment & Eksekusi
        </div>
        <h2 className="text-xl font-bold text-white">
          Cara Menjalankan & Mengkloning Experimental-Bell
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Ikuti langkah-langkah di bawah ini untuk menjalankan bot WhatsApp ini di laptop/PC lokal (Windows/Linux/Mac) atau Virtual Private Server (VPS Ubuntu/Debian).
        </p>
      </div>

      {/* Step by step guide */}
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">1</span>
              Persyaratan Sistem (Prerequisites)
            </h3>
            <span className="text-xs text-slate-400">Node.js 18+ & FFmpeg</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Bot membutuhkan Node.js versi 18 atau 20 (ES Modules) dan tool CLI <code className="text-emerald-400">ffmpeg</code> untuk memproses konversi audio/video/stiker WebP.
          </p>
          <div className="relative rounded-xl bg-slate-950 p-3.5 border border-slate-800 font-mono text-xs text-slate-200">
            <button
              onClick={() => copyCode('prereq', codeBlocks.prereq)}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {copiedStep === 'prereq' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre className="overflow-x-auto">
              <code>{codeBlocks.prereq}</code>
            </pre>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">2</span>
              Clone / Ekstrak Repository & Install Dependensi
            </h3>
            <span className="text-xs text-slate-400">npm install</span>
          </div>
          <div className="relative rounded-xl bg-slate-950 p-3.5 border border-slate-800 font-mono text-xs text-slate-200">
            <button
              onClick={() => copyCode('install', codeBlocks.install)}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {copiedStep === 'install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre className="overflow-x-auto">
              <code>{codeBlocks.install}</code>
            </pre>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">3</span>
              Konfigurasi Owner & Pengaturan Bot
            </h3>
            <span className="text-xs font-mono text-cyan-400">toolkit/set/config.json</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Buka file <code className="text-cyan-400 font-mono">toolkit/set/config.json</code> lalu ganti nomor owner menjadi nomor WhatsApp Anda (format tanpa tanda plus atau strip, contoh: 6281234567890).
          </p>
          <div className="relative rounded-xl bg-slate-950 p-3.5 border border-slate-800 font-mono text-xs text-slate-200">
            <button
              onClick={() => copyCode('config', codeBlocks.config)}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {copiedStep === 'config' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre className="overflow-x-auto">
              <code>{codeBlocks.config}</code>
            </pre>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">4</span>
              Penyambungan Sesi (Pairing Code vs QR Code)
            </h3>
            <span className="text-xs text-slate-400">Pilih salah satu</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Saat pertama kali menjalankan <code className="text-emerald-400">npm start</code>, terminal akan menanyakan metode penautan perangkat:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                <Smartphone className="w-4 h-4" />
                <span>Opsi A: Pairing Code (Rekomendasi)</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Ketik <strong className="text-slate-200">pairing</strong> di terminal, lalu masukkan nomor WhatsApp. Bot akan memunculkan 8 karakter kode pairing (misal: TERMAICC). Masukkan kode ini di WhatsApp: <em>Perangkat Tertaut &gt; Tautkan dengan nomor telepon</em>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-purple-400">
                <QrCode className="w-4 h-4" />
                <span>Opsi B: QR Code Terminal</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Ketik <strong className="text-slate-200">qr</strong> di terminal. Scan QR yang tampil di konsol menggunakan fitur <em>Perangkat Tertaut</em> pada aplikasi WhatsApp smartphone Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">5</span>
              Jalankan Bot 24/7 dengan PM2
            </h3>
            <span className="text-xs font-mono text-emerald-400">pm2 start</span>
          </div>
          <div className="relative rounded-xl bg-slate-950 p-3.5 border border-slate-800 font-mono text-xs text-slate-200">
            <button
              onClick={() => copyCode('run', codeBlocks.run)}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {copiedStep === 'run' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre className="overflow-x-auto">
              <code>{codeBlocks.run}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Troubleshooting card */}
      <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
        <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Troubleshooting Error Umum</span>
        </div>
        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
          <li>
            <strong className="text-slate-100">DisconnectReason 515 (restart required):</strong> Ini normal saat pertama kali menyimpan kredensial. Bot otomatis menyambung ulang.
          </li>
          <li>
            <strong className="text-slate-100">DisconnectReason 401 (logged out):</strong> Sesi WhatsApp kedaluwarsa atau dikeluarkan dari HP. Hapus folder <code className="text-amber-400">connection/session/</code> lalu restart untuk scan/pairing ulang.
          </li>
          <li>
            <strong className="text-slate-100">Error Node canvas / libvips:</strong> Pastikan library native sistem operasi sudah diinstal via <code className="text-slate-200">sudo apt install libvips-dev build-essential</code>.
          </li>
        </ul>
      </div>
    </div>
  );
};
