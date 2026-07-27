# Handoff: Cierre mensual — Agenttis MVP (v3)

## Overview

A redesign of the month-end close for a Uruguayan accounting practice working on behalf of a pyme
client. The flow ingests the client's raw files (compras, ventas, saldos iniciales, extracto
bancario), normalises them to the practice's own criterion, surfaces only the decisions a human must
make, computes the period's tax obligations, and exports a delivery package (libros, DGI summary,
ERP journal entries).

The design's organising idea: **the close is a sequence, so the navigation is the sequence**, and the
home screen is not a dashboard but a queue of the open steps. Everything the system already resolved
is collapsed out of sight. Secondary detail lives in hover tooltips rather than on the page.

Target codebase for this implementation: the existing Next.js app in this repo
(`src/app`, `src/components`, `src/context/DashboardContext.tsx`). This design **replaces**
`MonthlyCloseTab.tsx` as the close experience and absorbs `BankReconciliationTab.tsx` and
`TaxAlertsTab.tsx` as steps 3 and 4 of one flow, rather than three peer tabs reached from `HomeTab`.

## About the design files

`Agenttis MVP v3.dc.html` in this bundle is a **design reference written as HTML** — a prototype of
the intended look, information architecture and behaviour. It is **not production code to copy**. It
uses a small HTML-template runtime (`support.js`, `<sc-for>`, `<sc-if>`, `{{ holes }}`) that exists
only to make the prototype interactive; do not port that runtime.

The task is to **recreate these screens in the existing Next.js + React + TypeScript app**, using its
established patterns: `useDashboard()` from `src/context/DashboardContext.tsx` for shared state, the
`src/components/ui/*` primitives (`Button`, `Card`, `Input`, `Badge`, `Heading`), `TRANSLATIONS` in
`src/lib/translations.ts` for copy, `lucide-react` for icons, and the CSS-variable theming already in
`src/app/globals.css`.

Two notes on that environment:

- The prototype is **light-themed**; the current app is dark. The design tokens below are the light
  ("Industry") set. Either introduce them as a light theme in `globals.css` alongside the existing
  variables, or map them onto the existing variable names — but do not mix the two palettes on one
  screen.
- The prototype uses inline styles because of its runtime. In the app, use whatever the codebase
  already does (Tailwind classes + CSS variables, per `HomeTab.tsx`).

## Fidelity

**High fidelity.** Colors, typography, spacing, copy (Spanish, Uruguayan register), interaction and
empty/settled states are all final and should be reproduced closely. Exact values are in
**Design tokens** below and in the reference file.

## Design tokens

From `_ds/industry-.../styles.css` (included in this bundle as `styles.css`). Use the variable names,
not the literals, wherever the codebase allows.

### Color

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#f2f2f3` | page ground, and text reversed out of the dark field |
| `--color-surface` | `#e9e9ea` | input fills |
| `--color-text` | `#1d1f20` | body and headings |
| `--color-accent` | `#5980a6` | the only accent: active nav, primary button, blocker markers |
| `--color-divider` | `color-mix(in srgb, #1d1f20 16%, transparent)` | every hairline border |
| `--color-accent-800` | `#2c455d` | accent-tinted **text** (paragraph-size accent copy) |
| `--color-accent-900` | `#1d2d3d` | the reversed field (overdue BPS row), large accent figures |
| `--color-accent-600` | `#597ea3` | primary button hover |
| `--color-accent-700` | `#416180` | primary button active, link color |

Muted text is `color-mix(in srgb, var(--color-text) 55%, transparent)`; secondary body copy is the
same at 60–62%. Accent tints for panels are `color-mix(in srgb, var(--color-accent) 7–9%, transparent)`.

Signed amounts use two additional hues, defined in OKLCH so they sit with the steel accent:

| Token | Value | Use |
| --- | --- | --- |
| positive sign | `oklch(0.53 0.10 152)` | the `+` glyph only |
| negative sign | `oklch(0.54 0.15 27)` | the `−` glyph (U+2212, not a hyphen) only |

**Only the sign is coloured. The digits stay `--color-text`.** This is deliberate and load-bearing —
do not colour whole amounts.

