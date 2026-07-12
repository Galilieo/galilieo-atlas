# Galilieo Atlas Homepage Dashboard Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking. Do not commit, push, deploy, install dependencies, or use subagents for this execution.

**Goal:** Replace the current long-form homepage with the approved two-row dashboard while preserving static Astro output, real Content Collections data, dual themes, accessibility, and progressive enhancement.

**Architecture:** `HomeDashboard.astro` is the homepage composition boundary. It renders a `64:36` desktop grid containing a profile card and two utility cards in row one, project and note carousels in row two, followed by a compact status strip. All carousel slides are generated at build time; one native TypeScript module adds manual switching and Shanghai time, with cleanup through the existing Astro page-transition lifecycle.

**Tech Stack:** Astro 7, TypeScript strict, Content Collections, native CSS and CSS Variables, inline SVG, browser TypeScript, Astro View Transitions, ESLint, Astro Check, Prettier, pnpm.

---

## Scope

### In scope

- Approved two-row homepage dashboard and `64:36` desktop ratio.
- Profile layout from the hand-drawn reference: avatar and identity above; Works/Notes and icon links below.
- GitHub and reserved music cards in the right column.
- Manual Featured Works and Latest Notes carousels using real collection entries.
- Heart Island shown only as the first Featured Works item.
- Compact time/location/weather-status strip.
- Responsive, keyboard, Reduced Motion, no-JavaScript, and Astro transition behavior.
- Removal of obsolete homepage-only components after the new structure passes checks.
- Documentation and static homepage contract updates.

### Out of scope

- Vue, Pagefind, Giscus, Three.js, GSAP, Tailwind, or other dependencies.
- Weather API, GitHub activity API, licensed music playback, autoplay, search, filtering, comments, or live presence.
- Final background licensing or replacement.
- Changes to project/article schemas, routes, Nginx, domain, or production configuration.

## Target file structure

```text
src/components/home/
├── HomeDashboard.astro       # Two-row composition and landmark
├── HomeProfileCard.astro     # Identity, counts, icon links
├── HeroUtilityRail.astro     # GitHub and reserved music cards
├── FeaturedProjects.astro    # Project carousel, Heart Island first
├── LatestPosts.astro         # Public note carousel
├── HomeStatusStrip.astro     # Time, location, weather status
└── IslandArtwork.astro       # Existing protected Heart Island artwork
src/scripts/
└── home-dashboard.ts         # Carousel state and Shanghai clock lifecycle
src/styles/home/
├── base.css                  # Homepage shell/background/no-JS contract
├── hero.css                  # Dashboard/profile/utility/status/island styles
├── sections.css              # Project/note carousel styles plus non-home rules
└── responsive.css            # 64:36 desktop and single-column downgrade
```

Obsolete homepage-only files are removed only after references are gone: `HeroSection.astro`, `HeroVisual.astro`, `QuickOverview.astro`, `QuickCards.astro`, `StatsBar.astro`, `ArchivePreview.astro`, and `AboutPreview.astro`.

### Task 1: Lock the generated homepage contract

**Files:**

- Modify: `scripts/check-home-structure.mjs`

- [x] **Step 1: Replace the old section-order contract**

Require these markers in order:

```js
const requiredSections = [
  'id="home-dashboard"',
  'id="profile"',
  'id="projects"',
  'id="blog"',
  'id="home-status"',
];
```

Add forbidden legacy markers and dashboard requirements:

```js
const forbiddenHomepageMarkers = [
  'id="quick-status"',
  'id="archive-preview"',
  'id="about"',
  'class="hero-visual',
  '查看项目 <span',
  '阅读博客 <span',
];

for (const marker of forbiddenHomepageMarkers) {
  if (homepage.includes(marker))
    failures.push(`Homepage must not contain legacy marker ${marker}.`);
}

for (const marker of [
  'data-home-carousel',
  'data-home-time',
  'aria-label="GitHub"',
  'aria-label="发送邮件"',
]) {
  if (!homepage.includes(marker)) failures.push(`Homepage must render ${marker}.`);
}
```

- [x] **Step 2: Run the contract and confirm it fails before implementation**

Run:

```bash
pnpm run build
pnpm run check:home
```

