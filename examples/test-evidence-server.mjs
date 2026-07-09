import { handleRequest } from "../servers/evidence-server.mjs";

const list = handleRequest({ jsonrpc: "2.0", id: 1, method: "tools/list" });
if (list.result.tools.length !== 2) throw new Error("Expected two tools.");

const evidence = handleRequest({
  jsonrpc: "2.0",
  id: 2,
  method: "tools/call",
  params: {
    name: "ligatrix.createEvidencePack",
    arguments: {
      summary: "Public MCP-style evidence example",
      checks: [{ name: "example", result: "pass" }],
    },
  },
});

const text = evidence.result.content[0].text;
if (!text.includes("Public MCP-style evidence example")) {
  throw new Error("Evidence response missing summary.");
}

console.log(JSON.stringify({ list, evidence }, null, 2));

