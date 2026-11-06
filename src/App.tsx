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
  ChevronDown,
  Sparkles,
  Code2,
  Sliders,
  Image as ImageIcon,
  Clock,
  User,
  Zap,
  RefreshCw,
  Copy,
  Check,
  Video,
  MessageSquare,
  FileText,
  Smile
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
      'Events/bratjoko.js (Baru)',
      'Events/bratmega.js (Baru)',
      'Events/bratr.js (Baru)',
      'Events/converter.js',
      'Events/downloader.js',
      'Events/game.js',
      'Events/group.js',
      'Events/iqcg.js (Baru)',
      'Events/maker.js',
      'Events/others.js',
      'Events/owner.js',
      'Events/relationship.js',
      'Events/reloadevents.js',
      'Events/rpg.js',
      'Events/search.js',
      'Events/sepamotepe.js',
      'Events/stabilkan.js (Baru)',
      'Events/tools.js',
      'Events/ttqc.js (Baru)',
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
      'readme.md',
      'LICENSE',
      'version',
      '.prettierrc',
      '.prettierignore'
    ]
  }
];

const pluginList = [
  {
    id: 'bratjoko',
    title: 'BratJoko Sticker',
    cmd: '.bratjoko <teks>',
    tag: 'maker',
    file: 'helpers/Events/bratjoko.js',
    desc: 'Stiker meme Brat Joko Widodo dengan kalkulasi wrapping Poppins dan auto-fit teks di safe zone.',
    snippet: `export default async function on({ cht, Exp, store, ev, is }) {
  ev.on(
    {
      cmd: ['bratjoko', 'jokobrat', 'bratjk'],
      listmenu: ['bratjoko'],
      tag: 'maker',
      energy: 5,
      args: \`Contoh format: \${cht.prefix + cht.cmd} Halo cuy\`,
    },
    async ({ args }) => {
      let text = args || cht.q || (cht.quoted?.text || '');
      /* Render Canvas 1254x1254 + Font Poppins */
      let res = await exif.writeExifImg(pngBuffer, { packname: 'Bell', author: cht.pushName });
      Exp.sendMessage(cht.id, { sticker: { url: res } }, { quoted: cht });
    }
  );
}`
  },
  {
    id: 'bratmega',
    title: 'BratMega Sticker',
    cmd: '.bratmega <teks>',
    tag: 'maker',
    file: 'helpers/Events/bratmega.js',
    desc: 'Stiker Bu Megawati memegang kertas bertuliskan teks kustom dengan clipping area terisolasi (X: 14%-53%, Y: 26%-82%).',
    snippet: `export default async function on({ cht, Exp, store, ev, is }) {
  ev.on(
    {
      cmd: ['bratmega', 'megabrat', 'bratkertas'],
      listmenu: ['bratmega'],
      tag: 'maker',
      energy: 5,
      args: \`Contoh format: \${cht.prefix + cht.cmd} Halo cuy\`,
    },
    async ({ args }) => {
      let text = args || cht.q || (cht.quoted?.text || '');
      /* Render fit text pada koordinat kertas PAPER */
      let res = await exif.writeExifImg(pngBuffer, { packname: 'Bell', author: cht.pushName });
      Exp.sendMessage(cht.id, { sticker: { url: res } }, { quoted: cht });
    }
  );
}`
  },
  {
    id: 'bratr',
    title: 'BratR Sticker',
    cmd: '.bratr <teks>',
    tag: 'maker',
    file: 'helpers/Events/bratr.js',
    desc: 'Stiker Brat R dengan background kustom, font PoppinsBratR, dan animasi reaksi tanda tangan ✍️/🫰.',
    snippet: `export default async function on({ cht, Exp, store, ev, is }) {
  ev.on(
    {
      cmd: ['bratr', 'rbrat'],
      listmenu: ['bratr'],
      tag: 'maker',
      energy: 5,
      args: \`Contoh format: \${cht.prefix + cht.cmd} Halo cuy\`,
    },
    async ({ args }) => {
      let text = args || cht.q || (cht.quoted?.text || '');
      /* Render canvas + font Poppins */
      let res = await exif.writeExifImg(pngBuffer, { packname: 'Bell', author: cht.pushName });
      Exp.sendMessage(cht.id, { sticker: { url: res } }, { quoted: cht });
    }
  );
}`
  },
  {
    id: 'ttqc',
    title: 'TikTok Quote Chat',
    cmd: '.ttqc <teks>',
    tag: 'maker',
    file: 'helpers/Events/ttqc.js',
    desc: 'Chat bubble TikTok style dengan avatar profil, teks wrapped Plus Jakarta Sans, dan context menu.',
    snippet: `export default async function on({ cht, Exp, store, ev, is }) {
  ev.on({ cmd: ['ttqc', 'tiktokqc', 'ttchat'], listmenu: ['ttqc'], tag: 'maker', energy: 5 }, async ({ args }) => {
    /* Render TikTok DM style canvas */
    Exp.sendMessage(cht.id, { image: imageBuffer, caption: '🎵 *TikTok Quote Chat*' }, { quoted: cht });
  });
}`
  },
  {
    id: 'stabilkan',
    title: 'AI Video Stabilizer',
    cmd: '.stabilkan (kirim/reply video)',
    tag: 'tools',
    file: 'helpers/Events/stabilkan.js',
    desc: 'Stabilisasi video bergetar menggunakan server AI Hugging Face Space dengan upload otomatis via tmpFiles.',
    snippet: `export default async function on({ cht, Exp, store, ev, is }) {
  ev.on({
    cmd: ['stabilkan', 'stabilize'],
    tag: 'tools',
    energy: 10,
    media: { type: ['video'], etc: { seconds: 90 }, save: false }
  }, async ({ media }) => {
    let videoUrl = await tmpFiles(media);
    let resultUrl = await waitForResult((await createJob(videoUrl)).job_id);
    Exp.sendMessage(cht.id, { video: Buffer.from(res.data) }, { quoted: cht });
  });
}`
  },
  {
    id: 'iqcg',
    title: 'IQC Generator',
    cmd: '.iqcg <nama> | <waktu>',
    tag: 'maker',
    file: 'helpers/Events/iqcg.js',
    desc: 'iPhone Quote Card 9:16 dengan font SF Pro, rotasi warna WhatsApp dinamis, dan avatar blur background.',
    snippet: `export default async function on({ cht, Exp, store, ev, is }) {
  ev.on({ cmd: ['iqcg', 'iqcard'], tag: 'maker', energy: 5 }, async ({ args }) => {
    let [nama, waktu] = (args || cht.q).split('|');
    let imageBuffer = await generate(nama, waktu, avatarBuffer, namaColor, canvasLib);
    Exp.sendMessage(cht.id, { image: imageBuffer }, { quoted: cht });
  });
}`
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'plugins' | 'architecture' | 'files'>('plugins');
  const [selectedPluginId, setSelectedPluginId] = useState<string>('bratjoko');
  const [copied, setCopied] = useState(false);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'connection': false,
    'helpers': true,
    'machine': false,
    'toolkit': false,
    'Root Files (Berkas Utama)': false
  });

  const toggle = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedPlugin = pluginList.find(p => p.id === selectedPluginId) || pluginList[0];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8 selection:bg-emerald-500/30 selection:text-emerald-300">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Hero */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-inner">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Experimental-Bell Plugin Suite
                  </h1>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-mono font-medium">
                    +6 Plugin Ditambahkan
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Arsitektur WhatsApp Bot Baileys • Total <span className="text-emerald-400 font-medium">88 Berkas</span> Terintegrasi Penuh
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Semua 6 Berkas Sukses Dikonversi</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setActiveTab('plugins')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'plugins'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              1. Daftar 6 Plugin Baru
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'architecture'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              2. Analisis Arsitektur Bell
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'files'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <FolderCheck className="w-3.5 h-3.5" />
              3. Berkas Workspace (88 File)
            </button>
          </div>
        </div>

        {/* TAB 1: 6 PLUGINS SHOWCASE */}
        {activeTab === 'plugins' && (
          <div className="space-y-6">
            {/* Grid of all 6 plugins */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pluginList.map((p) => {
                const isSelected = p.id === selectedPluginId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPluginId(p.id)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-md'
                        : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        {p.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        {p.cmd.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Plugin Detail View */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    {selectedPlugin.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedPlugin.desc}
                  </p>
                </div>

                <button
                  onClick={() => copyCode(selectedPlugin.snippet)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors self-start"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Handler'}</span>
                </button>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-500">Lokasi Berkas: </span>
                  <span className="text-emerald-300 font-semibold">{selectedPlugin.file}</span>
                </div>
                <span className="text-slate-700">•</span>
                <div>
                  <span className="text-slate-500">Menu Tag: </span>
                  <span className="text-cyan-300">'{selectedPlugin.tag}'</span>
                </div>
                <span className="text-slate-700">•</span>
                <div>
                  <span className="text-slate-500">Perintah: </span>
                  <span className="text-amber-300">{selectedPlugin.cmd}</span>
                </div>
              </div>

              {/* Code Snippet */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 max-h-96 overflow-y-auto leading-relaxed">
                <pre>{selectedPlugin.snippet}</pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-emerald-400" />
                Standar Pembuatan Plugin di Experimental-Bell
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Setiap kali Anda ingin menambahkan fitur baru ke bot Experimental-Bell, cukup buat satu file baru di dalam folder <code className="text-emerald-300 font-mono">helpers/Events/&lt;nama&gt;.js</code>. Bot akan otomatis mendeteksinya melalui <code className="text-cyan-300 font-mono">toolkit/detector.js</code> tanpa perlu mengubah file utama bot!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-emerald-400 font-mono text-xs font-bold">1. Stiker EXIF Native</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Bell memiliki modul <code className="text-slate-300 font-mono">toolkit/exif.js</code> bawaan. Stiker dibuat langsung dari buffer PNG menggunakan <code className="text-emerald-300 font-mono">exif.writeExifImg()</code> dengan packname dan author otomatis.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-cyan-400 font-mono text-xs font-bold">2. Manajemen Aset Cerdas</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Font dan gambar background (seperti foto template Megawati / Joko) di-cache lokal di <code className="text-cyan-300 font-mono">toolkit/assets/brat/</code> sehingga tidak boros kuota dan respon stiker menjadi instan.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-purple-400 font-mono text-xs font-bold">3. Shared Media Engine</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Pengunggahan media memanfaatkan fungsi internal seperti <code className="text-purple-300 font-mono">tmpFiles()</code>, downloader <code className="text-purple-300 font-mono">func.getBuffer()</code>, dan auto-crop stiker 1:1.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FILE TREE EXPLORER */}
        {activeTab === 'files' && (
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderCheck className="w-4 h-4 text-emerald-400" />
                Daftar Lengkap Berkas Experimental-Bell
              </h2>
              <span className="text-xs font-mono text-emerald-400 font-semibold">Total: 88 File (6 Plugin Baru)</span>
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
                        {group.files.map((file) => {
                          const isNew = file.includes('(Baru)');
                          return (
                            <div 
                              key={file} 
                              className={`flex items-center gap-1.5 p-1.5 rounded truncate ${
                                isNew 
                                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold' 
                                  : 'hover:bg-slate-900 text-slate-300'
                              }`}
                            >
                              <FileCode className={`w-3.5 h-3.5 shrink-0 ${isNew ? 'text-emerald-400' : 'text-slate-400'}`} />
                              <span className="truncate">{file}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Execution Commands */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Daftar Perintah Tes 6 Plugin di WhatsApp
          </h2>
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-emerald-400 space-y-2 overflow-x-auto">
            <div><span className="text-slate-400"># Jalankan bot:</span> cd Experimental-Bell-master && npm start</div>
            <div className="pt-1 text-slate-400"># 1. Tes Stiker Brat Joko:</div>
            <div className="text-cyan-300">.bratjoko Halo masbro</div>
            <div className="pt-1 text-slate-400"># 2. Tes Stiker Brat Mega (Kertas):</div>
            <div className="text-cyan-300">.bratmega Banteng metal 3 jari</div>
            <div className="pt-1 text-slate-400"># 3. Tes Stiker Brat R:</div>
            <div className="text-cyan-300">.bratr Salam hangat</div>
            <div className="pt-1 text-slate-400"># 4. Tes TikTok Quote Chat:</div>
            <div className="text-cyan-300">.ttqc Just friend kok cemburu 😂</div>
            <div className="pt-1 text-slate-400"># 5. Tes AI Video Stabilizer:</div>
            <div className="text-cyan-300">Kirim/Reply video dengan caption: .stabilkan</div>
            <div className="pt-1 text-slate-400"># 6. Tes IQC Generator:</div>
            <div className="text-cyan-300">.iqcg mie ayam | 13.56</div>
          </div>
        </div>

      </div>
    </div>
  );
}
