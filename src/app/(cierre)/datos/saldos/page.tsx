"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useClose } from "../../../../context/CloseContext";
import { BackLink, Panel, Screen, ScreenTitle } from "../../../../components/cierre/ui";
import { ROUTES, balanceSums, undefinedBalanceLines } from "../../../../lib/close/derive";
import { amount, previousDay, shortDate } from "../../../../lib/close/format";

const VISIBLE = 9;

export default function SaldosPage() {
  const { state, c, setBalanceAccount } = useClose();
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const lines = state.balanceLines;
  const pending = undefinedBalanceLines(state);
  const sums = balanceSums(state);
  const shown = showAll ? lines : lines.slice(0, VISIBLE);

  return (
    <Screen gap={24}>
      <BackLink href={ROUTES.datos} label={c.saldos.back} />

      <ScreenTitle
        title={c.saldos.title(shortDate(previousDay(state.period.start)))}
        subtitle={c.saldos.subtitle(lines.length - pending.length, lines.length)}
        maxWidth={600}
        right={
          <span
            className="c-head"
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 17 }}
            title={sums.balanced ? c.saldos.balancedHint : c.saldos.unbalancedHint}
          >
            {sums.balanced && <CheckCircle2 size={16} strokeWidth={1.5} color="var(--color-accent)" />}
            {sums.balanced ? c.saldos.balanced(amount(sums.debe)) : c.saldos.unbalanced(amount(sums.diff))}
          </span>
        }
      />

      <div className="c-split c-split-15">
        <Panel>
          <div style={{ padding: "4px 12px" }}>
            <table className="c-table">
              <thead>
                <tr>
                  <th>{c.saldos.thText}</th>
                  <th>{c.saldos.thCuenta}</th>
                  <th className="c-num">{c.saldos.thDebe}</th>
                  <th className="c-num">{c.saldos.thHaber}</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((l) => {
                  const undefinedLine = !l.cuenta;
                  return (
                    <tr key={l.id} title={undefinedLine ? c.saldos.lineHint : undefined}>
                      <td
                        style={{
                          color: undefinedLine ? "var(--color-accent-900)" : undefined,
                          fontWeight: undefinedLine ? 600 : 400,
                        }}
                      >
                        {l.texto}
                      </td>
                      <td style={{ color: undefinedLine ? "var(--color-accent-800)" : "var(--color-secondary)" }}>
                        {l.cuenta ?? c.saldos.sinDefinir}
                      </td>
                      <td className="c-num">{l.debe ? amount(l.debe) : ""}</td>
                      <td className="c-num">{l.haber ? amount(l.haber) : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div
            className="c-divider-t"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "8px 20px" }}
          >
            <span className="c-muted" style={{ fontSize: 13 }}>
              {c.saldos.showing(shown.length, lines.length)}
            </span>
            {lines.length > VISIBLE && (
              <button type="button" className="c-btn c-btn-ghost" onClick={() => setShowAll(!showAll)}>
                {showAll ? c.saldos.showLess : c.saldos.showAll}
              </button>
            )}
          </div>
        </Panel>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          {pending.length > 0 && (
            <Panel style={{ padding: "18px 20px" }}>
              <h3 className="c-head" style={{ fontSize: 20, marginBottom: 16 }}>
                {c.saldos.decisionsTitle(pending.length)}
              </h3>
              {pending.map((l, i) => (
                <div
                  key={l.id}
                  className={i < pending.length - 1 ? "c-divider-b" : ""}
                  style={{
                    paddingBottom: i < pending.length - 1 ? 16 : 0,
                    marginBottom: i < pending.length - 1 ? 16 : 0,
                  }}
                >
                  <p
                    style={{ marginBottom: 8, fontWeight: 600 }}
                    title={c.saldos.decisionHint(
                      amount(l.debe || l.haber),
                      l.debe > 0 ? c.saldos.thDebe.toLowerCase() : c.saldos.thHaber.toLowerCase()
                    )}
                  >
                    {l.texto}
                  </p>
                  <select
                    className="c-input"
                    value={l.cuenta ?? ""}
                    onChange={(e) => setBalanceAccount(l.id, e.target.value)}
                  >
                    <option value="">{c.saldos.choose}</option>
                    {l.candidates.map((cand) => (
                      <option key={cand} value={cand}>
                        {cand}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </Panel>
          )}

          <button
            type="button"
            className="c-btn c-btn-primary"
            style={{ padding: "11px 18px" }}
            disabled={pending.length > 0}
            title={pending.length > 0 ? c.saldos.decisionsTitle(pending.length) : undefined}
            onClick={() => router.push(ROUTES.resumen)}
          >
            {c.saldos.confirm}
          </button>
        </div>
      </div>
    </Screen>
  );
}
