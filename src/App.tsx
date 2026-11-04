/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { botData } from './data/botData';
import { Header } from './components/Header';
import { ArchitectureView } from './components/ArchitectureView';
import { CodeExplorerView } from './components/CodeExplorerView';
import { CommandCatalogView } from './components/CommandCatalogView';
import { BellaChatSimulator } from './components/BellaChatSimulator';
import { SecurityAuditView } from './components/SecurityAuditView';
import { SetupGuideView } from './components/SetupGuideView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('architecture');
  const [simulatorPrePrompt, setSimulatorPrePrompt] = useState<string>('');

  const handleTestCommand = (cmd: string) => {
    setSimulatorPrePrompt(cmd);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metadata={botData.metadata}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'architecture' && <ArchitectureView />}

        {activeTab === 'explorer' && (
          <CodeExplorerView
            fileTree={botData.fileTree}
            importantFiles={botData.importantFiles}
          />
        )}

        {activeTab === 'commands' && (
          <CommandCatalogView
            commands={botData.commands}
            onTestCommand={handleTestCommand}
          />
        )}

        {activeTab === 'simulator' && (
          <BellaChatSimulator
            initialPrompt={simulatorPrePrompt}
            onClearInitialPrompt={() => setSimulatorPrePrompt('')}
            personaLogic={botData.config?.cfg?.logic}
          />
        )}

        {activeTab === 'security' && <SecurityAuditView />}

        {activeTab === 'guide' && <SetupGuideView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Analisis Arsitektur <span className="text-emerald-400 font-semibold">{botData.metadata.name}</span> v{botData.metadata.version} • Baileys Multi-Device Bot Engine
          </div>
          <div className="font-mono text-slate-400">
            Node.js ES Modules • Multi-File Auth • Baileys WebSocket
          </div>
        </div>
      </footer>
    </div>
  );
}
