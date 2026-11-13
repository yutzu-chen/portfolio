const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const animatedItems = document.querySelectorAll('.reveal, .section-intro, .project, .about > div, .contact > *, .case-preview');

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
  animatedItems.forEach((item) => observer.observe(item));
}
if (!('IntersectionObserver' in window) || reducedMotion.matches) {
  animatedItems.forEach((item) => item.classList.add('is-visible'));
}

const scenes = document.querySelectorAll('.scene');
const heroArt = document.querySelector('.hero-art');
let ticking = false;
function updateScrollMotion() {
  const height = window.innerHeight;
  scenes.forEach((scene, index) => {
    const bounds = scene.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > height) return;
    const progress = Math.max(-1, Math.min(1, (bounds.top + bounds.height / 2 - height / 2) / height));
    scene.style.setProperty('--scene-shift', `${progress * (index === 1 ? -18 : 18)}px`);
  });
  if (heroArt) heroArt.style.setProperty('--hero-shift', `${Math.min(window.scrollY * 0.09, 45)}px`);
  ticking = false;
}
function requestScrollUpdate() {
  if (!ticking && !reducedMotion.matches) {
    ticking = true;
    requestAnimationFrame(updateScrollMotion);
  }
}
window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate, { passive: true });
requestScrollUpdate();
if (reducedMotion.matches) updateScrollMotion();

const previewSlides = {
  invoice: [
    ['img/invoice_home.png', 'LINE Invoice home screen with spending overview and barcode', 'Home dashboard', 'Spending overview, barcode access, and a quick financial snapshot.'],
    ['img/invoice_scan.png', 'LINE Invoice scan screen', 'Invoice scan', 'A guided scan flow for first-time users.'],
    ['img/invoice_record.png', 'LINE Invoice records screen', 'Records', 'A simple view of past invoices.'],
    ['img/invoice_spending.png', 'LINE Invoice spending screen', 'Spending analysis', 'Category breakdowns help users understand their spending.'],
    ['img/invoice_details.png', 'LINE Invoice details screen', 'Invoice details', 'Invoice information in a clearer format.'],
    ['img/invoice_bingo.png', 'LINE Invoice bingo screen', 'Bingo feature', 'A playful reason to return.'],
  ],
  voc: [
    ['img/voc_dashboard.png', 'VoC dashboard with searchable review insights', 'Dashboard view', 'Searchable review insights by theme and sentiment.'],
    ['img/voc_chat.jpg', 'VoC AI chat interface', 'AI chat', 'Ask follow-up questions about customer feedback.'],
    ['img/voc_diagram.jpg', 'VoC system architecture diagram', 'System design', 'How feedback flows into structured insights.'],
  ],
  aiFilters: [
    ['img/ai_prompt.png', 'Prompt comparison workflow', 'Prompt comparison', 'Side-by-side evaluation of prompt versions.'],
    ['img/ai_dashboard.png', 'AI quality metrics dashboard', 'Quality dashboard', 'Metrics that track AI output accuracy after launch.'],
  ],
};

Object.entries(previewSlides).forEach(([name, slides]) => {
  const image = document.getElementById(`${name}PreviewImage`);
  const caption = document.getElementById(`${name}PreviewCaption`);
  const previous = document.getElementById(`${name}Prev`);
  const next = document.getElementById(`${name}Next`);
  if (!image || !caption || !previous || !next) return;
  let index = 0;
  function showSlide(offset) {
    index = (index + offset + slides.length) % slides.length;
    const [src, alt, title, description] = slides[index];
    image.src = src;
    image.alt = alt;
    caption.replaceChildren(Object.assign(document.createElement('strong'), { textContent: title }), document.createTextNode(description));
  }
  previous.addEventListener('click', () => showSlide(-1));
  next.addEventListener('click', () => showSlide(1));
});

const albumBoard = document.getElementById('albumBoard');
if (albumBoard) {
  const cards = Array.from(albumBoard.querySelectorAll('.album-card'));
  const originalPositions = cards.map((card) => ({
    left: parseFloat(card.style.left),
    top: parseFloat(card.style.top),
  }));
  let topLayer = 5;
  let activeDrag = null;

  function layoutAlbum() {
    const factor = Math.min(1, albumBoard.clientWidth / 485);
    cards.forEach((card, index) => {
      const maxLeft = Math.max(0, albumBoard.clientWidth - card.offsetWidth);
      card.style.left = `${Math.min(maxLeft, originalPositions[index].left * factor)}px`;
      card.style.top = `${originalPositions[index].top}px`;
    });
  }
  layoutAlbum();
  window.addEventListener('resize', layoutAlbum, { passive: true });

  cards.forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute('aria-label', `${card.querySelector('.album-card-title').textContent}. Move with arrow keys.`);
    card.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      card.setPointerCapture(event.pointerId);
      card.style.zIndex = String(++topLayer);
      activeDrag = { card, x: event.clientX, y: event.clientY, left: card.offsetLeft, top: card.offsetTop, moved: false };
    });
    card.addEventListener('pointermove', (event) => {
      if (!activeDrag || activeDrag.card !== card) return;
      const dx = event.clientX - activeDrag.x;
      const dy = event.clientY - activeDrag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) activeDrag.moved = true;
      card.style.left = `${Math.max(0, Math.min(albumBoard.clientWidth - card.offsetWidth, activeDrag.left + dx))}px`;
      card.style.top = `${Math.max(0, Math.min(albumBoard.clientHeight - card.offsetHeight, activeDrag.top + dy))}px`;
    });
    card.addEventListener('pointerup', () => {
      if (activeDrag && !activeDrag.moved && card.classList.contains('is-secret')) card.classList.add('is-revealed');
      activeDrag = null;
    });
    card.addEventListener('pointercancel', () => { activeDrag = null; });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        if (card.classList.contains('is-secret')) card.classList.add('is-revealed');
        return;
      }
      const moves = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
      if (!moves[event.key]) return;
      event.preventDefault();
      const [dx, dy] = moves[event.key];
      card.style.zIndex = String(++topLayer);
      card.style.left = `${Math.max(0, Math.min(albumBoard.clientWidth - card.offsetWidth, card.offsetLeft + dx))}px`;
      card.style.top = `${Math.max(0, Math.min(albumBoard.clientHeight - card.offsetHeight, card.offsetTop + dy))}px`;
    });
  });
}
