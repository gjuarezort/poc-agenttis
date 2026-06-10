import React, { useState, useEffect } from "react";
import { useDashboard, TabType } from "../../context/DashboardContext";
import { ShieldAlert, Key, CheckCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Heading } from "../ui/Heading";
import { Input } from "../ui/Input";

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
    <div className="flex justify-center items-center animate-fade-in min-h-[60vh] w-full p-8">
      <Card className="max-w-[520px] w-full p-10 text-center flex flex-col items-center gap-5">
        
        {/* Shield Icon Container */}
        <div className="flex justify-center items-center animate-pulse w-16 h-16 rounded-full bg-red-500/10 border-1.5 border-[var(--color-danger)] text-[var(--color-danger)]">
          <ShieldAlert size={32} />
        </div>

        {/* Header Text */}
        <div>
          <Heading level="h2" className="text-xl font-extrabold text-[var(--text-primary)] mb-0">
            {language === "es" ? "Acceso Restringido" : "Access Restricted"}
          </Heading>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-2">
            {language === "es"
              ? `Tu rol actual (${currentUser.role}) no dispone de las credenciales de seguridad necesarias para abrir este módulo.`
              : `Your current clearance level (${currentUser.role}) is unauthorized to view the requested resource.`}
          </p>
        </div>

        {/* Restricted Info Card */}
        <div className="p-3 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-md text-xs font-mono text-[var(--text-muted)] w-full">
          STATUS: 403 FORBIDDEN<br />
          RESOURCE: tab://{requestedTab} ({tTab(requestedTab)})<br />
          IDENTITY: @{currentUser.username}
        </div>

        <div className="w-full border-t border-[var(--border-color)] pt-5 mt-2">
          {!requestSent ? (
            <form onSubmit={handleRequestSubmit} className="flex flex-col gap-3 w-full">
              <p className="text-xs text-[var(--text-secondary)] text-left m-0 font-semibold">
                {language === "es" ? "Solicitar Clearance de Acceso:" : "Request Access Elevation:"}
              </p>
              
              <Input
                required
                placeholder={language === "es" ? "Ej. Necesito auditar los servidores SQLite..." : "E.g. Need to configure Brave Search tool..."}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={loading}
              />

              <Button type="submit" variant="primary" className="w-full" loading={loading}>
                {!loading && (
                  <>
                    <Key size={14} className="mr-1" />
                    {language === "es" ? "Enviar Solicitud a Admin" : "Submit Elevation Request"}
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="animate-fade-in flex flex-col items-center gap-2 text-[var(--color-success)]">
              <CheckCircle size={24} />
              <strong className="text-sm">
                {language === "es" ? "Solicitud Registrada" : "Access Request Filed"}
              </strong>
              <p className="text-xs text-[var(--text-secondary)] m-0">
                {language === "es"
                  ? "Se ha notificado al Administrador (Gabriel Juarez) y registrado en la bitácora de seguridad."
                  : "Security clearance request dispatched to Administrator (Gabriel Juarez). Trace logged."}
              </p>
            </div>
          )}
        </div>

      </Card>
    </div>
  );
};