### Type

- Headings: `Barlow Condensed`, weight 600, `letter-spacing: -0.015em` (Google Fonts).
- Body: `Barlow`, weight 400 (600 for emphasis).
- `body { font-variant-numeric: tabular-nums }` — required, all figures are column-aligned.

Scale as used: screen title 31px condensed · panel title 20–21px condensed · figure 31px condensed ·
row amount 17px condensed · body 14px · secondary 13px · caption/meta 12px · overline 11px condensed,
`letter-spacing: 0.12em`, uppercase.

### Spacing, radius, elevation

- Spacing scale (0.85× density): 3.4 / 6.8 / 10.2 / 13.6 / 20.4 / 27.2px
  (`--space-1..8`). Grid gaps between panels use `--space-8` (27.2px).
- **Radius: 0 on every element.** Square corners throughout — buttons, inputs, panels, tags.
- **No shadows.** Elevation is expressed by hairline borders only.
- Panel padding 18–20px; list row padding 13–18px vertical, 20–22px horizontal.

### Deviation from the design system

The Industry system specifies `+` registration marks at the corners of framed elements. **They were
removed at the user's request.** Panels are plain 1px `--color-divider` borders with square corners.
Do not reintroduce corner marks.

## Layout shell

Full-width, no sidebar (this is intentional — the sidebar was removed to give tables room and to stop
duplicating the pipeline).

- **Identity bar**, height 56px, `padding: 0 32px`, bottom hairline, sticky (`z-index: 60`).
  Left: wordmark `AGENTTIS` (19px condensed, `letter-spacing: 0.16em`, uppercase), hairline
  separator (1×20px), client name (13px, weight 600) whose `title` carries RUT + practice + criterion
  version. Right: period `<select>` (32px min-height, transparent fill), a de-emphasised "Capa
  agéntica" ghost button (42% text opacity, `title` explains it's post-MVP), and a 30×30px bordered
  initials square whose `title` names the user.
- **Pipeline bar**, bottom hairline, `display: flex; flex-wrap: wrap`.
  - Steps track: `flex: 1 1 560px; min-width: 0; overflow-x: auto` — this is what keeps the bar from
    clipping at narrow widths; do not remove `min-width: 0`.
  - Six buttons, each `padding: 12px 20px`, right hairline, `white-space: nowrap`: `Resumen` (grid
    icon, no number) then numbered `1 Datos`, `2 Criterio`, `3 Conciliación`, `4 Impuestos`,
    `5 Entrega`. The number sits in a 21×21px square with a `1px solid currentColor` border.
    Active step: background `--color-accent`, text `--color-bg`. Each button's `title` carries its
    current status (e.g. "2 movimientos sin conciliar") — the counts are *not* printed in the bar.
  - Status block: `flex: 1 0 auto; margin-left: auto`, right-aligned — the pending-decisions count
    (13px muted) and the primary `Cerrar período` button, `disabled` while any blocker is open.
- **Main**: `max-width: 1380px; padding: 36px 32px 72px`. Screens fade in (`opacity 0 → 1`, 200ms).
- **Footer**: hairline top, 12px muted, `© 2026 Agenttis Inc.` and `Criterio de normalización v3 · Estudio Bravo`.

## Screens

### 1. Resumen (default)

**Purpose:** answer "what stops me closing junio?" in one look.

**Layout:** single column, `gap: 32px`. Title `Cierre de junio 2025` (31px condensed) + one line
`Solo lo que necesita tu decisión. El resto ya está resuelto.`

**Figures:** 3 equal cells, `gap: 27.2px`, each a bordered plate, `padding: 18px 20px`: overline
label, then a 31px condensed figure. Ventas `+1.284.500` (green +), Compras `−903.700` (red −), and
`IVA a pagar · vence 20/07` `68.420` on an accent-tinted ground with `--color-accent-900` text and
`--color-accent-800` label. **No sub-lines** — comprobante counts and the tax breakdown live in each
plate's `title`. Hidden entirely when the `showFigures` flag is off.

