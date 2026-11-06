import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import { Sticker } from 'wa-sticker-formatter'
import axios from 'axios'
import config from '../../config.js'
import te from '../../src/lib/ourin-error.js'

const pluginConfig = {
  name: 'bratmega',
  alias: ['megabrat', 'bratkertas'],
  category: 'sticker',
  description: 'Buat stiker teks di kertas yang dipegang Mega',
  usage: '.bratmega <teks>',
  example: '.bratmega Halo cuy',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
}

const BG_URL    = 'https://e.top4top.io/p_385097r0g0.jpg'
const FONT_URL  = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Poppins.ttf'
const FONT_NAME = 'PoppinsBratMega'

// Koordinat kertas putih berdasarkan hasil screenshot
// Gambar 1232x1232 — kertas ada di:
// X: 14% s/d 53%, Y: 26% s/d 82%
const PAPER = {
  xStart: 0.14,
  yStart: 0.26,
  xEnd:   0.53,
  yEnd:   0.82,
}

async function fetchBuffer(url) {
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 15000,
  })
  return Buffer.from(res.data)
}

function splitLongWord(ctx, word, maxW) {
  const parts = []
  let cur = ''
  for (const ch of [...word]) {
    const test = cur + ch
    if (ctx.measureText(test).width <= maxW || !cur) { cur = test }
    else { parts.push(cur); cur = ch }
  }
  if (cur) parts.push(cur)
  return parts
}

function wrapText(ctx, text, maxW) {
  const words = text.split(' ').filter(Boolean)
  const lines = []
  let cur = ''
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word
    if (ctx.measureText(test).width <= maxW) {
      cur = test
    } else {
      if (cur) lines.push(cur)
      if (ctx.measureText(word).width <= maxW) {
        cur = word
      } else {
        const parts = splitLongWord(ctx, word, maxW)
        lines.push(...parts.slice(0, -1))
        cur = parts.at(-1) || ''
      }
    }
  }
  if (cur) lines.push(cur)
  return lines
}

function fitText(ctx, text, maxW, maxH) {
  for (let size = 90; size >= 12; size -= 2) {
    ctx.font = `bold ${size}px ${FONT_NAME}`
    const lh    = size * 1.3
    const lines = wrapText(ctx, text, maxW)
    if (lines.length * lh <= maxH) {
      return { size, lines, lh, totalH: lines.length * lh }
    }
  }
  // Fallback ukuran minimum
  const size  = 12
  ctx.font    = `bold ${size}px ${FONT_NAME}`
  const lh    = size * 1.3
  const lines = wrapText(ctx, text, maxW)
  const max   = Math.floor(maxH / lh)
  return { size, lines: lines.slice(0, max), lh, totalH: Math.min(lines.length, max) * lh }
}

async function handler(m, { sock }) {
  const text = m.args?.join(' ')?.trim()

  if (!text) {
    return m.reply(
      `📄 *ʙʀᴀᴛᴍᴇɢᴀ ꜱᴛɪᴄᴋᴇʀ*\n\n` +
      `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
      `┃ ◦ \`${m.prefix}bratmega <teks>\`\n` +
      `╰┈┈⬡\n\n` +
      `> Contoh: \`${m.prefix}bratmega Halo cuy\``
    )
  }

  m.react('⚡')

  try {
    if (!global.BratMegaFontRegistered) {
      const fontBuf = await fetchBuffer(FONT_URL)
      GlobalFonts.register(fontBuf, FONT_NAME)
      global.BratMegaFontRegistered = true
    }

    const imgBuf = await fetchBuffer(BG_URL)
    const image  = await loadImage(imgBuf)
    const W      = image.width
    const H      = image.height
    const canvas = createCanvas(W, H)
    const ctx    = canvas.getContext('2d')

    ctx.drawImage(image, 0, 0, W, H)

    // Area kertas dengan padding
    const pad  = 0.05
    const px   = W * (PAPER.xStart + pad)
    const py   = H * (PAPER.yStart + pad)
    const maxW = W * (PAPER.xEnd - PAPER.xStart - pad * 2)
    const maxH = H * (PAPER.yEnd - PAPER.yStart - pad * 2)

    const { size, lines, lh, totalH } = fitText(ctx, text, maxW, maxH)
    const startY = py + (maxH - totalH) / 2

    ctx.font         = `bold ${size}px ${FONT_NAME}`
    ctx.fillStyle    = '#111111'
    ctx.textAlign    = 'left'
    ctx.textBaseline = 'top'

    // Clip agar teks tidak keluar dari area kertas
    ctx.save()
    ctx.beginPath()
    ctx.rect(px, py, maxW, maxH)
    ctx.clip()

    lines.forEach((line, i) => {
      ctx.fillText(line, px, startY + i * lh)
    })

    ctx.restore()

    const finalBuffer = await canvas.encode('png')

    const packname = config?.stickpack || global.stickpack || 'OURIN BOT'
    const author   = config?.stickauth || global.stickauth || 'bratmega'

    const stiker = await new Sticker(finalBuffer, {
      type: 'full',
      pack: packname,
      author: author,
      quality: 70,
    }).toBuffer()

    await sock.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
    m.react('🔥')

  } catch (error) {
    console.error('[BRATMEGA]', error.message)
    m.react('😑')
    m.reply(te(m.prefix, m.command, m.pushName))
  }
}

export { pluginConfig as config, handler }
