
import { GoogleGenAI } from "@google/genai";
import { AuditLog } from "./types";

export async function analyzeAuditLogs(logs: AuditLog[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const logSummary = logs.slice(0, 20).map(log => 
    `User: ${log.userName}, Action: ${log.action}, Status: ${log.status}, Time: ${new Date(log.timestamp).toISOString()}`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a high-security systems analyst. Analyze the following audit logs and identify any suspicious patterns or provide a brief summary of system health and security compliance. 
      Keep it professional, concise, and focused on security risks.

      Audit Logs:
      ${logSummary}`,
      config: {
        systemInstruction: "You are an expert security analyst specializing in zero-trust architectures."
      }
    });

    return response.text || "Unable to analyze logs at this time.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Analysis failed. Please check your system connection.";
  }
}
