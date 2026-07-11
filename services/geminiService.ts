import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI", error);
}

export const generateAICaption = async (base64Image: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key not found. Returning mock response.");
    return "This is a simulated AI caption because the API key is missing. 🤖✨";
  }

  try {
    // Strip the data URL prefix if present to get just the base64 string
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity in this demo
            },
          },
          {
            text: "Write a short, engaging Instagram caption for this image. Include emojis and 3 relevant hashtags. Keep it under 50 words.",
          },
        ],
      },
    });

    return response.text || "Just another day in paradise! 📸";
  } catch (error) {
    console.error("Error generating caption with Gemini:", error);
    return "Could not generate caption at this time. #error";
  }
};

export const generateAIImage = async (prompt: string): Promise<string | null> => {
  if (!ai) {
    console.warn("Gemini API Key not found.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    return null;
  }
};
