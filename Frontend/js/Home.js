//Faqs

const questions = document.querySelectorAll(".faq-q");
questions.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const item = btn.parentElement;
    item.classList.toggle("open");
    const sign = btn.querySelector("span");
    sign.textContent = item.classList.contains("open") ? "−" : "+";
  });
});

// Showcases tabs

const profiles = {
  dev: {
    initials: "AR",
    name: "Alex Rivera",
    role: "Senior Full-Stack Architect",
    bio: "Engineering distributed cloud architectures and scalable React apps.",
    tags: [
      "React / Next.js",
      "Node.js",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
    ],
  },
  min: {
    initials: "SC",
    name: "Sam Carter",
    role: "Technical Writer",
    bio: "Turning complex engineering topics into clear, readable articles.",
    tags: ["Documentation", "Markdown", "Git", "API Docs", "Editing"],
  },
  studio: {
    initials: "ML",
    name: "Maya Lopez",
    role: "Brand & Product Designer",
    bio: "Designing bold visual identities and playful digital products.",
    tags: ["Figma", "Illustration", "Branding", "Motion", "Prototyping"],
  },
};

const mockTabs = document.querySelectorAll(".mock-tab");

mockTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    mockTabs.forEach(function (t) {
      t.classList.remove("active");
    });
    tab.classList.add("active");

    const p = profiles[tab.dataset.profile];
    document.getElementById("m-initials").textContent = p.initials;
    document.getElementById("m-name").textContent = p.name;
    document.getElementById("m-role").textContent = p.role;
    document.getElementById("m-bio").textContent = p.bio;

    const tagsBox = document.getElementById("m-tags");
    tagsBox.innerHTML = "";
    p.tags.forEach(function (text) {
      const span = document.createElement("span");
      span.textContent = text;
      tagsBox.appendChild(span);
    });
  });
});

// ================= Home navbar: logged-in state =================
(function () {
  const currentUser = localStorage.getItem("currentUser");
  const remembered = localStorage.getItem("rememberedUser");
  const sessionActive = sessionStorage.getItem("sessionActive");

  if (!currentUser || (!remembered && !sessionActive)) return;

  const navRight = document.querySelector(".nav .nav-right");
  if (!navRight) return;

  let users = [];
  try { users = JSON.parse(localStorage.getItem("users")) || []; } catch {}
  const account = users.find((u) => u.email === currentUser) || {};

  let portfolio = null;
  try { portfolio = JSON.parse(localStorage.getItem("portfolio_" + currentUser)); } catch {}

  navRight.innerHTML = `
    <a href="./personalInfo.html" class="signin btn-outline btn">
      ${portfolio?.personal?.name || account.name || "Dashboard"}
    </a>
    <button id="home-logout" class="btn btn-primary" type="button">Sign Out</button>
  `;

  document.getElementById("home-logout").addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberedUser");
    sessionStorage.removeItem("sessionActive");
    location.reload();
  });
})();

// ================= Hero counter animation =================
document.querySelectorAll(".stats .stat b").forEach((el) => {
  const text = el.textContent.trim();
  const match = text.match(/^([\d,\.]+)(.*)$/);
  if (!match) return;

  const target = parseFloat(match[1].replace(/,/g, ""));
  const suffix = match[2] || "";
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = target * eased;
    el.textContent =
      (match[1].includes(",")
        ? Math.round(val).toLocaleString()
        : (Number.isInteger(target) ? Math.round(val) : val.toFixed(1))) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
});
