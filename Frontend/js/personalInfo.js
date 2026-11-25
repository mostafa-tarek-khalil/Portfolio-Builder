// ================= Keys & data (read only) =================
const DATA_KEY = "portfolioData";      // written by your editor page, read here and by portfolio.js
const SAVED_KEY = "savedPortfolios";   // snapshots created with the Save button on the portfolio page
const TEMPLATE_NAMES = { 1: "Minimal Mono Canvas", 2: "Modern Tech Stack", 3: "Creative Studio Grid", 4: "Executive Lead Suite" };

// Shown only when your editor hasn't saved any data yet
const demoData = {
  name: "Sarah Jenkins", jobTitle: "Senior UI/UX Designer & Frontend Developer", location: "San Francisco, CA",
  about: "Passionate product designer and frontend developer with 5+ years of experience building scalable design systems, elegant web applications, and intuitive user experiences for high-growth tech startups.",
  photo: "",
  skills: ["Figma", "UI/UX Design", "Tailwind CSS", "React.js", "TypeScript", "Node.js", "Design Systems"],
  education: [{ school: "Stanford University", degree: "B.S. in Computer Science", period: "2016 - 2020" }],
  experience: [
    { company: "TechCorp Solutions", role: "Senior Product Designer", period: "2022 - Present", description: "Leading design systems and user research for enterprise SaaS applications reaching over 500k monthly active users." },
    { company: "Creative Labs", role: "Frontend Developer", period: "2020 - 2022", description: "Built responsive web platforms using React, Next.js, and Tailwind CSS for international client brands." }
  ],
  projects: [
    { title: "SaaS Analytics Dashboard", description: "Real-time financial analytics portal for SaaS startup founders with custom data visualizer widgets.", github: "https://github.com", demo: "https://example.com" },
    { title: "AI Copywriting Assistant", description: "Web app offering real-time AI-powered marketing copy suggestions using OpenAI API integration.", github: "https://github.com", demo: "https://example.com" }
  ],
  contact: { email: "sarah.jenkins@example.com", phone: "+1 (555) 019-2834", linkedin: "https://linkedin.com", github: "https://github.com", website: "https://example.com" }
};

// ================= Helpers =================
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safeUrl = (u) => (/^(https?:\/\/|data:image\/)/i.test(u || "") ? esc(u) : "");
const initials = (n) => (n || "?").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
const skillName = (s) => (typeof s === "string" ? s : s.name || "");
const has = (a) => Array.isArray(a) && a.length > 0;

function read(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (e) { return fallback; }
}

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) location.replace("Sign.html");
const accountData = read("portfolio_" + currentUser, {personal:{}});
if (!accountData || !accountData.personal) location.replace("createportfolio.html");
function normalizeAccount(d) {
  const p=d.personal||{}, c=d.socials||{};
  return {name:p.name||"",jobTitle:p.title||"",location:p.location||"",about:p.bio||"",photo:p.photo||"",
    skills:d.skills||[],experience:(d.positions||[]).map(x=>({role:x.job,company:x.company,period:x.years,description:x.desc})),
    education:(d.education||[]).map(x=>({degree:x.degree,school:x.school,period:x.years})),
    projects:(d.projects||[]).map(x=>({title:x.name,description:x.desc,github:x.github,demo:x.demo})),
    contact:{email:p.email||"",phone:p.phone||"",linkedin:c.linkedin||"",github:c.github||"",website:c.website||""}};
}
let info = normalizeAccount(accountData);
localStorage.setItem(DATA_KEY, JSON.stringify({...info,templateId:accountData.templateId||1,published:true}));
let saved = read(SAVED_KEY + "_" + currentUser, []);

let toastTimer;
function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 2500);
}

// ================= 1) Profile =================
function renderProfile() {
  const url = safeUrl(info.photo);
  $("photoPreview").innerHTML = url ? `<img src="${url}" alt="">` : esc(initials(info.name));
  $("profileName").textContent = info.name || "—";
}

