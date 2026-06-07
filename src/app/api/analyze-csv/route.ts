import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawText = formData.get("text") as string | null;
    const fileName = formData.get("fileName") as string || "data.csv";

    let csvContent = "";
    if (file) {
      csvContent = await file.text();
    } else if (rawText) {
      csvContent = rawText;
    } else {
      return NextResponse.json({ error: "No CSV content provided" }, { status: 400 });
    }

    // Parse CSV
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (parsed.errors.length > 0 && parsed.data.length === 0) {
      return NextResponse.json({ error: "Failed to parse CSV: " + parsed.errors[0].message }, { status: 400 });
    }

    const rows = parsed.data as Record<string, any>[];
    if (rows.length === 0) {
      return NextResponse.json({ error: "CSV contains no data" }, { status: 400 });
    }

    const headers = Object.keys(rows[0]);
    const totalRows = rows.length;

    // Detect column types
    const columns = headers.map(header => {
      // Analyze values for this header
      let hasNumber = false;
      let hasDate = false;
      let hasBoolean = false;
      let hasString = false;
      let sampleValues: any[] = [];

      for (let i = 0; i < Math.min(rows.length, 50); i++) {
        const val = rows[i][header];
        if (val === null || val === undefined || val === "") continue;
        
        if (sampleValues.length < 5) {
          sampleValues.push(val);
        }

        if (typeof val === "number") {
          hasNumber = true;
        } else if (typeof val === "boolean") {
          hasBoolean = true;
        } else if (typeof val === "string") {
          // Check if it's a date
          const dateTest = Date.parse(val);
          const isDatePattern = /^\d{4}-\d{2}-\d{2}$|^\d{4}\/\d{2}\/\d{2}$/.test(val);
          if (!isNaN(dateTest) && isDatePattern) {
            hasDate = true;
          } else if (val.toLowerCase() === "true" || val.toLowerCase() === "false" || val.toLowerCase() === "yes" || val.toLowerCase() === "no") {
            hasBoolean = true;
          } else {
            hasString = true;
          }
        }
      }

      let detectedType = "string";
      if (hasString) {
        detectedType = "string";
      } else if (hasDate) {
        detectedType = "date";
      } else if (hasNumber) {
        detectedType = "number";
      } else if (hasBoolean) {
        detectedType = "boolean";
      }

      return {
        name: header,
        type: detectedType,
        sampleValues,
      };
    });

    // Token estimation
    // 1 token ~= 4 characters for raw CSV, plus prompt context formatting overhead.
    const csvLength = csvContent.length;
    const fullCsvTokens = Math.ceil((csvLength / 4) * 1.15) + 300; // Add system message prompt tokens

    // Build the dynamic MCP tool schema
    const mcpSchema = {
      serverName: fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() + "-mcp-server",
      version: "1.0.0",
      description: `MCP Server exposing dynamic query, search and analysis tools for ${fileName}`,
      tools: [
        {
          name: "get_schema",
          description: "Get the structure of the dataset, including column names, descriptions, and data types.",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "query_records",
          description: "Filter and query records in the dataset. Supports filtering, sorting, limit and offset pagination.",
          inputSchema: {
            type: "object",
            properties: {
              filter_column: {
                type: "string",
                description: "Column name to apply filter on",
                enum: headers
              },
              filter_operator: {
                type: "string",
                description: "Filter comparison operator",
                enum: ["eq", "neq", "gt", "gte", "lt", "lte", "contains", "starts_with"]
              },
              filter_value: {
                type: "string",
                description: "Value to compare against. Numbers and booleans will be coerced appropriately."
              },
              sort_by: {
                type: "string",
                description: "Column to sort results by",
                enum: headers
              },
              sort_order: {
                type: "string",
                description: "Sorting direction",
                enum: ["asc", "desc"],
                default: "asc"
              },
              limit: {
                type: "integer",
                description: "Maximum number of rows to return",
                default: 10
              },
              offset: {
                type: "integer",
                description: "Number of rows to skip",
                default: 0
              }
            }
          }
        },
        {
          name: "search_records",
          description: "Performs full-text search across all text columns for the given query term.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The term or phrase to search for"
              },
              limit: {
                type: "integer",
                description: "Maximum number of matching rows to return",
                default: 10
              }
            },
            required: ["query"]
          }
        },
        {
          name: "get_aggregates",
          description: "Calculate statistical metrics (sum, average, count, min, max) on numerical columns, optionally grouped by another column.",
          inputSchema: {
            type: "object",
            properties: {
              column: {
                type: "string",
                description: "Numerical column to aggregate",
                enum: columns.filter(c => c.type === "number").map(c => c.name)
              },
              operation: {
                type: "string",
                description: "The aggregation math operation",
                enum: ["sum", "avg", "count", "min", "max"]
              },
              group_by_column: {
                type: "string",
                description: "Optional column to group results by",
                enum: headers
              }
            },
            required: ["column", "operation"]
          }
        }
      ]
    };

    // Generate downloadable Node.js MCP server script code using @modelcontextprotocol/sdk
    const generatedServerCode = `/**
 * Dynamic Model Context Protocol (MCP) Server for ${fileName}
 * Generated automatically by Agenttis.
 * 
 * To run this server:
 * 1. Create a new directory and run: npm init -y
 * 2. Install dependencies: npm install @modelcontextprotocol/sdk csv-parser
 * 3. Save this code as 'index.js'
 * 4. Place your '${fileName}' file in the same directory.
 * 5. Run using: node index.js
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} from "@modelcontextprotocol/sdk/common/shared.js";
import fs from "fs";
import csv from "csv-parser";

// Load data into memory for fast querying
const RECORDS = [];
const FILE_PATH = "./${fileName}";

function loadData() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(FILE_PATH)) {
      console.error(\`Error: \${FILE_PATH} not found. Please place the CSV file in the same folder.\`);
      process.exit(1);
    }
    
    fs.createReadStream(FILE_PATH)
      .pipe(csv())
      .on("data", (data) => {
        // Coerce types where possible
        const coerced = {};
        for (const [key, val] of Object.entries(data)) {
          if (val === "" || val === null || val === undefined) {
            coerced[key] = null;
          } else if (!isNaN(val) && val.trim() !== "") {
            coerced[key] = Number(val);
          } else if (val.toLowerCase() === "true") {
            coerced[key] = true;
          } else if (val.toLowerCase() === "false") {
            coerced[key] = false;
          } else {
            coerced[key] = val;
          }
        }
        RECORDS.push(coerced);
      })
      .on("end", () => {
        console.error(\`Loaded \${RECORDS.length} records successfully.\`);
        resolve();
      })
      .on("error", (err) => reject(err));
  });
}

const server = new Server(
  {
    name: "${mcpSchema.serverName}",
    version: "${mcpSchema.version}",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register Tool Definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: ${JSON.stringify(mcpSchema.tools, null, 6)}
  };
});

// Handle Tool Executions
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_schema": {
        const schema = ${JSON.stringify(columns, null, 10)};
        return {
          content: [{ type: "text", text: JSON.stringify({ columns: schema, totalRows: RECORDS.length }, null, 2) }]
        };
      }

      case "query_records": {
        let results = [...RECORDS];
        const { filter_column, filter_operator, filter_value, sort_by, sort_order = "asc", limit = 10, offset = 0 } = args || {};

        // Apply filters
        if (filter_column && filter_operator) {
          results = results.filter(row => {
            const cell = row[filter_column];
            if (cell === null || cell === undefined) return false;
            
            // Coerce filter value to match column type
            let compVal = filter_value;
            if (typeof cell === "number") compVal = Number(filter_value);
            if (typeof cell === "boolean") compVal = filter_value === "true" || filter_value === "yes";

            switch (filter_operator) {
              case "eq": return cell === compVal;
              case "neq": return cell !== compVal;
              case "gt": return cell > compVal;
              case "gte": return cell >= compVal;
              case "lt": return cell < compVal;
              case "lte": return cell <= compVal;
              case "contains": return String(cell).toLowerCase().includes(String(compVal).toLowerCase());
              case "starts_with": return String(cell).toLowerCase().startsWith(String(compVal).toLowerCase());
              default: return true;
            }
          });
        }

        // Apply Sorting
        if (sort_by) {
          results.sort((a, b) => {
            const valA = a[sort_by];
            const valB = b[sort_by];
            if (valA === valB) return 0;
            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;
            
            const factor = sort_order === "desc" ? -1 : 1;
            return valA > valB ? factor : -factor;
          });
        }

        // Apply Pagination
        const totalMatching = results.length;
        const pageResults = results.slice(offset, offset + limit);

        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify({
              meta: { totalMatching, returned: pageResults.length, limit, offset },
              records: pageResults
            }, null, 2) 
          }]
        };
      }

      case "search_records": {
        const { query, limit = 10 } = args || {};
        if (!query) {
          return { content: [{ type: "text", text: "Error: Search query is required." }], isError: true };
        }
        
        const q = String(query).toLowerCase();
        const results = RECORDS.filter(row => {
          return Object.values(row).some(val => 
            val !== null && val !== undefined && String(val).toLowerCase().includes(q)
          );
        }).slice(0, limit);

        return {
          content: [{ type: "text", text: JSON.stringify({ results }, null, 2) }]
        };
      }

      case "get_aggregates": {
        const { column, operation, group_by_column } = args || {};
        if (!column || !operation) {
          return { content: [{ type: "text", text: "Error: column and operation parameters are required." }], isError: true };
        }

        // Simple aggregation calculator
        const calc = (vals, op) => {
          if (vals.length === 0) return 0;
          switch (op) {
            case "count": return vals.length;
            case "sum": return vals.reduce((s, v) => s + (Number(v) || 0), 0);
            case "avg": return vals.reduce((s, v) => s + (Number(v) || 0), 0) / vals.length;
            case "min": return Math.min(...vals.map(v => Number(v) || Infinity));
            case "max": return Math.max(...vals.map(v => Number(v) || -Infinity));
            default: return 0;
          }
        };

        if (group_by_column) {
          const groups = {};
          RECORDS.forEach(row => {
            const key = String(row[group_by_column] !== null ? row[group_by_column] : "NULL");
            if (!groups[key]) groups[key] = [];
            if (row[column] !== null && row[column] !== undefined) {
              groups[key].push(row[column]);
            }
          });

          const groupResults = {};
          for (const [key, vals] of Object.entries(groups)) {
            groupResults[key] = calc(vals, operation);
          }

          return {
            content: [{ type: "text", text: JSON.stringify({ column, operation, groupedBy: group_by_column, results: groupResults }, null, 2) }]
          };
        } else {
          const vals = RECORDS
            .map(row => row[column])
            .filter(v => v !== null && v !== undefined);
          const value = calc(vals, operation);

          return {
            content: [{ type: "text", text: JSON.stringify({ column, operation, result: value }, null, 2) }]
          };
        }
      }

      default:
        throw new Error(\`Tool not found: \${name}\`);
    }
  } catch (err) {
    return {
      content: [{ type: "text", text: \`Error executing tool \${name}: \${err.message}\` }],
      isError: true
    };
  }
});

// Run Server
async function main() {
  await loadData();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Agenttis Dynamic MCP Server running on stdio transport.");
}

main().catch(err => {
  console.error("Server crashed:", err);
  process.exit(1);
});
`;

    return NextResponse.json({
      fileName,
      totalRows,
      columns,
      fullCsvTokens,
      mcpSchema,
      generatedServerCode,
      csvContent, // return raw text back to the client to store in session
    });

  } catch (error: any) {
    console.error("Analyze CSV Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process CSV file" }, { status: 500 });
  }
}
