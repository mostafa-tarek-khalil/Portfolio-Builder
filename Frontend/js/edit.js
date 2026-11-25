
const currentUser=localStorage.getItem("currentUser");
if(!currentUser){location.replace("Sign.html");}
const storageKey="portfolio_"+currentUser;
let raw={}; try{raw=JSON.parse(localStorage.getItem(storageKey))||{};}catch{}
if(!raw.personal){location.replace("createportfolio.html");}
const p=raw.personal||{}, socials=raw.socials||{};
const $=id=>document.getElementById(id);
function set(id,v){if($(id))$(id).value=v||"";}
set("full-name",p.name);set("title",p.title);set("email",p.email);set("phone",p.phone);set("location",p.location);set("bio",p.bio);
set("linkedin",socials.linkedin);set("github",socials.github);set("website",socials.website);
let photoData=p.photo||"",skills=raw.skills||[];
const avatar=$("avatar"),fullName=$("full-name"),photoInput=$("photo-input");
function updateAvatar(){if(photoData){avatar.style.backgroundImage=`url("${photoData}")`;avatar.textContent="";}else{avatar.style.backgroundImage="";avatar.textContent=(fullName.value.trim().split(/\s+/).map(x=>x[0]).join("").slice(0,2)||"").toUpperCase();}}
fullName.addEventListener("input",updateAvatar);
photoInput.addEventListener("change",()=>{const f=photoInput.files[0];if(!f)return;if(f.size>2*1024*1024){alert("Max image size is 2MB.");return;}const r=new FileReader();r.onload=()=>{photoData=r.result;updateAvatar();};r.readAsDataURL(f);});
updateAvatar();
const chips=$("chips"),skillInput=$("skill-input");
function renderSkills(){chips.innerHTML="";skills.forEach((s,i)=>{const el=document.createElement("div");el.className="chip";const label=document.createElement("span");label.textContent=s;const b=document.createElement("button");b.type="button";b.textContent="×";b.dataset.index=i;el.append(label,b);chips.append(el);});}
function addSkill(){const v=skillInput.value.trim();if(v&&!skills.includes(v)){skills.push(v);skillInput.value="";renderSkills();}}
$("add-skill").addEventListener("click",addSkill);skillInput.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();addSkill();}});
chips.addEventListener("click",e=>{if(e.target.dataset.index!==undefined){skills.splice(Number(e.target.dataset.index),1);renderSkills();}});
renderSkills();
function fillRows(selector,items,fields){const rows=[...document.querySelectorAll(selector)];items.forEach((item,i)=>{let row=rows[i];if(!row){row=rows[0].cloneNode(true);rows[0].parentNode.append(row);}const inputs=row.querySelectorAll("input");fields.forEach((f,j)=>inputs[j].value=item[f]||"");const ta=row.querySelector("textarea");if(ta)ta.value=item.desc||"";});}
fillRows("#positions .item",(raw.positions||[]),["job","company","years"]);
fillRows("#education .edu-row",(raw.education||[]),["degree","school","years"]);
fillRows("#projects .item",(raw.projects||[]),["name","github","demo"]);
function setTexts(selector,items){const rows=[...document.querySelectorAll(selector)];rows.forEach((row,i)=>{const d=items[i]||{};const ta=row.querySelector("textarea");if(ta)ta.value=d.desc||"";});}
setTexts("#positions .item",raw.positions||[]);setTexts("#projects .item",raw.projects||[]);
document.addEventListener("click",e=>{const b=e.target.closest(".remove");if(b){const row=b.closest(".item,.edu-row");if(row.parentElement.querySelectorAll(".item,.edu-row").length>1)row.remove();}});
function collect(selector,kind){return [...document.querySelectorAll(selector)].map(row=>{const a=row.querySelectorAll("input"),ta=row.querySelector("textarea");if(kind==="position")return {job:a[0].value.trim(),company:a[1].value.trim(),years:a[2].value.trim(),desc:ta?.value.trim()||""};if(kind==="education")return {degree:a[0].value.trim(),school:a[1].value.trim(),years:a[2].value.trim()};return {name:a[0].value.trim(),github:a[1].value.trim(),demo:a[2].value.trim(),desc:ta?.value.trim()||""};}).filter(x=>Object.values(x).some(v=>v));}
function convert(d){const q=d.personal||{},c=d.socials||{};return {templateId:d.templateId||1,published:true,available:true,name:q.name||"",jobTitle:q.title||"",location:q.location||"",about:q.bio||"",photo:q.photo||"",skills:d.skills||[],experience:(d.positions||[]).map(x=>({role:x.job,company:x.company,period:x.years,description:x.desc})),education:(d.education||[]).map(x=>({degree:x.degree,school:x.school,period:x.years})),projects:(d.projects||[]).map(x=>({title:x.name,description:x.desc,github:x.github,demo:x.demo})),contact:{email:q.email||"",phone:q.phone||"",linkedin:c.linkedin||"",github:c.github||"",website:c.website||""}};}
$("edit-form").addEventListener("submit",e=>{e.preventDefault();const next={personal:{name:$("full-name").value.trim(),title:$("title").value.trim(),email:$("email").value.trim(),phone:$("phone").value.trim(),location:$("location").value.trim(),bio:$("bio").value.trim(),photo:photoData},skills,positions:collect("#positions .item","position"),education:collect("#education .edu-row","education"),projects:collect("#projects .item","project"),socials:{linkedin:$("linkedin").value.trim(),github:$("github").value.trim(),website:$("website").value.trim()},templateId:raw.templateId||1,published:true};try{localStorage.setItem(storageKey,JSON.stringify(next));localStorage.setItem("portfolioData",JSON.stringify(convert(next)));$("toast").textContent="Changes saved successfully!";$("toast").classList.add("show");setTimeout(()=>location.href="personalInfo.html",900);}catch(err){alert("Could not save your changes. Try a smaller photo.");}});
$("discard").addEventListener("click",()=>location.reload());
