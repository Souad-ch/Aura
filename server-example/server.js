// ===== Aura AI — Backend صغير لربط Claude الحقيقي =====
// يحمي مفتاح الـ API (ما بينعرض للمتصفح) ويولّد أوصاف منتجات بالذكاء الاصطناعي.
//
// التشغيل:
//   1) cd server-example
//   2) npm install
//   3) انسخ .env.example إلى .env وحط مفتاحك
//   4) npm start
//   5) بـ tool.js غيّر USE_API = true

import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
app.use(cors());
app.use(express.json());

// المفتاح بيتقرأ من متغيّر البيئة ANTHROPIC_API_KEY — لا تحطّه بالكود أبداً.
const client = new Anthropic();

const SYSTEM = `أنت كاتب تسويقي محترف متخصص بأوصاف المنتجات للمتاجر الإلكترونية.
تكتب بالعربية الفصحى المبسّطة. أعِد دائماً JSON صالح فقط، بدون أي نص إضافي،
بهذا الشكل بالضبط:
{
  "desc": "وصف المنتج (فقرة + نقاط بعلامة ✔)",
  "title": "عنوان SEO (أقل من 60 حرفاً)",
  "meta": "وصف ميتا (أقل من 155 حرفاً)",
  "social": "بوست سوشال ميديا مع إيموجي وهاشتاغات"
}`;

app.post("/api/generate", async (req, res) => {
  const { name, category, features, audience, tone } = req.body || {};
  if (!name || !features) {
    return res.status(400).json({ error: "name و features مطلوبين" });
  }

  const toneMap = {
    professional: "احترافية",
    friendly: "ودّية",
    luxury: "فخمة وراقية",
    energetic: "حماسية",
  };

  const userPrompt =
    `اسم المنتج: ${name}\n` +
    `الفئة: ${category || "غير محددة"}\n` +
    `المميزات: ${features}\n` +
    `الجمهور المستهدف: ${audience || "عام"}\n` +
    `نبرة الكتابة المطلوبة: ${toneMap[tone] || "احترافية"}\n\n` +
    `اكتب المحتوى وأعِد JSON فقط.`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: "user", content: userPrompt }],
    });

    // استخراج نص الرد ثم تحويله JSON
    const text = message.content.find((b) => b.type === "text")?.text ?? "{}";
    const json = JSON.parse(text);
    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "فشل التوليد: " + err.message });
  }
});

// ===== مساعد المتجر (Chatbot) =====
const CHAT_SYSTEM = `أنت "مساعد Aura"، مساعد ودود وذكي لمتجر إلكتروني.
- تحكي بالعربية البسيطة وبأسلوب لطيف ومختصر.
- تساعد الزبائن بأسئلة المنتجات، التوصيل، الأسعار، الخصومات، والإرجاع.
- إذا ما بتعرف معلومة محددة، اطلب من الزبون التواصل مع الدعم بدل ما تخترع.
- شجّع الزبون على الشراء بلطف بدون إلحاح.

معلومات المتجر:
- التوصيل: 2 إلى 5 أيام عمل. مجاني فوق 50$.
- الإرجاع: خلال 14 يوم، المنتج بحالته الأصلية.
- كود خصم 10% لأول طلب: AURA10.`;

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages مطلوبة" });
  }
  try {
    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: CHAT_SYSTEM,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    const reply = message.content.find((b) => b.type === "text")?.text ?? "…";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "فشل الرد: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Aura AI backend على http://localhost:${PORT}`));
