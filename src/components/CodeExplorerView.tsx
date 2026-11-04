import React, { useState, useEffect, useMemo } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileCode, 
  Search, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  Terminal, 
  ExternalLink,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { BotFileNode } from '../data/botData';

interface CodeExplorerViewProps {
  fileTree: BotFileNode[];
  importantFiles: Record<string, string>;
}

// Map files to specific architecture notes
const fileArchitectureNotes: Record<string, string> = {
  'index.js': 'Entry point utama aplikasi. Menginisialisasi session multi-file Baileys, koneksi WebSocket, listener messages.upsert, event detector file watcher, serta penanganan panggilan telepon.',
  'package.json': 'Definisi dependensi Node.js ES Modules. Menggunakan @whiskeysockets/baileys, axios, pino, chokidar, jimp, canvas, fluent-ffmpeg, moment-timezone, dan mongodb.',
  'connection/systemConnext.js': 'Manajemen siklus koneksi WhatsApp. Menangani status close, open, connecting, reconnection delay, dan pengondisian auth error.',
  'helpers/client.js': 'Middleware filter utama. Memeriksa status banned user, mode public/onlygc/onlypc, anti-private chat, sewa grup, dan meneruskan ke AI interactive atau Command Dispatcher.',
  'helpers/utils.js': 'Normalizer pesan masuk. Mengonversi protobuf Baileys mentah menjadi objek cht terstruktur, mengekstrak sender JID, LID, prefix (#, .), dan mendeteksi fuzzy command matching.',
  'helpers/events.js': 'Command Dispatcher inti (Class EventEmitter). Mendaftarkan ribuan handler dari folder Events/, mengecek perizinan (owner/admin), dan memotong kuota energi user.',
  'helpers/interactive.js': 'Engine percakapan AI interaktif & console remote. Menangani interaksi AI persona Bella (Furina Clarissa), speech-to-text otomatis, vision analysis, serta evaluasi kode (>, $, =>).',
  'machine/reasoner.js': 'Jembatan komunikasi ke backend AI reasoning termai.cc / xterm.tech untuk menghasilkan jawaban percakapan bernuansa manusia.',
  'machine/gemini.js': 'Integrasi multimodal Gemini AI untuk mengenali dan menganalisis gambar yang dikirimkan pengguna ke WhatsApp.',
  'machine/deepseek.js': 'Integrasi model DeepSeek API untuk tugas coding, penalaran mendalam, dan pemecahan masalah.',
  'toolkit/set/config.json': 'Pusat konfigurasi utama bot. Mengatur nomor owner, nama bot, logika/system prompt Bella, tarif energi, pemblokiran telepon, dan menu layout.',
  'toolkit/set/global.js': 'Pendefinisian konstanta global, path alias (fol[0..9]), dan koneksi database MongoDB jika SRV URI disediakan.',
  'helpers/Events/ai.js': 'Koleksi perintah AI generatif (56+ command): voice changer (cover), Stable Diffusion lora/txt2img, photo upscaler (enlarger), filter anime, dan deepseek/gpt.',
  'helpers/Events/downloader.js': 'Modul downloader media (38+ command): TikTok (video/audio/slide/vn), YouTube, Instagram, Pinterest, Facebook, dan Mediafire.',
  'helpers/Events/group.js': 'Modul administrasi grup WhatsApp (46+ command): kick, add, promote, demote, hidetag, tagall, antilink, antibot, setppgc, dan close/open group.',
  'helpers/Events/game.js': 'Modul mini-games interaktif: tebakgambar, tebakanime, susunkata, asahotak, caklontong, tebaklirik, dengan sistem skor dan hadiah koin.',
  'helpers/Events/rpg.js': 'Game RPG Survival: registrasi akun (.daftar), inventori barang, mining, beli/jual di shop, upgrade level, dan klaim hadiah harian.',
  'helpers/Events/sepamotepe.js': 'Modul eksperimental Spam OTP: melakukan request verifikasi berulang ke berbagai gateway SMS/OTP dengan rotasi user-agent dan pool IP acak.',
  'toolkit/exif.js': 'Pembuat metadata stiker WhatsApp WebP. Memasukkan packname dan publisher name ke dalam chunk metadata WebP EXIF.',
  'toolkit/detector.js': 'Live hot-reload detector menggunakan chokidar. Memantau file helpers/Events dan me-reload file seketika saat disimpan tanpa me-restart proses bot.'
};

