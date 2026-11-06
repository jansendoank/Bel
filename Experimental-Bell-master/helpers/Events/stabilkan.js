/*!-======[ Module Imports ]======-!*/
const axios = 'axios'.import();
const Form = 'form'.import();

/*!-======[ Function Imports ]======-!*/
const { tmpFiles } = await (fol[0] + 'tmpfiles.js').r();

/*!-======[ Stabilizer Core Configuration ]======-!*/
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Linux; Android 10; RMX2185 Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.120 Mobile Safari/537.36',
  origin: 'https://jansenx-stabilizerx.hf.space',
  referer: 'https://jansenx-stabilizerx.hf.space/',
  'x-requested-with': 'mark.via.gp',
};

async function createJob(videoUrl) {
  const form = new Form();
  form.append('url', videoUrl);
  const res = await axios.post(
    'https://jansenx-stabilizerx.hf.space/api/stabilize',
    form,
    {
      headers: { ...form.getHeaders(), ...HEADERS },
      timeout: 30000,
    }
  );
  return res.data; // { job_id, message }
}

async function checkStatus(jobId) {
  const res = await axios.get(
    `https://jansenx-stabilizerx.hf.space/api/status/${jobId}`,
    {
      headers: HEADERS,
      timeout: 15000,
    }
  );
  return res.data; // { status: "process" } or { status: "success", url: "..." }
}

async function waitForResult(jobId, maxAttempts = 60, delayMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkStatus(jobId);
    if (status.status === 'success' && status.url) return status.url;
    if (status.status === 'failed' || status.status === 'error') {
      throw new Error('Proses stabilisasi video gagal di server AI.');
    }
    await sleep(delayMs);
  }
  throw new Error('Waktu tunggu habis (timeout). Server AI terlalu lama memproses.');
}

/*!-======[ Default Export Function for Experimental-Bell ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { id } = cht;

  ev.on(
    {
      cmd: ['stabilkan', 'stabilize', 'stabilvid', 'vstabil'],
      listmenu: ['stabilkan'],
      tag: 'tools',
      energy: 10,
      media: {
        type: ['video'],
        msg: 'Kirim atau reply video dengan caption *.stabilkan* untuk menstabilkan video yang goyang.',
        etc: {
          seconds: 90,
          msg: 'Maksimal durasi video adalah 90 detik agar proses stabilisasi tidak timeout!',
        },
        save: false,
      },
    },
    async ({ media }) => {
      // Reaksi awal proses
      await Exp.sendMessage(id, {
        react: { text: '🕕', key: cht.key },
      });

      try {
        await cht.reply('⏳ Mengupload video ke server temporary...');

        // Upload video menggunakan utility tmpFiles bawaan toolkit Bell
        let videoUrl;
        try {
          videoUrl = await tmpFiles(media);
        } catch {
          // Fallback upload langsung
          const uploadForm = new Form();
          uploadForm.append('file', media, {
            filename: `video_${Date.now()}.mp4`,
            contentType: 'video/mp4',
          });
          const uploadRes = await axios.post(
            'https://tmpfiles.org/api/v1/upload',
            uploadForm,
            {
              headers: { ...uploadForm.getHeaders() },
              timeout: 60000,
            }
          );
          videoUrl = uploadRes.data?.data?.url?.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        }

        if (!videoUrl) throw new Error('Gagal mendapatkan URL publik dari video.');

        await cht.reply('⚙️ Video terupload! Mengirim ke mesin AI Stabilizer...');
        const job = await createJob(videoUrl);
        if (!job?.job_id) throw new Error('Gagal membuat job antrean stabilisasi video.');

        await cht.reply(`🔧 Sedang memproses stabilisasi (Job: \`${job.job_id}\`)... Mohon tunggu hingga 1-3 menit.`);
        const resultUrl = await waitForResult(job.job_id);

        // Download video hasil
        const resultBuffer = await axios.get(resultUrl, {
          responseType: 'arraybuffer',
          timeout: 60000,
        });

        await Exp.sendMessage(id, {
          react: { text: '✅', key: cht.key },
        });

        await Exp.sendMessage(
          id,
          {
            video: Buffer.from(resultBuffer.data),
            caption: '✅ *Video berhasil distabilkan menggunakan AI!*',
          },
          { quoted: cht }
        );
      } catch (error) {
        console.error('[STABILKAN Error]:', error);
        await Exp.sendMessage(id, {
          react: { text: '❌', key: cht.key },
        });
        cht.reply(`⚠️ Gagal menstabilkan video:\n${error.message}`);
      }
    }
  );
}
