import type { CloseState, ExportFormat, PackStructure } from "./types";
import { books, fileTotals } from "./derive";
import { shortDate } from "./format";
import { accountLabel } from "./accounts";

// Package generation. CSV only for now — the practice imports these into Memory,
// Zureo or the DGI form, all of which read delimited text. The workbook variants
// (real .xlsx with one tab per book) are a server-side job and land with the
// agentic layer; `structure: "one"` writes the books as sections of one file.

export interface GeneratedFile {
  name: string;
  content: string;
}

const SEP = ";"; // what Uruguayan ERP imports expect, and what Excel es-UY opens cleanly

function csv(rows: (string | number)[][]): string {
  return rows
    .map((r) =>
      r
        .map((cell) => {
          const s = String(cell ?? "");
          return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(SEP)
    )
    .join("\r\n");
}

const REMAINDER_ES = "Resto del período (agregado)";
const REMAINDER_EN = "Rest of the period (aggregated)";

function bookRows(
  state: CloseState,
  kind: "compras" | "ventas",
  fmt: ExportFormat,
  language: "es" | "en"
): (string | number)[][] {
  const docs = state.files.filter((f) => f.kind === kind).flatMap((f) => f.docs.filter((d) => !d.excluded));
  const totals = state.files
    .filter((f) => f.kind === kind)
    .reduce(
      (acc, f) => {
        const t = fileTotals(f);
        return {
          gravado22: acc.gravado22 + t.gravado22,
          gravado10: acc.gravado10 + t.gravado10,
          exento: acc.exento + t.exento,
          iva: acc.iva + t.iva,
          total: acc.total + t.total,
        };
      },
      { gravado22: 0, gravado10: 0, exento: 0, iva: 0, total: 0 }
    );

  // Row-level formats write one line per materialised comprobante. Where a file
  // carries an aggregate the documents do not cover, the difference goes out as
  // one labelled line, so the sheet still foots to the book totals.
  const materialised = docs.reduce((n, d) => n + d.total, 0);
  const materialisedIva = docs.reduce((n, d) => n + d.iva, 0);
  const remainder = totals.total - materialised;
  const remainderIva = totals.iva - materialisedIva;
  const remainderLabel = language === "es" ? REMAINDER_ES : REMAINDER_EN;
  const hasRemainder = Math.round(remainder) !== 0;
  const lastDay = shortDate(state.period.end);

  if (fmt === "dgi") {
    return [
      ["Concepto", "Gravado 22", "Gravado 10", "Exento", "IVA", "Total"],
      [kind === "ventas" ? "Ventas del período" : "Compras del período", totals.gravado22, totals.gravado10, totals.exento, totals.iva, totals.total],
    ];
  }

  if (fmt === "memory") {
    const cuenta = kind === "ventas" ? "1.1.03" : "2.1.01";
    const contra = kind === "ventas" ? "2.1.05" : "1.1.07";
    const head: (string | number)[][] = [["Fecha", "Cuenta", "Debe", "Haber", "Concepto", "Comprobante"]];
    const lines = docs.flatMap((d) => [
      [shortDate(d.fecha), cuenta, kind === "ventas" ? d.total : 0, kind === "ventas" ? 0 : d.total, d.razonSocial, `${d.serie} ${d.numero}`.trim()],
      [shortDate(d.fecha), contra, kind === "ventas" ? 0 : d.iva, kind === "ventas" ? d.iva : 0, "IVA", `${d.serie} ${d.numero}`.trim()],
    ]);
    if (hasRemainder) {
      lines.push(
        [lastDay, cuenta, kind === "ventas" ? remainder : 0, kind === "ventas" ? 0 : remainder, remainderLabel, ""],
        [lastDay, contra, kind === "ventas" ? 0 : remainderIva, kind === "ventas" ? remainderIva : 0, "IVA", ""]
      );
    }
    return [...head, ...lines];
  }

  if (fmt === "zureo") {
    const account = kind === "ventas" ? "1.1.03" : "2.1.01";
    const rows: (string | number)[][] = [
      ["Fecha", "Cod. cuenta", "Centro de costo", "Debe", "Haber", "Detalle", "Doc."],
      ...docs.map((d) => [
        shortDate(d.fecha),
        account,
        "00",
        kind === "ventas" ? d.total : 0,
        kind === "ventas" ? 0 : d.total,
        d.razonSocial,
        `${d.serie} ${d.numero}`.trim(),
      ]),
    ];
    if (hasRemainder) {
      rows.push([lastDay, account, "00", kind === "ventas" ? remainder : 0, kind === "ventas" ? 0 : remainder, remainderLabel, ""]);
    }
    return rows;
  }

  const flat: (string | number)[][] = [
    ["Fecha", "Tipo CFE", "Serie", "Numero", "RUT", "Razon social", "Gravado 22", "Gravado 10", "Exento", "IVA", "Total"],
    ...docs.map((d) => [
      shortDate(d.fecha),
      d.tipoCfe,
      d.serie,
      d.numero,
      d.rut,
      d.razonSocial,
      d.gravado22,
      d.gravado10,
      d.exento,
      d.iva,
      d.total,
    ]),
  ];
  if (hasRemainder) {
    flat.push([
      lastDay,
      "",
      "",
      "",
      "",
      remainderLabel,
      totals.gravado22 - docs.reduce((n, d) => n + d.gravado22, 0),
      totals.gravado10 - docs.reduce((n, d) => n + d.gravado10, 0),
      totals.exento - docs.reduce((n, d) => n + d.exento, 0),
      remainderIva,
      remainder,
    ]);
  }
  return flat;
}

function ivaSummary(state: CloseState): (string | number)[][] {
  const bk = books(state);
  return [
    ["Libro", "Gravado 22", "Gravado 10", "Exento", "IVA", "Total"],
    ["Ventas", bk.ventas.gravado22, bk.ventas.gravado10, bk.ventas.exento, bk.ventas.iva, bk.ventas.total],
    ["Compras", bk.compras.gravado22, bk.compras.gravado10, bk.compras.exento, bk.compras.iva, bk.compras.total],
    ["IVA a pagar", "", "", "", "", bk.ivaAPagar],
  ];
}

function asientos(state: CloseState): (string | number)[][] {
  const bk = books(state);
  const last = state.period.end;
  return [
    ["Fecha", "Cuenta", "Debe", "Haber", "Concepto"],
    [shortDate(last), accountLabel("2.1.05"), bk.ventas.iva, 0, "Cancelación IVA ventas del período"],
    [shortDate(last), accountLabel("1.1.07"), 0, bk.compras.iva, "Cancelación IVA compras del período"],
    [shortDate(last), accountLabel("2.1.04"), 0, bk.ivaAPagar, "IVA a pagar del período"],
  ];
}

function apertura(state: CloseState): (string | number)[][] {
  return [
    ["Texto en el archivo", "Cuenta del plan", "Debe", "Haber"],
    ...state.balanceLines.map((l) => [l.texto, l.cuenta ?? "SIN DEFINIR", l.debe || "", l.haber || ""]),
  ];
}

function conciliacion(state: CloseState, language: "es" | "en"): (string | number)[][] {
  const es = language === "es";
  return [
    ["Fecha", "Referencia", "Descripcion", "Importe", "Estado", "Comprobante"],
    ...state.bankRows.map((r) => {
      const cands = state.candidates[r.id] ?? [];
      const matched = r.st === "ok" && r.matchIdx != null ? cands[r.matchIdx]?.doc ?? "" : "";
      return [
        r.date,
        r.ref,
        r.desc,
        r.amount,
        r.st === "ok" ? (es ? "conciliado" : "reconciled") : es ? "PENDIENTE" : "PENDING",
        r.sinComprobante ? (es ? "sin comprobante" : "no document") : matched,
      ];
    }),
  ];
}

const SLUG: Record<string, string> = {
  compras: "libro_compras",
  ventas: "libro_ventas",
  iva: "resumen_iva",
  asientos: "asientos_ajuste",
  apertura: "balance_apertura",
  concil: "conciliacion_bancaria",
};

/**
 * Builds the package. Returns one file per book, or a single file with the books
 * as labelled sections, depending on the chosen structure.
 */
export function buildPackage(
  state: CloseState,
  language: "es" | "en",
  provisional: boolean,
  formatLabel: string
): GeneratedFile[] {
  const fmt: ExportFormat = state.fmt;
  const structure: PackStructure = state.pack;
  const stamp = state.period.id;
  const client = state.client.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

  const sheets: Array<{ key: string; rows: (string | number)[][] }> = [];
  if (state.picks.compras) sheets.push({ key: "compras", rows: bookRows(state, "compras", fmt, language) });
  if (state.picks.ventas) sheets.push({ key: "ventas", rows: bookRows(state, "ventas", fmt, language) });
  if (state.picks.iva) sheets.push({ key: "iva", rows: ivaSummary(state) });
  if (state.picks.asientos) sheets.push({ key: "asientos", rows: asientos(state) });
  if (state.picks.apertura) sheets.push({ key: "apertura", rows: apertura(state) });
  if (state.picks.concil) sheets.push({ key: "concil", rows: conciliacion(state, language) });

  const banner = [
    `# ${state.client.name} · ${state.period.label} · ${state.client.practice}`,
    `# Criterio ${state.client.criterioVersion} · ${formatLabel}`,
    provisional ? `# ${language === "es" ? "PROVISORIO — quedan definiciones pendientes" : "PROVISIONAL — decisions still pending"}` : null,
  ]
    .filter(Boolean)
    .join("\r\n");

  if (structure === "many") {
    return sheets.map((s) => ({
      name: `${client}_${SLUG[s.key]}_${stamp}${provisional ? "_provisorio" : ""}.csv`,
      content: `${banner}\r\n\r\n${csv(s.rows)}\r\n`,
    }));
  }

  const body = sheets
    .map((s) => `## ${SLUG[s.key].replace(/_/g, " ").toUpperCase()}\r\n${csv(s.rows)}`)
    .join("\r\n\r\n");
  return [
    {
      name: `${client}_cierre_${stamp}${provisional ? "_provisorio" : ""}.csv`,
      content: `${banner}\r\n\r\n${body}\r\n`,
    },
  ];
}

export function downloadFiles(files: GeneratedFile[]): void {
  files.forEach((file, i) => {
    // A short stagger keeps browsers from collapsing several downloads into one.
    window.setTimeout(() => {
      const blob = new Blob([`﻿${file.content}`], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, i * 220);
  });
}

/** Used only by the delivery screen's "N hojas" tooltip. */
export function sheetCount(state: CloseState): number {
  return Object.values(state.picks).filter(Boolean).length;
}
