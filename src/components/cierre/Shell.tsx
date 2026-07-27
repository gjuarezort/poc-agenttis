"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Sparkles } from "lucide-react";
import { useClose } from "../../context/CloseContext";
import { ROUTES, totalAvisos, undefinedBalanceLines, pendingBankRows, overdueTaxes } from "../../lib/close/derive";
import { PERIOD_OPTIONS } from "../../lib/close/seed";

type PipeKey = "resumen" | "datos" | "criterio" | "concil" | "impuestos" | "entrega";

function activeStep(pathname: string): PipeKey {
  if (pathname.startsWith("/datos/criterio") || pathname.startsWith("/datos/saldos")) return "criterio";
  if (pathname.startsWith("/datos")) return "datos";
  if (pathname.startsWith("/conciliacion")) return "concil";
  if (pathname.startsWith("/impuestos")) return "impuestos";
  if (pathname.startsWith("/entrega")) return "entrega";
  return "resumen";
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { state, c, language, setLanguage, summary, closePeriod, reopenPeriod } = useClose();
  const pathname = usePathname() ?? "/";
  const step = activeStep(pathname);

  const avisos = totalAvisos(state, language);
  const saldosPend = undefinedBalanceLines(state).length;
  const pend = pendingBankRows(state).length;
  const overdue = overdueTaxes(state).length;

  // Every tooltip in the bar reads from the same derivation as the queue — the
  // counts themselves are deliberately not printed here.
  const pipeline: Array<{ key: PipeKey; n?: number; href: string; label: string; hint: string }> = [
    { key: "resumen", href: ROUTES.resumen, label: c.shell.nav.resumen, hint: c.resumen.queueTitle(summary.blockers.length) },
    { key: "datos", n: 1, href: ROUTES.datos, label: c.shell.nav.datos, hint: c.shell.navHint.datos(state.files.length, state.files.length + state.missing.length) },
    { key: "criterio", n: 2, href: ROUTES.datos, label: c.shell.nav.criterio, hint: c.shell.navHint.criterio(avisos, saldosPend) },
    { key: "concil", n: 3, href: ROUTES.concil, label: c.shell.nav.concil, hint: c.shell.navHint.concil(pend) },
    { key: "impuestos", n: 4, href: ROUTES.impuestos, label: c.shell.nav.impuestos, hint: c.shell.navHint.impuestos(overdue) },
    { key: "entrega", n: 5, href: ROUTES.entrega, label: c.shell.nav.entrega, hint: c.shell.navHint.entrega },
  ];

  // "Criterio" is a child of step 2: it lands on whichever file still needs one.
  const criterioHref = (() => {
    const target = summary.steps.find((s) => s.id === "normalizar");
    if (saldosPend > 0 && avisos === 0) return ROUTES.saldos;
    return target?.to ?? ROUTES.datos;
  })();

  return (
    <div className="cierre-root">
      <header style={{ position: "sticky", top: 0, zIndex: 60, background: "var(--color-bg)" }}>
        <div
          className="c-divider-b"
          style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", height: 56, padding: "0 32px" }}
        >
          <Link
            href={ROUTES.resumen}
            className="c-head"
            style={{
              fontSize: 19,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              color: "var(--color-text)",
              textDecoration: "none",
            }}
          >
            {c.shell.wordmark}
          </Link>
          <span style={{ width: 1, height: 20, background: "var(--color-divider)" }} />
          <span
            style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}
            title={c.shell.clientHint(state.client.rut, state.client.practice, state.client.criterioVersion)}
          >
            {state.client.name}
          </span>

          <div style={{ flex: 1 }} />

          <select
            className="c-input"
            style={{ width: "auto", minHeight: 32, background: "transparent" }}
            value={state.period.id}
            onChange={() => undefined}
            title={c.shell.periodHint}
          >
            {PERIOD_OPTIONS.map((p) => (
              <option key={p.id} value={p.id} disabled={p.id !== state.period.id}>
                {p.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="c-btn c-btn-ghost"
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            title={c.shell.languageHint}
            style={{
              color: "color-mix(in srgb, var(--color-text) 42%, transparent)",
              flex: "none",
              fontSize: 12,
              letterSpacing: "0.1em",
            }}
          >
            {language === "es" ? "EN" : "ES"}
          </button>

          <Link
            href="/plataforma"
            className="c-btn c-btn-ghost"
            style={{
              color: "color-mix(in srgb, var(--color-text) 42%, transparent)",
              gap: 7,
              whiteSpace: "nowrap",
              flex: "none",
            }}
            title={c.shell.agentLayerHint}
          >
            <Sparkles size={15} strokeWidth={1.5} />
            {c.shell.agentLayer}
          </Link>

          <span
            className="c-head"
            style={{
              width: 30,
              height: 30,
              flex: "none",
              display: "grid",
              placeItems: "center",
              border: "1px solid var(--color-divider)",
              fontSize: 12,
            }}
            title={c.shell.userHint("Valentina Rodríguez", language === "es" ? "Contadora, Estudio Bravo" : "Accountant, Estudio Bravo")}
          >
            VR
          </span>
        </div>

        <div className="c-divider-b" style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch" }}>
          {/* min-width:0 is what keeps this track from clipping at narrow widths */}
          <div style={{ display: "flex", alignItems: "stretch", flex: "1 1 560px", minWidth: 0, overflowX: "auto" }}>
            {pipeline.map((p) => (
              <Link
                key={p.key}
                href={p.key === "criterio" ? criterioHref : p.href}
                title={p.hint}
                className={`c-pipe-btn ${step === p.key ? "is-active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                {p.n ? <span className="c-pipe-num">{p.n}</span> : <LayoutGrid size={15} strokeWidth={1.5} />}
                <span>{p.label}</span>
              </Link>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "var(--space-6)",
              flex: "1 0 auto",
              marginLeft: "auto",
              padding: "9px 32px 9px 24px",
            }}
          >
            <span className="c-secondary" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
              {state.periodClosed
                ? c.shell.closed(state.period.label)
                : summary.blocked
                  ? c.shell.blockText(summary.blockers.length)
                  : c.shell.allResolved}
            </span>
            {state.periodClosed ? (
              <button type="button" className="c-btn c-btn-secondary" style={{ padding: "9px 18px", whiteSpace: "nowrap" }} onClick={reopenPeriod}>
                {c.shell.reopen}
              </button>
            ) : (
              <button
                type="button"
                className="c-btn c-btn-primary"
                style={{ padding: "9px 18px", whiteSpace: "nowrap", flex: "none" }}
                disabled={summary.blocked}
                onClick={closePeriod}
              >
                {c.shell.closePeriod(state.period.label)}
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{ width: "100%", maxWidth: 1380, padding: "36px 32px 72px", flex: 1 }}>{children}</main>

      <footer
        className="c-divider-t"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 20,
          padding: "16px 32px",
          fontSize: 12,
          color: "color-mix(in srgb, var(--color-text) 50%, transparent)",
        }}
      >
        <span>{c.shell.footerLeft}</span>
        <span>{c.shell.footerRight(state.client.criterioVersion, state.client.practice)}</span>
      </footer>
    </div>
  );
}
