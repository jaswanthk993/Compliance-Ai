# API Reference

These endpoints are simulated within `services/agentSystem.ts` but represent the target Cloud Run API structure.

## Policy Endpoints

### `POST /ingest/policy`
Uploads and parses a policy document.
*   **Payload:** `{ fileBase64: string, mimeType: string, filename: string }`
*   **Response:** `{ success: boolean, data: { text: string, rules: string[] } }`

### `POST /policies/save`
Saves policy metadata.
*   **Payload:** `Policy` object.
*   **Response:** `{ success: boolean }`

### `POST /policies/verify`
Verifies policy against Google Search data.
*   **Payload:** `{ policyText: string }`
*   **Response:** `{ summary: string, sources: Array }`

## Analysis Endpoints

### `POST /analyze`
Performs compliance analysis on evidence.
*   **Payload:** `{ context: MCPContext, evidence: { type: string, data: string } }`
*   **Response:** `AnalysisResult` (Risk Score, Violations).

## RAG Endpoints

### `POST /rag/train`
Indexes a policy for RAG.
*   **Payload:** `Policy` object.
*   **Response:** `{ success: boolean }`

### `POST /rag/query`
Asks a question to the policy agent.
*   **Payload:** `{ history: Array, question: string, context: MCPContext }`
*   **Response:** `string` (Answer).
