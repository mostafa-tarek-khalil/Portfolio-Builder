// ================= Keys & data =================
const DATA_KEY = "portfolioData";
const SAVED_KEY = "savedPortfolios";

const TEMPLATE_NAMES = {
  1: "Minimal Mono Canvas",
  2: "Modern Tech Stack",
  3: "Creative Studio Grid",
  4: "Executive Lead Suite"
};

// ================= Helpers =================
const $ = (id) => document.getElementById(id);

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

const safeUrl = (u) =>
  (/^(https?:\/\/|data:image\/)/i.test(u || "") ? esc(u) : "");

const initials = (n) =>
  (n || "?").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const skillName = (s) => (typeof s === "string" ? s : s?.name || "");

const has = (a) => Array.isArray(a) && a.length > 0;

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
}

// ================= Load account data =================
const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  location.replace("Sign.html");
}

const accountData = read("portfolio_" + currentUser, { personal: {} });

if (!accountData || !accountData.personal) {
  location.replace("createportfolio.html");
}

function normalizeAccount(data) {
  const personal = data.personal || {};
  const socials = data.socials || {};

  return {
    name: personal.name || "",
    jobTitle: personal.title || "",
    location: personal.location || "",
    about: personal.bio || "",
    photo: personal.photo || "",
    skills: Array.isArray(data.skills) ? data.skills : [],

    experience: (data.positions || []).map((item) => ({
      role: item.job,
      company: item.company,
      period: item.years,
      description: item.desc
    })),

    education: (data.education || []).map((item) => ({
      degree: item.degree,
      school: item.school,
      period: item.years
    })),

    projects: (data.projects || []).map((item) => ({
      title: item.name,
      description: item.desc,
      github: item.github,
      demo: item.demo
    })),

    contact: {
      email: personal.email || "",
      phone: personal.phone || "",
      linkedin: socials.linkedin || "",
      github: socials.github || "",
      website: socials.website || ""
    }
  };
}

let info = normalizeAccount(accountData);

function saveCurrentPortfolioData() {
  localStorage.setItem(
    DATA_KEY,
    JSON.stringify({
      ...info,
      templateId: accountData.templateId || 1,
      published: true
    })
  );
}

saveCurrentPortfolioData();

let saved = read(SAVED_KEY + "_" + currentUser, []);

// ================= Profile overview =================
function renderProfile() {
  const photoUrl = safeUrl(info.photo);
  const contact = info.contact || {};

  $("photoPreview").innerHTML = photoUrl
    ? `<img src="${photoUrl}" alt="${esc(info.name || "Profile photo")}">`
    : esc(initials(info.name));

  $("profileName").textContent = info.name || "Your Name";
  $("profileJobTitle").textContent = info.jobTitle || "Add your professional title";
  $("profileLocation").textContent = info.location || "Location not added";
  $("profileEmail").textContent = contact.email || "Email not added";

  $("profileStatus").textContent = "Published";
  $("memberSince").textContent = "New Member";
}

// ================= Statistics =================
function renderStatistics() {
  $("statSkills").textContent = info.skills.length;
  $("statProjects").textContent = info.projects.length;
  $("statExperience").textContent = info.experience.length;
  $("statEducation").textContent = info.education.length;
}

// ================= Profile completion =================
function renderCompletion() {
  const contact = info.contact || {};

  const checks = [
    { label: "Personal details", complete: Boolean(info.name && info.jobTitle && info.location) },
    { label: "About section", complete: Boolean(info.about && info.about.trim()) },
    { label: "Contact information", complete: Boolean(contact.email && contact.phone) },
    { label: "Skills", complete: has(info.skills) },
    { label: "Projects", complete: has(info.projects) },
    { label: "Work experience", complete: has(info.experience) },
    { label: "Education", complete: has(info.education) }
  ];

  const completedCount = checks.filter((item) => item.complete).length;
  const percentage = Math.round((completedCount / checks.length) * 100);

  $("completionPercent").textContent = `${percentage}%`;
  $("completionBar").style.width = `${percentage}%`;
  $("completionBar").setAttribute("aria-valuenow", percentage);
  $("completionText").textContent =
    percentage === 100
      ? "Your portfolio profile is complete. Great work!"
      : `${completedCount} of ${checks.length} sections completed. Add the missing details to strengthen your profile.`;

  $("completionList").innerHTML = checks.map((item) => `
    <div class="completion-item ${item.complete ? "is-complete" : ""}">
      <span class="completion-check"><i class="fa-solid ${item.complete ? "fa-check" : "fa-plus"}"></i></span>
      <span>${esc(item.label)}</span>
      <span class="completion-state">${item.complete ? "Completed" : "Missing"}</span>
    </div>
  `).join("");
}

