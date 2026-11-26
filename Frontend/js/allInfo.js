// ================= All Information page =================
const $ = (id) => document.getElementById(id);

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) location.replace("Sign.html");

let raw = {};
try {
  raw = JSON.parse(localStorage.getItem("portfolio_" + currentUser)) || {};
} catch { }
if (!raw.personal) location.replace("createportfolio.html");

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

const p = raw.personal || {};
const socials = raw.socials || {};

// ---------- Personal ----------
const initials = (p.name || "?")
  .split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

if (p.photo) {
  $("aiPhoto").innerHTML = `<img src="${esc(p.photo)}" alt="Profile photo">`;
} else {
  $("aiPhoto").textContent = initials;
}

$("aiName").textContent = p.name || "No name added";
$("aiTitle").textContent = p.title || "No professional title added";
$("aiLocation").textContent = p.location || "Not added";
$("aiEmail").textContent = p.email || "Not added";
$("aiPhone").textContent = p.phone || "Not added";
$("aiBio").textContent = p.bio || "No bio added yet.";

// ---------- Social links ----------
const links = [
  { icon: "fa-brands fa-linkedin-in", label: "LinkedIn", value: socials.linkedin },
  { icon: "fa-brands fa-github", label: "GitHub", value: socials.github },
  { icon: "fa-solid fa-globe", label: "Website", value: socials.website },
  { icon: "fa-solid fa-envelope", label: "Email", value: p.email, href: p.email ? "mailto:" + p.email : "" },
  { icon: "fa-solid fa-phone", label: "Phone", value: p.phone, href: p.phone ? "tel:" + p.phone : "" }
];

$("aiLinks").innerHTML = links.map((l) => {
  const href = l.href || (/^https?:\/\//i.test(l.value || "") ? esc(l.value) : "");
  return `<a class="link-card ${l.value ? "" : "empty"}" ${href ? `href="${href}" target="_blank" rel="noopener" style="overflow: hidden;"` : ""}>
      <span class="link-icon"><i class="${l.icon}"></i></span>
      <span>
        <em>${esc(l.label)}</em>
        <b>${l.value ? esc(l.value) : "Not added yet"}</b>
      </span>
    </a>`;
}).join("");

// ---------- Skills ----------
const skills = raw.skills || [];
$("aiSkillsCount").textContent = skills.length;
$("aiSkills").innerHTML = skills.length
  ? skills.map((s, i) => `<span class="chip" style="animation-delay:${i * 60}ms">${esc(s)}</span>`).join("")
  : `<p class="empty-note">No skills added yet.</p>`;

// ---------- Experience ----------
const exp = raw.positions || [];
$("aiExpCount").textContent = exp.length;
$("aiExperience").innerHTML = exp.length
  ? exp.map((e, i) => `
      <article class="tl-item" style="animation-delay:${i * 90}ms">
        <span class="tl-dot"></span>
        <div class="tl-body">
          <h4>${esc(e.job || "Role")}</h4>
          <span class="tl-meta">${esc(e.company || "")} ${e.company && e.years ? "•" : ""} ${esc(e.years || "")}</span>
          ${e.desc ? `<p>${esc(e.desc)}</p>` : ""}
        </div>
      </article>`).join("")
  : `<p class="empty-note">No work experience added yet.</p>`;

// ---------- Education ----------
const edu = raw.education || [];
$("aiEduCount").textContent = edu.length;
$("aiEducation").innerHTML = edu.length
  ? edu.map((e, i) => `
      <article class="tl-item" style="animation-delay:${i * 90}ms">
        <span class="tl-dot edu"></span>
        <div class="tl-body">
          <h4>${esc(e.degree || "Degree")}</h4>
          <span class="tl-meta">${esc(e.school || "")} ${e.school && e.years ? "•" : ""} ${esc(e.years || "")}</span>
        </div>
      </article>`).join("")
  : `<p class="empty-note">No education records added yet.</p>`;

// ---------- Projects ----------
const projects = raw.projects || [];
$("aiProjCount").textContent = projects.length;
$("aiProjects").innerHTML = projects.length
  ? projects.map((pr, i) => `
      <article class="proj-card" style="animation-delay:${i * 90}ms">
        <div class="proj-top">
          <h4>${esc(pr.name || "Untitled Project")}</h4>
          <div class="proj-links">
            ${pr.github ? `<a href="${esc(pr.github)}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Code</a>` : ""}
            ${pr.demo ? `<a href="${esc(pr.demo)}" target="_blank" rel="noopener" class="demo"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>` : ""}
          </div>
        </div>
        ${pr.desc ? `<p>${esc(pr.desc)}</p>` : ""}
      </article>`).join("")
  : `<p class="empty-note">No projects added yet.</p>`;

// ---------- Footer timestamp ----------
$("aiSavedAt").textContent = "Data loaded from your saved portfolio • " +
  new Date().toLocaleString();

// ---------- Print ----------
$("printBtn").addEventListener("click", () => window.print());
