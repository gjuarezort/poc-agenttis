"use client";

import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useClose } from "../../context/CloseContext";

/**
 * Drop or click. The design shows only the drag affordance; the hidden input is
 * there because "drag a file" is not a usable instruction on its own, and it
 * costs nothing visually.
 */
export function Dropzone() {
  const { c, uploadFiles, uploading } = useClose();
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`c-dropzone ${over ? "is-over" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (e.dataTransfer.files?.length) void uploadFiles(e.dataTransfer.files);
        }}
      >
        <Upload size={22} strokeWidth={1.5} color="var(--color-accent)" />
        <p className="c-head" style={{ fontSize: 19 }}>
          {uploading ? c.datos.dropBusy : c.datos.dropTitle}
        </p>
        <p className="c-secondary" style={{ fontSize: 13 }}>
          {c.datos.dropHint}
        </p>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".csv,.txt,.tsv,.xlsx,.xls"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.length) void uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );
}

/** The "Subir" action on a row the period is still waiting for. */
export function UploadButton({ label, primary = true }: { label: string; primary?: boolean }) {
  const { uploadFiles } = useClose();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        className={`c-btn ${primary ? "c-btn-primary" : "c-btn-secondary"}`}
        style={{ justifySelf: "end", whiteSpace: "nowrap" }}
        onClick={() => inputRef.current?.click()}
      >
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.txt,.tsv,.xlsx,.xls"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.length) void uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );
}
