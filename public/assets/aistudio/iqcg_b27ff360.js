import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas'
import { writeFile, mkdir, readFile, access } from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import https from 'node:https'
import te from '../../src/lib/ourin-error.js'

// ─── Plugin Config ────────────────────────────────────────────────────────────

const pluginConfig = {
  name: 'iqcg',
  alias: ['iqcard', 'igqc', 'iqcgen'],
  category: 'canvas',
  description: 'Generate kartu IQC dengan nama dan waktu',
  usage: '.iqcg <nama> | <waktu>',
  example: '.iqcg mie ayam | 13.56',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 1,
  isEnabled: true,
}

// ─── Paths ────────────────────────────────────────────────────────────────────

const __dirname  = dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = join(__dirname, 'iqcg-assets')
const FONTS_DIR  = join(ASSETS_DIR, 'fonts')
const BG_DIR     = join(ASSETS_DIR, 'backgrounds')
const IMG_DIR    = join(ASSETS_DIR, 'images')
const COLOR_FILE = join(ASSETS_DIR, '.color_index')

const REMOTE_ASSETS = [
  {
    url:  'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Font/SFPRODISPLAYREGULAR.OTF',
    dest: join(FONTS_DIR, 'SFPRODISPLAYREGULAR.OTF'),
  },
  {
    url:  'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Font/SFPRODISPLAYSEMIBOLD.ttf',
    dest: join(FONTS_DIR, 'SFPRODISPLAYSEMIBOLD.ttf'),
  },
  {
    url:  'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Image/bg.jpg',
    dest: join(BG_DIR, 'bg.jpg'),
  },
]

// ─── Colors ───────────────────────────────────────────────────────────────────

const WA_COLORS = [
  '#E53935', '#D81B60', '#8E24AA', '#5E35B1',
  '#1E88E5', '#039BE5', '#00897B', '#43A047',
  '#F4511E', '#FB8C00',
]

async function getNextColor() {
  let idx = 0
  try {
    const raw = await readFile(COLOR_FILE, 'utf8')
    idx = parseInt(raw) || 0
  } catch { /* first run */ }
  const color = WA_COLORS[idx % WA_COLORS.length]
  await writeFile(COLOR_FILE, String((idx + 1) % WA_COLORS.length))
  return color
}

// ─── Canvas Config ────────────────────────────────────────────────────────────