// ================= Portfolio information =================
const kv = (label, value, full = false) =>
  `<div class="kv ${full ? "full" : ""}">
    <span>${esc(label)}</span>
    <p>${value ? esc(value) : `<i class="dash-empty">Not added yet</i>`}</p>
  </div>`;

const kvLink = (label, value, href, external = false) => {
  const url = href || safeUrl(value);

  return `<div class="kv">
    <span>${esc(label)}</span>
    ${value
      ? (url
        ? `<a href="${url}" ${external ? 'target="_blank" rel="noopener noreferrer"' : ""}>${esc(value)}</a>`
        : `<p>${esc(value)}</p>`)
      : `<p><i class="dash-empty">Not added yet</i></p>`}
  </div>`;
};

function renderInfo() {
  const contact = info.contact || {};
  const visibleSkills = has(info.skills)
    ? info.skills.slice(0, 8).map((skill) =>
      `<span class="chip-item">${esc(skillName(skill))}</span>`
    ).join("")
    : `<p class="empty-note">No skills added yet. Add your skills to make your portfolio more informative.</p>`;

  const remainingSkills = info.skills.length > 8
    ? `<span class="more-skills">+${info.skills.length - 8} more</span>`
    : "";

  $("infoForm").innerHTML = `
    <div class="block">
      <div class="block-heading">
        <div>
          <span class="block-kicker">01 / INTRODUCTION</span>
          <h3>About</h3>
        </div>
      </div>
      <div class="grid2">
        ${kv("Job Title", info.jobTitle)}
        ${kv("Location", info.location)}
        ${kv("About Me", info.about, true)}
      </div>
    </div>

    <div class="block">
      <div class="block-heading">
        <div>
          <span class="block-kicker">02 / GET IN TOUCH</span>
          <h3>Contact Information</h3>
        </div>
      </div>
      <div class="grid2">
        ${kvLink("Email", contact.email, contact.email ? `mailto:${esc(contact.email)}` : "")}
        ${kvLink("Phone", contact.phone, contact.phone ? `tel:${esc(contact.phone)}` : "")}
        ${kvLink("LinkedIn", contact.linkedin, "", true)}
        ${kvLink("GitHub", contact.github, "", true)}
        ${kvLink("Website", contact.website, "", true)}
      </div>
    </div>

    <div class="block">
      <div class="block-heading">
        <div>
          <span class="block-kicker">03 / WHAT I WORK WITH</span>
          <h3>Skills &amp; Technologies</h3>
        </div>
        <span class="section-total">${info.skills.length} skills</span>
      </div>
      <div class="chips">${visibleSkills}${remainingSkills}</div>
    </div>
  `;
}

// ================= Saved portfolios =================
function renderSaved() {
  $("savedCount").textContent = saved.length;

  $("savedGrid").innerHTML = saved.length
    ? saved.map((portfolio) => {
      const date = new Date(portfolio.savedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });

      return `
          <article class="sp-card"
            tabindex="0"
            role="button"
            data-open="${esc(portfolio.id)}"
            aria-label="Open ${esc(portfolio.data?.name || "saved portfolio")} in full screen">

            <button class="sp-del"
              type="button"
              data-del="${esc(portfolio.id)}"
              aria-label="Delete saved portfolio"><i class="fa-solid fa-trash-can"></i></button>

            <div class="thumb">
              <iframe
                src="portfolio.html?saved=${encodeURIComponent(portfolio.id)}"
                loading="lazy"
                tabindex="-1"
                title="Preview of ${esc(portfolio.data?.name || "saved portfolio")}">
              </iframe>
            </div>

            <div class="sp-meta">
              <b>${esc(portfolio.data?.name || "Untitled Portfolio")}</b>
              <span>${esc(portfolio.data?.jobTitle || "No job title")}</span>

              <div class="sp-foot">
                <em class="tpl-badge">
                  ${esc(TEMPLATE_NAMES[portfolio.templateId] || "Template")}
                </em>
                <small>${date}</small>
              </div>
            </div>
          </article>
        `;
    }).join("")
    : `<div class="empty-saved">
        <div class="empty-saved-icon"><i class="fa-solid fa-folder-plus"></i></div>
        <h3>No saved portfolios yet</h3>
        <p>Create another design, choose a template, and save it to see it here.</p>
        <a class="empty-saved-link" href="chooseTemplate.html">Create a portfolio</a>
      </div>`;
}

