import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agenttis | Low-code AI Agent Integration Platform",
  description: "Connect your enterprise data to AI agents securely and efficiently using Model Context Protocol (MCP) dynamic tools with real-time observability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
