import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Search, 
  Filter, 
  Crown, 
  FileCode, 
  Image as ImageIcon, 
  Play, 
  Tag, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BotCommand } from '../data/botData';

interface CommandCatalogViewProps {
  commands: BotCommand[];
  onTestCommand?: (cmd: string) => void;
}

export const CommandCatalogView: React.FC<CommandCatalogViewProps> = ({ commands, onTestCommand }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterPremium, setFilterPremium] = useState<boolean>(false);
  const [filterMedia, setFilterMedia] = useState<boolean>(false);

  // Group tags into user-friendly categories
  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'ai', label: 'AI & Art' },
    { id: 'downloader', label: 'Downloader' },
    { id: 'group', label: 'Grup WhatsApp' },
    { id: 'game', label: 'Game & Kuis' },
    { id: 'rpg', label: 'RPG Survival' },
    { id: 'maker', label: 'Stiker & Maker' },
    { id: 'tools', label: 'Tools & Utilities' },
    { id: 'owner', label: 'Owner Only' },
    { id: 'converter', label: 'Converter' },
    { id: 'search', label: 'Search' },
    { id: 'relationship', label: 'Profil & Cas' },
    { id: 'tts', label: 'TTS & Voice' },
  ];

  const filteredCommands = useMemo(() => {
    return commands.filter(cmd => {
      // Category match
      if (selectedCategory !== 'all') {
        const fileCat = cmd.file.replace('.js', '').toLowerCase();
        const tagCat = cmd.tag.toLowerCase();
        if (selectedCategory === 'ai') {
          if (!['ai.js'].includes(cmd.file) && !['ai', 'stablediffusion', 'art', 'voice_changer'].includes(tagCat)) {
            return false;
          }
        } else if (fileCat !== selectedCategory && tagCat !== selectedCategory) {
          return false;
        }
      }

      // Premium match
      if (filterPremium && !cmd.premium) return false;

      // Media match
      if (filterMedia && !cmd.hasMedia) return false;

      // Search match
      if (search) {
        const q = search.toLowerCase();
        const matchPrimary = cmd.primaryCmd.toLowerCase().includes(q);
        const matchAliases = cmd.aliases.some(a => a.toLowerCase().includes(q));
        const matchTag = cmd.tag.toLowerCase().includes(q);
        const matchFile = cmd.file.toLowerCase().includes(q);
        return matchPrimary || matchAliases || matchTag || matchFile;
      }

      return true;
    });
  }, [commands, selectedCategory, filterPremium, filterMedia, search]);

  return (
    <div className="space-y-6">
      {/* Header intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
            <Zap className="w-3.5 h-3.5" />
            Registry Event Dispatcher
          </div>
          <h2 className="text-xl font-bold text-white">
            Katalog Perintah & Event Handlers
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Terdeteksi <span className="text-emerald-400 font-bold">{commands.length}</span> handler perintah aktif dengan lebih dari <span className="text-amber-400 font-bold">400+ alias</span> pada sistem bot Experimental-Bell.
          </p>
        </div>

        {/* Stats counters */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400">Hasil Filter</div>
            <div className="text-sm font-bold font-mono text-emerald-400">{filteredCommands.length} Cmd</div>
          </div>
        </div>
      </div>

      {/* Filter and search controls */}
      <div className="space-y-3">
        {/* Search & toggle pills */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari perintah (contoh: .tiktok, .stiker, .kick, .ai, .daftar)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterPremium(!filterPremium)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                filterPremium
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              Khusus Premium
            </button>

            <button
              onClick={() => setFilterMedia(!filterMedia)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                filterMedia
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Perlu Media
            </button>
          </div>
        </div>

        {/* Categories scroll pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-semibold shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of commands */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredCommands.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
            <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Tidak ada command yang cocok dengan filter atau pencarian Anda.</p>
            <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci lain seperti "tiktok", "ai", atau ubah kategori.</p>
          </div>
        ) : (
          filteredCommands.map((cmd, idx) => {
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-850/60 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1">
                      .{cmd.primaryCmd}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {cmd.premium && (
                        <span className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Crown className="w-2.5 h-2.5" />
                          VIP
                        </span>
                      )}
                      {cmd.energy > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {cmd.energy} ⚡
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-800">
                          Gratis
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Aliases */}
                  {cmd.aliases.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mb-2">
                      <span className="text-[10px] text-slate-400 font-mono">Alias:</span>
                      {cmd.aliases.slice(0, 5).map((a, i) => (
                        <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                          .{a}
                        </span>
                      ))}
                      {cmd.aliases.length > 5 && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          +{cmd.aliases.length - 5} lagi
                        </span>
                      )}
                    </div>
                  )}

                  {/* Metadata labels */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-cyan-400" />
                      {cmd.tag}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-400 truncate">
                      {cmd.file}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {cmd.hasMedia ? '📷 Perlu Kirim/Reply Media' : '💬 Perintah Teks'}
                  </span>
                  {onTestCommand && (
                    <button
                      onClick={() => onTestCommand(`.${cmd.primaryCmd}`)}
                      className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span>Coba</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
