/* ── Nav + Scroll Progress ── */
const nav = document.getElementById('nav');
const sp  = document.getElementById('sp');
let rafId = null;

function onScrollFrame() {
  const y = window.scrollY;
  const max = document.body.scrollHeight - window.innerHeight;
  nav.classList.toggle('scrolled', y > 56);
  sp.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  rafId = null;
}
window.addEventListener('scroll', () => {
  if (!rafId) rafId = requestAnimationFrame(onScrollFrame);
}, { passive: true });

/* ── Magnetic buttons ── */
document.querySelectorAll('.btn, .nav-cta, .nav-ig').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width  / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ── Animações de entrada com IntersectionObserver ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

/* ── Stagger da galeria ── */
const ioGrid = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('stagger-visible');
      ioGrid.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.galeria-grid').forEach(g => ioGrid.observe(g));

/* ── Service stack stagger ── */
const ioStack = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const stack = e.target.querySelector('.stack-anim');
      if (stack) stack.classList.add('stack-active');
      const head = e.target.querySelector('.servico-head');
      if (head) head.classList.add('lbl-in');
      ioStack.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });
document.querySelectorAll('.servico').forEach(s => ioStack.observe(s));

/* ── Label / linha separadora ── */
const ioLabel = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('lbl-in');
      ioLabel.unobserve(e.target);
    }
  });
}, { threshold: 0.25, rootMargin: '0px 0px -20px 0px' });
document.querySelectorAll('.gl-label').forEach(el => ioLabel.observe(el));

/* ── Lazy load de background-image ── */
const ioBg = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.backgroundImage = `url('${e.target.dataset.bg}')`;
      ioBg.unobserve(e.target);
    }
  });
}, { rootMargin: '300px 0px' });
document.querySelectorAll('[data-bg]').forEach(el => ioBg.observe(el));

/* ── Zoom do fundo na seção Contato ── */
const ioContato = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('contato-in');
      ioContato.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
const contatoSection = document.getElementById('contato');
if (contatoSection) ioContato.observe(contatoSection);

/* ── Luz passante nos serviços ── */
const ioSwept = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('swept');
      ioSwept.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.servico').forEach(s => ioSwept.observe(s));

/* ── Lightbox ── */
(function () {
  const lb      = document.getElementById('lb');
  const lbImg   = document.getElementById('lb-img');
  const lbLabel = document.getElementById('lb-label');
  const lbDots  = document.getElementById('lb-dots');
  const lbPrev  = document.getElementById('lb-prev');
  const lbNext  = document.getElementById('lb-next');
  const lbClose = document.getElementById('lb-close');
  const wrap    = document.getElementById('lb-img-wrap');

  let pool = [], idx = 0;

  function bgUrl(el) {
    const m = el.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
    return m ? m[1] : '';
  }

  function cellLabel(el) {
    const lbl = el.querySelector('.cell-label');
    return lbl ? lbl.textContent.trim() : '';
  }

  function buildDots() {
    lbDots.innerHTML = '';
    if (pool.length <= 1) return;
    const max = Math.min(pool.length, 12);
    for (let i = 0; i < max; i++) {
      const d = document.createElement('span');
      d.className = 'lb-dot' + (i === idx ? ' active' : '');
      d.addEventListener('click', e => { e.stopPropagation(); go(i); });
      lbDots.appendChild(d);
    }
  }

  function updateDots() {
    const dots = lbDots.querySelectorAll('.lb-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function show() {
    lbImg.classList.remove('loaded');
    const url = bgUrl(pool[idx]);
    lbLabel.textContent = cellLabel(pool[idx]);
    lbPrev.classList.toggle('hidden', pool.length <= 1);
    lbNext.classList.toggle('hidden', pool.length <= 1);
    updateDots();
    const tmp = new Image();
    tmp.onload = () => { lbImg.src = url; lbImg.classList.add('loaded'); };
    tmp.onerror = () => { lbImg.src = url; lbImg.classList.add('loaded'); };
    tmp.src = url;
  }

  function go(i) { idx = (i + pool.length) % pool.length; show(); }

  function open(cells, i) {
    pool = cells; idx = i;
    buildDots();
    show();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbImg.focus && lbImg.focus();
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  lbPrev.addEventListener('click', e => { e.stopPropagation(); go(idx - 1); });
  lbNext.addEventListener('click', e => { e.stopPropagation(); go(idx + 1); });
  lbClose.addEventListener('click', e => { e.stopPropagation(); close(); });
  lb.addEventListener('click', close);
  wrap.addEventListener('click', e => e.stopPropagation());

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   go(idx - 1);
    if (e.key === 'ArrowRight')  go(idx + 1);
  });

  /* Swipe touch */
  let tx0 = 0;
  lb.addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx0;
    if (Math.abs(dx) > 40) go(dx < 0 ? idx + 1 : idx - 1);
  });

  /* Agrupar por section.block — cada bloco é uma galeria independente */
  document.querySelectorAll('section.block').forEach(section => {
    const cells = Array.from(section.querySelectorAll('.galeria-grid .cell'));
    if (!cells.length) return;
    cells.forEach((cell, i) => {
      cell.style.cursor = 'zoom-in';
      cell.addEventListener('click', () => open(cells, i));
    });
  });
})();

/* ── Marquee: pixel-exact loop via JS ── */
document.fonts.ready.then(() => {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  const set = track.querySelector('.marquee-set');
  if (!set) return;
  const w = set.offsetWidth;
  const s = document.createElement('style');
  s.textContent = `@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-${w}px)}}`;
  document.head.appendChild(s);
  track.style.animation = 'none';
  void track.offsetWidth;
  track.style.animation = '';
});
