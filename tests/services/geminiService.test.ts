import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGenerateContent = vi.fn();
const mockGenerateImages = vi.fn();

const mockGetModelsForTier = vi.fn();
const mockInvalidateModelCache = vi.fn();

vi.mock('../../services/modelRegistry', () => ({
  getModelsForTier: (...args: unknown[]) => mockGetModelsForTier(...args),
  invalidateModelCache: (...args: unknown[]) => mockInvalidateModelCache(...args),
  isModelUnavailableError: (error: unknown) => {
    if (!(error instanceof Error)) return false;
    const msg = error.message.toLowerCase();
    return (
      msg.includes('unknown provider') ||
      msg.includes('no longer available') ||
      msg.includes('not found') ||
      msg.includes('404') ||
      msg.includes('502') ||
      msg.includes('503') ||
      msg.includes('model not supported') ||
      msg.includes('does not exist') ||
      msg.includes('is not available') ||
      msg.includes('deprecated')
    );
  },
}));

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class MockGoogleGenAI {
      config: Record<string, unknown>;
      models = {
        generateContent: mockGenerateContent,
        generateImages: mockGenerateImages,
      };
      constructor(config: Record<string, unknown>) {
        this.config = config;
        MockGoogleGenAI._instances.push(this);
        MockGoogleGenAI._constructorCalls.push(config);
      }
      static _instances: InstanceType<typeof MockGoogleGenAI>[] = [];
      static _constructorCalls: Record<string, unknown>[] = [];
      static _reset() {
        MockGoogleGenAI._instances = [];
        MockGoogleGenAI._constructorCalls = [];
      }
    },
  };
});

import { GoogleGenAI } from '@google/genai';

const MockedGoogleGenAI = GoogleGenAI as unknown as typeof GoogleGenAI & {
  _instances: { config: Record<string, unknown> }[];
  _constructorCalls: Record<string, unknown>[];
  _reset: () => void;
};
import {
  createAIClient,
  isUsingProxy,
  isQuotaError,
  generateImageApi,
  generateTextApi,
  CLIPROXY_URL,
  CLIPROXY_KEY,
  IMAGE_MODEL_PROXY,
  IMAGE_MODEL_DIRECT,
  IMAGEN_MODEL,
} from '../../services/geminiService';

// PROXY_MODELS_BY_TIER is still exported from constants but no longer used directly by geminiService

beforeEach(() => {
  vi.clearAllMocks();
  MockedGoogleGenAI._reset();
  // Default: dynamic model discovery returns a single model
  mockGetModelsForTier.mockResolvedValue(['gemini-3.1-flash-image']);
});

describe('isUsingProxy', () => {
  it('returns true when apiKey is null', () => {
    expect(isUsingProxy(null)).toBe(true);
  });

  it('returns false when apiKey is a non-empty string', () => {
    expect(isUsingProxy('user-key-123')).toBe(false);
  });

  it('returns true when apiKey is an empty string (falsy)', () => {
    expect(isUsingProxy('')).toBe(true);
  });
});

describe('createAIClient', () => {
  it('uses cliproxy config when apiKey is null', () => {
    createAIClient(null);

    expect(MockedGoogleGenAI._constructorCalls).toHaveLength(1);
    expect(MockedGoogleGenAI._constructorCalls[0]).toEqual({
      apiKey: CLIPROXY_KEY,
      httpOptions: { baseUrl: CLIPROXY_URL },
    });
  });

  it('uses direct Google API when user provides apiKey', () => {
    createAIClient('user-key-123');

    expect(MockedGoogleGenAI._constructorCalls).toHaveLength(1);
    expect(MockedGoogleGenAI._constructorCalls[0]).toEqual({
      apiKey: 'user-key-123',
    });
  });

  it('does not include httpOptions when user provides apiKey', () => {
    createAIClient('user-key-123');

    expect(MockedGoogleGenAI._constructorCalls[0]).not.toHaveProperty('httpOptions');
  });
});

describe('isQuotaError', () => {
  it('returns true for 429 errors', () => {
    expect(isQuotaError(new Error('got status: 429'))).toBe(true);
  });

  it('returns true for RESOURCE_EXHAUSTED', () => {
    expect(isQuotaError(new Error('RESOURCE_EXHAUSTED'))).toBe(true);
  });

  it('returns true for model_cooldown', () => {
    expect(isQuotaError(new Error('model_cooldown'))).toBe(true);
  });

  it('returns true for cooling down', () => {
    expect(isQuotaError(new Error('credentials are cooling down'))).toBe(true);
  });

  it('returns false for non-quota errors', () => {
    expect(isQuotaError(new Error('NOT_FOUND'))).toBe(false);
  });

  it('returns false for non-Error values', () => {
    expect(isQuotaError('string error')).toBe(false);
  });
});

