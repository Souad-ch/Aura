// ===== لوحة التحكّم =====

// حارس: لازم يكون مسجّل دخول
if (!Aura.requireAuth()) throw new Error("redirecting");

let user = Aura.currentUser();

// --- عناصر ---
const navlinks = document.querySelectorAll(".d-navlink[data-view]");
const views = document.querySelectorAll(".d-view");
const sidebar = document.getElementById("sidebar");

// --- تنقّل بين الأقسام ---
function showView(name) {
  views.forEach((v) => (v.hidden = v.dataset.view !== name));
  navlinks.forEach((l) => l.classList.toggle("active", l.dataset.view === name));
  sidebar.classList.remove("open");
}
navlinks.forEach((l) => l.addEventListener("click", () => showView(l.dataset.view)));
document.querySelectorAll("[data-goto]").forEach((b) =>
  b.addEventListener("click", () => showView(b.dataset.goto))
);

// قائمة الموبايل
document.getElementById("burger").addEventListener("click", () => sidebar.classList.toggle("open"));

// تسجيل خروج
document.getElementById("logout").addEventListener("click", () => {
  Aura.logout();
  window.location.href = "auth.html";
});

// --- العرض ---
function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function renderHeader() {
  document.getElementById("userEmail").textContent = Aura.currentEmail();
  document.getElementById("storeNameTop").textContent = user.store.name || "متجري";
  document.getElementById("welcomeName").textContent = user.name || "";
}

function renderStats() {
  document.getElementById("statProducts").textContent = user.products.length;
  document.getElementById("statCustomers").textContent = user.customers.length;
  document.getElementById("statStore").textContent = user.store.name || "—";
}

function renderProducts() {
  const list = document.getElementById("productList");
  if (!user.products.length) {
    list.innerHTML = `<p class="d-empty">ما في منتجات بعد — أضف أول منتج 👆</p>`;
    return;
  }
  list.innerHTML = user.products
    .map(
      (p) => `
    <div class="d-card">
      <button class="d-del" data-id="${p.id}" title="حذف">🗑</button>
      <h4>${esc(p.name)}</h4>
      <span class="price">${esc(p.price)} $</span>
      <span class="meta">${esc(p.cat || "—")} · مخزون: ${esc(p.stock || 0)}</span>
      ${p.desc ? `<span class="desc">${esc(p.desc)}</span>` : ""}
    </div>`
    )
    .join("");
  list.querySelectorAll(".d-del").forEach((b) =>
    b.addEventListener("click", () => {
      user = Aura.deleteProduct(b.dataset.id);
      refresh();
    })
  );
}

function renderCustomers() {
  const tbody = document.getElementById("customerList");
  if (!user.customers.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#4b5563;padding:24px">ما في زبائن بعد</td></tr>`;
    return;
  }
  tbody.innerHTML = user.customers
    .map(
      (c) => `
    <tr>
      <td>${esc(c.name)}</td>
      <td>${esc(c.email || "—")}</td>
      <td>${esc(c.phone || "—")}</td>
      <td><button class="del-c" data-id="${c.id}" title="حذف">🗑</button></td>
    </tr>`
    )
    .join("");
  tbody.querySelectorAll(".del-c").forEach((b) =>
    b.addEventListener("click", () => {
      user = Aura.deleteCustomer(b.dataset.id);
      refresh();
    })
  );
}

function renderSettings() {
  document.getElementById("stName").value = user.store.name || "";
  document.getElementById("stDesc").value = user.store.desc || "";
}

function refresh() {
  user = Aura.currentUser();
  renderHeader();
  renderStats();
  renderProducts();
  renderCustomers();
}

// --- نماذج ---
document.getElementById("productForm").addEventListener("submit", (e) => {
  e.preventDefault();
  user = Aura.addProduct({
    name: document.getElementById("pName").value.trim(),
    price: document.getElementById("pPrice").value,
    cat: document.getElementById("pCat").value.trim(),
    stock: document.getElementById("pStock").value,
    desc: document.getElementById("pDesc").value.trim(),
  });
  e.target.reset();
  refresh();
});

document.getElementById("customerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  user = Aura.addCustomer({
    name: document.getElementById("cName").value.trim(),
    email: document.getElementById("cEmail").value.trim(),
    phone: document.getElementById("cPhone").value.trim(),
  });
  e.target.reset();
  refresh();
});

document.getElementById("storeForm").addEventListener("submit", (e) => {
  e.preventDefault();
  user = Aura.saveStore({
    name: document.getElementById("stName").value.trim(),
    desc: document.getElementById("stDesc").value.trim(),
  });
  const saved = document.getElementById("stSaved");
  saved.textContent = "✓ تم الحفظ";
  setTimeout(() => (saved.textContent = ""), 2000);
  refresh();
});

// تشغيل أولي
renderSettings();
refresh();
