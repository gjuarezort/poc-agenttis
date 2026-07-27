This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root of the app is the **cierre mensual** flow; the agentic platform lives at `/plataforma`.

## The two apps

| Route | What it is |
| --- | --- |
| `/`, `/datos`, `/datos/criterio/[fileId]`, `/datos/saldos`, `/conciliacion`, `/impuestos`, `/entrega` | The month-end close. Full-width light shell, own state, own copy. |
| `/plataforma` | The agentic layer (data sources, skills, agents, MCP, observability, permissions). Reached from the "Capa agéntica" button in the close's identity bar. |

The close flow's shell is `src/app/(cierre)/layout.tsx`; its palette and components are scoped
under `.cierre-root` in `src/app/cierre.css` so the two themes never mix on one screen.

## Close engine

All of the close's logic is in `src/lib/close/`, deliberately free of React so each piece can be
swapped for a server/AI implementation later:

| Module | Responsibility |
| --- | --- |
| `types.ts` | Domain model |
| `seed.ts` | The demo period (junio 2025, Almacén Rivera SRL) |
| `format.ts` | Deterministic number/date formatting and amount parsing |
| `detect.ts` | File-type detection, column-mapping inference, row materialisation |
| `validate.ts` | RUT check digit, IVA-vs-base, period, duplicates |
| `accounts.ts` | The practice's chart and the opening-balance matcher |
| `reconcile.ts` | Bank-match candidate generation and the reason sentences |
| `derive.ts` | Books, IVA, the nine close steps, blockers — **the single source of every number the UI prints** |
| `exportPackage.ts` | Package generation per format (DGI / Memory / Zureo / flat) |

`src/context/CloseContext.tsx` holds the state and the actions; screens only render derivations.

**The rule to keep:** no screen restates a figure another screen also shows. Everything — the queue
counts, the pipeline tooltips, the `Cerrar período` gate, the delivery metadata — recomputes from
`derive.ts`. Adding a hardcoded count is how earlier iterations started contradicting themselves.

### Where the AI layer plugs in

Each of these is already a clean function boundary with a working deterministic implementation:

- `detect.detectKind` / `inferMapping` — file classification and column mapping
- `validate.validateDocs` — the exception pass, and the `fix` sentence each row offers
- `accounts.matchAccount` — mapping the client's wording onto the practice's chart
- `reconcile.generateCandidates` — bank matching, and the *reason* shown with each candidate
- `exportPackage.buildPackage` — per-ERP layouts

Formats the browser cannot read (XLSX) are flagged `awaitingServerParse` and wait for that pass.

### Sample files

`public/samples/cierre/` holds CSVs you can drop on the `/datos` dropzone during a demo: a purchases
file with four seeded defects, an opening balance with an unmappable account, and the missing May
bank statement.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
