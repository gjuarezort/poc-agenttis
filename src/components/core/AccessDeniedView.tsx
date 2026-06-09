import React, { useState, useEffect } from "react";
import { useDashboard, TabType } from "../../context/DashboardContext";
import { ShieldAlert, Key, CheckCircle } from "lucide-react";

interface AccessDeniedViewProps {
  requestedTab: TabType;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({ requestedTab }) => {
  const { language, currentUser, logSecurityAction, tTab } = useDashboard();
  const [requestSent, setRequestSent] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    logSecurityAction(
      "Access Blocked",
      `Module: ${requestedTab}`,
      "blocked",
      `Blocked unauthorized access request to: ${tTab(requestedTab)}`
    );
  }, [requestedTab]);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRequestSent(true);

      // Log security event
      logSecurityAction(
        "Access Requested",
        `Module: ${requestedTab}`,
        "warning",
        `User requested clearance for ${tTab(requestedTab)} tab. Reason: "${reason.trim()}"`
      );
    }, 1200);
  };

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: "60vh", width: "100%", padding: "2rem" }}>
      <div className="glass-panel" style={{
        maxWidth: "520px", width: "100%", padding: "2.5rem 2rem", textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem"
      }}>
        
        {/* Shield Icon Container */}
        <div className="flex-center animate-pulse" style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: "rgba(239, 68, 68, 0.1)", border: "1.5px solid var(--color-danger)",
          color: "var(--color-danger)"
        }}>
          <ShieldAlert size={32} />
        </div>

        {/* Header Text */}
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {language === "es" ? "Acceso Restringido" : "Access Restricted"}
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            {language === "es"
              ? `Tu rol actual (${currentUser.role}) no dispone de las credenciales de seguridad necesarias para abrir este módulo.`
              : `Your current clearance level (${currentUser.role}) is unauthorized to view the requested resource.`}
          </p>
        </div>

        {/* Restricted Info Card */}
        <div style={{
          padding: "0.75rem 1rem", background: "var(--bg-surface-solid)",
          border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)",
          fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)",
          width: "100%"
        }}>
          STATUS: 403 FORBIDDEN<br />
          RESOURCE: tab://{requestedTab} ({tTab(requestedTab)})<br />
          IDENTITY: @{currentUser.username}
        </div>

        <div style={{ width: "100%", borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem", marginTop: "0.5rem" }}>
          {!requestSent ? (
            <form onSubmit={handleRequestSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textAlign: "left", margin: 0, fontWeight: 600 }}>
                {language === "es" ? "Solicitar Clearance de Acceso:" : "Request Access Elevation:"}
              </p>
              
              <input
                type="text"
                required
                placeholder={language === "es" ? "Ej. Necesito auditar los servidores SQLite..." : "E.g. Need to configure Brave Search tool..."}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={loading}
              />

              <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                {loading ? (
                  <span className="spinner" style={{ width: "14px", height: "14px" }} />
                ) : (
                  <>
                    <Key size={14} style={{ marginRight: "0.2rem" }} />
                    {language === "es" ? "Enviar Solicitud a Admin" : "Submit Elevation Request"}
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: "var(--color-success)" }}>
              <CheckCircle size={24} />
              <strong style={{ fontSize: "0.9rem" }}>
                {language === "es" ? "Solicitud Registrada" : "Access Request Filed"}
              </strong>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 }}>
                {language === "es"
                  ? "Se ha notificado al Administrador (Gabriel Juarez) y registrado en la bitácora de seguridad."
                  : "Security clearance request dispatched to Administrator (Gabriel Juarez). Trace logged."}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
