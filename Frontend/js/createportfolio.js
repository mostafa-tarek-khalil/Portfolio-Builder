const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  window.location.href = "./Sign.html";
}
const storageKey = "portfolio_" + currentUser;
if (localStorage.getItem(storageKey)) {
  window.location.href = "./personalInfo.html"; // already has a portfolio, so edit it
}

// Progress Bar
let currentStep = 1;
const totalSteps = 5;

const panels = document.querySelectorAll(".panel");
const stepBtns = document.querySelectorAll(".step");
const fill = document.getElementById("progress-fill");

function showStep(n) {
  currentStep = n;

  panels.forEach(function (p) {
    p.classList.toggle("active", Number(p.dataset.step) === n);
  });

  stepBtns.forEach(function (b) {
    b.classList.toggle("active", Number(b.dataset.step) === n);
  });

  fill.style.width = (n / totalSteps) * 100 + "%";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function validateStep(stepNumber) {
  const currentPanel = document.querySelector(
    `.panel[data-step="${stepNumber}"]`
  );

  const requiredInputs = currentPanel.querySelectorAll("[required]");

  for (let input of requiredInputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return false;
    }
  }

  return true;
}

stepBtns.forEach(function (b) {
  b.addEventListener("click", function () {
    const targetStep = Number(b.dataset.step);

    if (targetStep > currentStep) {
      if (!validateStep(currentStep)) return;
    }

    showStep(targetStep);
  });
});

document.querySelectorAll("[data-go]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (btn.dataset.go === "next" && currentStep < totalSteps) {
      if (!validateStep(currentStep)) return;

      showStep(currentStep + 1);
    }

    if (btn.dataset.go === "prev" && currentStep > 1) {
      showStep(currentStep - 1);
    }
  });
});

const photoInput = document.getElementById("photo-input");
const avatar = document.getElementById("avatar");
const fullName = document.getElementById("full-name");
let photoData = "";

function updateAvatar() {
  if (photoData) {
    avatar.style.backgroundImage = "url(" + photoData + ")";
    avatar.textContent = "";
    return;
  }
  avatar.style.backgroundImage = "";

  const words = fullName.value
    .trim()
    .split(" ")
    .filter(function (w) {
      return w !== "";
    });
  let initials = "";
  if (words.length >= 1) initials += words[0][0];
  if (words.length >= 2) initials += words[1][0];
  avatar.textContent = initials.toUpperCase() || " ";
}

fullName.addEventListener("input", updateAvatar);

photoInput.addEventListener("change", function () {
  const file = photoInput.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    alert("Max image size is 2MB.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    photoData = reader.result;
    updateAvatar();
  };
  reader.readAsDataURL(file);
});

// Prefill name and email from the account made in Sign Up
const users = JSON.parse(localStorage.getItem("users")) || [];
const me = users.find(function (u) {
  return u.email === currentUser;
});
if (me) {
  fullName.value = me.name || "";
  document.getElementById("email").value = me.email;
}
updateAvatar();

// Skills
let skills = [];
const chips = document.getElementById("chips");
const skillInput = document.getElementById("skill-input");

function renderSkills() {
  chips.innerHTML = "";
  skills.forEach(function (skill, index) {
    const chip = document.createElement("div");
    chip.className = "chip";

    const label = document.createElement("span");
    label.textContent = skill;
    chip.appendChild(label);
    chip.insertAdjacentHTML(
      "beforeend",
      '<button type="button" data-index="' + index + '">×</button>',
    );

    chips.appendChild(chip);
  });
}

function addSkill() {
  const value = skillInput.value.trim();
  if (value === "") return;
  skills.push(value);
  skillInput.value = "";
  renderSkills();
}

document.getElementById("add-skill").addEventListener("click", addSkill);
skillInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addSkill();
  }
});

chips.addEventListener("click", function (e) {
  if (e.target.dataset.index !== undefined) {
    skills.splice(Number(e.target.dataset.index), 1);
    renderSkills();
  }
});

renderSkills();

// Positions / Education / Projects
const positions = document.getElementById("positions");
const education = document.getElementById("education");
const projects = document.getElementById("projects");

// Position #1, Position #2 ..
function renumber() {
  document.querySelectorAll("[data-label]").forEach(function (container) {
    const label = container.dataset.label;
    container.querySelectorAll(".item-title").forEach(function (title, i) {
      title.textContent = label + " #" + (i + 1);
    });
  });
}

