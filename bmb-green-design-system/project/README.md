# BMB-Green Design System

**Brand:** BMB-Green s.r.o.  
**Industry:** Telecommunications & infrastructure (ISP, digital TV, VoIP, security/CCTV, photovoltaics, low-voltage networks)  
**Established:** 1991  
**Locale:** Czech Republic (Brandýs nad Labem, Praha)  
**Web:** bmb-green.cz  
**Primary languages:** Czech (cs-CZ), with occasional English (en) for technical docs

---

## What does the company do?

BMB-Green is a long-standing Czech infrastructure & services company that wears several hats:

1. **Consumer ISP & telecom** — high-speed fibre/wireless internet (up to 220 Mb/s), digital television, and low-cost VoIP calling, mostly serving residential developments in greater Prague (Brandýs nad Labem, Praha 5 Zbraslav, Praha 6 Střešovice, and similar).
2. **B2B infrastructure** — installation and servicing of EZS/EPS security systems, CCTV, access control, structured cabling, sound systems, fibre-optic networks, antenna/satellite systems.
3. **Photovoltaics** — design and implementation of solar power plants and rooftop PV.
4. **Developer-grade installations** — turnkey low-voltage + connectivity work for new residential developments.

The brand is therefore **trustworthy, technical, practical** — a Czech utility company with a green / efficiency angle (both in name and in their PV/efficiency portfolio).

---

## Products represented in this design system

| Surface | Audience | Tone | Files |
|---|---|---|---|
| **Landing page** (`ui_kits/landing/`) | Residential & developer prospects | Clear, confident, locally-rooted; "fastest internet in town" | Hero, packages, coverage map, address lookup, contact |
| **CRM / Admin** (`ui_kits/crm-admin/`) | Internal staff (sales, support, technicians) | Dense, efficient, scannable | Dashboard, customer detail, services & billing, work-order/ticket queue |

Both surfaces share the **same tokens** (`colors_and_type.css`) and component vocabulary; the CRM just composes them tighter.

---

## Sources used

The user provided **no codebase, Figma file, or design assets** for this project. The design system was built from:

- **Brand direction** given in the brief: white background, modern green CTA, dark gray primary.
- **Public company context** gathered from `bmb-green.cz`, `firmy.cz`, `aaapoptavka.cz`, and the Czech business registry (`rejstrik-firem.kurzy.cz`) to understand product mix, locale, and tone.

> ⚠️ **The logo, iconography, and all visual assets in `assets/` are original** to this design system. They reflect the brand direction but are **not lifted from the real company**. If you have the real `logo.png`, brand book, or any production CSS/components, drop them in and we'll align the system to them.

---

## Index

```
/  (root)
├─ README.md                 ← this file
├─ SKILL.md                  ← Agent-Skills entry point
├─ colors_and_type.css       ← all design tokens (single source of truth)
├─ assets/
│   ├─ logo.svg              ← horizontal wordmark (light bg)
│   ├─ logo-on-dark.svg      ← horizontal wordmark (dark bg)
│   ├─ mark.svg              ← square mark only (favicon/app)
│   └─ icons/                ← curated SVG icon set (Lucide-style)
├─ fonts/                    ← Google-Fonts substitutions noted below
├─ preview/                  ← cards rendered in the Design System tab
│   ├─ colors-*.html
│   ├─ type-*.html
│   ├─ spacing-*.html
│   ├─ shadows-*.html
│   ├─ radii.html
│   ├─ buttons.html / inputs.html / badges.html / cards.html …
│   └─ logo.html / icons.html
└─ ui_kits/
    ├─ landing/              ← Landing page (Czech ISP marketing)
    │   ├─ README.md
    │   ├─ index.html
    │   └─ *.jsx             ← Hero, PackageCards, Coverage, AddressLookup, etc.
    └─ crm-admin/            ← CRM / admin (internal)
        ├─ README.md
        ├─ index.html
        └─ *.jsx             ← Sidebar, CustomerTable, TicketQueue, BillingPanel, etc.
```