**Decision queue:** one bordered panel. Header row (`padding: 17px 22px`, bottom hairline) holds a
20px condensed title that is derived: `Faltan N definiciones para cerrar`, singular at 1, and
`Listo para cerrar junio` at 0.

Then one row per **open** step, `grid-template-columns: 34px 1fr auto 132px`, `gap: 20.4px`,
`padding: 16px 22px`, bottom hairline, the whole row's `title` carrying the step's detail sentence:

1. 34×34px step number. Blocking steps: `--color-accent` fill, `--color-bg` glyph. Non-blocking:
   transparent with a `--color-divider` border.
2. Step label, 15px weight 600.
3. Right-hand value, 17px condensed, `white-space: nowrap` — `--color-accent-900` for blockers,
   muted otherwise.
4. Action button (`btn-secondary`), `justify-self: end`, omitted when the step has no action.

Below the rows, a full-width borderless button: a check icon + `N pasos que ya se resolvieron solos`
(13px muted). Clicking expands a list of those steps as one muted 13px line each
(`grid-template-columns: 34px 1fr`, `padding: 9px 22px`, top hairline), label + detail joined by an
em dash. Collapsed by default.

### 2. Datos

**Purpose:** get the period's files in.

Title + `Subí los archivos como los tengas. Pasá el cursor sobre cada uno para ver el detalle.`

**Dropzone:** `1px dashed --color-divider`, `padding: 34px`, centred: 22px upload icon in
`--color-accent`, `Arrastrá tus archivos acá` (19px condensed), and
`CSV, XLSX o TXT · se detecta el tipo por su contenido` (13px muted).

**File list:** one bordered panel, five rows, `grid-template-columns: 1fr auto 150px`,
`padding: 15px 22px`. Filename (weight 600) · status (13px) · action, right-aligned. Each row's
`title` carries type, row count and load time — those columns were deliberately removed from the
table. Statuses: `4 filas requieren atención` and `2 cuentas sin definir` in `--color-accent-800`
with a `btn-secondary` action; `Normalizado` muted with a `btn-ghost` "Ver criterio". The last row is
the not-yet-uploaded `Extracto bancario`, whole row at 60% text opacity, with a **primary** `Subir`.

### 3. Criterio (mapping review)

**Purpose:** confirm how one file's columns map to the practice's fields, and clear its exceptions.

A `btn-ghost` back link (`← Datos del período`) above the title. Title is the filename; the one
subtitle line is `116 filas · 112 listas · 4 con aviso`, with column-count detail in its `title`.

Two columns, `1.5fr 1fr`, `gap: 27.2px`, `align-items: start`.

**Left — Correspondencia de columnas:** bordered panel, 20px condensed header with bottom hairline,
then a two-column table with **no header row and no certainty column**: source column name, and a
`<select>` of target fields. Each row's `title` gives the sample value and the certainty. Rows whose
certainty is "Revisar" get `border-color: var(--color-accent)` on the select — that is the only
visual flag.

