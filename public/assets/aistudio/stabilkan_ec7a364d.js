import axios from 'axios'
import FormData from 'form-data'
import config from '../../config.js'
import te from '../../src/lib/ourin-error.js'

// ─── Plugin Config ────────────────────────────────────────────────────────────

const pluginConfig = {
  name: 'stabilkan',
  alias: ['stabilize', 'stabilvid', 'vstabil'],
  category: 'tools',
  description: 'Stabilkan video yang goyang menggunakan AI',
  usage: '.stabilkan (kirim/reply video)',
  example: '.stabilkan (reply video)',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 30,
  energi: 2,
  isEnabled: true,
}

// ─── Stabilizer Core ──────────────────────────────────────────────────────────

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; RMX2185 Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.120 Mobile Safari/537.36',
  'origin': 'https://jansenx-stabilizerx.hf.space',
  'referer': 'https://jansenx-stabilizerx.hf.space/',
  'x-requested-with': 'mark.via.gp',
}

async function createJob(videoUrl) {
  const form = new FormData()
  form.append('url', videoUrl)
  const res = await axios.post('https://jansenx-stabilizerx.hf.space/api/stabilize', form, {
    headers: { ...form.getHeaders(), ...HEADERS },
    timeout: 30000,
  })
  return res.data // { job_id, message }
}

async function checkStatus(jobId) {
  const res = await axios.get(`https://jansenx-stabilizerx.hf.space/api/status/${jobId}`, {
    headers: HEADERS,
    timeout: 15000,
  })
  return res.data // { status: "process" } or { status: "success", url: "..." }
}

async function waitForResult(jobId, maxAttempts = 60, delayMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkStatus(jobId)
    if (status.status === 'success' && status.url) return status.url
    if (status.status === 'failed' || status.status === 'error') {
      throw new Error('Stabilisasi video gagal di server.')
    }
    await new Promise(r => setTimeout(r, delayMs))
  }
  throw new Error('Timeout — server terlalu lama memproses video.')
}

// ─── Handler ──────────────────────────────────────────────────────────────────

async function handler(m, { sock }) {
  const msgType    = m.type || m.mtype || ''
  const quotedType = m.quoted?.type || m.quoted?.mtype || ''

  const isVideo = (t) => ['videoMessage', 'video'].includes(t)

  if (!isVideo(msgType) && !isVideo(quotedType)) {
    return m.reply(
      `🎥 *ꜱᴛᴀʙɪʟᴋᴀɴ ᴠɪᴅᴇᴏ ᴀɪ*\n\n` +
      `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
      `┃ ◦ Kirim video + \`${m.prefix}stabilkan\`\n` +
      `┃ ◦ Reply video + \`${m.prefix}stabilkan\`\n` +
      `╰┈┈⬡\n\n` +
      `> ⚠️ Hanya mendukung format video`
    )
  }

  m.react('🕕')

  try {
    // Download video
    let videoBuffer
    if (isVideo(msgType)) {
      videoBuffer = await m.download()
    } else {
      videoBuffer = await m.quoted.download()
    }

    // Upload ke catbox atau tmpfiles biar dapet URL publik
    await m.reply('⏳ Mengupload video...')

    const uploadForm = new FormData()
    uploadForm.append('file', videoBuffer, { filename: 'video.mp4', contentType: 'video/mp4' })

    const uploadRes = await axios.post('https://tmpfiles.org/api/v1/upload', uploadForm, {
      headers: { ...uploadForm.getHeaders() },
      timeout: 60000,
    })

    const videoUrl = uploadRes.data?.data?.url?.replace('tmpfiles.org/', 'tmpfiles.org/dl/') || null
    if (!videoUrl) throw new Error('Gagal mendapatkan URL video dari upload.')

    // Submit ke stabilizer
    await m.reply('🔧 Memproses stabilisasi...')
    const job = await createJob(videoUrl)
    if (!job?.job_id) throw new Error('Gagal membuat job stabilisasi.')

    // Polling status
    await m.reply(`⚙️ Stabilisasi berjalan... (maks ~3 menit)`)
    const resultUrl = await waitForResult(job.job_id)

    // Download hasil & kirim
    const resultBuffer = await axios.get(resultUrl, { responseType: 'arraybuffer', timeout: 60000 })

    m.react('✅')
    await sock.sendMessage(
      m.chat,
      { video: Buffer.from(resultBuffer.data), caption: '✅ *Video berhasil distabilkan!*' },
      { quoted: m }
    )
  } catch (error) {
    console.error('[STABILKAN]', error.message)
    m.react('☢')
    m.reply(te(m.prefix, m.command, m.pushName))
  }
}

export { pluginConfig as config, handler }
