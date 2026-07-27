"use client";

import React, { useState } from "react";
import { useClose } from "../../../context/CloseContext";
import { Disclosure, Panel, Screen, ScreenTitle } from "../../../components/cierre/ui";
import { books, taxAmount, taxHint } from "../../../lib/close/derive";
import { amount, dayMonth } from "../../../lib/close/format";

export default function ImpuestosPage() {
  const { state, c, regularizeTax } = useClose();
  const [showBooks, setShowBooks] = useState(false);

  const bk = books(state);
  const rows = state.taxes;

  return (
    <Screen gap={24}>
      <ScreenTitle title={c.impuestos.title} subtitle={c.impuestos.subtitle} maxWidth={600} />

      <Panel>
        {rows.map((t, i) => {
          const overdue = t.status === "vencido";
          const filed = t.status === "presentado";
          const last = i === rows.length - 1;
          return (
            <div
              key={t.id}
              title={taxHint(t, state, c)}
              className={!overdue && !last ? "c-divider-b" : ""}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 132px",
                gap: 24,
                alignItems: "center",
                padding: overdue ? "18px 22px" : "17px 22px",
                // The one reversed field in the whole flow. Kept to a single row.
                background: overdue ? "var(--color-accent-900)" : undefined,
                color: overdue ? "var(--color-bg)" : filed ? "color-mix(in srgb, var(--color-text) 55%, transparent)" : undefined,
              }}
            >
              <p className="c-head" style={{ fontSize: 19 }}>
                {t.name}
              </p>
              <span className="c-head" style={{ fontSize: 21, whiteSpace: "nowrap" }}>
                {amount(taxAmount(t, state))}
              </span>
              {overdue ? (
                <button
                  type="button"
                  className="c-btn c-btn-invert"
                  style={{ whiteSpace: "nowrap", justifySelf: "end" }}
                  onClick={() => regularizeTax(t.id)}
                >
                  {c.impuestos.regularizar}
                </button>
              ) : (
                <span
                  style={{
                    fontSize: 13,
                    whiteSpace: "nowrap",
                    textAlign: "right",
                    color: filed ? "inherit" : "var(--color-secondary)",
                  }}
                >
                  {filed ? c.impuestos.presentado : c.impuestos.vence(dayMonth(t.due))}
                </span>
              )}
            </div>
          );
        })}
      </Panel>

      <Disclosure open={showBooks} onToggle={() => setShowBooks(!showBooks)} label={c.impuestos.booksToggle(showBooks)}>
        <Panel style={{ padding: "4px 14px 2px" }}>
          <table className="c-table">
            <thead>
              <tr>
                <th>{c.impuestos.thLibro}</th>
                <th className="c-num">{c.impuestos.thG22}</th>
                <th className="c-num">{c.impuestos.thG10}</th>
                <th className="c-num">{c.impuestos.thExento}</th>
                <th className="c-num">{c.impuestos.thIva}</th>
                <th className="c-num">{c.impuestos.thTotal}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "11px 8px" }}>{c.impuestos.ventas}</td>
                <td className="c-num">{amount(bk.ventas.gravado22)}</td>
                <td className="c-num">{amount(bk.ventas.gravado10)}</td>
                <td className="c-num">{amount(bk.ventas.exento)}</td>
                <td className="c-num">{amount(bk.ventas.iva)}</td>
                <td className="c-num" style={{ fontWeight: 600 }}>
                  {amount(bk.ventas.total)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "11px 8px" }}>{c.impuestos.compras}</td>
                <td className="c-num">{amount(bk.compras.gravado22)}</td>
                <td className="c-num">{amount(bk.compras.gravado10)}</td>
                <td className="c-num">{amount(bk.compras.exento)}</td>
                <td className="c-num">{amount(bk.compras.iva)}</td>
                <td className="c-num" style={{ fontWeight: 600 }}>
                  {amount(bk.compras.total)}
                </td>
              </tr>
              <tr>
                <td className="c-head" style={{ padding: "13px 8px", fontSize: 16 }}>
                  {bk.ivaAPagar >= 0 ? c.impuestos.ivaAPagar : c.impuestos.ivaAFavor}
                </td>
                <td />
                <td />
                <td />
                <td />
                <td className="c-head c-num" style={{ fontSize: 16 }}>
                  {amount(bk.ivaAPagar)}
                </td>
              </tr>
            </tbody>
          </table>
        </Panel>
      </Disclosure>
    </Screen>
  );
}
