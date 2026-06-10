export interface McpTool {
  name: string;
  desc: string;
  enabled?: boolean;
}

export interface McpServer {
  id: string;
  name: string;
  type: "stdio" | "sse";
  status: "connected" | "error" | "pending";
  command?: string;
  args?: string;
  env?: string;
  url?: string;
  headers?: string;
  toolsCount: number;
  lastSync: string;
  tools: McpTool[];
}
