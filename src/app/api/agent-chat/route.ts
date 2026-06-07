import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(req: NextRequest) {
  try {
    const { csvContent, query, language = "en" } = await req.json();

    if (!csvContent || !query) {
      return NextResponse.json({ error: "Missing csvContent or query" }, { status: 400 });
    }

    const isSpanish = language === "es";

    // Parse CSV
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    const RECORDS = parsed.data as Record<string, any>[];
    if (RECORDS.length === 0) {
      return NextResponse.json({ error: "CSV data is empty" }, { status: 400 });
    }

    const headers = Object.keys(RECORDS[0]);
    const totalRows = RECORDS.length;

    // Estimate full context token consumption
    const csvChars = csvContent.length;
    const fullContextTokens = Math.ceil((csvChars / 4) * 1.15) + 350;
    const fullContextLatency = Math.round(1500 + totalRows * 30);

    // Setup tracing variables
    const trace: {
      step: number;
      type: "thought" | "tool_call" | "tool_response" | "answer";
      message: string;
      details?: any;
    }[] = [];

    let toolName = "";
    let toolArgs: any = {};
    let toolResultText = "";
    let finalAnswer = "";

    // Normalize query for parsing
    const qLower = query.toLowerCase();

    // SEMANTIC ROUTER / PARSER
    let matched = false;

    // Translated terms helper
    const tOp = (op: string) => {
      if (!isSpanish) return op;
      switch (op) {
        case "avg": return "promedio";
        case "sum": return "suma";
        case "min": return "mínimo";
        case "max": return "máximo";
        case "count": return "conteo";
        default: return op;
      }
    };

    // 1. Check for schema/structure questions
    const schemaKeywords = isSpanish 
      ? ["esquema", "columnas", "estructura", "campos", "tipo de dato"]
      : ["schema", "columns", "structure", "fields", "data type"];

    if (schemaKeywords.some(keyword => qLower.includes(keyword))) {
      toolName = "get_schema";
      toolArgs = {};
      
      const columnsSample = headers.map(h => {
        const val = RECORDS[0][h];
        return { name: h, type: typeof val };
      });
      toolResultText = JSON.stringify({ columns: columnsSample, totalRows }, null, 2);
      
      finalAnswer = isSpanish
        ? `He inspeccionado la estructura de datos. El conjunto de datos contiene **${totalRows} filas** con las siguientes columnas: ${headers.map(h => `\`${h}\``).join(", ")}.`
        : `I have inspected the data structure. The dataset contains **${totalRows} rows** with the following columns: ${headers.map(h => `\`${h}\``).join(", ")}.`;
      matched = true;
    }

    // 2. Check for Aggregates (sum, average, max, min, count)
    if (!matched) {
      const ops = [
        { key: "avg", words: isSpanish ? ["promedio", "media", "avg"] : ["average", "avg", "mean"] },
        { key: "sum", words: isSpanish ? ["suma", "total", "sumar", "sumado"] : ["sum", "total", "combined"] },
        { key: "min", words: isSpanish ? ["minimo", "mínimo", "mas bajo", "más bajo", "min"] : ["min", "lowest", "minimum"] },
        { key: "max", words: isSpanish ? ["maximo", "máximo", "mas alto", "más alto", "max"] : ["max", "highest", "maximum"] },
        { key: "count", words: isSpanish ? ["conteo", "cuantos", "cuántos", "cantidad", "numero de", "número de"] : ["count", "how many", "number of"] }
      ];

      let detectedOp = "";
      let targetColumn = "";
      let groupByCol = "";

      for (const op of ops) {
        if (op.words.some(word => qLower.includes(word))) {
          detectedOp = op.key;
          break;
        }
      }

      for (const header of headers) {
        const hLow = header.toLowerCase();
        if (qLower.includes(hLow)) {
          targetColumn = header;
          break;
        }
      }

      if (!targetColumn) {
        for (const header of headers) {
          const hLow = header.toLowerCase();
          const words = hLow.split(/[_-]/);
          if (words.some(w => w.length > 2 && qLower.includes(w))) {
            targetColumn = header;
            break;
          }
        }
      }

      const groupByWords = isSpanish ? ["por ", "agrupado por "] : ["by ", "grouped by "];
      if (groupByWords.some(w => qLower.includes(w))) {
        for (const header of headers) {
          const hLow = header.toLowerCase();
          const indexBy = qLower.indexOf("por ");
          const indexGroup = qLower.indexOf("agrupado por ");
          const indexByEn = qLower.indexOf("by ");
          const indexGroupEn = qLower.indexOf("grouped by ");
          
          let searchPart = "";
          if (indexGroup !== -1) searchPart = qLower.substring(indexGroup);
          else if (indexBy !== -1) searchPart = qLower.substring(indexBy);
          else if (indexGroupEn !== -1) searchPart = qLower.substring(indexGroupEn);
          else if (indexByEn !== -1) searchPart = qLower.substring(indexByEn);

          if (searchPart && searchPart.includes(hLow)) {
            groupByCol = header;
            break;
          }
        }
      }

      if (detectedOp && targetColumn) {
        toolName = "get_aggregates";
        toolArgs = { column: targetColumn, operation: detectedOp };
        if (groupByCol) toolArgs.group_by_column = groupByCol;

        const vals = RECORDS.map(r => r[targetColumn]).filter(v => typeof v === "number" || !isNaN(Number(v)));
        const calc = (items: number[]) => {
          if (items.length === 0) return 0;
          if (detectedOp === "sum") return items.reduce((a, b) => a + b, 0);
          if (detectedOp === "avg") return items.reduce((a, b) => a + b, 0) / items.length;
          if (detectedOp === "min") return Math.min(...items);
          if (detectedOp === "max") return Math.max(...items);
          if (detectedOp === "count") return items.length;
          return 0;
        };

        if (groupByCol) {
          const grouped: Record<string, number[]> = {};
          RECORDS.forEach(row => {
            const groupVal = String(row[groupByCol] !== null ? row[groupByCol] : "NULL");
            if (!grouped[groupVal]) grouped[groupVal] = [];
            const v = Number(row[targetColumn]);
            if (!isNaN(v)) grouped[groupVal].push(v);
          });

          const results: Record<string, number> = {};
          for (const [key, items] of Object.entries(grouped)) {
            results[key] = Number(calc(items).toFixed(2));
          }
          toolResultText = JSON.stringify({ column: targetColumn, operation: detectedOp, groupedBy: groupByCol, results }, null, 2);

          const groupBreakdown = Object.entries(results)
            .map(([g, v]) => `* **${g}**: ${detectedOp === "sum" || detectedOp === "avg" || detectedOp === "min" || detectedOp === "max" ? (typeof v === "number" ? v.toLocaleString() : v) : v}`)
            .join("\n");
            
          finalAnswer = isSpanish
            ? `Aquí está el desglose del **${tOp(detectedOp)}** para la columna **${targetColumn}** agrupado por **${groupByCol}**:\n\n${groupBreakdown}`
            : `Here is the breakdown of the **${detectedOp}** of **${targetColumn}** grouped by **${groupByCol}**:\n\n${groupBreakdown}`;
        } else {
          const resultVal = calc(vals as number[]);
          toolResultText = JSON.stringify({ column: targetColumn, operation: detectedOp, result: resultVal }, null, 2);
          
          let formattedVal = typeof resultVal === "number" ? resultVal.toFixed(2) : String(resultVal);
          if (detectedOp === "count") formattedVal = String(Math.round(resultVal));
          
          finalAnswer = isSpanish
            ? `La operación de **${tOp(detectedOp)}** calculada para la columna **${targetColumn}** es **${Number(formattedVal).toLocaleString()}**.`
            : `The calculated **${detectedOp}** for column **${targetColumn}** is **${Number(formattedVal).toLocaleString()}**.`;
        }
        matched = true;
      }
    }

    // 3. Check for text search
    if (!matched) {
      const searchMatch = query.match(/find\s+(.+)|search\s+(.+)|lookup\s+(.+)|buscar\s+(.+)|encontrar\s+(.+)/i);
      const quotedMatch = query.match(/"([^"]+)"|'([^']+)'/);
      
      let searchTerm = "";
      if (searchMatch) {
        searchTerm = searchMatch[1] || searchMatch[2] || searchMatch[3] || searchMatch[4] || searchMatch[5];
      } else if (quotedMatch) {
        searchTerm = quotedMatch[1] || quotedMatch[2];
      } else {
        const words = query.replace(/[?.,!]/g, "").split(/\s+/).filter((w: string) => w.length > 3);
        if (words.length > 0) {
          searchTerm = words[words.length - 1];
        }
      }

      const searchAction = isSpanish 
        ? ["buscar", "encuentra", "busca", "encontrar", "dónde está", "quién es"]
        : ["find", "search", "show me", "who is", "where is", "lookup"];

      if (searchTerm && searchAction.some(act => qLower.includes(act))) {
        toolName = "search_records";
        toolArgs = { query: searchTerm, limit: 5 };

        const queryLower = searchTerm.toLowerCase();
        const results = RECORDS.filter(row => {
          return Object.values(row).some(val => 
            val !== null && val !== undefined && String(val).toLowerCase().includes(queryLower)
          );
        }).slice(0, 5);

        toolResultText = JSON.stringify({ results }, null, 2);
        
        if (results.length > 0) {
          const listText = results.map((row, idx) => {
            const fieldsStr = Object.entries(row)
              .map(([k, v]) => `**${k}**: ${v}`)
              .join(", ");
            return `${idx + 1}. ${fieldsStr}`;
          }).join("\n");
          
          finalAnswer = isSpanish
            ? `Encontré **${results.length} registro(s)** que coinciden con "${searchTerm}":\n\n${listText}`
            : `I found **${results.length} record(s)** matching "${searchTerm}":\n\n${listText}`;
        } else {
          finalAnswer = isSpanish
            ? `Realicé una búsqueda para "${searchTerm}" pero no se encontraron registros coincidentes en el conjunto de datos.`
            : `I performed a search for "${searchTerm}" but no matching records were found in the dataset.`;
        }
        matched = true;
      }
    }

    // 4. Default: Query / Filter Records
    if (!matched) {
      toolName = "query_records";
      
      let filterColumn = "";
      let filterOperator = "eq";
      let filterValue = "";
      let sortBy = "";
      let sortOrder = "asc";

      for (const h of headers) {
        if (qLower.includes(h.toLowerCase())) {
          filterColumn = h;
          break;
        }
      }

      // Operators detection
      if (qLower.includes("greater than") || qLower.includes("more than") || qLower.includes(">") || qLower.includes("mayor que") || qLower.includes("mas de") || qLower.includes("más de")) {
        filterOperator = "gt";
      } else if (qLower.includes("less than") || qLower.includes("under") || qLower.includes("<") || qLower.includes("menor que") || qLower.includes("menos de") || qLower.includes("bajo")) {
        filterOperator = "lt";
      } else if (qLower.includes("not equal") || qLower.includes("is not") || qLower.includes("!=") || qLower.includes("no es igual") || qLower.includes("diferente")) {
        filterOperator = "neq";
      } else if (qLower.includes("contains") || qLower.includes("includes") || qLower.includes("like") || qLower.includes("contiene") || qLower.includes("incluye")) {
        filterOperator = "contains";
      } else if (qLower.includes("starts with") || qLower.includes("begins with") || qLower.includes("empieza con") || qLower.includes("inicia con")) {
        filterOperator = "starts_with";
      }

      const numMatch = query.match(/\d+(?:\.\d+)?/);
      if (numMatch) {
        filterValue = numMatch[0];
      } else {
        const quotes = query.match(/"([^"]+)"/);
        if (quotes) {
          filterValue = quotes[1];
        } else {
          const categories = ["active", "inactive", "activo", "inactivo", "usa", "uk", "canada", "germany", "france", "italy", "brazil", "japan", "spain", "alemania", "francia", "italia", "irlanda"];
          for (const cat of categories) {
            if (qLower.includes(cat)) {
              // Map Spanish queries for sample category filters
              if (cat === "activo") filterValue = "Active";
              else if (cat === "inactivo") filterValue = "Inactive";
              else if (cat === "alemania") filterValue = "Germany";
              else if (cat === "francia") filterValue = "France";
              else if (cat === "italia") filterValue = "Italy";
              else if (cat === "irlanda") filterValue = "Ireland";
              else filterValue = cat;
              break;
            }
          }
        }
      }

      const sortKeywords = ["sort by", "order by", "ordenar por", "ordena por", "filtrar por"];
      if (sortKeywords.some(keyword => qLower.includes(keyword))) {
        for (const h of headers) {
          if (qLower.includes(h.toLowerCase())) {
            sortBy = h;
            break;
          }
        }
        const descKeywords = ["descending", "desc", "highest", "most", "descendente", "mayor", "mas alto", "más alto", "maximo", "máximo"];
        if (descKeywords.some(w => qLower.includes(w))) {
          sortOrder = "desc";
        }
      }

      toolArgs = { limit: 5 };
      if (filterColumn && filterValue) {
        toolArgs.filter_column = filterColumn;
        toolArgs.filter_operator = filterOperator;
        toolArgs.filter_value = filterValue;
      }
      if (sortBy) {
        toolArgs.sort_by = sortBy;
        toolArgs.sort_order = sortOrder;
      }

      let results = [...RECORDS];
      if (filterColumn && filterValue) {
        results = results.filter(row => {
          const cell = row[filterColumn];
          if (cell === null || cell === undefined) return false;
          
          let compVal: any = filterValue;
          if (typeof cell === "number") compVal = Number(filterValue);
          if (typeof cell === "boolean") compVal = filterValue.toLowerCase() === "true" || filterValue.toLowerCase() === "active" || filterValue.toLowerCase() === "activo";

          switch (filterOperator) {
            case "eq": return String(cell).toLowerCase() === String(compVal).toLowerCase();
            case "neq": return String(cell).toLowerCase() !== String(compVal).toLowerCase();
            case "gt": return Number(cell) > Number(compVal);
            case "gte": return Number(cell) >= Number(compVal);
            case "lt": return Number(cell) < Number(compVal);
            case "lte": return Number(cell) <= Number(compVal);
            case "contains": return String(cell).toLowerCase().includes(String(compVal).toLowerCase());
            case "starts_with": return String(cell).toLowerCase().startsWith(String(compVal).toLowerCase());
            default: return true;
          }
        });
      }

      if (sortBy) {
        results.sort((a, b) => {
          const valA = a[sortBy];
          const valB = b[sortBy];
          if (valA === valB) return 0;
          if (valA === null || valA === undefined) return 1;
          if (valB === null || valB === undefined) return -1;
          
          const factor = sortOrder === "desc" ? -1 : 1;
          return valA > valB ? factor : -factor;
        });
      }

      const totalMatching = results.length;
      const returnedResults = results.slice(0, 5);

      toolResultText = JSON.stringify({
        meta: { totalMatching, returned: returnedResults.length, limit: 5, offset: 0 },
        records: returnedResults
      }, null, 2);

      if (returnedResults.length > 0) {
        const rowsText = returnedResults.map((r, i) => {
          return `${i + 1}. ` + Object.entries(r).map(([k, v]) => `**${k}**: ${v}`).join(", ");
        }).join("\n");
        
        finalAnswer = isSpanish
          ? `Consulté el conjunto de datos usando la herramienta dinámica \`query_records\`. Encontré **${totalMatching} registros coincidentes en total**. Mostrando los primeros 5:\n\n${rowsText}`
          : `I queried the dataset using the dynamic tool \`query_records\`. Found **${totalMatching} total matching records**. Displaying the top 5:\n\n${rowsText}`;
      } else {
        finalAnswer = isSpanish
          ? `Consulté el conjunto de datos, pero ningún registro cumplió con los criterios especificados (${filterColumn} ${filterOperator} ${filterValue}).`
          : `I queried the dataset, but no records met the specified criteria (${filterColumn} ${filterOperator} ${filterValue}).`;
      }
    }

    // Adapt thoughts & agent stages to target language
    const stepsText = {
      1: isSpanish
        ? `Analizando la consulta del usuario: "${query}". Veo que esta es una solicitud sobre los datos estructurados. Invocaré la herramienta MCP dinámica para evitar cargar todo el documento en el contexto del prompt.`
        : `Analyzing user query: "${query}". I see this is a request about the dataset. I will invoke the appropriate MCP tool instead of loading the entire document to save tokens.`,
      2: isSpanish
        ? `Invocando herramienta MCP: \`${toolName}\` en el servidor \`agenttis-csv-server\``
        : `Calling MCP tool: \`${toolName}\` on server \`agenttis-csv-server\``,
      3: isSpanish
        ? `Respuesta de ejecución de herramienta recibida (Estado: 200 Éxito)`
        : `Received tool execution response (Status: 200 Success)`,
      4: isSpanish
        ? `Formulada la respuesta final para el usuario basada en los resultados estructurados devueltos.`
        : `Formulated response for user based on tool outputs.`
    };

    trace.push({
      step: 1,
      type: "thought",
      message: stepsText[1]
    });

    trace.push({
      step: 2,
      type: "tool_call",
      message: stepsText[2],
      details: {
        tool: toolName,
        arguments: toolArgs
      }
    });

    trace.push({
      step: 3,
      type: "tool_response",
      message: stepsText[3],
      details: {
        rawOutput: toolResultText.length > 400 ? toolResultText.substring(0, 400) + "\n...[truncated]" : toolResultText
      }
    });

    trace.push({
      step: 4,
      type: "answer",
      message: stepsText[4],
      details: {
        answer: finalAnswer
      }
    });

    // MCP Token calculations
    const toolOutputTokens = Math.ceil(toolResultText.length / 4);
    const mcpTokens = 200 + 50 + toolOutputTokens + 250;
    const mcpLatency = Math.round(180 + Math.random() * 120);

    const tokensSaved = Math.max(0, fullContextTokens - mcpTokens);
    const savingsPercent = fullContextTokens > 0 ? Number(((tokensSaved / fullContextTokens) * 100).toFixed(1)) : 0;

    const fullContextCost = (fullContextTokens / 1000000) * 10;
    const mcpCost = (mcpTokens / 1000000) * 10;
    const costSaved = Math.max(0, fullContextCost - mcpCost);

    return NextResponse.json({
      query,
      answer: finalAnswer,
      trace,
      metrics: {
        fullContextTokens,
        fullContextLatency,
        fullContextCost: Number(fullContextCost.toFixed(5)),
        mcpTokens,
        mcpLatency,
        mcpCost: Number(mcpCost.toFixed(5)),
        tokensSaved,
        savingsPercent,
        costSaved: Number(costSaved.toFixed(5)),
      }
    });

  } catch (error: any) {
    console.error("Agent Chat Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process agent request" }, { status: 500 });
  }
}
