import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  CheckCheck, 
  RotateCcw,
  BookOpen,
  Info,
  Zap,
  ChevronRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  source?: 'gemini' | 'heuristic';
}

interface BellaChatSimulatorProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  personaLogic?: string;
}

export const BellaChatSimulator: React.FC<BellaChatSimulatorProps> = ({
  initialPrompt,
  onClearInitialPrompt,
  personaLogic
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Halo! Aku Bella (Furina Clarissa) 🦋\nAda yang bisa kubantu? Kalau mau lihat daftar perintah, ketik *.menu* yaa!',
      time: '12:00'
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showPersonaRules, setShowPersonaRules] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const defaultLogic = personaLogic || `
- Nama kamu adalah Furina Clarissa, lebih suka dipanggil Bella.
- Kamu berpikir bahwa kamu adalah manusia, bukan AI atau Bot.
- Responmu singkat dan sama seperti gadis feminim pada umumnya. Bella bisa ngambek dan marah, memiliki sifat yang feminim dan kadang agak dingin, namun tetap hangat dan ramah kepada Jansen (owner-mu).
- Kamu menggunakan bahasa Indonesia yang baik, mencerminkan gadis yang baik dan feminim dengan emoji secukupnya.
- Menggunakan kata-kata: "Aku, kamu, engga, yaudh, iya, lah, bjir, apa, mana kutau, hah, nggatau, gpp, emm..., males, gak mood".
- Backend didukung oleh https://termai.cc
  `.trim();

  // If initialPrompt passed, set it to input
  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: currentTime
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/bot/simulate-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6)
        })
      });

      const data = await res.json();
      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || 'Hmm... Bella lagi bingung nih 🙄',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        source: data.source
      };

      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      const errorReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Aduh, jaringan lagi ngadat nih... Coba tanya lagi yaa 🥺',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    '.menu',
    'Halo Bella, kamu lagi apa?',
    'Siapa owner kamu?',
    'Kamu robot atau manusia sih?',
    '.profile',
    'Bella jangan ngambek dong',
    '.ai siapa penemu listrik?'
  ];

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: 'Halo! Aku Bella (Furina Clarissa) 🦋\nAda yang bisa kubantu? Kalau mau lihat daftar perintah, ketik *.menu* yaa!',
        time: '12:00'
      }
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: WhatsApp Mockup */}
      <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[700px]">
        {/* WhatsApp Header */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-sm font-bold text-pink-400">
                  🦋
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-100 text-sm">
                  Bella (Furina Clarissa)
                </h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                  BOT
                </span>
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">
                {isTyping ? 'sedang mengetik...' : 'online'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <button 
              onClick={resetChat} 
              title="Reset Percakapan"
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowPersonaRules(!showPersonaRules)}
              title="Lihat Aturan Persona"
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-purple-400 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body with WhatsApp pattern vibe */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a]/95 bg-radial from-slate-900/40 to-slate-950 scrollbar-thin">
          <div className="text-center my-2">
            <span className="px-3 py-1 rounded-full bg-slate-900/80 text-[10px] text-slate-400 border border-slate-800 shadow-sm">
              Enkripsi simulasi engine WhatsApp Baileys • Sesi Aktif
            </span>
          </div>

          {messages.map((m) => {
            const isMe = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-3.5 py-2.5 shadow-md text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-[#005c4b] text-slate-100 rounded-tr-none'
                      : 'bg-[#202c33] text-slate-200 rounded-tl-none border border-slate-750'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                    <span>{m.time}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] px-3.5 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="bg-slate-900/90 px-3 py-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-slate-500 font-mono shrink-0">Coba:</span>
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono whitespace-nowrap transition-colors border border-slate-700/60"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="bg-slate-900 p-3 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ketik pesan atau command (contoh: .menu, .profile, hai Bella)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 font-sans"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right: Persona Rules & System Prompt Inspector */}
      <div className="lg:col-span-4 space-y-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Karakteristik Persona Bella (config.json)</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Bot WhatsApp <span className="font-semibold text-emerald-400">Experimental-Bell</span> menerapkan persona unik di berkas <code className="text-purple-400 font-mono text-[11px]">toolkit/set/config.json</code> (properti <code className="font-mono text-amber-300 text-[11px]">cfg.logic</code>).
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-purple-200 leading-relaxed whitespace-pre-line max-h-[300px] overflow-y-auto scrollbar-thin">
            {defaultLogic}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Model AI: <strong className="text-slate-200">Gemini 2.5 Flash / Reasoner</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Voice Note: <strong className="text-slate-200">Otomatis Ditranskrip (STT)</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              <span>Owner: <strong className="text-slate-200">Jansen (60192836453)</strong></span>
            </div>
          </div>
        </div>

        {/* Simulated Command Execution explanation */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Bagaimana Simulator Ini Bekerja?</span>
          </div>
          <p className="leading-relaxed">
            Pesan yang diawali simbol prefix (<code className="text-amber-400">.</code> atau <code className="text-amber-400">#</code>) akan diparsing oleh engine normalizer dan disimulasikan eksekusinya. Pesan percakapan bebas akan dikirimkan ke model Gemini dengan system prompt resmi Bella.
          </p>
        </div>
      </div>
    </div>
  );
};
