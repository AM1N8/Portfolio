// lib/rmrf.ts

const originalStyles = new Map<HTMLElement, string>();
let destructionInterval: number | null = null;
let targets: HTMLElement[] = [];

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function startDestruction(): void {
  // Collect all visible semantic elements on the page OUTSIDE the terminal panel
  const rawElements = Array.from(
    document.querySelectorAll(
      'nav, h1, h2, h3, p, img, a, section, article, footer'
    )
  ) as HTMLElement[];

  const safeElements = rawElements.filter(el => {
    return !el.closest('[role="dialog"]') && !el.closest('#rm-overlay');
  });

  targets = shuffle(safeElements);
  let currentIndex = 0;

  destructionInterval = window.setInterval(() => {
    if (currentIndex >= targets.length) {
      if (destructionInterval) clearInterval(destructionInterval);
      return;
    }

    const el = targets[currentIndex];
    
    if (!originalStyles.has(el)) {
      originalStyles.set(el, el.getAttribute('style') || '');
    }

    const styleType = Math.floor(Math.random() * 4);

    switch (styleType) {
      case 0:
        el.style.transition = 'all 0.3s ease';
        el.style.opacity = '0';
        el.style.filter = 'blur(8px)';
        el.style.transform = 'translateX(' + (Math.random() * 40 - 20) + 'px)';
        break;
      case 1:
        el.style.transition = 'all 0.25s ease';
        el.style.transform = 'scaleY(0)';
        el.style.opacity = '0';
        el.style.transformOrigin = 'top';
        break;
      case 2:
        el.style.transition = 'all 0.3s ease';
        el.style.transform = 'translateX(' + (Math.random() > 0.5 ? '120%' : '-120%') + ')';
        el.style.opacity = '0';
        break;
      case 3:
        el.style.transition = 'all 0.35s ease';
        el.style.transform = `scale(0.1) rotate(${Math.random() * 30 - 15}deg)`;
        el.style.opacity = '0';
        el.style.filter = 'blur(4px)';
        break;
    }

    currentIndex++;
  }, 35);

  if (!document.getElementById('rm-overlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'rm-overlay';
    document.body.appendChild(overlay);
  }
}

export function restoreAll(): void {
  if (destructionInterval) {
    clearInterval(destructionInterval);
    destructionInterval = null;
  }

  originalStyles.forEach((originalStyle, el) => {
    el.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    // Force DOM reflow to ensure transition runs before setting to original style properties
    requestAnimationFrame(() => {
       el.style.opacity = '1';
       el.style.transform = 'none';
       el.style.filter = 'none';
       setTimeout(() => {
         el.setAttribute('style', originalStyle);
       }, 500);
    });
  });

  originalStyles.clear();
  targets = [];

  const overlay = document.getElementById('rm-overlay');
  if (overlay) {
    overlay.remove();
  }
}
