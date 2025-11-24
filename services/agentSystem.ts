
import { GoogleGenAI, Type } from "@google/genai";
import { Policy, AnalysisResult, RiskLevel, MCPContext, MCPAgentResponse, KnowledgeBaseTool, SystemHealth } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME_FAST = "gemini-2.5-flash";
const MODEL_NAME_REASONING = "gemini-3-pro-preview"; // For Chatbot

// --- Demo Data ---
const DEMO_POLICIES: Policy[] = [
  {
    id: 'pol-mfg-001',
    title: 'Manufacturing Safety Protocols (OSHA)',
    industry: 'Manufacturing',
    lastUpdated: new Date().toISOString(),
    isIndexed: true,
    content: `MANUFACTURING SITE SAFETY STANDARD v4.2
    
    1. PERSONAL PROTECTIVE EQUIPMENT (PPE)
    All personnel entering the production floor (Zone A & B) must wear:
    - ANSI Z89.1 compliant industrial hard hats.
    - Steel-toed safety boots.
    - High-visibility vests (Class 2).
    - Safety glasses with side shields.
    
    2. MACHINERY OPERATION
    - Only certified operators may use forklifts. 
    - Lockout/Tagout (LOTO) procedures must be followed during maintenance.
    - Machine guards must never be bypassed.
    
    3. HAZARD REPORTING
    - Any oil spills must be cleaned within 15 minutes.
    - Blocked fire exits result in immediate suspension.`,
    rules: [
      "Hard hats and steel-toed boots are mandatory in production zones.",
      "High-visibility vests are required at all times.",
      "Only certified staff can operate forklifts.",
      "LOTO procedures apply to all maintenance tasks.",
      "Fire exits must remain unobstructed."
    ]
  },
  {
    id: 'pol-health-002',
    title: 'Hospital Infection Control (HIPAA/JCI)',
    industry: 'Healthcare',
    lastUpdated: new Date().toISOString(),
    isIndexed: true,
    content: `CLINICAL HYGIENE & PATIENT SAFETY
    
    1. STERILE FIELD
    - Staff must perform surgical hand scrub for 3 minutes before procedures.
    - Sterile gloves and gowns are required for all invasive actions.
    - Unattended sterile fields are considered contaminated.
    
    2. MEDICATION HANDLING
    - Triple-check verification (Patient ID, Drug, Dosage) is mandatory.
    - Narcotics cabinet must be double-locked.
    
    3. WASTE DISPOSAL
    - Sharps must go immediately into red biohazard bins.
    - Bins must be sealed when 3/4 full.`,
    rules: [
      "Perform 3-minute surgical scrub before procedures.",
      "Sterile gloves/gowns mandatory for invasive tasks.",
      "Verify Patient ID, Drug, and Dosage (Triple-Check).",
      "Sharps must be disposed of in red biohazard bins immediately.",
      "Narcotics must be kept double-locked."
    ]
  },
  {
    id: 'pol-fin-003',
    title: 'Global AML & KYC Compliance',
    industry: 'Finance',
    lastUpdated: new Date().toISOString(),
    isIndexed: true,
    content: `ANTI-MONEY LAUNDERING (AML) & KYC POLICY
    
    1. CUSTOMER IDENTIFICATION
    - Government-issued photo ID required for all new accounts.
    - Ultimate Beneficial Owner (UBO) must be identified for corporate accounts.
    
    2. TRANSACTION MONITORING
    - Cash transactions over $10,000 must be reported (CTR).
    - International transfers to high-risk jurisdictions require Enhanced Due Diligence (EDD).
    - Structuring deposits to avoid thresholds is prohibited.`,
    rules: [
      "Photo ID required for all new account openings.",
      "Identify UBO for all corporate accounts.",
      "Report cash transactions exceeding $10,000.",
      "Perform EDD for high-risk jurisdiction transfers.",
      "Flag potential structuring of deposits."
    ]
  },
  {
    id: 'pol-retail-004',
    title: 'Food Safety & Store Hygiene',
    industry: 'Retail',
    lastUpdated: new Date().toISOString(),
    isIndexed: true,
    content: `RETAIL FOOD SAFETY SOP
    
    1. TEMPERATURE CONTROL
    - Refrigeration units must be maintained between 1°C and 4°C.
    - Freezer units must be below -18°C.
    - Temperature logs must be updated every 4 hours.
    
    2. STAFF HYGIENE
    - Hairnets and clean aprons are mandatory in food prep areas.
    - Hands must be washed every 30 minutes.
    - No jewelry allowed on hands/wrists.`,
    rules: [
      "Fridge temp must be 1°C - 4°C.",
      "Freezer temp must be below -18°C.",
      "Update temperature logs every 4 hours.",
      "Hairnets and aprons mandatory in prep areas.",
      "No jewelry allowed; wash hands every 30 mins."
    ]
  },
  {
    id: 'pol-log-005',
    title: 'Warehouse & Dock Loading Safety',
    industry: 'Logistics',
    lastUpdated: new Date().toISOString(),
    isIndexed: true,
    content: `LOGISTICS DOCK SAFETY PROTOCOLS
    
    1. VEHICLE DOCKING
    - Wheel chocks must be set before loading begins.
    - Drivers must wait in the designated safe zone, not in the cab.
    - Trailer jack stands required for uncoupled trailers.
    
    2. LOAD SECURING
    - Loads must be shrink-wrapped and strapped.
    - heavier pallets must be placed at the bottom.`,
    rules: [
      "Wheel chocks mandatory before loading.",
      "Drivers must exit cab to safe zone.",
      "Jack stands required for uncoupled trailers.",
      "All loads must be shrink-wrapped and strapped."
    ]
  },
  {
    id: 'pol-cons-006',
    title: 'Construction Site Safety & Fall Protection',
    industry: 'Construction',
    lastUpdated: new Date().toISOString(),
    isIndexed: true,
    content: `CONSTRUCTION SAFETY & FALL PROTECTION STANDARD
    
    1. FALL PROTECTION
    - Fall protection (harness/railings) required for any work above 6 feet.
    - All floor holes must be covered and labeled 'HOLE'.
    
    2. SCAFFOLDING
    - Scaffolds must be inspected daily by a competent person.
    - Wheels must be locked when in use.
    - No debris accumulation allowed on platforms.
    
    3. PERSONAL PROTECTIVE EQUIPMENT
    - Hard hats required at all times.
    - Safety glasses required when cutting/grinding.`,
    rules: [
      "Fall protection mandatory for work above 6 feet.",
      "Floor holes must be covered and labeled.",
      "Daily scaffold inspection by competent person required.",
      "Scaffold wheels must be locked during use.",
      "Hard hats and safety glasses required."
    ]
  },
  {
    id: 'pol-tech-007',
    title: 'IT Security & Data Protection (ISO 27001)',
    industry: 'Technology',
    lastUpdated: new Date().toISOString(),
    isIndexed: true,
    content: `INFORMATION SECURITY POLICY
    
    1. ACCESS CONTROL
    - Multi-Factor Authentication (MFA) required for all internal systems.
    - Passwords must be 12+ characters and rotated every 90 days.
    - Workstations must lock automatically after 5 minutes of inactivity.
    
    2. DATA PROTECTION
    - Customer data must be encrypted at rest (AES-256) and in transit (TLS 1.2+).
    - No sensitive data allowed on personal USB drives.
    
    3. INCIDENT RESPONSE
    - Suspected breaches must be reported to SecOps within 1 hour.`,
    rules: [
      "MFA required for all system access.",
      "Passwords: 12+ chars, 90-day rotation.",
      "Workstations auto-lock after 5 mins.",
      "Data must be encrypted at rest and in transit.",
      "Report breaches to SecOps within 1 hour."
    ]
  },
  {
    id: 'pol-energy-008',
    title: 'Hazardous Area & Hot Work Standards',
    industry: 'Energy',
    lastUpdated: new Date().toISOString(),
    isIndexed: true,
    content: `ENERGY SECTOR SAFETY PROTOCOLS
    
    1. HOT WORK PERMITS
    - A valid Hot Work Permit is required for welding/cutting in restricted zones.
    - Fire watch must remain on station for 30 minutes post-work.
    
    2. HAZARDOUS ATMOSPHERES
    - Gas testing required before entering confined spaces (O2, LEL, H2S).
    - Personal H2S monitors required in Zone 1.
    
    3. PPE STANDARDS
    - Flame Resistant Clothing (FRC) required in all process areas.
    - Hearing protection required in areas >85dB.`,
    rules: [
      "Hot Work Permit required for welding/cutting.",
      "Fire watch required for 30 mins post-work.",
      "Gas testing mandatory for confined spaces.",
      "Personal H2S monitors required in Zone 1.",
      "FRC clothing mandatory in process areas."
    ]
  }
];

