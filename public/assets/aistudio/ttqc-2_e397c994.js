import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import https from 'node:https'
import http from 'node:http'
import te from '../../src/lib/ourin-error.js'

const pluginConfig = {
  name: 'ttqc',
  alias: ['tiktokqc', 'ttchat', 'tiktokchat'],
  category: 'canvas',
  description: 'Membuat gambar chat TikTok style',
  usage: '.ttqc <text>',
  example: '.ttqc Just friend kok cemburu 😂',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 1,
  isEnabled: true,
}

// ─── Config & Konstanta ──────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))

// Simpan asset di folder plugins/canvas/ttqc-assets agar tidak bentrok
const ASSETS_DIR    = join(__dirname, 'ttqc-assets')
const FONTS_DIR     = join(ASSETS_DIR, 'fonts')
const TEMPLATE_PATH = join(ASSETS_DIR, 'template.png')
const TEMPLATE_URL  = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/qyzwa.png'

const FONT_ASSETS = [
  { name: 'PlusJakartaSans-Regular', file: 'PlusJakartaSans-Regular.ttf', url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/PlusJakartaSans-Regular.ttf', family: 'Plus Jakarta Sans' },
  { name: 'PlusJakartaSans-Medium',  file: 'PlusJakartaSans-Medium.ttf',  url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/PlusJakartaSans-Medium.ttf',  family: 'Plus Jakarta Sans' },
  { name: 'PlusJakartaSans-Bold',    file: 'PlusJakartaSans-Bold.ttf',    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/PlusJakartaSans-Bold.ttf',    family: 'Plus Jakarta Sans' },
  { name: 'FontAwesome-Solid',       file: 'fa-solid-900.ttf',            url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/fa-solid-900.ttf',            family: 'Font Awesome 6 Free' },
  { name: 'NotoColorEmoji',          file: 'NotoColorEmoji.ttf',          url: 'https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf',                    family: 'Noto Color Emoji' },
]

const MENU_ICONS = [
  { unicode: '\uf3e5', text: 'Balas',           color: '#000000' },
  { unicode: '\uf064', text: 'Teruskan',         color: '#000000' },
  { unicode: '\uf0c5', text: 'Salin',            color: '#000000' },
  { unicode: '\uf1ab', text: 'Terjemahkan',      color: '#000000' },
  { unicode: '\uf2ed', text: 'Hapus untuk saya', color: '#000000' },
  { unicode: '\uf024', text: 'Laporkan',         color: '#ea4335' },
]

const cfg = {
  topPPX: 183, topPPY: 83, topPPRadius: 42,
  topNameX: 250, topNameY: 82, topNameSize: 34,
  chatPPX: 75, chatPPRadius: 38,
  textX: 175, textY: 962,
  bubbleWidth: 520, textSize: 30,
  bubbleBgColor: '#ffffff', textColor: '#161823',
}

const DEFAULT_PP = 'https://files.catbox.moe/nwvkbt.png'

// ─── Helper Functions ─────────────────────────────────────────────────────────

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
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

async function ensureAssets() {
  await mkdir(FONTS_DIR, { recursive: true })

  if (!existsSync(TEMPLATE_PATH)) {
    await writeFile(TEMPLATE_PATH, await fetchBuffer(TEMPLATE_URL))
  }

  for (const font of FONT_ASSETS) {
    const dest = join(FONTS_DIR, font.file)
    if (!existsSync(dest)) {
      await writeFile(dest, await fetchBuffer(font.url))
    }
    GlobalFonts.registerFromPath(dest, font.family)
  }
}

async function loadImageSmart(src) {
  if (typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'))) {
    return loadImage(await fetchBuffer(src))
  }
  if (Buffer.isBuffer(src)) return loadImage(src)
  return loadImage(src)
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/(\s+)/)
  const lines = []
  let currentLine = ''

  for (const word of words) {
    if (!word) continue
    if (word.trim() === '' && currentLine === '') continue
    const testLine = currentLine + word
    if (ctx.measureText(testLine).width > maxWidth) {
      if (currentLine !== '') {
        lines.push(currentLine.trimEnd())
        currentLine = word.trimStart()
      } else {
        lines.push(testLine)
        currentLine = ''
      }
    } else {
      currentLine = testLine
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trimEnd())
  return lines
}

function drawRoundedRect(ctx, x, y, w, h, r, fill, stroke = null, shadow = false) {
  ctx.save()
  if (shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.05)'
    ctx.shadowBlur = 40
    ctx.shadowOffsetY = 12
  }
  ctx.fillStyle = fill
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
  ctx.fill()
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke() }
  ctx.restore()
}

function drawCircleImage(ctx, img, cx, cy, r) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2)
  ctx.restore()
}

