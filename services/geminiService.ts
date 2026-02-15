
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ExportMimeType } from '../types';

export interface GeneratedImageResult {
  base64Image: string;
  mimeType: ExportMimeType;
}

export const generateImageApi = async (
  prompt: string,
  outputMimeType: ExportMimeType,
  apiKey: string | null
): Promise<GeneratedImageResult> => {
  // Use the passed API key or fall back to the environment variable if available
  const effectiveApiKey = apiKey || process.env.API_KEY;

  if (!effectiveApiKey) {
    throw new Error("API Key is not configured. Please enter your API Key.");
  }

  const ai = new GoogleGenAI({ apiKey: effectiveApiKey });

  try {
    // Using gemini-2.5-flash-image as the default reliable model for image generation
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1" // Defaulting to square as previously handled
        }
      }
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
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

      if (errorMessage.includes("NOT_FOUND") || errorMessage.includes("404")) {
        throw new Error("Image generation failed: The requested model was not found. We've updated the app to use 'gemini-2.5-flash-image'. Please try again.");
      }
      if (errorMessage.includes("API key not valid") || errorMessage.includes("API_KEY_INVALID")) {
        throw new Error("Invalid API Key. Please check your Google API Key in the settings.");
      }
      if (errorMessage.includes("quota")) {
        throw new Error("API quota exceeded. Please check your Google Cloud project quotas.");
      }
      throw new Error(`Gemini API error: ${errorMessage}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};

export const generateTextApi = async (prompt: string, apiKey: string | null): Promise<string> => {
  const effectiveApiKey = apiKey || process.env.API_KEY;
  if (!effectiveApiKey) {
    throw new Error("API Key is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey: effectiveApiKey });

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
