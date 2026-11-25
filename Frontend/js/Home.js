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
