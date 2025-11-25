# System Architecture

## Core Architecture Summary
AI Compliance Copilot is a scalable, serverless, AI-centric application designed for Google Cloud Run.

### 1. Application Layer
*   **Frontend:** React Single Page Application (SPA).
*   **Auth:** Firebase Authentication (Simulated via `AuthContext`).
*   **Hosting:** Nginx container on Cloud Run.

### 2. Orchestration Layer (ADK & MCP)
*   **MCP Toolbox:** Acts as a data abstraction layer in `agentSystem.ts`, routing requests to the appropriate simulated data store.
*   **ADK Agent:** Implements the `ADKOrchestrator` pattern.
    *   **Input:** Multi-modal (Text/PDF/Image).
    *   **Logic:** Rule Extraction -> Comparison -> Scoring.
    *   **Output:** Structured JSON Violation Report.

### 3. Hybrid Data Layer (Polyglot Persistence)
The application implements a Hybrid Storage strategy to optimize for specific data types:
*   **Cloud Spanner:** Stores high-consistency transactional metadata (Policies, Rules).
*   **MongoDB Atlas:** Stores vector embeddings for RAG (Retrieval Augmented Generation).
*   **BigQuery:** Stores immutable audit logs and risk history for analytics.
*   **Cloud Storage:** Stores unstructured binary files (PDFs, Evidence Images, Reports).
*   **SQL (Generic):** Stores general application logs and events.

### 4. AI Context Layer
*   **Gemini 2.5 Flash:** Used for high-speed tasks (Policy Extraction, Vision Analysis, Tool Calling).
*   **Gemini 3 Pro:** Used for high-reasoning tasks (Chatbot, Complex Policy Q&A).
*   **Google Search:** Used for "Grounding" policy verification against real-world regulations.
*   **Guardrails:** Safety settings configured to block dangerous content.

## Data Flow Diagram
1.  **Upload:** User uploads file -> stored in GCS.
2.  **Ingest:** ADK Agent triggers Gemini -> Extracts Rules -> Saves to Spanner.
3.  **Index:** Vector embeddings generated -> Saved to MongoDB Atlas.
4.  **Analyze:** Evidence uploaded -> Gemini Vision compares against Spanner Rules -> Violations found.
5.  **Log:** Result object -> Streamed to BigQuery.