To use the system in a new file:

```html
<link rel="stylesheet" href="/colors_and_type.css">
<!-- Now you have --green-500, --ink-800, --t-2xl, --shadow-md, etc -->
```

---

## Content fundamentals

> **TL;DR — Czech-first, plainspoken, confident, locally rooted. Sound like an experienced operator, not a startup.**

### Voice
- **First person plural ("my"/"we")** when speaking as the company: *"Zajišťujeme rychlou instalaci."* / *"We handle quick installation."*
- **Second person formal ("Vy" / capital V)** when addressing the customer — the polite Czech address is non-negotiable for this audience.
- **Confident, fact-led, no hype.** Numbers do the heavy lifting: *"až 220 Mb/s"*, *"od roku 1991"*, *"instalace do 2–3 pracovních dnů"*.
- **Czech-locale punctuation:** non-breaking spaces between numbers and units (220 Mb/s, 24 h), en-dash for ranges (2–3 dnů), em-dash in apposition.

### Casing
- **Sentence case** in body copy. UI labels & menu items: sentence case in Czech (*"Ke stažení"*, *"Kontakty"*), not Title Case.
- **Brand always written:** `BMB-Green` (capital B-M-B, hyphen, capital G). Never `bmb green` or `BMBGreen` in body copy. The wordmark may render `BMB` in dark and `Green` in primary green for visual emphasis.
- Buttons: short verbs — *"Zjistit dostupnost"*, *"Objednat"*, *"Kontaktujte nás"*. Avoid ALL CAPS except on small uppercase eyebrows (with letter-spacing).

### Vocabulary tells
- Service names stay in Czech even in English contexts: *Balíčky* (Packages), *Televize*, *Internet*, *Volání* (Calling), *Ke stažení* (Downloads), *Novinky* (News), *Kontakty*.
- Technical units in Latin/SI: Mb/s, GHz, V, W, m², dB.
- The "Green" in the name does **double duty**: brand colour + the company's photovoltaic line. Lean into it where it's true (PV, efficiency) — don't fake eco-marketing.

### What we don't do
- ❌ Exclamation marks. (One per page at most.)
- ❌ Emoji in product copy. (Allowed inside the CRM in technician notes, but never in marketing.)
- ❌ Startup-isms: "supercharge", "unlock", "next-gen", "revolutionary".
- ❌ Address customers casually ("ty"). Czech audience expects "Vy".
- ❌ Stock-photo testimonials with fake names.

### Example pairs

| ❌ Avoid | ✅ Use |
|---|---|
| "Get the BEST internet ever! 🚀" | "Nejrychlejší Internet ve městě — až 220 Mb/s." |
| "Sign up now!!" | "Zjistit dostupnost na Vaší adrese" |
| "Our amazing team" | "Tým techniků s licencí ČTÚ, dostupný 24/7" |
| "Hi! We love helping you." | "Kontaktujte nás. Volejte 266 317 129, po–pá 8–17 h." |

---

## Visual foundations

> **TL;DR — White canvas. Green for action, dark gray for structure. Generous whitespace, soft shadows, sturdy 1-px borders. No gradients except a single brand-green wash on hero. No illustrations — clean photography of fibre, antennas, rooftops, technicians.**

