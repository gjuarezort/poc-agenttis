import type { Comprobante, PeriodFile, PeriodMeta, RowException } from "./types";
import { amount, shortDate } from "./format";

/** Multipliers for the 11 significant digits of a Uruguayan RUT. */
const RUT_COEF = [4, 3, 6, 7, 8, 9, 2, 3, 4, 5, 6];

/** The check digit a RUT's first 11 digits imply. -1 when the number cannot exist. */
export function rutCheckDigit(rut: string): number {
  const digits = rut.replace(/\D/g, "");
  if (digits.length < 11) return -1;
  const sum = RUT_COEF.reduce((acc, coef, i) => acc + Number(digits[i]) * coef, 0);
  const rest = sum % 11;
  const dv = rest === 0 ? 0 : 11 - rest;
  return dv === 10 ? -1 : dv;
}

export function isValidRut(rut: string): boolean {
  const digits = rut.replace(/\D/g, "");
  if (digits.length !== 12) return false;
  return rutCheckDigit(digits) === Number(digits[11]);
}

/** IVA the rates imply for a document, rounded to the peso. */
export function expectedIva(doc: Comprobante): number {
  return Math.round(doc.gravado22 * 0.22 + doc.gravado10 * 0.1);
}

/** One peso of slack absorbs per-document rounding in the source system. */
const IVA_TOLERANCE = 1;

/**
 * The normaliser's exception pass. Runs over the comprobantes a file
 * materialised and returns everything a human has to look at.
 */
export function validateDocs(
  docs: Comprobante[],
  period: PeriodMeta,
  language: "es" | "en" = "es"
): RowException[] {
  const es = language === "es";
  const out: RowException[] = [];
  const seen = new Map<string, Comprobante>();

  for (const doc of docs) {
    if (doc.excluded) continue;

    if (!isValidRut(doc.rut)) {
      const dv = rutCheckDigit(doc.rut);
      out.push({
        docId: doc.id,
        row: doc.row,
        code: "rut",
        label: es ? "RUT con dígito verificador inválido" : "RUT check digit does not hold",
        detail: es
          ? `${doc.rut} — el dígito verificador no cierra${dv >= 0 ? `, corresponde ${dv}` : ""}`
          : `${doc.rut} — check digit fails${dv >= 0 ? `, should be ${dv}` : ""}`,
        fix: es
          ? `Corregir el dígito verificador a ${dv >= 0 ? dv : "—"}`
          : `Set the check digit to ${dv >= 0 ? dv : "—"}`,
      });
    }

    const iva = expectedIva(doc);
    if (Math.abs(doc.iva - iva) > IVA_TOLERANCE) {
      out.push({
        docId: doc.id,
        row: doc.row,
        code: "iva",
        label: es ? "El IVA no cierra con el neto gravado" : "VAT does not match the taxable base",
        detail: es
          ? `Declara $ ${amount(doc.iva)} · corresponde $ ${amount(iva)}`
          : `Declared $ ${amount(doc.iva)} · should be $ ${amount(iva)}`,
        fix: es ? `Ajustar el IVA a ${amount(iva)}` : `Set VAT to ${amount(iva)}`,
      });
    }

    if (doc.fecha < period.start || doc.fecha > period.end) {
      out.push({
        docId: doc.id,
        row: doc.row,
        code: "periodo",
        label: es ? "Fecha fuera del período" : "Date outside the period",
        detail: es
          ? `${shortDate(doc.fecha)} — ${doc.fecha < period.start ? "anterior" : "posterior"} al período`
          : `${shortDate(doc.fecha)} — ${doc.fecha < period.start ? "before" : "after"} the period`,
        fix: es ? "Dejar la fila fuera del período" : "Leave the row out of the period",
      });
    }

    const key = `${doc.tipoCfe}|${doc.serie}|${doc.numero}|${doc.rut}`;
    const twin = seen.get(key);
    if (twin) {
      out.push({
        docId: doc.id,
        row: doc.row,
        code: "duplicado",
        label: es ? "Comprobante duplicado" : "Duplicate document",
        detail: es
          ? `${doc.serie} ${doc.numero} ya existe en el libro (f.${twin.row})`
          : `${doc.serie} ${doc.numero} already in the book (row ${twin.row})`,
        fix: es ? "Excluir la fila duplicada" : "Drop the duplicate row",
      });
    } else {
      seen.set(key, doc);
    }
  }

  return out.sort((a, b) => a.row - b.row);
}

/** Exceptions still open on a file, i.e. not resolved by the accountant. */
export function openExceptions(
  file: PeriodFile,
  period: PeriodMeta,
  resolved: string[],
  language: "es" | "en" = "es"
): RowException[] {
  return validateDocs(file.docs, period, language).filter(
    (e) => !resolved.includes(`${file.id}:${e.docId}:${e.code}`)
  );
}

export function exceptionKey(fileId: string, e: RowException): string {
  return `${fileId}:${e.docId}:${e.code}`;
}
