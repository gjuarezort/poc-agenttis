"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { amount as fmt, signOf } from "../../lib/close/format";

/**
 * A signed figure. Only the sign glyph carries colour — the digits stay ink.
 * This is deliberate and load-bearing in the design; do not colour the whole
 * amount.
 */
export function Amount({
  value,
  size = 17,
  sign = true,
  color,
  className = "",
}: {
  value: number;
  size?: number;
  sign?: boolean;
  color?: string;
  className?: string;
}) {
  return (
    <span className={`c-head ${className}`} style={{ fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap" }}>
      {sign && <span className={value < 0 ? "c-sign-neg" : "c-sign-pos"}>{signOf(value)}</span>}
      {fmt(value)}
    </span>
  );
}

export function Panel({
  children,
  accent = false,
  className = "",
  style,
}: {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`c-panel ${accent ? "c-panel-accent" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  right,
  padding = "15px 20px",
}: {
  title: React.ReactNode;
  right?: React.ReactNode;
  padding?: string;
}) {
  return (
    <div
      className="c-divider-b"
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding }}
    >
      <h3 className="c-head" style={{ fontSize: 20 }}>
        {title}
      </h3>
      {right}
    </div>
  );
}

export function ScreenTitle({
  title,
  subtitle,
  subtitleHint,
  right,
  maxWidth = 620,
}: {
  title: string;
  subtitle?: string;
  subtitleHint?: string;
  right?: React.ReactNode;
  maxWidth?: number;
}) {
  const heading = (
    <div style={{ maxWidth }}>
      <h2 className="c-head" style={{ fontSize: 31, marginBottom: 4 }}>
        {title}
      </h2>
      {subtitle && (
        <p className="c-secondary" style={{ fontSize: 14 }} title={subtitleHint}>
          {subtitle}
        </p>
      )}
    </div>
  );

  if (!right) return heading;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
      {heading}
      {right}
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="c-btn c-btn-ghost" style={{ alignSelf: "flex-start", gap: 7 }}>
      <ArrowLeft size={14} strokeWidth={1.5} />
      {label}
    </Link>
  );
}

/** A text/ghost toggle whose label flips — the flow's one disclosure pattern. */
export function Disclosure({
  open,
  onToggle,
  label,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <button type="button" className="c-btn c-btn-ghost" style={{ alignSelf: "flex-start" }} onClick={onToggle}>
        {label}
      </button>
      {open && children}
    </>
  );
}

export function Screen({
  children,
  gap = 32,
}: {
  children: React.ReactNode;
  gap?: number;
}) {
  return (
    <div className="c-screen" style={{ gap }}>
      {children}
    </div>
  );
}

export function LabelValueRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "7px 0",
        borderBottom: "1px solid var(--color-divider)",
      }}
    >
      <span className="c-secondary">{label}</span>
      <span style={{ fontWeight: strong ? 600 : 400 }}>{value}</span>
    </div>
  );
}