Expected: build succeeds; `check:home` fails because the dashboard markers do not exist and legacy sections still render.

### Task 2: Build the static dashboard components

**Files:**

- Create: `src/components/home/HomeProfileCard.astro`
- Create: `src/components/home/HomeStatusStrip.astro`
- Create: `src/components/home/HomeDashboard.astro`
- Modify: `src/components/home/HeroUtilityRail.astro`
- Modify: `src/components/home/FeaturedProjects.astro`
- Modify: `src/components/home/LatestPosts.astro`

- [x] **Step 1: Create `HomeProfileCard.astro`**

At build time, read all projects and public non-draft blog entries. Render `section#profile` with:

- `.home-profile__identity`: decorative `G` avatar, eyebrow, `siteConfig.name`, `homeProfile.role`, and `homeProfile.summary`.
- `.home-profile__footer`: `/projects/` and `/blog/` count links on the left; icon-only GitHub, email, and Heart Island links on the right.
- Inline SVG icons with `aria-hidden="true"`; each link receives `aria-label`, visible focus styling through CSS, and external-link `rel` attributes.
- No whole-card overlay link and no “查看项目 / 阅读博客” button row.

- [x] **Step 2: Reduce `HeroUtilityRail.astro` to two cards**

Render only:

```astro
<aside class="home-utility" aria-label="功能卡片">
  <article class="home-utility__card home-utility__github">...</article>
  <article class="home-utility__card home-utility__music">...</article>
</aside>
```

The GitHub card is a real link but its activity grid is decorative and must not claim contribution counts. The music card says the source is unconfirmed; disabled controls keep explicit labels and do not autoplay.

- [x] **Step 3: Rewrite `FeaturedProjects.astro` as a static manual carousel**

Sort projects by `order`, keep the first three, and render all three slides in source order. Use:

```astro
<section class="dashboard-card home-carousel home-projects" id="projects" data-home-carousel>
  <div class="home-carousel__viewport" aria-live="polite">
    {
      projects.map((project, index) => (
        <article data-home-slide hidden={index !== 0}>
          ...
        </article>
      ))
    }
  </div>
  <button type="button" data-home-prev aria-label="上一个项目">‹</button>
  <span data-home-position>{projects.length ? `1 / ${projects.length}` : '0 / 0'}</span>
  <button type="button" data-home-next aria-label="下一个项目">›</button>
</section>
```

For `project.id === 'heart-island'`, render the existing `IslandArtwork` inside the visual area and keep its protected geometry unchanged. Other projects use the existing token-based placeholder treatment. Every slide links to `/projects/${project.id}/` and displays real title, subtitle, status, and up to three stack items.

- [x] **Step 4: Rewrite `LatestPosts.astro` as a static manual carousel**

Filter non-draft entries with `publishedAt`, sort newest first, and keep three. Render the same carousel data attributes with article-specific labels, `/notes/${post.id}/`, title, description, category, date, reading time, and up to two tags. If no public posts exist, render “第一批文章正在整理中” and omit enabled controls.

- [x] **Step 5: Create `HomeStatusStrip.astro`**

Render `section#home-status` with:

```astro
<time data-home-time datetime="">--:--</time>
<span>Shanghai, China</span>
<span>天气尚未接入</span>
<span>Static site · Astro 7</span>
```

Do not render temperature, weather conditions, online status, music state, or GitHub counts.

- [x] **Step 6: Create `HomeDashboard.astro`**

Compose the two rows without querying content again:

```astro
<section class="home-dashboard" id="home-dashboard" aria-label="Galilieo 首页概览">
  <HomeProfileCard />
  <HeroUtilityRail />
  <FeaturedProjects />
  <LatestPosts />
  <HomeStatusStrip />
</section>
```

### Task 3: Replace the homepage assembly and add progressive enhancement

**Files:**

- Modify: `src/pages/index.astro`
- Create: `src/scripts/home-dashboard.ts`
- Modify: `src/scripts/main.ts`

- [x] **Step 1: Replace the six homepage sections with the dashboard**

`src/pages/index.astro` imports only `HomeDashboard`, `SiteHeader`, `SiteFooter`, and `BaseLayout`. Preserve the skip link and `main#main-content`.

