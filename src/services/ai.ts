import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/**
 * Helper function to call Gemini with retry logic for 429 errors.
 */
async function callGeminiWithRetry(params: any, maxRetries = 3, initialDelay = 1000): Promise<GenerateContentResponse> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      lastError = error;
      // Check if the error is a 429 (Rate Limit Exceeded)
      const errorString = error?.message || String(error);
      if (errorString.includes("429") || errorString.includes("RESOURCE_EXHAUSTED")) {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Gemini API rate limit hit (429). Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      // If it's not a 429, throw immediately
      throw error;
    }
  }
  throw lastError;
}

export async function generateDialogue(context: string, character: string, personality: string) {
  try {
    const response = await callGeminiWithRetry({
      model: "gemini-3-flash-preview",
      contents: `Character: ${character}
Personality: ${personality}
Context: ${context}

Generate a very short, one-sentence response (max 12 words) that fits the character and context. 
If responding to someone, acknowledge what they said in your own character's voice.
Characters are from 'The Amazing Digital Circus'.`,
      config: {
        systemInstruction: "You are a dialogue generator for 'The Amazing Digital Circus' 3D world. Keep responses brief, in-character, and slightly chaotic.",
      },
    });
    return response.text.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error("Dialogue generation failed:", error);
    return "...";
  }
}

export async function generateBuildingPlan(inspiration: string) {
  try {
    const response = await callGeminiWithRetry({
      model: "gemini-3-flash-preview",
      contents: `Inspiration: ${inspiration}

Create a structured 3D scene for this inspiration. 
Break it into 5-10 individual objects that form a recognizable structure (e.g., for a 'house', define walls, a roof, a door).
For each object, provide:
- type: 'box' | 'sphere' | 'cylinder'
- color: string (hex)
- scale: [x, y, z]
- position: [x, y, z] (relative to a center point [0,0,0])

Return the response as a JSON array of objects.`,
      config: {
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Building plan generation failed:", error);
    return [];
  }
}
