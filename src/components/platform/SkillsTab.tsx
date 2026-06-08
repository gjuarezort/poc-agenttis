import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import { Plus, SlidersHorizontal, XCircle } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  description: string;
  type: "read" | "action";
  status: "active";
  method?: string;
  endpoint?: string;
  parameters?: any[];
}

interface SkillsTabProps {
  language: "en" | "es";
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  advancedMode: boolean;
  setAdvancedMode: (open: boolean) => void;
  skillFormOpen: boolean;
  setSkillFormOpen: (open: boolean) => void;
  skillFormName: string;
  setSkillFormName: (name: string) => void;
  skillFormDesc: string;
  setSkillFormDesc: (desc: string) => void;
  skillFormType: "read" | "action";
  setSkillFormType: (type: "read" | "action") => void;
  skillFormMethod: "GET" | "POST";
  setSkillFormMethod: (method: "GET" | "POST") => void;
  skillFormUrl: string;
  setSkillFormUrl: (url: string) => void;
  skillFormJson: string;
  setSkillFormJson: (json: string) => void;
}



export const SkillsTab: React.FC = () => {
  const { language,
  skills,
  setSkills,
  advancedMode,
  setAdvancedMode,
  skillFormOpen,
  setSkillFormOpen,
  skillFormName,
  setSkillFormName,
  skillFormDesc,
  setSkillFormDesc,
  skillFormType,
  setSkillFormType,
  skillFormMethod,
  setSkillFormMethod,
  skillFormUrl,
  setSkillFormUrl,
  skillFormJson,
  setSkillFormJson, } = useDashboard();
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ margin: "0 0 0.2rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>🤖</span> {language === "es" ? "Habilidades y Acciones (Skills)" : "Agent Skills & Actions"}
            </h3>
            <p style={{ margin: 0, fontSize: "0.82rem" }}>
              {language === "es" 
                ? "Configurá las capacidades de tus agentes de IA. Definí qué datos leen y qué acciones ejecutan en tus sistemas (API POST)."
                : "Configure the capabilities of your AI agents. Define what data they read and what actions they execute (API POST)."}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Advanced mode switch */}
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600, color: advancedMode ? "var(--color-primary)" : "var(--text-secondary)" }}>
              <SlidersHorizontal size={13} style={{ color: advancedMode ? "var(--color-primary)" : "var(--text-muted)" }} />
              <span>{language === "es" ? "Configuración Avanzada" : "Advanced Config"}</span>
              <input 
                type="checkbox" 
                checked={advancedMode} 
                onChange={e => setAdvancedMode(e.target.checked)} 
                style={{ width: "auto", cursor: "pointer", marginLeft: "0.25rem" }}
              />
            </label>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setSkillFormOpen(true);
                setSkillFormName("");
                setSkillFormDesc("");
                setSkillFormType("action");
                setSkillFormMethod("POST");
                setSkillFormUrl("");
              }}
              style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem" }}
            >
              <Plus size={14} /> {language === "es" ? "Nueva Habilidad" : "New Skill"}
            </button>
          </div>
        </div>

        {/* Skill Builder Form */}
        {skillFormOpen && (
          <div className="glass-panel" style={{ padding: "1.25rem", marginBottom: "1.25rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color-glow)" }}>
            <h4 style={{ marginBottom: "0.85rem", fontSize: "0.9rem", color: "var(--color-primary)" }}>
              {language === "es" ? "Agregar Nueva Habilidad" : "Add New Skill"}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "600px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {language === "es" ? "Nombre de la Habilidad" : "Skill Name"}
                </label>
                <input 
                  type="text" 
                  placeholder={language === "es" ? "Ej. Reembolsar Factura Stripe" : "e.g., Refund Stripe Invoice"} 
                  value={skillFormName} 
                  onChange={e => setSkillFormName(e.target.value)} 
                  style={{ fontSize: "0.85rem" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {language === "es" ? "Descripción" : "Description"}
                </label>
                <input 
                  type="text" 
                  placeholder={language === "es" ? "Ej. Crea una nueva orden de reembolso en Stripe..." : "e.g., Creates a new refund transaction in Stripe..."} 
                  value={skillFormDesc} 
                  onChange={e => setSkillFormDesc(e.target.value)} 
                  style={{ fontSize: "0.85rem" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                    {language === "es" ? "Tipo de Habilidad" : "Skill Type"}
                  </label>
                  <select 
                    value={skillFormType} 
                    onChange={e => setSkillFormType(e.target.value as any)} 
                    style={{ fontSize: "0.85rem" }}
                  >
                    <option value="read">{language === "es" ? "Lectura (GET)" : "Read (GET)"}</option>
                    <option value="action">{language === "es" ? "Acción (POST API)" : "Action (POST API)"}</option>
                  </select>
                </div>
                {skillFormType === "action" && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                      {language === "es" ? "Método HTTP" : "HTTP Method"}
                    </label>
                    <select 
                      value={skillFormMethod} 
                      onChange={e => setSkillFormMethod(e.target.value as any)} 
                      style={{ fontSize: "0.85rem" }}
                    >
                      <option value="POST">POST</option>
                      <option value="GET">GET</option>
                    </select>
                  </div>
                )}
              </div>

              {skillFormType === "action" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                    {language === "es" ? "URL del Endpoint / API" : "Endpoint / API URL"}
                  </label>
                  <input 
                    type="text" 
                    placeholder="https://api.empresa.com/v1/..." 
                    value={skillFormUrl} 
                    onChange={e => setSkillFormUrl(e.target.value)} 
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
              )}

              {advancedMode ? (
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem", color: "var(--color-primary)" }}>
                    {language === "es" ? "Parámetros de Entrada (JSON Schema)" : "Input Parameters (JSON Schema)"}
                  </label>
                  <textarea 
                    rows={4} 
                    value={skillFormJson} 
                    onChange={e => setSkillFormJson(e.target.value)} 
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", background: "#0a0a0a", color: "#10b981", borderColor: "var(--border-color-glow)" }}
                  />
                </div>
              ) : (
                <div style={{ padding: "0.75rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <p style={{ margin: "0 0 0.4rem", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {language === "es" ? "Campos de Entrada autodetectados" : "Autodetected Input Fields"}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {language === "es" 
                      ? "Agenttis detectará y validará automáticamente las propiedades requeridas por el agente basándose en la descripción." 
                      : "Agenttis will automatically detect and validate properties required by the agent based on the description."}
                  </p>
                </div>
              )}

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    if (!skillFormName) return;
                    let parsedParams: any[] = [];
                    try {
                      if (advancedMode) {
                        const parsedObj = JSON.parse(skillFormJson);
                        parsedParams = Object.entries(parsedObj).map(([k, v]) => ({ name: k, type: String(v) }));
                      } else {
                        parsedParams = [{ name: "id", type: "string" }];
                      }
                    } catch (e) {
                      alert(language === "es" ? "JSON de parámetros inválido" : "Invalid parameters JSON");
                      return;
                    }

                    setSkills(prev => [
                      ...prev,
                      {
                        id: `skill-${Date.now()}`,
                        name: skillFormName,
                        description: skillFormDesc,
                        type: skillFormType,
                        status: "active",
                        method: skillFormMethod,
                        endpoint: skillFormType === "action" ? skillFormUrl : undefined,
                        parameters: parsedParams
                      }
                    ]);
                    setSkillFormOpen(false);
                  }}
                  style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                >
                  {language === "es" ? "Guardar Habilidad" : "Save Skill"}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setSkillFormOpen(false)}
                  style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                >
                  {language === "es" ? "Cancelar" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Skills grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {skills.map(skill => (
            <div key={skill.id} className="glass-panel" style={{ padding: "1rem", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "0.75rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span className={`badge ${skill.type === "read" ? "badge-info" : "badge-success"}`} style={{ fontSize: "0.62rem" }}>
                    {skill.type === "read" ? (language === "es" ? "Lectura" : "Read") : (language === "es" ? "Acción (POST)" : "Action (POST)")}
                  </span>
                  <span className="badge badge-success" style={{ fontSize: "0.62rem", background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.15)" }}>
                    {language === "es" ? "Activo" : "Active"}
                  </span>
                </div>
                <h4 style={{ margin: "0 0 0.25rem", fontSize: "0.88rem", fontWeight: 700 }}>{skill.name}</h4>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{skill.description}</p>
                
                {skill.endpoint && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--color-accent)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <strong>URL:</strong> {skill.endpoint}
                  </div>
                )}
              </div>

              {advancedMode ? (
                <div style={{ marginTop: "0.25rem", padding: "0.5rem", background: "#0a0a0a", border: "1px solid var(--border-color)", borderRadius: "4px" }}>
                  <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
                    {language === "es" ? "Parámetros JSON" : "JSON Parameters"}
                  </p>
                  <pre style={{ margin: 0, fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#10b981" }}>
                    {JSON.stringify(
                      skill.parameters ? skill.parameters.reduce((acc: any, curr: any) => ({ ...acc, [curr.name]: curr.type }), {}) : { id: "string" }, 
                      null, 
                      2
                    )}
                  </pre>
                </div>
              ) : (
                skill.parameters && skill.parameters.length > 0 && (
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                    <strong>{language === "es" ? "Campos requeridos:" : "Required fields:"}</strong>{" "}
                    {skill.parameters.map((p: any) => `${p.name} (${p.type === "number" ? (language === "es" ? "número" : "number") : (language === "es" ? "texto" : "text")})`).join(", ")}
                  </div>
                )
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "0.5rem", marginTop: "0.25rem" }}>
                <button 
                  onClick={() => setSkills(prev => prev.filter(s => s.id !== skill.id))} 
                  style={{ background: "none", border: "none", color: "var(--color-danger)", fontSize: "0.72rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.2rem", padding: "0.2rem 0.5rem" }}
                >
                  <XCircle size={12} /> {language === "es" ? "Eliminar" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
