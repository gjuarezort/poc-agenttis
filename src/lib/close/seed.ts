import type {
  BalanceLine,
  BankRow,
  BookTotals,
  CloseState,
  ColumnMap,
  Comprobante,
  MatchCandidate,
  PeriodFile,
  TaxObligation,
} from "./types";
import { matchAccount } from "./accounts";

// The demo period: junio 2025 for a Montevideo pyme, closed by Estudio Bravo.
//
// The figures here are authored so the whole derivation chain lands on the
// numbers the design publishes — ventas 1.284.500, compras 903.700, IVA a pagar
// 68.420 — while every intermediate stays internally consistent (IVA is exactly
// what the rates imply, totals are exactly base + IVA, debe equals haber).
// Nothing downstream restates a figure; it all recomputes from this file.

export const ZERO_TOTALS: BookTotals = {
  gravado22: 0,
  gravado10: 0,
  exento: 0,
  iva: 0,
  total: 0,
};

const PERIOD = {
  id: "2025-06",
  label: "Junio 2025",
  start: "2025-06-01",
  end: "2025-06-30",
  // Fixed so the demo never drifts with the wall clock, and so nothing rendered
  // on the server disagrees with the client.
  today: "2025-06-26",
};

export const PERIOD_OPTIONS = [
  { id: "2025-06", label: "Junio 2025" },
  { id: "2025-05", label: "Mayo 2025" },
  { id: "2025-04", label: "Abril 2025" },
];

const RUT = {
  distSur: "214785920018",
  distSurRoto: "214785920011", // same number with a check digit that does not hold
  impresos: "212003402000",
  cloud: "217654303009",
  norte: "218990215014",
  abc: "215508804007",
  xyz: "213349906004",
};

function doc(c: Omit<Comprobante, "id"> & { id: string }): Comprobante {
  return c;
}

/** Column layout of the supplier's export, as the inference pass read it. */
const COMPRAS_MAPS: ColumnMap[] = [
  { src: "F. Emision", sample: "03/06/2025", field: "fecha_emision", conf: "Alta" },
  { src: "Tipo Doc", sample: "FAC / NC", field: "tipo_cfe", conf: "Alta" },
  { src: "Nro", sample: "A 0004512", field: "serie_numero", conf: "Alta" },
  { src: "RUT Emisor", sample: "214785920018", field: "rut_contraparte", conf: "Alta" },
  { src: "Nombre", sample: "Distribuidora del Sur SRL", field: "razon_social", conf: "Alta" },
  { src: "Mon", sample: "UYU / USD", field: "moneda", conf: "Media" },
  { src: "Neto Grav 22", sample: "41.000,00", field: "gravado_22", conf: "Alta" },
  { src: "Neto Grav 10", sample: "0,00", field: "gravado_10", conf: "Media" },
  { src: "Exento", sample: "0,00", field: "exento", conf: "Media" },
  { src: "IVA 22", sample: "9.020,00", field: "iva_22", conf: "Alta" },
  { src: "Total Doc", sample: "50.020,00", field: "total", conf: "Revisar" },
  { src: "Vendedor", sample: "M. Pereira", field: "(no importar)", conf: "Media" },
  { src: "Obs.", sample: "entrega parcial", field: "(no importar)", conf: "Media" },
  { src: "Nro. interno", sample: "AX-4512", field: "(no importar)", conf: "Media" },
];

const VENTAS_MAPS: ColumnMap[] = [
  { src: "Fecha", sample: "02/06/2025", field: "fecha_emision", conf: "Definido" },
  { src: "Tipo CFE", sample: "e-Factura (111)", field: "tipo_cfe", conf: "Definido" },
  { src: "Serie y número", sample: "A 0001042", field: "serie_numero", conf: "Definido" },
  { src: "RUT receptor", sample: "215508804007", field: "rut_contraparte", conf: "Definido" },
  { src: "Razón social", sample: "Cliente ABC SA", field: "razon_social", conf: "Definido" },
  { src: "Gravado 22%", sample: "37.049,00", field: "gravado_22", conf: "Definido" },
  { src: "Gravado 10%", sample: "0,00", field: "gravado_10", conf: "Definido" },
  { src: "Exento", sample: "0,00", field: "exento", conf: "Definido" },
  { src: "IVA", sample: "8.151,00", field: "iva_22", conf: "Definido" },
  { src: "Total", sample: "45.200,00", field: "total", conf: "Definido" },
];

