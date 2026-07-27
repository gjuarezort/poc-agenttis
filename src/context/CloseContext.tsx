"use client";

import React, { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import type {
  BalanceLine,
  BankRow,
  CloseState,
  ColumnMap,
  ExportFormat,
  MatchCandidate,
  PackStructure,
  PeriodFile,
  RowException,
  TargetField,
} from "../lib/close/types";
import { initialCloseState, ZERO_TOTALS } from "../lib/close/seed";
import { CLOSE_COPY, type CloseCopy, type Lang } from "../lib/close/copy";
import {
  detectKind,
  inferMapping,
  parseDelimited,
  readableInBrowser,
  toBalanceLines,
  toBankRows,
  toComprobantes,
} from "../lib/close/detect";
import { matchAccount } from "../lib/close/accounts";
import { exceptionKey, expectedIva, rutCheckDigit } from "../lib/close/validate";
import { summarise, type CloseSummary } from "../lib/close/derive";
import { buildPackage, downloadFiles } from "../lib/close/exportPackage";

interface CloseContextValue {
  state: CloseState;
  language: Lang;
  setLanguage: (lang: Lang) => void;
  c: CloseCopy;
  summary: CloseSummary;

  uploading: boolean;
  uploadFiles: (files: FileList | File[]) => Promise<void>;
  removeFile: (fileId: string) => void;

  setMapField: (fileId: string, index: number, field: TargetField) => void;
  setRemember: (fileId: string, remember: boolean) => void;
  confirmCriterio: (fileId: string) => void;
  applyException: (fileId: string, e: RowException) => void;
  skipException: (fileId: string, e: RowException) => void;

  setBalanceAccount: (lineId: string, cuenta: string) => void;

  matchRow: (rowId: number, candIdx: number) => void;
  unmatchRow: (rowId: number) => void;
  discardCandidate: (rowId: number, candIdx: number) => void;
  addCandidate: (rowId: number, candidate: MatchCandidate) => void;
  registerWithoutDoc: (rowId: number, candidate: MatchCandidate) => void;

  regularizeTax: (taxId: string) => void;

  togglePick: (key: string) => void;
  setFmt: (fmt: ExportFormat) => void;
  setPack: (pack: PackStructure) => void;
  generatePackage: () => void;

  closePeriod: () => void;
  reopenPeriod: () => void;
}

const CloseContext = createContext<CloseContextValue | undefined>(undefined);

const LANG_KEY = "agenttis-lang";

// The language preference lives in localStorage, shared with the platform shell.
// Reading it through an external store (rather than an effect) lets the server
// render Spanish — the flow's design language — and the client swap in the
// stored preference during hydration without a cascading render.
let cachedLang: Lang | null = null;
const langListeners = new Set<() => void>();

function subscribeLang(onChange: () => void) {
  langListeners.add(onChange);
  return () => {
    langListeners.delete(onChange);
  };
}

function readLang(): Lang {
  if (cachedLang === null) {
    cachedLang = window.localStorage.getItem(LANG_KEY) === "en" ? "en" : "es";
  }
  return cachedLang;
}

function serverLang(): Lang {
  return "es";
}

function writeLang(lang: Lang) {
  cachedLang = lang;
  window.localStorage.setItem(LANG_KEY, lang);
  langListeners.forEach((listener) => listener());
}

export function CloseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CloseState>(() => initialCloseState());
  const [uploading, setUploading] = useState(false);
  const language = useSyncExternalStore(subscribeLang, readLang, serverLang);
  const setLanguage = useCallback((lang: Lang) => writeLang(lang), []);

  const c = CLOSE_COPY[language];
  const summary = useMemo(() => summarise(state, c, language), [state, c, language]);

  const patchFile = useCallback((fileId: string, fn: (f: PeriodFile) => PeriodFile) => {
    setState((s) => ({ ...s, files: s.files.map((f) => (f.id === fileId ? fn(f) : f)) }));
  }, []);

  // ── Files ────────────────────────────────────────────────────────────────

  const uploadFiles = useCallback(
    async (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      if (!list.length) return;
      setUploading(true);
      try {
        for (const [index, file] of list.entries()) {
          const id = `up-${file.name.replace(/\W+/g, "-")}-${file.size}-${index}`;

          if (!readableInBrowser(file.name)) {
            // XLSX and friends are a server-side parse; the row keeps the file
            // visible and says plainly that it is waiting.
            setState((s) => ({
              ...s,
              files: [
                ...s.files,
                {
                  id,
                  name: file.name,
                  kind: "desconocido",
                  rowCount: 0,
                  loadedAt: CLOSE_COPY[language].datos.justNow,
                  maps: [],
                  docs: [],
                  docsComplete: false,
                  totals: null,
                  criterioOwner: "",
                  confirmed: false,
                  rememberCriterio: false,
                  adjust: { ...ZERO_TOTALS },
                  rowsExcluded: 0,
                  awaitingServerParse: true,
                  source: "upload",
                },
              ],
            }));
            continue;
          }

          const text = await file.text();
          const table = parseDelimited(text);
          const kind = detectKind(table.headers, file.name);
          const maps: ColumnMap[] =
            kind === "compras" || kind === "ventas" ? inferMapping(table.headers, table.rows[0] ?? {}) : [];

          setState((s) => {
            const next: CloseState = { ...s };

            if (kind === "saldos") {
              const lines: BalanceLine[] = toBalanceLines(table, id).map((l) => {
                if (l.cuenta) return l;
                const m = matchAccount(l.texto, l.debe > 0 ? "debe" : "haber");
                return { ...l, cuenta: m.cuenta, candidates: m.candidates };
              });
              next.balanceLines = lines;
            }

            if (kind === "extracto") {
              const startId = Math.max(0, ...s.bankRows.map((r) => r.id)) + 1;
              const rows: BankRow[] = toBankRows(table, startId);
              next.bankRows = [...s.bankRows, ...rows];
            }

            const docs =
              kind === "compras" || kind === "ventas" ? toComprobantes(table, maps, id) : [];

            next.files = [
              ...s.files,
              {
                id,
                name: file.name,
                kind,
                rowCount: table.rows.length,
                loadedAt: CLOSE_COPY[language].datos.justNow,
                maps,
                docs,
                docsComplete: true,
                totals: null,
                criterioOwner: docs[0]?.razonSocial ?? file.name,
                confirmed: false,
                rememberCriterio: true,
                adjust: { ...ZERO_TOTALS },
                rowsExcluded: 0,
                source: "upload",
              },
            ];

            // A period has exactly one opening balance, so a new one replaces the
            // file it supersedes. Bank statements accumulate: a period can span
            // several of them.
            if (kind === "saldos") {
              next.files = next.files.filter((f) => f.kind !== "saldos" || f.id === id);
            }

            // An uploaded file of the kind the period was waiting for closes that gap.
            next.missing = s.missing.filter((m) => m.kind !== kind);
            return next;
          });
        }
      } finally {
        setUploading(false);
      }
    },
    [language]
  );

  const removeFile = useCallback((fileId: string) => {
    setState((s) => ({ ...s, files: s.files.filter((f) => f.id !== fileId) }));
  }, []);

  // ── Criterio ─────────────────────────────────────────────────────────────

  const setMapField = useCallback(
    (fileId: string, index: number, field: TargetField) => {
      patchFile(fileId, (f) => ({
        ...f,
        maps: f.maps.map((m, i) => (i === index ? { ...m, field, conf: "Definido" } : m)),
      }));
    },
    [patchFile]
  );

  const setRemember = useCallback(
    (fileId: string, remember: boolean) => patchFile(fileId, (f) => ({ ...f, rememberCriterio: remember })),
    [patchFile]
  );

  const confirmCriterio = useCallback(
    (fileId: string) => patchFile(fileId, (f) => ({ ...f, confirmed: true })),
    [patchFile]
  );

  /** Applies a resolution to the offending row and moves the file's totals by
   *  exactly what the change is worth. */
  const applyException = useCallback(
    (fileId: string, e: RowException) => {
      patchFile(fileId, (f) => {
        const doc = f.docs.find((d) => d.id === e.docId);
        if (!doc) return f;

        if (e.code === "rut") {
          const dv = rutCheckDigit(doc.rut);
          if (dv < 0) return f;
          const fixed = `${doc.rut.replace(/\D/g, "").slice(0, 11)}${dv}`;
          return { ...f, docs: f.docs.map((d) => (d.id === doc.id ? { ...d, rut: fixed } : d)) };
        }

        if (e.code === "iva") {
          const target = expectedIva(doc);
          const delta = target - doc.iva;
          return {
            ...f,
            docs: f.docs.map((d) => (d.id === doc.id ? { ...d, iva: target, total: d.total + delta } : d)),
            adjust: { ...f.adjust, iva: f.adjust.iva + delta, total: f.adjust.total + delta },
          };
        }

        // periodo / duplicado — the row leaves the period's books.
        return {
          ...f,
          docs: f.docs.map((d) => (d.id === doc.id ? { ...d, excluded: true } : d)),
          rowsExcluded: f.rowsExcluded + 1,
          adjust: {
            gravado22: f.adjust.gravado22 - doc.gravado22,
            gravado10: f.adjust.gravado10 - doc.gravado10,
            exento: f.adjust.exento - doc.exento,
            iva: f.adjust.iva - doc.iva,
            total: f.adjust.total - doc.total,
          },
        };
      });
    },
    [patchFile]
  );

  /** "Dejar como está" — the accountant judged the row acceptable as it is. */
  const skipException = useCallback((fileId: string, e: RowException) => {
    setState((s) => ({ ...s, resolvedExceptions: [...s.resolvedExceptions, exceptionKey(fileId, e)] }));
  }, []);

  // ── Saldos iniciales ─────────────────────────────────────────────────────

  const setBalanceAccount = useCallback((lineId: string, cuenta: string) => {
    setState((s) => ({
      ...s,
      balanceLines: s.balanceLines.map((l) => (l.id === lineId ? { ...l, cuenta: cuenta || null } : l)),
    }));
  }, []);

  // ── Conciliación ─────────────────────────────────────────────────────────

  const matchRow = useCallback((rowId: number, candIdx: number) => {
    setState((s) => ({
      ...s,
      bankRows: s.bankRows.map((r) =>
        r.id === rowId ? { ...r, st: "ok", matchIdx: candIdx, sinComprobante: false } : r
      ),
    }));
  }, []);

  const unmatchRow = useCallback((rowId: number) => {
    setState((s) => ({
      ...s,
      bankRows: s.bankRows.map((r) =>
        r.id === rowId ? { ...r, st: "pend", matchIdx: null, sinComprobante: false, discarded: [] } : r
      ),
    }));
  }, []);

  const discardCandidate = useCallback((rowId: number, candIdx: number) => {
    setState((s) => ({
      ...s,
      bankRows: s.bankRows.map((r) =>
        r.id === rowId ? { ...r, discarded: [...r.discarded, candIdx] } : r
      ),
    }));
  }, []);

  /** Adds a hand-picked document to a row's candidate list and returns its index. */
  const addCandidate = useCallback((rowId: number, candidate: MatchCandidate) => {
    setState((s) => {
      const list = s.candidates[rowId] ?? [];
      const next = [...list, candidate];
      return {
        ...s,
        candidates: { ...s.candidates, [rowId]: next },
        bankRows: s.bankRows.map((r) =>
          r.id === rowId ? { ...r, st: "ok", matchIdx: next.length - 1, sinComprobante: false } : r
        ),
      };
    });
  }, []);

  const registerWithoutDoc = useCallback((rowId: number, candidate: MatchCandidate) => {
    setState((s) => {
      const list = s.candidates[rowId] ?? [];
      const next = [...list, candidate];
      return {
        ...s,
        candidates: { ...s.candidates, [rowId]: next },
        bankRows: s.bankRows.map((r) =>
          r.id === rowId ? { ...r, st: "ok", matchIdx: next.length - 1, sinComprobante: true } : r
        ),
      };
    });
  }, []);

  // ── Impuestos ────────────────────────────────────────────────────────────

  const regularizeTax = useCallback((taxId: string) => {
    setState((s) => ({
      ...s,
      taxes: s.taxes.map((t) => (t.id === taxId ? { ...t, status: "presentado" } : t)),
    }));
  }, []);

  // ── Entrega ──────────────────────────────────────────────────────────────

  const togglePick = useCallback((key: string) => {
    setState((s) => ({ ...s, picks: { ...s.picks, [key]: !s.picks[key] } }));
  }, []);

  const setFmt = useCallback((fmt: ExportFormat) => setState((s) => ({ ...s, fmt })), []);
  const setPack = useCallback((pack: PackStructure) => setState((s) => ({ ...s, pack })), []);

  const generatePackage = useCallback(() => {
    const files = buildPackage(state, language, summary.blocked, c.entrega.formats[state.fmt]);
    if (!files.length) return;
    downloadFiles(files);
    setState((s) => ({
      ...s,
      packageGeneratedAt: `${s.period.label.toLowerCase()}${summary.blocked ? " · provisorio" : ""}`,
    }));
  }, [state, language, summary.blocked, c]);

  // ── Período ──────────────────────────────────────────────────────────────

  const closePeriod = useCallback(() => setState((s) => ({ ...s, periodClosed: true })), []);
  const reopenPeriod = useCallback(() => setState((s) => ({ ...s, periodClosed: false })), []);

  const value: CloseContextValue = {
    state,
    language,
    setLanguage,
    c,
    summary,
    uploading,
    uploadFiles,
    removeFile,
    setMapField,
    setRemember,
    confirmCriterio,
    applyException,
    skipException,
    setBalanceAccount,
    matchRow,
    unmatchRow,
    discardCandidate,
    addCandidate,
    registerWithoutDoc,
    regularizeTax,
    togglePick,
    setFmt,
    setPack,
    generatePackage,
    closePeriod,
    reopenPeriod,
  };

  return <CloseContext.Provider value={value}>{children}</CloseContext.Provider>;
}

export function useClose(): CloseContextValue {
  const ctx = useContext(CloseContext);
  if (!ctx) throw new Error("useClose must be used within a CloseProvider");
  return ctx;
}
