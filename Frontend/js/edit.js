
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
const avatar=$("avatar"),fullName=$("full-name");
function updateAvatar(){if(photoData){avatar.style.backgroundImage=`url("${photoData}")`;avatar.textContent="";}else{avatar.style.backgroundImage="";avatar.textContent=(fullName.value.trim().split(/\s+/).map(x=>x[0]).join("").slice(0,2)||"").toUpperCase();}}
fullName.addEventListener("input",updateAvatar);

// ================= Photo crop tool =================
const cropModal=$("crop-modal"),cropImg=$("crop-img"),cropZoom=$("crop-zoom");
let cropScale=1,cropX=0,cropY=0,dragging=false,startX=0,startY=0,startL=0,startT=0,rawImage="";

function applyCropTransform(){cropImg.style.transform=`translate(${cropX}px,${cropY}px) scale(${cropScale})`;}

function openCrop(dataUrl){rawImage=dataUrl;cropImg.src=dataUrl;cropScale=1;cropX=0;cropY=0;cropZoom.value=1;applyCropTransform();cropModal.classList.add("open");}

function closeCrop(){cropModal.classList.remove("open");}

function dataUrlFor(dataUrl,scale,ox,oy){
  return new Promise((resolve)=>{
    const img=new Image();img.onload=()=>{
      const size=Math.min(img.width,img.height)*1.1;
      const out=480;const cv=document.createElement("canvas");cv.width=out;cv.height=out;
      const ctx=cv.getContext("2d");
      const base=size*out/ Math.min(cv.width,out)* (out/size*0+1);
      // draw the source so that `size` px of source fills the `out` box, shifted by ox/oy (converted to source px)
      const k=size/out;
      ctx.drawImage(img, img.width/2 - size/2 - ox*k, img.height/2 - size/2 - oy*k, size, size, 0, 0, out, out);
      resolve(cv.toDataURL("image/jpeg",0.85));
    };img.src=dataUrl;
  });
}

// ================= Smart Crop Photo button =================
// If a photo is already saved, clicking "Crop Photo" opens the saved image in
// the crop popup. If not, it falls back to the upload input.
$("edit-crop-btn").addEventListener("click", () => {
  if (photoData) {
    openCrop(photoData);
  } else {
    $("photo-crop-input").click();
  }
});

$("photo-crop-input").addEventListener("change",function(){const f=this.files[0];if(!f)return;if(f.size>2*1024*1024){alert("Max image size is 2MB.");return;}const r=new FileReader();r.onload=()=>openCrop(r.result);r.readAsDataURL(f);this.value="";});
cropZoom.addEventListener("input",()=>{cropScale=parseFloat(cropZoom.value);applyCropTransform();});
cropImg.addEventListener("mousedown",(e)=>{dragging=true;startX=e.clientX;startY=e.clientY;startL=cropX;startT=cropY;cropImg.style.cursor="grabbing";e.preventDefault();});
window.addEventListener("mousemove",(e)=>{if(!dragging)return;cropX=startL+(e.clientX-startX);cropY=startT+(e.clientY-startY);applyCropTransform();});
window.addEventListener("mouseup",()=>{dragging=false;cropImg.style.cursor="grab";});
cropImg.addEventListener("touchstart",(e)=>{dragging=true;startX=e.touches[0].clientX;startY=e.touches[0].clientY;startL=cropX;startT=cropY;},{passive:true});
window.addEventListener("touchmove",(e)=>{if(!dragging)return;cropX=startL+(e.touches[0].clientX-startX);cropY=startT+(e.touches[0].clientY-startY);applyCropTransform();},{passive:true});
window.addEventListener("touchend",()=>{dragging=false;});
$("crop-cancel").addEventListener("click",closeCrop);
cropModal.addEventListener("click",(e)=>{if(e.target===cropModal)closeCrop();});
$("crop-apply").addEventListener("click",async()=>{photoData=await dataUrlFor(rawImage,cropScale,cropX,cropY);updateAvatar();closeCrop();$("toast").textContent="Photo cropped successfully!";$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1600);});

// ================= Remove photo =================
$("remove-photo").addEventListener("click",()=>{if(!photoData){$("toast").textContent="No photo to remove.";$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1600);return;}photoData="";updateAvatar();$("toast").textContent="Photo removed.";$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1600);});

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
