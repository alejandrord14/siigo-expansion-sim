---
name: Expansion Builder
description: Simulador de priorización de expansión de módulos, con la retícula visual de Siigo Nube — riel azul icon-only, tarjetas gris claro sobre lienzo blanco
colors:
  blue: "#009DFF"
  blue-strong: "#0077C2"
  blue-strong-hover: "#00659F"
  blue-tint: "rgba(0, 157, 255, 0.10)"
  blue-tint-strong: "rgba(0, 157, 255, 0.18)"
  blue-on-tint: "#0067A9"
  green: "#1AA260"
  green-strong: "#15834E"
  green-strong-hover: "#106B3F"
  green-tint: "rgba(26, 162, 96, 0.12)"
  green-on-tint: "#137646"
  amber: "#B7791F"
  amber-tint: "rgba(183, 121, 31, 0.12)"
  amber-on-tint: "#8C5D18"
  red: "#D14343"
  red-tint: "rgba(209, 67, 67, 0.12)"
  red-on-tint: "#BD2E2E"
  surface: "#FFFFFF"
  panel: "#F5F6F8"
  text: "#1F2430"
  text-muted: "#5F6B78"
  border: "#E4E7EC"
  border-soft: "#EEF0F3"
typography:
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 700
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.03em"
rounded:
  sm: "10px"
  md: "12px"
  lg: "20px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "40px"
components:
  button-primary:
    backgroundColor: "{colors.green-strong}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "9px 16px"
  button-primary-hover:
    backgroundColor: "{colors.green-strong-hover}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "9px 16px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "9px 16px"
  card:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.lg}"
  chip-ok:
    backgroundColor: "{colors.green-tint}"
    textColor: "{colors.green-on-tint}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  chip-warning:
    backgroundColor: "{colors.amber-tint}"
    textColor: "{colors.amber-on-tint}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  chip-danger:
    backgroundColor: "{colors.red-tint}"
    textColor: "{colors.red-on-tint}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  chip-value:
    backgroundColor: "{colors.blue-tint}"
    textColor: "{colors.blue-on-tint}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  nav-link-active:
    backgroundColor: "rgba(255,255,255,0.22)"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
---

# Design System: Expansion Builder

## Overview

**Creative North Star: "The Siigo-Adjacent Cockpit"**

Expansion Builder borrows the retina of a real product — Siigo Nube's icon-only blue sidebar, white topbar with a wordmark and a green primary action, light-gray card panels on a white canvas — to make a one-person prototype feel like it belongs inside the tool it's simulating, without borrowing any Siigo mark, name, or copy. Everything about it says "this is a working screen inside a SaaS," never "this is a landing page." The blue identity color reads as navigation and selection chrome, not as a page-filling brand statement; the sidebar is the only place blue covers real area, and even there it's a darkened, WCAG-safe stand-in for the literal requested hex, not the hex itself.

It is an Operate-mode tool with a synthetic, disclosed-as-fake data set: no hero imagery, no persuasive copy, no marketing surfaces. The system-font stack, disclosure popovers instead of dialogs, and a card-on-white (not card-on-gray) layering are all deliberate signals that this is a control panel someone actually uses, not a pitch.

**Key Characteristics:**
- Card-on-white, not white-on-gray: `.card` panels (`#F5F6F8`) sit on a pure-white page canvas — the inverse of a gray-canvas/white-card convention.
- Blue is chrome, not wallpaper: the only large solid-blue fill is the 72px icon sidebar; everywhere else blue is a thin tint, ring, or accent.
- Three-tier same-hue color system (base / -strong / -on-tint) exists purely to satisfy contrast math, not as a stylistic choice — each tier has one job.
- Status color (green/amber/red badges) is a semantically separate channel from blue (navigation/selection/primary-action) — never conflated.
- Icon language is uniform: every icon in the app is a hand-authored inline SVG, 24×24 viewBox, 1.75 stroke-width, round caps/joins — no icon font, no icon library.

## Colors

A brand-blue identity accent split into three same-hue tiers to satisfy contrast at each context, sitting on top of a near-monochrome white/light-gray neutral base, with an independently-governed green/amber/red status channel.

