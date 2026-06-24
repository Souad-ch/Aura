// Sticky header shadow on scroll
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 8);
});

// Mobile menu toggle
const toggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".nav-mobile");
toggle.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  toggle.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
});

// Close mobile menu when a link is tapped
mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

// Hero email form — simple front-end validation feedback
const form = document.getElementById("start");
form.addEventListener("submit", () => {
  const input = form.querySelector("input");
  if (input.checkValidity()) {
    const btn = form.querySelector("button");
    const original = btn.textContent;
    btn.textContent = "Welcome aboard 🎉";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      input.value = "";
    }, 2500);
  } else {
    input.reportValidity();
  }
});
