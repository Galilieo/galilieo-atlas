import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, test } from 'node:test';
import { getPublishedBlogArticles } from '../src/lib/blog-directory.ts';

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