- [x] **Step 2: Implement `initHomeDashboard(): Cleanup`**

`src/scripts/home-dashboard.ts` must:

- Find each `[data-home-carousel]`; safely skip missing or empty carousels.
- Track the active index locally per carousel.
- Toggle each slide’s `hidden` property and update `[data-home-position]`.
- Disable previous/next controls when there is one or zero slides; otherwise wrap at both ends.
- Add click listeners to previous/next controls and return cleanup functions that remove them.
- Format real Shanghai time with `Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false })`.
- Update the clock immediately and every 30 seconds; set the `datetime` attribute to a current ISO string and clear the interval on cleanup.
- Return an empty cleanup when the dashboard is absent.

- [x] **Step 3: Register the module in `main.ts`**

Import `initHomeDashboard` and add it to the existing `cleanups` array. Keep the existing `astro:page-load` and `astro:before-swap` lifecycle; do not add global listeners outside this lifecycle.

- [x] **Step 4: Run automated checks**

Run:

```bash
pnpm run lint
pnpm run check
pnpm run build
pnpm run check:home
```

Expected: all commands pass; generated homepage contains the new IDs and no legacy section markers.

### Task 4: Implement the approved visual system

**Files:**

- Modify: `src/styles/home/base.css`
- Modify: `src/styles/home/hero.css`
- Modify: `src/styles/home/sections.css`
- Modify: `src/styles/home/responsive.css`

- [x] **Step 1: Update the homepage shell selector**

Change the background activation selector from `body:has(#main-content > .hero)` to `body:has(#main-content > .home-dashboard)`. Keep the owner-supplied demo background comment, token-based overlays, and mobile background behavior.

- [x] **Step 2: Implement the desktop dashboard grid**

Use one grid with named areas:

```css
.home-dashboard {
  width: var(--page);
  margin-inline: auto;
  padding: clamp(40px, 6vw, 76px) 0;
  display: grid;
  grid-template-columns: minmax(0, 1.78fr) minmax(320px, 1fr);
  grid-template-areas:
    'profile utility'
    'projects notes'
    'status status';
  gap: clamp(16px, 1.6vw, 22px);
}
```

`1.78fr 1fr` approximates the approved `64:36`. Give row one enough height for the two right cards without clipping; use intrinsic height plus a desktop minimum around `360px`, not fixed text clipping.

- [x] **Step 3: Style the hand-drawn profile hierarchy**

- Identity uses avatar plus text; footer uses counts left and icon links right.
- Preserve display/serif/sans/mono tokens and current dual-theme colors.
- Icon links are at least `42px` square with `:focus-visible` and hover states.
- Do not reintroduce title-sized `Galilieo / Atlas` line breaks or action buttons.

- [x] **Step 4: Style utilities, carousels, status strip, and Heart Island**

- Right utility column has two balanced rows with GitHub above music.
- Project/note cards align across row two, keep readable headings, and avoid full list layouts.
- Carousel controls are hidden without the root `.js` class and shown only as progressive enhancement; first slides remain readable without JavaScript.
- Reuse existing island CSS for `IslandArtwork`, scoped inside `.home-projects`, without changing SVG paths or adding a heart icon.
- Status strip spans both columns and wraps its segments rather than overflowing.

- [x] **Step 5: Implement responsive downgrade**

- At `max-width: 999px`, use one column in order: profile, utility, projects, notes, status; utility cards may remain two columns when space permits.
- At `max-width: 767px`, make utility cards single column, stack profile identity/footer, allow status segments to wrap, remove large backdrop filters, and preserve 44px touch targets.
- At `max-width: 580px`, reduce padding and type scale but do not hide navigation links, carousel titles, counts, or contacts.
- Reduced Motion removes smooth transitions and transforms; manual carousel state changes remain immediate.

- [x] **Step 6: Run format and automated verification**

Run:

```bash
pnpm exec prettier --write src/pages/index.astro src/components/home src/scripts/main.ts src/scripts/home-dashboard.ts src/styles/home scripts/check-home-structure.mjs
pnpm run verify
```

Expected: Prettier succeeds; lint, Astro check, build, and homepage structure checks all pass with zero Astro diagnostics.