const cfg = {
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
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} → ${url}`))
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function ensureAsset(url, dest) {
  try { await access(dest) ; if (statSync(dest).size > 0) return } catch { /* not found */ }
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, await fetchBuffer(url))
}

async function ensureAssets() {
  for (const a of REMOTE_ASSETS) await ensureAsset(a.url, a.dest)
}

let fontsLoaded = false

function loadFonts() {
  if (fontsLoaded) return
  const semibold = join(FONTS_DIR, 'SFPRODISPLAYSEMIBOLD.ttf')
  const regular  = join(FONTS_DIR, 'SFPRODISPLAYREGULAR.OTF')
  if (existsSync(semibold)) GlobalFonts.registerFromPath(semibold, 'SFProSemiBold')
  if (existsSync(regular))  GlobalFonts.registerFromPath(regular,  'SFProRegular')
  fontsLoaded = true
}

function roundedClipPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawText(ctx, text, zone, textColor) {
  const { a, b, c, d, fontSize, maxChars, font, align, centerY } = zone
  const str  = String(text).slice(0, maxChars)
  const boxW = d - c
  const boxH = b - a
  const cy   = centerY !== undefined ? centerY : a + boxH / 2
  const weight = font === 'SFProSemiBold' ? 'bold' : 'normal'
  let size = fontSize

  ctx.textBaseline = 'middle'
  while (size > 12) {
    ctx.font = `${weight} ${size}px ${font}`
    if (ctx.measureText(str).width <= boxW) break
    size -= 1
  }

  ctx.font      = `${weight} ${size}px ${font}`
  ctx.fillStyle = textColor
  ctx.shadowColor = 'transparent'

  if (align === 'center') {
    ctx.textAlign = 'center'
    ctx.fillText(str, c + boxW / 2, cy)
  } else {
    ctx.textAlign = 'left'
    ctx.fillText(str, c, cy)
  }
}

async function drawFoto(ctx, imgBuffer, zone) {
  const { a, b, c, d, radius } = zone
  const x = c, y = a, w = d - c, h = b - a, r = radius || 28
  const img = await loadImage(imgBuffer)
  const imgRatio = img.width / img.height
  const boxRatio = w / h

  ctx.save()
  roundedClipPath(ctx, x, y, w, h, r)
  ctx.clip()
  ctx.filter = 'blur(28px)'
  ctx.drawImage(img, x - 40, y - 40, w + 80, h + 80)
  ctx.filter = 'none'

  let fw, fh
  if (imgRatio > boxRatio) { fw = w; fh = fw / imgRatio }
  else                     { fh = h; fw = fh * imgRatio }

  ctx.drawImage(img, x + (w - fw) / 2, y + (h - fh) / 2, fw, fh)
  ctx.restore()
}

async function generate(nama, waktu, avatarBuffer, namaColor) {
  loadFonts()
  const { width, height } = cfg.canvas
  const canvas = createCanvas(width, height)
  const ctx    = canvas.getContext('2d')

  // Background
  const bgPath = join(BG_DIR, 'bg.jpg')
  if (existsSync(bgPath) && statSync(bgPath).size > 0) {
    const bgImg = await loadImage(bgPath)
    ctx.drawImage(bgImg, 0, 0, width, height)
  } else {
    ctx.fillStyle = '#f0ece4'
    ctx.fillRect(0, 0, width, height)
  }

  // Foto
  if (avatarBuffer) {
    await drawFoto(ctx, avatarBuffer, cfg.safeZones.foto)
  }

  // Teks
  drawText(ctx, nama,  cfg.safeZones.namaAtas,  namaColor)
  drawText(ctx, waktu, cfg.safeZones.waktu,      cfg.safeZones.waktu.textColor)
  drawText(ctx, nama,  cfg.safeZones.namaBawah,  cfg.safeZones.namaBawah.textColor)

  return canvas.toBuffer('image/png')
}

// ─── Handler ──────────────────────────────────────────────────────────────────

async function handler(m, { sock }) {
  const input = m.args?.join(' ')?.trim()

  if (!input) {
    return m.reply(
      `🎨 *ɪǫᴄ ɢᴇɴᴇʀᴀᴛᴏʀ*\n\n` +
      `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
      `┃ ◦ \`${m.prefix}iqcg <nama> | <waktu>\`\n` +
      `╰┈┈⬡\n\n` +
      `> Contoh: \`${m.prefix}iqcg mie ayam | 13.56\``
    )
  }

  // Parse nama & waktu
  const parts = input.split('|')
  const nama  = parts[0]?.trim() || m.pushName || 'User'
  const waktu = parts[1]?.trim() || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })

  m.react('🕕')

  try {
    await ensureAssets()

    // Ambil avatar pengirim
    let avatarBuffer = null
    try {
      const ppUrl = await sock.profilePictureUrl(m.sender, 'image')
      avatarBuffer = await fetchBuffer(ppUrl)
    } catch { /* pakai background saja tanpa foto */ }

    const namaColor = await getNextColor()
    const imageBuffer = await generate(nama, waktu, avatarBuffer, namaColor)

    m.react('✅')
    await sock.sendMessage(m.chat, { image: imageBuffer, caption: '' }, { quoted: m })
  } catch (error) {
    console.error('[IQCG]', error.message)
    m.react('☢')
    m.reply(te(m.prefix, m.command, m.pushName))
  }
}

export { pluginConfig as config, handler }
