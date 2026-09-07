(() => {
  const stage = document.getElementById('drawing-stage');
  const artboard = document.getElementById('drawing-artboard');
  const current = document.getElementById('current-layer');
  const slider = document.getElementById('comparison-range');
  const variantSelect = document.getElementById('variant-select');
  const lens = document.getElementById('magnifier');
  const lensButton = document.getElementById('lens-button');
  const lensStatus = document.getElementById('lens-status');
  const fullscreenButton = document.getElementById('comparison-fullscreen');
  const modeButtons = [...document.querySelectorAll('[data-mode]')];
  const variants = {
    light: 'assets/images/soucasny-rez-white.png',
    dark: 'assets/images/soucasny-rez.png'
  };
  const sources = {
    current: variants.light,
    history: 'assets/images/historicky-podklad.png'
  };

  let mode = 'fade';
  let lensMode = 'current';
  let lastPointer = null;

  function applyComparison() {
    const value = Number(slider.value);
    current.style.opacity = mode === 'fade' ? value / 100 : 1;
    current.style.clipPath = mode === 'wipe' ? `inset(0 ${100 - value}% 0 0)` : 'none';
  }

  function setMode(nextMode) {
    mode = nextMode;
    modeButtons.forEach((button) => {
      const active = button.dataset.mode === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    applyComparison();
  }

  function setLensMode(nextMode) {
    lensMode = nextMode;
    const labels = {
      current: 'Průhled: současnost · měřítko 1:1',
      history: 'Průhled: historie · měřítko 1:1',
      off: 'Průhled: vypnutý'
    };
    lensStatus.textContent = labels[lensMode];
    lensButton.setAttribute('aria-label', labels[lensMode]);
    stage.classList.toggle('lens-off', lensMode === 'off');
    if (lensMode === 'off') {
      lens.style.display = 'none';
    } else {
      lens.style.backgroundImage = `url("${sources[lensMode]}")`;
      if (lastPointer) positionLens(lastPointer);
    }
  }

  function cycleLens() {
    setLensMode(lensMode === 'current' ? 'history' : lensMode === 'history' ? 'off' : 'current');
  }

  function setVariant(variant) {
    const source = variants[variant] || variants.light;
    sources.current = source;
    current.src = source;
    current.alt = variant === 'dark'
      ? 'Současný řez a půdorys z mračna bodů na tmavém pozadí'
      : 'Současný řez a půdorys z mračna bodů na bílém pozadí';
    if (lensMode === 'current') lens.style.backgroundImage = `url("${source}")`;
  }

  function positionLens(event) {
    if (lensMode === 'off') return;
    const rect = artboard.getBoundingClientRect();
    const x = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
    const y = Math.min(rect.height, Math.max(0, event.clientY - rect.top));
    const size = lens.offsetWidth || 170;
    const half = size / 2;

    lens.style.display = 'block';
    lens.style.left = `${x - half}px`;
    lens.style.top = `${y - half}px`;
    lens.style.backgroundSize = `${rect.width}px ${rect.height}px`;
    lens.style.backgroundPosition = `${half - x}px ${half - y}px`;
  }

  modeButtons.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
  slider.addEventListener('input', applyComparison);
  variantSelect.addEventListener('change', () => setVariant(variantSelect.value));
  lensButton.addEventListener('click', cycleLens);
  artboard.addEventListener('click', cycleLens);
  artboard.addEventListener('pointermove', (event) => {
    lastPointer = event;
    positionLens(event);
  });
  artboard.addEventListener('pointerleave', () => { lens.style.display = 'none'; });

  fullscreenButton.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stage.requestFullscreen();
    } catch (error) {
      console.warn('Fullscreen není v tomto prohlížeči dostupný.', error);
    }
  });
  document.addEventListener('fullscreenchange', () => {
    fullscreenButton.textContent = document.fullscreenElement ? '×' : '⛶';
    fullscreenButton.setAttribute('aria-label', document.fullscreenElement ? 'Ukončit celou obrazovku' : 'Zobrazit přes celou obrazovku');
  });

  applyComparison();
  setVariant(variantSelect.value);
  setLensMode('current');
})();