### Colour
- **Primary green** is `--green-500` `#14AE4B`. It is the **only** colour that signals action: CTAs, links, focus rings, key chart series. Hover steps to `--green-600`, pressed to `--green-700`. Don't tint shapes green for decoration; reserve it.
- **Dark gray** `--ink-800` `#1E2221` is the primary text colour. The near-black `--ink-900` only for the heaviest display type or the dark navigation bar.
- **Neutrals** lean very slightly cool-green so they harmonise with the brand; pure `#000` is forbidden.
- **Semantic palette** (success, info, warning, danger) lives in `colors_and_type.css`. Success **is the brand green**; do not duplicate it as a separate teal.
- Backgrounds are 99% white. Use `--bg-subtle` (#FAFBFA) for the second-tier surface (sidebars in CRM, alt rows). Never grey gradients.

### Type
- **Manrope** across the board. 400 / 500 for body, 600 for UI, 700 for headlines, 800 for display & wordmark.
- Headlines pack tight: `letter-spacing: -0.02em`, `line-height: 1.1`. Body is `1.45–1.6`.
- One mono face: **JetBrains Mono** for IDs, MAC addresses, IBAN, console snippets.
- Eyebrow / overline labels: 12 px, 800 weight, `letter-spacing: 0.12em`, **uppercase**, coloured `--green-700`.

### Backgrounds
- **No gradients** except *one* hero treatment: a soft top-to-bottom `--green-50` → white wash to keep the page warm. Do not use this gradient on internal pages.
- **No photo overlays** with text on full-bleed imagery. If imagery is full-bleed, captions sit on white plates beneath, not on the image.
- **No repeating patterns / textures.** A single, optional motif: thin dotted half-tone in `--ink-100` (used at low opacity on map placeholders or coverage tiles).

### Animation
- Single easing: `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-out`) for entrances; symmetric `cubic-bezier(0.65, 0, 0.35, 1)` (`--ease-in-out`) for state changes.
- Durations: 120 ms (hover/focus), 180 ms (button press, menu open), 280 ms (page-level reveals).
- **No bounces. No spring. No long parallax.** This is a utility company; motion is functional.
- Skeleton loaders pulse `--ink-50` ↔ `--ink-100` at 1.2 s.

### Hover & press
- **Buttons:**
  - Primary: bg `--green-500` → hover `--green-600` → press `--green-700`. No scale change.
  - Secondary (outlined): bg transparent → hover `--green-50` + border `--green-500`.
  - Ghost: bg transparent → hover `--ink-50`.
- **Links:** colour `--green-500` → hover `--green-700` + underline.
- **Cards (interactive):** raise `--shadow-sm` → `--shadow-md` on hover, **never translate**. Press = `--shadow-xs` (sink).
- **Rows in tables/lists:** hover `--ink-25`, selected `--green-50` with 2-px left rule in `--green-500`.

### Borders
- Default: **1 px solid `--border` (`--ink-100`)**. Stronger borders (modals, key cards) use `--ink-200`.
- Focus ring: 2 px green outline **plus** `--shadow-focus` (4 px green @ 18% opacity) — always both, never `outline: none` without replacement.
- No double borders. No dashed borders except for empty-state drop zones (dashed, `--ink-300`, 1.5 px).

### Shadow system
- Five elevations: `--shadow-xs` (chips, hairline) → `--shadow-xl` (modals/popovers).
- Shadows are **soft and dark-gray-tinted**, never blue or purple. Y-offset always larger than X.
- **No inner shadows** in product UI (except the subtle hairline inside inputs on focus, which is the focus ring).

### Layout
- 12-column grid, 24 px gutter, max width 1200 px (`--container-max`). Container padding clamps from 16 → 48 px.
- **Vertical rhythm:** sections separate with 80 px (mobile) → 128 px (desktop) of breathing room. Inside a section: 48 px between blocks, 24 px between rows.
- Sticky elements: top nav (64 px), CRM sidebar (260 px expanded / 64 px collapsed). Modals never sticky.

### Transparency & blur
- Used **only** for the mobile nav drawer scrim (`rgba(18,21,20,0.5)` + 8 px backdrop blur) and the sticky-top-nav when scrolled (`rgba(255,255,255,0.85)` + 12 px blur). Nowhere else.

### Imagery direction
- Real photography: fibre patch panels, antennas on Brandýs rooftops, technicians in branded polo shirts, solar arrays at golden hour.
- Treatment: **warm**, slight green colour-cast acceptable, never desaturated grayscale, never heavy grain. Sky blue stays blue.
- **No stock illustrations**, no 3D blobs, no isometric servers, no abstract gradient meshes.

