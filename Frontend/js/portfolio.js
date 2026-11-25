// =====================================================
// 1) Get the data  (the ONLY part you adapt to your editor)
// =====================================================
// Expected shape:
// { templateId: 1-4, published: true, name, jobTitle, about, photo,
//   skills: ["Figma", {name:"React", level:90}],
//   education:  [{ school, degree, year }],
//   experience: [{ company, role, period, description }],
//   projects:   [{ title, description, github, demo }],
//   contact:    { email, phone, linkedin, github } }
function getPortfolio() {
  try {
    const saved = JSON.parse(localStorage.getItem("portfolioData"));
    if (saved) return saved;
  } catch (e) {}
  return demoData; // fallback so the page never looks empty while developing
}

const demoData = {
  templateId: 4, published: true, available: true,
  name: "Sarah Jenkins", jobTitle: "Senior UI/UX Designer & Frontend Developer",
  location: "San Francisco, CA",
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

// =====================================================
// 2) Helpers
// =====================================================
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safeUrl = (u) => (/^(https?:\/\/|data:image\/)/i.test(u || "") ? esc(u) : "");
const initials = (n) => (n || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const skillName = (s) => (typeof s === "string" ? s : s.name);
const skillLevel = (s, i) => (typeof s === "object" && s.level ? s.level : 70 + ((i * 7) % 26)); // default level if none given
const has = (arr) => Array.isArray(arr) && arr.length > 0;

function avatar(d, cls = "") {
  const url = safeUrl(d.photo);
  return url ? `<img class="photo ${cls}" src="${url}" alt="${esc(d.name)}">` : `<div class="photo ${cls} initials">${esc(initials(d.name))}</div>`;
}

function links(d) {
  const c = d.contact || {};
  const out = [];
  if (c.email) out.push(`<a href="mailto:${esc(c.email)}">Email</a>`);
  if (safeUrl(c.github)) out.push(`<a href="${safeUrl(c.github)}" target="_blank" rel="noopener">GitHub</a>`);
  if (safeUrl(c.linkedin)) out.push(`<a href="${safeUrl(c.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
  if (c.phone) out.push(`<a href="tel:${esc(c.phone)}">${esc(c.phone)}</a>`);
  return out.join("");
}

function projectLinks(p) {
  const out = [];
  if (safeUrl(p.github)) out.push(`<a href="${safeUrl(p.github)}" target="_blank" rel="noopener">GitHub</a>`);
  if (safeUrl(p.demo)) out.push(`<a href="${safeUrl(p.demo)}" target="_blank" rel="noopener">Live Demo</a>`);
  return out.join("");
}

const ICONS = {
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>',
  cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
  folder: '<path d="M20 20a2 2 0 002-2V8a2 2 0 00-2-2h-7.9a2 2 0 01-1.7-.9l-.8-1.2A2 2 0 007.9 3H4a2 2 0 00-2 2v13a2 2 0 002 2z"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 00-1-3.5c3 0 6-2 6-5.5.1-1.3-.3-2.5-1-3.5.3-1.2.3-2.4 0-3.5 0 0-1 0-3 1.5a13.4 13.4 0 00-8 0C6 2 5 2 5 2c-.3 1.2-.3 2.4 0 3.5A5.4 5.4 0 004 9c0 3.5 3 5.5 6 5.5-.4.5-.7 1.100-.9 1.700-.2.600-.2 1.200-.1 1.800v4"/><path d="M9 18c-4.500 2-5-2-7-2"/>',
  linkedin: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20 15 15 0 010-20z"/>'
};
const icon = (n) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</svg>`;

// "Available for projects" badge (hidden when available === false)
const availBadge = (d) => (d.available === false ? "" : `<span class="avail"><i></i>Available for projects</span>`);

// Location / email / phone line
function metaLine(d) {
  const c = d.contact || {};
  const items = [];
  if (d.location) items.push(`<span>${icon("pin")}${esc(d.location)}</span>`);
  if (c.email) items.push(`<span>${icon("mail")}${esc(c.email)}</span>`);
  if (c.phone) items.push(`<span>${icon("phone")}${esc(c.phone)}</span>`);
  return items.length ? `<div class="meta">${items.join("")}</div>` : "";
}

// Section heading with icon
const sectionTitle = (ic, text) => `<h3 class="sec-title">${icon(ic)}${text}</h3>`;

// Footer shown in every template
function footer(d) {
  const c = d.contact || {};
  const soc = [];
  if (safeUrl(c.linkedin)) soc.push(`<a href="${safeUrl(c.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon("linkedin")}</a>`);
  if (safeUrl(c.github)) soc.push(`<a href="${safeUrl(c.github)}" target="_blank" rel="noopener" aria-label="GitHub">${icon("github")}</a>`);
  if (safeUrl(c.website)) soc.push(`<a href="${safeUrl(c.website)}" target="_blank" rel="noopener" aria-label="Website">${icon("globe")}</a>`);
  return `<footer class="pfooter"><span>© ${new Date().getFullYear()} ${esc(d.name)}. All rights reserved.</span><div class="soc">${soc.join("")}</div></footer>`;
}

// =====================================================
// 3) The four templates (same data, different design)
// =====================================================

// ---- 1) Minimal Mono Canvas (your UI) ----
function renderMinimal(d) {
  return `
  <div class="tpl tpl-minimal"><div class="wrap">
    <header class="m-hero">
      <div class="m-info">
        ${availBadge(d)}
        <h1>${esc(d.name)}</h1>
        <h2>${esc(d.jobTitle)}</h2>
        <p>${esc(d.about)}</p>
        ${metaLine(d)}
      </div>
      ${avatar(d)}
    </header>

    ${has(d.skills) ? `<section>${sectionTitle("code", "SKILLS &amp; TECHNOLOGIES")}
      <div class="chips">${d.skills.map((s) => `<span>${esc(skillName(s))}</span>`).join("")}</div></section>` : ""}

    ${has(d.experience) ? `<section>${sectionTitle("briefcase", "WORK EXPERIENCE")}
      <div class="m-timeline">${d.experience.map((x, i) => `
        <div class="m-item ${i === 0 ? "current" : ""}">
          <span class="m-node"></span>
          <div class="m-row"><b>${esc(x.role)}</b><span class="period">${esc(x.period)}</span></div>
          <div class="company">${esc(x.company)}</div>
          <p>${esc(x.description)}</p>
        </div>`).join("")}</div></section>` : ""}

    ${has(d.education) ? `<section>${sectionTitle("cap", "EDUCATION")}
      <div class="edu-list">${d.education.map((x) => `
        <div class="edu-card"><b>${esc(x.degree)}</b><span>${esc(x.school)}</span><small class="period">${esc(x.period || x.year)}</small></div>`).join("")}</div></section>` : ""}

    ${has(d.projects) ? `<section>${sectionTitle("folder", "FEATURED PROJECTS")}
      <div class="proj-grid">${d.projects.map((p) => `
        <article class="proj">
          <div class="proj-top"><b>${esc(p.title)}</b>${icon("external")}</div>
          <p>${esc(p.description)}</p>
          <div class="proj-links">
            ${safeUrl(p.github) ? `<a href="${safeUrl(p.github)}" target="_blank" rel="noopener">${icon("github")}Code</a>` : ""}
            ${safeUrl(p.demo) ? `<a href="${safeUrl(p.demo)}" target="_blank" rel="noopener">${icon("globe")}Live</a>` : ""}
          </div>
        </article>`).join("")}</div></section>` : ""}
  </div></div>`;
}

// ---- 2) Modern Tech Stack ----
function renderModernTech(d) {
  const stack = (d.skills || []).map((s) => `'${esc(skillName(s))}'`).join(", ");
  return `
  <div class="tpl tpl-tech"><div class="wrap">
    <header class="t-hero">
      ${avatar(d)}
      <div><span class="dot"></span> <b>${esc(d.name)}</b><h1>${esc(d.jobTitle)}</h1><p>${esc(d.about)}</p>${metaLine(d)}<nav class="links">${links(d)}</nav></div>
    </header>
    <div class="box code">const stack = [${stack}];</div>
    <div class="stat-row">
      <div class="box"><span>Projects</span><b>${(d.projects || []).length}</b></div>
      <div class="box"><span>Skills</span><b>${(d.skills || []).length}</b></div>
      <div class="box"><span>Roles</span><b class="green">${(d.experience || []).length}</b></div>
    </div>
    ${has(d.skills) ? `<h3>Skill Meters</h3><div class="meters">${d.skills.map((s, i) => `
      <div class="meter"><div class="meter-top"><span>${esc(skillName(s))}</span><span>${skillLevel(s, i)}%</span></div><div class="track"><i style="width:${skillLevel(s, i)}%"></i></div></div>`).join("")}</div>` : ""}
    ${has(d.projects) ? `<h3>Projects</h3><div class="cards">${d.projects.map((p) => `
      <article class="box"><h4>${esc(p.title)}</h4><p>${esc(p.description)}</p><div class="links">${projectLinks(p)}</div></article>`).join("")}</div>` : ""}
    ${has(d.experience) ? `<h3>Experience</h3>${d.experience.map((e) => `<div class="box exp"><b>${esc(e.role)}</b> · ${esc(e.company)} <span class="muted">${esc(e.period)}</span><p>${esc(e.description)}</p></div>`).join("")}` : ""}
    ${has(d.education) ? `<h3>Education</h3>${d.education.map((e) => `<div class="box exp"><b>${esc(e.degree)}</b> · ${esc(e.school)} <span class="muted">${esc(e.period || e.year)}</span></div>`).join("")}` : ""}
  </div></div>`;
}

// ---- 3) Creative Studio Grid ----
function renderCreative(d) {
  const grads = ["g1", "g2", "g3", "g4"];
  return `
  <div class="tpl tpl-creative"><div class="wrap">
    <header>
      ${avatar(d)}
      <div class="studio">STUDIO CANVAS</div>
      <h1>${esc(d.name)}</h1>
      <h2>${esc(d.jobTitle)}</h2>
      <p>${esc(d.about)}</p>
      ${metaLine(d)}<nav class="links">${links(d)}</nav>
    </header>
    ${has(d.projects) ? `<h3>Selected Work</h3><div class="work-grid">${d.projects.map((p, i) => `
      <article class="work ${grads[i % 4]}"><span class="num">0${i + 1}</span><h4>${esc(p.title)}</h4><p>${esc(p.description)}</p><div class="links">${projectLinks(p)}</div></article>`).join("")}</div>` : ""}
    ${has(d.skills) ? `<h3>Toolkit</h3><div class="pills">${d.skills.map((s) => `<span>${esc(skillName(s))}</span>`).join("")}</div>` : ""}
    ${has(d.experience) ? `<h3>Experience</h3><div class="two">${d.experience.map((e) => `<div class="glass"><b>${esc(e.role)}</b><small>${esc(e.company)} · ${esc(e.period)}</small><p>${esc(e.description)}</p></div>`).join("")}</div>` : ""}
    ${has(d.education) ? `<h3>Education</h3><div class="two">${d.education.map((e) => `<div class="glass"><b>${esc(e.degree)}</b><small>${esc(e.school)} · ${esc(e.period || e.year)}</small></div>`).join("")}</div>` : ""}
  </div></div>`;
}

// ---- 4) Executive Lead Suite ----
function renderExecutive(d) {
  return `
  <div class="tpl tpl-exec"><div class="wrap">
    <header>
      ${avatar(d)}
      <div><h1>${esc(d.name)}</h1><h2>${esc(d.jobTitle)}</h2><p>${esc(d.about)}</p>${metaLine(d)}<nav class="links">${links(d)}</nav></div>
    </header>
    <div class="metrics">
      <div><b>${(d.experience || []).length}</b><span>Leadership Roles</span></div>
      <div><b>${(d.projects || []).length}</b><span>Key Initiatives</span></div>
      <div><b>${(d.skills || []).length}</b><span>Core Competencies</span></div>
    </div>
    ${has(d.experience) ? `<h3>Leadership Timeline</h3><div class="timeline">${d.experience.map((e) => `
      <div class="t-item"><span class="t-dot"></span><small>${esc(e.period)}</small><b>${esc(e.role)}</b> · ${esc(e.company)}<p>${esc(e.description)}</p></div>`).join("")}</div>` : ""}
    ${has(d.projects) ? `<h3>Strategic Initiatives</h3><div class="cards">${d.projects.map((p) => `
      <article><h4>${esc(p.title)}</h4><p>${esc(p.description)}</p><div class="links">${projectLinks(p)}</div></article>`).join("")}</div>` : ""}
    ${has(d.skills) ? `<h3>Core Competencies</h3><div class="pills">${d.skills.map((s) => `<span>${esc(skillName(s))}</span>`).join("")}</div>` : ""}
    ${has(d.education) ? `<h3>Education</h3>${d.education.map((e) => `<p><b>${esc(e.degree)}</b>, ${esc(e.school)} (${esc(e.period || e.year)})</p>`).join("")}` : ""}
  </div></div>`;
}

const renderers = { 1: renderMinimal, 2: renderModernTech, 3: renderCreative, 4: renderExecutive };

// =====================================================
// 4) Start
// =====================================================
const params = new URLSearchParams(location.search);
const savedId = params.get("saved");              // ?saved=ID shows a saved snapshot (used by Personal Info)
const isSavedView = !!savedId;
const isPreview = params.has("preview") && !isSavedView;

const savedKey = "savedPortfolios_" + (localStorage.getItem("currentUser") || "guest");
const loadSaved = () => { try { return JSON.parse(localStorage.getItem(savedKey)) || []; } catch (e) { return []; } };
const snapshot = isSavedView ? loadSaved().find((s) => s.id === savedId) : null;

const data = snapshot ? snapshot.data : getPortfolio();
const templateId = snapshot ? snapshot.templateId : (Number(params.get("t")) || data.templateId || 1); // ?t=2 lets you test any template

document.title = `${data.name || "Portfolio"} | ${data.jobTitle || ""}`;
document.getElementById("previewBar").hidden = !isPreview;

// Public link shown in the top bar
const slug = (data.name || "portfolio").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const publicUrl = new URL(`portfolio.html?u=${slug}`, location.href).href;
document.getElementById("urlText").textContent = publicUrl.replace(/^https?:\/\//, "");
document.getElementById("urlLink").href = publicUrl;
document.getElementById("copyUrl").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  try { await navigator.clipboard.writeText(publicUrl); btn.textContent = "Copied!"; }
  catch (err) { btn.textContent = "Copy failed"; }
  setTimeout(() => (btn.textContent = "Copy"), 1500);
});

const wantedSlug = params.get("u");
const wrongLink = wantedSlug && wantedSlug !== slug && !isPreview;
const app = document.getElementById("app");
const notice = (title, text) => { app.innerHTML = `<div class="notice"><h1>${title}</h1><p>${text}</p></div>`; };

if (isSavedView && !snapshot) {
  notice("Saved portfolio not found", "It may have been deleted.");
} else if (!isSavedView && ((data.published === false && !isPreview) || wrongLink)) {
  notice("Portfolio not available", "This portfolio is not published yet.");
} else {
  app.innerHTML = (renderers[templateId] || renderMinimal)(data);
  document.querySelector(".wrap").insertAdjacentHTML("beforeend", footer(data));
  if (!isSavedView) setupSaveButton();   // no Save button inside the saved/full-screen view
}

// =====================================================
// 5) Save button: stores a snapshot for the Personal Info page
// =====================================================
function setupSaveButton() {
  const btn = document.getElementById("saveBtn");
  const label = btn.querySelector("span");
  btn.hidden = false;

  btn.addEventListener("click", () => {
    const list = loadSaved();
    const sameAs = (s) => JSON.stringify([s.templateId, s.data]) === JSON.stringify([templateId, data]);
    let text = "Saved ✓";

    if (list.some(sameAs)) {
      text = "Already saved";
    } else {
      list.unshift({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        savedAt: Date.now(),
        templateId,
        data: JSON.parse(JSON.stringify(data))
      });
      try { localStorage.setItem(savedKey, JSON.stringify(list)); }
      catch (e) { text = "Storage full"; }
    }
    label.textContent = text;
    setTimeout(() => (label.textContent = "Save"), 1600);
  });
}
