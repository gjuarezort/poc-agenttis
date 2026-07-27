"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useClose } from "../../../context/CloseContext";
import { Amount, Panel, Screen, ScreenTitle } from "../../../components/cierre/ui";
import { bankDifference, pendingBankRows } from "../../../lib/close/derive";
import { booksBalance, candidatesFor, searchDocs } from "../../../lib/close/reconcile";
import { amount } from "../../../lib/close/format";
import type { MatchCandidate } from "../../../lib/close/types";

type Filter = "all" | "pend" | "ok";

export default function ConciliacionPage() {
  const { state, c, language, matchRow, unmatchRow, discardCandidate, addCandidate, registerWithoutDoc } = useClose();
  const [filter, setFilter] = useState<Filter>("all");
  const [selId, setSelId] = useState<number | null>(null);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  const rows = state.bankRows;
  const pend = pendingBankRows(state);
  const diff = bankDifference(state);
  const visible = rows.filter((r) => (filter === "all" ? true : filter === "ok" ? r.st === "ok" : r.st !== "ok"));
  const sel = rows.find((r) => r.id === selId) ?? pend[0] ?? rows[0];

  const settled = sel?.st === "ok";
  const allCands = sel ? candidatesFor(state, sel, language) : [];
  const cands: Array<{ idx: number; cand: MatchCandidate }> = allCands
    .map((cand, idx) => ({ idx, cand }))
    .filter(({ idx }) => (settled ? idx === (sel?.matchIdx ?? 0) : !sel?.discarded.includes(idx)));

  const results = searching ? searchDocs(state, query, c) : [];

  return (
    <Screen gap={24}>
      <ScreenTitle
        title={c.concil.title}
        subtitle={c.concil.subtitle}
        subtitleHint={c.concil.subtitleHint(
          state.client.bank,
          amount(state.client.bankBalance),
          amount(booksBalance(state))
        )}
        maxWidth={600}
        right={
          <div title={c.concil.diffHint}>
            <p className="c-overline" style={{ color: "var(--color-accent-800)" }}>
              {c.concil.aExplicar}
            </p>
            <p className="c-head" style={{ fontSize: 27, lineHeight: 1.1, color: "var(--color-accent-900)" }}>
              {amount(diff)}
            </p>
          </div>
        }
      />

      <div className="c-split c-split-13">
        <Panel>
          <div
            className="c-divider-b"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "13px 20px", flexWrap: "wrap" }}
          >
            <h3 className="c-head" style={{ fontSize: 20 }}>
              {c.concil.movimientos}
            </h3>
            <div className="c-seg">
              {(["all", "pend", "ok"] as Filter[]).map((f) => (
                <label key={f} className="c-seg-opt">
                  <input type="radio" name="cfilter" checked={filter === f} onChange={() => setFilter(f)} />
                  {c.concil.filters[f]}
                </label>
              ))}
            </div>
          </div>

          {visible.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`c-mov-row ${sel?.id === r.id ? "is-selected" : ""}`}
              title={c.concil.rowHint(r.date, r.ref, r.st === "ok")}
              onClick={() => {
                setSelId(r.id);
                setSearching(false);
              }}
            >
              <span style={{ alignSelf: "stretch", background: r.st === "ok" ? "transparent" : "var(--color-accent)" }} />
              <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.desc}
              </span>
              <Amount value={r.amount} size={17} />
            </button>
          ))}

          {visible.length === 0 && (
            <p className="c-muted" style={{ padding: "16px 20px", fontSize: 13 }}>
              {c.concil.empty}
            </p>
          )}

          <div className="c-muted" style={{ padding: "12px 20px", fontSize: 13 }}>
            {c.concil.footer(visible.length, rows.length, amount(diff))}
          </div>
        </Panel>

        {sel && (
          <Panel style={{ padding: "18px 20px" }}>
            <h3 className="c-head" style={{ fontSize: 21 }} title={c.concil.selHint(sel.date, sel.ref, amount(sel.amount))}>
              {sel.desc}
            </h3>
            <p className="c-secondary" style={{ fontSize: 13, marginBottom: 16 }}>
              {settled ? c.concil.settledTitle : c.concil.candTitle}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cands.map(({ idx, cand }) => (
                <div key={`${cand.doc}-${idx}`} className="c-panel" style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
                    <p style={{ fontWeight: 600 }}>{cand.doc}</p>
                    <span className="c-head" style={{ fontSize: 17, whiteSpace: "nowrap" }}>
                      {amount(cand.amount)}
                    </span>
                  </div>
                  <p className="c-secondary" style={{ fontSize: 13, marginBottom: 12 }}>
                    {cand.why}
                  </p>

                  {settled ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span
                        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--color-accent-800)" }}
                      >
                        <CheckCircle2 size={15} strokeWidth={1.5} />
                        {c.concil.conciliado}
                      </span>
                      <button type="button" className="c-btn c-btn-ghost" onClick={() => unmatchRow(sel.id)}>
                        {c.concil.deshacer}
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        className="c-btn c-btn-primary"
                        onClick={() => {
                          setSelId(sel.id);
                          matchRow(sel.id, idx);
                        }}
                      >
                        {c.concil.conciliar}
                      </button>
                      <button type="button" className="c-btn c-btn-secondary" onClick={() => discardCandidate(sel.id, idx)}>
                        {c.concil.descartar}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {!settled && cands.length === 0 && (
                <p className="c-secondary" style={{ fontSize: 13 }}>
                  {c.concil.noCandidates}
                </p>
              )}
            </div>

            {!settled && (
              <div
                className="c-divider-t"
                style={{ marginTop: 16, paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}
              >
                {!searching ? (
                  <button
                    type="button"
                    className="c-btn c-btn-secondary"
                    style={{ justifyContent: "flex-start" }}
                    onClick={() => setSearching(true)}
                  >
                    {c.concil.buscarOtro}
                  </button>
                ) : (
                  <>
                    <input
                      className="c-input"
                      autoFocus
                      placeholder={c.concil.buscarPlaceholder}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {results.map((r) => (
                      <button
                        key={r.doc}
                        type="button"
                        className="c-btn c-btn-secondary"
                        style={{ justifyContent: "space-between", gap: 12 }}
                        onClick={() => {
                          setSelId(sel.id);
                          addCandidate(sel.id, r);
                          setSearching(false);
                          setQuery("");
                        }}
                      >
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{r.doc}</span>
                        <span style={{ whiteSpace: "nowrap" }}>{amount(r.amount)}</span>
                      </button>
                    ))}
                  </>
                )}

                <button
                  type="button"
                  className="c-btn c-btn-ghost"
                  style={{ justifyContent: "flex-start" }}
                  onClick={() => {
                    setSelId(sel.id);
                    registerWithoutDoc(sel.id, {
                      doc: c.concil.sinComprobanteDoc,
                      amount: Math.abs(sel.amount),
                      why: c.concil.sinComprobanteWhy,
                    });
                  }}
                >
                  {c.concil.sinComprobante}
                </button>
              </div>
            )}
          </Panel>
        )}
      </div>
    </Screen>
  );
}
