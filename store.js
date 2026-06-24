// ===== Aura — طبقة البيانات والمصادقة (تجريبية، تشتغل بالمتصفح) =====
// ⚠️ تنبيه: هذا تخزين محلي (localStorage) لأغراض العرض/النموذج فقط.
// لا تستخدمه لكلمات مرور حقيقية — في منصّة حقيقية نستخدم Supabase/Firebase + تشفير.

const DB_KEY = "aura_users";
const SESSION_KEY = "aura_session";

function loadDB() {
  try { return JSON.parse(localStorage.getItem(DB_KEY)) || {}; }
  catch { return {}; }
}
function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

const Aura = {
  // --- المصادقة ---
  signup(name, email, password) {
    email = email.trim().toLowerCase();
    const db = loadDB();
    if (db[email]) throw new Error("هذا البريد مسجّل مسبقاً.");
    if (password.length < 4) throw new Error("كلمة المرور قصيرة جداً (4 أحرف على الأقل).");
    db[email] = {
      name: name.trim(),
      password, // demo فقط
      store: { name: (name.trim() + " Store"), desc: "" },
      products: [],
      customers: [],
      createdAt: Date.now(),
    };
    saveDB(db);
    localStorage.setItem(SESSION_KEY, email);
    return db[email];
  },

  login(email, password) {
    email = email.trim().toLowerCase();
    const db = loadDB();
    const user = db[email];
    if (!user || user.password !== password) {
      throw new Error("البريد أو كلمة المرور غير صحيحة.");
    }
    localStorage.setItem(SESSION_KEY, email);
    return user;
  },

  logout() { localStorage.removeItem(SESSION_KEY); },

  currentEmail() { return localStorage.getItem(SESSION_KEY); },

  currentUser() {
    const email = this.currentEmail();
    if (!email) return null;
    return loadDB()[email] || null;
  },

  // يحرس الصفحات المحمية — يرجّع للوغ إن لم يكن مسجّلاً
  requireAuth() {
    if (!this.currentEmail()) {
      window.location.href = "auth.html";
      return false;
    }
    return true;
  },

  // --- حفظ تعديلات المستخدم الحالي ---
  _update(mutator) {
    const email = this.currentEmail();
    const db = loadDB();
    if (!db[email]) throw new Error("الجلسة منتهية، سجّل دخول من جديد.");
    mutator(db[email]);
    saveDB(db);
    return db[email];
  },

  // --- المنتجات ---
  addProduct(p) {
    return this._update((u) => {
      u.products.push({ id: Date.now() + "", ...p });
    });
  },
  deleteProduct(id) {
    return this._update((u) => {
      u.products = u.products.filter((x) => x.id !== id);
    });
  },

  // --- الزبائن ---
  addCustomer(c) {
    return this._update((u) => {
      u.customers.push({ id: Date.now() + "", ...c });
    });
  },
  deleteCustomer(id) {
    return this._update((u) => {
      u.customers = u.customers.filter((x) => x.id !== id);
    });
  },

  // --- إعداد المتجر ---
  saveStore(store) {
    return this._update((u) => { u.store = { ...u.store, ...store }; });
  },
};
