import React, { useState } from 'react';
import { 
  Cpu, 
  ArrowRight, 
  Radio, 
  Filter, 
  Workflow, 
  ShieldCheck, 
  Bot, 
  Sparkles, 
  Terminal, 
  Database, 
  Boxes, 
  FileCode, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Zap 
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string>('stage-4');

  const pipelineStages = [
    {
      id: 'stage-1',
      step: '01',
      title: 'Koneksi & Auth WhatsApp',
      file: 'connection/systemConnext.js & index.js',
      icon: Radio,
      color: 'from-blue-500 to-indigo-600',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      description: 'Manajemen WebSocket Baileys, Pairing Code 8 digit atau QR Terminal, dan multi-file auth session.',
      details: [
        'Menggunakan @whiskeysockets/baileys untuk koneksi socket multi-device tanpa browser headless puppeteer.',
        'Mendukung Pairing Code (global.pairingCode = true) via input nomor telepon tanpa perlu scan QR.',
        'Penyimpanan sesi di connection/session/creds.json menggunakan useMultiFileAuthState().',
        'Auto-reconnect dengan backoff jika terjadi disconnect 408 (timeout) atau 515 (restart).'
      ]
    },
    {
      id: 'stage-2',
      step: '02',
      title: 'Ingress & Broadcast Handling',
      file: 'index.js (Exp.ev.on)',
      icon: Filter,
      color: 'from-cyan-500 to-teal-600',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      description: 'Menangkap event messages.upsert, mengabaikan status/story broadcast atau auto-view cerita WhatsApp.',
      details: [
        'Listener Exp.ev.on("messages.upsert") menerima array pesan mentah masuk.',
        'Pemisahan pesan status@broadcast: jika cfg.autoreadsw aktif, bot otomatis membaca story.',
        'Listener Exp.ev.on("call"): otomatis menolak panggilan masuk (reject) dan auto-block jika cfg.call.block = true.',
        'Hot-reload file detector (detector.js) memantau perubahan kode helpers secara live.'
      ]
    },
    {
      id: 'stage-3',
      step: '03',
      title: 'Message Normalization',
      file: 'helpers/utils.js',
      icon: Workflow,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      description: 'Parsing payload Protobuf Baileys menjadi objek terstruktur cht dan bendera status is.',
      details: [
        'Mengekstrak sender JID, LID (@lid), dan quoted context dari contextInfo.',
        'Mendeteksi tipe pesan: teks, gambar, video, audio/VN, stiker, interactive native buttons, poll, ephemeral.',
        'Mengekstrak prefix (., #, ‽, ٪) dan memisahkan nama command (cht.cmd) dan query argumen (cht.q).',
        'Fuzzy similarity matching: mendeteksi typo dan memberikan rekomendasi command jika cfg.similarCmd aktif.'
      ]
    },
    {
      id: 'stage-4',
      step: '04',
      title: 'Middleware & Policy Gatekeeper',
      file: 'helpers/client.js',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-green-600',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description: 'Penyaring keamanan utama: anti-spam, banned user, mode grup/PC, sewa bot, dan auto-read.',
      details: [
        'Anti-Flood & Anti-Spam: menyimpan 7 pesan terakhir dalam memori untuk mencegah spam beruntun.',
        'Banned User Check: mengecek masa berlaku hukuman ban pengguna sebelum memproses pesan.',
        'Mode Public Policy: mendukung mode publik, onlygc (hanya grup), onlypc (hanya chat pribadi), atau onlyjoingc.',
        'Anti-PC (cfg.antipc): otomatis memblokir user yang chat bot lewat jalur pribadi.',
        'Sewa Check (cfg.sewa): memvalidasi masa sewa grup; jika habis atau dalam grace period, bot tidak akan merespon.'
      ]
    },
    {
      id: 'stage-5',
      step: '05',
      title: 'Dual Execution Engine',
      file: 'interactive.js (AI) vs events.js (Command)',
      icon: Bot,
      color: 'from-purple-500 to-pink-600',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      description: 'Percabangan cerdas: jika pesan berupa percakapan masuk ke AI Bella, jika ada prefix command masuk ke Event Dispatcher.',
      details: [
        'Jalur A (AI Persona): interactive.js memanggil model AI (termai.cc / reasoner / gemini) dengan persona Furina Clarissa (Bella).',
        'Jalur B (Command Dispatcher): events.js mencari event handler terdaftar, mengecek level izin & saldo energi pengguna.',
        'Developer Eval & Exec: mendukung prefix > (eval), => (eval sync), dan $ (shell exec) untuk debugging langsung dari WhatsApp (dengan filter perintah berbahaya).'
      ]
    },
    {
      id: 'stage-6',
      step: '06',
      title: 'Machine & Toolkit Backend',
      file: 'machine/* & toolkit/*',
      icon: Database,
      color: 'from-rose-500 to-red-600',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      description: 'Layanan eksternal: Stable Diffusion, DeepSeek, Google TTS, FFmpeg, Exif WebP, dan sinkronisasi MongoDB.',
      details: [
        'machine/: Modul AI deepseek.js, gemini.js, gpt3.js, transcribe.js, imageEdit.js, serta engine chess.js & jadwalsholat.js.',
        'toolkit/: Konverter stiker WebP (exif.js), pengubah audio/video (ffmpeg.js), scraper Catbox/Telegraph/Tmpfiles.',
        'Database Lokal & Cloud: JSON DB di toolkit/db/ tersinkron otomatis, dengan opsi koneksi SRV ke MongoDB Atlas (mongodb.js).'
      ]
    }
  ];

  const activeStageData = pipelineStages.find(s => s.id === selectedStage) || pipelineStages[3];

  return (
    <div className="space-y-8">
      {/* Intro Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
            <Cpu className="w-3.5 h-3.5" />
            Ringkasan Arsitektur Engine Bot
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Anatomi Arsitektur Experimental-Bell
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            <span className="font-semibold text-emerald-400">Experimental-Bell (v2.3.0)</span> adalah framework bot WhatsApp berbasis <span className="font-semibold text-slate-100">@whiskeysockets/baileys</span> yang dirancang dengan pola arsitektur hybrid: memadukan <span className="text-cyan-400 font-semibold">Event-Driven Plugin System</span> untuk ratusan fitur utility/game/downloader dengan <span className="text-purple-400 font-semibold">Conversational AI Engine</span> yang mengusung persona bernama <span className="text-pink-400 font-semibold">Bella (Furina Clarissa)</span>.
          </p>
        </div>
      </div>

      {/* Interactive Pipeline Diagram */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Alur Pemrosesan Pesan (Message Lifecycle Pipeline)
          </h3>
          <span className="text-xs text-slate-400">Klik setiap tahapan untuk melihat detail teknis</span>
        </div>

        {/* Pipeline Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {pipelineStages.map((stage) => {
            const Icon = stage.icon;
            const isSelected = selectedStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      STEP {stage.step}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${stage.badgeColor}`}>
                      {stage.file.split(' ')[0]}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${stage.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="font-semibold text-slate-100 text-sm group-hover:text-emerald-400 transition-colors">
                  {stage.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {stage.description}
                </p>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center text-xs font-medium text-emerald-400 gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sedang Dipilih
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Stage Inspector Details */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <activeStageData.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-emerald-400 font-semibold">
                  DETAIL TAHAPAN {activeStageData.step}
                </div>
                <h4 className="text-lg font-bold text-white">
                  {activeStageData.title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>File: {activeStageData.file}</span>
            </div>
          </div>

          <p className="text-sm text-slate-300">
            {activeStageData.description}
          </p>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Mekanisme Teknis Internal:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeStageData.details.map((detail, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Boxes className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">Plugin Command Pattern</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Seluruh fitur bot diisolasi di folder <code className="text-cyan-400 font-mono">helpers/Events/</code>. Setiap file (seperti <code className="text-slate-300">ai.js</code>, <code className="text-slate-300">downloader.js</code>, <code className="text-slate-300">group.js</code>) mendaftarkan event melalui fungsi <code className="text-amber-400 font-mono">ev.on({'{ cmd, tag, energy }'}, handler)</code>. Ini membuat sistem sangat modular dan mudah diperluas.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">Bella Interactive Persona</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bot tidak hanya merespon command ber-prefix, melainkan memiliki persona manusia perempuan bernama <span className="text-purple-300 font-medium">Furina Clarissa (Bella)</span> di <code className="text-purple-400 font-mono">helpers/interactive.js</code>. Bot dapat merespon pesan suara (voice notes) via transkripsi otomatis dan analisis gambar multimodal via Gemini.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">Sistem Energi & Ekonomi RPG</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Setiap user memiliki kuota <span className="text-amber-400 font-semibold">Energi (⚡)</span>, <span className="text-cyan-400 font-semibold">Koin</span>, dan level di <code className="text-amber-400 font-mono">toolkit/inventory.js</code>. Menjalankan command AI atau downloader memerlukan biaya energi tertentu yang dapat dicas secara bertahap atau dibeli via sistem premium.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">Dual-Layer Storage</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Menggunakan file JSON lokal di <code className="text-emerald-400 font-mono">toolkit/db/</code> (<code className="text-slate-300">users.json</code>, <code className="text-slate-300">preferences.json</code>) yang dibaca & ditulis secara asinkron, dengan dukungan opsional sinkronisasi cloud MongoDB Atlas melalui <code className="text-emerald-400 font-mono">toolkit/mongodb.js</code> jika variabel SRV URI diisi.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Radio className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">Hot-Reload File Detector</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Melalui <code className="text-blue-400 font-mono">toolkit/detector.js</code> yang memanfaatkan library <span className="text-slate-200 font-medium">chokidar</span>, developer dapat mengubah kode command di <code className="text-slate-300">helpers/Events/</code> secara langsung di server tanpa perlu mematikan atau menyambungkan ulang sesi WhatsApp bot!
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Terminal className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">Remote Debugging & Eval</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bot dilengkapi fitur konsol remote untuk owner WhatsApp: prefix <code className="text-rose-400 font-mono">&gt;</code> untuk Node.js eval langsung, <code className="text-rose-400 font-mono">=&gt;</code> untuk eval async return, dan <code className="text-rose-400 font-mono">$</code> untuk bash shell execution langsung dari jendela obrolan WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
};
