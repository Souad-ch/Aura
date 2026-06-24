# Aura AI — Backend (Claude الحقيقي)

هذا backend صغير بـ Node.js بيربط مولّد الأوصاف بموديل **Claude Opus 4.8**.
وظيفته الأساسية: **يخبّي مفتاح الـ API** بحيث ما ينعرض للمتصفح (لأنّو الموقع الثابت
ما بينفع يحمل مفتاح سرّي).

## المتطلبات
- Node.js نسخة 18 أو أحدث
- مفتاح API من Anthropic → https://console.anthropic.com

## التشغيل (خطوة خطوة)

```bash
# 1) ادخل لمجلد الـ backend
cd server-example

# 2) ثبّت المكتبات
npm install

# 3) جهّز مفتاحك
cp .env.example .env
#    بعدها افتح .env وحط مفتاحك الحقيقي مكان sk-ant-xxxx

# 4) شغّل السيرفر
npm start
#    رح يطبع: ✅ Aura AI backend على http://localhost:3000
```

## ربطه بالواجهة
بملف `tool.js` (بالمجلد الرئيسي) غيّر السطر:

```js
const USE_API = false;   // غيّرها لـ true
```

افتح `tool.html` بالمتصفح، واملأ النموذج — هلّق التوليد بيصير عبر Claude الحقيقي. 🎉

## كيف يشتغل؟
- الواجهة (المتصفح) ترسل بيانات المنتج إلى `http://localhost:3000/api/generate`
- الـ backend يستدعي Claude بالمفتاح السرّي، ويرجّع JSON فيه:
  `desc`، `title`، `meta`، `social`
- المفتاح يبقى على السيرفر فقط — آمن.

## للنشر (production)
- انشر الـ backend على خدمة مثل Render / Railway / Fly.io / Vercel
- حط `ANTHROPIC_API_KEY` كمتغيّر بيئة على المنصّة (مش بالكود)
- غيّر `API_URL` بملف `tool.js` لرابط السيرفر المنشور

## نقطتا النهاية (Endpoints)
هذا الـ backend بيخدم أداتين:
- `POST /api/generate` → مولّد أوصاف المنتجات (يستخدمها `tool.js`)
- `POST /api/chat` → مساعد المتجر الذكي / الشات بوت (يستخدمها `chat.js`)

لتفعيل الشات بوت الحقيقي: بملف `chat.js` غيّر `USE_API = true`.

## ملاحظة أمان مهمة
- **لا تضع المفتاح أبداً داخل ملفات JS اللي بتنشرها للمتصفح.**
- ملف `.env` مُستثنى من Git (شوف `.gitignore`) — لا ترفعه.
- كل استدعاء للـ API بيكلّف مبلغ صغير حسب أسعار Anthropic.
