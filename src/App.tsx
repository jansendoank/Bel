/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bot, 
  FolderCheck, 
  FileCode, 
  Terminal, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Folder, 
  FolderOpen,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const originalBotStructure = [
  {
    name: 'connection',
    type: 'dir',
    desc: 'Modul koneksi Baileys WebSocket & QR/Pairing',
    files: ['systemConnext.js']
  },
  {
    name: 'helpers',
    type: 'dir',
    desc: 'Handler logika pesan, middleware filter, & command dispatcher',
    files: [
      'client.js',
      'eventGame.js',
      'events.js',
      'initialize.js',
      'interactive.js',
      'reaction.js',
      'stubTypeMsg.js',
      'utils.js',
      'Events/about.js',
      'Events/ai.js',
      'Events/converter.js',
      'Events/downloader.js',
      'Events/game.js',
      'Events/group.js',
      'Events/maker.js',
      'Events/others.js',
      'Events/owner.js',
      'Events/relationship.js',
      'Events/reloadevents.js',
      'Events/rpg.js',
      'Events/search.js',
      'Events/sepamotepe.js',
      'Events/tools.js',
      'Events/tts.js'
    ]
  },
  {
    name: 'machine',
    type: 'dir',
    desc: 'Integrasi AI (DeepSeek, Gemini, GPT), TTS, & Transcribe',
    files: [
      'chess.js',
      'dashboard.js',
      'deepseek.js',
      'encrypt.js',
      'gemini.js',
      'gpt3.js',
      'gtts.js',
      'imageEdit.js',
      'jadwalsholat.js',
      'livechart.js',
      'musixsearch.js',
      'reasoner.js',
      'transcribe.js'
    ]
  },
  {
    name: 'toolkit',
    type: 'dir',
    desc: 'Utility konversi FFmpeg, EXIF stiker, MongoDB, & konfigurasi',
    files: [
      'catbox.js',
      'cdn.termai.js',
      'color.js',
      'detector.js',
      'exif.js',
      'ffmpeg.js',
      'func.js',
      'inventory.js',
      'mediafire.js',
      'mongodb.js',
      'prettier.js',
      'role.js',
      'store.js',
      'telegraph.js',
      'tmpfiles.js',
      'usr.js',
      'db/audio.json',
      'db/badwords.json',
      'db/cmd.json',
      'db/fquoted.json',
      'db/links.json',
      'db/preferences.json',
      'db/response.json',
      'db/setCmd.json',
      'db/stickersCmd.json',
      'db/user/users.json',
      'set/bell.jpg',
      'set/config.json',
      'set/global.js',
      'set/prototype.js',
      'set/string.prototype.js',
      'set/locale/en.js',
      'set/locale/id.js',
      'set/locale/en/about.js',
      'set/locale/en/reaction.js',
      'set/locale/id/others.js'
    ]
  },
  {
    name: 'Root Files (Berkas Utama)',
    type: 'root',
    desc: 'Entry point dan metadata bot',
    files: [
      'index.js',
      'package.json',
      'package-lock.json',
      'readme.md',
      'LICENSE',
      'version',
      '.prettierrc',
      '.prettierignore'
    ]
  }
];

export default function App() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'connection': true,
    'helpers': true,
    'machine': false,
    'toolkit': false,
    'Root Files (Berkas Utama)': true
  });

  const toggle = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8 selection:bg-emerald-500/30 selection:text-emerald-300">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Experimental-Bell-master
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    Default ZIP Clone
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Path: <code className="text-slate-300 font-mono font-medium">/Experimental-Bell-master/</code> • 100% Murni & Tanpa Modifikasi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>82 File Asli Terverifikasi</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-emerald-400">Status Pembersihan: </span>
            Semua berkas tambahan yang tidak diperlukan (seperti <em>server backend kustom, dashboard besar, dan komponen tambahan</em>) telah <strong>dihapus seluruhnya</strong>. Di workspace sekarang <strong>hanya tersisa berkas asli bawaan file ZIP</strong> yang tersimpan di direktori <code className="text-emerald-300 font-mono">Experimental-Bell-master/</code>.
          </div>
        </div>

        {/* Why there are 82 files info box */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 text-xs leading-relaxed text-slate-300">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Kenapa Jumlah Berkas di ZIP Ada 82 File?
          </h2>
          <p>
            Bot WhatsApp <strong>Experimental-Bell</strong> dari author aslinya (<em>@rifza.p.p</em>) memang dibuat dengan arsitektur <strong>Modular Plugin</strong> terpisah, bukan satu file tunggal:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-300">
            <li className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <strong className="text-emerald-400 font-mono">16 File Fitur (helpers/Events/):</strong><br />
              Tiap kategori (AI, Downloader, Game, RPG, Group, Stiker) dipisah ke filenya masing-masing.
            </li>
            <li className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <strong className="text-cyan-400 font-mono">13 File AI & Machine (machine/):</strong><br />
              Modul terpisah untuk DeepSeek, Gemini, GPT, Google TTS, transkrip VN, dan catur.
            </li>
            <li className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <strong className="text-purple-400 font-mono">16 File Utility (toolkit/):</strong><br />
              FFmpeg konverter video/audio, pembuat stiker EXIF, uploader Catbox, dan database MongoDB.
            </li>
            <li className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <strong className="text-amber-400 font-mono">10 File Database JSON (toolkit/db/):</strong><br />
              Penyimpanan bawaan bot untuk data user, badwords, preferensi, dan stiker command.
            </li>
          </ul>
        </div>

        {/* File tree browser */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderCheck className="w-4 h-4 text-emerald-400" />
              Daftar Lengkap Berkas Default ZIP yang Tersimpan
            </h2>
            <span className="text-xs font-mono text-slate-400">Total: 82 File</span>
          </div>

          <div className="space-y-2">
            {originalBotStructure.map((group) => {
              const isOpen = expanded[group.name] ?? false;
              return (
                <div key={group.name} className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                  <button
                    onClick={() => toggle(group.name)}
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isOpen ? (
                        <FolderOpen className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Folder className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="font-mono text-xs font-bold text-slate-200">
                        {group.name}
                      </span>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        — {group.desc}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {group.files.length} file
                      </span>
                      {isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-3 pb-3 pt-1 border-t border-slate-800/60 bg-slate-950/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 text-xs font-mono text-slate-400">
                      {group.files.map((file) => (
                        <div key={file} className="flex items-center gap-1.5 p-1.5 rounded hover:bg-slate-900 text-slate-300 truncate">
                          <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{file}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Execution Commands */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Cara Menjalankan Bot Asli
          </h2>
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-emerald-400 space-y-1 overflow-x-auto">
            <div><span className="text-slate-400"># 1. Masuk ke folder bot asli</span></div>
            <div>cd Experimental-Bell-master</div>
            <div className="pt-2"><span className="text-slate-400"># 2. Install dependensi bot</span></div>
            <div>npm install</div>
            <div className="pt-2"><span className="text-slate-400"># 3. Jalankan bot WhatsApp</span></div>
            <div>npm start</div>
          </div>
        </div>
      </div>
    </div>
  );
}
