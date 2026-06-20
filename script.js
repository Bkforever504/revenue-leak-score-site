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
  const success = document.querySelector('#form-success');
  const submit = form?.querySelector('.submit-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const d = new FormData(form);
    if (d.get('_honey')) return;
    const business = d.get('business') || '';
    const name     = d.get('name')     || '';
    const url      = d.get('url')      || '';
    const city     = d.get('city')     || '';
    const category = d.get('category') || '';
    const email    = d.get('email')    || '';
    const gbp      = d.get('gbp')      || '';

    d.set('_subject', `Free Revenue Leak Scan request - ${business}`);
    d.set('_replyto', email);
    d.set('subject', `Free Revenue Leak Scan request - ${business}`);
    d.set('reply_to', email);

    const fallbackText = [
      'New Revenue Leak Score free scan request:',
      '',
      `Business:  ${business}`,
      `Name:      ${name}`,
      `Website:   ${url}`,
      `City:      ${city}`,
      `Category:  ${category}`,
      `Email:     ${email}`,
      `GBP URL:   ${gbp || 'Not provided'}`,
    ].join('\n');

    if (message) message.textContent = 'Sending your scan request...';
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Sending...';
    }

    try {
      const endpoint = form.action || '';
      const isFormSubmit = endpoint.includes('formsubmit.co');
      const isMissingFormspreeId = endpoint.includes('formspree.io/f/REPLACE_WITH_FORM_ID');
      if (isMissingFormspreeId) throw new Error('Formspree endpoint is not configured');

      const res = await fetch(endpoint, {
        method: 'POST',
        body: d,
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`Form endpoint returned ${res.status}`);
      const data = await res.json().catch(() => ({}));
      if (isFormSubmit && data.success !== 'true' && data.success !== true) {
        throw new Error(data.message || 'Submission failed');
      }
      form.classList.add('is-submitted');
      Array.from(form.elements).forEach(el => {
        if (!el.closest?.('.form-success')) el.disabled = true;
      });
      if (message) message.textContent = '';
      if (submit) submit.textContent = 'Request Sent';
      if (success) success.hidden = false;
    } catch (err) {
      let copied = false;
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(fallbackText);
          copied = true;
        } catch (_) {}
      }
      const subject = encodeURIComponent(`Free Revenue Leak Scan request - ${business}`);
      const body = encodeURIComponent(fallbackText);
      if (message) {
        message.innerHTML = 'The form could not send. ' + (copied ? 'Your request details were copied. ' : '') + '<a href="mailto:kennethanthonymeyers@yahoo.com?subject=' + subject + '&body=' + body + '">Send by email instead</a>.';
      }
      if (submit) {
        submit.disabled = false;
        submit.textContent = 'Try Sending Again';
      }
    }
  });
}

/* ---- CTA focus assist ---- */
function initScanFocus() {
  document.querySelectorAll('a[href="#scan"]').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        const field = document.querySelector('#f-business');
        if (field && window.matchMedia('(max-width: 900px)').matches) {
          field.focus({ preventScroll: true });
        }
      }, 650);
    });
  });
}

/* ---- Proof bar count-up ---- */
function initCountUp() {
  if (prefersReducedMotion) return;
  const items = document.querySelectorAll('.proof-item strong');
  const mapped = Array.from(items).map(el => {
    const raw = el.textContent.trim();
    const digits = raw.match(/\d+/);
    if (!digits) return { el, num: null };
    const num = parseInt(digits[0]);
    const pre = raw.slice(0, raw.indexOf(digits[0]));
    const suf = raw.slice(raw.indexOf(digits[0]) + digits[0].length);
    return { el, num, pre, suf, orig: raw };
  });
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    mapped.forEach(({ el, num, pre, suf, orig }) => {
      if (!num) return;
      const steps = 28;
      const delay = 32;
      let cur = 0;
      const inc = num / steps;
      const t = setInterval(() => {
        cur = Math.min(cur + inc, num);
        el.textContent = pre + Math.round(cur) + suf;
        if (cur >= num) { el.textContent = orig; clearInterval(t); }
      }, delay);
    });
  }, { threshold: 0.7 });
  const bar = document.querySelector('.proof-bar');
  if (bar) obs.observe(bar);
}

/* ---- Mobile nav toggle ---- */
function initNav() {
  const toggle = document.querySelector('#nav-toggle');
  const nav = document.querySelector('#site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('nav-open', !open);
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('nav-open');
    });
  });

  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('nav-open');
    }
  });
}

/* ---- Sticky mobile CTA visibility ---- */
function initStickyCTA() {
  const cta = document.querySelector('.mobile-cta');
  const form = document.querySelector('#scan');
  if (!cta || !form) return;
  const obs = new IntersectionObserver(entries => {
    cta.classList.toggle('hidden', entries[0].isIntersecting);
  }, { threshold: 0.15 });
  obs.observe(form);
}

/* ---- Init ---- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { initHero(); initReveal(); initForm(); initNav(); initStickyCTA(); initCountUp(); initScanFocus(); });
} else {
  initHero(); initReveal(); initForm(); initNav(); initStickyCTA(); initCountUp(); initScanFocus();
}