const GASTOS_MAPS: ColumnMap[] = [
  { src: "fecha", sample: "04/06/2025", field: "fecha_emision", conf: "Definido" },
  { src: "tipo", sample: "e-Factura", field: "tipo_cfe", conf: "Definido" },
  { src: "comprobante", sample: "A 0000771", field: "serie_numero", conf: "Definido" },
  { src: "rut", sample: "212003402000", field: "rut_contraparte", conf: "Definido" },
  { src: "proveedor", sample: "Impresos SA", field: "razon_social", conf: "Definido" },
  { src: "neto", sample: "10.246,00", field: "gravado_22", conf: "Definido" },
  { src: "iva", sample: "2.254,00", field: "iva_22", conf: "Definido" },
  { src: "total", sample: "12.500,00", field: "total", conf: "Definido" },
];

/**
 * The five rows of `compras_junio_dist_sur.csv` the normaliser materialised:
 * the first row (used by the preview) and the four the exception pass trips on.
 * The remaining 111 rows are folded into the file's aggregate below.
 */
const COMPRAS_DOCS: Comprobante[] = [
  doc({
    id: "f-compras-dist-r1",
    row: 1,
    fecha: "2025-06-03",
    tipoCfe: "e-Factura (111)",
    serie: "A",
    numero: "0004512",
    rut: RUT.distSur,
    razonSocial: "Distribuidora del Sur SRL",
    gravado22: 41000,
    gravado10: 0,
    exento: 0,
    iva: 9020,
    total: 50020,
  }),
  doc({
    id: "f-compras-dist-r17",
    row: 17,
    fecha: "2025-06-11",
    tipoCfe: "e-Factura (111)",
    serie: "A",
    numero: "0004598",
    rut: RUT.distSurRoto,
    razonSocial: "Distribuidora del Sur SRL",
    gravado22: 12500,
    gravado10: 0,
    exento: 0,
    iva: 2750,
    total: 15250,
  }),
  doc({
    id: "f-compras-dist-r42",
    row: 42,
    fecha: "2025-06-14",
    tipoCfe: "e-Factura (111)",
    serie: "A",
    numero: "0004640",
    rut: RUT.distSur,
    razonSocial: "Distribuidora del Sur SRL",
    gravado22: 6000,
    gravado10: 0,
    exento: 0,
    iva: 1100, // the rates say 1.320
    total: 7100,
  }),
  doc({
    id: "f-compras-dist-r63",
    row: 63,
    fecha: "2025-05-30", // before the period
    tipoCfe: "e-Factura (111)",
    serie: "A",
    numero: "0004701",
    rut: RUT.distSur,
    razonSocial: "Distribuidora del Sur SRL",
    gravado22: 9800,
    gravado10: 0,
    exento: 0,
    iva: 2156,
    total: 11956,
  }),
  doc({
    id: "f-compras-dist-r91",
    row: 91,
    fecha: "2025-06-03", // same document as row 1
    tipoCfe: "e-Factura (111)",
    serie: "A",
    numero: "0004512",
    rut: RUT.distSur,
    razonSocial: "Distribuidora del Sur SRL",
    gravado22: 41000,
    gravado10: 0,
    exento: 0,
    iva: 9020,
    total: 50020,
  }),
];

/** The emitted comprobantes the bank matcher needs to reason about. */
const VENTAS_DOCS: Comprobante[] = [
  doc({ id: "v-1042", row: 4, fecha: "2025-06-02", tipoCfe: "e-Factura (111)", serie: "A", numero: "0001042", rut: RUT.abc, razonSocial: "Cliente ABC SA", gravado22: 37049, gravado10: 0, exento: 0, iva: 8151, total: 45200 }),
  doc({ id: "v-1188", row: 21, fecha: "2025-06-05", tipoCfe: "e-Factura (111)", serie: "A", numero: "0001188", rut: RUT.norte, razonSocial: "Cliente Norte SA", gravado22: 14754, gravado10: 0, exento: 0, iva: 3246, total: 18000 }),
  doc({ id: "v-1194", row: 24, fecha: "2025-06-06", tipoCfe: "e-Factura (111)", serie: "A", numero: "0001194", rut: RUT.abc, razonSocial: "Cliente ABC SA", gravado22: 14754, gravado10: 0, exento: 0, iva: 3246, total: 18000 }),
  doc({ id: "v-1055", row: 68, fecha: "2025-06-18", tipoCfe: "e-Factura (111)", serie: "A", numero: "0001055", rut: RUT.xyz, razonSocial: "Cliente XYZ SRL", gravado22: 54918, gravado10: 0, exento: 0, iva: 12082, total: 67000 }),
];

const GASTOS_DOCS: Comprobante[] = [
  doc({ id: "g-0771", row: 3, fecha: "2025-06-04", tipoCfe: "e-Factura (111)", serie: "A", numero: "0000771", rut: RUT.impresos, razonSocial: "Impresos SA", gravado22: 10246, gravado10: 0, exento: 0, iva: 2254, total: 12500 }),
  doc({ id: "g-0912", row: 9, fecha: "2025-06-10", tipoCfe: "e-Ticket (101)", serie: "B", numero: "0000912", rut: RUT.cloud, razonSocial: "Servicios Cloud LatAm SA", gravado22: 2623, gravado10: 0, exento: 0, iva: 577, total: 3200 }),
];

