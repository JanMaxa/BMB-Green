# BMB-Green — Landing UI Kit

Marketing site for the Czech ISP / telecom / infrastructure company BMB-Green s.r.o.

## What it shows

A single click-thru landing page with the following sections (each a separate JSX file):

| File | Component | Role |
|---|---|---|
| `Header.jsx` | `<Header>` | Sticky top nav with logo, primary nav, phone, CTA |
| `Hero.jsx` | `<Hero>` | Headline + lead + CTAs + headline stats, paired with an interactive address-coverage card |
| `AddressLookup.jsx` | `<AddressLookup>` | The hero's right-side card: type → suggestions → coverage result |
| `PackagesSection.jsx` | `<PackagesSection>` | Three-card pricing grid (Start 100 · Domov 220 · Profi 500), middle is `featured` |
| `ServicesSection.jsx` | `<ServicesSection>` | 4×2 grid of service tiles covering the full portfolio |
| `CoverageSection.jsx` | `<CoverageSection>` | Schematic Brandýs / Praha map with pins + city list |
| `TrustBand.jsx` | `<TrustBand>` | Dark-gray band with four headline numbers |
| `ContactFooter.jsx` | `<ContactCard>`, `<Footer>` | Contact CTA card + dark footer |
| `App.jsx` | `<LandingApp>` | Composes everything; mounted in `index.html` |

`styles.css` is page-specific CSS only — all design tokens come from `/colors_and_type.css`.

## Interactions

- **Address lookup** in the hero — start typing `U Vodojemu` or `Praha` to see suggested addresses; pick one and the green "available speed" panel appears with an Objednat CTA.
- Top-nav links highlight on click (single-page demo, no real routing).
- All cards have soft hover elevation per the system rules.

## Caveats

- All copy is illustrative Czech; please proofread with a native eye before going live.
- Photography is placeholder-free (icon plates instead) — drop in real imagery of fibre installations, antennas on rooftops, technicians on site.
- The coverage map is a schematic; swap for a real tile map (Mapy.cz / Leaflet) in production.
