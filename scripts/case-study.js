/* Enable CSS animations only when JS is ready */
document.body.classList.add('cs-animate');

/* ─── Hero visual parallax + entrance ─────────────────── */
function initCaseStudyHeroVisuals() {
  const visuals = document.querySelectorAll("[data-hero-visual]");
  visuals.forEach((heroVisual) => {
    let ticking = false;
    function updateHeroVisual() {
      const rect = heroVisual.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const progress = 1 - Math.min(Math.max(rect.top / (viewportHeight * 0.9), 0), 1);
      const isContainHero = heroVisual.classList.contains("is-contain");
      const scale = isContainHero
        ? 1 + progress * 0.04
        : 1.03 + progress * 0.11;
      heroVisual.style.setProperty("--hero-scale", scale.toFixed(3));
      heroVisual.classList.toggle(
        "is-inview",
        rect.bottom > viewportHeight * 0.14 && rect.top < viewportHeight * 0.88
      );
      ticking = false;
    }
    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeroVisual);
    }
    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  });
}

/* ─── Image zoom / lightbox ───────────────────────────── */
function initCaseStudyImageZoom() {
  const zoomableSelectors = [
    ".hero-visual",
    ".launch-photo.is-document",
    ".case-gallery-screen",
  ];
  const zoomable = Array.from(document.querySelectorAll(zoomableSelectors.join(", ")));
  if (zoomable.length === 0) return;

  const overlay = document.createElement("div");
  overlay.className = "case-image-zoom";
  overlay.innerHTML = `
    <button class="case-image-zoom-close" type="button" aria-label="Close zoomed image">×</button>
    <figure class="case-image-zoom-frame" role="dialog" aria-modal="true" aria-label="Zoomed image">
      <img class="case-image-zoom-img" alt="" />
      <figcaption class="case-image-zoom-caption"></figcaption>
    </figure>
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector(".case-image-zoom-img");
  const caption = overlay.querySelector(".case-image-zoom-caption");
  const closeBtn = overlay.querySelector(".case-image-zoom-close");

  let lastFocused = null;

  function closeZoom() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("is-zoom-locked");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  function openZoomFrom(trigger) {
    const sourceImg = trigger.querySelector("img");
    if (!sourceImg) return;

    lastFocused = trigger;
    img.src = sourceImg.currentSrc || sourceImg.src;
    img.alt = sourceImg.alt || "";

    const figcaption = trigger.querySelector("figcaption");
    caption.textContent = figcaption ? figcaption.textContent.trim() : sourceImg.alt || "";

    document.body.classList.add("is-zoom-locked");
    overlay.classList.add("is-open");
    window.requestAnimationFrame(() => closeBtn.focus());
  }

  zoomable.forEach((trigger) => {
    const hasInteractiveDescendant = trigger.matches("figure") || trigger.matches(".hero-visual") || trigger.matches(".case-gallery-screen");
    if (!hasInteractiveDescendant) return;

    trigger.classList.add("is-zoomable");
    trigger.setAttribute("role", "button");
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("aria-label", "Open image in zoomed view");

    trigger.addEventListener("click", (e) => {
      if (e.target.closest(".case-gallery-btn")) return;
      if (e.target.closest("button")) return;
      openZoomFrom(trigger);
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openZoomFrom(trigger);
      }
    });
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeZoom();
    }
  });
  closeBtn.addEventListener("click", closeZoom);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      closeZoom();
    }
  });
}

/* ─── Gallery with crossfade ───────────────────────────── */
function initCaseStudyGalleries() {
  const galleries = document.querySelectorAll("[data-case-gallery]");
  galleries.forEach((gallery) => {
    const image   = gallery.querySelector("[data-gallery-image]");
    const caption = gallery.querySelector("[data-gallery-caption]");
    const prev    = gallery.querySelector("[data-gallery-prev]");
    const next    = gallery.querySelector("[data-gallery-next]");
    const dataNode = gallery.querySelector(".case-gallery-data");
    const stage    = gallery.querySelector(".case-gallery-stage");
    if (!image || !caption || !prev || !next || !dataNode) return;

    // On mobile: move arrow buttons into the stage so they overlay the image
    if (window.innerWidth < 768 && stage) {
      stage.appendChild(prev);
      stage.appendChild(next);
    }

    let slides;
    try { slides = JSON.parse(dataNode.textContent); }
    catch (e) { return; }
    if (!Array.isArray(slides) || slides.length === 0) return;

    let galleryIndex = 0;
    let activeTimer = null;
    let transitioning = false;

    function renderSlide(index) {
      if (transitioning) return;
      transitioning = true;
      const newIndex = (index + slides.length) % slides.length;

      // Crossfade out
      image.classList.add("is-fading");
      setTimeout(() => {
        galleryIndex = newIndex;
        const slide = slides[galleryIndex];
        image.src = slide.src;
        image.alt = slide.alt;
        caption.innerHTML = `<strong>${slide.title}</strong>${slide.desc}`;
        image.classList.remove("is-fading");
        transitioning = false;
      }, 300);
    }

    function pulseGallery() {
      gallery.classList.add("is-active");
      window.clearTimeout(activeTimer);
      activeTimer = window.setTimeout(() => gallery.classList.remove("is-active"), 900);
    }

    gallery.classList.add("is-ready");
    renderSlide(0);

    prev.addEventListener("click", () => { renderSlide(galleryIndex - 1); pulseGallery(); });
    next.addEventListener("click", () => { renderSlide(galleryIndex + 1); pulseGallery(); });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    gallery.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    gallery.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      // Only trigger if horizontal swipe is dominant and long enough
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) { renderSlide(galleryIndex + 1); pulseGallery(); }
        else        { renderSlide(galleryIndex - 1); pulseGallery(); }
      }
    }, { passive: true });
  });
}

/* ─── Reading progress ──────────────────────────────────── */
function initReadingProgress() {
  const bar = document.createElement("div");
  bar.className = "reading-progress";
  document.body.prepend(bar);

  function update() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${docH > 0 ? window.scrollY / docH : 0})`;
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ─── Sticky mini-header ────────────────────────────────── */
function initMiniHeader() {
  const titleText = document.querySelector("h1")?.textContent?.trim() || "";

  const header = document.createElement("div");
  header.className = "case-mini-header";
  header.innerHTML = `
    <a class="case-mini-header-back" href="../../index.html">← Back</a>
    <span class="case-mini-header-sep">/</span>
    <span class="case-mini-header-title">${titleText}</span>
    <div class="case-mini-progress"><div class="case-mini-progress-fill" id="miniProgressFill"></div></div>
  `;
  document.body.prepend(header);

  const fill = document.getElementById("miniProgressFill");
  const heroEl = document.querySelector(".hero");

  let ticking = false;
  function update() {
    const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : 0;
    header.classList.toggle("is-visible", heroBottom < 0);
    if (fill) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = `${docH > 0 ? Math.round(window.scrollY / docH * 100) : 0}%`;
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
}

/* ─── Scroll-reveal with stagger ───────────────────────── */
function initScrollReveal() {
  // Add reveal class to key elements
  const targets = [
    ".section",
    ".step",
    ".impact-metric",
    ".impact-quote",
    ".pull-quote",
    ".case-gallery",
    ".case-chip-list",
  ];

  targets.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add("cs-reveal");
      // Stagger siblings in the same parent
      const siblings = el.parentElement.querySelectorAll(sel);
      if (siblings.length > 1) {
        const idx = Array.from(siblings).indexOf(el);
        if (idx === 1) el.classList.add("cs-delay-1");
        if (idx === 2) el.classList.add("cs-delay-2");
        if (idx >= 3) el.classList.add("cs-delay-3");
      }
    });
  });

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("cs-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".cs-reveal").forEach((el) => obs.observe(el));
}

