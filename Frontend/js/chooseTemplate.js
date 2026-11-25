const TEMPLATES = [
  { id: 1, name: "Minimal Mono Canvas", image: "../assets/images/template-1.jpeg" },
  { id: 2, name: "Modern Tech Stack", image: "../assets/images/template-2.jpeg" },
  { id: 3, name: "Creative Studio Grid", image: "../assets/images/template-3.jpeg" },
  { id: 4, name: "Executive Lead Suite", image: "../assets/images/template-4.jpeg" }
];
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) location.replace("Sign.html");
const grid = document.getElementById("pickGrid");
grid.innerHTML = TEMPLATES.map(t => `
  <article class="tpl-card">
    <div class="tpl-img"><img src="${t.image}" alt="${t.name} preview" loading="lazy"></div>
    <div class="tpl-info"><h3>${t.name}</h3>
      <button class="btn btn-purple use-template" type="button" data-id="${t.id}">Use Template →</button>
    </div>
  </article>`).join("");
grid.addEventListener("click", e => {
  const btn = e.target.closest(".use-template");
  if (!btn) return;
  const key = "portfolio_" + currentUser;
  let data;
  try { data = JSON.parse(localStorage.getItem(key)) || {}; } catch { data = {}; }
  if (!data.personal || !data.personal.name) {
    alert("Please complete your personal information first.");
    location.href = "createportfolio.html";
    return;
  }
  data.templateId = Number(btn.dataset.id);
  data.published = true;
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem("portfolioData", JSON.stringify(toPortfolioShape(data)));
  location.href = `portfolio.html?t=${data.templateId}&preview=1`;
});
function toPortfolioShape(d) {
  const p=d.personal||{}, c=d.socials||{};
  return {templateId:d.templateId||1,published:true,available:true,name:p.name||"",jobTitle:p.title||"",location:p.location||"",about:p.bio||"",photo:p.photo||"",
    skills:d.skills||[],experience:(d.positions||[]).map(x=>({role:x.job,company:x.company,period:x.years,description:x.desc})),
    education:(d.education||[]).map(x=>({degree:x.degree,school:x.school,period:x.years})),
    projects:(d.projects||[]).map(x=>({title:x.name,description:x.desc,github:x.github,demo:x.demo})),
    contact:{email:p.email||"",phone:p.phone||"",linkedin:c.linkedin||"",github:c.github||"",website:c.website||""}};
}
