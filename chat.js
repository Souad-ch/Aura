// ===== Aura Assistant — شات بوت المتجر =====
// نسخة تجريبية تشتغل بدون مفتاح (ردود بسيطة).
// لتفعيل Claude الحقيقي: شغّل server-example وغيّر USE_API = true.

const USE_API = false; // غيّرها لـ true بعد تشغيل الـ backend
const API_URL = "http://localhost:3000/api/chat";

const chat = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const suggest = document.getElementById("suggest");

// سجلّ المحادثة (للـ API متعدد الأدوار)
const history = [];

// --- ردود تجريبية بسيطة (بدون AI) ---
const cannedRules = [
  { k: ["توصيل", "شحن", "وقت", "يوصل", "متى"], a: "🚚 التوصيل عادةً بياخد من 2 إلى 5 أيام عمل حسب منطقتك. الشحن مجاني للطلبات فوق 50 $!" },
  { k: ["سعر", "كم", "تكلفة", "غالي", "رخيص"], a: "💰 أسعارنا تنافسية جداً، وفي خطط تبدأ من 5 $ شهرياً. قلّي شو المنتج اللي يهمّك وبعطيك التفاصيل." },
  { k: ["خصم", "عرض", "كوبون", "تخفيض"], a: "🎉 أكيد! استخدم كود AURA10 وبتاخد خصم 10% على أول طلب." },
  { k: ["إرجاع", "ارجاع", "استرجاع", "استبدال"], a: "↩️ سياسة الإرجاع عندنا 14 يوم. المنتج لازم يكون بحالته الأصلية، وبنرجّعلك المبلغ كامل." },
  { k: ["مرحبا", "اهلا", "هلا", "سلام", "هاي"], a: "أهلاً وسهلاً فيك في Aura! 👋 كيف فيني ساعدك اليوم؟" },
  { k: ["شكرا", "يسلمو", "مشكور"], a: "العفو! 💚 موجود لأي سؤال تاني." },
];

function cannedReply(text) {
  const t = text.toLowerCase();
  for (const r of cannedRules) {
    if (r.k.some((k) => t.includes(k))) return r.a;
  }
  return "سؤال حلو! 🤔 بالنسخة التجريبية ردودي محدودة. لمّا تفعّل Claude الحقيقي، رح قدر جاوبك على أي شي بذكاء كامل. (شوف chat.js)";
}

function addMessage(text, who) {
  const row = document.createElement("div");
  row.className = "c-row " + who;
  row.innerHTML = `
    <div class="c-avatar">${who === "bot" ? "◈" : "أنت"}</div>
    <div class="c-bubble"></div>`;
  row.querySelector(".c-bubble").textContent = text;
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
  return row;
}

function showTyping() {
  const row = document.createElement("div");
  row.className = "c-row bot";
  row.innerHTML = `
    <div class="c-avatar">◈</div>
    <div class="c-bubble"><span class="c-typing"><span></span><span></span><span></span></span></div>`;
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
  return row;
}

async function botReply(userText) {
  const typing = showTyping();
  sendBtn.disabled = true;
  try {
    let reply;
    if (USE_API) {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok) throw new Error("API " + res.status);
      const data = await res.json();
      reply = data.reply;
    } else {
      await new Promise((r) => setTimeout(r, 600)); // محاكاة تفكير
      reply = cannedReply(userText);
    }
    typing.remove();
    addMessage(reply, "bot");
    history.push({ role: "assistant", content: reply });
  } catch (err) {
    typing.remove();
    addMessage("صار خطأ بالاتصال: " + err.message + "\nتأكد إنّو الـ backend شغّال.", "bot");
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

function handleSend(text) {
  text = text.trim();
  if (!text) return;
  addMessage(text, "user");
  history.push({ role: "user", content: text });
  input.value = "";
  suggest.style.display = "none";
  botReply(text);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSend(input.value);
});

document.querySelectorAll(".c-chip").forEach((chip) => {
  chip.addEventListener("click", () => handleSend(chip.textContent));
});

// رسالة ترحيب
addMessage("أهلاً فيك في Aura! 👋 أنا مساعدك الذكي. اسألني عن المنتجات، التوصيل، الإرجاع، أو أي شي تاني.", "bot");