describe('generateImageApi', () => {
  const mockImageResponse = {
    candidates: [{
      content: {
        parts: [{
          inlineData: {
            data: 'base64encodedimage',
            mimeType: 'image/png',
          },
        }],
      },
    }],
  };

  const mockImagenResponse = {
    generatedImages: [{
      image: {
        imageBytes: 'imagenbase64data',
        mimeType: 'image/png',
      },
    }],
  };

  describe('proxy mode with model tiers', () => {
    it('uses first economy model by default when apiKey is null', async () => {
      mockGenerateContent.mockResolvedValue(mockImageResponse);

      await generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null);

      expect(mockGetModelsForTier).toHaveBeenCalledWith('economy');
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'gemini-3.1-flash-image' }),
      );
    });

    it('uses first standard model when standard tier is selected', async () => {
      mockGenerateContent.mockResolvedValue(mockImageResponse);

      await generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null, 'standard');

      expect(mockGetModelsForTier).toHaveBeenCalledWith('standard');
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'gemini-3.1-flash-image' }),
      );
    });

    it('uses first pro model when pro tier is selected', async () => {
      mockGenerateContent.mockResolvedValue(mockImageResponse);

      await generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null, 'pro');

      expect(mockGetModelsForTier).toHaveBeenCalledWith('pro');
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'gemini-3.1-flash-image' }),
      );
    });

    it('sends responseModalities IMAGE and TEXT', async () => {
      mockGenerateContent.mockResolvedValue(mockImageResponse);

      await generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null);

      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          config: { responseModalities: ['IMAGE', 'TEXT'] },
        }),
      );
    });

    it('does not attempt Imagen when using proxy', async () => {
      mockGenerateContent.mockResolvedValue(mockImageResponse);

      await generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null);

      expect(mockGenerateImages).not.toHaveBeenCalled();
    });

    it('extracts base64 image and mimeType from Gemini response', async () => {
      mockGenerateContent.mockResolvedValue(mockImageResponse);

      const result = await generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null);

      expect(result).toEqual({
        base64Image: 'base64encodedimage',
        mimeType: 'image/png',
      });
    });

    it('falls back to outputMimeType when response has no mimeType', async () => {
      mockGenerateContent.mockResolvedValue({
        candidates: [{
          content: {
            parts: [{
              inlineData: { data: 'img', mimeType: '' },
            }],
          },
        }],
      });

      const result = await generateImageApi('a cat', 'Photorealistic', '1:1', 'image/jpeg', null);
      expect(result.mimeType).toBe('image/jpeg');
    });
  });

  describe('model rotation on quota errors', () => {
    it('throws quota error when single model in tier is exhausted', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('got status: 429'));

      await expect(generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null, 'standard'))
        .rejects.toThrow('API quota exceeded');

      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'gemini-3.1-flash-image' }),
      );
    });
    it('throws after all models in tier are exhausted', async () => {
      mockGenerateContent.mockRejectedValue(new Error('got status: 429'));
      await expect(generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null))
        .rejects.toThrow();
    });
    it('rotates to next model on unavailability errors (unknown provider, 502, etc.)', async () => {
      mockGetModelsForTier.mockResolvedValue(['model-a', 'model-b']);
      mockGenerateContent
        .mockRejectedValueOnce(new Error('got status: 502 unknown provider for model model-a'))
        .mockResolvedValueOnce(mockImageResponse);

      const result = await generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null);

      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
      expect(mockGenerateContent).toHaveBeenNthCalledWith(1, expect.objectContaining({ model: 'model-a' }));
      expect(mockGenerateContent).toHaveBeenNthCalledWith(2, expect.objectContaining({ model: 'model-b' }));
      expect(mockInvalidateModelCache).toHaveBeenCalled();
      expect(result.base64Image).toBe('base64encodedimage');
    });

    it('does not rotate on non-retryable errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API key not valid'));
      await expect(generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null))
        .rejects.toThrow('Invalid API Key');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it('throws cooldown error on model_cooldown', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('model_cooldown'));

      await expect(generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null, 'standard'))
        .rejects.toThrow('cooldown');

      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it('throws after all models are unavailable', async () => {
      mockGetModelsForTier.mockResolvedValue(['model-a', 'model-b']);
      mockGenerateContent.mockRejectedValue(new Error('got status: 502 unknown provider'));

      await expect(generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null))
        .rejects.toThrow();

      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
      expect(mockInvalidateModelCache).toHaveBeenCalled();
    });
  });

  describe('direct mode (with API key)', () => {
    it('tries Imagen first when user provides apiKey', async () => {
      mockGenerateImages.mockResolvedValue(mockImagenResponse);

      await generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', 'user-key');

      expect(mockGenerateImages).toHaveBeenCalledWith(
        expect.objectContaining({ model: IMAGEN_MODEL }),
      );
    });

    it('passes aspectRatio to Imagen config', async () => {
      mockGenerateImages.mockResolvedValue(mockImagenResponse);

      await generateImageApi('a cat', 'Photorealistic', '16:9', 'image/png', 'user-key');

      expect(mockGenerateImages).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({ aspectRatio: '16:9' }),
        }),
      );
    });

    it('extracts image data from Imagen response', async () => {
      mockGenerateImages.mockResolvedValue(mockImagenResponse);

      const result = await generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', 'user-key');

      expect(result).toEqual({
        base64Image: 'imagenbase64data',
        mimeType: 'image/png',
      });
    });

    it('falls back to Gemini when Imagen fails', async () => {
      mockGenerateImages.mockRejectedValue(new Error('Imagen unavailable'));
      mockGenerateContent.mockResolvedValue(mockImageResponse);

      const result = await generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', 'user-key');

      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({ model: IMAGE_MODEL_DIRECT }),
      );
      expect(result).toEqual({
        base64Image: 'base64encodedimage',
        mimeType: 'image/png',
      });
    });
  });

  describe('error handling', () => {
    it('throws when Gemini response has no image data', async () => {
      mockGenerateContent.mockResolvedValue({
        candidates: [{
          content: {
            parts: [{ text: 'no image here' }],
          },
        }],
      });

      await expect(generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null))
        .rejects.toThrow('No image data found in the response parts.');
    });

    it('throws when Gemini response has no candidates', async () => {
      mockGenerateContent.mockResolvedValue({ candidates: null });

      await expect(generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', null))
        .rejects.toThrow('No candidates were returned by the API.');
    });

    it('throws user-friendly message on invalid API key', async () => {
      mockGenerateImages.mockRejectedValue(new Error('API key not valid'));
      mockGenerateContent.mockRejectedValue(new Error('API key not valid'));

      await expect(generateImageApi('a cat', 'Photorealistic', '1:1', 'image/png', 'bad-key'))
        .rejects.toThrow('Invalid API Key');
    });
  });
});