### Corner radii
- **10 px (`--r-md`)** is the workhorse: buttons, inputs, cards.
- **14 px (`--r-lg`)** for elevated cards / dialog corners.
- **20 px (`--r-xl`)** for hero/feature panels.
- **999 px (`--r-pill`)** for tags, status pills, the round "call" CTA.
- **4–6 px (`--r-xs`/`--r-sm`)** for inline chips and the CRM-table tags.

### Cards
- White background, 1 px `--border`, `--r-md` radius, internal padding 24 px, optional `--shadow-sm`.
- Hover (if interactive): `--shadow-md` + border darkens to `--border-strong`.
- Selected state: `--accent-soft` (`--green-50`) bg + 1 px `--green-500` border.
- **No coloured-left-border accent cards.** No emoji-only cards. No purple/blue gradient cards.

---

## Iconography

> **Single sourced system:** all UI icons are 24 × 24 SVG, 1.75-px stroke, round line-caps, no fills (outline style). The set is original to this design system, modelled on the Lucide visual language — pick any Lucide icon as a drop-in substitute and it will sit naturally next to ours.

- **Where they live:** `assets/icons/*.svg` — open them in the `preview/icons.html` card to browse.
- **Sizing:** 16 px (inline / chips), 20 px (form fields), 24 px (default UI), 32 px (feature tiles), 48 px+ (hero illustration tiles).
- **Stroke:** 1.75 px, `stroke="currentColor"` — inherits text colour. Tint with `color:` on the parent.
- **Brand-coloured icons:** allowed only for feature tiles on landing (`color: var(--green-500)`). Otherwise icons follow text colour.
- **No filled / two-tone icons.** No emoji as UI icons in marketing surfaces. The CRM may use one or two filled status glyphs (the dot pip on a customer row, the bell badge) — these are CSS shapes, not icons.
- **Unicode characters used as glyphs:** `→` (arrow in links), `•` (separator bullet), `—` (em-dash), `·` (small dot). The `›` chevron is *not* used — we use the SVG chevron-right.
- **Substitution policy:** if you need an icon we don't have, grab the Lucide SVG at `https://unpkg.com/lucide-static@latest/icons/<name>.svg`, set `stroke="currentColor"` `stroke-width="1.75"`, and commit it under `assets/icons/`.

### Concrete icon list shipped (in `assets/icons/`)

`wifi`, `tv`, `phone`, `map-pin`, `bolt` (PV / power), `shield-check` (security), `camera` (CCTV), `sun` (PV), `fiber` (custom — fibre strand), `download`, `mail`, `arrow-right`, `chevron-right`, `chevron-down`, `check`, `plus`, `minus`, `x`, `search`, `settings`, `user`, `users`, `home`, `building`, `bell`, `clock`, `calendar`, `credit-card`, `file-text`, `external-link`, `more-horizontal`, `menu`.

---

## Font substitution flag

The user did not provide font files. **Manrope** (Google Fonts) was chosen as the closest **modern, geometric, friendly Czech-diacritics-safe sans** — it covers Czech glyphs including ě š č ř ž ý á í é ů ů ť ď ň cleanly. **JetBrains Mono** is the mono companion.

If BMB-Green has an existing typeface (a custom sans, or a paid licence like *FF Mark*, *Cera Pro*, *Brother 1816*), please drop the `.woff2` files into `fonts/` and update the `--font-sans` / `--font-display` vars at the top of `colors_and_type.css`. Manrope is a strong stand-in but is **not** confirmed as the brand face.

---

## Caveats & open questions for you

1. **No real brand assets** were provided — logo, colour spec, type, illustrations are all interpretations of your brief. If a real brand book exists, we'll align tightly to it.
2. **CRM/Admin is a fresh design** — there is no existing screen reference. The structure assumes ISP-style customer + service + ticket + billing entities. Confirm or adjust the entity model.
3. **Imagery is placeholder** — coloured plates with iconography stand in for real photography. Drop in real photos and we'll polish.
4. **Czech copy** in the UI kits is illustrative; please proofread with a native eye before going live.
