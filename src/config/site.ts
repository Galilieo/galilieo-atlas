const navigationAliases: Readonly<Record<string, readonly string[]>> = {
  '/blog': ['/blog', '/notes'],
};

const normalizePath = (path: string) => (path === '/' ? path : path.replace(/\/+$/, ''));

/** 将详情路由归入对应的主导航栏目。 */
export function isNavigationPathActive(itemHref: string, currentPath: string) {
  const itemPath = normalizePath(itemHref);
  const path = normalizePath(currentPath);
  if (itemPath === '/') return path === '/';
  const prefixes = navigationAliases[itemPath] ?? [itemPath];
  return prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export const siteConfig = {
  name: 'Galilieo Atlas',
  title: 'Galilieo Atlas — Works, Notes & Explorations',
  description:
    '我是 Galilieo，软件工程专业的学生，也在做 AI 产品开发。这里放着我的项目、开发笔记和一些日常记录。',
  url: 'https://galilieo.cn',
  email: 'jiangdavis021@gmail.com',
  qqEmail: '2930382766@qq.com',
  github: 'https://github.com/Galilieo',
  githubUsername: 'Galilieo',
  heartIsland: 'https://heart-island.cn',
  defaultSeoImage: '/images/galilieo-header.jpg',
  author: {
    name: 'Galilieo',
    location: 'Shanghai, China',
    role: 'AI 应用开发者 / 软件工程学生',
  },
  homeStatus: {
    timeZone: 'Asia/Shanghai',
    latitude: 31.2304,
    longitude: 121.4737,
  },
  navigation: [
    { label: '首页', href: '/' },
    { label: '项目', href: '/projects' },
    { label: '博客', href: '/blog' },
    { label: '归档', href: '/archive' },
    { label: '关于', href: '/about' },
  ],
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/Galilieo' },
    { label: '心屿', href: 'https://heart-island.cn' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
