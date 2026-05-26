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
}, { threshold: 0.18, rootMargin: '0px 0px -15% 0px' });

document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

/* ── Stagger da galeria ── */
const ioGrid = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('stagger-visible');
      ioGrid.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
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
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.servico').forEach(s => ioStack.observe(s));

/* ── Label / linha separadora ── */
const ioLabel = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('lbl-in');
      ioLabel.unobserve(e.target);
    }
  });
}, { threshold: 0.4, rootMargin: '0px 0px -8% 0px' });
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
}, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
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
}, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' });
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

/* ── Menu mobile hamburguer ── */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobMenu   = document.getElementById('mob-menu');
  if (!hamburger || !mobMenu) return;

  function toggleMenu(open) {
    mobMenu.classList.toggle('open', open);
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    nav.classList.toggle('mob-open', open);
  }

  hamburger.addEventListener('click', () => toggleMenu(!mobMenu.classList.contains('open')));

  mobMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobMenu.classList.contains('open')) toggleMenu(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760 && mobMenu.classList.contains('open')) toggleMenu(false);
  });
})();

/* ── Parallax no photo-divider ── */
(function () {
  const divider   = document.querySelector('.photo-divider');
  const dividerBg = divider?.querySelector('.photo-divider-bg');
  if (!divider || !dividerBg) return;

  let rafParallax = null;

  function updateParallax() {
    rafParallax = null;
    const rect  = divider.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (rect.bottom < 0 || rect.top > viewH) return;
    const progress = (viewH - rect.top) / (viewH + rect.height);
    const offset   = (0.5 - progress) * 300;
    dividerBg.style.transform = `translateY(${offset}px) scale(1.5)`;
  }

  window.addEventListener('scroll', () => {
    if (!rafParallax) rafParallax = requestAnimationFrame(updateParallax);
  }, { passive: true });

  updateParallax();
})();

/* ── Proteção de imagens ── */
// Overlay transparente sobre cada célula da galeria — bloqueia clique direito e drag
document.querySelectorAll('.galeria-grid .cell').forEach(cell => {
  const ov = document.createElement('div');
  ov.className = 'cell-protect';
  ov.addEventListener('contextmenu', e => e.preventDefault());
  ov.addEventListener('dragstart',   e => e.preventDefault());
  cell.appendChild(ov);
});

// Bloqueia clique direito e drag na imagem aberta no lightbox
const lbImgEl = document.getElementById('lb-img');
if (lbImgEl) {
  lbImgEl.addEventListener('contextmenu', e => e.preventDefault());
  lbImgEl.addEventListener('dragstart',   e => e.preventDefault());
  lbImgEl.setAttribute('draggable', 'false');
}

// Bloqueia atalhos Ctrl+S (salvar página) e Ctrl+U (ver fonte)
document.addEventListener('keydown', e => {
  const ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')) {
    e.preventDefault();
  }
}, { capture: true });

/* ── Marquee: pixel-exact via JS após window.load ──
   Mede a largura real do set (imagens já carregadas), injeta @keyframes correto
   e SÓ ENTÃO inicia a animação — sem restart, sem salto visual. ── */
window.addEventListener('load', function() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  const set = track.querySelector('.marquee-set');
  if (!set) return;
  const w = set.offsetWidth;
  if (!w) return;
  const s = document.createElement('style');
  s.textContent = `@keyframes marquee{0%{transform:translate3d(0,0,0)}100%{transform:translate3d(-${w}px,0,0)}}`;
  document.head.appendChild(s);
  requestAnimationFrame(() => {
    track.style.animation = 'marquee 38s linear infinite';
  });
});
