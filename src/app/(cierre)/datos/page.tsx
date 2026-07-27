"use client";

import React from "react";
import Link from "next/link";
import { useClose } from "../../../context/CloseContext";
import { Dropzone, UploadButton } from "../../../components/cierre/Dropzone";
import { Panel, Screen, ScreenTitle } from "../../../components/cierre/ui";
import { ROUTES, balanceSums, effectiveRowCount, undefinedBalanceLines } from "../../../lib/close/derive";
import { openExceptions } from "../../../lib/close/validate";
import { amount } from "../../../lib/close/format";
import type { PeriodFile } from "../../../lib/close/types";

interface RowView {
  key: string;
  name: string;
  hint: string;
  status: string;
  statusAccent: boolean;
  dim: boolean;
  action: React.ReactNode;
}

export default function DatosPage() {
  const { state, c, language, removeFile } = useClose();

  const rowFor = (f: PeriodFile): RowView => {
    const rows = effectiveRowCount(f);
    const kindLabel = c.datos.kind[f.kind];

    if (f.awaitingServerParse) {
      return {
        key: f.id,
        name: f.name,
        hint: c.datos.servidorHint,
        status: c.datos.statusServidor,
        statusAccent: true,
        dim: false,
        action: (
          <button type="button" className="c-btn c-btn-ghost" style={{ justifySelf: "end" }} onClick={() => removeFile(f.id)}>
            {c.datos.quitar}
          </button>
        ),
      };
    }

    if (f.kind === "saldos") {
      const pend = undefinedBalanceLines(state).length;
      const sums = balanceSums(state);
      return {
        key: f.id,
        name: f.name,
        hint: c.datos.saldosHint(state.balanceLines.length, amount(sums.debe)),
        status: pend > 0 ? c.datos.statusCuentas(pend) : c.datos.statusNormalizado,
        statusAccent: pend > 0,
        dim: false,
        action: (
          <Link
            href={ROUTES.saldos}
            className={`c-btn ${pend > 0 ? "c-btn-secondary" : "c-btn-ghost"}`}
            style={{ justifySelf: "end", whiteSpace: "nowrap", textDecoration: "none" }}
          >
            {pend > 0 ? c.datos.definir : c.datos.verCriterio}
          </Link>
        ),
      };
    }

    if (f.kind === "extracto") {
      return {
        key: f.id,
        name: f.name,
        hint: c.datos.extractoHint(state.client.bank, state.bankRows.length),
        status: c.datos.statusNormalizado,
        statusAccent: false,
        dim: false,
        action: (
          <Link
            href={ROUTES.concil}
            className="c-btn c-btn-ghost"
            style={{ justifySelf: "end", whiteSpace: "nowrap", textDecoration: "none" }}
          >
            {c.shell.nav.concil}
          </Link>
        ),
      };
    }

    if (f.kind === "desconocido") {
      return {
        key: f.id,
        name: f.name,
        hint: c.datos.sinClasificarHint,
        status: c.datos.statusSinClasificar,
        statusAccent: true,
        dim: false,
        action: (
          <button type="button" className="c-btn c-btn-ghost" style={{ justifySelf: "end" }} onClick={() => removeFile(f.id)}>
            {c.datos.quitar}
          </button>
        ),
      };
    }

    const exceptions = openExceptions(f, state.period, state.resolvedExceptions, language);
    return {
      key: f.id,
      name: f.name,
      hint: c.datos.fileHint(kindLabel, rows, f.loadedAt),
      status: exceptions.length > 0 ? c.datos.statusAvisos(exceptions.length) : c.datos.statusNormalizado,
      statusAccent: exceptions.length > 0,
      dim: false,
      action: (
        <Link
          href={ROUTES.criterio(f.id)}
          className={`c-btn ${exceptions.length > 0 ? "c-btn-secondary" : "c-btn-ghost"}`}
          style={{ justifySelf: "end", whiteSpace: "nowrap", textDecoration: "none" }}
        >
          {exceptions.length > 0 ? c.datos.revisar : c.datos.verCriterio}
        </Link>
      ),
    };
  };

  const rows: RowView[] = [
    ...state.files.map(rowFor),
    ...state.missing.map((m) => ({
      key: m.id,
      name: m.name,
      hint: m.hint,
      status: c.datos.statusSinCargar,
      statusAccent: false,
      dim: true,
      action: <UploadButton label={c.datos.subir} />,
    })),
  ];

  return (
    <Screen gap={28}>
      <ScreenTitle title={c.datos.title} subtitle={c.datos.subtitle} maxWidth={600} />

      <Dropzone />

      <Panel>
        {rows.map((r, i) => (
          <div
            key={r.key}
            title={r.hint}
            className={i < rows.length - 1 ? "c-divider-b" : ""}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 150px",
              gap: "var(--space-6)",
              alignItems: "center",
              padding: "15px 22px",
              color: r.dim ? "color-mix(in srgb, var(--color-text) 60%, transparent)" : undefined,
            }}
          >
            <p style={{ fontWeight: 600 }}>{r.name}</p>
            <span
              style={{
                fontSize: 13,
                whiteSpace: "nowrap",
                color: r.dim ? "inherit" : r.statusAccent ? "var(--color-accent-800)" : "var(--color-muted)",
              }}
            >
              {r.status}
            </span>
            {r.action}
          </div>
        ))}
      </Panel>
    </Screen>
  );
}
