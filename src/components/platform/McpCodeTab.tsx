import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import { ShieldCheck, Copy, Download } from "lucide-react";
import { TRANSLATIONS } from "../../lib/translations";

interface McpCodeTabProps {
  language: "en" | "es";
  parsedData: any;
  fileName: string;
  copyToClipboard: (text: string) => void;
  downloadFile: (content: string, filename: string) => void;
}



export const McpCodeTab: React.FC = () => {
  const { language,
  parsedData,
  fileName,
  copyToClipboard,
  downloadFile, } = useDashboard();
  const t = (key: string) => {
    const dict = TRANSLATIONS[language] as any;
    return dict[key] !== undefined ? dict[key] : key;
  };

  return (
    <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: "1.25rem" }}>
      {/* Overview schema */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <h3 style={{ marginBottom: "0.4rem" }}>{t("mcpOverviewTitle")}</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            {t("mcpOverviewDesc")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ padding: "0.6rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{t("serverIdentity")}</div>
              <div style={{ fontWeight: 600, color: "var(--color-primary)", fontSize: "0.85rem" }}>{parsedData.mcpSchema.serverName}</div>
            </div>

            <div style={{ padding: "0.6rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {t("availableTools").replace("{count}", parsedData.mcpSchema.tools.length)}
              </div>
              <ul style={{ paddingLeft: "1rem", margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                {parsedData.mcpSchema.tools.map((t: any, idx: number) => (
                  <li key={idx} style={{ marginBottom: "0.15rem" }}>
                    <strong style={{ color: "var(--text-primary)" }}>{t.name}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ padding: "0.6rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{t("mcpVersion")}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>v1.0.0</div>
            </div>
          </div>
        </div>

        {/* Direct instructions */}
        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            <ShieldCheck size={16} style={{ color: "var(--color-success)" }} /> {t("setupInstructionsTitle")}
          </h4>
          <ol style={{ paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <li>{t("setupStep1")}</li>
            <li>{t("setupStep2")}</li>
            <li>{t("setupStep3").replace("{fileName}", fileName)}</li>
            <li>{t("setupStep4")}</li>
            <li>{t("setupStep5")}</li>
          </ol>
        </div>
      </div>

      {/* Script area */}
      <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <div>
            <h3 style={{ margin: 0 }}>{t("generatedScriptTitle")}</h3>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)" }}>{t("generatedScriptDesc")}</p>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => copyToClipboard(parsedData.generatedServerCode)}
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
            >
              <Copy size={12} /> {t("copyScript")}
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => downloadFile(parsedData.generatedServerCode, "mcp-server-index.js")}
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
            >
              <Download size={12} /> {t("downloadScript")}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", minHeight: "400px" }}>
          <pre className="code-block" style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "auto",
            margin: 0,
            fontSize: "0.8rem",
            lineHeight: "1.4"
          }}>
            {parsedData.generatedServerCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
