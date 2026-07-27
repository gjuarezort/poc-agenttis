// Domain model for the month-end close (cierre mensual).
//
// The rule that governs this module: every count, amount and label the UI shows
// is DERIVED from this state. Nothing in a screen restates a number that another
// screen also prints — see `derive.ts`.

export type FileKind = "compras" | "ventas" | "saldos" | "extracto" | "desconocido";

export type TargetField =
  | "fecha_emision"
  | "tipo_cfe"
  | "serie_numero"
  | "rut_contraparte"
  | "razon_social"
  | "moneda"
  | "gravado_22"
  | "gravado_10"
  | "exento"
  | "iva_22"
  | "iva_10"
  | "total"
  | "cuenta_contable"
  | "(no importar)";

export type Certainty = "Alta" | "Media" | "Revisar" | "Definido";

export interface ColumnMap {
  src: string;
  sample: string;
  field: TargetField;
  conf: Certainty;
}

export type ExceptionCode = "rut" | "iva" | "periodo" | "duplicado";

/** A row of a source file the normaliser could not accept as-is. */
export interface RowException {
  docId: string;
  row: number;
  code: ExceptionCode;
  /** Short problem statement — the visible text. */
  label: string;
  /** The specifics; lives in the tooltip, not on the page. */
  detail: string;
  /** What "resolve" does to the row, in words. */
  fix: string;
}

export interface BookTotals {
  gravado22: number;
  gravado10: number;
  exento: number;
  iva: number;
  total: number;
}

/** A single comprobante (CFE) as understood after normalisation. */
export interface Comprobante {
  id: string;
  /** 1-based line in the source file — the `f.NN` reference. */
  row: number;
  fecha: string; // ISO yyyy-mm-dd
  tipoCfe: string;
  serie: string;
  numero: string;
  rut: string;
  razonSocial: string;
  gravado22: number;
  gravado10: number;
  exento: number;
  /** IVA as declared in the file. May disagree with the rates — that is an exception. */
  iva: number;
  total: number;
  /** Set when the accountant resolved a duplicate/out-of-period row by dropping it. */
  excluded?: boolean;
}

export interface PeriodFile {
  id: string;
  name: string;
  kind: FileKind;
  /** Rows in the source file, before exclusions. */
  rowCount: number;
  loadedAt: string;
  maps: ColumnMap[];
  /** Comprobantes materialised from the file. For seeded files this is a
   *  sample (the row-1 preview plus the defective rows); `totals` carries the
   *  rest. For uploaded files every row is materialised and `totals` is null. */
  docs: Comprobante[];
  docsComplete: boolean;
  totals: BookTotals | null;
  /** The counterparty whose layout this criterio belongs to. */
  criterioOwner: string;
  /** Mapping confirmed by a human. */
  confirmed: boolean;
  rememberCriterio: boolean;
  /** Net effect of resolved exceptions on the aggregate above. */
  adjust: BookTotals;
  /** Rows dropped while resolving exceptions (duplicates, out-of-period). */
  rowsExcluded: number;
  /** Formats we cannot read in the browser yet (xlsx) wait for the server pass. */
  awaitingServerParse?: boolean;
  source: "seed" | "upload";
}

/** A file the period needs but does not have yet. */
export interface MissingFile {
  id: string;
  name: string;
  kind: FileKind;
  hint: string;
}

export interface BalanceLine {
  id: string;
  /** Verbatim text of the account in the client's file. */
  texto: string;
  /** Account in the practice's chart. Null = needs a human decision. */
  cuenta: string | null;
  debe: number;
  haber: number;
  /** Chart accounts the matcher considers plausible for this text. */
  candidates: string[];
}

export interface BankRow {
  id: number;
  date: string; // dd/mm/yyyy
  ref: string;
  desc: string;
  amount: number;
  st: "ok" | "pend";
  matchIdx: number | null;
  /** Candidates discarded by the accountant. */
  discarded: number[];
  /** Set when settled with "Registrar sin comprobante". */
  sinComprobante?: boolean;
}

export interface MatchCandidate {
  doc: string;
  amount: number;
  /** Why the matcher proposed it — the point of the panel. */
  why: string;
}

export type TaxStatus = "vencido" | "pendiente" | "presentado";

export interface TaxObligation {
  id: string;
  name: string;
  /** Rendered amount; null when derived from the books. */
  amount: number | null;
  /** Set for the IVA of the period, which is computed, not stored. */
  derived?: "iva_periodo";
  due: string; // ISO
  status: TaxStatus;
  detail: string;
}

export type ExportFormat = "dgi" | "memory" | "zureo" | "plano";
export type PackStructure = "one" | "many";

export interface PeriodMeta {
  id: string;
  label: string;
  start: string; // ISO
  end: string; // ISO
  /** Fixed "today" for the demo, so nothing depends on the wall clock. */
  today: string;
}

export interface ClientMeta {
  name: string;
  rut: string;
  practice: string;
  criterioVersion: string;
  bank: string;
  bankBalance: number;
}

export interface CloseState {
  period: PeriodMeta;
  client: ClientMeta;
  files: PeriodFile[];
  missing: MissingFile[];
  balanceLines: BalanceLine[];
  bankRows: BankRow[];
  candidates: Record<number, MatchCandidate[]>;
  taxes: TaxObligation[];
  /** Adjustment entries the close produces for the client's ERP. */
  asientosAjuste: number;
  resolvedExceptions: string[];
  picks: Record<string, boolean>;
  fmt: ExportFormat;
  pack: PackStructure;
  periodClosed: boolean;
  /** The previous period's delivery, shown as context on the Entrega screen. */
  lastPackage: string | null;
  /** When this period's package was generated — null until it is. */
  packageGeneratedAt: string | null;
}
