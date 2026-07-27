"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useClose } from "../../context/CloseContext";
import { BackLink, Disclosure, LabelValueRow, Panel, Screen, ScreenTitle } from "./ui";
import { ROUTES, effectiveRowCount } from "../../lib/close/derive";
import { openExceptions } from "../../lib/close/validate";
import { TARGET_FIELDS } from "../../lib/close/detect";
import { amount, shortDate } from "../../lib/close/format";
import type { TargetField } from "../../lib/close/types";

export function CriterioScreen({ fileId }: { fileId: string }) {
  const { state, c, language, setMapField, setRemember, confirmCriterio, applyException, skipException } = useClose();
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [resolving, setResolving] = useState(false);

  const file = state.files.find((f) => f.id === fileId);
  if (!file) {
    return (
      <Screen gap={24}>
        <BackLink href={ROUTES.datos} label={c.criterio.back} />
        <ScreenTitle title={c.datos.statusSinClasificar} />
      </Screen>
    );
  }

  const exceptions = openExceptions(file, state.period, state.resolvedExceptions, language);
  const rows = effectiveRowCount(file);
  const recognised = file.maps.filter((m) => m.field !== "(no importar)").length;
  const unused = file.maps.filter((m) => m.field === "(no importar)").map((m) => m.src);
  const preview = file.docs.find((d) => !d.excluded);
  const current = exceptions[0];

  return (
    <Screen gap={24}>
      <BackLink href={ROUTES.datos} label={c.criterio.back} />

      <ScreenTitle
        title={file.name}
        subtitle={
          exceptions.length > 0
            ? c.criterio.subtitle(rows, rows - exceptions.length, exceptions.length)
            : c.criterio.subtitleClean(rows)
        }
        subtitleHint={c.criterio.columnsHint(recognised, unused)}
        maxWidth={640}
      />

      <div className="c-split c-split-15">
        <Panel>
          <h3 className="c-head c-divider-b" style={{ fontSize: 20, padding: "15px 20px" }}>
            {c.criterio.mapTitle}
          </h3>
          <div style={{ padding: "2px 12px" }}>
            <table className="c-table">
              <tbody>
                {file.maps.map((m, i) => (
                  <tr key={m.src} title={c.criterio.mapHint(m.sample || "—", m.conf)}>
                    <td style={{ width: "40%" }}>{m.src}</td>
                    <td>
                      <select
                        className={`c-input ${m.conf === "Revisar" ? "c-input-flag" : ""}`}
                        style={{ minHeight: 32, background: "transparent" }}
                        value={m.field}
                        onChange={(e) => setMapField(file.id, i, e.target.value as TargetField)}
                      >
                        {TARGET_FIELDS.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {file.maps.length === 0 && (
                  <tr>
                    <td className="c-muted">{c.criterio.exceptionsClear}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          {exceptions.length > 0 && (
            <Panel accent style={{ padding: "18px 20px" }}>
              <h3 className="c-head" style={{ fontSize: 20, marginBottom: 12, color: "var(--color-accent-900)" }}>
                {c.criterio.exceptionsTitle(exceptions.length)}
              </h3>

              {!resolving ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {exceptions.map((e) => (
                      <div
                        key={`${e.docId}-${e.code}`}
                        title={e.detail}
                        style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 8 }}
                      >
                        <span style={{ fontSize: 12, color: "var(--color-accent-800)" }}>f.{e.row}</span>
                        <p style={{ fontWeight: 600 }}>{e.label}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="c-btn c-btn-secondary c-btn-block"
                    style={{ marginTop: 14 }}
                    onClick={() => setResolving(true)}
                  >
                    {c.criterio.resolveAll}
                  </button>
                </>
              ) : (
                current && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <span className="c-overline" style={{ color: "var(--color-accent-800)" }}>
                      {c.criterio.resolveProgress(1, exceptions.length)}
                    </span>
                    <div style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 8 }}>
                      <span style={{ fontSize: 12, color: "var(--color-accent-800)" }}>f.{current.row}</span>
                      <div>
                        <p style={{ fontWeight: 600 }}>{current.label}</p>
                        <p className="c-secondary" style={{ fontSize: 13 }}>
                          {current.detail}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="c-btn c-btn-primary"
                        onClick={() => applyException(file.id, current)}
                      >
                        {c.criterio.apply(current.fix)}
                      </button>
                      <button
                        type="button"
                        className="c-btn c-btn-secondary"
                        onClick={() => skipException(file.id, current)}
                      >
                        {c.criterio.skip}
                      </button>
                      <button type="button" className="c-btn c-btn-ghost" onClick={() => setResolving(false)}>
                        {c.criterio.resolveStop}
                      </button>
                    </div>
                  </div>
                )
              )}
            </Panel>
          )}

          {preview && (
            <Disclosure
              open={showPreview}
              onToggle={() => setShowPreview(!showPreview)}
              label={c.criterio.previewToggle(showPreview)}
            >
              <Panel style={{ padding: "18px 20px" }}>
                <LabelValueRow label={c.criterio.preview.fecha} value={shortDate(preview.fecha)} />
                <LabelValueRow label={c.criterio.preview.tipo} value={preview.tipoCfe} />
                <LabelValueRow label={c.criterio.preview.rut} value={preview.rut} />
                <LabelValueRow label={c.criterio.preview.g22} value={amount(preview.gravado22)} />
                <LabelValueRow label={c.criterio.preview.iva} value={amount(preview.iva)} />
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "7px 0" }}>
                  <span className="c-secondary">{c.criterio.preview.total}</span>
                  <span style={{ fontWeight: 600 }}>{amount(preview.total)}</span>
                </div>
              </Panel>
            </Disclosure>
          )}
        </div>
      </div>

      <div
        className="c-divider-t"
        style={{
          position: "sticky",
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          padding: "14px 0",
          background: "var(--color-bg)",
          flexWrap: "wrap",
        }}
      >
        <label
          style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, cursor: "pointer", color: "color-mix(in srgb, var(--color-text) 70%, transparent)" }}
        >
          <input
            type="checkbox"
            className="c-check"
            checked={file.rememberCriterio}
            onChange={(e) => setRemember(file.id, e.target.checked)}
          />
          {c.criterio.remember(file.criterioOwner)}
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="c-btn c-btn-secondary" onClick={() => router.push(ROUTES.datos)}>
            {c.criterio.cancel}
          </button>
          <button
            type="button"
            className="c-btn c-btn-primary"
            style={{ padding: "9px 18px", whiteSpace: "nowrap" }}
            onClick={() => {
              confirmCriterio(file.id);
              router.push(ROUTES.resumen);
            }}
          >
            {c.criterio.confirm(rows)}
          </button>
        </div>
      </div>
    </Screen>
  );
}
