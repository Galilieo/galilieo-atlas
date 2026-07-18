# Archive Opening and Voyage Polish Design

## Goal

Refine the approved archive route-log page where the current opening feels oversized and dashboard-like, and where the voyage scene enters too abruptly. Keep the route cards, theme images, image loading behavior, and timeline interaction unchanged.

## Confirmed Direction

Use a compact route-log opening rather than the current large panel heading and circular chapter badge.

- Keep the existing archive page title and native Blog / Personal tabs.
- Reduce the active panel heading to a compact log header: eyebrow, restrained title, and entry count on one visual row.
- Remove the long full-width rule beneath the panel heading.
- Replace the circular `Current course` chapter marker and its long side rules with a small coordinate plate attached to the timeline axis.
- Blog uses the existing blue-purple route accent; Personal uses the existing teal accent.
- Do not change card content, card destinations, alternating desktop layout, mobile left rail, or node interactions.

## Coordinate Plate

The plate is a compact timeline label, not a pill button or dashboard metric.

- Blog primary label: the real month, for example `2026.07`.
- Personal primary label: `2024 — NOW`.
- Secondary label: `LOG 01` for blog month groups and `ONGOING` for the personal course.
- Use a small squared shape with softened corners, a short accent tick, and no enclosing circle or full-width crossbar.
- It remains centered on the desktop axis and moves into the `68px` mobile rail without overlapping the card column.

## Voyage Transition

Keep the approved day/night paper-boat assets and current responsive crop. Do not change `loading="lazy"`, image sources, opacity values, or theme selection.

- Increase the transition-to-scene overlap so the image starts underneath the last route lights.
- Replace the visible rectangular top boundary with a combined vertical and edge fade.
- Keep the scene free of card borders, radius, and panel shadow.
- Preserve the complete mobile boat composition and zero horizontal overflow.

## Final Copy

- Eyebrow: `NEXT COORDINATE`
- Heading: `下一程，仍在航行`
- Supporting line: `把走过的路留在这里，新的坐标仍在海面上亮起。`

The copy must read as finished portfolio language and must not describe implementation intent or call the section a visual ending.

## Responsive and Accessibility

- Desktop keeps the three-column timeline and equal card widths.
- At `760px` and below, the coordinate plate belongs to the left rail and the panel heading remains compact without forcing horizontal overflow.
- Keyboard focus, tab behavior, Reduced Motion, no-JavaScript content, and card links remain unchanged.
- Reduced Motion continues to disable voyage drift, light movement, and glint animation.

## Verification

- Run `node scripts/verify.mjs`.
- Inspect `/archive/` at `1440×1000`, `1024×768`, and `390×844` in light and dark themes.
- Verify both Blog and Personal panels, the coordinate plate alignment, the voyage fade, final copy, Reduced Motion, no JavaScript, console output, and horizontal overflow.
