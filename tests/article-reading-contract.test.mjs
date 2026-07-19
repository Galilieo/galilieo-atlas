import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, test } from 'node:test';
import { checkGeneratedArticle } from '../scripts/lib/blog-article-contract.mjs';

const repositoryRoot = resolve(import.meta.dirname, '..');

function articlePage({ body = '<p>正文</p>', desktopNavigation = '', mobileNavigation = '' } = {}) {
  return `
    <section data-article-hero></section>
    <div data-article-cover><img src="/cover.webp" srcset="/cover.webp 480w" sizes="100vw" width="480" height="270"></div>
    <a href="/notes/" data-article-back-link>返回博客</a>
    <div class="prose" data-article-body>${body}</div>
    ${desktopNavigation}
    ${mobileNavigation}
  `;
}

function tocNavigation(variant, target = 'section-one') {
  const tag = variant === 'desktop' ? 'aside' : 'details';
  return `<${tag} class="article-reading-navigation--${variant}" data-reading-navigation>
    <nav class="article-toc"><a href="#${target}" data-reading-toc-link>章节</a></nav>
  </${tag}>`;
}

describe('generated article reading contract', () => {
  test('accepts a headingless single-article page without reading navigation or recommendations', () => {
    assert.deepEqual(checkGeneratedArticle({ slug: 'only-article', html: articlePage() }), []);
  });

  test('requires matching desktop and mobile TOCs when the article has headings', () => {
    const body = '<h2 id="section-one">章节</h2><p>正文</p>';
    const desktopNavigation = tocNavigation('desktop');
    const validPage = articlePage({
      body,
      desktopNavigation,
      mobileNavigation: tocNavigation('mobile'),
    });

    assert.deepEqual(checkGeneratedArticle({ slug: 'with-heading', html: validPage }), []);

    const failures = checkGeneratedArticle({
      slug: 'with-heading',
      html: articlePage({ body, desktopNavigation }),
    });
    assert.ok(failures.some((failure) => failure.includes('native mobile article TOC')));
  });

  test('treats recommendation limits as upper bounds and still rejects overflow and self-links', () => {
    const link = (slug) =>
      `<a href="/notes/${slug}/" data-article-recommendation-link data-recommended-article="${slug}">${slug}</a>`;
    const section = (variant, slugs) =>
      `<section data-article-recommendations="${variant}">${slugs.map(link).join('')}</section>`;
    const desktopRecommendations = section('desktop', ['one', 'two', 'three']);
    const validPage = articlePage({
      desktopNavigation: `<aside class="article-reading-navigation--desktop" data-reading-navigation>${desktopRecommendations}</aside>`,
      mobileNavigation: section('mobile', ['one', 'two']),
    });

    assert.deepEqual(
      checkGeneratedArticle({
        slug: 'current',
        html: validPage,
        availableRecommendationCount: 3,
      }),
      [],
    );

    const overflowDesktop = section('desktop', ['current', 'two', 'three', 'four']);
    const invalidPage = articlePage({
      desktopNavigation: `<aside class="article-reading-navigation--desktop" data-reading-navigation>${overflowDesktop}</aside>`,
      mobileNavigation: section('mobile', ['current', 'two', 'three']),
    });
    const failures = checkGeneratedArticle({
      slug: 'current',
      html: invalidPage,
      availableRecommendationCount: 4,
    });

    assert.ok(failures.some((failure) => failure.includes('at most 3 articles')));
    assert.ok(failures.some((failure) => failure.includes('at most 2 articles')));
    assert.ok(failures.some((failure) => failure.includes('must not recommend itself')));
  });

  test('requires recommendation sections whenever public candidates exist', () => {
    const failures = checkGeneratedArticle({
      slug: 'current',
      html: articlePage(),
      availableRecommendationCount: 2,
    });

    assert.ok(failures.some((failure) => failure.includes('desktop Recommended must contain 2')));
    assert.ok(failures.some((failure) => failure.includes('mobile Recommended must contain 2')));

    const recommendation = (variant) =>
      `<section data-article-recommendations="${variant}"><a href="/notes/only-candidate/" data-article-recommendation-link data-recommended-article="only-candidate">唯一候选</a></section>`;
    const singleCandidatePage = articlePage({
      desktopNavigation: `<aside class="article-reading-navigation--desktop" data-reading-navigation>${recommendation('desktop')}</aside>`,
      mobileNavigation: recommendation('mobile'),
    });
    assert.deepEqual(
      checkGeneratedArticle({
        slug: 'current',
        html: singleCandidatePage,
        availableRecommendationCount: 1,
      }),
      [],
    );
  });

  test('requires mobile recommendations to preserve the leading desktop IDs and order', () => {
    const link = (slug) =>
      `<a href="/notes/${slug}/" data-article-recommendation-link data-recommended-article="${slug}">${slug}</a>`;
    const section = (variant, slugs) =>
      `<section data-article-recommendations="${variant}">${slugs.map(link).join('')}</section>`;
    const desktopRecommendations = section('desktop', ['one', 'two', 'three']);
    const html = articlePage({
      desktopNavigation: `<aside class="article-reading-navigation--desktop" data-reading-navigation>${desktopRecommendations}</aside>`,
      mobileNavigation: section('mobile', ['two', 'one']),
    });
    const failures = checkGeneratedArticle({
      slug: 'current',
      html,
      availableRecommendationCount: 3,
    });

    assert.ok(failures.some((failure) => failure.includes('leading desktop article order')));
  });
});

describe('desktop article reading rail styles', () => {
  test('lets recommendations scroll away while only the TOC remains sticky', () => {
    const css = readFileSync(resolve(repositoryRoot, 'src/styles/interior.css'), 'utf8');

    assert.match(
      css,
      /\.article-reading-navigation--desktop\s*\{[^}]*align-self:\s*stretch;[^}]*\}/s,
    );
    assert.doesNotMatch(
      css,
      /\.article-reading-navigation--desktop\s*\{[^}]*position:\s*sticky;[^}]*\}/s,
    );
    assert.match(
      css,
      /\.article-reading-navigation--desktop\s*>\s*\.article-toc\s*\{[^}]*position:\s*sticky;[^}]*max-height:[^;]+;[^}]*overflow-y:\s*auto;[^}]*\}/s,
    );
  });
});
