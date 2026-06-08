function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function initCursor() {
  const cDot = document.getElementById('c-dot');
  const cRing = document.getElementById('c-ring');

  if (!cDot || !cRing) return;

  let mx = -100;
  let my = -100;
  let rx = -100;
  let ry = -100;
  let lastSpark = 0;

  document.addEventListener('mousemove', (event) => {
    mx = event.clientX;
    my = event.clientY;

    const now = Date.now();
    if (now - lastSpark <= 80) return;

    lastSpark = now;
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = mx + 'px';
    sparkle.style.top = my + 'px';
    sparkle.style.width = sparkle.style.height = 3 + Math.random() * 4 + 'px';
    sparkle.style.background = [
      'var(--sage-l)',
      'var(--sand-l)',
      'var(--rose-l)',
      'var(--lav-l)',
    ][Math.floor(Math.random() * 4)];
    sparkle.style.marginLeft = Math.random() * 16 - 8 + 'px';
    sparkle.style.marginTop = Math.random() * 16 - 8 + 'px';
    document.body.appendChild(sparkle);
    window.setTimeout(() => sparkle.remove(), 600);
  });

  function animateCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    cDot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    cRing.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  qsa('a,button,.v-tab,.f-btn,.approach-card,.c-opt,.mag-btn,.a-card,.cr-card,.case-card')
    .forEach((element) => {
      element.addEventListener('mouseenter', () => document.body.classList.add('hov'));
      element.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
    });
}

function initScrollChrome() {
  const progress = document.getElementById('prog');
  const nav = document.getElementById('nav');

  if (!progress || !nav) return;

  function onScroll() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const width = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = width + '%';
    nav.classList.toggle('on', window.scrollY > 24);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initParallax() {
  // Skip parallax on mobile — the translateY offset pushes headings
  // off-screen when sections aren't yet near the viewport center.
  if (window.innerWidth < 768) return;

  const heroBlobs = qsa('.blob[data-speed]');
  const sections = qsa('section:not(#hero)');

  if (!heroBlobs.length && !sections.length) return;

  const sectionDots = sections.map((section, index) => {
    const dot = document.createElement('div');
    const isEven = index % 2 === 0;
    const size = 280 + (index % 3) * 60;
    const colors = [
      'rgba(122,158,142,.05)',
      'rgba(196,164,122,.05)',
      'rgba(148,133,192,.04)',
      'rgba(188,126,126,.04)',
    ];

    dot.style.cssText = `
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      z-index: -1;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[index % colors.length]};
      left: ${isEven ? '-120px' : 'auto'};
      right: ${isEven ? 'auto' : '-120px'};
      top: ${section.offsetTop + section.offsetHeight / 2 - size / 2}px;
      filter: blur(64px);
      will-change: transform;
    `;
    dot.classList.add('sec-bg-dot');
    document.body.appendChild(dot);

    return { section, dot };
  });

  let rafId = null;

  function doParallax() {
    if (window.innerWidth < 768) {
      // Clear any transforms set at a wider viewport
      heroBlobs.forEach((blob) => { blob.style.transform = ''; });
      sectionDots.forEach(({ dot, section }) => {
        dot.style.transform = '';
        const heading = section.querySelector('.sec-title, .contact-headline');
        if (heading) heading.style.transform = '';
      });
      return;
    }
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    heroBlobs.forEach((blob) => {
      const speed = parseFloat(blob.dataset.speed || '1');
      blob.style.transform = `translateY(${scrollY * (1 - speed)}px)`;
    });

    sectionDots.forEach(({ section, dot }) => {
      const rect = section.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - viewportHeight / 2;
      dot.style.transform = `translateY(${center * 0.08}px)`;

      const heading = section.querySelector('.sec-title, .contact-headline');
      if (heading) {
        heading.style.transform = `translateY(${center * 0.03}px)`;
      }
    });

    rafId = null;
  }

  window.addEventListener('scroll', () => {
    if (!rafId) rafId = requestAnimationFrame(doParallax);
  }, { passive: true });

  window.addEventListener('resize', doParallax, { passive: true });
  doParallax();
}

function initHeroCardTilt() {
  const heroCard = document.getElementById('heroCard');
  if (!heroCard) return;

  heroCard.addEventListener('mousemove', (event) => {
    const rect = heroCard.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (event.clientX - cx) / (rect.width / 2);
    const dy = (event.clientY - cy) / (rect.height / 2);
    heroCard.style.transform = `perspective(800px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`;
  });

  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = '';
  });
}

