
import { GoogleGenAI, Type } from "@google/genai";
import { Policy, AnalysisResult, RiskLevel, MCPContext, MCPAgentResponse, SystemHealth } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME_FAST = "gemini-3-flash-preview";
const MODEL_NAME_REASONING = "gemini-3-pro-preview";

// --- Infrastructure Simulation ---

const getSeededPolicies = (): Policy[] => [
  {
    id: "seed-mfg-1",
    title: "Heavy Machinery Operation & Safety SOP",
    industry: "Manufacturing",
    content: "1. All operators must wear Class 2 high-visibility vests.\n2. Steel-toed boots are mandatory on the factory floor.\n3. Machines must be fully powered down and locked out before maintenance.\n4. Eye protection is required within 15 feet of active metalworking.",
    rules: [
      "Operators must wear Class 2 high-visibility vests.",
      "Steel-toed boots are mandatory.",
      "Machines must undergo lockout/tagout (LOTO) before maintenance.",
      "Eye protection is required near metalworking."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 5).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-health-1",
    title: "HIPAA Data Handling & Privacy Guidelines",
    industry: "Healthcare",
    content: "1. Patient records must never be left completely unattended on physical desks.\n2. Electronic health records (EHR) must automatically lock after 5 minutes of inactivity.\n3. PHI data transfers must use TLS 1.3 encryption.\n4. Discussions regarding patients must be held in secure, sound-isolated rooms.",
    rules: [
      "Patient records cannot be left unattended.",
      "EHR systems require a 5-minute inactivity lock.",
      "PHI data transfers must use TLS 1.3.",
      "Patient discussions require secure, isolated rooms."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 12).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-fin-1",
    title: "AML & KYC Verification Standards",
    industry: "Finance",
    content: "1. Identity verification must complete within 24 hours of account creation.\n2. Transactions exceeding $10,000 USD require secondary managerial approval.\n3. Any suspicious wire transfers must be flagged and reported to FinCEN within 7 days.\n4. Biometric or 2FA authentication is required for all staff accessing the main ledger.",
    rules: [
      "Identity verification within 24 hours.",
      "Transactions >$10k need secondary approval.",
      "Suspicious wires reported to FinCEN within 7 days.",
      "Staff must use 2FA or biometrics for ledger access."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 2).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-const-1",
    title: "Scaffolding & Aerial Lift Protocol",
    industry: "Construction",
    content: "1. Scaffolding must be inspected by a competent person daily before use.\n2. Personal fall arrest systems (PFAS) are required above 6 feet.\n3. Base plates and mudsills are required on all scaffold legs.\n4. Aerial lifts must not be moved while the bucket is elevated.",
    rules: [
      "Daily scaffolding inspection by competent person.",
      "PFAS required above 6 feet.",
      "Base plates and mudsills on all legs.",
      "Aerial lifts cannot move when bucket elevated."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 15).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-ret-1",
    title: "Cash Handling & Store Closing Policy",
    industry: "Retail",
    content: "1. Registers must be counted by two employees at the end of the shift.\n2. Deposits exceeding $2000 must be transported via secure carrier.\n3. Safe drops must be performed whenever drawer cash exceeds $1000.\n4. Employees must verify store exit doors are locked before counting cash.",
    rules: [
      "Registers counted by two employees.",
      "Deposits >$2000 need secure carrier.",
      "Safe drops performed at $1000 drawer limit.",
      "Doors must be locked during cash counting."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 7).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-log-1",
    title: "Cold Chain Transport & Handling",
    industry: "Logistics",
    content: "1. Refrigerated trailers must maintain an internal temperature of -4°F to 32°F depending on cargo.\n2. Temperature logs must be verified at origin and destination.\n3. Trailer doors must not be open for more than 15 minutes during unloading.\n4. Any temperature deviations must be reported to the supply chain manager immediately.",
    rules: [
      "Trailers must maintain appropriate cold chain temp.",
      "Temperature logs verified at origin/destination.",
      "Doors open <15 minutes during unloading.",
      "Temperature deviations reported immediately."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 4).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-tech-1",
    title: "Production Infrastructure Access Policy",
    industry: "Technology",
    content: "1. Production SSH access is prohibited without a temporary break-glass token.\n2. All configuration changes must be reviewed by least one peer via Pull Request.\n3. Access to customer PII databases requires VPN and hardware security key.\n4. Security patches for critical CVEs must be applied within 48 hours.",
    rules: [
      "No production SSH without break-glass token.",
      "All config changes need peer review.",
      "PII database access requires VPN and hardware key.",
      "Critical CVE patches within 48 hours."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 1).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-nrg-1",
    title: "High-Voltage Substation Area Rules",
    industry: "Energy",
    content: "1. Minimum approach distances (MAD) must be completely strictly maintained around energized lines.\n2. Flame-resistant (FR) clothing is required within the perimeter.\n3. Substation gates must remain locked at all times when not actively transiting.\n4. Insulated tools must be inspected for micro-fractures before use.",
    rules: [
      "Minimum approach distances must be maintained.",
      "Flame-resistant clothing inside perimeter.",
      "Gates locked at all times.",
      "Insulated tools inspected for micro-fractures before use."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 20).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-it-1",
    title: "Data Backup & Disaster Recovery Framework",
    industry: "Technology",
    content: "1. Critical production databases must be backed up incrementally every hour and fully every 24 hours.\n2. Backups must be stored in at least two geographically distinct data centers (multi-region).\n3. Restoration drills must be successfully conducted and documented at least quarterly.\n4. All backup archives must be encrypted using AES-256 at rest.",
    rules: [
      "Incremental hourly backups and full daily backups for critical DBs.",
      "Multi-region geographical redundancy for backup storage.",
      "Quarterly restoration drills must be documented.",
      "AES-256 encryption for all backup archives."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 2).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-it-2",
    title: "Endpoint Security & BYOD Policy",
    industry: "Technology",
    content: "1. All employee devices accessing corporate networks must have Mobile Device Management (MDM) installed.\n2. Full disk encryption (FileVault/BitLocker) is mandatory on all laptops.\n3. USB mass storage devices are strictly blocked from mounting on corporate workstations.\n4. Operating systems must not be jailbroken or rooted.",
    rules: [
      "MDM installation required for network access.",
      "Full disk encryption is mandatory on all laptops.",
      "USB mass storage devices are blocked.",
      "Jailbroken or rooted OSes are prohibited."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 8).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-it-3",
    title: "Access Control & Identity Management",
    industry: "Technology",
    content: "1. Passwords must be at least 16 characters and rotated only upon suspected compromise.\n2. System access must follow the Principle of Least Privilege (PoLP).\n3. Offboarding employees must have all authentication credentials revoked within 1 hour of termination.\n4. Shared generic accounts (e.g., 'admin' or 'root') are strictly prohibited for interactive login.",
    rules: [
      "Passwords 16+ characters, rotated upon compromise.",
      "Strict enforcement of the Principle of Least Privilege.",
      "Immediate credential revocation upon offboarding (< 1 hr).",
      "Interactive login with shared generic accounts is prohibited."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 14).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-it-4",
    title: "Clean Desk & Screen Lock Policy",
    industry: "Technology",
    content: "1. Workstations must be placed into a locked state immediately upon leaving the desk.\n2. Physical documents containing PII or proprietary code must be locked in drawers when not in use.\n3. Whiteboards in communal areas must be erased of sensitive architecture diagrams at the end of meetings.\n4. Post-it notes containing passwords or sensitive IPs are strictly forbidden.",
    rules: [
      "Screen lock activated immediately when leaving desk.",
      "Physical sensitive documents locked away when not in use.",
      "Communal whiteboards erased after use.",
      "No passwords or IPs written on physical notes."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 30).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-health-2",
    title: "FDA Pharmaceutical & Medical Device Regulations",
    industry: "Healthcare",
    content: "1. All medical devices must have active FDA clearance (510k or PMA) prior to market distribution.\n2. Pharmaceutical manufacturing must adhere strictly to Current Good Manufacturing Practice (cGMP).\n3. Any adverse events must be reported to the FDA MedWatch program within 15 days.\n4. Device labeling must include proper Unique Device Identification (UDI) barcodes.",
    rules: [
      "Medical devices must have FDA clearance.",
      "Pharmaceuticals must adhere to cGMP.",
      "Adverse events must be reported within 15 days.",
      "Device labeling must include UDI barcodes."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 45).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-fin-2",
    title: "SOX Corporate Financial Disclosure",
    industry: "Finance",
    content: "1. The CEO and CFO must certify the accuracy of financial reports.\n2. All financial records must be retained for a minimum of 7 years.\n3. Internal controls regarding financial reporting must be assessed annually.\n4. Alteration or falsification of financial documents is subject to criminal penalties.",
    rules: [
      "CEO and CFO must certify financial reports.",
      "Keep financial records for 7 years.",
      "Annual assessment of internal financial controls.",
      "No alteration or falsification of financial documents."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 60).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-fin-3",
    title: "PCI DSS Secure Card Payment Processing",
    industry: "Finance",
    content: "1. Primary Account Numbers (PAN) must never be stored in plain text.\n2. All Cardholder Data Environment (CDE) components must reside behind a properly configured firewall.\n3. Anti-virus software must be active and updated regularly on all systems interacting with CDE.\n4. Default vendor passwords on network hardware must be changed immediately upon installation.",
    rules: [
      "PANs must not be stored in plain text.",
      "CDE components must be behind a firewall.",
      "Anti-virus active on systems interacting with CDE.",
      "Default vendor passwords must be changed."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 18).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-tech-2",
    title: "GDPR Data Protection & Privacy",
    industry: "Technology",
    content: "1. Users must provide explicit consent before any PII data collection.\n2. Systems must support the Right to Erasure, allowing full deletion of a user's data upon request.\n3. In the event of a data breach, the supervisory authority must be notified within 72 hours.\n4. A Data Protection Officer (DPO) must be appointed for large-scale data processing.",
    rules: [
      "Explicit consent required for PII collection.",
      "Systems must support the Right to Erasure.",
      "Data breaches reported within 72 hours.",
      "Appoint a DPO for large-scale processing."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 95).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-tech-3",
    title: "ISO 27001 Information Security Management",
    industry: "Technology",
    content: "1. An organizational Information Security Policy must be published and communicated to all employees.\n2. Information assets must be inventoried and assigned an owner.\n3. Cryptographic controls must enforce data protection at rest and in transit.\n4. Regular vulnerability assessments and penetration testing must be conducted annually.",
    rules: [
      "Publish an Information Security Policy.",
      "Inventory assets and assign an owner.",
      "Use cryptographic controls for data protection.",
      "Conduct annual vulnerability assessments and pentesting."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 110).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-mfg-2",
    title: "OSHA Safe Working Conditions",
    industry: "Manufacturing",
    content: "1. Hazard communication programs must be maintained, detailing all hazardous chemicals.\n2. Fall protection systems are required for workers operating 4 feet or higher.\n3. Noise exposure above 85 decibels sustained for 8 hours requires hearing protection.\n4. Emergency exit routes must remain unblocked and clearly illuminated at all times.",
    rules: [
      "Maintain hazard communication programs.",
      "Fall protection required at 4 feet or higher.",
      "Hearing protection required for >85dB over 8 hours.",
      "Emergency exits must be unblocked and illuminated."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 25).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-mfg-3",
    title: "GMP Quality Manufacturing Standards",
    industry: "Manufacturing",
    content: "1. Manufacturing facilities must maintain clean and hygienic operating environments.\n2. All critical manufacturing processes must be validated to ensure reliable outputs.\n3. Raw materials must be properly identified, tested, and stored before use.\n4. Any deviations from standard procedures must be documented and investigated.",
    rules: [
      "Facilities must maintain clean environments.",
      "Validate critical manufacturing processes.",
      "Raw materials must be tested and identified.",
      "Deviations must be documented and investigated."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 50).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-nrg-2",
    title: "ESG Emissions & Waste Reporting",
    industry: "Energy",
    content: "1. Scope 1 and Scope 2 greenhouse gas emissions must be calculated and reported annually.\n2. Hazardous waste manifests must be tracked from generation through to final disposal.\n3. Water extraction and discharge metrics must be disclosed alongside local compliance targets.\n4. Supplier sustainability metrics must be collected and factored into vendor scoring.",
    rules: [
      "Calculate and report Scope 1 & 2 emissions annually.",
      "Track hazardous waste from generation to disposal.",
      "Disclose water extraction and discharge metrics.",
      "Collect and consider supplier sustainability metrics."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 38).toISOString(),
    isIndexed: true
  },
  {
    id: "seed-nrg-3",
    title: "Local Pollution Control Regulations",
    industry: "Energy",
    content: "1. Air quality scrubbers on exhaust stacks must continuously monitor particulate discharge.\n2. Noise pollution near residential boundaries cannot exceed 60 dB between 10 PM and 6 AM.\n3. Industrial effluent must be pH neutralized before discharging into municipal sewer systems.\n4. Any chemical spills exceeding 5 gallons must be immediately reported to the EPA.",
    rules: [
      "Air scrubbers must monitor particulate discharge.",
      "Nighttime noise pollution < 60 dB at property line.",
      "Effluent must be pH neutralized before discharge.",
      "Chemical spills > 5 gallons reported to EPA immediately."
    ],
    lastUpdated: new Date(Date.now() - 86400000 * 70).toISOString(),
    isIndexed: true
  }
];

