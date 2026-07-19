import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, test } from 'node:test';
import { getPublishedBlogArticles, getRecommendedBlogArticles } from '../src/lib/blog-directory.ts';

const repositoryRoot = resolve(import.meta.dirname, '..');

function article(id, data) {
  return { id, data };
}

describe('Public Article selection', () => {
  test('excludes drafts and entries without a publication date, then sorts newest first', () => {
    const articles = [
      article('older', { draft: false, publishedAt: '2026-06-01' }),
      article('draft', { draft: true, publishedAt: '2026-07-18' }),
      article('missing-date', { draft: false }),
      article('newer', { draft: false, publishedAt: '2026-07-01' }),
    ];

    assert.deepEqual(
      getPublishedBlogArticles(articles).map(({ id }) => id),
      ['newer', 'older'],
    );
    assert.deepEqual(
      articles.map(({ id }) => id),
      ['older', 'draft', 'missing-date', 'newer'],
      'selection must not reorder the caller input',
    );
  });

  test('all production publication callers reuse the shared selection Module', () => {
    const callers = [
      'src/pages/archive/index.astro',
      'src/pages/rss.xml.ts',
      'src/components/home/HomeProfileCard.astro',
      'src/pages/notes/[...slug].astro',
    ];

    for (const path of callers) {
      const source = readFileSync(resolve(repositoryRoot, path), 'utf8');
      assert.match(source, /getPublishedBlogArticles/, `${path} bypasses the public article rule`);
    }
  });
});

describe('Recommended Article selection', () => {
  const currentArticle = article('current', {
    category: '工程笔记',
    tags: ['Astro', 'CSS'],
    draft: false,
    publishedAt: '2026-07-10',
  });

  test('ranks same-category articles first, then shared tags and publication date', () => {
    const articles = [
      article('other-no-tags', {
        category: '实习复盘',
        tags: ['TypeScript'],
        draft: false,
        publishedAt: '2026-07-20',
      }),
      article('same-one-tag-newer', {
        category: '工程笔记',
        tags: ['Astro'],
        draft: false,
        publishedAt: '2026-07-18',
      }),
      article('other-two-tags-newest', {
        category: '实习复盘',
        tags: ['Astro', 'CSS'],
        draft: false,
        publishedAt: '2026-07-19',
      }),
      article('same-two-tags-older', {
        category: '工程笔记',
        tags: ['Astro', 'CSS'],
        draft: false,
        publishedAt: '2026-06-01',
      }),
    ];
    const originalArticles = JSON.parse(JSON.stringify(articles));

    assert.deepEqual(
      getRecommendedBlogArticles(articles, currentArticle, 4).map(({ id }) => id),
      ['same-two-tags-older', 'same-one-tag-newer', 'other-two-tags-newest', 'other-no-tags'],
    );
    assert.deepEqual(
      getRecommendedBlogArticles(
        [
          article('same-priority-older', {
            category: '工程笔记',
            tags: ['Astro'],
            draft: false,
            publishedAt: '2026-07-01',
          }),
          article('same-priority-newer', {
            category: '工程笔记',
            tags: ['CSS'],
            draft: false,
            publishedAt: '2026-07-02',
          }),
        ],
        currentArticle,
      ).map(({ id }) => id),
      ['same-priority-newer', 'same-priority-older'],
    );
    assert.deepEqual(articles, originalArticles, 'selection must not mutate the caller input');
  });

  test('excludes the current and unpublished articles, then respects the limit', () => {
    const articles = [
      currentArticle,
      article('draft', {
        category: '工程笔记',
        tags: ['Astro', 'CSS'],
        draft: true,
        publishedAt: '2026-07-20',
      }),
      article('missing-date', {
        category: '工程笔记',
        tags: ['Astro', 'CSS'],
        draft: false,
      }),
      article('published', {
        category: '其他',
        tags: [],
        draft: false,
        publishedAt: '2026-07-01',
      }),
    ];

    assert.deepEqual(
      getRecommendedBlogArticles(articles, currentArticle, 1).map(({ id }) => id),
      ['published'],
    );
    assert.deepEqual(getRecommendedBlogArticles(articles, currentArticle, 0), []);
  });

  test('uses the article ID as a deterministic final tie-break', () => {
    const articles = [
      article('z-last', {
        category: currentArticle.data.category,
        tags: ['Astro'],
        draft: false,
        publishedAt: '2026-07-01',
      }),
      article('a-first', {
        category: currentArticle.data.category,
        tags: ['CSS'],
        draft: false,
        publishedAt: '2026-07-01',
      }),
    ];

    assert.deepEqual(
      getRecommendedBlogArticles(articles, currentArticle).map(({ id }) => id),
      ['a-first', 'z-last'],
    );
  });

  test('normalizes fractional, negative, and omitted limits', () => {
    const articles = [
      article('first', {
        category: currentArticle.data.category,
        tags: ['Astro'],
        draft: false,
        publishedAt: '2026-07-04',
      }),
      article('second', {
        category: currentArticle.data.category,
        tags: ['Astro'],
        draft: false,
        publishedAt: '2026-07-03',
      }),
      article('third', {
        category: currentArticle.data.category,
        tags: ['Astro'],
        draft: false,
        publishedAt: '2026-07-02',
      }),
      article('fourth', {
        category: currentArticle.data.category,
        tags: ['Astro'],
        draft: false,
        publishedAt: '2026-07-01',
      }),
    ];

    assert.deepEqual(
      getRecommendedBlogArticles(articles, currentArticle, 1.9).map(({ id }) => id),
      ['first'],
    );
    assert.deepEqual(getRecommendedBlogArticles(articles, currentArticle, -1), []);
    assert.deepEqual(
      getRecommendedBlogArticles(articles, currentArticle).map(({ id }) => id),
      ['first', 'second', 'third'],
    );
  });
});
