
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ExportMimeType } from '../types';

export interface GeneratedImageResult {
  base64Image: string;
  mimeType: ExportMimeType;
}

export const CLIPROXY_URL = process.env.VITE_OPENCODE_API_URL || 'https://proxy.hoainho.info';
export const CLIPROXY_KEY = process.env.VITE_OPENCODE_API_KEY || 'hoainho';

export const IMAGE_MODEL_PROXY = 'gemini-3-pro-image-preview';
export const IMAGE_MODEL_DIRECT = 'gemini-2.5-flash-image';

export function isUsingProxy(userApiKey: string | null): boolean {
  return !userApiKey;
}

export function createAIClient(userApiKey: string | null): GoogleGenAI {
  if (userApiKey) {
    return new GoogleGenAI({ apiKey: userApiKey });
  }

  return new GoogleGenAI({
    apiKey: CLIPROXY_KEY,
    httpOptions: { baseUrl: CLIPROXY_URL },
  });
}

export const generateImageApi = async (
  prompt: string,
  outputMimeType: ExportMimeType,
  apiKey: string | null
): Promise<GeneratedImageResult> => {
  const ai = createAIClient(apiKey);
  const usingProxy = isUsingProxy(apiKey);
  const model = usingProxy ? IMAGE_MODEL_PROXY : IMAGE_MODEL_DIRECT;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return {
            base64Image: part.inlineData.data,
            mimeType: (part.inlineData.mimeType as ExportMimeType) || outputMimeType
          };
        }
      }
      throw new Error("No image data found in the response parts.");
    } else {
      throw new Error("No candidates were returned by the API.");
    }
  } catch (error) {
    console.error('Error calling Gemini API for image generation:', error);
    if (error instanceof Error) {
      const errorMessage = error.message || '';

      if (errorMessage.includes("model_cooldown") || errorMessage.includes("cooling down")) {
        const resetMatch = errorMessage.match(/"reset_time"\s*:\s*"([^"]+)"/);
        const resetTime = resetMatch ? resetMatch[1] : 'unknown';
        throw new Error(
          `Image model is temporarily unavailable (cooldown). Reset in: ${resetTime}. ` +
          `You can use your own Google API key (via the API Key button) to bypass this limit.`
        );
      }
      if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("quota")) {
        const resetMatch = errorMessage.match(/"reset_time"\s*:\s*"([^"]+)"/);
        const resetTime = resetMatch ? ` Reset in: ${resetMatch[1]}.` : '';
        throw new Error(
          `API quota exceeded.${resetTime} ` +
          `You can use your own Google API key (via the API Key button) to bypass this limit.`
        );
      }
      if (errorMessage.includes("NOT_FOUND") || errorMessage.includes("404")) {
        throw new Error("Image generation failed: The requested model was not found. Please try again later.");
      }
      if (errorMessage.includes("API key not valid") || errorMessage.includes("API_KEY_INVALID")) {
        throw new Error("Invalid API Key. Please check your Google API Key in the settings.");
      }
      throw new Error(`Gemini API error: ${errorMessage}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};

export const generateTextApi = async (prompt: string, apiKey: string | null): Promise<string> => {
  const ai = createAIClient(apiKey);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error('Error calling Gemini API for text generation:', error);
    if (error instanceof Error) {
      throw new Error(`Gemini API error for text generation: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating text.");
  }
};
