/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();
const path = 'path'.import();
const https = 'https'.import();
const http = 'http'.import();

/*!-======[ Config & Konstanta Aset ]======-!*/
const ASSETS_DIR = path.resolve(fol[0], 'assets', 'ttqc');
const FONTS_DIR = path.join(ASSETS_DIR, 'fonts');
const TEMPLATE_PATH = path.join(ASSETS_DIR, 'template.png');
const TEMPLATE_URL = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/qyzwa.png';

const FONT_ASSETS = [
  { name: 'PlusJakartaSans-Regular', file: 'PlusJakartaSans-Regular.ttf', url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/PlusJakartaSans-Regular.ttf', family: 'Plus Jakarta Sans' },
  { name: 'PlusJakartaSans-Medium', file: 'PlusJakartaSans-Medium.ttf', url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/PlusJakartaSans-Medium.ttf', family: 'Plus Jakarta Sans' },
  { name: 'PlusJakartaSans-Bold', file: 'PlusJakartaSans-Bold.ttf', url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/PlusJakartaSans-Bold.ttf', family: 'Plus Jakarta Sans' },
  { name: 'FontAwesome-Solid', file: 'fa-solid-900.ttf', url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/fa-solid-900.ttf', family: 'Font Awesome 6 Free' },
  { name: 'NotoColorEmoji', file: 'NotoColorEmoji.ttf', url: 'https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf', family: 'Noto Color Emoji' },
];

const MENU_ICONS = [
  { unicode: '\uf3e5', text: 'Balas', color: '#000000' },
  { unicode: '\uf064', text: 'Teruskan', color: '#000000' },
  { unicode: '\uf0c5', text: 'Salin', color: '#000000' },
  { unicode: '\uf1ab', text: 'Terjemahkan', color: '#000000' },
  { unicode: '\uf2ed', text: 'Hapus untuk saya', color: '#000000' },
  { unicode: '\uf024', text: 'Laporkan', color: '#ea4335' },
];

const cfg = {
  topPPX: 183, topPPY: 83, topPPRadius: 42,
  topNameX: 250, topNameY: 82, topNameSize: 34,
  chatPPX: 75, chatPPRadius: 38,
  textX: 175, textY: 962,
  bubbleWidth: 520, textSize: 30,
  bubbleBgColor: '#ffffff', textColor: '#161823',
};

const DEFAULT_PP = 'https://files.catbox.moe/nwvkbt.png';

/*!-======[ Helper Functions ]======-!*/
function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
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

let assetsLoaded = false;
async function ensureAssets(GlobalFonts) {
  if (assetsLoaded) return;
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }

  if (!fs.existsSync(TEMPLATE_PATH)) {
    const buf = await fetchBuffer(TEMPLATE_URL);
    fs.writeFileSync(TEMPLATE_PATH, buf);
  }

  for (const font of FONT_ASSETS) {
    const dest = path.join(FONTS_DIR, font.file);
    if (!fs.existsSync(dest)) {
      const buf = await fetchBuffer(font.url);
      fs.writeFileSync(dest, buf);
    }
    if (GlobalFonts && fs.existsSync(dest)) {
      try {
        GlobalFonts.registerFromPath(dest, font.family);
      } catch {}
    }
  }
  assetsLoaded = true;
}

async function loadImageSmart(src, loadImage) {
  if (typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'))) {
    return loadImage(await fetchBuffer(src));
  }
  return loadImage(src);
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/(\s+)/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if (!word) continue;
    if (word.trim() === '' && currentLine === '') continue;
    const testLine = currentLine + word;
    if (ctx.measureText(testLine).width > maxWidth) {
      if (currentLine !== '') {
        lines.push(currentLine.trimEnd());
        currentLine = word.trimStart();
      } else {
        lines.push(testLine);
        currentLine = '';
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trimEnd());
  return lines;
}

function drawRoundedRect(ctx, x, y, w, h, r, fill, stroke = null, shadow = false) {
  ctx.save();
  if (shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.05)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 12;
  }
  ctx.fillStyle = fill;
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
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}

function drawCircleImage(ctx, img, cx, cy, r) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

async function renderTikTokChat(username, chatText, avatarSrc, canvasLib) {
  const { createCanvas, loadImage, GlobalFonts } = canvasLib;
  await ensureAssets(GlobalFonts);

  const templateImage = await loadImage(TEMPLATE_PATH);
  const avatarImage = await loadImageSmart(avatarSrc, loadImage);

  const canvas = createCanvas(1080 * 2, 2280 * 2);
  const ctx = canvas.getContext('2d');

  ctx.scale(2, 2);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.clearRect(0, 0, 1080, 2280);
  ctx.drawImage(templateImage, 0, 0, 1080, 2280);

  // Foto profil atas
  drawCircleImage(ctx, avatarImage, cfg.topPPX, cfg.topPPY, cfg.topPPRadius);

  // Nama username atas
  ctx.font = `bold ${cfg.topNameSize}px 'Plus Jakarta Sans', 'Noto Color Emoji'`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(username, cfg.topNameX, cfg.topNameY);

  // Teks chat bubble
  ctx.font = `500 ${cfg.textSize}px 'Plus Jakarta Sans', 'Noto Color Emoji'`;

  const lines = wrapText(ctx, chatText, cfg.bubbleWidth - 52);
  const lineH = cfg.textSize * 1.45;

  let maxW = 0;
  for (const l of lines) {
    const w = ctx.measureText(l).width;
    if (w > maxW) maxW = w;
  }

  const padX = 30;
  const padY = 24;
  const bubbleW = Math.max(maxW + padX * 2, 180);
  const bubbleH = lines.length * lineH + padY * 2;
  const bubbleX = cfg.textX - padX;
  const bubbleY = cfg.textY - padY;

  // Foto profil samping chat bubble
  drawCircleImage(ctx, avatarImage, cfg.chatPPX, bubbleY + bubbleH / 2, cfg.chatPPRadius);
  drawRoundedRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 35, cfg.bubbleBgColor);

  // Isi teks bubble
  ctx.fillStyle = cfg.textColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  lines.forEach((line, i) => {
    const lineY = cfg.textY + i * lineH + cfg.textSize / 2;
    ctx.fillText(line, cfg.textX, lineY);
  });

  // Menu konteks
  const menuX = 90;
  const menuY = bubbleY + bubbleH + 28;
  drawRoundedRect(ctx, menuX, menuY, 565, 580, 40, '#ffffff', 'rgba(0,0,0,0.02)', true);

  const itemH = 90;
  const iconX = menuX + 60;
  const labelX = menuX + 130;
  MENU_ICONS.forEach((item, i) => {
    const cy = menuY + 25 + i * itemH + itemH / 2;
    ctx.fillStyle = item.color;
    ctx.font = `900 34px 'Font Awesome 6 Free'`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.unicode, iconX, cy);
    ctx.font = `500 34px 'Plus Jakarta Sans'`;
    ctx.textAlign = 'left';
    ctx.fillText(item.text, labelX, cy);
  });

  return canvas.toBuffer ? canvas.toBuffer('image/png') : canvas.encode('png');
}

/*!-======[ Default Export Function for Experimental-Bell ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { id } = cht;

  ev.on(
    {
      cmd: ['ttqc', 'tiktokqc', 'ttchat', 'tiktokchat'],
      listmenu: ['ttqc'],
      tag: 'maker',
      energy: 5,
      args: `Contoh format: ${cht.prefix + cht.cmd} Just friend kok cemburu 😂`,
    },
    async ({ args }) => {
      let chatText = args || cht.q || '';
      if (!chatText && cht.quoted) {
        chatText = cht.quoted.text || cht.quoted.body || '';
      }

      if (!chatText) {
        return cht.reply(
          `🎵 *TIKTOK QUOTE CHAT*\n\n` +
          `• \`${cht.prefix + cht.cmd} <teks>\`\n` +
          `• Reply pesan dengan \`${cht.prefix + cht.cmd}\`\n\n` +
          `> Contoh: \`${cht.prefix + cht.cmd} Just friend kok cemburu 😂\``
        );
      }

      if (chatText.length > 200) {
        return cht.reply(`❌ Teks terlalu panjang! Maksimal 200 karakter. (Saat ini: ${chatText.length})`);
      }

      await Exp.sendMessage(id, {
        react: { text: '🕕', key: cht.key },
      });

      try {
        let canvasLib;
        try {
          canvasLib = await import('@napi-rs/canvas');
        } catch {
          throw new Error(
            'Modul `@napi-rs/canvas` belum terpasang. Pasang dengan `npm install @napi-rs/canvas`.'
          );
        }

        const username = cht.pushName || 'User';

        let avatarSrc = DEFAULT_PP;
        try {
          const ppUrl = await Exp.profilePictureUrl(cht.sender, 'image');
          if (ppUrl) avatarSrc = ppUrl;
        } catch {
          /* gunakan DEFAULT_PP */
        }

        const imageBuffer = await renderTikTokChat(username, chatText, avatarSrc, canvasLib);

        await Exp.sendMessage(id, {
          react: { text: '✅', key: cht.key },
        });

        await Exp.sendMessage(
          id,
          {
            image: imageBuffer,
            caption: `🎵 *TikTok Quote Chat*\n• *Pengirim:* ${username}`,
          },
          { quoted: cht }
        );
      } catch (error) {
        console.error('[TTQC Error]:', error);
        await Exp.sendMessage(id, {
          react: { text: '❌', key: cht.key },
        });
        cht.reply(`⚠️ Terjadi kesalahan saat membuat TikTok QC:\n${error.message}`);
      }
    }
  );
}
