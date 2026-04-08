/* ============================================
   KlickWert Restaurant — Animation System
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile & Reduced Motion Detection --- */
  const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = !isMobile && !prefersReduced;

  /* ============================================
     1. NAVIGATION
     ============================================ */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ============================================
     2. HERO VIDEO FADE ON SCROLL (Desktop only)
     ============================================ */
  if (isDesktop) {
    const heroVideoFixed = document.getElementById('heroVideoFixed');
    if (heroVideoFixed) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        // Fade out video as user scrolls past the spacer
        const opacity = 1 - Math.min(scrollY / vh, 1);
        heroVideoFixed.style.opacity = opacity;
      }, { passive: true });
    }
  }

  /* ============================================
     3. HERO PARTICLES CANVAS (Desktop only)
     ============================================ */
  if (isDesktop) {
    const heroCanvas = document.getElementById('heroParticles');
    if (heroCanvas) {
      const ctx = heroCanvas.getContext('2d');
      let particles = [];
      const PARTICLE_COUNT = 60;

      function resizeHeroCanvas() {
        const hero = heroCanvas.parentElement;
        heroCanvas.width = hero.offsetWidth;
        heroCanvas.height = hero.offsetHeight;
      }
      resizeHeroCanvas();
      window.addEventListener('resize', resizeHeroCanvas);

      class Particle {
        constructor() { this.reset(); }
        reset() {
          this.x = Math.random() * heroCanvas.width;
          this.y = heroCanvas.height + Math.random() * 100;
          this.size = Math.random() * 3 + 1;
          this.speedY = -(Math.random() * 0.6 + 0.2);
          this.speedX = (Math.random() - 0.5) * 0.3;
          this.opacity = Math.random() * 0.5 + 0.1;
          this.fadeSpeed = Math.random() * 0.003 + 0.001;
        }
        update() {
          this.y += this.speedY;
          this.x += this.speedX;
          this.opacity -= this.fadeSpeed;
          if (this.opacity <= 0 || this.y < -20) this.reset();
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 136, 76, ${this.opacity})`;
          ctx.fill();
          // Soft glow
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 136, 76, ${this.opacity * 0.15})`;
          ctx.fill();
        }
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = new Particle();
        p.y = Math.random() * heroCanvas.height; // spread initially
        particles.push(p);
      }

      function animateHeroParticles() {
        ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateHeroParticles);
      }
      animateHeroParticles();
    }
  }

  /* ============================================
     4. DREAM PARTICLES CANVAS (Desktop only)
     ============================================ */
  if (isDesktop) {
    const dreamCanvas = document.getElementById('dreamParticles');
    if (dreamCanvas) {
      const dCtx = dreamCanvas.getContext('2d');
      let dreamParts = [];
      const DREAM_COUNT = 35;

      function resizeDreamCanvas() {
        const sec = dreamCanvas.parentElement;
        dreamCanvas.width = sec.offsetWidth;
        dreamCanvas.height = sec.offsetHeight;
      }
      resizeDreamCanvas();
      window.addEventListener('resize', resizeDreamCanvas);

      class DreamParticle {
        constructor() { this.reset(true); }
        reset(init) {
          this.x = Math.random() * dreamCanvas.width;
          this.y = init ? Math.random() * dreamCanvas.height : -10;
          this.size = Math.random() * 2 + 0.5;
          this.speedY = Math.random() * 0.4 + 0.15;
          this.speedX = (Math.random() - 0.5) * 0.2;
          this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
          this.y += this.speedY;
          this.x += this.speedX;
          if (this.y > dreamCanvas.height + 10) this.reset(false);
        }
        draw() {
          dCtx.beginPath();
          dCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          dCtx.fillStyle = `rgba(201, 136, 76, ${this.opacity})`;
          dCtx.fill();
        }
      }

      for (let i = 0; i < DREAM_COUNT; i++) dreamParts.push(new DreamParticle());

      function animateDreamParticles() {
        dCtx.clearRect(0, 0, dreamCanvas.width, dreamCanvas.height);
        dreamParts.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateDreamParticles);
      }
      animateDreamParticles();
    }
  }

  /* ============================================
     5. SERVICES BACKGROUND CANVAS (Desktop only)
     ============================================ */
  if (isDesktop) {
    const svcCanvas = document.getElementById('servicesBgCanvas');
    if (svcCanvas) {
      const sCtx = svcCanvas.getContext('2d');
      let circles = [];
      const CIRCLE_COUNT = 8;

      function resizeSvcCanvas() {
        const sec = svcCanvas.parentElement;
        svcCanvas.width = sec.offsetWidth;
        svcCanvas.height = sec.offsetHeight;
      }
      resizeSvcCanvas();
      window.addEventListener('resize', resizeSvcCanvas);

      class FloatingCircle {
        constructor() {
          this.x = Math.random() * svcCanvas.width;
          this.y = Math.random() * svcCanvas.height;
          this.radius = Math.random() * 80 + 30;
          this.speedX = (Math.random() - 0.5) * 0.3;
          this.speedY = (Math.random() - 0.5) * 0.3;
          this.opacity = Math.random() * 0.04 + 0.01;
        }
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          if (this.x < -this.radius) this.x = svcCanvas.width + this.radius;
          if (this.x > svcCanvas.width + this.radius) this.x = -this.radius;
          if (this.y < -this.radius) this.y = svcCanvas.height + this.radius;
          if (this.y > svcCanvas.height + this.radius) this.y = -this.radius;
        }
        draw() {
          sCtx.beginPath();
          sCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          sCtx.strokeStyle = `rgba(201, 136, 76, ${this.opacity})`;
          sCtx.lineWidth = 1;
          sCtx.stroke();
        }
      }

      for (let i = 0; i < CIRCLE_COUNT; i++) circles.push(new FloatingCircle());

      function animateSvcBg() {
        sCtx.clearRect(0, 0, svcCanvas.width, svcCanvas.height);
        circles.forEach(c => { c.update(); c.draw(); });
        // Draw subtle connecting lines
        for (let i = 0; i < circles.length; i++) {
          for (let j = i + 1; j < circles.length; j++) {
            const dx = circles[i].x - circles[j].x;
            const dy = circles[i].y - circles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 300) {
              sCtx.beginPath();
              sCtx.moveTo(circles[i].x, circles[i].y);
              sCtx.lineTo(circles[j].x, circles[j].y);
              sCtx.strokeStyle = `rgba(201, 136, 76, ${0.02 * (1 - dist / 300)})`;
              sCtx.lineWidth = 0.5;
              sCtx.stroke();
            }
          }
        }
        requestAnimationFrame(animateSvcBg);
      }
      animateSvcBg();
    }
  }

  /* ============================================
     6. LETTER-BY-LETTER ANIMATION
     ============================================ */
  const letterElements = document.querySelectorAll('[data-letter-animate]');

  letterElements.forEach(el => {
    // Save original content
    const originalNodes = Array.from(el.childNodes);
    el.setAttribute('aria-label', el.textContent);
    el.innerHTML = '';

    let charIndex = 0;

    function processNodes(nodes, parent) {
      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.classList.add('char');
            if (text[i] === ' ' || text[i] === '\n') {
              span.classList.add('space');
              span.innerHTML = '&nbsp;';
            } else {
              span.textContent = text[i];
            }
            span.style.transitionDelay = `${charIndex * 25}ms`;
            parent.appendChild(span);
            // only increment for actual visible characters/spaces to keep delays consistent
            charIndex++;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'BR') {
            parent.appendChild(document.createElement('br'));
          } else {
            const clone = node.cloneNode(false);
            parent.appendChild(clone);
            processNodes(Array.from(node.childNodes), clone);
          }
        }
      });
    }

    processNodes(originalNodes, el);

    // Observe for visibility
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.add('letters-visible');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(el);
  });

  /* ============================================
     8. SCROLL REVEAL (Intersection Observer)
     ============================================ */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ============================================
     9. STAGGERED REVEAL (standard)
     ============================================ */
  const staggerContainers = document.querySelectorAll('[data-stagger]');

  staggerContainers.forEach(container => {
    const children = container.children;
    const delay = parseInt(container.getAttribute('data-stagger'), 10) || 200;
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = `${i * delay}ms`;
            child.classList.add('visible');
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    Array.from(children).forEach(child => child.classList.add('reveal'));
    staggerObserver.observe(container);
  });

  /* ============================================
     10. ALTERNATING STAGGER (Services Cards)
     ============================================ */
  const altContainers = document.querySelectorAll('[data-stagger-alt]');

  altContainers.forEach(container => {
    const children = Array.from(container.children);
    const delay = parseInt(container.getAttribute('data-stagger-alt'), 10) || 150;

    children.forEach((child, i) => {
      if (isDesktop) {
        child.classList.add(i % 2 === 0 ? 'reveal-alt-left' : 'reveal-alt-right');
      } else {
        child.classList.add('reveal');
      }
    });

    const altObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * delay}ms`;
            child.classList.add('visible');
          });
          altObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    altObserver.observe(container);
  });

  /* ============================================
     11. PAKETE STAGGER + SCALE REVEAL
     ============================================ */
  const paketeGrid = document.querySelector('[data-stagger-pakete]');
  if (paketeGrid) {
    const cards = Array.from(paketeGrid.children);

    // Standard cards get reveal
    cards.forEach((card, i) => {
      if (!card.hasAttribute('data-scale-reveal')) {
        card.classList.add('reveal');
      }
    });

    const paketeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            setTimeout(() => {
              if (card.hasAttribute('data-scale-reveal')) {
                card.classList.add('scale-visible');
              } else {
                card.classList.add('visible');
              }
            }, i * 200);
          });
          paketeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    paketeObserver.observe(paketeGrid);
  }

  /* ============================================
     12. USP GLOW EFFECT
     ============================================ */
  const glowItems = document.querySelectorAll('[data-glow]');

  if (glowItems.length > 0) {
    const glowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('glow-active');
          }, 300);
          glowObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    glowItems.forEach(el => glowObserver.observe(el));
  }

  /* ============================================
     13. 3D TILT EFFECT (Desktop only)
     ============================================ */
  if (isDesktop) {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    const maxTilt = 8;

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * maxTilt;
        const rotateY = (x - 0.5) * maxTilt;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        card.style.transition = 'transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'border-color 0.4s ease, box-shadow 0.4s ease';
      });
    });
  }

  /* ============================================
     14. DEMO VIDEO AUTOPLAY ON SCROLL
     ============================================ */
  const demoVideo = document.querySelector('.demo-video');
  if (demoVideo) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          demoVideo.play();
        } else {
          demoVideo.pause();
        }
      });
    }, { threshold: 0.3 });
    videoObserver.observe(demoVideo);
  }

  /* ============================================
     15. SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
