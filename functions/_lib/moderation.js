// server/wordlist.js'i AYNEN import ediyoruz — 700+ satırlık kara listeyi burada
// tekrar yazmak iki ayrı kaynak-of-truth yaratır, ileride sapar. Saf JS/regex, Node'a
// özgü hiçbir API kullanmıyor, Pages Functions bundler'ı (esbuild) sorunsuz paketler.
import { quickFilterReject } from "../../server/wordlist.js";

const NIM_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

const TASK_TEMPLATE = (text) => `Task: Check if there is unsafe content in the user or agent messages in the below conversation in accordance with our safety policy with the below categories. Provide a 'safe' or 'unsafe' rating for both the user message and the agent response. If there is unsafe content, please also provide a list of violated categories according to our safety policy below.

<BEGIN UNSAFE CONTENT CATEGORIES>
S1: Violence.
S2: Sexual.
S3: Criminal Planning/Confessions.
S4: Guns and Illegal Weapons.
S5: Controlled/Regulated Substances.
S6: Suicide and Self Harm.
S7: Sexual (minor).
S8: Hate/Identity Hate.
S9: PII/Privacy.
S10: Harassment.
S11: Threat.
S12: Profanity.
S13: Needs Caution.
S14: Other.
S15: Manipulation.
S16: Fraud/Deception.
S17: Malware.
S18: High Risk Gov Decision Making.
S19: Political/Misinformation/Conspiracy.
S20: Copyright/Trademark/Plagiarism.
S21: Unauthorized Advice.
S22: Illegal Activity.
S23: Immoral/Unethical.
<END UNSAFE CONTENT CATEGORIES>

<BEGIN CONVERSATION>

user: ${text}

<END CONVERSATION>

Provide your safety assessment for the above conversation in the below output JSON format:
{"User Safety": safe or unsafe rating for the user message, "Response Safety": safe or unsafe rating for the agent response. Omit if no agent response present. "Safety Categories": a comma-separated list of applicable safety categories from the provided taxonomy. Omit if all safe.}

Do not include anything other than the output JSON in your response.
Output JSON: `;

async function classifyWithNim(env, text) {
  const apiKey = env.NIM_API_KEY;
  if (!apiKey) throw new Error("NIM_API_KEY tanımlı değil");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Number(env.NIM_TIMEOUT_MS || 8000));
  try {
    const response = await fetch(NIM_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.NIM_MODEL || "nvidia/llama-3.1-nemotron-safety-guard-8b-v3",
        temperature: 0,
        max_tokens: 100,
        messages: [{ role: "user", content: TASK_TEMPLATE(text) }],
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`NIM API ${response.status}`);
    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("NIM yanıtı JSON içermiyor");
    const parsed = JSON.parse(match[0]);
    const userSafety = String(parsed["User Safety"] || "").toLowerCase();
    if (userSafety !== "safe" && userSafety !== "unsafe") throw new Error("NIM yanıtı beklenen alanı içermiyor");
    return { safe: userSafety === "safe", category: parsed["Safety Categories"] || "none" };
  } finally {
    clearTimeout(timer);
  }
}

// İki katmanlı moderasyon: önce yerel filtre, sonra NIM. NIM erişilemezse fail-closed.
export async function moderateMessage(env, text) {
  if (quickFilterReject(text)) return { safe: false, category: "yerel-filtre" };
  try {
    return await classifyWithNim(env, text);
  } catch (err) {
    return { safe: false, category: "moderasyon-hatasi", error: err.message };
  }
}

export async function verifyHcaptcha(env, token, remoteIp) {
  const secret = env.HCAPTCHA_SECRET;
  if (!secret) throw new Error("HCAPTCHA_SECRET tanımlı değil");
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) return false;
  const data = await response.json();
  return data.success === true;
}

// Workers'ta Node'un dns.resolveMx'i yok — Cloudflare'in kendi DNS-over-HTTPS
// endpoint'i üzerinden aynı kontrolü yapıyoruz.
export async function hasMx(email) {
  const domain = email.split("@")[1];
  if (!domain) return false;
  try {
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`, {
      headers: { Accept: "application/dns-json" },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    return false;
  }
}
