Radical negative space
The entire page is mostly empty. Content lives in one zone — the canvas center. Navigation is a single centered line. Nothing competes for attention.
layout
whitespace
Navigation as HUD
No top bar, no sidebar. The nav floats at vertical center as a single row of text links — like a film's lower-third caption. It's always there, never dominant.
nav
UX pattern
1 · Homepage — the fan carousel
Staggered card arc (no slider dots, no arrows)
Project thumbnails are arranged in a radial fan — cards rotate outward from center, each at a slightly different angle and vertical offset. The center card is biggest and most upright. Cards bleed off both edges, implying there's more to explore.
↳ cards use CSS rotate + translateY — no JS carousel lib
How to copy: use transform: rotate(Ndeg) translateY(Npx) on each card. Center card: no rotation. Cards fan outward by ~5–7° per step. Vertical offset increases with distance from center.
Hover → nav context update
When you hover a card, the project name appears in the nav bar — replacing a dead slot with live context. No tooltip, no label overlay. The nav itself becomes the label.
Voku.Studio™__L'Entropiste. Mother's Day.__WorksArtifactsAboutContact
↳ The hovered card name appears as a nav item between brand + Works
How to copy: on mouseenter of each card, inject a <span> into the nav with the project name. On mouseleave, remove it. Transition the span in with opacity 0.2s ease-in.
2 · Works page — text list with full-bleed hover takeover
Project list as plain text — no thumbnails
All 27 projects are listed as bare serif text in the top-left corner. No grids, no cards, no images by default. Font: Times New Roman, ~24px, weight 400. This is the entire UI.
The Sphere.
S. Ingrosso & S. Angello.
__ANYMA x SOLOMUN.__
L'Entropiste.
Helena Rubinstein®.
Hover → full-viewport image takeover + ghost title
Hovering any list item triggers an instant full-screen background image for that project. Simultaneously, the project name renders in enormous semi-transparent text — covering the full viewport as a typographic backdrop. The list text remains readable on top in white.
ANYMA × SOLOMUN
The Sphere.
__ANYMA x SOLOMUN.__
L'Entropiste.
How to copy: Three layered ULs share the same DOM position. (1) .ul-deco — decorative underline strokes per row. (2) .images — position:absolute, pointer-events:none, each LI holds the project image, only the hovered LI's image is visible. (3) .ul — the actual clickable text links. On hover, toggle image opacity + apply white color to list text.
/* Three stacked ULs in the same section */ .block-project-list__ul-deco → stroke dividers .block-project-list__images → pos:absolute, pointer-events:none .block-project-list__ul → the clickable text links /* Ghost title technique */ font-size: ~8–10vw; opacity: 0.06–0.08; color: white; position: absolute; z-index: 1; right: 0; top: 0; pointer-events: none;
Category filter in the nav (not a sidebar)
Filter tabs (Music Video, Film, Fashion, Branding, Commercial) live in the nav bar itself — inline with the logo and page links. Clicking one filters the list. The active filter is underlined.
How to copy: Add filter tokens directly into the nav's flex row. On click, hide/show list items with a CSS class. The underline on the active filter uses text-decoration: underline via the .active class — same as nav links.
3 · Project detail — video-first with minimal chrome
Video takes 100% of viewport on entry
Clicking a project from the homepage loads a full-bleed video (not a page with a video). Controls are not visible by default — they appear in the nav bar: Play, Pause, Sound on, Fullscreen, Open details, Prev, Next, Close.
Voku.Studio™LALIGA.00:09:60PlayPauseSound on__Fullscreen__Open detailsPrevNextClose
How to copy: All video controls become nav items. No HUD overlay on the video itself. This keeps the visual pristine. The nav bar adapts its context per-page: homepage = project name on hover, project view = video controls, detail view = Close + Works.
Detail page: full image + giant ghost project name
The project detail page shows a full-bleed photo. The project name renders as a massive outline/ghost title behind the image — like a watermark in screen-size text. Credits (Producer, Director, Sound, Agency) appear in a small column on the far right.
LALIGA
Credits
Produced by Voku.Studio Directed by YZA Voku Sound design by OZE
How to copy: Use position: absolute ghost text at ~10–15vw, opacity: 0.05–0.08, font-weight: 900, behind the image via z-index. Credits column uses position: fixed; right: 2rem; top: 50% or floated right in a flex layout.
4 · Artifacts page — vertical scroll with floating collage
Content positioned off-center left, quote on the right
Each artifact is a visual collage (irregular cutout shapes, mixed media) floating in the left 60% of the screen. A numbered label ("Artifact #005") and a short italic quote appear in the right column. Scrolling reveals each artifact one by one.
How to copy: Two-column layout — flex: 1 for the image area, width: 280px fixed for the text aside. Position the quote with position: sticky; top: 40% so it stays visible while you scroll through the image.
5 · About page — giant ghost typography as background
The brand name fills the entire screen as a ghost layer
On the About page, "VOKU.STUDIO™" renders as enormous scrolling text in the background at ~8–10vw, almost fully transparent. The actual content (a short bio + services list) sits in a small panel in the bottom-right corner, on top of the typography.
VOKU.STUDIO™
Information
Creative studio focused on crafting with AI. Founded 2022 by YZA Voku.
Values
Not Real, Yet.
How to copy: font-size: clamp(4rem, 9vw, 12rem); opacity: 0.04; color: currentColor; position: fixed; white-space: nowrap; overflow: hidden; pointer-events: none;. Content panel: position: fixed; bottom: 2rem; right: 2rem; max-width: 320px;.
6 · Typography system
Dual-font strategy: serif body + custom display
All body text and project names use Times New Roman — a deliberately "boring" choice that makes the bold imagery pop harder. The logo uses a custom typeface called "vokufont". UI chrome (credits, labels, nav) uses Archivo (geometric sans).
ANYMA x SOLOMUN.
Times New Roman · 24px · weight 400
Archivo · 11px · weight 400 — nav/labels
vokufont — logo only
Type scale (CSS custom properties)
--font-size-xl: 3rem --font-size-l: 2.25rem --font-size-m: 0.875rem --font-size-base: 0.75rem --font-size-s: 0.625rem /* Fluid base size */ font-size: clamp(14px, 1.11vw, 48px)
Letter spacing + line height
--letter-spacing: 0.01em --line-height-sans: 1.25 /* Nav links are very tight */ letter-spacing: 0.01em font-size: ~12–14px text-transform: none
7 · Color system
Two-color palette + off-white background
The palette is near-monochrome by design. The background is a warm near-white, not pure white — creating a papery, editorial feel.
#fffdfa — background (warm off-white)
#000 — primary text
red — assertive, focus, errors
Red is used deliberately as the only accent — on focus states, error colors, and the border-color of debug elements. This makes it feel like a signal, not decoration.
8 · Transitions & easing library
Full easing library in CSS custom properties
Every interaction uses named easing curves stored as CSS variables. The most-used transitions on this site:
Cursor follow: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) — ease-out-quart feel, smooth lag
Nav title fade in: opacity 0.4s ease-out on hover-enter, 0.2s ease-in on hover-exit (faster out)
Nav underline: transform scaleX(…) 0.4s var(--ease-out-quint) — slides from origin point
Page transitions: opacity on #Main — starts at 0, JS reveals after load
Background image swap: near-instant (no explicit duration) — the snap feels intentional, not laggy
The full easing variable set:
--ease-out-quint: cubic-bezier(0.23,1,0.32,1)
--ease-out-expo: cubic-bezier(0.19,1,0.22,1)
--ease-out-quart: cubic-bezier(0.165,0.84,0.44,1)
--ease-in-out-expo: cubic-bezier(1,0,0,1)
--ease-in-out-quart: cubic-bezier(0.77,0,0.175,1)
--ease-out-cubic: cubic-bezier(0.215,0.61,0.355,1)
9 · Micro-interactions & details
Nav underline is animated scaleX
Each nav link has a ::before pseudo-element as the underline. It scales from 0→1 on hover using transform-origin switching direction (slide-in from left, slide-out to right).
transform: scaleX(0→1)
0.4s ease-out-quint
transform-origin: var(--origin)
Canvas WebGL background
A <canvas id="scene-three"> sits behind all content. On the homepage, this renders the ambient particle/depth effect. Three.js is bundled into the single main JS file.
canvas#scene-three
position: fixed
z-index: -1
Custom scroll behavior (vanilla)
No Lenis, GSAP, or Locomotive Scroll is exposed on window. The smooth scroll is implemented custom inside the bundled main.js — keeping the bundle lean.
Body class state machine
The <body> carries state as classes: __cursor, --low-power-mode, palette-primary, __mouse-up, __mouse-left. CSS rules react to these for layout/color changes.
--invert (header)
palette-primary
--remove-footer
Infinite horizontal scroll slider
The homepage uses a #full-slider div with class __scroll-infinity-axis-x — a custom infinite horizontal scroller. Items use position:absolute with JS-driven x positions.
Page enter: opacity reveal
Both body and #Main start at opacity: 0 in CSS. JS removes the hidden state after content loads — avoiding any flash of unstyled content.
body { opacity: 0; } #Main { opacity: 0; } /* JS adds: --visible class or sets opacity:1 after load */
10 · Key patterns to steal for your app
Nav as context: Replace static nav items with the name of whatever the user is hovering. Zero extra UI, maximum context.
Three-layer list: Deco strokes / background images / clickable text — all aligned in the same DOM position. Hover activates the image layer.
Ghost typography: Use the page title as a near-transparent background element at 8–10vw. Creates depth with zero assets.
Warm off-white background: #fffdfa instead of #fff. Makes images look richer; gives the feel of physical paper.
CSS easing library: Define every bezier curve as a CSS variable. Use --ease-out-quint for entrances, --ease-in for exits (snappier).
Body class state machine: Drive layout modes (inverted header, footer-hidden, color palette) via body classes, not JS style injection.
Opacity 0 on load: Start body/main at opacity:0. Reveal with JS after DOM ready — prevents flash and enables a clean fade-in entry.
Times New Roman for body: Subverting the "clean sans-serif = modern" expectation. Serif at large sizes feels editorial and premium.