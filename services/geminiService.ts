
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ExportMimeType, AspectRatioValue, ModelTier } from '../types';
import { buildEnhancedPrompt, buildPromptForTier } from './promptBuilder';
import { getModelsForTier, invalidateModelCache, isModelUnavailableError } from './modelRegistry';

export interface GeneratedImageResult {
  base64Image: string;
  mimeType: ExportMimeType;
}

export const CLIPROXY_URL = process.env.VITE_OPENCODE_API_URL || 'https://proxy.hoainho.info';
export const CLIPROXY_KEY = process.env.VITE_OPENCODE_API_KEY || 'hoainho';

export const IMAGE_MODEL_PROXY = 'gemini-3.1-flash-image';
export const IMAGE_MODEL_DIRECT = 'gemini-2.5-flash-image';
export const IMAGEN_MODEL = 'imagen-4.0-generate-001';

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

async function generateWithImagen(
  ai: GoogleGenAI,
  prompt: string,
  styleKey: string,
  aspectRatio: AspectRatioValue,
): Promise<GeneratedImageResult> {
  const enhancedPrompt = buildEnhancedPrompt(prompt, styleKey);

  const response = await ai.models.generateImages({
    model: IMAGEN_MODEL,
    prompt: enhancedPrompt,
    config: {
      numberOfImages: 1,
      aspectRatio: aspectRatio,
    },
  });

  const imageData = response?.generatedImages?.[0]?.image?.imageBytes;
  if (imageData) {
    return {
      base64Image: imageData,
      mimeType: 'image/png',
    };
  }

  throw new Error("No image data returned from Imagen.");
}

async function generateWithGemini(
  ai: GoogleGenAI,
  model: string,
  prompt: string,
  styleKey: string,
  outputMimeType: ExportMimeType,
  modelTier: ModelTier = 'standard',
): Promise<GeneratedImageResult> {
  const enhancedPrompt = buildPromptForTier(prompt, styleKey, modelTier);

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: {
      parts: [{ text: enhancedPrompt }]
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
          mimeType: (part.inlineData.mimeType as ExportMimeType) || outputMimeType,
        };
      }
    }
    throw new Error("No image data found in the response parts.");
  }

  throw new Error("No candidates were returned by the API.");
}

export function isQuotaError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message || '';
  return (
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('quota') ||
    msg.includes('model_cooldown') ||
    msg.includes('cooling down')
  );
}

function handleApiError(error: unknown): never {
  console.error('Error during image generation:', error);

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
    throw new Error(`Image generation error: ${errorMessage}`);
  }

  throw new Error("An unknown error occurred while generating the image.");
}

export const generateImageApi = async (
  prompt: string,
  styleKey: string,
  aspectRatio: AspectRatioValue,
  outputMimeType: ExportMimeType,
  apiKey: string | null,
  modelTier: ModelTier = 'economy',
): Promise<GeneratedImageResult> => {
  const ai = createAIClient(apiKey);
  const usingProxy = isUsingProxy(apiKey);

  if (!usingProxy) {
    try {
      return await generateWithImagen(ai, prompt, styleKey, aspectRatio);
    } catch (imagenError) {
      console.warn('Imagen failed, falling back to Gemini model:', imagenError);
      try {
        return await generateWithGemini(ai, IMAGE_MODEL_DIRECT, prompt, styleKey, outputMimeType, 'pro');
      } catch (fallbackError) {
        handleApiError(fallbackError);
      }
    }
  }

  // Dynamic model discovery + rotation for proxy mode
  const modelsToTry = await getModelsForTier(modelTier);
  let lastError: unknown = null;

  for (const model of modelsToTry) {
    try {
      const result = await generateWithGemini(ai, model, prompt, styleKey, outputMimeType, modelTier);
      return result;
    } catch (error) {
      lastError = error;

      // Model unavailable (unknown provider, 502, deprecated, etc.)
      // → invalidate cache so next request re-discovers, then try next model
      if (isModelUnavailableError(error)) {
        console.warn(`Model ${model} is unavailable (${error instanceof Error ? error.message : 'unknown'}), rotating to next model...`);
        invalidateModelCache();
        continue;
      }

      // Quota/rate-limit error → try next model without invalidating cache
      if (isQuotaError(error)) {
        console.warn(`Model ${model} quota exhausted, trying next model...`);
        continue;
      }

      // Other errors (API key invalid, content policy, etc.) → fail immediately
      handleApiError(error);
    }
  }

  handleApiError(lastError ?? new Error('All models in the rotation chain are exhausted. Please try again later or use your own API key.'));
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
