import { GoogleGenAI, Type } from "@google/genai";
import { DashboardData } from "../types";

/**
 * AI Service using Google Gemini to provide intelligent data analysis.
 * This service handles:
 * 1. Generating automated insights from the current dataset.
 * 2. Answering natural language queries about the data.
 * 3. Recommending the best chart type for the current data context.
 */

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiService = {
  /**
   * Generates 3-5 key insights from the dataset.
   */
  async generateInsights(data: DashboardData[]) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this dataset and provide 4 concise, expert-level business insights. 
        Focus on trends, anomalies, and potential optimizations. 
        Dataset: ${JSON.stringify(data.slice(-10))} 
        Format as a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      return JSON.parse(response.text || "[]") as string[];
    } catch (error) {
      console.error("AI Insights Error:", error);
      return ["Unable to generate automated insights at this time.", "Check network connectivity or API quota."];
    }
  },

  /**
   * Interprets a natural language query against the dataset.
   * Can now also suggest a chart update.
   */
  async askData(query: string, data: DashboardData[]) {
    try {
       const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a data analyst. Answer the user's question based strictly on this dataset. 
        If the user asks to change the chart type or view a specific visual, include a suggested chart type.
        Question: ${query}
        Dataset: ${JSON.stringify(data.slice(-5))} 
        Return JSON with "answer" (string) and "suggestedChart" (optional: "Area", "Line", "Bar", "Pie").`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              suggestedChart: { type: Type.STRING }
            },
            required: ["answer"]
          }
        }
      });
      return JSON.parse(response.text || "{\"answer\": \"I couldn't process that query.\"}");
    } catch (error) {
       console.error("Ask Data Error:", error);
       return { answer: "System error while processing visual query." };
    }
  },

  /**
   * Recommends the best chart type for the current data mapping.
   */
  async recommendChart(yAxisKey: string, data: DashboardData[]) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Recommend the best chart type (one of: Area, Line, Bar, Pie) for visualizing "${yAxisKey}" over time. 
        Provide a 1-sentence justification.
        Dataset Sample: ${JSON.stringify(data.slice(0, 3))}
        Return as JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "Area, Line, Bar, or Pie" },
              reason: { type: Type.STRING }
            },
            required: ["type", "reason"]
          }
        }
      });
      return JSON.parse(response.text || '{"type": "Area", "reason": "Default selection."}');
    } catch (error) {
      return { type: "Area", reason: "Standard visualization fallback." };
    }
  }
};
