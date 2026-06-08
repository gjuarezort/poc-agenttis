import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import { Info, Settings } from "lucide-react";

interface IntegrationsTabProps {
  language: "en" | "es";
  t: (key: string) => string;
}



export const IntegrationsTab: React.FC = () => {
  const { language,
  t, } = useDashboard();
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      
      <div className="glass-panel" style={{ padding: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Settings size={20} style={{ color: "var(--color-primary)" }} />
          <h2 style={{ margin: 0 }}>{t("catalogTitle")}</h2>
          <span className="info-tooltip">
            <Info size={15} />
            <span className="tooltip-text">{t("catalogSubtitle")}</span>
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        
        {/* Stripe checkout card */}
        <div className="glass-panel glass-panel-interactive" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "260px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.3rem" }}>💳</span>
              <span className="badge badge-success">Ready</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "0.4rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{t("stripeTitle")}</h3>
              <span className="info-tooltip">
                <Info size={14} />
                <span className="tooltip-text">{t("stripeDesc")}</span>
              </span>
            </div>
            
            <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                <span>{t("stripeReadTrans")}</span>
                <span style={{ color: "var(--color-success)", fontWeight: 700 }}>ON</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                <span>{t("stripeWriteRefund")}</span>
                <span style={{ color: "var(--text-muted)" }}>DISABLED</span>
              </div>
            </div>
          </div>

          <button className="btn btn-secondary" style={{ width: "100%", marginTop: "1rem", padding: "0.4rem", fontSize: "0.8rem" }} onClick={() => alert("Stripe connection simulated!")}>
            {t("configureConn")}
          </button>
        </div>

        {/* HubSpot CRM card */}
        <div className="glass-panel glass-panel-interactive" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "260px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.3rem" }}>🎯</span>
              <span className="badge badge-success">Ready</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "0.4rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{t("hubspotTitle")}</h3>
              <span className="info-tooltip">
                <Info size={14} />
                <span className="tooltip-text">{t("hubspotDesc")}</span>
              </span>
            </div>
            
            <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                <span>{t("hubspotReadPipe")}</span>
                <span style={{ color: "var(--color-success)", fontWeight: 700 }}>ON</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                <span>{t("hubspotCreateCont")}</span>
                <span style={{ color: "var(--color-success)", fontWeight: 700 }}>ON</span>
              </div>
            </div>
          </div>

          <button className="btn btn-secondary" style={{ width: "100%", marginTop: "1rem", padding: "0.4rem", fontSize: "0.8rem" }} onClick={() => alert("HubSpot connection simulated!")}>
            {t("configureConn")}
          </button>
        </div>

        {/* Notion Connection card */}
        <div className="glass-panel glass-panel-interactive" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "260px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.3rem" }}>📝</span>
              <span className="badge badge-success">Ready</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "0.4rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{t("notionTitle")}</h3>
              <span className="info-tooltip">
                <Info size={14} />
                <span className="tooltip-text">{t("notionDesc")}</span>
              </span>
            </div>
            
            <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                <span>{t("notionSearch")}</span>
                <span style={{ color: "var(--color-success)", fontWeight: 700 }}>ON</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                <span>{t("notionCreate")}</span>
                <span style={{ color: "var(--text-muted)" }}>OFF</span>
              </div>
            </div>
          </div>

          <button className="btn btn-secondary" style={{ width: "100%", marginTop: "1rem", padding: "0.4rem", fontSize: "0.8rem" }} onClick={() => alert("Notion connection simulated!")}>
            {t("configureConn")}
          </button>
        </div>

        {/* Slack Connection card */}
        <div className="glass-panel glass-panel-interactive" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "260px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.3rem" }}>💬</span>
              <span className="badge badge-warning" style={{ background: "rgba(245, 158, 11, 0.1)", color: "#d97706" }}>Beta</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "0.4rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{t("slackTitle")}</h3>
              <span className="info-tooltip">
                <Info size={14} />
                <span className="tooltip-text">{t("slackDesc")}</span>
              </span>
            </div>
            
            <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                <span>{t("slackReadMsg")}</span>
                <span style={{ color: "var(--color-success)", fontWeight: 700 }}>ON</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                <span>{t("slackPostNotif")}</span>
                <span style={{ color: "var(--color-success)", fontWeight: 700 }}>ON</span>
              </div>
            </div>
          </div>

          <button className="btn btn-secondary" style={{ width: "100%", marginTop: "1rem", padding: "0.4rem", fontSize: "0.8rem" }} onClick={() => alert("Slack integration is currently in beta.")}>
            {t("requestAccess")}
          </button>
        </div>

      </div>

    </div>
  );
};
