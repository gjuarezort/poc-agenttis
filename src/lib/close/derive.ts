import type { BookTotals, CloseState, PeriodFile, RowException, TaxObligation } from "./types";
import { ZERO_TOTALS } from "./seed";
import { openExceptions } from "./validate";
import { amount, dayMonth, daysBetween, shortDate } from "./format";
import type { CloseCopy, Lang } from "./copy";

export const ROUTES = {
  resumen: "/",
  datos: "/datos",
  saldos: "/datos/saldos",
  criterio: (fileId: string) => `/datos/criterio/${fileId}`,
  concil: "/conciliacion",
  impuestos: "/impuestos",
  entrega: "/entrega",
};

function addTotals(a: BookTotals, b: BookTotals): BookTotals {
  return {
    gravado22: a.gravado22 + b.gravado22,
    gravado10: a.gravado10 + b.gravado10,
    exento: a.exento + b.exento,
    iva: a.iva + b.iva,
    total: a.total + b.total,
  };
}

export function docTotals(file: PeriodFile): BookTotals {
  return file.docs
    .filter((d) => !d.excluded)
    .reduce(
      (acc, d) => ({
        gravado22: acc.gravado22 + d.gravado22,
        gravado10: acc.gravado10 + d.gravado10,
        exento: acc.exento + d.exento,
        iva: acc.iva + d.iva,
        total: acc.total + d.total,
      }),
      { ...ZERO_TOTALS }
    );
}

/**
 * A file's contribution to the books. Fully materialised files add up their
 * documents; seeded files carry an aggregate plus whatever the accountant's
 * resolutions moved.
 */
export function fileTotals(file: PeriodFile): BookTotals {
  if (file.docsComplete) return docTotals(file);
  return addTotals(file.totals ?? ZERO_TOTALS, file.adjust);
}

export function effectiveRowCount(file: PeriodFile): number {
  return file.rowCount - file.rowsExcluded;
}

export interface BookView extends BookTotals {
  docCount: number;
}

export function books(state: CloseState): { ventas: BookView; compras: BookView; ivaAPagar: number } {
  const collect = (kind: "ventas" | "compras"): BookView => {
    const relevant = state.files.filter((f) => f.kind === kind);
    const totals = relevant.reduce((acc, f) => addTotals(acc, fileTotals(f)), { ...ZERO_TOTALS });
    return { ...totals, docCount: relevant.reduce((n, f) => n + effectiveRowCount(f), 0) };
  };
  const ventas = collect("ventas");
  const compras = collect("compras");
  return { ventas, compras, ivaAPagar: ventas.iva - compras.iva };
}

export interface FileIssues {
  file: PeriodFile;
  exceptions: RowException[];
}

/** Every file that still has rows the normaliser could not accept. */
export function filesWithExceptions(state: CloseState, language: Lang): FileIssues[] {
  return state.files
    .filter((f) => f.kind === "compras" || f.kind === "ventas")
    .map((file) => ({ file, exceptions: openExceptions(file, state.period, state.resolvedExceptions, language) }))
    .filter((x) => x.exceptions.length > 0);
}

export function totalAvisos(state: CloseState, language: Lang): number {
  return filesWithExceptions(state, language).reduce((n, x) => n + x.exceptions.length, 0);
}

export function undefinedBalanceLines(state: CloseState) {
  return state.balanceLines.filter((l) => !l.cuenta);
}

export function balanceSums(state: CloseState) {
  const debe = state.balanceLines.reduce((n, l) => n + l.debe, 0);
  const haber = state.balanceLines.reduce((n, l) => n + l.haber, 0);
  return { debe, haber, balanced: debe === haber, diff: Math.abs(debe - haber) };
}

export function pendingBankRows(state: CloseState) {
  return state.bankRows.filter((r) => r.st !== "ok");
}

export function bankDifference(state: CloseState): number {
  return pendingBankRows(state).reduce((n, r) => n + Math.abs(r.amount), 0);
}

/** The IVA row of the tax list is computed, never stored. */
export function taxAmount(tax: TaxObligation, state: CloseState): number {
  if (tax.derived === "iva_periodo") return books(state).ivaAPagar;
  return tax.amount ?? 0;
}

export function overdueTaxes(state: CloseState): TaxObligation[] {
  return state.taxes.filter((t) => t.status === "vencido");
}

export interface CloseStepView {
  id: string;
  n: number;
  label: string;
  detail: string;
  right: string | null;
  action: string | null;
  to: string | null;
  open: boolean;
  blocks: boolean;
}

/**
 * The nine steps of the close, and whether each is still open. This is the one
 * place the queue, the pipeline tooltips and the "Cerrar período" gate read from.
 */
