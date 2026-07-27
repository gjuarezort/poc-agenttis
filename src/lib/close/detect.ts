import Papa from "papaparse";
import type {
  BalanceLine,
  BankRow,
  Certainty,
  ColumnMap,
  Comprobante,
  FileKind,
  TargetField,
} from "./types";
import { parseAmount, toIso } from "./format";

export const TARGET_FIELDS: TargetField[] = [
  "fecha_emision",
  "tipo_cfe",
  "serie_numero",
  "rut_contraparte",
  "razon_social",
  "moneda",
  "gravado_22",
  "gravado_10",
  "exento",
  "iva_22",
  "iva_10",
  "total",
  "cuenta_contable",
  "(no importar)",
];

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Header patterns per target field, most specific first. */
const FIELD_PATTERNS: Array<{ field: TargetField; conf: Certainty; test: RegExp }> = [
  { field: "gravado_22", conf: "Alta", test: /(grav|neto|base).*(22)|22.*(grav|neto|base)/ },
  { field: "gravado_10", conf: "Alta", test: /(grav|neto|base).*(10)|10.*(grav|neto|base)/ },
  { field: "iva_22", conf: "Alta", test: /iva.*22|22.*iva/ },
  { field: "iva_10", conf: "Alta", test: /iva.*10|10.*iva/ },
  { field: "exento", conf: "Media", test: /exent|no grav/ },
  { field: "total", conf: "Alta", test: /^total|total (doc|comprobante|factura)|importe total/ },
  { field: "rut_contraparte", conf: "Alta", test: /\brut\b|\bruc\b|documento fiscal/ },
  { field: "razon_social", conf: "Alta", test: /razon social|nombre|proveedor|cliente|emisor$/ },
  { field: "fecha_emision", conf: "Alta", test: /fecha|f emision|emision/ },
  { field: "tipo_cfe", conf: "Alta", test: /tipo|cfe|comprobante$/ },
  { field: "serie_numero", conf: "Alta", test: /serie|^nro|numero|^num\b|^n$/ },
  { field: "moneda", conf: "Media", test: /moneda|^mon\b|divisa|currency/ },
  { field: "cuenta_contable", conf: "Media", test: /cuenta|imputacion|plan/ },
];

/**
 * Infers the mapping from a file's columns to the practice's fields.
 * Certainty is what the UI flags: "Revisar" is the only state that gets a marker.
 */
export function inferMapping(headers: string[], sampleRow: Record<string, string>): ColumnMap[] {
  const used = new Set<TargetField>();
  return headers.map((src) => {
    const key = norm(src);
    let field: TargetField = "(no importar)";
    let conf: Certainty = "Revisar";

    for (const p of FIELD_PATTERNS) {
      if (!p.test.test(key)) continue;
      if (used.has(p.field)) continue;
      field = p.field;
      conf = p.conf;
      break;
    }

    // A column we could not place, but that clearly holds money, is worth a look
    // rather than a silent "(no importar)".
    if (field === "(no importar)") {
      const sample = String(sampleRow?.[src] ?? "");
      if (/^[\s$]*[\d.,]+$/.test(sample) && sample.trim()) {
        field = "total";
        conf = "Revisar";
      } else {
        conf = "Media";
      }
    }

    if (field !== "(no importar)") used.add(field);
    return { src, sample: String(sampleRow?.[src] ?? ""), field, conf };
  });
}

/** What kind of file this is, decided by its columns rather than its name. */
export function detectKind(headers: string[], fileName: string): FileKind {
  const keys = headers.map(norm);
  const has = (re: RegExp) => keys.some((k) => re.test(k));
  const name = norm(fileName);

  if (has(/^debe$/) && has(/^haber$/)) return "saldos";
  if (has(/saldo/) && (has(/concepto|descripcion|detalle/) || has(/credito|debito/))) return "extracto";

  const looksLikeBook = has(/\brut\b/) || has(/cfe|tipo doc/) || has(/iva/);
  if (looksLikeBook) {
    if (has(/proveedor/) || /compra|gasto/.test(name)) return "compras";
    if (has(/cliente/) || /venta|factur/.test(name)) return "ventas";
    return "compras";
  }

  if (/saldo|apertura|balance/.test(name)) return "saldos";
  if (/extracto|banco|movimiento/.test(name)) return "extracto";
  return "desconocido";
}

export interface ParsedTable {
  headers: string[];
  rows: Record<string, string>[];
}