function totals(gravado22: number, gravado10: number, exento: number): BookTotals {
  const iva = Math.round(gravado22 * 0.22 + gravado10 * 0.1);
  return { gravado22, gravado10, exento, iva, total: gravado22 + gravado10 + exento + iva };
}

const SEED_FILES: PeriodFile[] = [
  {
    id: "f-compras-dist",
    name: "compras_junio_dist_sur.csv",
    kind: "compras",
    rowCount: 116,
    loadedAt: "hace 12 min",
    maps: COMPRAS_MAPS,
    docs: COMPRAS_DOCS,
    docsComplete: false,
    totals: totals(560000, 44000, 18290),
    criterioOwner: "Distribuidora del Sur",
    confirmed: false,
    rememberCriterio: true,
    adjust: { ...ZERO_TOTALS },
    rowsExcluded: 0,
    source: "seed",
  },
  {
    id: "f-ventas",
    name: "ventas_e-facturas_06-2025.xlsx",
    kind: "ventas",
    rowCount: 84,
    loadedAt: "hace 2 h",
    maps: VENTAS_MAPS,
    docs: VENTAS_DOCS,
    docsComplete: false,
    totals: totals(980000, 64300, 18170),
    criterioOwner: "Almacén Rivera",
    confirmed: true,
    rememberCriterio: true,
    adjust: { ...ZERO_TOTALS },
    rowsExcluded: 0,
    source: "seed",
  },
  {
    id: "f-saldos",
    name: "saldos_al_31-05-2025.csv",
    kind: "saldos",
    rowCount: 18,
    loadedAt: "hace 2 h",
    maps: [],
    docs: [],
    docsComplete: true,
    totals: null,
    criterioOwner: "Almacén Rivera",
    confirmed: false,
    rememberCriterio: true,
    adjust: { ...ZERO_TOTALS },
    rowsExcluded: 0,
    source: "seed",
  },
  {
    id: "f-gastos",
    name: "compras_gastos_varios.csv",
    kind: "compras",
    rowCount: 31,
    loadedAt: "hace 2 h",
    maps: GASTOS_MAPS,
    docs: GASTOS_DOCS,
    docsComplete: false,
    totals: totals(114000, 9300, 4500),
    criterioOwner: "Varios",
    confirmed: true,
    rememberCriterio: false,
    adjust: { ...ZERO_TOTALS },
    rowsExcluded: 0,
    source: "seed",
  },
  {
    id: "f-extracto-jun",
    name: "extracto_itau_06-2025.csv",
    kind: "extracto",
    rowCount: 6,
    loadedAt: "hace 1 h",
    maps: [],
    docs: [],
    docsComplete: true,
    totals: null,
    criterioOwner: "Banco Itaú",
    confirmed: true,
    rememberCriterio: true,
    adjust: { ...ZERO_TOTALS },
    rowsExcluded: 0,
    source: "seed",
  },
];

const RAW_BALANCE: Array<[string, number, number]> = [
  ["Caja pesos", 42100, 0],
  ["Bco. Itaú cta cte 4471", 386400, 0],
  ["Ctas. a cobrar plaza", 612900, 0],
  ["Mercadería en depósito", 440900, 0],
  ["Proveedores plaza", 0, 508700],
  ["DGI a pagar", 0, 126300],
  ["Capital integrado", 0, 700000],
  ["Result. acumulados", 0, 147300],
  ["Fondo fijo Dpto. Ventas", 8000, 0],
  ["Anticipos varios socios", 0, 24500],
  ["IVA compras a deducir", 31200, 0],
  ["Anticipos a proveedores", 18400, 0],
  ["Muebles y útiles", 96500, 0],
  ["Amortizaciones acumuladas", 0, 38700],
  ["Sueldos a pagar", 0, 54900],
  ["BPS a pagar", 0, 27800],
  ["IVA ventas a pagar", 0, 43100],
  ["Gastos pagados por adelantado", 34900, 0],
];

/** Runs the client's own wording through the matcher — the two it cannot place
 *  are exactly the two decisions the "Saldos iniciales" screen asks for. */
const SEED_BALANCE: BalanceLine[] = RAW_BALANCE.map(([texto, debe, haber], i) => {
  const match = matchAccount(texto, debe > 0 ? "debe" : "haber");
  return { id: `sl-${i + 1}`, texto, debe, haber, cuenta: match.cuenta, candidates: match.candidates };
});