function addPosition() {
  const box = document.createElement("div");
  box.className = "item";
  box.innerHTML =
    '<div class="item-top"><span class="item-title"></span><button type="button" class="remove"><i class="fa-solid fa-trash"></i> Remove</button></div>' +
    '<div class="row3"><input type="text" placeholder="Job Title"><input type="text" placeholder="Company"><input type="text" placeholder="2022 - Present"></div>' +
    '<textarea rows="2" placeholder="Describe your role and achievements..."></textarea>';
  positions.appendChild(box);
  renumber();
}

function addEducation() {
  const row = document.createElement("div");
  row.className = "edu-row";
  row.innerHTML =
    '<input type="text" placeholder="Degree"><input type="text" placeholder="University"><input type="text" placeholder="2016 - 2020">' +
    '<button type="button" class="remove"><i class="fa-solid fa-trash"></i></button>';
  education.appendChild(row);
}

function addProject() {
  const box = document.createElement("div");
  box.className = "item";
  box.innerHTML =
    '<div class="item-top"><span class="item-title"></span><button type="button" class="remove"><i class="fa-solid fa-trash"></i> Remove</button></div>' +
    '<input type="text" placeholder="Project Name">' +
    '<textarea rows="2" placeholder="Describe your project..."></textarea>' +
    '<div class="row2"><input type="text" placeholder="GitHub link"><input type="text" placeholder="Live demo link"></div>';
  projects.appendChild(box);
  renumber();
}

// Add Buttons
document.getElementById("add-position").addEventListener("click", addPosition);
document.getElementById("add-edu").addEventListener("click", addEducation);
document.getElementById("add-project").addEventListener("click", addProject);

// Remove Buttons
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".remove");
  if (!btn) return;
  btn.closest(".item, .edu-row").remove();
  renumber();
});


function val(id) { return document.getElementById(id).value.trim(); }
function toPortfolioShape(d) {
  const p = d.personal || {}, c = d.socials || {};
  return {
    templateId: d.templateId || 1, published: true, available: true, name: p.name || "", jobTitle: p.title || "", location: p.location || "", about: p.bio || "", photo: p.photo || "",
    skills: d.skills || [], experience: (d.positions || []).map(x => ({ role: x.job, company: x.company, period: x.years, description: x.desc })),
    education: (d.education || []).map(x => ({ degree: x.degree, school: x.school, period: x.years })),
    projects: (d.projects || []).map(x => ({ title: x.name, description: x.desc, github: x.github, demo: x.demo })),
    contact: { email: p.email || "", phone: p.phone || "", linkedin: c.linkedin || "", github: c.github || "", website: c.website || "" }
  };
}
function savePortfolio() {
  const required = ["full-name", "title", "email", "phone", "bio"];
  for (const id of required) if (!val(id)) { showStep(1); document.getElementById(id).focus(); alert("Please fill in all required fields."); return false; }
  const data = {
    personal: { name: val("full-name"), title: val("title"), email: val("email"), phone: val("phone"), location: val("location"), bio: val("bio"), photo: photoData },
    skills, positions: [], education: [], projects: [], socials: { linkedin: val("linkedin"), github: val("github"), website: val("website") }, templateId: 1, published: true
  };
  document.querySelectorAll("#positions .item").forEach(box => { const a = box.querySelectorAll("input"); if (a[0].value.trim() || a[1].value.trim()) data.positions.push({ job: a[0].value.trim(), company: a[1].value.trim(), years: a[2].value.trim(), desc: box.querySelector("textarea").value.trim() }); });
  document.querySelectorAll("#education .edu-row").forEach(row => { const a = row.querySelectorAll("input"); if (a[0].value.trim() || a[1].value.trim()) data.education.push({ degree: a[0].value.trim(), school: a[1].value.trim(), years: a[2].value.trim() }); });
  document.querySelectorAll("#projects .item").forEach(box => { const a = box.querySelectorAll("input"); if (a[0].value.trim()) data.projects.push({ name: a[0].value.trim(), github: a[1].value.trim(), demo: a[2].value.trim(), desc: box.querySelector("textarea").value.trim() }); });
  try { localStorage.setItem(storageKey, JSON.stringify(data)); localStorage.setItem("portfolioData", JSON.stringify(toPortfolioShape(data))); }
  catch (err) { alert("Could not save. Try a smaller photo."); return false; }
  return true;
}
function finish(e) { e.preventDefault(); if (savePortfolio()) location.href = "personalInfo.html"; }
document.getElementById("btn-publish")?.addEventListener("click", finish);
document.getElementById("finish")?.addEventListener("click", finish);