### Primary
- **Brand Blue** (`#009DFF`): the literal requested identity hue. Used only for thin accents and tints on white/light backgrounds (focus outlines, table row hover, decorative borders) — never as a solid fill carrying content, because at ~2.9:1 against white it falls short of the 3:1 UI-component contrast floor.
- **Blue Strong** (`#0077C2`): the accessible working shade (~4.75:1 on white) that carries every solid blue fill with white/light content on top — the sidebar background, avatar background, slider thumb, focus rings, active header-button border/text, selected-row chevron.
- **Blue Tint** (`rgba(0, 157, 255, 0.10)`) / **Blue Tint Strong** (`rgba(0, 157, 255, 0.18)`): backgrounds for the control-value chip and the active-row highlight, respectively.
- **Blue-on-Tint** (`#0067A9`): text sitting directly on a blue tint chip (the control-value pill, the selected customer's name) — computed to clear 4.5:1 against the tint as composited over `--panel`, not against plain white, since every instance of this pairing renders inside a `.card`.

### Secondary
- **Green Strong** (`#15834E`): the app's one primary-action fill — the "Restablecer valores por defecto" button in the topbar. Reused from the tool's actual reset feature rather than an invented action, placed in the visual slot a Siigo-style header reserves for its green primary button.
- **Green** (`#1AA260`) / **Green Tint** (`rgba(26,162,96,0.12)`) / **Green-on-Tint** (`#137646`): reference tier and the "ok" status badge pairing (text-on-tint) — status use only, never a page action.

### Tertiary (status)
- **Amber** (`#B7791F`) with tint (`rgba(183,121,31,0.12)`) and on-tint text (`#8C5D18`): the "a considerar" / warning badge — never a button fill, badge-only.
- **Red** (`#D14343`) with tint (`rgba(209,67,67,0.12)`) and on-tint text (`#BD2E2E`): the "no listo" / danger badge — never a button fill, badge-only.

### Neutral
- **Surface** (`#FFFFFF`): the page canvas, the topbar, and any element that needs to read as one step more "recessed" inside a gray card (selects, slider track, table `thead`, detail-highlight tiles, popover panels).
- **Panel** (`#F5F6F8`): every `.card` — the intro header, controls panel, metric tiles, table card, detail card — reads as a distinct surface against the white page.
- **Text** (`#1F2430`): primary text — dark gray-black, deliberately not pure black.
- **Text Muted** (`#5F6B78`): labels, descriptions, table headers, footer copy — computed to clear 4.5:1 against both white and panel.
- **Border** (`#E4E7EC`) / **Border Soft** (`#EEF0F3`): 1px dividers; `border` for structural lines (topbar, table header, popover edge), `border-soft` for lighter internal seams (card outline, row dividers, detail-highlight tile border).

### Named Rules
**The Three-Tier Hue Rule.** Every accent color that needs to sit both as a solid fill and as text-on-tint gets three tokens, never one: a reference tone, a `-strong` tone for solid fills with light content on top, and an `-on-tint` tone (computed against the tint composited over `--panel`, not white) for text sitting on that color's own tint. Skipping a tier and reusing the reference tone in a contrast-bearing context is how a token stops being accessible.

**The Status-Never-Navigation Rule.** Green/amber/red badge colors classify customer status; blue governs navigation, selection, and the one primary action. The two channels never swap roles — a badge is never blue, and navigation/selection chrome is never green/amber/red.

## Typography

**Body/Display/Label Font:** system-ui (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`) — one family for the whole app, no font file loaded.

**Character:** No brand typeface. The native OS font is a deliberate Operate-mode call — this is a working tool, not a marketing surface that needs typographic voice.

### Hierarchy
- **Title** (700, 22px): the intro `<h1>` and every section `<h2>` ("Panel de reglas", "Resultados", "Clientes sintéticos") — the largest text in the app; there is no larger display step in use.
- **Sub-title** (700, 18px): the selected customer's name in the detail panel header — one step down from Title so it doesn't compete with the section heading above it.
- **Body** (500, 14px): the majority of interface text — control labels, select values, table cells, detail explanation text.
- **Label** (600, 12px, uppercase, letter-spacing 0.03em): table column headers and the mobile stacked-card row labels (`content: attr(data-label)`).
- **Metric Value** (700, 26px): the six result-tile numbers — the only place text scales up past Title, reserved for the headline number of a metric card.

### Named Rules
**The No-Larger-Than-Title Rule.** No page-chrome text (headings, labels, body) exceeds the 22px/700 Title step; only a metric card's numeral is allowed to read larger (26px), because it is data, not a heading.

## Layout

Two-zone app shell: a fixed 72px icon-only sidebar (blue) and a fluid main area. Inside the main area, a 72px white topbar (1px bottom border) precedes scrollable content.

Content lives in a `.container` with `max-width: 1100px`, centered, `24px` side padding. Sections (`.intro`, `.controls`, `.metrics`, `.companies`) stack vertically with generous `padding-bottom` (24–120px) that grows with how much trailing space the section needs — `.companies` carries `120px` specifically to clear the fixed footer.

Data lives in explicit grids, never free-flowing text:
- Controls panel: 2-column grid, `gap: 32px 40px` (collapses to 1 column under 640px).
- Results: 6-column grid, `gap: 20px` (collapses to 3 columns under 1100px, 2 columns under 640px).
- Customers + detail: `3fr 2fr` grid, `gap: 24px` (collapses to 1 stacked column under 900px); the detail card is `position: sticky` (`top: 24px`) while side-by-side, `static` once stacked.

### Responsive: sidebar → slide-in drawer (under 900px)
On desktop the sidebar is `position: sticky`, always visible at 72px — it never collapses regardless of width or interaction. Under 900px it becomes `position: fixed`, hidden by default (`translateX(-100%)`, 0.25s transition), and opens as a full-height drawer over a semi-transparent overlay (`rgba(16,24,40,0.4)`). A hamburger button (three bars, appears left of the wordmark) opens it; a close button inside the rail, the overlay, or Escape all close it. `body` gets `overflow: hidden` while open.

Also under 900px: header action buttons collapse to icon-only (button text hidden) and the decorative "ES" language label hides — fixed during this redesign after mobile testing surfaced the wordmark being squeezed out by three full-text buttons at narrow widths.

### Named Rules
**The Grid-Not-Flow Rule.** Any collection of related data (rules, results, customers) lives in an explicit-column grid with a defined collapse breakpoint — never in free-flowing text.

## Elevation & Depth

Flat with light ambient lift: one primary card shadow (`--shadow-card: 0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.06)`) separates every `.card`, select, and the live-metrics bar from the white/gray surfaces beneath them — subtle enough to read as "distinct surface," never as "floating, pressable object." A heavier shadow (`--shadow-pop: 0 12px 32px rgba(16,24,40,0.14)`) exists solely for popover panels (help, profile), which genuinely float above page content. The mobile sidebar drawer gets its own directional shadow (`4px 0 24px rgba(16,24,40,0.18)`) as it slides over the overlay.

### Shadow Vocabulary
- **shadow-card** (`0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.06)`): every card, select, slider track, and the live-metrics bar.
- **shadow-pop** (`0 12px 32px rgba(16,24,40,0.14)`): popover panels (help, profile) — reserved for genuinely floating overlays.

### Named Rules
**The Ambient-Not-Structural Rule.** Shadow communicates "this is a separate surface," never "this is elevated because it's interactive." The one exception is `shadow-pop`, reserved exclusively for floating popover panels that sit above page content by definition.

## Shapes

Four-step corner scale: `10px` (`--radius-sm`, small chips, sidebar nav items), `12px` (`--radius-md`, buttons, inputs, selects, detail-highlight tiles), `20px` (`--radius-lg`, every card-level container), and `999px` (pills — status badges, the control-value chip, avatar circle uses `50%` instead). This is a step up from an earlier 16px card / 10px control scale; the corner language reads slightly softer than a tighter, more institutional grid would.

No decorative borders: `--border` (`#E4E7EC`) and the lighter `--border-soft` (`#EEF0F3`) are the only stroke weights, used for structural dividers (topbar, table header, popover edge) and lighter internal seams (card outline, row dividers) respectively. The avatar is the only fully circular element.

