import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const BOT_ROOT = path.resolve(__dirname, 'bot-source/Experimental-Bell-master');

const bellaSystemPrompt = `
Kamu adalah persona AI WhatsApp Bot bernama "Bella" (nama lengkap: Furina Clarissa).
Sifat & Karakteristik:
- Berpikir bahwa kamu adalah manusia perempuan biasa, bukan robot atau AI.
- Responmu singkat, ekspresif, dan sama seperti gaya chat perempuan Indonesia pada umumnya.
- Karakter: kadang ngambek, agak tsundere, sedikit dingin atau malas ("gpp", "bjir", "males", "nggatau", "yaudh", "apaan"), namun tetap peduli dan ramah, terutama kepada Jansen (owner).
- Menggunakan bahasa gaul/santai Indonesia yang natural dan sedikit emoji ekspresif (jangan berlebihan).
- Jika ada pengguna yang mengetik command berawalan titik/pagar seperti .menu, .help, .ai, .ping, jelaskan secara santai apa yang bisa dilakukan atau jawab dengan nada khas Bella.
- Jawab secara ringkas layaknya pesan WhatsApp asli (1 - 3 kalimat).
`;

async function startServer() {
  const app = express();
  app.use(express.json());

  // API endpoint: Get full raw file content
  app.get('/api/bot/file', (req, res) => {
    try {
      const relPath = req.query.path as string;
      if (!relPath) {
        return res.status(400).json({ error: 'Missing path query parameter' });
      }

      // Prevent path traversal
      const safePath = path.normalize(relPath).replace(/^(\.\.[\/\\])+/, '');
      const fullPath = path.join(BOT_ROOT, safePath);

      if (!fullPath.startsWith(BOT_ROOT)) {
        return res.status(403).json({ error: 'Access denied: outside bot directory' });
      }

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const files = fs.readdirSync(fullPath);
        return res.json({ type: 'directory', files });
      }

      // Check if binary
      if (/\.(jpg|png|gif|webp|zip|mp3|mp4|bin)$/i.test(fullPath)) {
        return res.json({
          type: 'binary',
          path: safePath,
          size: stat.size,
          message: 'Binary file cannot be displayed in text editor'
        });
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      return res.json({
        type: 'file',
        path: safePath,
        size: stat.size,
        lines: content.split('\n').length,
        content
      });
    } catch (err: any) {
      console.error('Error reading bot file:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // API endpoint: Simulate Bella AI chat response
  app.post('/api/bot/simulate-chat', async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Try Gemini if API key is present
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({});
        const chatMessages = [
          { role: 'user', parts: [{ text: `[System Instruction: ${bellaSystemPrompt}]` }] },
          { role: 'model', parts: [{ text: 'Iya halo, apa? Aku Bella. Ada apa manggil-manggil?' }] }
        ];

        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            if (item.sender === 'user') {
              chatMessages.push({ role: 'user', parts: [{ text: item.text }] });
            } else if (item.sender === 'bot') {
              chatMessages.push({ role: 'model', parts: [{ text: item.text }] });
            }
          }
        }

        chatMessages.push({ role: 'user', parts: [{ text: message }] });

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: chatMessages,
          config: {
            temperature: 0.85,
            maxOutputTokens: 250
          }
        });

        const reply = geminiRes.text || 'Hmm... apa ya? Lagi ga mood mikir berat nih 🙄';
        return res.json({ reply, source: 'gemini' });
      } catch (err: any) {
        console.warn('Gemini call failed, falling back to local heuristic response:', err.message);
      }
    }

    // Heuristic fallback matching Bella's logic
    const lower = message.toLowerCase().trim();
    let reply = '';

    if (lower.startsWith('.menu') || lower.startsWith('#menu')) {
      reply = `┌──「 🦋 *BELLA - AI BOT* 」\n│⇨ .ai <teks> (Tanya AI)\n│⇨ .tt / .tiktok <url> (Unduh video)\n│⇨ .s / .sticker (Bikin stiker)\n│⇨ .profile / .inventory (Cek koin & energi)\n│⇨ .game / .tebakgambar\n│⇨ .group (Atur grup)\n└───────────────┈ ⳹\n_Mau nyoba fitur yang mana nih? Jangan spam yaa!_`;
    } else if (lower.includes('halo') || lower.includes('hai') || lower.includes('p') === (lower === 'p')) {
      reply = 'Halo juga~ Ada apa nih manggil-manggil Bella? Jangan ganggu kalau ga penting yaa 😌';
    } else if (lower.includes('siapa kamu') || lower.includes('nama kamu')) {
      reply = 'Nama aku Furina Clarissa, tapi panggil Bella aja yaa. Aku bukan robot tauu, enak aja! 😤';
    } else if (lower.includes('owner') || lower.includes('jansen')) {
      reply = 'Owner aku itu Jansen! Dia yang ngurusin server akuu. Kenapa, mau titip salam ke Jansen? 😊';
    } else if (lower.includes('sayang') || lower.includes('cinta')) {
      reply = 'Ihh apaan sih, gombal banget bjir 😳 Jangan bikin salting deh...';
    } else if (lower.includes('termai') || lower.includes('api')) {
      reply = 'Backend aku didukung sama https://termai.cc lho! Layanan API-nya kenceng banget buat bot dan AI ✨';
    } else if (lower.startsWith('.') || lower.startsWith('#')) {
      reply = `Command \`${message.split(' ')[0]}\` udah diterima di sistem event dispatcher! Energi kamu terpotong 1 ⚡. Mau jalanin aksi apa lagi?`;
    } else {
      const casuals = [
        'Emm... gitu ya? Yaudah deh terserah kamu aja 🙄',
        'Bjir beneran? Hahah lucu juga yaa 😂',
        'Nggatau deh, aku lagi males mikir yang rumit-rumit nih 🥱',
        'Gpp kok, emang kamu hari ini lagi ngapain aja?',
        'Lah kok gitu? Coba ceritain lebih jelas dong 🤔'
      ];
      reply = casuals[Math.floor(Math.random() * casuals.length)];
    }

    return res.json({ reply, source: 'heuristic' });
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
