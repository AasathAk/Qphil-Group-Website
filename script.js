/* ============================================================
   QPHIL GROUP — MAIN JAVASCRIPT
   Animations, Navigation, Counters, Particles, Scroll Effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── PRELOADER ───────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2000);
  });
  // Failsafe: hide preloader after 4s regardless
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }, 4000);

  // ─── NAVBAR SCROLL ──────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar background on scroll
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    lastScroll = scrollY;
  });

  // Back to top click
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── MOBILE NAV ─────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function toggleNav() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleNav);
  navOverlay.addEventListener('click', toggleNav);

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleNav();
      }
    });
  });

  // ─── ACTIVE NAV LINK ON SCROLL ──────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) {
            a.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // ─── SMOOTH SCROLL ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── INTERSECTION OBSERVER — REVEAL ANIMATIONS ─────────
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── COUNTER ANIMATION ─────────────────────────────────
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(easedProgress * target);
        counter.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Trigger counter when hero stats are in view
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterObserver.observe(heroStats);
  }

  // ─── 3D PARALLAX EFFECT ON HERO ────────────────────────────
  const heroSection = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  const heroBg = document.querySelector('.hero-bg img');

  if (heroSection && heroContent) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroContent.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(10px)`;
      if (heroBg) {
        heroBg.style.transform = `scale(1.08) translate(${-x * 20}px, ${-y * 20}px)`;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      heroContent.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
      if (heroBg) {
        heroBg.style.transform = 'scale(1.05) translate(0px, 0px)';
      }
    });
  }

  // ─── PARALLAX ON DOHA BANNERS ───────────────────────────
  const banners = document.querySelectorAll('.doha-banner img');
  window.addEventListener('scroll', () => {
    banners.forEach(banner => {
      const rect = banner.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top / window.innerHeight) * 40;
        banner.style.transform = `translateY(${offset}px) scale(1.05)`;
      }
    });
  });

  // ─── QUALITY TIMELINE — STEP ACTIVE ON SCROLL ──────────
  const qualitySteps = document.querySelectorAll('.quality-step');
  const stepObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numEl = entry.target.querySelector('.quality-step-number');
          if (numEl) {
            numEl.style.background = 'var(--gold)';
            numEl.style.color = 'var(--navy-dark)';
            numEl.style.boxShadow = '0 4px 18px rgba(197, 160, 89, 0.35)';
          }
        }
      });
    },
    { threshold: 0.6 }
  );
  qualitySteps.forEach(step => stepObserver.observe(step));

  // ─── UNIVERSAL 3D CARD TILT & SPECULAR HIGHLIGHT ────────
  const tiltCardSelectors = [
    '.promise-card',
    '.service-card',
    '.welfare-card',
    '.compliance-card',
    '.partnership-card',
    '.source-market-card',
    '.doc-card',
    '.talent-cat-card',
    '.org-function-card',
    '.transparency-item'
  ];

  const allTiltCards = document.querySelectorAll(tiltCardSelectors.join(','));

  allTiltCards.forEach(card => {
    card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease-out';
    card.style.transformStyle = 'preserve-3d';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
    });
  });

  // ─── GLOBAL SOURCING CORRIDORS MAP ───────────────────
  // Dedicated high-resolution Corridors Map is now active.

  // ─── CONTACT FORM (WEB3FORMS AJAX SUBMIT) ──────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = this.querySelector('.btn-submit');
      const originalText = btn.innerHTML;

      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        Sending...
      `;
      btn.disabled = true;

      const formData = new FormData(contactForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        const result = await response.json();
        if (response.status === 200 && result.success) {
          btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            Message Sent Successfully!
          `;
          btn.style.background = '#10B981';
          btn.style.color = '#fff';
          contactForm.reset();
        } else {
          btn.innerHTML = result.message || 'Error Sending Message';
          btn.style.background = '#EF4444';
          btn.style.color = '#fff';
        }
      })
      .catch((err) => {
        btn.innerHTML = 'Network Error. Please try again.';
        btn.style.background = '#EF4444';
        btn.style.color = '#fff';
      })
      .finally(() => {
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
        }, 5000);
      });
    });
  }

  // ─── CSS KEYFRAME FOR SPINNER ──────────────────────────
  const spinStyle = document.createElement('style');
  spinStyle.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(spinStyle);

  // ─── NAVBAR LOGO SUBTLE DEPTH ON HOVER ──────────────────
  const navLogo = document.querySelector('.navbar-logo img');
  if (navLogo) {
    navLogo.addEventListener('mouseenter', () => {
      navLogo.style.filter = 'drop-shadow(0 2px 8px rgba(197, 160, 89, 0.4))';
    });
    navLogo.addEventListener('mouseleave', () => {
      navLogo.style.filter = '';
    });
  }

});