export const CodeExplorerView: React.FC<CodeExplorerViewProps> = ({ fileTree, importantFiles }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('index.js');
  const [fileContent, setFileContent] = useState<string>(importantFiles['index.js'] || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'helpers': true,
    'helpers/Events': true,
    'connection': true,
    'machine': true,
    'toolkit': true,
    'toolkit/set': true
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleSelectFile = async (path: string) => {
    setSelectedFilePath(path);
    // If we have local preloaded content, set it immediately
    if (importantFiles[path]) {
      setFileContent(importantFiles[path]);
      return;
    }

    // Otherwise fetch live from server
    setIsLoading(true);
    try {
      const res = await fetch(`/api/bot/file?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (data.content) {
        setFileContent(data.content);
      } else if (data.message) {
        setFileContent(`// ${data.message}\n// File path: ${data.path}\n// File size: ${data.size} bytes`);
      } else {
        setFileContent(`// Berkas ${path} tidak dapat dibaca atau berformat biner.`);
      }
    } catch (err) {
      setFileContent(`// Gagal memuat file: ${path}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render file tree recursively
  const renderTree = (nodes: BotFileNode[], parentPath = '') => {
    return (
      <div className="space-y-0.5">
        {nodes.map(node => {
          const currentPath = node.path;
          const isDir = node.type === 'directory';
          const isExpanded = expandedFolders[currentPath] ?? false;
          const isSelected = selectedFilePath === currentPath;

          // Check search query filter
          if (searchQuery) {
            const matchesSelf = node.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPath = currentPath.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchesSelf && !matchesPath && !isDir) return null;
          }

          if (isDir) {
            return (
              <div key={currentPath}>
                <button
                  onClick={() => toggleFolder(currentPath)}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-md transition-colors text-left group"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 shrink-0" />
                  )}
                  {isExpanded ? (
                    <FolderOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 text-slate-400 group-hover:text-slate-300 shrink-0" />
                  )}
                  <span className="font-mono truncate">{node.name}</span>
                </button>
                {isExpanded && node.children && (
                  <div className="pl-4 border-l border-slate-800/80 ml-2 mt-0.5 space-y-0.5">
                    {renderTree(node.children, currentPath)}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={currentPath}
              onClick={() => handleSelectFile(currentPath)}
              className={`w-full flex items-center justify-between gap-1.5 px-2 py-1.5 text-xs rounded-md transition-colors text-left ${
                isSelected
                  ? 'bg-emerald-500/15 text-emerald-400 font-medium border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="font-mono truncate">{node.name}</span>
              </div>
              {node.lines ? (
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {node.lines} L
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  };

  const currentInsight = fileArchitectureNotes[selectedFilePath] || 
    'Modul komponen dalam sistem bot Experimental-Bell yang berperan dalam pemrosesan data, konfigurasi, atau penanganan event.';

  return (
    <div className="space-y-4">
      {/* Search & Quick Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari file atau modul bot (misal: client.js, ai.js, config.json)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>

        {/* Quick shortcut tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <span className="text-slate-400 font-mono text-[11px] shrink-0">Pintasan:</span>
          {['index.js', 'helpers/client.js', 'helpers/interactive.js', 'toolkit/set/config.json', 'helpers/Events/ai.js'].map((f) => (
            <button
              key={f}
              onClick={() => handleSelectFile(f)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors border border-slate-700/60"
            >
              {f.split('/').pop()}
            </button>
          ))}
        </div>
      </div>

      {/* Main split explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start min-h-[650px]">
        {/* Left: Tree View */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-3 h-[650px] flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-emerald-400" />
              Struktur Direktori Bot
            </span>
            <span className="text-[11px] font-mono text-slate-400">83 File</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800">
            {renderTree(fileTree)}
          </div>
        </div>

        {/* Right: Code Viewer & Architecture Insight */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[650px] overflow-hidden">
          {/* File Header */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-100">
                  {selectedFilePath}
                </span>
                <div className="text-[11px] text-slate-400">
                  {fileContent.split('\n').length} baris kode
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Architecture Insight Bar */}
          <div className="bg-emerald-500/5 border-b border-emerald-500/20 px-4 py-2.5 flex items-start gap-2.5 text-xs text-slate-300">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-emerald-400">Peran Berkas: </span>
              <span>{currentInsight}</span>
            </div>
          </div>

          {/* Code Body */}
          <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-slate-400 gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full" />
                <span>Memuat isi berkas...</span>
              </div>
            ) : (
              <pre className="whitespace-pre">
                <code>
                  {fileContent.split('\n').map((line, idx) => (
                    <div key={idx} className="table-row hover:bg-slate-900/60 transition-colors">
                      <span className="table-cell pr-4 text-right select-none text-slate-400 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="table-cell whitespace-pre">
                        {line}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
