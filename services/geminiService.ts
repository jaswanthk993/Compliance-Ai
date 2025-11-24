import { GoogleGenAI, Type } from "@google/genai";
import { Policy, AnalysisResult, RiskLevel } from "../types";

// In a real production app, these calls might be routed through a backend (FastAPI/Cloud Run)
// to secure the API key. For this purely frontend demo, we use the key directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

export const extractPolicyRules = async (policyText: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Extract the key compliance rules from the following policy text. Return them as a JSON list of strings.
      
      Policy Text:
      ${policyText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const jsonText = response.text || "[]";
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error extracting rules:", error);
    return ["Error extracting rules. Please try again."];
  }
};

export const analyzeEvidence = async (
  policy: Policy,
  imageBase64: string | null,
  logData: string | null
): Promise<AnalysisResult> => {
  try {
    const parts: any[] = [];

    // Context Setup
    let prompt = `You are an AI Compliance Officer. Analyze the provided evidence against the following policy rules:\n\n`;
    policy.rules.forEach((rule, idx) => {
      prompt += `${idx + 1}. ${rule}\n`;
    });
    prompt += `\nProvide a detailed compliance report.`;

    parts.push({ text: prompt });

    // Add Evidence
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64
        }
      });
      parts.push({ text: "Analyze this image for any safety or policy violations based on the rules provided." });
    }

    if (logData) {
      parts.push({ text: `Analyze these system logs for anomalies or violations:\n${logData}` });
    }

    // Define Schema for structured output
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallRisk: { type: Type.STRING, enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL] },
            score: { type: Type.NUMBER, description: "Compliance score from 0 to 100" },
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
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      evidenceName: imageBase64 ? "Image Upload" : "Log Data",
      evidenceType: imageBase64 ? 'image' : 'log',
      overallRisk: result.overallRisk || RiskLevel.LOW,
      score: result.score || 100,
      violations: result.violations || [],
      summary: result.summary || "No analysis generated."
    };

  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze evidence.");
  }
};

export const chatWithPolicy = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  policyContext: string
) => {
  try {
    const systemInstruction = `You are a helpful RAG (Retrieval Augmented Generation) assistant for compliance. 
    Always answer questions based strictly on the provided policy context below.
    If the answer is not in the policy, state that clearly.
    
    Policy Context:
    ${policyContext}`;

    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: { systemInstruction },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat failed:", error);
    return "I'm having trouble connecting to the compliance engine right now.";
  }
};