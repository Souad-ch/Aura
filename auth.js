// ===== صفحة المصادقة =====

// إذا مسجّل دخول أصلاً، روح مباشرة للوحة التحكّم
if (Aura.currentEmail()) window.location.href = "dashboard.html";

const tabs = document.querySelectorAll(".auth-tab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const isLogin = tab.dataset.tab === "login";
    loginForm.hidden = !isLogin;
    signupForm.hidden = isLogin;
  });
});

// تسجيل دخول
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const err = document.getElementById("lErr");
  err.textContent = "";
  try {
    Aura.login(
      document.getElementById("lEmail").value,
      document.getElementById("lPass").value
    );
    window.location.href = "dashboard.html";
  } catch (ex) {
    err.textContent = ex.message;
  }
});

// إنشاء حساب
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const err = document.getElementById("sErr");
  err.textContent = "";
  try {
    Aura.signup(
      document.getElementById("sName").value,
      document.getElementById("sEmail").value,
      document.getElementById("sPass").value
    );
    window.location.href = "dashboard.html";
  } catch (ex) {
    err.textContent = ex.message;
  }
});