class CloudStorageSim {
  private static files: Map<string, string> = new Map();
  static async upload(filename: string, data: string): Promise<string> {
    this.files.set(filename, data);
    return `https://storage.googleapis.com/compliance-bucket/${filename}`;
  }
  static getCount() { return this.files.size; }
}

class SpannerSim {
  private static table = 'Spanner_Policies';
  static async getAll(): Promise<Policy[]> {
    const data = localStorage.getItem(this.table);
    const seeded = getSeededPolicies();
    
    if (!data) {
        localStorage.setItem(this.table, JSON.stringify(seeded));
        return seeded;
    }
    
    // Merge seeded with local just in case we seeded new ones
    const localPolicies: Policy[] = JSON.parse(data);
    const localIds = new Set(localPolicies.map(p => p.id));
    
    let updated = false;
    for (const seed of seeded) {
      if (!localIds.has(seed.id)) {
        localPolicies.push(seed);
        updated = true;
      }
    }
    
    if (updated) {
      localStorage.setItem(this.table, JSON.stringify(localPolicies));
    }
    
    return localPolicies;
  }
  static async save(policy: Policy): Promise<boolean> {
    const policies = await this.getAll();
    const index = policies.findIndex(p => p.id === policy.id);
    if (index >= 0) policies[index] = policy;
    else policies.unshift(policy);
    localStorage.setItem(this.table, JSON.stringify(policies));
    return true;
  }
  static async delete(id: string): Promise<boolean> {
    const policies = await this.getAll();
    const filtered = policies.filter(p => p.id !== id);
    localStorage.setItem(this.table, JSON.stringify(filtered));
    return true;
  }
  static getRowCount() { 
     const data = localStorage.getItem(this.table);
     return data ? JSON.parse(data).length : 0;
  }
}

