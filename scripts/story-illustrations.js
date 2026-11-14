/* Small SVG scenes drawn in code. Each moving piece stays a separate SVG group. */
(() => {
  const BLUE = '#14213D';
  const ORANGE = '#FCA311';
  const GREY = '#E5E5E5';
  const WHITE = '#FFFFFF';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const sharedPaper = (name) => `
    <defs>
      <clipPath id="${name}-paper-clip"><path d="M30 26 Q54 23 80 25 L126 23 Q157 25 181 24 L273 26 Q300 25 307 42 L306 168 Q302 190 282 190 L70 192 Q34 190 28 175 Z"/></clipPath>
      <pattern id="${name}-grain" width="29" height="23" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="6" r=".55" fill="${BLUE}" opacity=".14"/>
        <circle cx="18" cy="17" r=".45" fill="${BLUE}" opacity=".1"/>
        <path d="M24 5l2 1" stroke="${BLUE}" stroke-width=".5" opacity=".1"/>
      </pattern>
    </defs>
    <path d="M30 26 Q54 23 80 25 L126 23 Q157 25 181 24 L273 26 Q300 25 307 42 L306 168 Q302 190 282 190 L70 192 Q34 190 28 175 Z" fill="${WHITE}" stroke="${GREY}" stroke-width="1.5"/>
    <path d="M20 44 L65 41 L62 52 L19 55 Z" fill="${ORANGE}" opacity=".32" transform="rotate(-7 42 47)"/>
    <path d="M30 27h278v166H30z" fill="url(#${name}-grain)" clip-path="url(#${name}-paper-clip)"/>
  `;

  function analyticsSVG() {
    return `<svg class="story-svg analytics-svg" viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${sharedPaper('analytics')}
      <defs><pattern id="analytics-hatch" width="12" height="13" patternUnits="userSpaceOnUse"><path d="M2 10l3-2m4-5 2-1" fill="none" stroke="${BLUE}" stroke-width=".7" opacity=".25"/></pattern></defs>
      <g class="analytics-pencil-marks" fill="none" stroke="${BLUE}" stroke-width="1.2" stroke-linecap="round" opacity=".36">
        <path d="M48 83l-4-2m5 43-5 1m5 41-4 2M86 174l2 4m39-5 1 4m40-5-1 5m41-5 2 4m42-4 1 4"/>
        <path d="M270 42q10-4 17 2m-14 5q8-3 15 1"/>
      </g>
      <text x="52" y="48" class="story-hand">look closer...</text>
      <g fill="none" stroke="${BLUE}" stroke-width="1.1" stroke-linecap="round" opacity=".68">
        <path d="M45 56l-4-5m-1 11-5-1m13 0 2-6M286 157l5-5m-4 12 8 1"/>
        <path d="M118 64q4-4 7 0m-5 6q5-3 8 0M291 111q5-5 10 0m-7 4 5 1"/>
      </g>
      <g class="analytics-axes" fill="none" stroke="${BLUE}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
        <path d="M54 73 Q53 117 55 169 Q123 171 177 169 Q231 171 272 167"/>
        <path d="M49 75q4-3 8-1M270 165q5 3 8 1" opacity=".45"/>
      </g>
      <g class="analytics-bars" fill="${GREY}" stroke="${BLUE}" stroke-width="1.65" stroke-linejoin="round">
        ${[0, 1, 2, 3, 4].map((index) => `<g data-bar-group="${index}"><path data-bar="${index}" d=""/><path data-bar-texture="${index}" d="" fill="url(#analytics-hatch)" stroke="none"/></g>`).join('')}
      </g>
      <g class="analytics-trend" fill="none" stroke="${ORANGE}" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round">
        <path data-trend d="M70 99 Q90 91 108 93 T150 81 Q174 75 185 77 T225 56 Q242 47 263 48"/>
        <path d="M254 45q6 0 9 3l-2 8"/>
      </g>
      <g data-lens class="analytics-lens" fill="none" stroke="${BLUE}" stroke-linecap="round" stroke-linejoin="round">
        <path d="M-20-1 Q-19-20-2-21 Q18-20 20-1 Q21 17 2 19 Q-18 19-20-1Z" fill="${WHITE}" fill-opacity=".55" stroke-width="2"/>
        <path d="M-17-5Q-14-17-4-18M15 13l17 20q4 5 8 2 3-3-1-8L21 11" stroke-width="2.5"/>
        <path d="M-4 0q4-3 9-1" stroke-width="1" opacity=".55"/>
      </g>
      <g data-insight class="analytics-insight" fill="none" stroke="${ORANGE}" stroke-width="1.6" stroke-linecap="round">
        <path d="M237 107l4-6m4 10 7-1m-12 7 4 5"/>
        <path d="M280 132l2-6m6 8 5-2"/>
        <text x="251" y="149" class="story-hand story-hand-orange" stroke="none">aha!</text>
      </g>
      <text x="184" y="208" class="story-hand story-hand-small">find the pattern!</text>
    </svg>`;
  }

  function listeningSVG() {
    return `<svg class="story-svg listening-svg" viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${sharedPaper('listening')}
      <g class="listen-bubble listen-bubble-one" stroke="${BLUE}" stroke-linecap="round" stroke-linejoin="round">
        <path d="M46 66 Q46 49 67 46 Q100 42 144 47 Q161 48 164 66 L163 98 Q159 111 145 112 L105 111 Q94 120 78 125 L83 111 Q48 111 46 94 Z" fill="${WHITE}" stroke-width="1.9"/>
        <path d="M64 65q18-2 43 0m-42 12q29-2 69 0M65 88q21-1 37 1" fill="none" stroke-width="1.3" opacity=".75"/>
        <circle cx="132" cy="91" r="2.2" fill="${ORANGE}" stroke="none"/>
      </g>
      <g class="listen-bubble listen-bubble-two" stroke="${BLUE}" stroke-linecap="round" stroke-linejoin="round">
        <path d="M185 43 Q218 35 268 43 Q292 46 294 65 Q298 83 285 92 Q271 102 231 98 L213 111 L215 98 Q188 99 181 84 Q175 62 185 43Z" fill="${GREY}" stroke-width="1.8"/>
        <path d="M202 58q23-3 58 0m-55 12q29-1 67 1m-68 10q19-2 34 0" fill="none" stroke-width="1.2" opacity=".7"/>
      </g>
      <g class="listen-arrows" fill="none" stroke="${BLUE}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <path class="listen-arrow" pathLength="100" d="M113 117 Q108 134 92 140 M88 134l4 6 7-4"/>
        <path class="listen-arrow second" pathLength="100" d="M225 106 Q193 132 170 142 M164 136l6 6 6-3"/>
      </g>
      <g class="listen-note listen-note-one" stroke="${BLUE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M56 143 Q75 137 110 140 L114 174 Q83 177 58 173 Z" fill="${ORANGE}"/>
        <path d="M69 152q13-2 26 0m-26 9 19-1" fill="none" stroke-width="1.1"/>
      </g>
      <g class="listen-note listen-note-two" stroke="${BLUE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M132 139 Q157 135 183 140 L180 176 Q154 174 133 178 Z" fill="${GREY}"/>
        <path d="M143 151q16-2 29-1m-29 10q13-1 20 1" fill="none" stroke-width="1.1"/>
      </g>
      <g class="listen-note listen-note-three" stroke="${BLUE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M205 145 Q226 139 254 144 L257 176 Q232 181 207 177 Z" fill="${WHITE}"/>
        <path d="M217 154q16-3 27-1m-25 11q14-2 23 0" fill="none" stroke-width="1.1"/>
        <path d="M248 144l7 7" stroke="${ORANGE}" stroke-width="2.4"/>
      </g>
      <g class="listen-bulb" stroke="${BLUE}" stroke-linecap="round" stroke-linejoin="round">
        <path class="listen-bulb-core" d="M277 120 Q267 112 269 99 Q271 85 284 84 Q298 84 301 97 Q303 110 292 119 L291 126 L279 126Z" fill="${WHITE}" stroke-width="1.7"/>
        <path d="M279 131q6 2 13 0m-11 5 10-1M283 111l2 8 3-8" fill="none" stroke-width="1.3"/>
      </g>
      <g class="listen-rays" fill="none" stroke="${ORANGE}" stroke-width="1.8" stroke-linecap="round"><path d="M284 76l-1-8m17 14 7-6m-4 22 9-1m-42-14-5-6"/></g>
      <g class="listen-doodles" fill="none" stroke="${BLUE}" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
        <path d="M37 113l-5-3m6 11-6 1M299 159l4-5m2 12 6 1M121 183q4-4 8 0m-7 5q4-3 7 0"/>
        <path d="M40 36l2-7 2 7 7 2-7 2-2 7-2-7-7-2ZM296 41l2-5 2 5 5 2-5 1-2 5-2-5-5-1Z"/>
      </g>
      <text x="67" y="203" class="story-hand story-hand-small">listen</text><text x="145" y="203" class="story-hand story-hand-small">sort</text><text x="218" y="203" class="story-hand story-hand-small">find the idea</text>
    </svg>`;
  }

  function prototypeSVG() {
    return `<svg class="story-svg prototype-svg" viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${sharedPaper('prototype')}
      <g class="proto-wireframe" fill="none" stroke="${BLUE}" stroke-linecap="round" stroke-linejoin="round">
        <path class="proto-sketch-line" pathLength="100" d="M53 54 Q82 49 139 52 L141 160 Q98 163 54 159 Z" fill="${WHITE}" stroke-width="1.7"/>
        <path class="proto-sketch-line" pathLength="100" d="M63 66q28-3 65 0m-64 7q19-2 34 0M65 88q26-4 60 0l-2 24q-31 3-59 0ZM64 123q18-2 25 0l-1 22q-14 1-24-1Zm33 0q15-3 28 0v22q-16 1-28 0Z" stroke-width="1.2"/>
        <path d="M61 155q10 2 20 0m36 0 14-1" stroke-width=".9" opacity=".5"/>
      </g>
      <g class="proto-pencil-motion"><g class="proto-pencil" stroke="${BLUE}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" transform="translate(84 128) rotate(26)">
        <path d="M-5-32q4-3 9 0L5 7-1 20-7 7Z" fill="${ORANGE}"/>
        <path d="M-7 7q5 3 12 0M-1 20l-2 6-4-6M-4-28q4 1 8 0" fill="none"/>
      </g></g>
      <g class="proto-arrow" fill="none" stroke="${BLUE}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path class="proto-arrow-line" pathLength="100" d="M153 112 Q177 84 195 104 M186 97l9 7-8 5"/>
      </g>
      <g class="proto-product" stroke="${BLUE}" stroke-linecap="round" stroke-linejoin="round">
        <g transform="rotate(5 245 105)">
          <g class="proto-phone">
            <path d="M207 37 Q237 32 273 36 Q285 38 286 49 L286 155 Q285 169 275 171 Q239 174 208 169 Q200 167 199 155 L198 51 Q199 40 207 37Z" fill="${BLUE}" stroke-width="1.8"/>
            <path d="M207 49 Q239 45 278 49 L278 156 Q246 160 207 156Z" fill="${WHITE}" stroke="${WHITE}" stroke-width="1"/>
            <path d="M230 43q11-1 21 0m9 0h2" fill="none" stroke="${WHITE}" stroke-width="1.1"/>
            <path d="M216 58q22-2 53 0m-53 7q16-1 29 0" fill="none" stroke-width="1.2"/>
            <path class="proto-ui-highlight" d="M213 75q29-3 60 0l-1 28q-28 2-59 0Z" fill="${ORANGE}" stroke-width=".9"/>
            <path d="M220 84q9-1 16 0m-16 6q14-1 23 0m-22 6q8-1 14 0" fill="none" stroke="${WHITE}" stroke-width="1.3"/>
            <path d="M258 82q8-1 9 6 1 7-7 8-7 0-8-6-1-7 6-8Z" fill="${WHITE}" stroke-width="1"/>
            <g class="proto-ui-card proto-ui-card-one"><path d="M213 110q12-2 26 0v25q-14 2-26 0Z" fill="${GREY}" stroke-width="1"/><path d="M218 116q8-1 15 0m-15 6 12 1" fill="none" stroke-width=".9"/></g>
            <g class="proto-ui-card proto-ui-card-two"><path d="M246 109q15-2 27 0l-1 25q-14 2-26 0Z" fill="${GREY}" stroke-width="1"/><path d="M252 116q9-1 15 0m-15 7 12-1" fill="none" stroke-width=".9"/></g>
            <g class="proto-ui-card proto-ui-card-three"><path d="M214 143q29-2 58 0" fill="none" stroke-width="1.3"/><path d="M215 150q19-1 37 0" fill="none" stroke-width="1"/></g>
            <path d="M231 164q12 1 23 0" fill="none" stroke="${WHITE}" stroke-width="1.3"/>
          </g>
        </g>
      </g>
      <g class="proto-sparkles" fill="none" stroke="${ORANGE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M303 73l2-7 2 7 7 2-7 2-2 8-2-8-7-2ZM186 48l2-5 2 5 5 1-5 2-2 5-2-5-5-2Z"/>
        <path d="M296 99l6-1m-2 12 5 3M176 67l-5-3"/>
      </g>
      <g fill="none" stroke="${BLUE}" stroke-width="1.1" stroke-linecap="round" opacity=".65"><path d="M46 117l-6-3m5 10-5 1M113 43q5-4 9 0m-8 6q5-2 9 0M289 179q6-2 11 1"/></g>
      <text x="58" y="202" class="story-hand story-hand-small">rough idea</text><text x="211" y="202" class="story-hand story-hand-small">ready to try</text>
    </svg>`;
  }

  function smooth(value) {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
  }

  function mix(from, to, amount) {
    return from + (to - from) * amount;
  }

  // Redrawing the path changes its actual height. No scaled bar images are used.
  function barPath(x, width, bottom, height, seed) {
    const top = bottom - height;
    const lean = [-2, 1.5, -1, 2, -.5][seed];
    const tilt = [1, 3, -1, 2, -2][seed];
    return `M${x} ${bottom} C${x - 1.8} ${bottom - height * .3} ${x + 1.5} ${top + 14} ${x + lean} ${top + 3}
      Q${x + width * .19} ${top - 2.5} ${x + width * .47} ${top + 1}
      Q${x + width * .76} ${top + tilt} ${x + width} ${top + tilt + 1}
      C${x + width + 1.7} ${top + 16} ${x + width - 2} ${bottom - height * .3} ${x + width} ${bottom - 1}
      Q${x + width * .44} ${bottom + 1.8} ${x} ${bottom}Z`;
  }

  function startAnalytics(scene) {
    const bars = [...scene.querySelectorAll('[data-bar]')];
    const textures = [...scene.querySelectorAll('[data-bar-texture]')];
    const lens = scene.querySelector('[data-lens]');
    const trend = scene.querySelector('[data-trend]');
    const insight = scene.querySelector('[data-insight]');
    const trendLength = trend.getTotalLength();
    const samples = [
      [45, 66, 49, 82, 60],
      [63, 42, 75, 57, 79],
      [53, 73, 55, 94, 65],
    ];
    const xPositions = [68, 105, 148, 185, 226];
    const widths = [21, 26, 20, 24, 22];
    const duration = 6600;
    let frame = 0;
    let start = 0;
    let playing = false;
    let inView = !('IntersectionObserver' in window);

    function render(elapsed) {
      const t = elapsed % duration;
      const values = bars.map((_, index) => {
        const delay = index * 125;
        const grow = smooth((t - delay) / 680);
        let value = mix(4, samples[0][index], grow);
        value = mix(value, samples[1][index], smooth((t - 1140 - index * 45) / 800));
        value = mix(value, samples[2][index], smooth((t - 2480 - (4 - index) * 45) / 820));
        value = mix(value, 4, smooth((t - 6080 - index * 35) / 470));
        return Math.max(4, value);
      });
      bars.forEach((bar, index) => {
        const shape = barPath(xPositions[index], widths[index], 169, values[index], index);
        bar.setAttribute('d', shape);
        textures[index].setAttribute('d', shape);
        bar.setAttribute('fill', index === 3 && t > 3600 && t < 5850 ? ORANGE : index % 2 ? WHITE : GREY);
      });
      const inspect = smooth((t - 3370) / 850) * (1 - smooth((t - 5500) / 600));
      lens.setAttribute('transform', `translate(${mix(276, 202, inspect)} ${mix(63, 86, inspect)}) rotate(${mix(-11, 6, inspect)})`);
      const draw = smooth((t - 3670) / 780) * (1 - smooth((t - 5590) / 600));
      trend.style.strokeDasharray = `${trendLength} ${trendLength}`;
      trend.style.strokeDashoffset = String(trendLength * (1 - draw));
      insight.style.opacity = String(smooth((t - 3800) / 400) * (1 - smooth((t - 5570) / 400)));
    }

    function tick(now) {
      if (!playing) return;
      if (!start) start = now;
      render(now - start);
      frame = requestAnimationFrame(tick);
    }

    function play() {
      if (playing || reducedMotion.matches) return;
      playing = true;
      start = 0;
      frame = requestAnimationFrame(tick);
    }

    function pause() {
      playing = false;
      cancelAnimationFrame(frame);
    }

    function still() {
      pause();
      bars.forEach((bar, index) => {
        const shape = barPath(xPositions[index], widths[index], 169, samples[2][index], index);
        bar.setAttribute('d', shape);
        textures[index].setAttribute('d', shape);
        bar.setAttribute('fill', index === 3 ? ORANGE : index % 2 ? WHITE : GREY);
      });
      lens.setAttribute('transform', 'translate(202 86) rotate(6)');
      trend.style.strokeDasharray = `${trendLength} ${trendLength}`;
      trend.style.strokeDashoffset = '0';
      insight.style.opacity = '1';
    }

    still();
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting;
          if (inView && !reducedMotion.matches) play();
          else pause();
        });
      }, { threshold: .15 });
      observer.observe(scene);
    } else if (!reducedMotion.matches) {
      play();
    }
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) still();
      else if (inView) play();
    });
  }

  document.querySelectorAll('[data-illustration="analytics"]').forEach((scene) => {
    scene.innerHTML = analyticsSVG();
    startAnalytics(scene);
  });

  const loopingScenes = [
    ['listening', listeningSVG],
    ['prototype', prototypeSVG],
  ];
  const loopObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-playing', entry.isIntersecting && !reducedMotion.matches);
    });
  }, { threshold: .15 }) : null;
  loopingScenes.forEach(([name, createSVG]) => {
    document.querySelectorAll(`[data-illustration="${name}"]`).forEach((scene) => {
      scene.innerHTML = createSVG();
      if (loopObserver) loopObserver.observe(scene);
      else if (!reducedMotion.matches) scene.classList.add('is-playing');
    });
  });
  reducedMotion.addEventListener('change', () => {
    document.querySelectorAll('[data-illustration="listening"], [data-illustration="prototype"]').forEach((scene) => {
      const bounds = scene.getBoundingClientRect();
      scene.classList.toggle('is-playing', !reducedMotion.matches && bounds.bottom > 0 && bounds.top < window.innerHeight);
    });
  });
})();
