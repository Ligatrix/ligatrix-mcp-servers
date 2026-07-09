# Server Boundary

The public examples are intentionally limited:

- no private filesystem access;
- no network calls;
- no credentials;
- no hidden writes;
- deterministic responses.

Production MCP servers should add authentication, logging, review gates, and
clear data boundaries before connecting to real systems.

