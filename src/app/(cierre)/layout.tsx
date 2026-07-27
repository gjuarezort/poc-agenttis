import "../cierre.css";
import { CloseProvider } from "../../context/CloseContext";
import { Shell } from "../../components/cierre/Shell";

export const metadata = {
  title: "Agenttis · Cierre mensual",
  description:
    "Cierre mensual asistido: ingesta de archivos, normalización al criterio del estudio, conciliación, impuestos y entrega.",
};

export default function CierreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CloseProvider>
      <Shell>{children}</Shell>
    </CloseProvider>
  );
}