// ================= 2) Portfolio information (read only) =================
const kv = (label, value, full = false) =>
  `<div class="kv ${full ? "full" : ""}"><span>${label}</span><p>${value ? esc(value) : `<i class="dash-empty">—</i>`}</p></div>`;

const kvLink = (label, value, href) => {
  const url = href || safeUrl(value);
  return `<div class="kv"><span>${label}</span>${value
    ? (url ? `<a href="${url}" target="_blank" rel="noopener">${esc(value)}</a>` : `<p>${esc(value)}</p>`)
    : `<p><i class="dash-empty">—</i></p>`}</div>`;
};

const none = `<p class="empty-note">Nothing added yet.</p>`;

function renderInfo() {
  const c = info.contact || {};

  const experience = has(info.experience) ? info.experience.map((x) => `
    <div class="entry">
      <div class="entry-head"><b>${esc(x.role)}</b><span class="period">${esc(x.period)}</span></div>
      <div class="entry-sub">${esc(x.company)}</div>
      <p>${esc(x.description)}</p>
    </div>`).join("") : none;

  const education = has(info.education) ? info.education.map((x) => `
    <div class="entry">
      <div class="entry-head"><b>${esc(x.degree)}</b><span class="period">${esc(x.period || x.year)}</span></div>
      <div class="entry-sub">${esc(x.school)}</div>
    </div>`).join("") : none;

  const projects = has(info.projects) ? info.projects.map((p) => `
    <div class="entry">
      <div class="entry-head"><b>${esc(p.title)}</b></div>
      <p>${esc(p.description)}</p>
      <div class="entry-links">
        ${safeUrl(p.github) ? `<a href="${safeUrl(p.github)}" target="_blank" rel="noopener">GitHub</a>` : ""}
        ${safeUrl(p.demo) ? `<a href="${safeUrl(p.demo)}" target="_blank" rel="noopener">Live Demo</a>` : ""}
      </div>
    </div>`).join("") : none;

  $("infoForm").innerHTML = `
    <div class="block"><h3>About</h3>
      <div class="grid2">${kv("Job Title", info.jobTitle)}${kv("Location", info.location)}${kv("About Me", info.about, true)}</div>
    </div>

    <div class="block"><h3>Contact &amp; Links</h3>
      <div class="grid2">
        ${kvLink("Email", c.email, c.email ? `mailto:${esc(c.email)}` : "")}${kvLink("Phone", c.phone, c.phone ? `tel:${esc(c.phone)}` : "")}
        ${kvLink("LinkedIn", c.linkedin)}${kvLink("GitHub", c.github)}${kvLink("Website", c.website)}
      </div>
    </div>

    <div class="block"><h3>Skills &amp; Technologies</h3>
      <div class="chips">${has(info.skills) ? info.skills.map((s) => `<span class="chip-item">${esc(skillName(s))}</span>`).join("") : none}</div>
    </div>

    <div class="block"><h3>Work Experience</h3>${experience}</div>
    <div class="block"><h3>Education</h3>${education}</div>
    <div class="block"><h3>Projects</h3>${projects}</div>`;
}

