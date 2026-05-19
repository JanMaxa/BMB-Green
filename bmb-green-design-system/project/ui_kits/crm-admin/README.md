# BMB-Green — CRM / Admin UI Kit

Internal product for BMB-Green staff (sales, support, technicians, billing).

## What it shows

A multi-section internal app driven by a left sidebar. The currently-mounted route renders in the main column.

| File | Component | Role |
|---|---|---|
| `Sidebar.jsx` | `<Sidebar>` | Dark sticky sidebar — logo, grouped nav (Přehled / Zákazníci / Síť / Admin), staff user chip |
| `TopBar.jsx` | `<TopBar>` | Page title + breadcrumb, ⌘K search, notifications, "Nový zákazník" CTA |
| `Dashboard.jsx` | `<Dashboard>` | 4-KPI strip + MRR area chart + activity feed |
| `CustomersPage.jsx` | `<CustomersPage>` | Customer table → click row → customer detail (services + key-value + actions) |
| `TicketsPage.jsx` | `<TicketsPage>` | Support / work-order queue with severity pips & assignees |
| `BillingPage.jsx` | `<BillingPage>` | Invoice table with status pills |
| `NetworkPage.jsx` | `<NetworkPage>` | Network-element inventory (OLTs, patch panels, APs) |
| `App.jsx` | `<CrmApp>` | Composes everything; switches view on sidebar click |

`styles.css` is page-specific CSS only — all design tokens come from `/colors_and_type.css`.

## Interactions

- **Sidebar** — click any item to switch views. Items unrelated to the demo (Smlouvy, Práce techniků, Monitoring, Tým, Nastavení) fall through to an "in development" panel.
- **Customer table** — click any row to open that customer's detail panel with services + key/value metadata; back-button returns to the list.
- **Top search** — ⌘K hint shown; the field is visual-only here.

## Caveats

- The customer / ticket / invoice / network data is fixture data — wire to a real backend in production.
- The MRR chart is hand-rolled SVG, illustrative only. Plug a real series in (Recharts / Apache ECharts) when integrating.
- Czech copy is illustrative.