async function renderTikTokChat(username, chatText, avatarSrc) {
  await ensureAssets()

  const templateImage = await loadImage(TEMPLATE_PATH)
  const avatarImage   = await loadImageSmart(avatarSrc)

  const canvas = createCanvas(1080 * 2, 2280 * 2)
  const ctx    = canvas.getContext('2d')

  ctx.scale(2, 2)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  ctx.clearRect(0, 0, 1080, 2280)
  ctx.drawImage(templateImage, 0, 0, 1080, 2280)

  // Foto profil atas
  drawCircleImage(ctx, avatarImage, cfg.topPPX, cfg.topPPY, cfg.topPPRadius)

  // Nama username atas
  ctx.font = `bold ${cfg.topNameSize}px 'Plus Jakarta Sans', 'Noto Color Emoji'`
  ctx.fillStyle = '#000000'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(username, cfg.topNameX, cfg.topNameY)

  // Teks chat bubble
  ctx.font = `500 ${cfg.textSize}px 'Plus Jakarta Sans', 'Noto Color Emoji'`

  const lines = wrapText(ctx, chatText, cfg.bubbleWidth - 52)
  const lineH = cfg.textSize * 1.45

  let maxW = 0
  for (const l of lines) {
    const w = ctx.measureText(l).width
    if (w > maxW) maxW = w
  }

  const padX = 30, padY = 24
  const bubbleW = Math.max(maxW + padX * 2, 180)
  const bubbleH = lines.length * lineH + padY * 2
  const bubbleX = cfg.textX - padX
  const bubbleY = cfg.textY - padY

  // Foto profil chat
  drawCircleImage(ctx, avatarImage, cfg.chatPPX, bubbleY + bubbleH / 2, cfg.chatPPRadius)
  drawRoundedRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 35, cfg.bubbleBgColor)

  // Isi teks bubble
  ctx.fillStyle = cfg.textColor
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  lines.forEach((line, i) => {
    const lineY = cfg.textY + i * lineH + cfg.textSize / 2
    ctx.fillText(line, cfg.textX, lineY)
  })

  // Menu konteks
  const menuX = 90, menuY = bubbleY + bubbleH + 28
  drawRoundedRect(ctx, menuX, menuY, 565, 580, 40, '#ffffff', 'rgba(0,0,0,0.02)', true)

  const itemH = 90, iconX = menuX + 60, labelX = menuX + 130
  MENU_ICONS.forEach((item, i) => {
    const cy = menuY + 25 + i * itemH + itemH / 2
    ctx.fillStyle = item.color
    ctx.font = `900 34px 'Font Awesome 6 Free'`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(item.unicode, iconX, cy)
    ctx.font = `500 34px 'Plus Jakarta Sans'`
    ctx.textAlign = 'left'
    ctx.fillText(item.text, labelX, cy)
  })

  return canvas.encode('png')
}

// ─── Handler Bot ──────────────────────────────────────────────────────────────

async function handler(m, { sock }) {
  // Ambil teks: dari args atau dari pesan yang di-reply
  let chatText = m.args?.join(' ')?.trim()

  if (!chatText && m.quoted) {
    chatText = m.quoted.text || m.quoted.body || ''
  }

  if (!chatText) {
    return m.reply(
      `🎵 *ᴛɪᴋᴛᴏᴋ ǫᴜᴏᴛᴇ ᴄʜᴀᴛ*\n\n` +
      `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
      `┃ ◦ \`${m.prefix}ttqc <text>\`\n` +
      `┃ ◦ Reply pesan + \`${m.prefix}ttqc\`\n` +
      `╰┈┈⬡\n\n` +
      `> Contoh: \`${m.prefix}ttqc Just friend kok cemburu 😂\``
    )
  }

  if (chatText.length > 200) {
    return m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> Maksimal 200 karakter! (Saat ini: ${chatText.length})`)
  }

  m.react('🕕')

  try {
    const username = m.pushName || 'User'

    // Ambil foto profil pengirim
    let avatarSrc = DEFAULT_PP
    try {
      avatarSrc = await sock.profilePictureUrl(m.sender, 'image')
    } catch { /* pakai default */ }

    const imageBuffer = await renderTikTokChat(username, chatText, avatarSrc)

    m.react('✅')
    await sock.sendMessage(
      m.chat,
      { image: imageBuffer, caption: '' },
      { quoted: m }
    )
  } catch (error) {
    console.error('[TTQC]', error.message)
    m.react('☢')
    m.reply(te(m.prefix, m.command, m.pushName))
  }
}

export { pluginConfig as config, handler }