export function buildSteps(state: CloseState, c: CloseCopy, language: Lang): CloseStepView[] {
  const bk = books(state);
  const issues = filesWithExceptions(state, language);
  const avisos = issues.reduce((n, x) => n + x.exceptions.length, 0);
  const undefinedLines = undefinedBalanceLines(state);
  const pend = pendingBankRows(state);
  const diff = bankDifference(state);
  const bps = state.taxes.find((t) => t.id === "t-bps");
  const bpsOverdue = bps?.status === "vencido";
  const missing = state.missing[0]?.name ?? "";
  const loaded = state.files.length;
  const expected = loaded + state.missing.length;

  const firstIssue = issues[0];
  const problems = firstIssue
    ? Array.from(new Set(firstIssue.exceptions.map((e) => e.label.toLowerCase()))).join(", ")
    : "";

  const steps: Array<Omit<CloseStepView, "n">> = [
    {
      id: "importar",
      label: c.steps.importar.label,
      detail: c.steps.importar.detail(loaded, expected, missing),
      right: c.steps.importar.right(loaded, expected),
      action: state.missing.length > 0 ? c.steps.importar.action : null,
      to: ROUTES.datos,
      open: state.missing.length > 0,
      blocks: false,
    },
    {
      id: "normalizar",
      label: c.steps.normalizar.label,
      detail: firstIssue
        ? c.steps.normalizar.detail(avisos, firstIssue.file.name, problems)
        : c.criterio.exceptionsClear,
      right: avisos > 0 ? c.steps.normalizar.right(avisos) : null,
      action: avisos > 0 ? c.steps.normalizar.action : null,
      to: firstIssue ? ROUTES.criterio(firstIssue.file.id) : ROUTES.datos,
      open: avisos > 0,
      blocks: true,
    },
    {
      id: "saldos",
      label: c.steps.saldos.label,
      detail:
        undefinedLines.length > 0
          ? c.steps.saldos.detail(undefinedLines.length, undefinedLines.map((l) => l.texto).join(" y "))
          : c.saldos.allSet,
      right:
        undefinedLines.length > 0
          ? amount(undefinedLines.reduce((n, l) => n + l.debe + l.haber, 0))
          : null,
      action: undefinedLines.length > 0 ? c.steps.saldos.action : null,
      to: ROUTES.saldos,
      open: undefinedLines.length > 0,
      blocks: true,
    },
    {
      id: "emitidos",
      label: c.steps.emitidos.label,
      detail: c.steps.emitidos.detail(bk.ventas.docCount),
      right: null,
      action: null,
      to: null,
      open: false,
      blocks: false,
    },
    {
      id: "recibidos",
      label: c.steps.recibidos.label,
      detail: c.steps.recibidos.detail(bk.compras.docCount),
      right: null,
      action: null,
      to: null,
      open: false,
      blocks: false,
    },
    {
      id: "concil",
      label: c.steps.concil.label,
      detail: c.steps.concil.detail(pend.length),
      right: pend.length > 0 ? amount(diff) : null,
      action: pend.length > 0 ? c.steps.concil.action : null,
      to: ROUTES.concil,
      open: pend.length > 0,
      blocks: true,
    },
    {
      id: "iva",
      label: c.steps.iva.label,
      detail: c.steps.iva.detail(
        amount(bk.ivaAPagar),
        dayMonth(state.taxes.find((t) => t.derived === "iva_periodo")?.due ?? state.period.end)
      ),
      right: null,
      action: null,
      to: null,
      open: false,
      blocks: false,
    },
    {
      id: "nomina",
      label: c.steps.nomina.label,
      detail: bpsOverdue
        ? c.steps.nomina.detail(daysBetween(bps!.due, state.period.today))
        : c.steps.nomina.detailDone,
      right: bpsOverdue ? amount(bps!.amount ?? 0) : null,
      action: bpsOverdue ? c.steps.nomina.action : null,
      to: ROUTES.impuestos,
      open: !!bpsOverdue,
      blocks: true,
    },
    {
      id: "entrega",
      label: c.steps.entrega.label,
      detail: state.packageGeneratedAt
        ? c.steps.entrega.detailDone(state.packageGeneratedAt)
        : c.steps.entrega.detail,
      right: null,
      action: state.packageGeneratedAt ? null : c.steps.entrega.action,
      to: ROUTES.entrega,
      open: !state.packageGeneratedAt,
      blocks: false,
    },
  ];

  return steps.map((s, i) => ({ ...s, n: i + 1 }));
}

export interface CloseSummary {
  steps: CloseStepView[];
  openSteps: CloseStepView[];
  doneSteps: CloseStepView[];
  blockers: CloseStepView[];
  blocked: boolean;
}

export function summarise(state: CloseState, c: CloseCopy, language: Lang): CloseSummary {
  const steps = buildSteps(state, c, language);
  const openSteps = steps.filter((s) => s.open);
  const doneSteps = steps.filter((s) => !s.open);
  const blockers = openSteps.filter((s) => s.blocks);
  return { steps, openSteps, doneSteps, blockers, blocked: blockers.length > 0 };
}

export interface DeliverableView {
  key: string;
  label: string;
  meta: string;
  hint: string;
  on: boolean;
}

export function deliverables(state: CloseState, c: CloseCopy): DeliverableView[] {
  const bk = books(state);
  const d = c.entrega.deliverables;
  const rows: Array<[string, { label: string; meta: (n: number) => string; hint: string }, number]> = [
    ["compras", d.compras, bk.compras.docCount],
    ["ventas", d.ventas, bk.ventas.docCount],
    ["iva", d.iva, 1],
    ["asientos", d.asientos, state.asientosAjuste],
    ["apertura", d.apertura, state.balanceLines.length],
    ["concil", d.concil, state.bankRows.length],
  ];
  return rows.map(([key, def, n]) => ({
    key,
    label: def.label,
    meta: def.meta(n),
    hint: def.hint,
    on: !!state.picks[key],
  }));
}

/** Tooltip for a tax row: the description plus how its date sits against today. */
export function taxHint(tax: TaxObligation, state: CloseState, c: CloseCopy): string {
  if (tax.derived === "iva_periodo") {
    const bk = books(state);
    return c.impuestos.ivaHint(amount(bk.ventas.iva), amount(bk.compras.iva));
  }
  if (tax.status === "vencido") return c.impuestos.vencidoHint(tax.detail, daysBetween(tax.due, state.period.today));
  if (tax.status === "presentado") return tax.detail;
  return c.impuestos.pendienteHint(tax.detail, shortDate(tax.due));
}