/** Browser-side parse. CSV and TXT only — see `readFile`. */
export function parseDelimited(text: string): ParsedTable {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    delimitersToGuess: [",", ";", "\t", "|"],
  });
  const rows = (result.data || []).filter((r) => Object.values(r).some((v) => String(v ?? "").trim()));
  const headers = (result.meta.fields || []).filter(Boolean) as string[];
  return { headers, rows };
}

function pick(row: Record<string, string>, maps: ColumnMap[], field: TargetField): string {
  const m = maps.find((x) => x.field === field);
  return m ? String(row[m.src] ?? "") : "";
}

/** Turns mapped rows into comprobantes. IVA is taken as declared, never repaired here —
 *  disagreement with the rates is an exception a human resolves. */
export function toComprobantes(
  table: ParsedTable,
  maps: ColumnMap[],
  fileId: string
): Comprobante[] {
  return table.rows.map((row, i) => {
    const g22 = parseAmount(pick(row, maps, "gravado_22"));
    const g10 = parseAmount(pick(row, maps, "gravado_10"));
    const exento = parseAmount(pick(row, maps, "exento"));
    const iva =
      parseAmount(pick(row, maps, "iva_22")) + parseAmount(pick(row, maps, "iva_10"));
    const total = parseAmount(pick(row, maps, "total")) || g22 + g10 + exento + iva;
    const serieNumero = pick(row, maps, "serie_numero").trim();
    const parts = serieNumero.split(/\s+/);
    return {
      id: `${fileId}-r${i + 1}`,
      row: i + 1,
      fecha: toIso(pick(row, maps, "fecha_emision")),
      tipoCfe: pick(row, maps, "tipo_cfe") || "—",
      serie: parts.length > 1 ? parts[0] : "",
      numero: parts.length > 1 ? parts.slice(1).join(" ") : serieNumero,
      rut: pick(row, maps, "rut_contraparte").replace(/\D/g, ""),
      razonSocial: pick(row, maps, "razon_social") || "—",
      gravado22: g22,
      gravado10: g10,
      exento,
      iva,
      total,
    };
  });
}

const DEBE_RE = /^debe$|debito/;
const HABER_RE = /^haber$|credito/;

export function toBalanceLines(table: ParsedTable, fileId: string): BalanceLine[] {
  const debeCol = table.headers.find((h) => DEBE_RE.test(norm(h)));
  const haberCol = table.headers.find((h) => HABER_RE.test(norm(h)));
  const textCol =
    table.headers.find((h) => /cuenta|concepto|detalle|descripcion|texto/.test(norm(h))) ??
    table.headers[0];
  const planCol = table.headers.find((h) => /plan|imputacion|codigo/.test(norm(h)));

  return table.rows.map((row, i) => ({
    id: `${fileId}-l${i + 1}`,
    texto: String(row[textCol] ?? "").trim(),
    cuenta: planCol ? String(row[planCol] ?? "").trim() || null : null,
    debe: debeCol ? parseAmount(row[debeCol]) : 0,
    haber: haberCol ? parseAmount(row[haberCol]) : 0,
    candidates: [],
  }));
}

export function toBankRows(table: ParsedTable, startId: number): BankRow[] {
  const dateCol = table.headers.find((h) => /fecha|date/.test(norm(h))) ?? table.headers[0];
  const descCol =
    table.headers.find((h) => /concepto|descripcion|detalle|glosa/.test(norm(h))) ??
    table.headers[1];
  const refCol = table.headers.find((h) => /referencia|ref|comprobante|nro/.test(norm(h)));
  const amountCol = table.headers.find((h) => /importe|monto|amount/.test(norm(h)));
  const debitCol = table.headers.find((h) => /debito|debe|salida/.test(norm(h)));
  const creditCol = table.headers.find((h) => /credito|haber|entrada/.test(norm(h)));

  return table.rows.map((row, i) => {
    const value = amountCol
      ? parseAmount(row[amountCol])
      : parseAmount(row[creditCol ?? ""]) - parseAmount(row[debitCol ?? ""]);
    return {
      id: startId + i,
      date: String(row[dateCol] ?? ""),
      ref: refCol ? String(row[refCol] ?? "") : "—",
      desc: String(row[descCol] ?? "").trim() || "—",
      amount: value,
      st: "pend" as const,
      matchIdx: null,
      discarded: [],
    };
  });
}

/** Formats the browser can read on its own. Anything else waits for the server pass. */
export function readableInBrowser(fileName: string): boolean {
  return /\.(csv|txt|tsv)$/i.test(fileName);
}
