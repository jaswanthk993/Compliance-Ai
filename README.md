# **AI Compliance**

An AI-powered compliance assistant that helps organizations detect policy violations by analyzing documents, images, and logs. Built on **Google Cloud Run**, **Gemini**, and a **hybrid data architecture**, this tool automates compliance checks that typically take hours.

---

## **Overview**

Compliance teams spend a lot of time reading policies, scanning evidence, and preparing reports. This app brings all of that together into a single workflow:

1. Upload a **policy document** (PDF).
2. Upload **evidence** (image or logs).
3. The AI extracts rules, analyzes evidence, and compares them.
4. You receive a clear list of violations, risk score, and a downloadable report.

The goal is simple:
Make compliance audits faster, clearer, and more reliable using AI.

---

## **Key Features**

### **Policy Understanding**

* Upload PDFs and documents.
* Gemini extracts key rules, summaries, and structured text.
* Policy metadata stored for every session.

### **Evidence Analysis (Multimodal)**

* Upload images of equipment, people, or environments.
* Gemini Vision detects PPE, behaviors, or safety issues.
* CSV logs can be uploaded and summarized.

### **AI-Driven Compliance Checking**

* Extract policy rules → analyze evidence → generate violations.
* Clear risk scoring (Low / Medium / High).
* Suggested corrective actions.

### **RAG-Based Q&A**

Ask questions like:

> “Is this action allowed under Section 3.2?”
> The system pulls relevant text and answers with citations.

### **Reports & History**

* Auto-generated PDF reports.
* Downloadable from dashboard.
* Session history for previous checks.

### **Hybrid Storage Layer**

Uses managed cloud services to store and analyze all inputs:

* **Cloud Storage** → PDFs, images, and reports
* **Firestore** → rule metadata and session data
* **BigQuery** → logs and trend analytics

### **Cloud-Native Deployment**

* Fully deployed on **Google Cloud Run**
* Autoscaling backend
* Secure IAM roles
* Scheduled tasks (optional) for periodic re-evaluation

---

## **Architecture (High-Level)**

**Frontend**

* React interface for uploads, analysis, and reports
* Simple and clean dashboard
* Calls backend through secure API routes

**Backend (Cloud Run)**

* FastAPI or Node.js service
* Handles uploads, Gemini calls, ADK workflows
* Stores all results in GCS, Firestore, and BigQuery

**AI Layer (Gemini + ADK)**

* Gemini for multimodal vision + text
* Rule extraction from policy documents
* Violation detection from evidence
* RAG for question-answering
* ADK orchestrates the entire end-to-end flow

**Storage**

* GCS: raw files + final reports
* Firestore: extracted rules + sessions
* BigQuery: audit logs + analytics

  ![WhatsApp Image 2025-11-24 at 11 30 34 PM](https://github.com/user-attachments/assets/d62f7c16-a8d0-4113-972b-1fde121a6c7c)


---

## **Folder Structure**

```
root
│── frontend/               # React app (UI)
│── backend/                # Cloud Run API (FastAPI / Node backend)
│── services/               # AI services, ADK orchestration logic
│── cloud/                  # IAM, scheduler, deployment scripts
│── reports/                # Generated reports (optional local dir)
│── README.md               # Project documentation
│── package.json / reqs.txt # Dependencies
```

---

## **Getting Started**

### **1. Clone the repo**

```bash
git clone https://github.com/<your-repo>/ai-compliance-copilot.git
cd ai-compliance-copilot
```

### **2. Install frontend dependencies**

```bash
cd frontend
npm install
npm run dev
```

### **3. Backend setup**

Ensure you have:

* GCP project
* Cloud Run
* Service account with required roles
* Gemini access enabled

Add environment variables or use Secret Manager.

### **4. Deploy to Cloud Run**

Use your deploy script:

```bash
gcloud builds submit --tag gcr.io/<PROJECT_ID>/compliance-copilot
gcloud run deploy compliance-copilot --image gcr.io/<PROJECT_ID>/compliance-copilot
```

---

## **Tech Stack**

* **React** – Dashboard UI
* **FastAPI / Node.js** – Backend service
* **Google Cloud Run** – Serverless compute
* **Google Cloud Storage** – File storage
* **Firestore** – Metadata storage
* **BigQuery** – Analytics
* **Gemini (Vertex AI)** – Multimodal intelligence
* **ADK** – Agent orchestration

---

## **Why This Project Matters**

Most compliance audits are slow, manual, and prone to error.
This project shows how modern AI, combined with serverless cloud architecture, can automate real compliance work in factories, healthcare, retail, and finance.

It gives users an assistant that:

* Reads their rulebook
* Looks at their evidence
* Gives them actionable feedback

All within seconds.

---

## **Future Scope**

* [ ] Add real-time CCTV compliance stream
* [ ] Add multi-user roles (Supervisor, Admin)
* [ ] Add multilingual policy support
* [ ] Add Slack/Email alerting
* [ ] Expand analytics dashboard

---

## **Contributing**

Pull requests are welcome. Feel free to open issues for feature ideas or improvement.

Just tell me which one you want.
