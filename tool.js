// ===== Aura AI — مولّد أوصاف المنتجات (محرّك محلي يشتغل بدون مفتاح) =====
// لتفعيل Claude الحقيقي: شوف server-example/README.md و USE_API بالأسفل.

const USE_API = false; // غيّرها لـ true بعد ما تشغّل الـ backend
const API_URL = "http://localhost:3000/api/generate";

const form = document.getElementById("genForm");
const results = document.getElementById("results");
const regenBtn = document.getElementById("regen");

let lastInput = null;

// --- بنوك صياغات للتنويع ---
const openings = {
  professional: ["اكتشف", "تعرّف على", "نقدّم لك", "إليك"],
  friendly: ["خليك على راحتك مع", "رح تحب", "جرّب", "دلّل حالك مع"],
  luxury: ["تجربة استثنائية مع", "الفخامة تبدأ من", "ارتقِ بأناقتك مع", "تميّز مع"],
  energetic: ["انطلق مع", "لا تفوّت", "عيش الإثارة مع", "حان وقت"],
};
const connectors = ["يتميّز بـ", "يقدّم لك", "مزوّد بـ", "يجمع بين"];
const closings = {
  professional: ["خيار ذكي يستحق ثقتك.", "جودة تدوم وأداء يعتمد عليه.", "استثمار يستحق كل قرش."],
  friendly: ["مناسب تماماً لك! 😍", "اطلبه اليوم وما رح تندم.", "حياتك رح تصير أسهل معه."],
  luxury: ["لأنك تستحق الأفضل.", "تفاصيل صُنعت بإتقان.", "أناقة لا تضاهى."],
  energetic: ["اطلبه الآن قبل نفاد الكمية! ⚡", "لا تنتظر — انطلق الآن!", "الفرصة بين يديك! 🔥"],
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function splitFeatures(raw) {
  return raw
    .split(/[،,]/)
    .map((f) => f.trim())
    .filter(Boolean);
}

function buildLocally(data) {
  const { name, category, features, audience, tone } = data;
  const feats = splitFeatures(features);
  const featList = feats.join("، ");

  // الوصف
  const aud = audience ? ` المثالي لـ${audience}` : "";
  const cat = category ? ` في عالم ${category}` : "";
  let desc =
    `${pick(openings[tone])} ${name}${aud}${cat}. ` +
    `${pick(connectors)} ${featList}، ` +
    `ليمنحك تجربة لا مثيل لها. ${pick(closings[tone])}`;

  // نقاط سريعة من المميزات
  if (feats.length) {
    desc += "\n\n✔ " + feats.join("\n✔ ");
  }

  // عنوان SEO (<= 60 حرف تقريباً)
  const hook = feats[0] ? ` — ${feats[0]}` : "";
  let title = `${name}${hook} | اشترِ الآن`;
  if (title.length > 60) title = `${name} | عرض حصري`;

  // وصف ميتا (<= 155 حرف)
  let meta = `${name}: ${featList}. اطلبه الآن بأفضل سعر وتوصيل سريع.`;
  if (meta.length > 155) meta = meta.slice(0, 152) + "…";

  // بوست سوشال ميديا
  const tags = feats
    .slice(0, 3)
    .map((f) => "#" + f.replace(/\s+/g, "_"))
    .join(" ");
  const social =
    `${pick(openings[tone])} ${name}! ✨\n` +
    `${featList}.\n` +
    `${pick(closings[tone])}\n\n` +
    `${tags} #${(category || "تسوق").replace(/\s+/g, "_")} #Aura`;

  return { desc, title, meta, social };
}

async function buildWithAPI(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("API error " + res.status);
  return res.json(); // متوقّع { desc, title, meta, social }
}

function render(out) {
  document.getElementById("outDesc").textContent = out.desc;
  document.getElementById("outTitle").textContent = out.title;
  document.getElementById("outMeta").textContent = out.meta;
  document.getElementById("outSocial").textContent = out.social;
  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function generate(data, btn) {
  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = "⏳ جاري التوليد…";
  try {
    const out = USE_API ? await buildWithAPI(data) : buildLocally(data);
    render(out);
  } catch (err) {
    alert("صار خطأ بالتوليد: " + err.message + "\nتأكد إنّو الـ backend شغّال.");
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  lastInput = {
    name: document.getElementById("name").value.trim(),
    category: document.getElementById("category").value.trim(),
    features: document.getElementById("features").value.trim(),
    audience: document.getElementById("audience").value.trim(),
    tone: document.getElementById("tone").value,
  };
  generate(lastInput, form.querySelector("button[type=submit]"));
});

regenBtn.addEventListener("click", () => {
  if (lastInput) generate(lastInput, regenBtn);
});

// نسخ النتائج
document.querySelectorAll(".t-copy").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = document.getElementById(btn.dataset.target).textContent;
    try {
      await navigator.clipboard.writeText(text);
      const original = btn.textContent;
      btn.textContent = "✓ تم النسخ";
      btn.classList.add("done");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("done");
      }, 1500);
    } catch {
      alert("ما قدرت أنسخ تلقائياً — انسخ يدوياً.");
    }
  });
});