// --- 1. Infrastructure Simulation (Hybrid Storage Architecture) ---

// 1. Cloud Storage: Unstructured Data (Files, Images)
class CloudStorageSim {
  private static files: Map<string, string> = new Map();
  static async upload(filename: string, data: string): Promise<string> {
    console.log(`[GCS] Uploading object: gs://compliance-bucket/${filename}`);
    this.files.set(filename, data);
    return `https://storage.googleapis.com/compliance-bucket/${filename}`;
  }
  static getCount() { return this.files.size; }
}

// 2. Cloud Spanner: Transactional Metadata (Policies, Rules)
// Replaces Firestore for high-consistency relational needs as per arch.
class SpannerSim {
  private static table = 'Spanner_Policies';
  static async getAll(): Promise<Policy[]> {
    const data = localStorage.getItem(this.table);
    return data ? JSON.parse(data) : [];
  }
  static async save(policy: Policy): Promise<boolean> {
    const policies = await this.getAll();
    const index = policies.findIndex(p => p.id === policy.id);
    if (index >= 0) policies[index] = policy;
    else policies.unshift(policy);
    localStorage.setItem(this.table, JSON.stringify(policies));
    console.log(`[Spanner] Transaction committed: policies/${policy.id}`);
    return true;
  }
  static async delete(id: string): Promise<boolean> {
    const policies = await this.getAll();
    const filtered = policies.filter(p => p.id !== id);
    localStorage.setItem(this.table, JSON.stringify(filtered));
    console.log(`[Spanner] Record deleted: policies/${id}`);
    return true;
  }
  static getRowCount() { 
     const data = localStorage.getItem(this.table);
     return data ? JSON.parse(data).length : 0;
  }
}

