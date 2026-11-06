/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();
const path = 'path'.import();
const https = 'https'.import();

/*!-======[ Paths & Assets Config ]======-!*/
const ASSETS_DIR = path.resolve(fol[0], 'assets', 'iqcg');
const FONTS_DIR = path.join(ASSETS_DIR, 'fonts');
const BG_DIR = path.join(ASSETS_DIR, 'backgrounds');
const COLOR_FILE = path.join(ASSETS_DIR, '.color_index');

const REMOTE_ASSETS = [
  {
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Font/SFPRODISPLAYREGULAR.OTF',
    dest: path.join(FONTS_DIR, 'SFPRODISPLAYREGULAR.OTF'),
  },
  {
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Font/SFPRODISPLAYSEMIBOLD.ttf',
    dest: path.join(FONTS_DIR, 'SFPRODISPLAYSEMIBOLD.ttf'),
  },
  {
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Image/bg.jpg',
    dest: path.join(BG_DIR, 'bg.jpg'),
  },
];

const WA_COLORS = [
  '#E53935', '#D81B60', '#8E24AA', '#5E35B1',
  '#1E88E5', '#039BE5', '#00897B', '#43A047',
  '#F4511E', '#FB8C00',
];

async function getNextColor() {
  let idx = 0;
  try {
    if (fs.existsSync(COLOR_FILE)) {
      const raw = fs.readFileSync(COLOR_FILE, 'utf8');
      idx = parseInt(raw) || 0;
    }
  } catch {
    /* first run */
  }
  const color = WA_COLORS[idx % WA_COLORS.length];
  try {
    if (!fs.existsSync(ASSETS_DIR)) {
      fs.mkdirSync(ASSETS_DIR, { recursive: true });
    }
    fs.writeFileSync(COLOR_FILE, String((idx + 1) % WA_COLORS.length));
  } catch {
    /* ignore write error */
  }
  return color;
}

