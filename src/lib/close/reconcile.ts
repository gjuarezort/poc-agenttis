import type { BankRow, CloseState, Comprobante, MatchCandidate } from "./types";
import { amount, shortDate, toIso } from "./format";
import type { CloseCopy } from "./copy";

/** Every comprobante the period knows about, across all books. */
export function allDocs(state: CloseState): Comprobante[] {
  return state.files.flatMap((f) => f.docs.filter((d) => !d.excluded));
}

function docLabel(d: Comprobante): string {
  const kind = d.tipoCfe.replace(/\s*\(\d+\)$/, "");
  const serie = [d.serie, d.numero].filter(Boolean).join(" ");
  return `${kind} ${serie} — ${d.razonSocial}`;
}

/**
 * Proposes documents for a bank movement, best first, each with the reason it
 * was proposed. This is the seam the AI layer replaces: the reason is what the
 * accountant actually reads, so a better matcher means a better sentence here.
 */
export function generateCandidates(row: BankRow, docs: Comprobante[], language: "es" | "en" = "es"): MatchCandidate[] {
  const es = language === "es";
  const target = Math.abs(row.amount);
  const rowDate = toIso(row.date.split(" ")[0].replace(/\//g, "-").split("-").reverse().join("-"));

  const scored = docs
    .map((d) => {
      const delta = Math.abs(d.total - target);
      const exact = delta === 0;
      const near = delta / Math.max(target, 1) < 0.02;
      if (!exact && !near) return null;

      const refHit = row.ref && d.numero && row.ref.replace(/\D/g, "").endsWith(d.numero.replace(/^0+/, ""));
      const nameHit = d.razonSocial
        .split(/\s+/)
        .some((w) => w.length > 3 && row.desc.toLowerCase().includes(w.toLowerCase()));

      const reason = es
        ? [
            exact ? "Mismo importe" : `Importe cercano (${amount(d.total)})`,
            `emitida el ${shortDate(d.fecha)}`,
            refHit ? "la referencia del banco coincide con el número" : null,
            nameHit ? "el nombre aparece en la descripción del movimiento" : null,
          ]
            .filter(Boolean)
            .join(", ") + "."
        : [
            exact ? "Same amount" : `Close amount (${amount(d.total)})`,
            `issued on ${shortDate(d.fecha)}`,
            refHit ? "the bank reference matches the number" : null,
            nameHit ? "the name appears in the movement description" : null,
          ]
            .filter(Boolean)
            .join(", ") + ".";

      const score = (exact ? 4 : 1) + (refHit ? 3 : 0) + (nameHit ? 2 : 0) + (d.fecha <= rowDate ? 1 : 0);
      return { score, candidate: { doc: docLabel(d), amount: d.total, why: reason } };
    })
    .filter(Boolean) as Array<{ score: number; candidate: MatchCandidate }>;

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.candidate);
}

/** Candidates for a row: the authored ones for the seeded statement, generated
 *  ones otherwise, minus whatever the accountant discarded. */
export function candidatesFor(state: CloseState, row: BankRow, language: "es" | "en"): MatchCandidate[] {
  const base = state.candidates[row.id] ?? generateCandidates(row, allDocs(state), language);
  return base;
}

/** Free-text search over the period's documents, for "Buscar otro comprobante…". */
export function searchDocs(state: CloseState, query: string, c: CloseCopy): MatchCandidate[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const digits = q.replace(/\D/g, "");
  return allDocs(state)
    .filter((d) => {
      const hay = `${docLabel(d)} ${d.rut} ${d.total}`.toLowerCase();
      if (hay.includes(q)) return true;
      return digits.length >= 3 && String(d.total).includes(digits);
    })
    .slice(0, 6)
    .map((d) => ({ doc: docLabel(d), amount: d.total, why: c.concil.searchWhy(amount(d.total)) }));
}

/** Books balance implied by the bank balance and the amount still to explain.
 *  Kept in step with the "A explicar" figure, which is the sum of the pending
 *  movements in absolute terms — so the two numbers on screen always agree. */
export function booksBalance(state: CloseState): number {
  const toExplain = state.bankRows
    .filter((r) => r.st !== "ok")
    .reduce((n, r) => n + Math.abs(r.amount), 0);
  return state.client.bankBalance - toExplain;
}