// ================= Delete confirmation =================
function confirmDelete(portfolio) {
  return new Promise((resolve) => {
    const box = $("swal");

    $("swalIcon").className = "swal-icon warn";
    $("swalIcon").innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;
    $("swalTitle").textContent = "Delete this portfolio?";

    $("swalText").innerHTML = `
      <b>${esc(portfolio.data?.name || "Untitled Portfolio")}</b> ·
      ${esc(TEMPLATE_NAMES[portfolio.templateId] || "Template")}
      <br>You won’t be able to undo this.
    `;

    $("swalActions").hidden = false;
    box.hidden = false;
    $("swalCancel").focus();

    const finish = (yes) => {
      document.removeEventListener("keydown", onKey);
      box.removeEventListener("click", onBackdrop);
      $("swalOk").onclick = null;
      $("swalCancel").onclick = null;

      if (!yes) box.hidden = true;
      resolve(yes);
    };

    const onKey = (event) => {
      if (event.key === "Escape") finish(false);
    };

    const onBackdrop = (event) => {
      if (event.target === box) finish(false);
    };

    document.addEventListener("keydown", onKey);
    box.addEventListener("click", onBackdrop);
    $("swalOk").onclick = () => finish(true);
    $("swalCancel").onclick = () => finish(false);
  });
}

function showDeleted() {
  $("swalIcon").className = "swal-icon ok";
  $("swalIcon").innerHTML = `<i class="fa-solid fa-check"></i>`;
  $("swalTitle").textContent = "Deleted!";
  $("swalText").textContent = "Your saved portfolio has been removed.";
  $("swalActions").hidden = true;

  setTimeout(() => {
    $("swal").hidden = true;
  }, 1300);
}

// ================= Saved portfolio events =================
$("savedGrid").addEventListener("click", async (event) => {
  const deleteButton = event.target.closest("[data-del]");

  if (deleteButton) {
    event.stopPropagation();

    const portfolio = saved.find((item) => item.id === deleteButton.dataset.del);

    if (!portfolio || !(await confirmDelete(portfolio))) return;

    saved = saved.filter((item) => item.id !== portfolio.id);

    localStorage.setItem(
      SAVED_KEY + "_" + currentUser,
      JSON.stringify(saved)
    );

    renderSaved();
    showDeleted();
    return;
  }

  const card = event.target.closest("[data-open]");
  if (card) openFull(card.dataset.open);
});

$("savedGrid").addEventListener("keydown", (event) => {
  const card = event.target.closest("[data-open]");

  if (card && event.target === card &&
    (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openFull(card.dataset.open);
  }
});

// ================= Full screen viewer =================
function openFull(id) {
  const portfolio = saved.find((item) => item.id === id);
  if (!portfolio) return;

  $("fsTitle").textContent = portfolio.data?.name || "Saved Portfolio";
  $("fsSub").textContent = TEMPLATE_NAMES[portfolio.templateId] || "";
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("fs").hidden) closeFull();
});

// ================= Keep page in sync =================
function refresh() {
  const latestAccount = read("portfolio_" + currentUser, accountData);
  const latestInfo = normalizeAccount(latestAccount);

  if (JSON.stringify(latestInfo) !== JSON.stringify(info)) {
    info = latestInfo;
    renderProfile();
    renderStatistics();
    renderCompletion();
    renderInfo();
    renderNav();
    saveCurrentPortfolioData();
  }

  const latestSaved = read(SAVED_KEY + "_" + currentUser, []);

  if (JSON.stringify(latestSaved) !== JSON.stringify(saved)) {
    saved = latestSaved;
    renderSaved();
  }
}

window.addEventListener("storage", refresh);
window.addEventListener("focus", refresh);

// ================= Navbar user =================
const users = read("users", []);
const account = users.find((u) => u.email === currentUser) || {};

function renderNav() {
  $("navUserName").textContent = info.name || account.name || "Guest User";
  $("navUserEmail").textContent = currentUser;

  const avatar = $("navAvatar");
  if (info.photo) {
    avatar.innerHTML = `<img src="${safeUrl(info.photo)}" alt="avatar">`;
  } else {
    avatar.textContent = initials(info.name || account.name);
  }
}

$("navLogout").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("rememberedUser");
  sessionStorage.removeItem("sessionActive");
  location.href = "Sign.html";
});

// ================= Initial rendering =================
renderProfile();
renderStatistics();
renderCompletion();
renderInfo();
renderSaved();
renderNav();
