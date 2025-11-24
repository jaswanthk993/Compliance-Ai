
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export type IndustryType = 'Manufacturing' | 'Healthcare' | 'Finance' | 'Retail' | 'Logistics' | 'Construction' | 'Technology' | 'Energy' | 'General';

export interface Policy {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
  rules: string[];
  isIndexed?: boolean; // For RAG Training status
  industry?: IndustryType;
}

export interface Violation {
  ruleId?: string;
  description: string;
  severity: RiskLevel;
  recommendation: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  overallRisk: RiskLevel;
  score: number; // 0-100, where 100 is perfectly compliant
  violations: Violation[];
  summary: string;
  evidenceName: string;
  evidenceType: 'image' | 'log';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// --- MCP (Model Context Protocol) Definitions ---

export interface MCPContext {
  sessionId: string;
  activePolicy?: Policy;
  data?: any;
}

export interface MCPAgentResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  metadata?: {
    model: string;
    tokensUsed?: number;
    latencyMs?: number;
  };
}

// --- ADK Storage Interface ---

export interface KnowledgeBaseTool {
  getAll(): Promise<Policy[]>;
  save(policy: Policy): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

// --- System Monitoring & Health ---

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  activeJobs: number;
  storageUsage: {
    spannerRows: number;      // Transactional Data
    mongoVectors: number;     // Vector Embeddings
    gcsObjects: number;       // Unstructured Data
    bigQueryRows: number;     // Analytics Data
    sqlRows: number;          // Generic SQL Data
  };
  uptime: number;
}
