# ADK Agent Workflow

The **Agent Development Kit (ADK)** Orchestrator manages the lifecycle of a compliance check.

## Workflow Steps

### 1. Policy Ingestion Agent
*   **Trigger:** User uploads PDF/Text.
*   **Action:**
    1.  Uploads raw file to Cloud Storage.
    2.  Calls Gemini 2.5 Flash with prompt: "Extract full text and key compliance rules."
    3.  Returns structured JSON `{ text: string, rules: string[] }`.
    4.  Saves metadata to Spanner.

### 2. RAG Training Agent
*   **Trigger:** User clicks "Train Policy Assistant".
*   **Action:**
    1.  Chunks policy content.
    2.  Generates embeddings (Simulated).
    3.  Stores in MongoDB Atlas Vector Index.
    4.  Updates `isIndexed` flag in Spanner.

### 3. Evidence Analysis Agent
*   **Trigger:** User uploads Image or Log.
*   **Action:**
    1.  Fetches active Policy Rules from Spanner.
    2.  Constructs Multimodal Prompt:
        *   Context: Active Rules.
        *   Input: Image Blob or Log Text.
        *   Instruction: "Compare input against rules. List violations."
    3.  Calls Gemini 2.5 Flash.
    4.  Parses response into `AnalysisResult`.
    5.  Streams result to BigQuery.

### 4. Chat/Q&A Agent
*   **Trigger:** User asks question in Chat Interface.
*   **Action:**
    1.  Retrieves relevant context from MongoDB Atlas (Simulated retrieval).
    2.  Constructs System Prompt with Policy Context + Rules.
    3.  Calls Gemini 3 Pro for reasoning.
    4.  Returns natural language answer.
