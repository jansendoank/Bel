import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import { Sticker } from 'wa-sticker-formatter'
import axios from 'axios'
import config from '../../config.js'
import te from '../../src/lib/ourin-error.js'

// ─── Plugin Config ────────────────────────────────────────────────────────────

const pluginConfig = {
  name: 'bratjoko',
  alias: ['jokobrat', 'bratjk'],
  category: 'sticker',
  description: 'Buat stiker brat dengan teks kustom',
  usage: '.bratjoko <teks>',
  example: '.bratjoko Halo cuy',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BRAT_IMAGE_URL = 'https://j.top4top.io/p_3828sj2j30.jpg'
const BRAT_FONT_URL  = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Poppins.ttf'

const CANVAS    = { width: 1254, height: 1254 }
const SAFE_ZONE = { a: 760, b: 1100, c: 300, d: 950 }
const TEXT_STYLE = {
  fontFamily:  'PoppinsBratJoko',
  maxFontSize: 80,
  minFontSize: 22,
  lineHeight:  1.18,
  color:       '#111111',
  align:       'center',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchBuffer(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } })
  return Buffer.from(res.data)
}

function normalizeText(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function getSafeRect(zone) {
  return {
    x: zone.c, y: zone.a,
    w: zone.d - zone.c, h: zone.b - zone.a,
    centerX: (zone.c + zone.d) / 2,
    centerY: (zone.a + zone.b) / 2,
  }
}

function setFont(ctx, size) {
  ctx.font = `${size}px ${TEXT_STYLE.fontFamily}`
}

function splitLongWord(ctx, word, maxWidth) {
  const parts = []
  let current = ''
  for (const char of [...word]) {
    const test = current + char
    if (ctx.measureText(test).width <= maxWidth || !current) { current = test }
    else { parts.push(current); current = char }
  }
  if (current) parts.push(current)
  return parts
}

function wrapParagraph(ctx, paragraph, maxWidth) {
  const words = paragraph.split(' ').filter(Boolean)
  const lines = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width <= maxWidth) { current = test; continue }
    if (current) { lines.push(current); current = '' }
    if (ctx.measureText(word).width <= maxWidth) {
      current = word
    } else {
      const parts = splitLongWord(ctx, word, maxWidth)
      lines.push(...parts.slice(0, -1))
      current = parts.at(-1) || ''
    }
  }
  if (current) lines.push(current)
  return lines
}

function wrapText(ctx, text, maxWidth) {
  return text.split('\n').flatMap((paragraph) => {
    const clean = paragraph.trim()
    if (!clean) return ['']
    return wrapParagraph(ctx, clean, maxWidth)
  })
}

function fitText(ctx, text, rect) {
  for (let size = TEXT_STYLE.maxFontSize; size >= TEXT_STYLE.minFontSize; size--) {
    setFont(ctx, size)
    const lineHeight = Math.ceil(size * TEXT_STYLE.lineHeight)
    const lines = wrapText(ctx, text, rect.w)
    if (lines.length * lineHeight <= rect.h) return { size, lines, lineHeight, totalHeight: lines.length * lineHeight }
  }
  const size = TEXT_STYLE.minFontSize
  setFont(ctx, size)
  const lineHeight = Math.ceil(size * TEXT_STYLE.lineHeight)
  const lines = wrapText(ctx, text, rect.w)
  const maxLines = Math.max(1, Math.floor(rect.h / lineHeight))
  const clipped = lines.slice(0, maxLines)
  if (lines.length > maxLines && clipped.length) {
    let last = clipped[clipped.length - 1]
    while (last.length > 0 && ctx.measureText(`${last}...`).width > rect.w) last = last.slice(0, -1)
    clipped[clipped.length - 1] = `${last}...`
  }
  return { size, lines: clipped, lineHeight, totalHeight: clipped.length * lineHeight }
}

function drawCenteredText(ctx, text, zone) {
  const rect   = getSafeRect(zone)
  const fitted = fitText(ctx, text, rect)
  const startY = rect.y + (rect.h - fitted.totalHeight) / 2

  ctx.save()
  ctx.beginPath()
  ctx.rect(rect.x, rect.y, rect.w, rect.h)
  ctx.clip()

  setFont(ctx, fitted.size)
  ctx.fillStyle    = TEXT_STYLE.color
  ctx.textAlign    = TEXT_STYLE.align
  ctx.textBaseline = 'top'

  fitted.lines.forEach((line, i) => {
    ctx.fillText(line, rect.centerX, startY + i * fitted.lineHeight)
  })
  ctx.restore()
}

// ─── Handler ──────────────────────────────────────────────────────────────────

async function handler(m, { sock }) {
  const text = m.args?.join(' ')?.trim()

  if (!text) {
    return m.reply(
      `⚠️ *ʙʀᴀᴛᴊᴏᴋᴏ ꜱᴛɪᴄᴋᴇʀ*\n\n` +
      `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
      `┃ ◦ \`${m.prefix}bratjoko <teks>\`\n` +
      `╰┈┈⬡\n\n` +
      `> Contoh: \`${m.prefix}bratjoko Halo cuy\``
    )
  }

  m.react('⚡')

  try {
    // Register font sekali saja
    if (!global.BratJokoFontRegistered) {
      const fontBuffer = await fetchBuffer(BRAT_FONT_URL)
      GlobalFonts.register(fontBuffer, TEXT_STYLE.fontFamily)
      global.BratJokoFontRegistered = true
    }

    const imageBuffer = await fetchBuffer(BRAT_IMAGE_URL)
    const image  = await loadImage(imageBuffer)
    const canvas = createCanvas(CANVAS.width, CANVAS.height)
    const ctx    = canvas.getContext('2d')

    ctx.drawImage(image, 0, 0, CANVAS.width, CANVAS.height)
    drawCenteredText(ctx, normalizeText(text), SAFE_ZONE)

    const finalBuffer = await canvas.encode('png')

    const packname = config?.stickpack || global.stickpack || 'OURIN BOT'
    const author   = config?.stickauth || global.stickauth || 'bratjoko'

    const stiker = await new Sticker(finalBuffer, {
      type: 'full',
      pack: packname,
      author: author,
      quality: 70,
    }).toBuffer()

    await sock.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
    m.react('🔥')
  } catch (error) {
    console.error('[BRATJOKO]', error.message)
    m.react('😑')
    m.reply(te(m.prefix, m.command, m.pushName))
  }
}

export { pluginConfig as config, handler }