const SEED_BANK: BankRow[] = [
  { id: 1, date: "02/06/2025", ref: "TRF-88120", desc: "Cobro factura 1042 — Cliente ABC SA", amount: 45200, st: "ok", matchIdx: 0, discarded: [] },
  { id: 2, date: "04/06/2025", ref: "PAG-41093", desc: "Pago proveedor Impresos SA", amount: -12500, st: "ok", matchIdx: 0, discarded: [] },
  { id: 3, date: "07/06/2025", ref: "TRF-90210", desc: "Transferencia recibida sin referencia", amount: 18000, st: "pend", matchIdx: null, discarded: [] },
  { id: 4, date: "10/06/2025", ref: "DEB-00771", desc: "Débito automático — suscripción cloud", amount: -3200, st: "ok", matchIdx: 0, discarded: [] },
  { id: 5, date: "14/06/2025", ref: "DGI-55210", desc: "Portal DGI — pago IVA mayo", amount: -28600, st: "pend", matchIdx: null, discarded: [] },
  { id: 6, date: "18/06/2025", ref: "TRF-91455", desc: "Cobro factura 1055 — Cliente XYZ SRL", amount: 67000, st: "ok", matchIdx: 0, discarded: [] },
];

/** Reasons are the point of the reconciliation panel, so they are authored, not
 *  generated, for the seeded statement. Uploaded statements fall back to
 *  `generateCandidates` in `reconcile.ts`. */
const SEED_CANDIDATES: Record<number, MatchCandidate[]> = {
  1: [{ doc: "e-Factura A 0001042 — Cliente ABC SA", amount: 45200, why: "Coincidencia exacta de importe y referencia." }],
  2: [{ doc: "e-Factura A 0000771 — Impresos SA", amount: 12500, why: "Coincidencia exacta de importe." }],
  3: [
    { doc: "e-Factura A 0001188 — Cliente Norte SA", amount: 18000, why: "Mismo importe, emitida el 05/06. Cliente con transferencias previas desde la misma cuenta." },
    { doc: "e-Factura A 0001194 — Cliente ABC SA", amount: 18000, why: "Mismo importe, emitida el 06/06. Sin historial de pago por transferencia." },
  ],
  4: [{ doc: "e-Ticket 0000912 — Servicios Cloud LatAm", amount: 3200, why: "Importe y fecha coinciden. Débito recurrente ya conciliado en abril y mayo." }],
  5: [{ doc: "Obligación IVA mayo 2025", amount: 28600, why: "Coincide con la obligación presentada el 19/06. Se registra contra impuestos a pagar." }],
  6: [{ doc: "e-Factura A 0001055 — Cliente XYZ SRL", amount: 67000, why: "Coincidencia exacta de importe y referencia." }],
};

const SEED_TAXES: TaxObligation[] = [
  { id: "t-bps", name: "Aportes BPS · Mayo 2025", amount: 8400, due: "2025-06-15", status: "vencido", detail: "Nómina de 6 empleados" },
  { id: "t-irae", name: "Anticipo IRAE · Junio 2025", amount: 15200, due: "2025-07-10", status: "pendiente", detail: "Anticipo mensual sobre ingresos gravados · 25%" },
  { id: "t-iva-jun", name: "IVA mensual · Junio 2025", amount: null, derived: "iva_periodo", due: "2025-07-20", status: "pendiente", detail: "" },
  { id: "t-iva-may", name: "IVA mensual · Mayo 2025", amount: 28600, due: "2025-06-20", status: "presentado", detail: "Declaración jurada presentada el 19/06/2025" },
];

export function initialCloseState(): CloseState {
  return {
    period: PERIOD,
    client: {
      name: "Almacén Rivera SRL",
      rut: "216 894 730 012",
      practice: "Estudio Bravo",
      criterioVersion: "v3",
      bank: "Banco Itaú cta cte 4471",
      bankBalance: 386400,
    },
    files: SEED_FILES.map((f) => ({ ...f, adjust: { ...f.adjust }, docs: f.docs.map((d) => ({ ...d })) })),
    missing: [
      {
        id: "m-extracto-may",
        name: "Extracto bancario · mayo 2025",
        kind: "extracto",
        hint: "Banco Itaú cta cte 4471 · valida el saldo de apertura contra el banco",
      },
    ],
    balanceLines: SEED_BALANCE.map((l) => ({ ...l })),
    bankRows: SEED_BANK.map((r) => ({ ...r, discarded: [] })),
    candidates: SEED_CANDIDATES,
    taxes: SEED_TAXES.map((t) => ({ ...t })),
    asientosAjuste: 12,
    resolvedExceptions: [],
    picks: { compras: true, ventas: true, iva: true, asientos: true, apertura: false, concil: true },
    fmt: "memory",
    pack: "one",
    periodClosed: false,
    lastPackage: "mayo 2025, el 19/06",
    packageGeneratedAt: null,
  };
}