const canvasCfg = {
  canvas: { width: 1920, height: 3413 },
  safeZones: {
    namaAtas: {
      a: 980, b: 1080, c: 250, d: 630,
      fontSize: 55, maxChars: 25,
      font: 'SFProSemiBold', align: 'left',
    },
    foto: {
      a: 1125, b: 1713, c: 240, d: 830,
      radius: 28,
    },
    waktu: {
      a: 1750, b: 1860, c: 233, d: 424,
      fontSize: 45, maxChars: 10,
      font: 'SFProRegular', textColor: '#555555', align: 'center',
    },
    namaBawah: {
      a: 2701, b: 2880, c: 700, d: 1160,
      centerY: 2787,
      fontSize: 67, maxChars: 25,
      font: 'SFProSemiBold', textColor: '#100e0e', align: 'left',
    },
  },
};

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} → ${url}`));
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function ensureAsset(url, dest) {
  try {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return;
  } catch {
    /* not found */
  }
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const buf = await fetchBuffer(url);
  fs.writeFileSync(dest, buf);
}

async function ensureAssets() {
  for (const a of REMOTE_ASSETS) {
    await ensureAsset(a.url, a.dest);
  }
}

let fontsLoaded = false;
function loadFonts(GlobalFonts) {
  if (fontsLoaded || !GlobalFonts) return;
  const semibold = path.join(FONTS_DIR, 'SFPRODISPLAYSEMIBOLD.ttf');
  const regular = path.join(FONTS_DIR, 'SFPRODISPLAYREGULAR.OTF');
  if (fs.existsSync(semibold)) GlobalFonts.registerFromPath(semibold, 'SFProSemiBold');
  if (fs.existsSync(regular)) GlobalFonts.registerFromPath(regular, 'SFProRegular');
  fontsLoaded = true;
}

function roundedClipPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawText(ctx, text, zone, textColor) {
  const { a, b, c, d, fontSize, maxChars, font, align, centerY } = zone;
  const str = String(text).slice(0, maxChars);
  const boxW = d - c;
  const boxH = b - a;
  const cy = centerY !== undefined ? centerY : a + boxH / 2;
  const weight = font === 'SFProSemiBold' ? 'bold' : 'normal';
  let size = fontSize;

  ctx.textBaseline = 'middle';
  while (size > 12) {
    ctx.font = `${weight} ${size}px ${font}`;
    if (ctx.measureText(str).width <= boxW) break;
    size -= 1;
  }

  ctx.font = `${weight} ${size}px ${font}`;
  ctx.fillStyle = textColor;
  ctx.shadowColor = 'transparent';

  if (align === 'center') {
    ctx.textAlign = 'center';
    ctx.fillText(str, c + boxW / 2, cy);
  } else {
    ctx.textAlign = 'left';
    ctx.fillText(str, c, cy);
  }
}

async function drawFoto(ctx, imgBuffer, zone, loadImage) {
  const { a, b, c, d, radius } = zone;
  const x = c;
  const y = a;
  const w = d - c;
  const h = b - a;
  const r = radius || 28;
  const img = await loadImage(imgBuffer);
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;

  ctx.save();
  roundedClipPath(ctx, x, y, w, h, r);
  ctx.clip();
  if (ctx.filter !== undefined) {
    ctx.filter = 'blur(28px)';
  }
  ctx.drawImage(img, x - 40, y - 40, w + 80, h + 80);
  if (ctx.filter !== undefined) {
    ctx.filter = 'none';
  }

  let fw, fh;
  if (imgRatio > boxRatio) {
    fw = w;
    fh = fw / imgRatio;
  } else {
    fh = h;
    fw = fh * imgRatio;
  }

  ctx.drawImage(img, x + (w - fw) / 2, y + (h - fh) / 2, fw, fh);
  ctx.restore();
}

async function generate(nama, waktu, avatarBuffer, namaColor, canvasLib) {
  const { createCanvas, GlobalFonts, loadImage } = canvasLib;
  loadFonts(GlobalFonts);

  const { width, height } = canvasCfg.canvas;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  const bgPath = path.join(BG_DIR, 'bg.jpg');
  if (fs.existsSync(bgPath) && fs.statSync(bgPath).size > 0) {
    const bgImg = await loadImage(bgPath);
    ctx.drawImage(bgImg, 0, 0, width, height);
  } else {
    ctx.fillStyle = '#f0ece4';
    ctx.fillRect(0, 0, width, height);
  }

  // Foto / Avatar Profil
  if (avatarBuffer) {
    await drawFoto(ctx, avatarBuffer, canvasCfg.safeZones.foto, loadImage);
  }

  // Teks
  drawText(ctx, nama, canvasCfg.safeZones.namaAtas, namaColor);
  drawText(ctx, waktu, canvasCfg.safeZones.waktu, canvasCfg.safeZones.waktu.textColor);
  drawText(ctx, nama, canvasCfg.safeZones.namaBawah, canvasCfg.safeZones.namaBawah.textColor);

  return canvas.toBuffer('image/png');
}

/*!-======[ Default Export Function for Experimental-Bell ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { id } = cht;
  const { func } = Exp;

  ev.on(
    {
      cmd: ['iqcg', 'iqcard', 'igqc', 'iqcgen'],
      listmenu: ['iqcg'],
      tag: 'maker',
      energy: 5,
      args: `Contoh format: ${cht.prefix + cht.cmd} mie ayam | 13.56`,
    },
    async ({ args }) => {
      // Input text: nama | waktu
      const input = args || cht.q || '';
      const parts = input.split('|');
      const nama = parts[0]?.trim() || cht.pushName || 'User';
      const waktu =
        parts[1]?.trim() ||
        new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Jakarta',
        });

      // Beri reaksi saat mulai proses
      await Exp.sendMessage(id, {
        react: { text: '🕕', key: cht.key },
      });

      try {
        // Cek modul canvas @napi-rs/canvas
        let canvasLib;
        try {
          canvasLib = await import('@napi-rs/canvas');
        } catch {
          throw new Error(
            'Modul `@napi-rs/canvas` belum terinstall. Silakan pasang dengan `npm install @napi-rs/canvas`.'
          );
        }

        // Pastikan font dan background tersedia
        await ensureAssets();

        // Ambil foto profil pengirim WhatsApp jika ada
        let avatarBuffer = null;
        try {
          const ppUrl = await Exp.profilePictureUrl(cht.sender, 'image');
          if (ppUrl) {
            avatarBuffer = await func.getBuffer(ppUrl);
          }
        } catch {
          /* Fallback tanpa avatar profil */
        }

        const namaColor = await getNextColor();
        const imageBuffer = await generate(nama, waktu, avatarBuffer, namaColor, canvasLib);

        // Sukses render, update reaksi & kirim gambar
        await Exp.sendMessage(id, {
          react: { text: '✅', key: cht.key },
        });

        await Exp.sendMessage(
          id,
          {
            image: imageBuffer,
            caption: `🎨 *IQC Generator*\n• *Nama:* ${nama}\n• *Waktu:* ${waktu}`,
          },
          {
            quoted: cht,
          }
        );
      } catch (error) {
        console.error('[IQCG Error]:', error);
        await Exp.sendMessage(id, {
          react: { text: '❌', key: cht.key },
        });
        cht.reply(`⚠️ Terjadi kesalahan saat membuat IQC:\n${error.message}`);
      }
    }
  );
}
