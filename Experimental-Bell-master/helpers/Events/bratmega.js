/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();
const path = 'path'.import();
const axios = 'axios'.import();

/*!-======[ Function Imports ]======-!*/
const exif = await (fol[0] + 'exif.js').r();

/*!-======[ Constants & Paths ]======-!*/
const ASSETS_DIR = path.resolve(fol[0], 'assets', 'brat');
const BG_PATH = path.join(ASSETS_DIR, 'bratmega.jpg');
const FONT_PATH = path.join(ASSETS_DIR, 'Poppins.ttf');

const BG_URL = 'https://e.top4top.io/p_385097r0g0.jpg';
const FONT_URL = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Poppins.ttf';
const FONT_NAME = 'PoppinsBratMega';

// Koordinat kertas putih (X: 14% s/d 53%, Y: 26% s/d 82%)
const PAPER = {
  xStart: 0.14,
  yStart: 0.26,
  xEnd: 0.53,
  yEnd: 0.82,
};

/*!-======[ Helpers ]======-!*/
async function fetchBuffer(url) {
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 20000,
  });
  return Buffer.from(res.data);
}

async function ensureAssets(GlobalFonts) {
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  if (!fs.existsSync(BG_PATH)) {
    const buf = await fetchBuffer(BG_URL);
    fs.writeFileSync(BG_PATH, buf);
  }

  if (!fs.existsSync(FONT_PATH)) {
    const buf = await fetchBuffer(FONT_URL);
    fs.writeFileSync(FONT_PATH, buf);
  }

  if (GlobalFonts && fs.existsSync(FONT_PATH) && !global.BratMegaFontRegistered) {
    try {
      GlobalFonts.registerFromPath(FONT_PATH, FONT_NAME);
      global.BratMegaFontRegistered = true;
    } catch {}
  }
}

function splitLongWord(ctx, word, maxW) {
  const parts = [];
  let cur = '';
  for (const ch of [...word]) {
    const test = cur + ch;
    if (ctx.measureText(test).width <= maxW || !cur) {
      cur = test;
    } else {
      parts.push(cur);
      cur = ch;
    }
  }
  if (cur) parts.push(cur);
  return parts;
}

function wrapText(ctx, text, maxW) {
  const words = text.split(' ').filter(Boolean);
  const lines = [];
  let cur = '';
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word;
    if (ctx.measureText(test).width <= maxW) {
      cur = test;
    } else {
      if (cur) lines.push(cur);
      if (ctx.measureText(word).width <= maxW) {
        cur = word;
      } else {
        const parts = splitLongWord(ctx, word, maxW);
        lines.push(...parts.slice(0, -1));
        cur = parts.at(-1) || '';
      }
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function fitText(ctx, text, maxW, maxH) {
  for (let size = 90; size >= 12; size -= 2) {
    ctx.font = `bold ${size}px ${FONT_NAME}`;
    const lh = size * 1.3;
    const lines = wrapText(ctx, text, maxW);
    if (lines.length * lh <= maxH) {
      return { size, lines, lh, totalH: lines.length * lh };
    }
  }
  const size = 12;
  ctx.font = `bold ${size}px ${FONT_NAME}`;
  const lh = size * 1.3;
  const lines = wrapText(ctx, text, maxW);
  const max = Math.floor(maxH / lh);
  return { size, lines: lines.slice(0, max), lh, totalH: Math.min(lines.length, max) * lh };
}

/*!-======[ Default Export Function for Experimental-Bell ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { id } = cht;

  ev.on(
    {
      cmd: ['bratmega', 'megabrat', 'bratkertas'],
      listmenu: ['bratmega'],
      tag: 'maker',
      energy: 5,
      args: `Contoh format: ${cht.prefix + cht.cmd} Halo cuy`,
    },
    async ({ args }) => {
      let text = args || cht.q || '';
      if (!text && cht.quoted) {
        text = cht.quoted.text || cht.quoted.body || '';
      }

      if (!text) {
        return cht.reply(
          `📄 *BRATMEGA STICKER*\n\n` +
          `• \`${cht.prefix + cht.cmd} <teks>\`\n` +
          `• Reply pesan dengan \`${cht.prefix + cht.cmd}\`\n\n` +
          `> Contoh: \`${cht.prefix + cht.cmd} Halo cuy\``
        );
      }

      await Exp.sendMessage(id, {
        react: { text: '⚡', key: cht.key },
      });

      try {
        let canvasLib;
        try {
          canvasLib = await import('@napi-rs/canvas');
        } catch {
          throw new Error('Modul `@napi-rs/canvas` belum terpasang. Jalankan `npm install @napi-rs/canvas`.');
        }

        const { createCanvas, loadImage, GlobalFonts } = canvasLib;
        await ensureAssets(GlobalFonts);

        const image = await loadImage(fs.readFileSync(BG_PATH));
        const W = image.width;
        const H = image.height;
        const canvas = createCanvas(W, H);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, W, H);

        const pad = 0.05;
        const px = W * (PAPER.xStart + pad);
        const py = H * (PAPER.yStart + pad);
        const maxW = W * (PAPER.xEnd - PAPER.xStart - pad * 2);
        const maxH = H * (PAPER.yEnd - PAPER.yStart - pad * 2);

        const { size, lines, lh, totalH } = fitText(ctx, text, maxW, maxH);
        const startY = py + (maxH - totalH) / 2;

        ctx.font = `bold ${size}px ${FONT_NAME}`;
        ctx.fillStyle = '#111111';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        ctx.save();
        ctx.beginPath();
        ctx.rect(px, py, maxW, maxH);
        ctx.clip();

        lines.forEach((line, i) => {
          ctx.fillText(line, px, startY + i * lh);
        });

        ctx.restore();

        const pngBuffer = canvas.toBuffer ? canvas.toBuffer('image/png') : await canvas.encode('png');

        let res = await exif.writeExifImg(pngBuffer, {
          packname: global.stickpack || 'Experimental-Bell',
          author: 'Ⓒ ' + (cht.pushName || 'bratmega'),
        });

        await Exp.sendMessage(id, {
          react: { text: '🔥', key: cht.key },
        });

        await Exp.sendMessage(
          id,
          {
            sticker: {
              url: res,
            },
          },
          { quoted: cht }
        );
      } catch (error) {
        console.error('[BRATMEGA Error]:', error);
        await Exp.sendMessage(id, {
          react: { text: '❌', key: cht.key },
        });
        cht.reply(`⚠️ Terjadi kesalahan saat membuat stiker BratMega:\n${error.message}`);
      }
    }
  );
}