**Right, top — exceptions:** accent-tinted panel (`7%`), 20px condensed title
`4 filas requieren atención` in `--color-accent-900`, then four rows of
`grid-template-columns: 34px 1fr`: row reference (`f.17`, 12px, `--color-accent-800`) + the problem
in weight 600. **The specifics are in each row's `title`** (`21478592001 — el dígito verificador no
cierra`, `Declara $ 1.100 · corresponde $ 1.320`, …). Full-width `btn-secondary`
`Resolver una por una` beneath.

**Right, below — row preview:** a `btn-ghost` toggle `Ver cómo queda la fila 1` reveals a bordered
panel of six label/value rows separated by hairlines (Fecha, Tipo CFE, RUT emisor, Gravado 22%,
IVA 22%, Total, the last in weight 600). Collapsed by default.

**Action bar:** `position: sticky; bottom: 0`, background `--color-bg`, top hairline. Left: a checkbox
`Recordar este criterio para Distribuidora del Sur`, checked. Right: `Cancelar` (secondary) and
`Confirmar 116 filas` (primary).

### 4. Saldos iniciales

Back link, title `Saldos iniciales al 31/05/2025`, subtitle
`16 de 18 líneas se interpretaron sin ambigüedad. Definí las dos restantes.` Right-aligned: a check
icon in `--color-accent` + `Debe = Haber · 1.482.300` (17px condensed), `title` explaining the check.

Two columns, `1.5fr 1fr`.

**Left:** bordered panel with a 4-column table — `Texto en el archivo` · `Cuenta del plan` (muted) ·
`Debe` · `Haber`, both amounts right-aligned. **Empty cells are left empty** — no em-dash
placeholders. The last visible row (`Fondo fijo Dpto. Ventas` / `Sin definir`) is the only marked
one: label `--color-accent-900` weight 600, mapping `--color-accent-800`, row `title` explains why.
Footer line, top hairline: `Mostrando 9 de 18 líneas` (13px muted).

**Right:** bordered panel `2 cuentas necesitan tu decisión`; per account, a weight-600 name whose
`title` carries the amount and side (`$ 8.000 al debe`) and a `<select>` of candidate accounts,
separated by a hairline. Then a full-width primary `Confirmar saldos iniciales`.

### 5. Conciliación

Title + `Elegí un movimiento y confirmá con qué comprobante corresponde.` (bank and both balances in
the subtitle's `title`). Right-aligned: overline `A explicar` in `--color-accent-800` and the derived
difference at 27px condensed in `--color-accent-900`.

Two columns, `1.3fr 1fr`.

**Left — Movimientos:** bordered panel; header row holds the 20px condensed title and a segmented
control (`.seg` / `.seg-opt`, native radios) `Todos · Pendientes · Conciliados`. Rows:
`grid-template-columns: 3px 1fr auto`, `padding: 13px 20px`, bottom hairline, `cursor: pointer`,
hover `color-mix(in srgb, var(--color-text) 4%, transparent)`, selected row
`color-mix(in srgb, var(--color-accent) 9%, transparent)`.
1. A 3px full-height marker: `--color-accent` when unreconciled, transparent when settled.
2. Description, weight 600, single line with ellipsis.
3. Amount, 17px condensed, right-aligned — coloured sign + ink digits.

Date, reference and status are **only** in the row's `title`. Footer: `N de 6 movimientos · diferencia X`.

**Right — selected movement:** bordered panel. 21px condensed description (`title` = date · ref ·
amount), then a 13px muted line that switches between `Coincidencias propuestas, con su motivo` and
`Conciliado con`.

Candidates are bordered cards: document name (weight 600) and amount (17px condensed) on one row,
then the **reason** in 13px muted — the reason is the point of this panel, always show it. While
pending: `Conciliar` (primary) + `Descartar` (secondary), and below the list, separated by a
hairline, `Buscar otro comprobante…` (secondary) and `Registrar sin comprobante` (ghost). Once
settled: **only the matched candidate renders**, its buttons replaced by a check icon +
`Conciliado` in `--color-accent-800` and a `Deshacer` ghost button, and the two escape-hatch actions
are hidden.

### 6. Impuestos

Title + `Calculadas sobre los libros normalizados.` One bordered panel, four rows,
`grid-template-columns: 1fr auto auto`, `gap: 24px`. Name (19px condensed) · amount (21px
condensed) · either a due date (13px muted, `min-width: 96px`, right-aligned) or an action.
Descriptions and rates live in each row's `title`.

- **Overdue** (`Aportes BPS · Mayo 2025`, `8.400`): the one reversed field —
  `background: var(--color-accent-900)`, text `--color-bg`, with a `Regularizar` button outlined in
  `--color-bg`. This is the only strong signal in the whole design; keep it to one row.
- `Anticipo IRAE · Junio 2025` `15.200` `vence 10/07`; `IVA mensual · Junio 2025` `68.420`
  `vence 20/07`.
- `IVA mensual · Mayo 2025` `28.600` `presentado`, whole row at 55% opacity.

Below: a `btn-ghost` toggle `Ver de dónde salen estos importes` revealing the period's books — a
bordered table `Libro · Gravado 22 · Gravado 10 · Exento · IVA · Total` with Ventas, Compras and an
`IVA a pagar` total row (16px condensed, no bottom border). Collapsed by default.

### 7. Entrega

**Purpose:** produce the deliverables the practice actually hands over.

Title `Entrega del cierre` + `Un paquete de planillas con el formato que espera cada destino. El
formato queda recordado para este cliente.`

Two columns, `1.35fr 1fr`.

**Left — Qué incluye:** bordered panel; header with the title and `N de 6 seleccionados` (13px
muted). Six checkbox rows, `grid-template-columns: 18px 1fr auto`, `padding: 14px 20px`, each row a
`<label>` with `cursor: pointer` and a `title` describing the deliverable:

| Deliverable | Meta | Default |
| --- | --- | --- |
| Libro de compras | 147 filas | on |
| Libro de ventas | 84 filas | on |
| Resumen de IVA del período | 1 hoja | on |
| Asientos de ajuste para el ERP | 12 asientos | on |
| Balance de apertura confirmado | 18 cuentas | off |
| Conciliación bancaria | 6 movimientos | on |

**Right — format:** bordered panel with a `Formato de columnas` select — `Resumen para DGI`,
`ERP — Memory`, `ERP — Zureo`, `CSV plano · una fila por comprobante` — and below it a 13px muted
sentence that changes with the selection (the four strings are in the reference file's `FMT_HINT`).
Then `Estructura del archivo` as a full-width segmented control: `Un libro por hoja` /
`Un archivo por libro`.

Below the panel: when blockers remain, a 13px `--color-accent-800` warning
`Quedan N definiciones pendientes: el paquete sale marcado como provisorio.`; then the primary
`Generar paquete de cierre`; then `Última entrega: mayo 2025, el 19/06` (13px muted, detail in `title`).

## Interactions & behavior

- **Navigation** is state, not routing, in the prototype. In the app, prefer real routes
  (`/cierre`, `/cierre/datos`, …) or the existing `activeTab` mechanism in `DashboardContext`.
  `Criterio` and `Saldos` are both children of step 2 — the pipeline highlights `Criterio` for either.
- **Progressive disclosure** is the core interaction. Three collapsed regions (resolved steps, row-1
  preview, period books) all default closed and toggle from a text/ghost button whose label flips
  ("Ver …" → "Ocultar …").
- **Tooltips carry the second layer of information.** The prototype uses native `title` for
  simplicity plus `[title] { cursor: help }`. In production, use the codebase's tooltip component if
  one exists — but keep the same content split, and keep tooltips **non-essential**: nothing a user
  must have to act is hidden in one.
- **Reconciliation:** clicking a row selects it. `Conciliar` on a candidate records *which*
  candidate matched; the panel then shows only that one with `Deshacer`. `Deshacer` returns the
  movement to pending and restores the full candidate list. Every derived number updates in the same
  tick — see below.
- **Mapping:** changing a `<select>` sets that column's certainty to "Definido" and clears the
  accent border.
- **Primary action gating:** `Cerrar período` is `disabled` whenever any blocking step is open.
  Export is *not* gated — it warns and marks the package provisorio instead.
- Transitions: screen fade-in 200ms. Buttons use the token hover/active states
  (`--color-accent-600` / `--color-accent-700` for primary; a 7% / 14% ink tint for secondary).
  Focus is `2px solid var(--color-accent)` with `outline-offset: 2px` — never the browser default.
- Responsive: the pipeline bar wraps its status block below ~960px and scrolls its step track
  horizontally. Two-column screens should stack below ~900px (not exercised in the prototype).

## State management

Single source of truth, and this is the most important rule in the handoff: **every count, amount and
label in the glance layer is derived from the same state as the detail screens.** Earlier iterations
printed hardcoded counts and contradicted themselves. Derive, don't restate.

```ts
type Screen = 'cierre'|'datos'|'mapeo'|'saldos'|'concil'|'impuestos'|'entrega';

