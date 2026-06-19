/* Revenue Leak Score — site interactions */

document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Hero panel animation ---- */
function initHero() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.sig, .ai-result').forEach(el => el.classList.add('anim-in'));
    const fill = document.querySelector('.audit-meter-fill');
    if (fill) fill.style.width = (fill.dataset.target || '58') + '%';
    return;
  }
  // Meter fill
  requestAnimationFrame(() => {
    setTimeout(() => {
      const fill = document.querySelector('.audit-meter-fill');
      if (fill) fill.style.width = (fill.dataset.target || '58') + '%';
    }, 350);
  });
  // Signal rows stagger
  document.querySelectorAll('.sig').forEach((el, i) => {
    setTimeout(() => el.classList.add('anim-in'), 750 + i * 110);
  });
  // AI results stagger
  document.querySelectorAll('.ai-result').forEach((el, i) => {
    setTimeout(() => el.classList.add('anim-in'), 1200 + i * 130);
  });
}

/* ---- Scroll reveal ---- */
function initReveal() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add('is-visible'), delay);
      obs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    // Stagger siblings inside grid/list parents
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.querySelectorAll(':scope > .reveal'));
      const idx = siblings.indexOf(el);
      if (idx > 0) el.dataset.delay = idx * 80;
    }
    obs.observe(el);
  });
}

/* ---- Form submission ---- */
function initForm() {
  const form = document.querySelector('#scan-form');
  const message = document.querySelector('#form-message');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const d = new FormData(form);
    const business = d.get('business') || '';
    const name     = d.get('name')     || '';
    const url      = d.get('url')      || '';
    const city     = d.get('city')     || '';
    const category = d.get('category') || '';
    const email    = d.get('email')    || '';
    const gbp      = d.get('gbp')      || '';

    const subject = encodeURIComponent(`Free Revenue Leak Scan request — ${business}`);
    const body = encodeURIComponent([
      'New Revenue Leak Score free scan request:',
      '',
      `Business:  ${business}`,
      `Name:      ${name}`,
      `Website:   ${url}`,
      `City:      ${city}`,
      `Category:  ${category}`,
      `Email:     ${email}`,
      `GBP URL:   ${gbp || 'Not provided'}`,
    ].join('\n'));

    if (message) message.textContent = 'Opening your email app — scan request is ready to send.';
    window.location.href = `mailto:kennethanthonymeyers@yahoo.com?subject=${subject}&body=${body}`;
  });
}

/* ---- Init ---- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { initHero(); initReveal(); initForm(); });
} else {
  initHero(); initReveal(); initForm();
}