function initTypewriter() {
  const typed = document.getElementById('typed-text');
  if (!typed) return;

  const phrases = [
    'Building user-centered digital products.',
    'Making data-driven decisions.',
    'Designing AI-powered workflows.',
    'Turning messy problems into clear roadmaps.',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeStep() {
    const phrase = phrases[phraseIndex];

    if (!deleting) {
      typed.textContent = phrase.slice(0, ++charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        window.setTimeout(typeStep, 2000);
        return;
      }
      window.setTimeout(typeStep, 48);
      return;
    }

    typed.textContent = phrase.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      window.setTimeout(typeStep, 300);
      return;
    }
    window.setTimeout(typeStep, 22);
  }

  typeStep();
}

function initHeroInterestCard() {
  const result = document.getElementById('vResult');
  const tags = document.getElementById('fTags');
  if (!result || !tags) return;

  const tabData = {
    saas: {
      text: '<strong>B2B / B2C SaaS</strong>I like products where user needs, business goals, and measurable outcomes all need to line up.',
      tags: ['SaaS', 'User experience', 'Experimentation', 'AI / LLM'],
    },
    ux: {
      text: '<strong>User experience</strong>Conducted 50+ user interviews and used UX research to find the real problem before building.',
      tags: ['Interviews', 'User journey mapping', 'Discovery', 'UX'],
    },
    data: {
      text: '<strong>Data / experimentation</strong>Reduce gut feel by connecting product decisions to trackable metrics and experiments.',
      tags: ['A/B testing', 'Funnels', 'Dashboards', 'Data analysis'],
    },
    ai: {
      text: '<strong>AI / LLM</strong>Built LLM workflows that automate manual work and help teams move faster.',
      tags: ['LLM', 'Automation', 'Prompt design', 'Model evaluation'],
    },
  };

  qsa('.v-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      qsa('.v-tab').forEach((item) => item.classList.remove('active'));
      tab.classList.add('active');

      const data = tabData[tab.dataset.i];
      if (!data) return;

      result.innerHTML = data.text;
      tags.innerHTML = data.tags.map((tag) => `<span class="ftag">${tag}</span>`).join('');
    });
  });
}

function initCaseFilters() {
  const caseCards = qsa('.case-card');
  if (!caseCards.length) return;

  function applyFilter(filter) {
    qsa('.f-btn').forEach((button) => {
      button.classList.toggle('active', button.dataset.f === filter);
    });

    caseCards.forEach((card) => {
      const categories = card.dataset.cats ? card.dataset.cats.split(' ') : [];
      card.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
    });

    qsa('.approach-card').forEach((card) => {
      card.classList.toggle('active', card.dataset.approach === filter);
    });
  }

  qsa('.approach-card').forEach((card) => {
    card.addEventListener('click', () => applyFilter(card.dataset.approach));
  });

  qsa('.f-btn').forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.f));
  });
}

function initInvoicePreview() {
  const previewImage = document.getElementById('invoicePreviewImage');
  const previewCaption = document.getElementById('invoicePreviewCaption');
  const preview = document.getElementById('invoicePreview');
  const prevButton = document.getElementById('invoicePrev');
  const nextButton = document.getElementById('invoiceNext');

  if (!previewImage || !previewCaption || !preview) return;

  // Move arrow buttons into the phone stage so they overlay the image (all viewports)
  const phoneStage = document.querySelector('.case-phone-stage');
  if (phoneStage && prevButton && nextButton) {
    phoneStage.appendChild(prevButton);
    phoneStage.appendChild(nextButton);
  }

  const slides = [
    {
      src: 'img/invoice_home.png',
      alt: 'LINE Invoice home screen with spending overview and barcode',
      title: 'Home dashboard',
      desc: 'Spending overview, barcode access, and a quick financial snapshot.',
    },
    {
      src: 'img/invoice_scan.png',
      alt: 'LINE Invoice scan screen with invoice QR code capture',
      title: 'Invoice scan',
      desc: 'A guided scan flow that makes invoice capture feel easy for first-time users.',
    },
    {
      src: 'img/invoice_record.png',
      alt: 'LINE Invoice records screen showing invoice history',
      title: 'Records',
      desc: 'A simple record view so users can review past invoices without friction.',
    },
    {
      src: 'img/invoice_spending.png',
      alt: 'LINE Invoice spending screen with category charts',
      title: 'Spending analysis',
      desc: 'Category breakdowns help users see value beyond just storage and scanning.',
    },
    {
      src: 'img/invoice_details.png',
      alt: 'LINE Invoice details screen showing detailed invoice information',
      title: 'Invoice details',
      desc: 'Detailed invoice information presented in a cleaner, easier-to-read structure.',
    },
    {
      src: 'img/invoice_bingo.png',
      alt: 'LINE Invoice bingo or rewards related screen',
      title: 'Bingo feature',
      desc: 'A lighter, playful feature layer that gives users another reason to come back.',
    },
  ];

  let currentIndex = 0;
  let expandTimer = null;

  function renderSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    const slide = slides[currentIndex];
    previewImage.src = slide.src;
    previewImage.alt = slide.alt;
    previewCaption.innerHTML = `<strong>${slide.title}</strong>${slide.desc}`;
  }

  function pulsePreview() {
    preview.classList.add('is-expanded');
    if (expandTimer) window.clearTimeout(expandTimer);
    expandTimer = window.setTimeout(() => {
      preview.classList.remove('is-expanded');
    }, 900);
  }

  if ('IntersectionObserver' in window) {
    const previewObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        preview.classList.toggle('is-inview', entry.isIntersecting);
      });
    }, { threshold: 0.45 });
    previewObserver.observe(preview);
  } else {
    preview.classList.add('is-inview');
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      renderSlide(currentIndex - 1);
      pulsePreview();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      renderSlide(currentIndex + 1);
      pulsePreview();
    });
  }

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchStartY = 0;
  preview.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  preview.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) { renderSlide(currentIndex + 1); pulsePreview(); }
      else        { renderSlide(currentIndex - 1); pulsePreview(); }
    }
  }, { passive: true });

  renderSlide(0);
}

