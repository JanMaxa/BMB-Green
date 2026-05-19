---
name: bmb-green-design
description: Use this skill to generate well-branded interfaces and assets for BMB-Green s.r.o. (Czech ISP / telecom / security / photovoltaics company), either for production or throwaway prototypes / mocks / decks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files:

- `colors_and_type.css` — single source of truth for tokens. Import this and use `--green-500`, `--ink-800`, `--t-2xl`, `--shadow-md`, etc.
- `assets/` — logo, mark, and 46 outline icons (`assets/icons/*.svg`).
- `preview/` — small specimen cards showing each token group and component in isolation.
- `ui_kits/landing/` — high-fidelity marketing site (hero, packages, services, coverage, contact).
- `ui_kits/crm-admin/` — internal product (sidebar, dashboard, customers, tickets, billing, network).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts *or* production code, depending on the need.

## Quick-reference rules

- **Primary CTA** is always `--green-500` (`#14AE4B`). Reserve green for action — don't tint decorative shapes.
- **Background** is white. The only allowed gradient is the soft `--green-50 → white` hero wash.
- **Text** is `--ink-800` (`#1E2221`). Never `#000`.
- **Type** is Manrope across the board (400/500/600/700/800). Mono is JetBrains Mono.
- **Voice** is Czech-first, polite "Vy" form, plainspoken, fact-led. Numbers do the heavy lifting.
- **Icons** are 24 px, 1.75-px stroke, outline, `currentColor`.
- **Cards** are white, 1 px `--border`, 10 px radius, optional `--shadow-sm`. No coloured-left-border accent cards.
- **No emoji** in marketing copy.
- **No purple / blue gradient meshes, no isometric 3D blobs, no stock illustrations.**