// 3. MongoDB Atlas: Vector Search & Embeddings
// Dedicated to the "Context Layer" for RAG.
class MongoDBSim {
  private static collection = 'Atlas_Vector_Index';
  static async indexPolicy(policyId: string, content: string): Promise<void> {
    console.log(`[MongoDB Atlas] Generating vector embeddings for policy:${policyId}`);
    // Simulate vector storage
    const current = parseInt(localStorage.getItem(this.collection) || '0');
    localStorage.setItem(this.collection, (current + 1).toString());
  }
  static getVectorCount() {
    return parseInt(localStorage.getItem(this.collection) || '0');
  }
}

// 4. SQL (Generic): Other Relational Data
// Supports general application data needs outside of Spanner's critical path.
class SqlGenericSim {
    private static table = 'Sql_Generic_Data';
    static async logEvent(event: string) {
        console.log(`[SQL Generic] Inserting event row: ${event}`);
        const current = parseInt(localStorage.getItem(this.table) || '0');
        localStorage.setItem(this.table, (current + 1).toString());
    }
    static getRowCount() {
        return parseInt(localStorage.getItem(this.table) || '0');
    }
}

// 5. BigQuery: Analytics & Logs
class BigQuerySim {
  private static logs: AnalysisResult[] = [];
  static async insertRow(row: AnalysisResult) {
    console.log(`[BigQuery] Streaming insert into table: dataset.compliance_logs`, row);
    this.logs.unshift(row);
  }
  static async query(): Promise<AnalysisResult[]> {
    return this.logs;
  }
  static getRowCount() { return this.logs.length; }
}

class SystemMonitor {
  static getHealth(): SystemHealth {
    return {
      status: 'healthy',
      latency: Math.floor(Math.random() * 50) + 120, // Simulated ms
      activeJobs: Math.floor(Math.random() * 3),
      storageUsage: {
        spannerRows: SpannerSim.getRowCount(),
        mongoVectors: MongoDBSim.getVectorCount(),
        gcsObjects: CloudStorageSim.getCount(),
        bigQueryRows: BigQuerySim.getRowCount(),
        sqlRows: SqlGenericSim.getRowCount()
      },
      uptime: 99.99
    };
  }
}

// --- 2. MCP Toolbox & ADK Orchestrator ---

