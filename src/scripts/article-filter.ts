import type { Cleanup } from './theme';

/** 为博客列表启用单选 Tag 筛选；无脚本时筛选条隐藏并保留全部文章。 */
export function initArticleFilters(): Cleanup {
  const filters = Array.from(document.querySelectorAll<HTMLElement>('[data-article-filter]'));
  if (filters.length === 0) return () => {};

  const cleanups = filters.map((filter) => {
    const page = filter.closest<HTMLElement>('.interior-page--blog');
    const buttons = Array.from(
      filter.querySelectorAll<HTMLButtonElement>('[data-article-filter-value]'),
    );
    const cards = Array.from(page?.querySelectorAll<HTMLElement>('[data-article-card]') ?? []);
    const status = filter.querySelector<HTMLElement>('[data-article-filter-status]');
    const tagsByCard = new Map(
      cards.map((card) => {
        try {
          return [card, JSON.parse(card.dataset.articleTags ?? '[]') as string[]] as const;
        } catch {
          return [card, [] as string[]] as const;
        }
      }),
    );

    const selectTag = (tag: string) => {
      let visibleCount = 0;
      cards.forEach((card) => {
        const isVisible = tag === '*' || tagsByCard.get(card)?.includes(tag);
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });
      buttons.forEach((button) => {
        const isActive = button.dataset.articleFilterValue === tag;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
      if (status) {
        status.textContent =
          tag === '*'
            ? `显示全部 ${cards.length} 篇文章`
            : `${tag} · ${visibleCount} / ${cards.length} 篇文章`;
      }
    };

    const listeners = buttons.map((button) => {
      const onClick = () => selectTag(button.dataset.articleFilterValue ?? '*');
      button.addEventListener('click', onClick);
      return () => button.removeEventListener('click', onClick);
    });

    filter.classList.add('is-enhanced');
    selectTag('*');

    return () => {
      listeners.forEach((dispose) => dispose());
      cards.forEach((card) => card.removeAttribute('hidden'));
      filter.classList.remove('is-enhanced');
    };
  });

  return () => cleanups.reverse().forEach((dispose) => dispose());
}