function initAboutCards() {
  const cards = qsa('.a-card');
  const deck = document.querySelector('.about-cards');
  if (!cards.length || !deck) return;

  const mobileQuery = window.matchMedia('(max-width: 680px)');
  let observer = null;

  function setActiveCard(activeCard) {
    cards.forEach((card) => {
      card.classList.toggle('active', card === activeCard);
    });
  }

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => setActiveCard(card));
    card.addEventListener('focus', () => setActiveCard(card));
  });

  function initObserver() {
    if (observer) observer.disconnect();

    if (!mobileQuery.matches) {
      setActiveCard(cards[0]);
      return;
    }

    observer = new IntersectionObserver((entries) => {
      let best = null;
      entries.forEach((entry) => {
        if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
          best = entry;
        }
      });

      if (best) setActiveCard(best.target);
    }, {
      root: null,
      rootMargin: '-18% 0px -32% 0px',
      threshold: [0.45, 0.6, 0.75],
    });

    cards.forEach((card) => observer.observe(card));
  }

  initObserver();

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', initObserver);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(initObserver);
  }
}

function initMagneticButtons() {
  qsa('.mag-btn').forEach((button) => {
    button.addEventListener('mousemove', (event) => {
      const rect = button.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      button.style.transform = `translate(${dx * 0.22}px,${dy * 0.22}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
}

function initRevealObserver() {
  const revealElements = qsa('.reveal');
  if (!revealElements.length || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('vis'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      // rAF ensures the element is painted in its hidden state first,
      // so the CSS transition actually plays (fixes mobile instant-show bug)
      requestAnimationFrame(() => {
        entry.target.classList.add('vis');
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((element) => observer.observe(element));
}

function initExperienceFilters() {
  const chips = qsa('.exp-chip');
  if (!chips.length) return;

  const workIds = ['holidu', 'line-pm', 'line-ml', 'kdan'];
  const eduIds = ['lmu', 'nccu', 'cologne'];

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((item) => item.classList.remove('active'));
      chip.classList.add('active');

      const target = chip.dataset.tl;

      qsa('.tl-item').forEach((item) => {
        const id = item.dataset.tl;
        if (target === 'all') {
          item.classList.remove('hidden');
        } else if (target === 'work') {
          item.classList.toggle('hidden', !workIds.includes(id));
        } else if (target === 'edu') {
          item.classList.toggle('hidden', !eduIds.includes(id));
        }
      });

      qsa('.exp-section-label').forEach((label) => {
        const section = label.dataset.section;
        label.classList.toggle('hidden', target !== 'all' && section !== target);
      });
    });
  });
}

function initExperienceAccordion() {
  const items = qsa('.tl-item');
  if (!items.length) return;

  function setToggleState(item, button, isOpen) {
    item.classList.toggle('is-open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
    button.textContent = isOpen ? 'Show less' : 'Show more';
  }

  items.forEach((item) => {
    const body = item.querySelector('.tl-body');
    const summary = body ? body.querySelector('.tl-summary') : null;
    const list = body ? body.querySelector('ul') : null;
    const tags = body ? body.querySelector('.tl-tag-row') : null;
    const hasList = !!list && list.children.length > 0;
    const hasTagRow = !!tags && tags.children.length > 0;

    if (!body || (!hasList && !hasTagRow)) return;

    item.classList.add('collapsible');

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'tl-toggle';
    setToggleState(item, toggle, false);
    toggle.addEventListener('click', () => {
      const shouldOpen = !item.classList.contains('is-open');
      setToggleState(item, toggle, shouldOpen);
    });

    [summary, tags].forEach((element) => {
      if (!element) return;
      element.addEventListener('click', () => {
        const shouldOpen = !item.classList.contains('is-open');
        setToggleState(item, toggle, shouldOpen);
      });
    });

    body.appendChild(toggle);
  });
}

function initAlbumBoard() {
  const board = document.getElementById('albumBoard');
  if (!board) return;

  const cards = qsa('.album-card', board);

  // Secret card: tap to reveal the photo
  const secretCard = board.querySelector('.album-card.is-secret');
  if (secretCard) {
    secretCard.addEventListener('click', () => {
      secretCard.classList.add('is-revealed');
    });
    secretCard.addEventListener('touchend', (e) => {
      e.preventDefault();
      secretCard.classList.add('is-revealed');
    });
  }

  // On mobile, override positions to match a stacked-fan layout
  if (window.innerWidth < 768) {
    const mobileLayouts = [
      { left: 20,  top: 20,  rotate: -4,  z: 5 }, // "How I got into Tech" — left col, top
      { left: 160, top: 8,   rotate:  7,  z: 3 }, // "A Day in My Life" — right col, top
      { left: 10,  top: 220, rotate: -8,  z: 2 }, // Course card — left col, bottom
      { left: 155, top: 208, rotate:  5,  z: 3 }, // AI card — right col, bottom
      { left: 185, top: 118, rotate:  11, z: 1 }, // QR — right edge, peeking
      { left: 70,  top: 80,  rotate:  1,  z: 0 }, // Secret card — buried under all others
    ];
    cards.forEach((card, i) => {
      const p = mobileLayouts[i];
      if (!p) return;
      card.style.left      = p.left + 'px';
      card.style.top       = p.top  + 'px';
      card.style.transform = `rotate(${p.rotate}deg)`;
      card.style.zIndex    = String(p.z);
    });
  }

  let activeDragCard = null;
  let topZ = cards.reduce((maxZ, card) => {
    const zIndex = parseInt(card.style.zIndex || '1', 10);
    return Number.isNaN(zIndex) ? maxZ : Math.max(maxZ, zIndex);
  }, 1);

  function bringToFront(card) {
    topZ += 1;
    card.style.zIndex = String(topZ);
  }

  cards.forEach((card) => {
    let dragging = false;
    let ox = 0;
    let oy = 0;
    let startX = 0;
    let startY = 0;
    let baseRot = parseFloat((card.style.transform.match(/-?\d+\.?\d*/) || [0])[0]);

    card.addEventListener('mousedown', (event) => {
      event.preventDefault();
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      ox = parseInt(card.style.left, 10);
      oy = parseInt(card.style.top, 10);
      activeDragCard = card;
      bringToFront(card);
      card.style.transition = 'none';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (event) => {
      if (!dragging) return;

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      const boardRect = board.getBoundingClientRect();
      const newLeft = Math.max(0, Math.min(boardRect.width - card.offsetWidth, ox + dx));
      const newTop = Math.max(0, Math.min(boardRect.height - card.offsetHeight, oy + dy));
      const tilt = Math.max(-12, Math.min(12, dx * 0.08));

      card.style.left = newLeft + 'px';
      card.style.top = newTop + 'px';
      card.style.transform = `rotate(${baseRot + tilt}deg) scale(1.04)`;
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;

      dragging = false;
      activeDragCard = null;
      card.style.transition = 'transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .2s';
      card.style.transform = `rotate(${baseRot}deg)`;
      document.body.style.userSelect = '';
    });

    card.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      dragging = true;
      startX = touch.clientX;
      startY = touch.clientY;
      ox = parseInt(card.style.left, 10);
      oy = parseInt(card.style.top, 10);
      activeDragCard = card;
      bringToFront(card);
    }, { passive: true });

    document.addEventListener('touchmove', (event) => {
      if (!dragging) return;

      const touch = event.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const boardRect = board.getBoundingClientRect();
      const newLeft = Math.max(0, Math.min(boardRect.width - card.offsetWidth, ox + dx));
      const newTop = Math.max(0, Math.min(boardRect.height - card.offsetHeight, oy + dy));

      card.style.left = newLeft + 'px';
      card.style.top = newTop + 'px';
    }, { passive: true });

    document.addEventListener('touchend', () => {
      dragging = false;
      activeDragCard = null;
    });
  });

  board.addEventListener('mousemove', (event) => {
    const boardRect = board.getBoundingClientRect();
    const mx = event.clientX - boardRect.left;
    const my = event.clientY - boardRect.top;

    cards.forEach((card) => {
      if (card === activeDragCard) return;

      const cx = parseInt(card.style.left, 10) + card.offsetWidth / 2;
      const cy = parseInt(card.style.top, 10) + card.offsetHeight / 2;
      const distance = Math.hypot(mx - cx, my - cy);
      const baseRotation = parseFloat((card.style.transform.match(/-?\d+\.?\d*/) || [0])[0]);

      if (distance < 120) {
        const angle = Math.atan2(my - cy, mx - cx);
        const push = ((120 - distance) / 120) * 8;
        card.style.transform = `rotate(${baseRotation}deg) translate(${-Math.cos(angle) * push}px,${-Math.sin(angle) * push}px)`;
      } else {
        card.style.transform = `rotate(${baseRotation}deg)`;
      }
    });
  });

  board.addEventListener('mouseleave', () => {
    cards.forEach((card) => {
      const baseRotation = parseFloat((card.style.transform.match(/-?\d+\.?\d*/) || [0])[0]);
      card.style.transform = `rotate(${baseRotation}deg)`;
    });
  });
}

function initMobileNav() {
  const mobileNav = document.getElementById('mobileNav');
  const burgerButton = document.getElementById('burgerBtn');
  const closeButton = document.getElementById('mobileClose');

  if (!mobileNav || !burgerButton) return;

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    burgerButton.setAttribute('aria-expanded', 'false');
  }

  burgerButton.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    burgerButton.setAttribute('aria-expanded', String(isOpen));
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeMobileNav);
  }

  qsa('[data-close-mobile]').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });
}

function initNavLogoWiggle() {
  const navLogo = document.querySelector('.nav-logo');
  if (!navLogo) return;

  navLogo.addEventListener('click', function () {
    this.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
    this.style.transform = 'rotate(-15deg) scale(1.15)';
    window.setTimeout(() => {
      this.style.transform = '';
    }, 500);
  });
}

/* ── Scroll restoration: save position when leaving to a case study ── */
function initScrollRestore() {
  // Save scroll position when clicking any link to a case study
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.includes('case-studies')) {
      sessionStorage.setItem('portfolioScrollY', String(window.scrollY));
    }
  });

  // If URL has a hash (e.g. #contact), scroll to that element after layout
  if (window.location.hash) {
    sessionStorage.removeItem('portfolioScrollY');
    const target = document.querySelector(window.location.hash);
    if (target) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: 'instant' });
        });
      });
    }
    return;
  }

  // Otherwise restore saved scroll position from before entering a case study
  const savedY = sessionStorage.getItem('portfolioScrollY');
  if (savedY !== null) {
    sessionStorage.removeItem('portfolioScrollY');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: parseInt(savedY, 10), behavior: 'instant' });
      });
    });
  }
}

/* ── Floating "Contact me" bar on mobile (main page) ──────── */
function initFloatingContact() {
  if (window.innerWidth >= 768) return;

  // Don't show on the contact section itself
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;

  const btn = document.createElement('a');
  btn.className = 'cs-float-contact';
  btn.href = '#contact';
  btn.textContent = 'Contact me';
  document.documentElement.appendChild(btn);

  let lastY = window.scrollY;
  let visible = false;

  function update() {
    const currentY = window.scrollY;
    const scrollingUp = currentY < lastY;
    const pastHero = currentY > 300;
    const nearContact = contactSection.getBoundingClientRect().top < window.innerHeight * 0.8;

    if (scrollingUp && pastHero && !nearContact && !visible) {
      btn.classList.add('is-visible');
      visible = true;
    } else if ((!scrollingUp || !pastHero || nearContact) && visible) {
      btn.classList.remove('is-visible');
      visible = false;
    }

    lastY = currentY;
  }

  window.addEventListener('scroll', update, { passive: true });
}

function initPage() {
  initCursor();
  initScrollChrome();
  initParallax();
  initHeroCardTilt();
  initTypewriter();
  initHeroInterestCard();
  initCaseFilters();
  initInvoicePreview();
  initAboutCards();
  initMagneticButtons();
  initRevealObserver();
  initExperienceFilters();
  initExperienceAccordion();
  initAlbumBoard();
  initMobileNav();
  initNavLogoWiggle();
  initScrollRestore();
  initFloatingContact();
}

initPage();
