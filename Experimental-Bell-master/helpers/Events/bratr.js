/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();
const path = 'path'.import();
const axios = 'axios'.import();

/*!-======[ Function Imports ]======-!*/
const exif = await (fol[0] + 'exif.js').r();

/*!-======[ Constants & Paths ]======-!*/
const ASSETS_DIR = path.resolve(fol[0], 'assets', 'brat');
const BG_PATH = path.join(ASSETS_DIR, 'bratr.jpg');
const FONT_PATH = path.join(ASSETS_DIR, 'Poppins.ttf');

const BRAT_IMAGE_URL = 'https://e.top4top.io/p_3828wlnvb0.jpg';
const BRAT_FONT_URL = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Poppins.ttf';

const CANVAS = { width: 1254, height: 1254 };
const SAFE_ZONE = { a: 760, b: 1100, c: 300, d: 950 };
const TEXT_STYLE = {
  fontFamily: 'PoppinsBratR',
  maxFontSize: 80,
  minFontSize: 22,
  lineHeight: 1.18,
  color: '#111111',
  align: 'center',
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
    const buf = await fetchBuffer(BRAT_IMAGE_URL);
    fs.writeFileSync(BG_PATH, buf);
  }

  if (!fs.existsSync(FONT_PATH)) {
    const buf = await fetchBuffer(BRAT_FONT_URL);
    fs.writeFileSync(FONT_PATH, buf);
  }

  if (GlobalFonts && fs.existsSync(FONT_PATH) && !global.BratRFontRegistered) {
    try {
      GlobalFonts.registerFromPath(FONT_PATH, TEXT_STYLE.fontFamily);
      global.BratRFontRegistered = true;
    } catch {}
  }
}

function normalizeText(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function getSafeRect(zone) {
  return {
    x: zone.c,
    y: zone.a,
    w: zone.d - zone.c,
    h: zone.b - zone.a,
    centerX: (zone.c + zone.d) / 2,
    centerY: (zone.a + zone.b) / 2,
  };
}

function setFont(ctx, size) {
  ctx.font = `${size}px ${TEXT_STYLE.fontFamily}`;
}

function splitLongWord(ctx, word, maxWidth) {
  const parts = [];
  let current = '';
  for (const char of [...word]) {
    const test = current + char;
    if (ctx.measureText(test).width <= maxWidth || !current) {
      current = test;
    } else {
      parts.push(current);
      current = char;
    }
  }
  if (current) parts.push(current);
  return parts;
}

function wrapParagraph(ctx, paragraph, maxWidth) {
  const words = paragraph.split(' ').filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
      continue;
    }
    if (current) {
      lines.push(current);
      current = '';
    }
    if (ctx.measureText(word).width <= maxWidth) {
      current = word;
    } else {
      const parts = splitLongWord(ctx, word, maxWidth);
      lines.push(...parts.slice(0, -1));
      current = parts.at(-1) || '';
    }
  }
  if (current) lines.push(current);
  return lines;
}

function wrapText(ctx, text, maxWidth) {
  return text.split('\n').flatMap((paragraph) => {
    const clean = paragraph.trim();
    if (!clean) return [''];
    return wrapParagraph(ctx, clean, maxWidth);
  });
}

function fitText(ctx, text, rect) {
  for (let size = TEXT_STYLE.maxFontSize; size >= TEXT_STYLE.minFontSize; size--) {
    setFont(ctx, size);
    const lineHeight = Math.ceil(size * TEXT_STYLE.lineHeight);
    const lines = wrapText(ctx, text, rect.w);
    if (lines.length * lineHeight <= rect.h) {
      return { size, lines, lineHeight, totalHeight: lines.length * lineHeight };
    }
  }
  const size = TEXT_STYLE.minFontSize;
  setFont(ctx, size);
  const lineHeight = Math.ceil(size * TEXT_STYLE.lineHeight);
  const lines = wrapText(ctx, text, rect.w);
  const maxLines = Math.max(1, Math.floor(rect.h / lineHeight));
  const clipped = lines.slice(0, maxLines);
  if (lines.length > maxLines && clipped.length) {
    let last = clipped[clipped.length - 1];
    while (last.length > 0 && ctx.measureText(`${last}...`).width > rect.w) {
      last = last.slice(0, -1);
    }
    clipped[clipped.length - 1] = `${last}...`;
  }
  return { size, lines: clipped, lineHeight, totalHeight: clipped.length * lineHeight };
}

function drawCenteredText(ctx, text, zone) {
  const rect = getSafeRect(zone);
  const fitted = fitText(ctx, text, rect);
  const startY = rect.y + (rect.h - fitted.totalHeight) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();

  setFont(ctx, fitted.size);
  ctx.fillStyle = TEXT_STYLE.color;
  ctx.textAlign = TEXT_STYLE.align;
  ctx.textBaseline = 'top';

  fitted.lines.forEach((line, i) => {
    ctx.fillText(line, rect.centerX, startY + i * fitted.lineHeight);
  });
  ctx.restore();
}

/*!-======[ Default Export Function for Experimental-Bell ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { id } = cht;

  ev.on(
    {
      cmd: ['bratr', 'rbrat'],
      listmenu: ['bratr'],
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
          `⚠️ *BRATR STICKER*\n\n` +
          `• \`${cht.prefix + cht.cmd} <teks>\`\n` +
          `• Reply pesan dengan \`${cht.prefix + cht.cmd}\`\n\n` +
          `> Contoh: \`${cht.prefix + cht.cmd} Halo cuy\``
        );
      }

      await Exp.sendMessage(id, {
        react: { text: '✍️', key: cht.key },
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
        const canvas = createCanvas(CANVAS.width, CANVAS.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, CANVAS.width, CANVAS.height);
        drawCenteredText(ctx, normalizeText(text), SAFE_ZONE);

        const pngBuffer = canvas.toBuffer ? canvas.toBuffer('image/png') : await canvas.encode('png');

        let res = await exif.writeExifImg(pngBuffer, {
          packname: global.stickpack || 'Experimental-Bell',
          author: 'Ⓒ ' + (cht.pushName || 'bratr'),
        });

        await Exp.sendMessage(id, {
          react: { text: '🫰', key: cht.key },
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
        console.error('[BRATR Error]:', error);
        await Exp.sendMessage(id, {
          react: { text: '❌', key: cht.key },
        });
        cht.reply(`⚠️ Terjadi kesalahan saat membuat stiker BratR:\n${error.message}`);
      }
    }
  );
}
