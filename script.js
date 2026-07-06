/* ===== NAV SCROLL ===== */
const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
const navLinks = document.querySelectorAll('[data-nav]');
const sections = ['apropos','competences','projets','formation','langues','contact'].map(id => document.getElementById(id));

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 10);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';

  // active link
  let current = '';
  const offset = 120;
  sections.forEach(s => { if (s && s.offsetTop - offset <= y) current = s.id; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ===== MOBILE MENU ===== */
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  links.classList.toggle('open');
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  toggle.classList.remove('open'); links.classList.remove('open');
}));

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = document.querySelector(id);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ===== REVEAL ON SCROLL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ===== SKILL & LANGUAGE RATINGS (1-5 dots) ===== */
const ratingObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const container = entry.target;
      const rating = parseInt(container.dataset.rating || '0', 10);
      const dots = container.querySelectorAll('.dot');
      // Fill dots one by one with a slight stagger
      dots.forEach((dot, i) => {
        if (i < rating) {
          setTimeout(() => dot.classList.add('filled'), i * 90);
        }
      });
      ratingObserver.unobserve(container);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.skill-rating, .lang-rating').forEach(el => ratingObserver.observe(el));

/* ===== COUNTERS ===== */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count || '0', 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1500;
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ===== HERO PARTICLES ===== */
(function() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, particles = [];

  function resize() {
    const hero = document.querySelector('.hero');
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }
  function spawn() {
    particles = [];
    const count = Math.min(60, Math.floor(w / 22));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        a: Math.random() * 0.5 + 0.2,
        gold: Math.random() > 0.55
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.2, p.r), 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? 'rgba(252,211,77,' + p.a + ')'
        : 'rgba(255,255,255,' + (p.a * 0.6) + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize(); spawn();
  if (!reduce) draw();
  window.addEventListener('resize', () => { resize(); spawn(); });
})();