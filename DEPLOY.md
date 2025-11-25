
# Deployment Guide: AI Compliance Copilot

## Prerequisites
- Google Cloud CLI (`gcloud`) installed and authenticated.
- A Google Cloud Project created.

## 1. Run Infrastructure Setup
Use the provided script to enable APIs, create databases, storage buckets, and IAM roles.

```bash
chmod +x setup_gcp.sh
./setup_gcp.sh YOUR_PROJECT_ID us-central1
```

## 2. Configure Secrets
Add your Gemini API Key to Secret Manager (best practice) or ensure it is available in your build environment.

```bash
echo -n "YOUR_GEMINI_KEY" | gcloud secrets create GEMINI_API_KEY --data-file=-
```

## 3. Deploy Application
Run the build pipeline to containerize the React app and deploy it to Cloud Run.

```bash
gcloud builds submit --config cloudbuild.yaml .
```

## 4. Verify Architecture
Once deployed, the app will simulate the backend logic using:
- **Cloud Run**: Hosting the application.
- **BigQuery**: `compliance_logs` dataset.
- **Cloud Storage**: `[project-id]-compliance-data` bucket.
- **Firestore**: Native database instance.
