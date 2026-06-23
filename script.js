/* ═══════════════════════════════════════════════════════
   VACERO — script.js
   Effects: sticky nav · hero parallax · hero particle dust
   · text split entrance · stagger reveal · magnetic CTA
   · counter animation · smooth FAQ · cursor glow
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. STICKY NAV ── */
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  
  
    /* ── 2. HERO PARALLAX (background drifts slower than scroll) ── */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        heroBg.style.transform = `scale(1) translateY(${y * 0.35}px)`;
      }, { passive: true });
    }
  
  
    /* ── 3. FLOATING PARTICLE DUST in hero ── */
    (function createParticles() {
      const hero = document.querySelector('.hero');
      if (!hero) return;
      const count = 28;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        p.className = 'hero-particle';
        const size   = Math.random() * 3 + 1;          // 1–4 px
        const left   = Math.random() * 100;             // % across
        const delay  = Math.random() * 8;               // s
        const dur    = Math.random() * 12 + 10;         // 10–22 s
        const opacity = Math.random() * 0.35 + 0.05;
        p.style.cssText = `
          position:absolute; bottom:-10px; border-radius:50%;
          width:${size}px; height:${size}px;
          left:${left}%; opacity:${opacity};
          background: rgba(232,86,10,${opacity});
          animation: particleRise ${dur}s ease-in ${delay}s infinite;
          pointer-events:none; z-index:3;
        `;
        hero.appendChild(p);
      }
  
      /* inject keyframe once */
      if (!document.getElementById('particle-style')) {
        const s = document.createElement('style');
        s.id = 'particle-style';
        s.textContent = `
          @keyframes particleRise {
            0%   { transform: translateY(0) scale(1);   opacity: 0; }
            10%  { opacity: 1; }
            80%  { opacity: 0.6; }
            100% { transform: translateY(-100vh) scale(0.4); opacity: 0; }
          }
        `;
        document.head.appendChild(s);
      }
    })();
  
  
    /* ── 4. HERO TEXT SPLIT-LETTER ENTRANCE ── */
    (function splitHeroText() {
      const headline = document.querySelector('.hero h1');
      if (!headline) return;
  
      /* wrap each char in a span */
      const lines = headline.querySelectorAll('.line');
      lines.forEach((line, lineIdx) => {
        const text = line.textContent;
        line.textContent = '';
        line.innerHTML = [...text].map((ch, i) => {
          const delay = (lineIdx * text.length + i) * 28 + 300;
          const sp = ch === ' ' ? '&nbsp;' : ch;
          return `<span class="split-char" style="
            display:inline-block;
            opacity:0;
            transform:translateY(40px) rotate(${Math.random()*6-3}deg);
            transition: opacity .5s ease ${delay}ms, transform .5s cubic-bezier(.22,1,.36,1) ${delay}ms;
          ">${sp}</span>`;
        }).join('');
      });
  
      /* trigger after tiny delay so transition fires */
      setTimeout(() => {
        document.querySelectorAll('.split-char').forEach(s => {
          s.style.opacity = '1';
          s.style.transform = 'translateY(0) rotate(0deg)';
        });
      }, 80);
    })();
  
  
    /* ── 5. HERO EYEBROW / SUB / CTA staggered fade-up ── */
    [
      { sel: '.hero-eyebrow', delay: 200 },
      { sel: '.hero-sub',     delay: 800 },
      { sel: '.hero-actions', delay: 1050 },
      { sel: '.hero-trust',   delay: 1250 },
    ].forEach(({ sel, delay }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 80);
    });
  
  
    /* ── 6. MAGNETIC CTA BUTTON ── */
    const cta = document.querySelector('.hero-cta, .btn-primary');
    if (cta) {
      cta.addEventListener('mousemove', (e) => {
        const rect = cta.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) * 0.3;
        const dy = (e.clientY - cy) * 0.3;
        cta.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      cta.addEventListener('mouseleave', () => {
        cta.style.transform = 'translate(0,0)';
        cta.style.transition = 'transform .4s cubic-bezier(.22,1,.36,1)';
      });
      cta.addEventListener('mouseenter', () => {
        cta.style.transition = 'transform .1s ease';
      });
    }
  
  
    /* ── 7. SCROLL REVEAL with stagger + directional slide ── */
    const revealEls = document.querySelectorAll('.reveal');
  
    const injectRevealStyle = () => {
      if (document.getElementById('reveal-style')) return;
      const s = document.createElement('style');
      s.id = 'reveal-style';
      s.textContent = `
        .reveal { opacity:0; transition: opacity .7s ease, transform .7s cubic-bezier(.22,1,.36,1); }
        .reveal.from-left  { transform: translateX(-50px); }
        .reveal.from-right { transform: translateX(50px); }
        .reveal.from-below { transform: translateY(40px); }
        .reveal.scale-in   { transform: scale(0.88); }
        .reveal.visible    { opacity:1 !important; transform: none !important; }
      `;
      document.head.appendChild(s);
    };
    injectRevealStyle();
  
    /* assign a direction class automatically */
    revealEls.forEach((el, i) => {
      const directions = ['from-below','from-left','from-right','scale-in'];
      if (!el.classList.contains('from-left') &&
          !el.classList.contains('from-right') &&
          !el.classList.contains('scale-in')) {
        el.classList.add(directions[i % directions.length]);
      }
    });
  
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const delay = (entry.target.dataset.staggerIdx || 0) * 100;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  
    revealEls.forEach((el, i) => {
      el.dataset.staggerIdx = i % 5;
      revealObserver.observe(el);
    });
  
  
    /* ── 8. NUMBER COUNTER ANIMATION ── */
    (function initCounters() {
      const counters = document.querySelectorAll('[data-count]');
      if (!counters.length) return;
  
      const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el     = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const dur    = 1600;
          const start  = performance.now();
  
          const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            /* easeOutExpo */
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            el.textContent = Math.round(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          countObserver.unobserve(el);
        });
      }, { threshold: 0.5 });
  
      counters.forEach(el => countObserver.observe(el));
    })();
  
  
    /* ── 9. IMAGERY STRIP — Ken Burns hover effect ── */
    document.querySelectorAll('.imagery-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.querySelector('img').style.transform = 'scale(1.07)';
      });
      item.addEventListener('mouseleave', () => {
        item.querySelector('img').style.transform = 'scale(1)';
      });
    });
  
  
    /* ── 10. ORANGE CURSOR GLOW (desktop only) ── */
    if (window.matchMedia('(pointer:fine)').matches) {
      const glow = document.createElement('div');
      glow.id = 'cursor-glow';
      glow.style.cssText = `
        position:fixed; width:300px; height:300px;
        border-radius:50%; pointer-events:none; z-index:9999;
        background: radial-gradient(circle, rgba(232,86,10,0.08) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        transition: opacity .3s ease;
        top:0; left:0;
      `;
      document.body.appendChild(glow);
  
      document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
      }, { passive: true });
  
      document.addEventListener('mouseleave', () => glow.style.opacity = '0');
      document.addEventListener('mouseenter', () => glow.style.opacity = '1');
    }
  
  
    /* ── 11. FAQ accordion ── */
    window.toggleFaq = function(btn) {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');
  
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });
  
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    };
  
  
    /* ── 12. HOW-IT-WORKS step number count-up on enter ── */
    document.querySelectorAll('.step-num').forEach(el => {
      const text = el.textContent.trim();          // e.g. "01"
      const num  = parseInt(text, 10);
      el.textContent = text;
  
      const obs = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        let f = 0;
        const id = setInterval(() => {
          f++;
          el.textContent = String(f).padStart(2,'0');
          if (f >= num) clearInterval(id);
        }, 60);
        obs.unobserve(el);
      }, { threshold: 0.6 });
      obs.observe(el);
    });
  
  });