interface BankRow { id: number; date: string; ref: string; desc: string; amount: number;
                    st: 'ok'|'pend'; matchIdx?: number|null }
interface ColumnMap { src: string; sample: string; field: string; conf: 'Alta'|'Media'|'Revisar'|'Definido' }

interface CloseState {
  screen: Screen;
  filter: 'all'|'pend'|'ok';        // reconciliation list filter
  selId: number;                     // selected bank movement
  showDone: boolean;                 // resolved-steps disclosure
  showPreview: boolean;              // row-1 preview disclosure
  showBooks: boolean;                // period books disclosure
  fmt: 'dgi'|'memory'|'zureo'|'plano';
  pack: 'one'|'many';
  picks: Record<string, boolean>;    // export deliverables
  avisos: number;                    // 4 — exception rows in the purchases file
  saldosPend: number;                // 2 — undecidable opening-balance accounts
  maps: ColumnMap[];
  rows: BankRow[];
}
```

Derived, recomputed on every render (see `buildSteps` + `renderVals` in the reference file):

- `pend = rows.filter(r => r.st !== 'ok')`, `diff = sum(|pend.amount|)`.
- `steps` — one array of nine close steps, each `{ label, detail, right, action, to, open, blocks }`.
  Steps 4, 5 and 7 are always resolved; step 2 is open while `avisos > 0`; step 3 while
  `saldosPend > 0`; step 6 while `pend.length > 0`.
- `openSteps` / `doneSteps` / `blockers = openSteps.filter(s => s.blocks)`.
- `queueTitle`, the header's pending count, `blocked` (→ the `Cerrar período` disabled state), each
  pipeline button's tooltip, the reconciliation footer and the "A explicar" figure: **all** read from
  `blockers`, `pend` and `diff`. Never hardcode one of these numbers.

Seed data: reuse `INITIAL_BANK_ROWS`, `INITIAL_TAXES` and `INITIAL_CLOSE_STEPS` from
`src/lib/initialData.ts`. The nine steps in this design are that array's close steps re-expressed,
plus the two harmonisation steps this MVP adds (normalise to criterion, confirm opening balances) and
the delivery step. Note the prototype fixes an inconsistency in the seed data: row 4
(`DEB-00771`, −3.200) is `matched: true`, so there are **2** unreconciled movements totalling
**46.600** — not the 3 implied by `HomeTab`'s copy.

Data fetching is out of scope for the prototype. Where real work is needed:
file upload + type detection, column-mapping inference, opening-balance account matching, candidate
generation for reconciliation, tax computation from the books, and package generation (xlsx/csv per
format). Each is a clean seam behind the screen that consumes it.

## Copy

All UI copy is Spanish, Uruguayan register, and is final — it's in the reference file verbatim.
Domain terms to keep exact: `criterio` (the practice's normalisation standard), `comprobante`,
`e-Factura` / `e-Ticket` / `CFE`, `RUT`, `gravado 22 / gravado 10 / exento`, `Debe` / `Haber`,
`saldos iniciales`, `anticipo IRAE`, `aportes BPS`, `DGI`. Route it through
`src/lib/translations.ts` with English counterparts, as the app already does.

## Assets

None. All icons are `lucide-react` at `stroke-width: 1.5`, 14–22px: `LayoutGrid` (Resumen),
`Upload` (dropzone), `ArrowLeft` (back links), `CheckCircle2` (balance check, resolved steps,
settled reconciliation), `Sparkles` (capa agéntica). No images, no logos — the wordmark is type.

## Not built (deliberate)

- **The agentic layer** (fuentes de datos, habilidades, agentes, observabilidad) is present in the
  identity bar as one de-emphasised button and nothing more. The existing `src/components/platform/*`
  tabs are out of scope for this close flow.
- Three features I'd argue belong in a UY close but are not designed yet, in priority order:
  CFE cross-check against DGI's reported set; USD revaluation at the BCU period rate with automatic
  difference-of-exchange entries; retenciones and prior-period saldo a favor carried forward.

## Files

- `Agenttis MVP v3.dc.html` — the design reference (all seven screens, interactive).
- `support.js` — the prototype runtime. **Reference only; do not port.**
- `styles.css` — the Industry design-system token sheet the design draws from. Every color, font and
  spacing value above resolves here.
