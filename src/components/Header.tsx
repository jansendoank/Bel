import React from 'react';
import { 
  Bot, 
  Terminal, 
  Code2, 
  ShieldAlert, 
  MessageSquare, 
  FolderTree, 
  Cpu, 
  BookOpen, 
  Zap, 
  Users, 
  Sparkles 
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  metadata: {
    name: string;
    version: string;
    author: string;
    library: string;
    totalFiles: number;
    totalCommands: number;
    totalAliases: number;
    persona: string;
  };
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, metadata }) => {
  const tabs = [
    { id: 'architecture', label: 'Arsitektur & Diagram', icon: Cpu },
    { id: 'explorer', label: 'File & Code Explorer', icon: FolderTree },
    { id: 'commands', label: 'Katalog Command', icon: Zap },
    { id: 'simulator', label: 'Simulator Chat Bella', icon: MessageSquare },
    { id: 'security', label: 'Audit Keamanan & Resiko', icon: ShieldAlert },
    { id: 'guide', label: 'Panduan Setup & Clone', icon: BookOpen },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Top bar: Bot identity & stats */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  {metadata.name}
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    v{metadata.version}
                  </span>
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {metadata.library}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {metadata.persona}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Author: <span className="text-slate-200 font-mono font-medium">{metadata.author}</span> • WhatsApp Bot AI Engine & Architecture Analysis
              </p>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400">Total Berkas</div>
              <div className="text-sm font-bold font-mono text-emerald-400">{metadata.totalFiles} File</div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400">Command Engine</div>
              <div className="text-sm font-bold font-mono text-cyan-400">{metadata.totalCommands} Handler</div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400">Total Perintah</div>
              <div className="text-sm font-bold font-mono text-amber-400">400+ Alias</div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400">Estimasi LOC</div>
              <div className="text-sm font-bold font-mono text-purple-400">~15.4K Baris</div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <nav className="flex space-x-1 sm:space-x-2 mt-4 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