describe('generateTextApi', () => {
  it('uses proxy client when apiKey is null', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'hello' });

    await generateTextApi('say hello', null);

    expect(MockedGoogleGenAI._constructorCalls).toHaveLength(1);
    expect(MockedGoogleGenAI._constructorCalls[0]).toEqual({
      apiKey: CLIPROXY_KEY,
      httpOptions: { baseUrl: CLIPROXY_URL },
    });
  });

  it('uses direct client when apiKey is provided', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'hello' });

    await generateTextApi('say hello', 'user-key');

    expect(MockedGoogleGenAI._constructorCalls).toHaveLength(1);
    expect(MockedGoogleGenAI._constructorCalls[0]).toEqual({
      apiKey: 'user-key',
    });
  });

  it('uses gemini-3-flash-preview model', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'hello' });

    await generateTextApi('say hello', null);

    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gemini-3-flash-preview' }),
    );
  });

  it('returns response text', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'generated text' });

    const result = await generateTextApi('prompt', null);
    expect(result).toBe('generated text');
  });

  it('returns empty string when response text is empty', async () => {
    mockGenerateContent.mockResolvedValue({ text: '' });

    const result = await generateTextApi('prompt', null);
    expect(result).toBe('');
  });

  it('wraps API errors with descriptive message', async () => {
    mockGenerateContent.mockRejectedValue(new Error('network timeout'));

    await expect(generateTextApi('prompt', null))
      .rejects.toThrow('Gemini API error for text generation: network timeout');
  });

  it('handles non-Error exceptions', async () => {
    mockGenerateContent.mockRejectedValue('string error');

    await expect(generateTextApi('prompt', null))
      .rejects.toThrow('An unknown error occurred while generating text.');
  });
});

describe('constants', () => {
  it('CLIPROXY_URL defaults to proxy.hoainho.info', () => {
    expect(CLIPROXY_URL).toBe('https://proxy.hoainho.info');
  });

  it('CLIPROXY_KEY defaults to hoainho', () => {
    expect(CLIPROXY_KEY).toBe('hoainho');
  });

  it('IMAGE_MODEL_PROXY is gemini-3.1-flash-image', () => {
    expect(IMAGE_MODEL_PROXY).toBe('gemini-3.1-flash-image');
  });

  it('IMAGE_MODEL_DIRECT is gemini-2.5-flash-image', () => {
    expect(IMAGE_MODEL_DIRECT).toBe('gemini-2.5-flash-image');
  });

  it('IMAGEN_MODEL is imagen-4.0-generate-001', () => {
    expect(IMAGEN_MODEL).toBe('imagen-4.0-generate-001');
  });
});
