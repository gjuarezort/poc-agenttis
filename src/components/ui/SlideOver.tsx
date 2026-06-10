import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Heading } from "./Heading";

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const SlideOver: React.FC<SlideOverProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "520px",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen) return null;

  const content = (
    <>
      {/* Drawer Backdrop Overlay */}
      <div className="modal-overlay animate-fade-in" onClick={onClose} />
      
      {/* Drawer Panel Container */}
      <div 
        className="slide-over-panel" 
        style={{ maxWidth, display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div 
          style={{ 
            padding: "1.5rem", 
            borderBottom: "1px solid var(--border-color)", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            background: "var(--bg-surface-solid)" 
          }} 
          className="shrink-0"
        >
          <div>
            <Heading level="h3" className="m-0 text-lg font-bold text-white leading-tight">
              {title}
            </Heading>
            {description && (
              <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                {description}
              </span>
            )}
          </div>
          <button 
            onClick={onClose} 
            style={{
              padding: "0.375rem",
              borderRadius: "9999px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border-color)",
              background: "var(--bg-surface-hover)"
            }}
            className="text-[var(--text-muted)] hover:text-white"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div 
            style={{ 
              padding: "1.25rem 1.5rem", 
              borderTop: "1px solid var(--border-color)", 
              background: "var(--bg-surface-solid)", 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: "0.75rem" 
            }} 
            className="shrink-0"
          >
            {footer}
          </div>
        )}
      </div>
    </>
  );

  return mounted ? createPortal(content, document.body) : null;
};
