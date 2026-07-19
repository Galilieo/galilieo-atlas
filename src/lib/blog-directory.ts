import type { CollectionEntry } from 'astro:content';

export type BlogArticle = CollectionEntry<'blog'>;

export interface BlogCategorySummary {
  name: string;
  id: string;
  count: number;
}

export interface BlogCategoryGroup extends BlogCategorySummary {
  articles: BlogArticle[];
}

export interface BlogTagSummary {
  name: string;
  count: number;
}

export function sortBlogArticles(articles: BlogArticle[]): BlogArticle[] {
  return [...articles].sort((articleA, articleB) =>
    (articleB.data.publishedAt ?? '').localeCompare(articleA.data.publishedAt ?? ''),
  );
}

export function getPublishedBlogArticles(articles: BlogArticle[]): BlogArticle[] {
  return sortBlogArticles(
    articles.filter((article) => !article.data.draft && Boolean(article.data.publishedAt)),
  );
}

export function getRecommendedBlogArticles(
  articles: BlogArticle[],
  currentArticle: BlogArticle,
  limit = 3,
): BlogArticle[] {
  const currentTags = new Set(currentArticle.data.tags);
  const safeLimit = Math.max(0, Math.trunc(limit));

  return getPublishedBlogArticles(articles)
    .filter((article) => article.id !== currentArticle.id)
    .map((article) => ({
      article,
      sameCategory: Number(article.data.category === currentArticle.data.category),
      sharedTagCount: article.data.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .sort(
      (candidateA, candidateB) =>
        candidateB.sameCategory - candidateA.sameCategory ||
        candidateB.sharedTagCount - candidateA.sharedTagCount ||
        (candidateB.article.data.publishedAt ?? '').localeCompare(
          candidateA.article.data.publishedAt ?? '',
        ) ||
        candidateA.article.id.localeCompare(candidateB.article.id),
    )
    .slice(0, safeLimit)
    .map(({ article }) => article);
}

export function getBlogCategoryId(category: string): string {
  const slug = category
    .trim()
    .normalize('NFKC')
    .toLocaleLowerCase('zh-CN')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  return `category-${slug || 'notes'}`;
}

export function createBlogCategoryGroups(articles: BlogArticle[]): BlogCategoryGroup[] {
  const categoryArticles = new Map<string, BlogArticle[]>();

  for (const article of sortBlogArticles(articles)) {
    const category = article.data.category;
    categoryArticles.set(category, [...(categoryArticles.get(category) ?? []), article]);
  }

  return [...categoryArticles.entries()]
    .map(([name, groupedArticles]) => ({
      name,
      id: getBlogCategoryId(name),
      count: groupedArticles.length,
      articles: groupedArticles,
    }))
    .sort(
      (groupA, groupB) =>
        groupB.count - groupA.count || groupA.name.localeCompare(groupB.name, 'zh-CN'),
    );
}

export function getBlogCategorySummaries(articles: BlogArticle[]): BlogCategorySummary[] {
  return createBlogCategoryGroups(articles).map(({ name, id, count }) => ({ name, id, count }));
}

export function getBlogTagSummaries(articles: BlogArticle[]): BlogTagSummary[] {
  const tagCounts = new Map<string, number>();

  for (const article of articles) {
    for (const tag of article.data.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }

  return [...tagCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((tagA, tagB) => tagB.count - tagA.count || tagA.name.localeCompare(tagB.name, 'zh-CN'));
}
