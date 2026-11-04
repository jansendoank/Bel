import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Terminal, 
  FileCode, 
  Ban, 
  ExternalLink, 
  Key, 
  Flame, 
  EyeOff,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const SecurityAuditView: React.FC = () => {
  const [expandedVuln, setExpandedVuln] = useState<string>('VULN-01');

  const vulnerabilities = [
    {
      id: 'VULN-01',
      severity: 'CRITICAL',
      severityColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      title: 'Remote Code Execution (RCE) via Prefix `>`, `=>`, dan `$`',
      file: 'helpers/interactive.js (Baris 68-94)',
      cwe: 'CWE-94: Improper Control of Generation of Code',
      description: 'Pengguna owner (atau siapapun yang berhasil mem-bypass verifikasi sender) dapat mengeksekusi kode JavaScript Node.js dan perintah shell Linux langsung melalui pesan obrolan WhatsApp.',
      codeSnippet: `// helpers/interactive.js
let isEval = cht?.msg?.startsWith('>');
let isEvalSync = cht?.msg?.startsWith('=>');
let isExec = cht?.msg?.startsWith('$');
let danger = cht?.msg?.slice(2) || '';
const sanitized = danger.replace(/\\s/g, '');
const dangerous = [
  'rm-rf', 'mkfs', 'rm-f', 'chmod-r777', 'chown', '/*', '*.*', '>/dev/null'
];
// Filter blacklist mudah di-bypass dengan string concatenation, hex, atau base64!`,
      riskImpact: 'Penyerang dapat membaca seluruh isi server, mencuri token env / sesi WhatsApp, menghapus database, atau memasang reverse shell backdoor.',
      recommendation: 'Hapus fitur eval/exec di lingkungan production, atau batasi secara ketat dengan whitelist IP lokal, autentikasi 2FA, dan isolasi VM/Docker sandboxing tanpa hak akses root.'
    },
    {
      id: 'VULN-02',
      severity: 'HIGH',
      severityColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      title: 'Modul Spam OTP / SMS Flooding (`sepamotepe.js`)',
      file: 'helpers/Events/sepamotepe.js',
      cwe: 'CWE-400: Uncontrolled Resource Consumption / Abuse',
      description: 'File sepamotepe.js berisi skrip terotomatisasi untuk menembak endpoint OTP berbagai layanan di Indonesia dengan memalsukan header IP (IP pool 1000 item acak) dan User-Agent acak.',
      codeSnippet: `// helpers/Events/sepamotepe.js
const IP_POOL = [];
for (let i = 0; i < 1000; i++) {
  IP_POOL.push(\`\${randomInt(1,255)}.\${randomInt(1,255)}.\${randomInt(1,255)}.\${randomInt(1,255)}\`);
}
function randomIP() { return IP_POOL[randomInt(0, IP_POOL.length - 1)]; }
// Menyerang endpoint registrasi SMS / OTP berbagai provider`,
      riskImpact: 'Dapat menyebabkan nomor bot dan IP server dilaporkan dan masuk ke blacklist provider telekomunikasi (kominfo/anti-fraud), serta berpotensi melanggar regulasi UU ITE.',
      recommendation: 'Hapus modul sepamotepe.js dari bot produksi dan blokir semua command pengiriman pesan beruntun yang merugikan pihak ketiga.'
    },
    {
      id: 'VULN-03',
      severity: 'HIGH',
      severityColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      title: 'Kode Terobfuscasi & Monkey-Patching Prototype Global',
      file: 'toolkit/set/prototype.js',
      cwe: 'CWE-506: Embedded Malicious or Obfuscated Code',
      description: 'File prototype.js memiliki payload eval() yang di-enkripsi XOR dan di-obfuscate. Skrip ini memodifikasi objek dasar JavaScript (String.prototype, Array.prototype) dengan menambahkan fungsi runtime .import() dan .r().',
      codeSnippet: `// toolkit/set/prototype.js
let Pwud;!function(){
  const EzQB=Array.prototype.slice.call(arguments);
  return eval("(function IARA(rQYs){...bAIt(rQYs,jIlt(...))...})");
}();
// Obfuscasi menyembunyikan logika internal dan menyulitkan security audit.`,
      riskImpact: 'Menimbulkan risiko supply-chain attack. Pengembang tidak dapat memverifikasi apakah ada payload tersembunyi (seperti pengiriman kredensial sesi ke server pihak ketiga).',
      recommendation: 'Ganti kode terobfuscasi dengan implementasi ES Modules transparan standar (gunakan import native tanpa monkey patching prototype string).'
    },
    {
      id: 'VULN-04',
      severity: 'MEDIUM',
      severityColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Kredensial Sesi WhatsApp Berbasis File Mentah (creds.json)',
      file: 'connection/session/creds.json',
      cwe: 'CWE-312: Cleartext Storage of Sensitive Information',
      description: 'Baileys useMultiFileAuthState menyimpan kunci privat Noise cryptographic handshakes dan token registrasi WhatsApp langsung dalam format JSON di filesystem.',
      codeSnippet: `// index.js
let { state, saveCreds } = await useMultiFileAuthState(session);
// Jika folder session ter-commit ke GitHub publik atau terekspos via web server,
// pihak lain dapat langsung membajak nomor WhatsApp korban!`,
      riskImpact: 'Jika folder session tidak dimasukkan ke .gitignore atau backup server bocor, penyerang dapat login ke akun WhatsApp korban tanpa perlu scan QR lagi.',
      recommendation: 'Pastikan connection/session/ masuk ke .gitignore dan simpan kunci privat dengan enkripsi AES-256 atau secret management vault terenkripsi.'
    },
    {
      id: 'VULN-05',
      severity: 'MEDIUM',
      severityColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Resiko Banned Otomatis WhatsApp (Unofficial API Rate Limits)',
      file: 'Seluruh sistem (Baileys WebSocket)',
      cwe: 'Policy Violation & Anti-Spam Trigger',
      description: 'Penggunaan API tidak resmi (Baileys) memiliki risiko banned permanen dari WhatsApp jika bot melakukan auto-read story, auto-typing, atau mass broadcast ke ribuan grup tanpa jeda waktu alami.',
      codeSnippet: `// config.json
"autoreadsw": true,
"autotyping": true,
"reactsw": { "on": false, "emojis": ["😍", "😂"] }
// Operasi otomatis berfrekuensi tinggi mudah memicu pendeteksian heuristik WhatsApp.`,
      riskImpact: 'Nomor WhatsApp dapat dibanned sementara (24 jam) hingga permanen oleh sistem moderasi otomatis Meta/WhatsApp.',
      recommendation: 'Gunakan jeda acak (random delay 3-7 detik antar pesan), nonaktifkan autoread story berlebihan, dan gunakan nomor virtual/khusus bot.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20">
          <ShieldAlert className="w-3.5 h-3.5" />
          Laporan Audit & Security Assessment
        </div>
        <h2 className="text-xl font-bold text-white">
          Evaluasi Keamanan Kode Experimental-Bell
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Berdasarkan analisis statis mendalam pada seluruh basis kode bot yang diekstrak, ditemukan beberapa temuan kritis yang wajib diperhatikan oleh developer sebelum meng-host bot ini ke lingkungan publik.
        </p>
      </div>

      {/* Vulnerability cards list */}
      <div className="space-y-4">
        {vulnerabilities.map((vuln) => {
          const isExpanded = expandedVuln === vuln.id;
          return (
            <div
              key={vuln.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900 border-slate-700 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedVuln(isExpanded ? '' : vuln.id)}
                className="w-full p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 text-left"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border shrink-0 ${vuln.severityColor}`}>
                    {vuln.severity}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-slate-400 font-semibold">{vuln.id}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-mono text-cyan-400">{vuln.cwe}</span>
                    </div>
                    <h3 className="font-bold text-slate-100 text-sm sm:text-base mt-0.5">
                      {vuln.title}
                    </h3>
                  </div>
                </div>

                <div className="p-1 rounded-lg bg-slate-800 text-slate-400 shrink-0">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {/* Body */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-800/80 space-y-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 w-fit">
                    <FileCode className="w-3.5 h-3.5 text-rose-400" />
                    <span>Lokasi: {vuln.file}</span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    {vuln.description}
                  </p>

                  {/* Code snippet */}
                  <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-rose-300 overflow-x-auto">
                    <pre className="whitespace-pre">
                      <code>{vuln.codeSnippet}</code>
                    </pre>
                  </div>

                  {/* Risk Impact & Recommendation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                    <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-rose-400 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Dampak Risiko:</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {vuln.riskImpact}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Rekomendasi Perbaikan:</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {vuln.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
