#!/usr/bin/env node
import { createInterface } from "node:readline";

const tools = [
  {
    name: "ligatrix.createEvidencePack",
    description: "Create a generic evidence pack skeleton.",
    inputSchema: {
      type: "object",
      required: ["summary"],
      properties: {
        summary: { type: "string" },
        checks: { type: "array" },
      },
    },
  },
  {
    name: "ligatrix.createHandoff",
    description: "Create a generic handoff skeleton.",
    inputSchema: {
      type: "object",
      required: ["title"],
      properties: {
        title: { type: "string" },
        next_safe_step: { type: "string" },
      },
    },
  },
];

function result(id, value) {
  return { jsonrpc: "2.0", id, result: value };
}

function error(id, message) {
  return { jsonrpc: "2.0", id, error: { code: -32000, message } };
}

export function handleRequest(request) {
  if (request.method === "tools/list") {
    return result(request.id, { tools });
  }

  if (request.method === "tools/call") {
    const { name, arguments: args = {} } = request.params || {};
    if (name === "ligatrix.createEvidencePack") {
      return result(request.id, {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              summary: args.summary,
              checks: args.checks || [],
              risks: [],
              unverified: [],
            }, null, 2),
          },
        ],
      });
    }

    if (name === "ligatrix.createHandoff") {
      return result(request.id, {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              title: args.title,
              work_completed: [],
              checks_run: [],
              risks: [],
              next_safe_step: args.next_safe_step || "",
            }, null, 2),
          },
        ],
      });
    }

    return error(request.id, `Unknown tool: ${name}`);
  }

  return error(request.id, `Unknown method: ${request.method}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
  rl.on("line", (line) => {
    try {
      const response = handleRequest(JSON.parse(line));
      console.log(JSON.stringify(response));
    } catch (err) {
      console.log(JSON.stringify(error(null, err.message)));
    }
  });
}

