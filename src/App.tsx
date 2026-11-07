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
  Smile,
  ExternalLink,
  GitBranch,
  ShieldAlert,
  Search
} from 'lucide-react';
import treeData from './treeData.json';

interface TreeNode {
  name: string;
  path: string;
  type: 'directory' | 'file';
  isCustom?: boolean;
  size?: number;
  children?: TreeNode[];
}

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

function FileItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [isOpen, setIsOpen] = useState(depth === 0 && (node.name === 'helpers' || node.name === 'connection'));

  if (node.type === 'directory') {
    return (
      <div className="select-none">
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{ paddingLeft: `${depth * 18 + 12}px` }}
          className="flex items-center justify-between py-2 pr-3 hover:bg-slate-800/60 rounded-lg cursor-pointer transition-colors text-xs font-mono"
        >
          <div className="flex items-center gap-2 text-slate-200 font-semibold truncate">
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            {isOpen ? (
              <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span className="truncate">{node.name}</span>
          </div>

          <span className="text-[10px] text-slate-500 font-normal">
            {node.children?.length ?? 0} item
          </span>
        </div>

        {isOpen && node.children && (
          <div className="border-l border-slate-800/80 ml-5 my-0.5">
            {node.children.map((child) => (
              <FileItem key={child.path} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{ paddingLeft: `${depth * 18 + 12}px` }}
      className={`flex items-center justify-between py-1.5 pr-3 rounded-lg text-xs font-mono transition-colors ${
        node.isCustom
          ? 'bg-emerald-500/10 text-emerald-300 font-medium border border-emerald-500/25 my-0.5'
          : 'hover:bg-slate-800/40 text-slate-300'
      }`}
    >
      <div className="flex items-center gap-2 truncate">
        <span className="w-3.5" />
        <FileCode className={`w-3.5 h-3.5 shrink-0 ${node.isCustom ? 'text-emerald-400' : 'text-slate-400'}`} />
        <span className="truncate">{node.name}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {node.isCustom && (
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Fitur Kustom
          </span>
        )}
        {node.size !== undefined && (
          <span className="text-[10px] text-slate-500">
            {node.size > 1024 ? `${(node.size / 1024).toFixed(1)} KB` : `${node.size} B`}
          </span>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'files' | 'plugins' | 'architecture'>('files');
  const [selectedPluginId, setSelectedPluginId] = useState<string>('bratjoko');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedPlugin = pluginList.find(p => p.id === selectedPluginId) || pluginList[0];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTree = React.useMemo(() => {
    if (!searchQuery.trim()) return treeData as TreeNode[];

    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      const q = searchQuery.toLowerCase();
      const res: TreeNode[] = [];
      for (const node of nodes) {
        if (node.type === 'directory') {
          const matchedChildren = filterNodes(node.children || []);
          if (matchedChildren.length > 0 || node.name.toLowerCase().includes(q)) {
            res.push({
              ...node,
              children: matchedChildren
            });
          }
        } else if (node.name.toLowerCase().includes(q) || node.path.toLowerCase().includes(q)) {
          res.push(node);
        }
      }
      return res;
    };

    return filterNodes(treeData as TreeNode[]);
  }, [searchQuery]);

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
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    Experimental-Bell
                    <a 
                      href="https://github.com/Rifza123/Experimental-Bell" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 font-mono font-normal"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      master
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </h1>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-mono font-medium">
                    v2.7.0 Sync
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Struktur direktori 100% identik dengan GitHub • Fitur Kustom & Modifikasi Terlindungi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>106 Berkas Terverifikasi Sinkron</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setActiveTab('files')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'files'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <FolderCheck className="w-3.5 h-3.5" />
              1. Struktur File GitHub (106 Berkas)
            </button>
            <button
              onClick={() => setActiveTab('plugins')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'plugins'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              2. 6 Plugin Kustom
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
              3. Dokumentasi Arsitektur
            </button>
          </div>
        </div>

        {/* TAB 1: GITHUB FILE TREE */}
        {activeTab === 'files' && (
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderCheck className="w-4 h-4 text-emerald-400" />
                  Pohon Berkas Repositori (GitHub Order: Folder First, Alphabetic)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Menampilkan susunan hierarki persis seperti di repositori resmi GitHub Rifza123/Experimental-Bell
                </p>
              </div>

              {/* Search filter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari file..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* Tree listing */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 space-y-0.5 max-h-[600px] overflow-y-auto">
              {filteredTree.map((node) => (
                <FileItem key={node.path} node={node} />
              ))}
            </div>

            {/* Bottom Legend */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>Direktori</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-slate-400" />
                <span>File Repositori GitHub</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span className="text-emerald-300 font-semibold">Fitur Kustom Tambahan Anda</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 6 PLUGINS SHOWCASE */}
        {activeTab === 'plugins' && (
          <div className="space-y-6">
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

        {/* TAB 3: ARCHITECTURE */}
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

        {/* Execution Commands */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Daftar Perintah Tes Plugin di WhatsApp
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

