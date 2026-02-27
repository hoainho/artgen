
import { ModelTier } from '../types';
import { CLIPROXY_URL, CLIPROXY_KEY } from './geminiService';
import {
  IMAGE_MODEL_PREFERENCES,
  GEMINI_IMAGE_MODEL_PATTERNS,
  MODEL_CACHE_TTL_MS,
  PROXY_MODELS_BY_TIER as STATIC_FALLBACK,
} from '../constants';

interface ProxyModelEntry {
  name: string;
  displayName: string;
  description: string;
  supportedGenerationMethods: string[];
}

interface ProxyModelsResponse {
  models: ProxyModelEntry[];
}

interface ModelCache {
  models: string[];
  timestamp: number;
}

let modelCache: ModelCache | null = null;

/**
 * Check if a model ID matches known Gemini image-generation capable patterns.
 * Uses substring/regex matching against known image model naming conventions.
 */
export function isImageCapableModel(modelId: string): boolean {
  const normalized = modelId.toLowerCase();
  return GEMINI_IMAGE_MODEL_PATTERNS.some((pattern) => {
    if (pattern instanceof RegExp) {
      return pattern.test(normalized);
    }
    return normalized.includes(pattern.toLowerCase());
  });
}

/**
 * Fetch all available models from the proxy's /v1beta/models endpoint.
 * Returns raw model IDs (without "models/" prefix).
 */
async function fetchProxyModels(): Promise<string[]> {
  try {
    const response = await fetch(`${CLIPROXY_URL}/v1beta/models`, {
      headers: { 'x-goog-api-key': CLIPROXY_KEY },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.warn(`Model registry: proxy returned ${response.status}, using static fallback`);
      return [];
    }

    const data: ProxyModelsResponse = await response.json();
    return data.models.map((m) => m.name.replace(/^models\//, ''));
  } catch (error) {
    console.warn('Model registry: failed to fetch models from proxy, using static fallback', error);
    return [];
  }
}

/**
 * Get all image-capable models currently available on the proxy.
 * Results are cached for MODEL_CACHE_TTL_MS to avoid hammering the proxy.
 */
export async function getAvailableImageModels(): Promise<string[]> {
  // Return cached if fresh enough
  if (modelCache && Date.now() - modelCache.timestamp < MODEL_CACHE_TTL_MS) {
    return modelCache.models;
  }

  const allModels = await fetchProxyModels();

  if (allModels.length === 0) {
    // Proxy unreachable — return empty, caller will use static fallback
    return [];
  }

  // Filter to only image-capable Gemini models
  const imageModels = allModels.filter(isImageCapableModel);

  // Sort by preference: preferred models first, then alphabetical
  const sorted = imageModels.sort((a, b) => {
    const aIdx = IMAGE_MODEL_PREFERENCES.indexOf(a);
    const bIdx = IMAGE_MODEL_PREFERENCES.indexOf(b);
    const aPriority = aIdx === -1 ? IMAGE_MODEL_PREFERENCES.length : aIdx;
    const bPriority = bIdx === -1 ? IMAGE_MODEL_PREFERENCES.length : bIdx;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.localeCompare(b);
  });

  modelCache = { models: sorted, timestamp: Date.now() };
  return sorted;
}

/**
 * Get the ordered list of models to try for a given tier.
 * 1. Try dynamic discovery first (cached, fast)
 * 2. Fall back to static PROXY_MODELS_BY_TIER if discovery returns empty
 */
export async function getModelsForTier(tier: ModelTier): Promise<string[]> {
  const dynamic = await getAvailableImageModels();
  if (dynamic.length > 0) {
    return dynamic;
  }
  // Fallback to static config
  return STATIC_FALLBACK[tier];
}

/**
 * Invalidate the model cache. Call this when a model returns
 * "unknown provider" or similar errors to force re-discovery.
 */
export function invalidateModelCache(): void {
  modelCache = null;
}

/**
 * Check if an error indicates the model itself is unavailable
 * (as opposed to a quota/rate-limit or content error).
 * These errors should trigger model rotation.
 */
export function isModelUnavailableError(error: unknown): boolean {
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
}