class MongoDBSim {
  private static collection = 'Atlas_Vector_Index';
  static async indexPolicy(policyId: string, content: string): Promise<void> {
    const current = parseInt(localStorage.getItem(this.collection) || '0');
    localStorage.setItem(this.collection, (current + 1).toString());
  }
  static getVectorCount() {
    return parseInt(localStorage.getItem(this.collection) || '0');
  }
}

class SqlGenericSim {
    private static table = 'Sql_Generic_Data';
    static async logEvent(event: string) {
        const current = parseInt(localStorage.getItem(this.table) || '0');
        localStorage.setItem(this.table, (current + 1).toString());
    }
    static getRowCount() {
        return parseInt(localStorage.getItem(this.table) || '0');
    }
}

class BigQuerySim {
  private static logs: AnalysisResult[] = [];
  static async insertRow(row: AnalysisResult) {
    this.logs.unshift(row);
  }
  static async query(): Promise<AnalysisResult[]> {
    return this.logs;
  }
  static getRowCount() { return this.logs.length; }
}

// Helper for robust base64 to UTF-8 decoding
const base64ToUtf8 = (base64: string): string => {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Base64 decoding failed:", e);
    return "";
  }
};

// --- ADK Orchestrator Pattern ---

export const ADKOrchestrator = {
  
  async ingestPolicy(fileBase64: string, mimeType: string, filename: string): Promise<MCPAgentResponse<{ text: string; rules: string[] }>> {
    const startTime = Date.now();
    try {
      await CloudStorageSim.upload(`policies/${filename}`, fileBase64);
      await SqlGenericSim.logEvent(`Ingest Policy: ${filename}`);

      const parts: any[] = [];
      if (mimeType === 'text/plain') {
          const text = base64ToUtf8(fileBase64);
          parts.push({ text: `DOCUMENT CONTENT:\n${text}` });
      } else {
          parts.push({ inlineData: { mimeType: mimeType, data: fileBase64 } });
      }
      parts.push({ text: "You are a Policy Ingestion Agent. 1. Extract the full text content accurately. 2. Extract a list of key compliance rules. Return as JSON." });

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
          }
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
      return { success: false, message: "Ingestion failed." };
    }
  },

  async verifyPolicy(policyText: string): Promise<MCPAgentResponse<{ summary: string; sources: { title: string; uri: string }[] }>> {
    const startTime = Date.now();
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME_FAST,
            contents: `Verify this policy content against current regulations and suggest missing requirements.\n\nPolicy Content:\n${policyText}`,
            config: { tools: [{ googleSearch: {} }] }
        });

        const summary = response.text || "No insights found.";
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
        return { success: false, message: "Verification failed." };
    }
  },

  async savePolicy(policy: Policy): Promise<MCPAgentResponse<boolean>> {
    await SpannerSim.save(policy);
    return { success: true, data: true };
  },

  async getLibrary(): Promise<MCPAgentResponse<Policy[]>> {
    const policies = await SpannerSim.getAll();
    return { success: true, data: policies };
  },

  async archivePolicy(id: string): Promise<MCPAgentResponse<boolean>> {
    await SpannerSim.delete(id);
    return { success: true, data: true };
  },

  async analyzeEvidence(
    context: MCPContext, 
    evidence: { type: 'image' | 'log', data: string, filename?: string }
  ): Promise<MCPAgentResponse<AnalysisResult>> {
    const startTime = Date.now();
    if (!context.activePolicy) return { success: false, message: "No active context." };

    try {
      const systemInstruction = `# Role & Objective
You are the core intelligence engine of AI Compliance Copilot, an enterprise-grade automated safety and compliance auditor. Your job is to evaluate operational evidence against a specific corporate policy.

# Input Architecture
1. [Policy]: Text/PDF containing corporate rules.
2. [Evidence]: Image/CCTV frame or raw log data.

# Evidence Cross-Match Protocol (CRITICAL)
Before auditing, you must verify if the [Evidence] is relevant to the [Policy].
- MATCH: The evidence contains elements governed by the active policy. Proceed with the full audit.
- MISMATCH: The evidence is a valid workplace/operational scene, but it clearly belongs to a DIFFERENT industry or policy type (e.g., uploading a construction site photo while a Healthcare policy is active).
- IRRELEVANT: The evidence is completely random (e.g., a selfie, a cup of coffee, a pet) and has no business context.

# Output Data Schema
You must respond strictly in valid JSON format. Do not include markdown formatting (like \`\`\`json).

{
  "evidenceStatus": "MATCH" | "MISMATCH" | "IRRELEVANT",
  "suggestedPolicyType": "If MISMATCH, guess the correct industry/policy type (e.g., 'Construction Safety', 'Financial Logs'). If MATCH or IRRELEVANT, return null.",
  "overallRisk": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "score": 0-100,
  "summary": "If MATCH: Executive summary of findings. If MISMATCH: 'Wrong evidence. This appears to belong to [suggestedPolicyType] rather than the active policy.' If IRRELEVANT: 'Invalid evidence provided.'",
  "violations": [
    {
      "ruleId": "Explicit policy section identifier",
      "description": "Explanation of what was observed",
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "recommendation": "Precise corrective action"
    }
  ]
}

# Auditing Rules (Only applies if MATCH)
1. Zero Speculation: Do not assume violations exist.
2. Absolute Grounding: Cite specific rules.
3. Scoring: CRITICAL (0-40), HIGH (41-70), MEDIUM (71-89), LOW (90-100).
If MISMATCH or IRRELEVANT, force score to 100, overallRisk to LOW, and violations to an empty array [].`;

      const parts: any[] = [];
      let prompt = `[Policy] Rules:\n`;
      context.activePolicy.rules.forEach((r, i) => prompt += `${i+1}. ${r}\n`);
      parts.push({ text: prompt });

      if (evidence.type === 'image') {
        parts.push({ text: `[Evidence] Multimodal Asset:` });
        parts.push({ inlineData: { mimeType: "image/jpeg", data: evidence.data } });
      } else {
        parts.push({ text: `[Evidence] LOG DATA:\n\n${evidence.data}` });
      }

      const response = await ai.models.generateContent({
        model: MODEL_NAME_FAST,
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              evidenceStatus: { type: Type.STRING, enum: ['MATCH', 'MISMATCH', 'IRRELEVANT'] },
              suggestedPolicyType: { type: Type.STRING, nullable: true },
              overallRisk: { type: Type.STRING, enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL] },
              score: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              violations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    ruleId: { type: Type.STRING },
                    description: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL] },
                    recommendation: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      const analysisResult: AnalysisResult = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        overallRisk: result.overallRisk || RiskLevel.LOW,
        score: result.score || 100,
        summary: result.summary || "No anomalies detected.",
        violations: result.violations || [],
        evidenceName: evidence.filename || "Evidence Input",
        evidenceType: evidence.type,
        evidenceStatus: result.evidenceStatus,
        suggestedPolicyType: result.suggestedPolicyType
      };

      await BigQuerySim.insertRow(analysisResult);
      return { success: true, data: analysisResult, metadata: { model: MODEL_NAME_FAST, latencyMs: Date.now() - startTime } };
    } catch (error) {
      return { success: false, message: "Analysis failed." };
    }
  },

  async trainRagAgent(policy: Policy): Promise<MCPAgentResponse<boolean>> {
    await MongoDBSim.indexPolicy(policy.id, policy.content);
    await SpannerSim.save({ ...policy, isIndexed: true });
    return { success: true, data: true };
  },

  async queryRag(history: any[], question: string, context: MCPContext): Promise<string> {
    if (!context.activePolicy?.isIndexed) return "Policy training required.";
    const systemInstruction = `You are a RAG Compliance Assistant for "${context.activePolicy.title}". Context:\n${context.activePolicy.content}`;
    try {
      const chat = ai.chats.create({ 
        model: MODEL_NAME_REASONING, 
        config: { systemInstruction },
        history: history.length > 0 ? history : undefined
      });
      const result = await chat.sendMessage({ message: question });
      return result.text || "I couldn't process that request.";
    } catch (e) {
      return "Error contacting RAG Agent.";
    }
  },

  getSystemHealth(): SystemHealth {
    return {
      status: 'healthy',
      latency: 120,
      activeJobs: 0,
      storageUsage: {
        spannerRows: SpannerSim.getRowCount(),
        mongoVectors: MongoDBSim.getVectorCount(),
        gcsObjects: CloudStorageSim.getCount(),
        bigQueryRows: BigQuerySim.getRowCount(),
        sqlRows: SqlGenericSim.getRowCount()
      },
      uptime: 99.99
    };
  },

  async getAuditHistory(): Promise<AnalysisResult[]> {
    return BigQuerySim.query();
  }
};