### Named Rules
**The Pill-Means-Status Rule.** `999px` radius is reserved for elements communicating state or an active value (badges, the control-value chip) — never used on a general content container.

## Components

### Buttons
- **Shape:** `12px` radius (`--radius-md`).
- **Primary:** `--green-strong` solid fill, white text, no border, `padding: 9px 16px` — the app's one primary action (reset rules), in the header.
- **Secondary (header-btn):** white background, 1px `--border`, `--text` label — used for the Ayuda disclosure trigger; on hover the background shifts to `--panel`; when its popover is open (`aria-expanded="true"`), border and text switch to `--blue-strong`.
- **Hover/Focus:** primary darkens to `--green-strong-hover`; all interactive elements get a `2px solid --blue-strong` focus-visible outline (offset varies by context, sometimes negative for table controls to stay inside the row).

### Chips / Badges
- **Style:** solid-color text on a 10–12%-opacity tint of the same hue, `999px` radius, `padding: 3px 10px`, `12px/600`.
- **Variants:** `ok` (green), `warning` (amber), `danger` (red) — status only.
- **Control-value chip:** same tint-pill pattern but in blue (`--blue-tint` / `--blue-on-tint`), showing a slider's live value next to its label, updated on every `input` event.

### Cards / Containers
- **Corner Style:** `20px` (`--radius-lg`).
- **Background:** `--panel` (`#F5F6F8`) on the white page canvas — the load-bearing inversion of a gray-canvas/white-card convention.
- **Shadow Strategy:** `shadow-card` only (see Elevation & Depth).
- **Border:** 1px `--border-soft`.
- **Internal Padding:** varies by density — `40px 48px` (intro task header), `40px` (controls card, 24px under 900px), `32px` (detail card), `22px` (metric tiles), `0` where the card wraps a scrolling table directly.