export const ADKOrchestrator = {
  
  // Endpoint: POST /ingest/policy
  async ingestPolicy(fileBase64: string, mimeType: string, filename: string): Promise<MCPAgentResponse<{ text: string; rules: string[] }>> {
    const startTime = Date.now();
    try {
      console.log(`[Cloud Run] POST /ingest/policy - Processing ${filename}`);
      
      // Step 1: Upload to Cloud Storage (Unstructured)
      const gcsUri = await CloudStorageSim.upload(`policies/${filename}`, fileBase64);
      
      // Log audit event to SQL (Generic)
      await SqlGenericSim.logEvent(`Ingest Policy: ${filename}`);

      // Step 2: Gemini Analysis (MCP Tool Call)
      const parts: any[] = [];
      if (mimeType === 'text/plain') {
          const text = atob(fileBase64);
          parts.push({ text: `DOCUMENT CONTENT:\n${text}` });
      } else {
          parts.push({ inlineData: { mimeType: mimeType, data: fileBase64 } });
      }
      parts.push({ text: "You are a Policy Ingestion Agent. Read this document. 1. Extract the full text content accurately. 2. Extract a list of key compliance rules. Return as JSON." });

      const response = await ai.models.generateContent({
        model: MODEL_NAME_FAST,
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              textContent: { type: Type.STRING },
              rules: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          safetySettings: [
             { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
          ]
        }
      });

      const result = JSON.parse(response.text || "{}");
      
      return {
        success: true,
        data: {
          text: result.textContent || "No text extracted.",
          rules: result.rules || []
        },
        metadata: { model: MODEL_NAME_FAST, latencyMs: Date.now() - startTime }
      };
    } catch (error) {
      console.error("Policy Ingestion Failed:", error);
      return { success: false, message: "Ingestion failed." };
    }
  },

  // Endpoint: POST /policies/verify (Google Search Grounding)
  async verifyPolicy(policyText: string): Promise<MCPAgentResponse<{ summary: string; sources: { title: string; uri: string }[] }>> {
    const startTime = Date.now();
    try {
        console.log(`[Cloud Run] POST /policies/verify - Checking compliance against web`);
        const response = await ai.models.generateContent({
            model: MODEL_NAME_FAST, // Use Flash for tool calling
            contents: `Verify this policy content against current regulations (like OSHA, HIPAA, GDPR, etc.) and general industry standards.
            Point out outdated rules or suggest missing compliance requirements.
            
            Policy Content:
            ${policyText}`,
            config: {
                tools: [{ googleSearch: {} }] // Enable Google Search
            }
        });

        const summary = response.text || "No verification insights found.";
        
        // Extract grounding sources
        // @ts-ignore
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = chunks
            .map((c: any) => c.web)
            .filter((w: any) => w)
            .map((w: any) => ({ title: w.title, uri: w.uri }));

        return { 
            success: true, 
            data: { summary, sources },
            metadata: { model: MODEL_NAME_FAST, latencyMs: Date.now() - startTime }
        };

    } catch (error) {
        console.error("Policy Verification Failed:", error);
        return { success: false, message: "Verification failed." };
    }
  },

  // Endpoint: POST /policies/save
  async savePolicy(policy: Policy): Promise<MCPAgentResponse<boolean>> {
    try {
      // Save metadata to Cloud Spanner (Transactional)
      await SpannerSim.save(policy);
      await SqlGenericSim.logEvent(`Update Policy: ${policy.id}`);
      return { success: true, data: true };
    } catch (error) {
      return { success: false, message: "Spanner commit failed." };
    }
  },

  // Endpoint: POST /policies/list
  async getLibrary(): Promise<MCPAgentResponse<Policy[]>> {
    try {
      const policies = await SpannerSim.getAll();
      return { success: true, data: policies };
    } catch (error) {
      return { success: false, message: "Fetch failed." };
    }
  },

  // Endpoint: POST /admin/load_defaults
  async loadDemoPolicies(): Promise<MCPAgentResponse<boolean>> {
      console.log(`[ADK Orchestrator] Loading mandatory demo policies...`);
      for (const policy of DEMO_POLICIES) {
          await SpannerSim.save(policy);
          // Auto-index them in MongoDB Sim too
          await MongoDBSim.indexPolicy(policy.id, policy.content);
      }
      return { success: true, data: true };
  },

  // Endpoint: DELETE /policies/:id
  async archivePolicy(id: string): Promise<MCPAgentResponse<boolean>> {
    try {
      await SpannerSim.delete(id);
      await SqlGenericSim.logEvent(`Delete Policy: ${id}`);
      return { success: true, data: true };
    } catch (error) {
      return { success: false, message: "Delete failed." };
    }
  },

  // Endpoint: POST /router/dispatch (ADK Router)
  async routeRequest(requestType: 'policy' | 'evidence', payload: any): Promise<void> {
      console.log(`[ADK Router] Routing request type: ${requestType}`);
  },

  // Endpoint: POST /jobs/trigger
  async triggerBatchJob(): Promise<void> {
      console.log(`[Cloud Scheduler] Triggering 'Nightly_Risk_Eval_Job'`);
      console.log(`[Cloud Run Job] Starting batch analysis of pending logs...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`[BigQuery] Updating risk trends table...`);
      await SqlGenericSim.logEvent('Batch Job Complete');
  },

  // Endpoint: POST /analyze
  async analyzeEvidence(
    context: MCPContext, 
    evidence: { type: 'image' | 'log', data: string, filename?: string }
  ): Promise<MCPAgentResponse<AnalysisResult>> {
    const startTime = Date.now();
    if (!context.activePolicy) return { success: false, message: "No active policy context." };

    try {
      console.log(`[Cloud Run] POST /analyze - Processing ${evidence.type} evidence`);
      
      // Step 1: Upload Evidence to Cloud Storage
      const gcsPath = evidence.filename ? `evidence/${evidence.filename}` : `evidence/${Date.now()}_${evidence.type}.dat`;
      await CloudStorageSim.upload(gcsPath, evidence.data.substring(0, 50) + "...");

      // Step 2: Gemini Analysis (AI Layer)
      const parts: any[] = [];
      let prompt = `Role: Compliance Officer Agent.\nTask: Analyze evidence against policy rules.\n\nPolicy Rules:\n`;
      context.activePolicy.rules.forEach((r, i) => prompt += `${i+1}. ${r}\n`);
      parts.push({ text: prompt });

      if (evidence.type === 'image') {
        parts.push({ inlineData: { mimeType: "image/jpeg", data: evidence.data } });
        parts.push({ text: "Detect safety violations in this image based strictly on the rules above." });
      } else {
        parts.push({ text: `Analyze the following LOG DATA for violations:\n\n${evidence.data}\n\nCheck dates, values, and procedures against the rules.` });
      }

      const response = await ai.models.generateContent({
        model: MODEL_NAME_FAST,
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallRisk: { type: Type.STRING, enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL] },
              score: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              violations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    description: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL] },
                    recommendation: { type: Type.STRING }
                  }
                }
              }
            }
          },
          safetySettings: [
             { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
          ]
        }
      });

      const result = JSON.parse(response.text || "{}");
      
      const analysisResult: AnalysisResult = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        evidenceName: evidence.type === 'image' ? "Image Evidence" : "Log/Text Evidence",
        evidenceType: evidence.type,
        overallRisk: result.overallRisk || RiskLevel.LOW,
        score: result.score || 100,
        violations: result.violations || [],
        summary: result.summary || "No anomalies detected."
      };

      // Step 3: Insert into BigQuery (Analytics Layer)
      await BigQuerySim.insertRow(analysisResult);

      return { 
          success: true, 
          data: analysisResult, 
          metadata: { model: MODEL_NAME_FAST, latencyMs: Date.now() - startTime } 
      };

    } catch (error) {
      console.error("Compliance Agent Error", error);
      return { success: false, message: "Agent failed to analyze evidence." };
    }
  },

  // Endpoint: POST /rag/train
  async trainRagAgent(policy: Policy): Promise<MCPAgentResponse<boolean>> {
    console.log(`[Cloud Run] POST /rag/train - Indexing policy ${policy.id}`);
    
    // 1. Index in MongoDB Atlas (Vector Search)
    await MongoDBSim.indexPolicy(policy.id, policy.content);
    
    // 2. Update Status in Spanner
    const updatedPolicy = { ...policy, isIndexed: true };
    await SpannerSim.save(updatedPolicy);
    
    return { success: true, data: true, message: "Policy indexed into vector store." };
  },

  // Endpoint: POST /rag/query
  async queryRag(history: { role: string; parts: { text: string }[] }[], question: string, context: MCPContext): Promise<string> {
    if (!context.activePolicy?.isIndexed) return "⚠️ This policy hasn't been trained yet.";

    const systemInstruction = `You are a specialized Compliance RAG Agent.
    Use the provided Model Context Protocol (MCP) data to answer the user's question.
    MCP Context - Active Policy: "${context.activePolicy.title}"
    Industry: ${context.activePolicy.industry || 'General'}
    Content: ${context.activePolicy.content}
    Rules: ${context.activePolicy.rules.join('\n')}
    Answer strictly based on the context.`;

    try {
      // Use Gemini 3 Pro for superior reasoning in chat
      const chat = ai.chats.create({
        model: MODEL_NAME_REASONING, 
        config: { systemInstruction },
        history: history
      });
      const result = await chat.sendMessage({ message: question });
      return result.text;
    } catch (e) {
      return "Error contacting RAG Agent.";
    }
  },

  // Endpoint: GET /monitor/health
  getSystemHealth(): SystemHealth {
    return SystemMonitor.getHealth();
  },

  // Endpoint: GET /reports/history
  async getAuditHistory(): Promise<AnalysisResult[]> {
    return BigQuerySim.query();
  }
};
