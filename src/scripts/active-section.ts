import type { Cleanup } from './theme';
import { isNavigationPathActive } from '../config/site';

/** 在 Astro 页面切换后同步当前主路由及其详情页的导航状态。 */
export function initActiveSection(): Cleanup {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.site-nav a'));
  if (links.length === 0) return () => {};

  const currentPath = window.location.pathname;
  links.forEach((link) => {
    const isActive = isNavigationPathActive(link.getAttribute('href') ?? '', currentPath);
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  return () => {};
}
