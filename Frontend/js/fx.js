/* ================= FolioCraft FX — shared effects =================
   Loaded on every page: particle field, scroll reveal, 3D tilt,
   scroll progress bar and floating 3D orbs. */
(function () {
  "use strict";

  /* ---------- Scroll progress bar ---------- */
  const bar = document.createElement("div");
  bar.className = "fx-progress";
  document.body.appendChild(bar);

  function updateBar() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", updateBar, { passive: true });
  updateBar();

  /* ---------- Particle / star field ---------- */
  const canvas = document.createElement("canvas");
  canvas.className = "fx-particles";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COUNT = Math.min(70, Math.floor(window.innerWidth / 22));

  function spawn() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.5 + 0.15,
      hue: Math.random() > 0.5 ? 190 : 265
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(spawn());

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.a})`;
      ctx.shadowColor = `hsla(${p.hue}, 90%, 60%, .8)`;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // connect close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = dx * dx + dy * dy;
        if (d < 120 * 120) {
          ctx.strokeStyle = `rgba(140,150,255,${(1 - d / 14400) * 0.12})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();

  /* ---------- Scroll reveal ---------- */
  const revealSel = [
    ".panel", ".stat-card", ".card", ".faq-item", ".sp-card",
    ".review", ".block", ".section .grid > *", ".mockup", ".cta"
  ].join(",");

  const revealStyle = document.createElement("style");
  revealStyle.textContent = `
    .fx-reveal { opacity: 0; transform: translateY(28px) scale(.98); transition: opacity .7s cubic-bezier(.2,.8,.2,1), transform .7s cubic-bezier(.2,.8,.2,1); }
    .fx-reveal.in { opacity: 1; transform: translateY(0) scale(1); }
  `;
  document.head.appendChild(revealStyle);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: "0px 0px -5% 0px" });

  // Immediately reveal everything already in the first viewport
  document.querySelectorAll(revealSel).forEach((el, i) => {
    el.classList.add("fx-reveal");
    el.style.transitionDelay = (i % 4) * 70 + "ms";
    io.observe(el);
  });

  // Safety net: after 1.5s reveal anything still hidden that is in view
  setTimeout(() => {
    document.querySelectorAll(".fx-reveal:not(.in)").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
    });
  }, 1500);

  /* ---------- Decorative 3D parallax on orbs (background only) ---------- */
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    orbs.style.transform = `translate3d(${x * 30}px, ${y * 30}px, 0)`;
  }, { passive: true });

  /* ---------- Floating 3D orbs (decorative) ---------- */
  const orbs = document.createElement("div");
  orbs.className = "fx-orbs";
  orbs.innerHTML =
    `<div class="fx-orb o1"></div><div class="fx-orb o2"></div><div class="fx-orb o3"></div>`;
  document.body.appendChild(orbs);
})();