### Inputs / Fields (Select, Range)
- **Select:** white background (one step lighter than its parent card), 1px `--border`, `12px` radius, inline SVG chevron (no icon font), `--shadow-card` ambient lift. Focus: border shifts to `--blue-strong` plus a `2px` outline in `--blue-tint-strong` — a visible ring, not just a border-color change.
- **Range slider:** `6px` white track with an inset 1px `--border` ring, `--blue-strong` accent-color; thumb is an `18px` circle in `--blue-strong` with a `3px` white border and a soft drop shadow. Value shown live in the blue control-value chip on every `input` event, never only on release.

### Navigation (Sidebar)
- **Style:** icon-only rail, `72px` wide, solid `--blue-strong` background. Four hand-authored inline-SVG icons (home / rules / results / customers), `24×24` viewBox, `1.75` stroke, round caps/joins, no text labels — each link carries `aria-label` and `title` for accessibility.
- **Default/Hover/Active:** default icon color is white at 72% opacity; hover raises it to white 100% with a `14%`-opacity white background; active state is a `22%`-opacity white background — translucent-white overlays rather than a color swap, since the rail is already the brand color.
- **Mobile:** under 900px the rail becomes a fixed, off-canvas drawer (`translateX(-100%)` at rest) opened by a topbar hamburger button and closed via its own close button, the overlay, or Escape.

### Topbar
- **Style:** `72px` tall, white, 1px bottom border. Left: hamburger (mobile only) + plain-text wordmark ("Expansion Builder", no logo asset). Right: static "ES" label (non-interactive, Spanish-only app), an Ayuda disclosure-popover button, the green primary reset button, and the profile avatar popover.
- **Popovers:** both Ayuda and the profile menu are plain disclosure widgets — trigger button with `aria-haspopup`/`aria-expanded`/`aria-controls`, panel toggled via the `hidden` attribute, no `role="dialog"` and no focus trap, because neither panel holds focusable content. `shadow-pop` + `20px` radius + 1px `--border`.

### Table (Clientes sintéticos)
- **Header:** white `thead` (one step lighter than the table's card), `label` typography (12px/600 uppercase, `text-muted`), 1px `--border` bottom.
- **Rows:** 1px `--border-soft` bottom; interactive rows show pointer cursor, a faint blue-tint hover (`rgba(0,157,255,0.05)`), and `--blue-tint-strong` when selected, with the customer name switching to `--blue-on-tint` on the active row.
- **Columns (desktop):** `table-layout: fixed` via `colgroup` (Cliente 32%, Antigüedad 23%, Actividad 22%, Estado 23%) — calibrated so no header or badge wraps or forces horizontal scroll.
- **Mobile (under 900px):** `thead` hides; each row becomes a bordered, `12px`-radius card with `label: value` rows via `content: attr(data-label)` — never truncates, never forces scroll.

### Metric / Stat Tile (Resultados)
- **Style:** standard `.card` with `22px` padding; a `40px` circular icon badge (`--blue-tint` background, `--blue-strong` icon, 1px subtle border) sits above the label+value pair — same hand-authored SVG icon language as the sidebar, added to the pre-existing tile layout rather than a restructure. Label is `13px` muted, value is `26px/700` in `--text`.

## Do's and Don'ts

### Do:
- **Do** carry a solid accent fill only through the `-strong` token (`--blue-strong`, `--green-strong`) — the reference hue (`--blue`, `--green`) is for thin accents and tints on white only.
- **Do** compute on-tint text contrast against the actual composited background (tint over `--panel`), not against plain white, since every tint chip in this app renders inside a `.card`.
- **Do** keep `.card` panels on `--panel` and the page canvas on `--surface` (white) — never invert this pairing.
- **Do** author every icon as inline SVG at `24×24`, `1.75` stroke-width, round caps/joins — no icon font, no icon library.
- **Do** update any value derived from a slider (its chip, live-metrics bar, result tiles, detail panel) on the `input` event, not `change` or on release.

### Don't:
- **Don't** use the raw `--blue` (`#009DFF`) hex as a solid fill carrying content — it falls short of 3:1 against white.
- **Don't** recolor a status badge (ok/warning/danger) to blue, or use green/amber/red for navigation or selection chrome — the two channels stay independent.
- **Don't** add a heavier shadow than `--shadow-card` to a resting card; `--shadow-pop` is reserved for popovers that genuinely float above content.
- **Don't** add hero imagery, illustration, or persuasive copy — this is an Operate-mode tool with disclosed-synthetic data, not a marketing surface.
- **Don't** treat the favicon/OG-image assets as reflecting the current identity — see below.

**Known open item, not part of the system:** `favicon.svg`, `favicon.png`, and `og-image.png` still carry the prior product's "RB" mark and navy/teal colors. This is a disclosed follow-up defect, not a color or mark to canonize — the system's actual identity color is blue/green as documented above, and these assets are pending regeneration to match it.