// ================= 3) Saved portfolios =================
function renderSaved() {
  $("savedCount").textContent = saved.length;
  $("savedGrid").innerHTML = saved.length ? saved.map((s) => {
    const date = new Date(s.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `
    <article class="sp-card" tabindex="0" role="button" data-open="${esc(s.id)}" aria-label="Open ${esc(s.data.name)} in full screen">
      <button class="sp-del" type="button" data-del="${esc(s.id)}" aria-label="Delete">✕</button>
      <div class="thumb"><iframe src="portfolio.html?saved=${encodeURIComponent(s.id)}" loading="lazy" tabindex="-1" title=""></iframe></div>
      <div class="sp-meta">
        <b>${esc(s.data.name)}</b><span>${esc(s.data.jobTitle)}</span>
        <div class="sp-foot"><em class="tpl-badge">${esc(TEMPLATE_NAMES[s.templateId] || "Template")}</em><small>${date}</small></div>
      </div>
    </article>`;
  }).join("") : `<p class="empty-saved">No saved portfolios yet.<br>Press <b>Add New</b>, pick a template, then press <b>Save</b> on the portfolio page.</p>`;
}

// SweetAlert-style confirmation (custom, no library). Resolves true/false; stays open on "yes"
function confirmDelete(s) {
  return new Promise((resolve) => {
    const box = $("swal");
    $("swalIcon").className = "swal-icon warn";
    $("swalIcon").textContent = "!";
    $("swalTitle").textContent = "Delete this portfolio?";
    $("swalText").innerHTML = `<b>${esc(s.data.name)}</b> · ${esc(TEMPLATE_NAMES[s.templateId] || "Template")}<br>You won’t be able to undo this.`;
    $("swalActions").hidden = false;
    box.hidden = false;
    $("swalCancel").focus();

    const finish = (yes) => {
      document.removeEventListener("keydown", onKey);
      box.removeEventListener("click", onBackdrop);
      $("swalOk").onclick = $("swalCancel").onclick = null;
      if (!yes) box.hidden = true;
      resolve(yes);
    };
    const onKey = (e) => { if (e.key === "Escape") finish(false); };
    const onBackdrop = (e) => { if (e.target === box) finish(false); };
    document.addEventListener("keydown", onKey);
    box.addEventListener("click", onBackdrop);
    $("swalOk").onclick = () => finish(true);
    $("swalCancel").onclick = () => finish(false);
  });
}

function showDeleted() {
  $("swalIcon").className = "swal-icon ok";
  $("swalIcon").textContent = "✓";
  $("swalTitle").textContent = "Deleted!";
  $("swalText").textContent = "Your saved portfolio has been removed.";
  $("swalActions").hidden = true;
  setTimeout(() => { $("swal").hidden = true; }, 1300);
}

$("savedGrid").addEventListener("click", async (e) => {
  const del = e.target.closest("[data-del]");
  if (del) {
    e.stopPropagation();
    const s = saved.find((x) => x.id === del.dataset.del);
    if (!s || !(await confirmDelete(s))) return;
    saved = saved.filter((x) => x.id !== s.id);
    localStorage.setItem(SAVED_KEY + "_" + currentUser, JSON.stringify(saved));
    renderSaved();
    showDeleted();
    return;
  }
  const card = e.target.closest("[data-open]");
  if (card) openFull(card.dataset.open);
});
$("savedGrid").addEventListener("keydown", (e) => {
  const card = e.target.closest("[data-open]");
  if (card && e.target === card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openFull(card.dataset.open); }
});

// Full screen viewer: the portfolio keeps its own template theme inside the frame
function openFull(id) {
  const s = saved.find((x) => x.id === id);
  if (!s) return;
  $("fsTitle").textContent = s.data.name;
  $("fsSub").textContent = TEMPLATE_NAMES[s.templateId] || "";
  $("fsFrame").src = `portfolio.html?saved=${encodeURIComponent(id)}`;
  $("fs").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeFull() {
  $("fs").hidden = true;
  $("fsFrame").src = "about:blank";
  document.body.style.overflow = "";
}
$("fsClose").addEventListener("click", closeFull);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("fs").hidden) closeFull(); });

// ================= Keep the page in sync =================
// When the editor (or the Save button) changes the data in another tab, refresh what's shown.
function refresh() {
  const latestInfo = normalizeAccount(read("portfolio_" + currentUser, accountData));
  if (JSON.stringify(latestInfo) !== JSON.stringify(info)) { info = latestInfo; renderProfile(); renderInfo(); }
  const latestSaved = read(SAVED_KEY + "_" + currentUser, []);
  if (JSON.stringify(latestSaved) !== JSON.stringify(saved)) { saved = latestSaved; renderSaved(); }
}
window.addEventListener("storage", refresh);
window.addEventListener("focus", refresh);



renderProfile();
renderInfo();
renderSaved();
