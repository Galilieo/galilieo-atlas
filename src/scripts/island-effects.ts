import type { Cleanup } from './theme';

/** 控制心屿场景的轻量视差与可见性；视觉和动画均由内联 SVG/CSS 负责。 */
export function initIslandEffects(): Cleanup {
  const controller = document.querySelector<HTMLElement>('[data-island-controller]');
  const islandScene = controller?.querySelector<HTMLElement>('.island-scene');
  if (!controller || !islandScene) return () => {};

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  let sceneVisible = true;
  let pointerFrame = 0;
  let pointerClientX = 0;
  let pointerClientY = 0;

  const updateActiveState = () => {
    islandScene.dataset.sceneActive = String(
      sceneVisible && !document.hidden && !reducedMotion.matches,
    );
  };

  const resetPointer = () => {
    if (pointerFrame) {
      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
    }
    islandScene.style.setProperty('--island-shift-x', '0px');
    islandScene.style.setProperty('--island-shift-y', '0px');
    islandScene.style.setProperty('--island-pointer-x', '50%');
    islandScene.style.setProperty('--island-pointer-y', '54%');
  };

  const updatePointer = () => {
    pointerFrame = 0;
    const cardRect = controller.getBoundingClientRect();
    const sceneRect = islandScene.getBoundingClientRect();
    const cardX = (pointerClientX - cardRect.left) / cardRect.width - 0.5;
    const cardY = (pointerClientY - cardRect.top) / cardRect.height - 0.5;
    const sceneX = Math.min(
      94,
      Math.max(6, ((pointerClientX - sceneRect.left) / sceneRect.width) * 100),
    );
    const sceneY = Math.min(
      90,
      Math.max(28, ((pointerClientY - sceneRect.top) / sceneRect.height) * 100),
    );

    islandScene.style.setProperty('--island-shift-x', `${(cardX * 5).toFixed(2)}px`);
    islandScene.style.setProperty('--island-shift-y', `${(cardY * 3).toFixed(2)}px`);
    islandScene.style.setProperty('--island-pointer-x', `${sceneX.toFixed(1)}%`);
    islandScene.style.setProperty('--island-pointer-y', `${sceneY.toFixed(1)}%`);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!finePointer.matches || reducedMotion.matches) return;
    pointerClientX = event.clientX;
    pointerClientY = event.clientY;
    if (!pointerFrame) pointerFrame = window.requestAnimationFrame(updatePointer);
  };

  const onVisibilityChange = () => updateActiveState();
  const onMotionChange = () => {
    resetPointer();
    updateActiveState();
  };
  const onPointerCapabilityChange = () => {
    if (!finePointer.matches) resetPointer();
  };

  let visibilityObserver: IntersectionObserver | undefined;
  if ('IntersectionObserver' in window) {
    visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        sceneVisible = Boolean(entry?.isIntersecting);
        controller.classList.toggle('is-visible', sceneVisible);
        updateActiveState();
      },
      { rootMargin: '120px' },
    );
    visibilityObserver.observe(islandScene);
  } else {
    controller.classList.add('is-visible');
  }

  controller.addEventListener('pointermove', onPointerMove);
  controller.addEventListener('pointerleave', resetPointer);
  document.addEventListener('visibilitychange', onVisibilityChange);
  reducedMotion.addEventListener('change', onMotionChange);
  finePointer.addEventListener('change', onPointerCapabilityChange);
  updateActiveState();

  return () => {
    visibilityObserver?.disconnect();
    controller.removeEventListener('pointermove', onPointerMove);
    controller.removeEventListener('pointerleave', resetPointer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.removeEventListener('change', onMotionChange);
    finePointer.removeEventListener('change', onPointerCapabilityChange);
    resetPointer();
    controller.classList.remove('is-visible');
    islandScene.dataset.sceneActive = 'false';
  };
}
