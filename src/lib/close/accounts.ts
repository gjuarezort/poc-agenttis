// The practice's chart of accounts, and the matcher that maps a client's own
// wording onto it. Anything the matcher cannot place with confidence becomes a
// decision on the "Saldos iniciales" screen.

export interface ChartAccount {
  code: string;
  name: string;
  /** Words that, in the client's file, point at this account. */
  hints: string[];
}

export const CHART: ChartAccount[] = [
  { code: "1.1.01", name: "Caja", hints: ["caja", "efectivo"] },
  { code: "1.1.02", name: "Bancos", hints: ["banco", "bco", "cta cte", "cuenta corriente", "itau", "brou", "santander"] },
  { code: "1.1.03", name: "Deudores por ventas", hints: ["deudor", "ctas a cobrar", "cuentas a cobrar", "clientes", "cobrar plaza"] },
  { code: "1.1.04", name: "Fondos fijos", hints: ["caja chica"] },
  { code: "1.1.05", name: "Bienes de cambio", hints: ["mercaderia", "stock", "inventario", "deposito"] },
  { code: "1.1.07", name: "IVA compras", hints: ["iva compras", "iva a deducir", "credito fiscal"] },
  { code: "1.1.08", name: "Anticipos a proveedores", hints: ["anticipos a proveedores", "anticipo a proveedor", "anticipos proveedores"] },
  { code: "1.1.09", name: "Gastos anticipados", hints: ["gastos pagados por adelantado", "gastos anticipados", "seguros pagados"] },
  { code: "1.1.10", name: "Otros créditos", hints: ["otros creditos"] },
  { code: "1.2.01", name: "Bienes de uso", hints: ["muebles", "utiles", "bienes de uso", "equipos", "rodados"] },
  { code: "1.2.09", name: "Amortizaciones acumuladas", hints: ["amortizacion", "depreciacion"] },
  { code: "2.1.01", name: "Proveedores", hints: ["proveedor", "acreedores comerciales"] },
  { code: "2.1.02", name: "Remuneraciones a pagar", hints: ["sueldo", "salario", "remuneracion", "jornal"] },
  { code: "2.1.03", name: "Aportes a pagar", hints: ["bps", "aporte", "seguridad social"] },
  { code: "2.1.04", name: "Impuestos a pagar", hints: ["dgi", "impuesto", "tributo"] },
  { code: "2.1.05", name: "IVA a pagar", hints: ["iva ventas", "iva a pagar", "debito fiscal"] },
  { code: "2.1.06", name: "Cuentas socios", hints: ["socio", "accionista"] },
  { code: "2.1.09", name: "Otras deudas", hints: ["otras deudas", "deudas diversas", "acreedores varios", "anticipo"] },
  { code: "2.2.01", name: "Deudas financieras", hints: ["prestamo", "financiacion", "credito bancario"] },
  { code: "3.1.01", name: "Capital", hints: ["capital"] },
  { code: "3.2.01", name: "Resultados acumulados", hints: ["result", "utilidad", "perdida acumulada"] },
];

export function accountLabel(code: string): string {
  const a = CHART.find((x) => x.code === code);
  return a ? `${a.code} ${a.name}` : code;
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export interface AccountMatch {
  /** The account to use, or null when no single account is clearly right. */
  cuenta: string | null;
  /** Plausible accounts, best first — what the decision select offers. */
  candidates: string[];
}

/**
 * Maps a line of the client's opening balance onto the practice's chart.
 * A single hint match wins; a tie, or nothing at all, is left for a human.
 */
export function matchAccount(texto: string, side: "debe" | "haber"): AccountMatch {
  const key = norm(texto);
  const scored = CHART.map((a) => {
    const hit = a.hints.reduce((best, h) => (key.includes(norm(h)) ? Math.max(best, norm(h).length) : best), 0);
    return { account: a, score: hit };
  }).filter((s) => s.score > 0);

  scored.sort((a, b) => b.score - a.score);

  // Balance-sheet side narrows the field when nothing matched by wording.
  const bySide = CHART.filter((a) => (side === "debe" ? a.code.startsWith("1") : a.code.startsWith("2") || a.code.startsWith("3")));

  if (scored.length === 0) {
    // Nothing in the wording points anywhere: offer the whole side of the chart.
    return { cuenta: null, candidates: bySide.map((a) => `${a.code} ${a.name}`) };
  }

  const label = (a: ChartAccount) => `${a.code} ${a.name}`;
  const best = scored[0];
  const runnerUp = scored.find((s) => s.account.code !== best.account.code);
  const candidates = scored.slice(0, 4).map((s) => label(s.account));

  // Two accounts the wording supports almost equally is not a match, it is a question.
  const decisive = !runnerUp || best.score - runnerUp.score >= 4;
  if (!decisive) return { cuenta: null, candidates };
  return { cuenta: label(best.account), candidates };
}
