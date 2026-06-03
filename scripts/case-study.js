function initCaseStudyHeroVisuals() {
  const visuals = document.querySelectorAll("[data-hero-visual]");

  visuals.forEach((heroVisual) => {
    let ticking = false;

    function updateHeroVisual() {
      const rect = heroVisual.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const progress = 1 - Math.min(Math.max(rect.top / (viewportHeight * 0.9), 0), 1);
      const scale = 1.03 + progress * 0.11;

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

function initCaseStudyGalleries() {
  const galleries = document.querySelectorAll("[data-case-gallery]");

  galleries.forEach((gallery) => {
    const image = gallery.querySelector("[data-gallery-image]");
    const caption = gallery.querySelector("[data-gallery-caption]");
    const prev = gallery.querySelector("[data-gallery-prev]");
    const next = gallery.querySelector("[data-gallery-next]");
    const dataNode = gallery.querySelector(".case-gallery-data");

    if (!image || !caption || !prev || !next || !dataNode) return;

    let slides;
    try {
      slides = JSON.parse(dataNode.textContent);
    } catch (error) {
      console.error("Failed to parse case gallery data", error);
      return;
    }

    if (!Array.isArray(slides) || slides.length === 0) return;

    let galleryIndex = 0;
    let activeTimer = null;

    function renderSlide(index) {
      galleryIndex = (index + slides.length) % slides.length;
      const slide = slides[galleryIndex];
      image.src = slide.src;
      image.alt = slide.alt;
      caption.innerHTML = `<strong>${slide.title}</strong>${slide.desc}`;
    }

    function pulseGallery() {
      gallery.classList.add("is-active");
      window.clearTimeout(activeTimer);
      activeTimer = window.setTimeout(() => {
        gallery.classList.remove("is-active");
      }, 900);
    }

    gallery.classList.add("is-ready");
    renderSlide(0);

    prev.addEventListener("click", () => {
      renderSlide(galleryIndex - 1);
      pulseGallery();
    });

    next.addEventListener("click", () => {
      renderSlide(galleryIndex + 1);
      pulseGallery();
    });
  });
}

function initReadingProgress() {
  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  document.body.prepend(bar);

  function update() {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${docH > 0 ? scrollTop / docH : 0})`;
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initToc() {
  // Collect sections that have IDs
  const sections = Array.from(document.querySelectorAll('.section[id]'));
  if (sections.length === 0) return;

  // Build aside
  const aside = document.createElement('aside');
  aside.className = 'case-toc';

  const label = document.createElement('span');
  label.className = 'toc-label';
  label.textContent = 'On this page';
  aside.appendChild(label);

  const ul = document.createElement('ul');
  ul.className = 'toc-list';

  sections.forEach((sec) => {
    const heading = sec.querySelector('.section-title');
    if (!heading) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'toc-link';
    a.href = `#${sec.id}`;
    a.textContent = heading.textContent.trim();
    li.appendChild(a);
    ul.appendChild(li);
  });

  aside.appendChild(ul);

  // Wrap content + aside in a layout div
  const content = document.querySelector('.content');
  if (!content) return;

  const layout = document.createElement('div');
  layout.className = 'content-layout';
  content.parentNode.insertBefore(layout, content);
  layout.appendChild(content);
  layout.appendChild(aside);

  // Highlight active section on scroll
  const links = Array.from(ul.querySelectorAll('.toc-link'));
  let rafQueued = false;

  function highlightActive() {
    const scrollMid = window.scrollY + window.innerHeight * 0.35;
    let activeId = sections[0].id;

    sections.forEach((sec) => {
      if (sec.offsetTop <= scrollMid) activeId = sec.id;
    });

    links.forEach((a) => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${activeId}`);
    });
    rafQueued = false;
  }

  highlightActive();
  window.addEventListener('scroll', () => {
    if (!rafQueued) {
      rafQueued = true;
      requestAnimationFrame(highlightActive);
    }
  }, { passive: true });
}

initCaseStudyHeroVisuals();
initCaseStudyGalleries();
initReadingProgress();
initToc();
