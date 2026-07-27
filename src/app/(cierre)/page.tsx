"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useClose } from "../../context/CloseContext";
import { books } from "../../lib/close/derive";
import { amount, dayMonth } from "../../lib/close/format";
import { Amount, Panel, Screen, ScreenTitle } from "../../components/cierre/ui";

/**
 * Resumen — not a dashboard, a queue. It answers one question: what stops me
 * closing this period? Everything the system already resolved is collapsed out
 * of sight, and every figure here is the same derivation the detail screens use.
 */
export default function ResumenPage() {
  const { state, c, summary, reopenPeriod } = useClose();
  const [showDone, setShowDone] = useState(false);

  const bk = books(state);
  const ivaTax = state.taxes.find((t) => t.derived === "iva_periodo");
  const { openSteps, doneSteps, blockers } = summary;

  return (
    <Screen gap={32}>
      <div>
        <ScreenTitle title={c.resumen.title(state.period.label)} subtitle={c.resumen.subtitle} maxWidth={600} />
        {state.periodClosed && (
          <p className="c-accent-text" style={{ fontSize: 13, marginTop: 10 }}>
            {c.resumen.closedNote(state.period.label)}{" "}
            <button type="button" className="c-btn c-btn-ghost" onClick={reopenPeriod}>
              {c.shell.reopen}
            </button>
          </p>
        )}
      </div>

      <div className="c-figures">
        <div
          className="c-panel"
          style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 4 }}
          title={c.resumen.ventasHint(
            bk.ventas.docCount,
            amount(bk.ventas.gravado22),
            amount(bk.ventas.gravado10),
            amount(bk.ventas.exento)
          )}
        >
          <span className="c-overline">{c.resumen.ventas}</span>
          <Amount value={bk.ventas.total} size={31} />
        </div>

        <div
          className="c-panel"
          style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 4 }}
          title={c.resumen.comprasHint(
            bk.compras.docCount,
            amount(bk.compras.gravado22),
            amount(bk.compras.gravado10),
            amount(bk.compras.exento)
          )}
        >
          <span className="c-overline">{c.resumen.compras}</span>
          <Amount value={-bk.compras.total} size={31} />
        </div>

        <div
          className="c-panel c-panel-accent"
          style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 4 }}
          title={c.resumen.ivaHint(amount(bk.ventas.iva), amount(bk.compras.iva))}
        >
          <span className="c-overline" style={{ color: "var(--color-accent-800)" }}>
            {c.resumen.ivaAPagar(dayMonth(ivaTax?.due ?? state.period.end))}
          </span>
          <Amount value={bk.ivaAPagar} size={31} sign={false} color="var(--color-accent-900)" />
        </div>
      </div>

      <Panel>
        <div className="c-divider-b" style={{ padding: "17px 22px" }}>
          <h3 className="c-head" style={{ fontSize: 20 }}>
            {c.resumen.queueTitle(blockers.length)}
          </h3>
        </div>

        {openSteps.map((s) => (
          <div
            key={s.id}
            title={s.detail}
            className="c-divider-b"
            style={{
              display: "grid",
              gridTemplateColumns: "34px 1fr auto 132px",
              gap: "var(--space-6)",
              alignItems: "center",
              padding: "16px 22px",
            }}
          >
            <span
              className="c-head"
              style={{
                width: 34,
                height: 34,
                display: "grid",
                placeItems: "center",
                fontSize: 16,
                border: `1px solid ${s.blocks ? "var(--color-accent)" : "var(--color-divider)"}`,
                background: s.blocks ? "var(--color-accent)" : "transparent",
                color: s.blocks ? "var(--color-bg)" : "inherit",
              }}
            >
              {s.n}
            </span>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{s.label}</p>
            <span
              className="c-head"
              style={{
                fontSize: 17,
                whiteSpace: "nowrap",
                color: s.blocks ? "var(--color-accent-900)" : "var(--color-muted)",
              }}
            >
              {s.right}
            </span>
            {s.action && s.to ? (
              <Link
                href={s.to}
                className="c-btn c-btn-secondary"
                style={{ justifySelf: "end", whiteSpace: "nowrap", textDecoration: "none" }}
              >
                {s.action}
              </Link>
            ) : (
              <span />
            )}
          </div>
        ))}

        {doneSteps.length > 0 && (
          <>
            <button type="button" className="c-btn-plain" onClick={() => setShowDone(!showDone)}>
              <CheckCircle2 size={14} strokeWidth={1.5} />
              {c.resumen.doneToggle(doneSteps.length, showDone)}
            </button>

            {showDone &&
              doneSteps.map((s) => (
                <div
                  key={s.id}
                  className="c-divider-t c-muted"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "34px 1fr",
                    gap: "var(--space-6)",
                    alignItems: "baseline",
                    padding: "9px 22px",
                  }}
                >
                  <span className="c-head" style={{ fontSize: 13, textAlign: "center" }}>
                    {s.n}
                  </span>
                  <p style={{ fontSize: 13 }}>
                    {s.label} — {s.detail}
                  </p>
                </div>
              ))}
          </>
        )}
      </Panel>
    </Screen>
  );
}
