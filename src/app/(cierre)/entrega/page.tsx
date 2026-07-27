"use client";

import React from "react";
import { useClose } from "../../../context/CloseContext";
import { Panel, PanelHeader, Screen, ScreenTitle } from "../../../components/cierre/ui";
import { deliverables } from "../../../lib/close/derive";
import { sheetCount } from "../../../lib/close/exportPackage";
import type { ExportFormat, PackStructure } from "../../../lib/close/types";

const FORMATS: ExportFormat[] = ["dgi", "memory", "zureo", "plano"];

export default function EntregaPage() {
  const { state, c, summary, togglePick, setFmt, setPack, generatePackage } = useClose();

  const items = deliverables(state, c);
  const chosen = items.filter((d) => d.on).length;

  return (
    <Screen gap={26}>
      <ScreenTitle title={c.entrega.title} subtitle={c.entrega.subtitle} maxWidth={620} />

      <div className="c-split c-split-135">
        <Panel>
          <PanelHeader
            title={c.entrega.queIncluye}
            right={
              <span className="c-muted" style={{ fontSize: 13 }}>
                {c.entrega.selected(chosen, items.length)}
              </span>
            }
          />
          {items.map((d, i) => (
            <label
              key={d.key}
              title={d.hint}
              className={i < items.length - 1 ? "c-divider-b" : ""}
              style={{
                display: "grid",
                gridTemplateColumns: "18px 1fr auto",
                gap: 14,
                alignItems: "center",
                padding: "14px 20px",
                cursor: "pointer",
              }}
            >
              <input type="checkbox" className="c-check" checked={d.on} onChange={() => togglePick(d.key)} />
              <span style={{ fontWeight: 600 }}>{d.label}</span>
              <span className="c-muted" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
                {d.meta}
              </span>
            </label>
          ))}
        </Panel>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          <Panel style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="c-field">
              <label htmlFor="fmt">{c.entrega.formatLabel}</label>
              <select
                id="fmt"
                className="c-input"
                value={state.fmt}
                onChange={(e) => setFmt(e.target.value as ExportFormat)}
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {c.entrega.formats[f]}
                  </option>
                ))}
              </select>
            </div>
            <p className="c-secondary" style={{ fontSize: 13 }}>
              {c.entrega.formatHints[state.fmt]}
            </p>
            <div className="c-field">
              <label>{c.entrega.structureLabel}</label>
              <div className="c-seg" style={{ width: "100%" }}>
                {(["one", "many"] as PackStructure[]).map((p) => (
                  <label key={p} className="c-seg-opt" style={{ flex: 1, justifyContent: "center" }}>
                    <input type="radio" name="pack" checked={state.pack === p} onChange={() => setPack(p)} />
                    {p === "one" ? c.entrega.one : c.entrega.many}
                  </label>
                ))}
              </div>
            </div>
          </Panel>

          {summary.blocked && (
            <p className="c-accent-text" style={{ fontSize: 13 }}>
              {c.entrega.warn(summary.blockers.length)}
            </p>
          )}

          <button
            type="button"
            className="c-btn c-btn-primary"
            style={{ padding: "11px 18px" }}
            disabled={chosen === 0}
            title={chosen === 0 ? c.entrega.generateEmpty : undefined}
            onClick={generatePackage}
          >
            {c.entrega.generate}
          </button>

          {state.packageGeneratedAt && (
            <p className="c-accent-text" style={{ fontSize: 13 }}>
              {c.entrega.generated(state.pack === "many" ? chosen : 1)}
            </p>
          )}

          {state.lastPackage && (
            <div
              className="c-muted"
              style={{ fontSize: 13 }}
              title={c.entrega.lastDeliveryHint(c.entrega.formats[state.fmt], sheetCount(state))}
            >
              {c.entrega.lastDelivery(state.lastPackage)}
            </div>
          )}
        </div>
      </div>
    </Screen>
  );
}