### Task 5: Remove obsolete homepage-only implementation and update maintenance docs

**Files:**

- Delete: `src/components/home/HeroSection.astro`
- Delete: `src/components/home/HeroVisual.astro`
- Delete: `src/components/home/QuickOverview.astro`
- Delete: `src/components/home/QuickCards.astro`
- Delete: `src/components/home/StatsBar.astro`
- Delete: `src/components/home/ArchivePreview.astro`
- Delete: `src/components/home/AboutPreview.astro`
- Modify: `docs/content-guide.md`
- Modify: `docs/design-guide.md`
- Modify: `docs/homepage-redesign.md`
- Modify: `README.md`

- [x] **Step 1: Confirm files are unreferenced**

Run:

```bash
rg -n "HeroSection|HeroVisual|QuickOverview|QuickCards|StatsBar|ArchivePreview|AboutPreview" src
```

Expected: no references outside the obsolete files themselves.

- [x] **Step 2: Delete the obsolete components**

Remove only the seven files listed above. Keep `IslandArtwork.astro`, `AboutSection.astro`, independent routes, Content Collections, and non-home archive/about styles.

- [x] **Step 3: Update documentation to current implementation**

- `docs/content-guide.md`: replace old Hero/Quick/About maintenance paths with `HomeProfileCard`, `HomeDashboard`, `FeaturedProjects`, `LatestPosts`, `HomeStatusStrip`, and the existing data sources.
- `docs/design-guide.md`: replace current references to `HeroVisual` with the Featured Works Heart Island location; keep the protected SVG and lifecycle rules.
- `docs/homepage-redesign.md`: mark the two-row dashboard implemented only after browser verification; preserve Pagefind/Giscus/Vue as unimplemented candidates.
- `README.md`: update the homepage description without claiming live weather, music, GitHub activity, Pagefind, Giscus, or Vue.

- [x] **Step 4: Run stale-reference and full verification checks**

Run:

```bash
rg -n "HeroSection|HeroVisual|QuickOverview|QuickCards|StatsBar|ArchivePreview|AboutPreview" src docs README.md AGENTS.md
pnpm run verify
git diff --check
```

Expected: references remain only in historical task records where explicitly described as history; verification and whitespace checks pass.

### Task 6: Browser verification and closeout

**Files:**

- Modify after verification: `docs/homepage-redesign.md`
- Move after verification: `tasks/active/homepage-dashboard-refactor.md` → `tasks/archive/homepage-dashboard-refactor.md`

- [x] **Step 1: Start the production preview**

Run:

```bash
pnpm run preview -- --host 127.0.0.1
```

- [x] **Step 2: Verify representative layouts**

Check `/` at `1440×1000`, `1024×768`, and `390×844` in both themes:

- Desktop columns visually approximate `64:36`; right cards are not crowded or clipped.
- Profile follows avatar/text above and counts/icons below.
- Heart Island appears only in the first project slide.
- Project and note controls switch slides manually and wrap correctly.
- No horizontal overflow, nested interactive links, or hidden focus indicators.
- Header mobile navigation remains reachable and closable.

- [x] **Step 3: Verify accessibility and lifecycle states**

- Keyboard through Header, profile links, both carousels, and status strip.
- Reduced Motion has no persistent transforms or smooth carousel motion.
- Disable JavaScript: profile, first project, first note, contacts, and static navigation remain readable; inactive controls are not shown.
- Navigate Home → Project → Home with Astro View Transitions; confirm one dashboard listener set and one Island controller.
- Confirm browser console has no new errors.

- [x] **Step 4: Verify related routes**

Open `/projects/`, one project detail, `/blog/`, one note detail, `/archive/`, `/about/`, `/rss.xml`, `/sitemap-index.xml`, and a missing route. Confirm successful pages render and the missing route remains a real 404.

- [x] **Step 5: Record evidence and archive the task**

Update `docs/homepage-redesign.md` with the implementation date, exact verified viewports/states, and any explicitly unverified item. Mark every completed checkbox in this plan, move it to `tasks/archive/`, and run:

```bash
pnpm run verify
git diff --check
git status --short
```

Expected: verification passes, the plan is no longer in `tasks/active/`, and no commit, push, PR, or deployment has occurred.
