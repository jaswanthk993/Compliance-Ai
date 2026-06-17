# AI Compliance Copilot

## 🚀 Overview
AI Compliance Copilot is a Cloud Run-ready, multimodal compliance agent that automates safety audits. It uses **Google Gemini 2.5** to analyze policy documents (PDF/Text) and evidence (Images/Logs) to detect violations, calculate risk scores, and generate audit reports.

## 🏗️ Architecture & Structure

This repository represents the **Frontend & Simulation Layer** of the AI Compliance Copilot.
While running in "Demo Mode", the backend logic is simulated in `services/agentSystem.ts` to allow immediate testing without deploying the full Python stack.

### 📂 Project Structure Map

| Production Component (Target) | Current Implementation (Demo) | Description |
|-----------------------------|-----------------------------|-------------|
| `frontend/src/*` | `components/*` | React UI Dashboard & Tools |
| `backend/main.py` | `services/agentSystem.ts` | Orchestrator & API Logic |
| `backend/adk/agent.py` | `ADKOrchestrator` Object | Main ADK Workflow Logic |
| `backend/services/firestore.py` | `SpannerSim` Class | Simulated Metadata Store |
| `backend/services/bigquery.py` | `BigQuerySim` Class | Simulated Analytics Store |
| `backend/services/gemini.py` | `GoogleGenAI` Client | Direct AI Calls via SDK |

## 🛠️ Tech Stack

*   **Frontend:** React, Tailwind CSS, Lucide Icons, Recharts
*   **AI:** Google Gemini 2.5 Flash & Pro (Multimodal)
*   **Infrastructure (Simulated):**
    *   **Compute:** Google Cloud Run
    *   **Database:** Cloud Spanner (Policies) + MongoDB Atlas (Vector)
    *   **Analytics:** BigQuery (Audit Logs)
    *   **Storage:** Cloud Storage (Files)

## ⚡ Quick Start (Demo)

1.  **Ingest Policies:** Go to "Policy Management" and upload a PDF or use "Load Defaults".
2.  **Verify Compliance:** Click "Verify with Search" to use Google Search Grounding.
3.  **Train Agent:** Click "Train Policy Assistant" to index the policy for RAG.
4.  **Analyze Evidence:** Go to "Evidence Analysis", upload an image or log, and run the agent.
5.  **View Reports:** Check "Reports" to see the BigQuery audit log history.

## 📦 Deployment (Production)

To deploy the full architecture:

1.  Run `./setup_gcp.sh` to provision resources.
2.  Build the container: `gcloud builds submit --config cloudbuild.yaml .`
3.  Deploy to Cloud Run: `gcloud run deploy ...`

See `docs/architecture.md` for full details.