/* ─── Impact metric pop animation ──────────────────────── */
function initImpactMetrics() {
  const metrics = document.querySelectorAll(".impact-metric");
  if (!metrics.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = entry.target.closest(".impact-metrics")
            ?.querySelectorAll(".impact-metric");
          if (cards) {
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.classList.add("cs-popped");
                if (i === 1) card.classList.add("cs-delay-1");
                if (i === 2) card.classList.add("cs-delay-2");
              }, i * 80);
            });
          }
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  if (metrics[0]) obs.observe(metrics[0]);
}

/* ─── Sidebar TOC with active tracking ─────────────────── */
function initToc() {
  const sections = Array.from(document.querySelectorAll(".section[id]"));
  if (sections.length === 0) return;

  const aside = document.createElement("aside");
  aside.className = "case-toc";

  const label = document.createElement("span");
  label.className = "toc-label";
  label.textContent = "On this page";
  aside.appendChild(label);

  const ul = document.createElement("ul");
  ul.className = "toc-list";

  sections.forEach((sec) => {
    const heading = sec.querySelector(".section-title");
    if (!heading) return;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "toc-link";
    a.href = `#${sec.id}`;
    a.textContent = heading.textContent.trim();
    li.appendChild(a);
    ul.appendChild(li);
  });

  aside.appendChild(ul);

  const content = document.querySelector(".content");
  if (!content) return;

  const layout = document.createElement("div");
  layout.className = "content-layout";
  content.parentNode.insertBefore(layout, content);
  layout.appendChild(content);
  layout.appendChild(aside);

  // Smooth scroll on click
  ul.querySelectorAll(".toc-link").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Active section tracking
  const links = Array.from(ul.querySelectorAll(".toc-link"));
  let rafQueued = false;

  function highlightActive() {
    const scrollMid = window.scrollY + window.innerHeight * 0.35;
    let activeId = sections[0].id;
    sections.forEach((sec) => { if (sec.offsetTop <= scrollMid) activeId = sec.id; });
    links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${activeId}`));
    rafQueued = false;
  }

  highlightActive();
  window.addEventListener("scroll", () => {
    if (!rafQueued) { rafQueued = true; requestAnimationFrame(highlightActive); }
  }, { passive: true });
}

/* ─── 3D tilt on impact metrics ────────────────────────── */
function initMetricTilt() {
  document.querySelectorAll('.impact-metric').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.04)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─── Back button magnetic hover ───────────────────────── */
function initMagneticBack() {
  const btn = document.querySelector(".back-link");
  if (!btn) return;
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.18;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
}

/* ─── Init all ──────────────────────────────────────────── */
initCaseStudyHeroVisuals();
initCaseStudyImageZoom();
initCaseStudyGalleries();
initReadingProgress();
initMiniHeader();
initScrollReveal();
initImpactMetrics();
initToc();
initMagneticBack();
initMetricTilt();
initFloatingContact();

/* ─── Floating "Contact me" button on mobile ─────────────── */
function initFloatingContact() {
  if (window.innerWidth >= 768) return;

  const btn = document.createElement('a');
  btn.className = 'cs-float-contact';
  btn.href = '../../index.html#contact';
  btn.textContent = 'Contact me';
  document.documentElement.appendChild(btn);

  let lastY = window.scrollY;
  let visible = false;

  function update() {
    const currentY = window.scrollY;
    const scrollingUp = currentY < lastY;
    const pastHero = currentY > 200;

    if (scrollingUp && pastHero && !visible) {
      btn.classList.add('is-visible');
      visible = true;
    } else if ((!scrollingUp || !pastHero) && visible) {
      btn.classList.remove('is-visible');
      visible = false;
    }

    lastY = currentY;
  }

  window.addEventListener('scroll', update, { passive: true });
}
