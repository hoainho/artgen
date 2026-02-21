import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class MockGoogleGenAI {
      config: Record<string, unknown>;
      models = { generateContent: mockGenerateContent };
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
  generateImageApi,
  generateTextApi,
  CLIPROXY_URL,
  CLIPROXY_KEY,
  IMAGE_MODEL_PROXY,
  IMAGE_MODEL_DIRECT,
} from '../../services/geminiService';

beforeEach(() => {
  vi.clearAllMocks();
  MockedGoogleGenAI._reset();
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

  it('uses proxy image model when apiKey is null', async () => {
    mockGenerateContent.mockResolvedValue(mockImageResponse);

    await generateImageApi('a cat', 'image/png', null);

    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({ model: IMAGE_MODEL_PROXY }),
    );
  });

  it('uses direct image model when apiKey is provided', async () => {
    mockGenerateContent.mockResolvedValue(mockImageResponse);

    await generateImageApi('a cat', 'image/png', 'user-key');

    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({ model: IMAGE_MODEL_DIRECT }),
    );
  });

  it('sends responseModalities IMAGE and TEXT', async () => {
    mockGenerateContent.mockResolvedValue(mockImageResponse);

    await generateImageApi('a cat', 'image/png', null);

    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        config: { responseModalities: ['IMAGE', 'TEXT'] },
      }),
    );
  });

  it('extracts base64 image and mimeType from response', async () => {
    mockGenerateContent.mockResolvedValue(mockImageResponse);

    const result = await generateImageApi('a cat', 'image/png', null);

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

    const result = await generateImageApi('a cat', 'image/jpeg', null);
    expect(result.mimeType).toBe('image/jpeg');
  });

  it('throws when response has no image data', async () => {
    mockGenerateContent.mockResolvedValue({
      candidates: [{
        content: {
          parts: [{ text: 'no image here' }],
        },
      }],
    });

    await expect(generateImageApi('a cat', 'image/png', null))
      .rejects.toThrow('No image data found in the response parts.');
  });

  it('throws when response has no candidates', async () => {
    mockGenerateContent.mockResolvedValue({ candidates: null });

    await expect(generateImageApi('a cat', 'image/png', null))
      .rejects.toThrow('No candidates were returned by the API.');
  });

  it('throws user-friendly message on model cooldown with reset time', async () => {
    const cooldownError = 'got status: 429 . {"error":{"code":"model_cooldown","message":"All credentials for model gemini-3-pro-image-preview are cooling down","reset_time":"24h10m45s"}}';
    mockGenerateContent.mockRejectedValue(new Error(cooldownError));

    await expect(generateImageApi('a cat', 'image/png', null))
      .rejects.toThrow('Image model is temporarily unavailable (cooldown). Reset in: 24h10m45s');
  });

  it('suggests using own API key on cooldown', async () => {
    mockGenerateContent.mockRejectedValue(new Error('model_cooldown'));

    await expect(generateImageApi('a cat', 'image/png', null))
      .rejects.toThrow('You can use your own Google API key');
  });

  it('throws user-friendly message on 429 / quota error', async () => {
    mockGenerateContent.mockRejectedValue(new Error('got status: 429 . {"error":{"code":"RESOURCE_EXHAUSTED"}}'));

    await expect(generateImageApi('a cat', 'image/png', null))
      .rejects.toThrow('API quota exceeded');
  });

  it('throws user-friendly message on invalid API key', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API key not valid'));

    await expect(generateImageApi('a cat', 'image/png', 'bad-key'))
      .rejects.toThrow('Invalid API Key');
  });

  it('throws user-friendly message on 404 / NOT_FOUND', async () => {
    mockGenerateContent.mockRejectedValue(new Error('NOT_FOUND'));

    await expect(generateImageApi('a cat', 'image/png', null))
      .rejects.toThrow('Image generation failed');
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

  it('IMAGE_MODEL_PROXY is gemini-3-pro-image-preview', () => {
    expect(IMAGE_MODEL_PROXY).toBe('gemini-3-pro-image-preview');
  });

  it('IMAGE_MODEL_DIRECT is gemini-2.5-flash-image', () => {
    expect(IMAGE_MODEL_DIRECT).toBe('gemini-2.5-flash-image');
  });
});
