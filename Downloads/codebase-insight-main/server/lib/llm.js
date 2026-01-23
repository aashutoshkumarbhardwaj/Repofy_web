import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateText = async (prompt) => {
  const client = getClient();
  if (!client) return null;

  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  try {
    const result = await client.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    return result.text;
  } catch (error) {
    console.error(`Gemini request failed (model: ${modelName})`, error);
    return null;
  }
};
