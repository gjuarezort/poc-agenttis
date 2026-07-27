// Deterministic formatters. Intl is deliberately avoided: these strings render on
// the server and again on the client, and a locale-data difference between the two
// would be a hydration mismatch.

/** 1284500 -> "1.284.500". Always absolute — the sign is rendered separately. */
export function amount(n: number): string {
  const abs = Math.abs(Math.round(n));
  return abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** U+2212 MINUS SIGN, not a hyphen. Only the glyph is ever coloured. */
export const MINUS = "−";

export function signOf(n: number): string {
  return n < 0 ? MINUS : "+";
}

/** "2025-06-03" -> "03/06/2025" */
export function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** "2025-07-20" -> "20/07" */
export function dayMonth(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

/** Whole days between two ISO dates, positive when `b` is later. */
export function daysBetween(a: string, b: string): number {
  const ms = Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

/** "dd/mm/yyyy" -> "yyyy-mm-dd"; passes ISO through untouched. */
export function toIso(date: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const m = date.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (!m) return date;
  return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

/**
 * Reads "1.234,56", "1,234.56", "1234", "$ 1.234" and "(1.234)" alike.
 *
 * The hard case is a single separator: "15.000" is fifteen thousand in a
 * Uruguayan export, not fifteen. A lone separator followed by groups of exactly
 * three digits is read as a thousands separator; anything else is a decimal
 * point.
 */
export function parseAmount(raw: string): number {
  const text = String(raw ?? "").trim();
  if (!text) return 0;
  const negative = /^\(.*\)$/.test(text) || text.includes("-");
  const cleaned = text.replace(/[^\d.,]/g, "");
  if (!cleaned) return 0;

  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");

  let normalised: string;
  if (hasComma && hasDot) {
    // Whichever comes last is the decimal separator.
    normalised =
      cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.replace(/,/g, "");
  } else if (hasComma) {
    normalised = /^\d{1,3}(,\d{3})+$/.test(cleaned) ? cleaned.replace(/,/g, "") : cleaned.replace(",", ".");
  } else if (hasDot) {
    normalised = /^\d{1,3}(\.\d{3})+$/.test(cleaned) ? cleaned.replace(/\./g, "") : cleaned;
  } else {
    normalised = cleaned;
  }

  const n = Number(normalised);
  if (!Number.isFinite(n)) return 0;
  return negative ? -Math.abs(n) : n;
}

/** The day before an ISO date, as ISO. Deterministic — no locale involved. */
export function previousDay(iso: string): string {
  return new Date(Date.parse(`${iso}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10);
}
