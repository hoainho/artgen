
import { ArtisticStyle, AspectRatio, ReleaseNote, ExportFormat, ModelTierInfo, ModelTier } from './types';

export const ARTISTIC_STYLES: ReadonlyArray<ArtisticStyle> = [
  { value: 'Photorealistic', label: 'Photorealistic' },
  { value: 'Anime style', label: 'Anime' },
  { value: 'Pixel art', label: 'Pixel Art' },
  { value: 'Vector illustration', label: 'Vector Illustration' },
  { value: '3D render', label: '3D Render' },
  { value: 'Abstract art', label: 'Abstract Art' },
  { value: 'Impressionistic painting', label: 'Impressionism' },
  { value: 'Cyberpunk aesthetic', label: 'Cyberpunk' },
  { value: 'Low poly illustration', label: 'Low Poly' },
  { value: 'Watercolor painting', label: 'Watercolor' },
  { value: 'Sketch / Line Art', label: 'Sketch' },
  { value: 'Comic book style', label: 'Comic Book' },
  { value: 'Fantasy art', label: 'Fantasy Art' },
  { value: 'Steampunk', label: 'Steampunk' },
  { value: 'Minimalist', label: 'Minimalist' },
];

export const ASPECT_RATIOS: ReadonlyArray<AspectRatio> = [
  { value: '1:1', label: '1:1' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
];

export const EXPORT_FORMATS: ReadonlyArray<ExportFormat> = [
  { value: 'image/png', label: 'PNG' },
  { value: 'image/jpeg', label: 'JPEG' },
];

export const MODEL_TIERS: ReadonlyArray<ModelTierInfo> = [
  { value: 'economy', label: 'Economy', description: 'Minimal prompt — saves tokens, fast generation', requiresProAccess: false },
  { value: 'standard', label: 'Standard', description: 'Balanced prompt — good quality, moderate tokens', requiresProAccess: false },
  { value: 'pro', label: 'Pro', description: 'Full enhanced prompt — best quality, all style details', requiresProAccess: true },
];

// Static fallback models per tier — used when dynamic discovery fails.
// Updated to match currently known working models on the proxy.
export const PROXY_MODELS_BY_TIER: Record<ModelTier, string[]> = {
  economy: ['gemini-3.1-flash-image'],
  standard: ['gemini-3.1-flash-image', 'gemini-3.1-pro-low'],
  pro: ['gemini-3.1-pro-high', 'gemini-3.1-flash-image'],
};

/**
 * Preferred image models in priority order.
 * When dynamic discovery finds available models, they are sorted by this preference.
 * Best quality first — the system will try them in order and rotate on failure.
 */
export const IMAGE_MODEL_PREFERENCES: string[] = [
  'gemini-3.1-flash-image',  // Dedicated image model — best quality, proven working
  'gemini-3.1-pro-high',     // High-quality pro model
  'gemini-3.1-pro-low',      // Lower-cost pro variant
  'gemini-3-pro-preview',    // Previous gen (may be deprecated)
  'gemini-2.5-flash',        // Older gen fallback
];

/**
 * Patterns to identify image-capable Gemini models from the proxy model list.
 * Both string includes and RegExp are supported.
 */
export const GEMINI_IMAGE_MODEL_PATTERNS: (string | RegExp)[] = [
  'image',                          // e.g. gemini-3.1-flash-image
  /^gemini-3\.1-pro/,              // gemini-3.1-pro-high, gemini-3.1-pro-low
  /^gemini-3-pro/,                  // gemini-3-pro-preview
  /^gemini-.*flash-image/,          // any flash image variant
];

/** How long to cache the proxy model list (5 minutes). */
export const MODEL_CACHE_TTL_MS = 5 * 60 * 1000;

export const PRO_ACCESS_KEYS = ['RD-PRO-2025-UNLIMITED', 'RD-BETA-ACCESS-KEY'];

export const INITIAL_RELEASE_NOTES: ReleaseNote = {
  version: '3.5.0',
  date: 'February 27, 2026',
  changes: [
    'Dynamic model discovery: auto-detects available image models from proxy — no more hardcoded model IDs.',
    'Smart model rotation: automatically rotates to the next model on errors (502, unknown provider, deprecated, quota exhausted).',
    'Self-healing cache: invalidates model cache when a model becomes unavailable, re-discovers on next request.',
    'Updated default image model to gemini-3.1-flash-image (dedicated image generation model).',
    'Supported image models: gemini-3.1-flash-image, gemini-3.1-pro-high, gemini-3.1-pro-low, gemini-3-pro-preview, gemini-2.5-flash.',
    'Available proxy models: Gemini (gemini-3.1-flash-image, gemini-3.1-pro-high, gemini-3.1-pro-low, gemini-3-pro-preview, gemini-3-flash-preview, gemini-2.5-flash, gemini-2.5-flash-lite, gemini-2.5-pro), GPT (gpt-5 / 5.1 / 5.2 / codex), Claude (sonnet-4-6, opus-4-6), Qwen (qwen3-coder-flash/plus), Kimi (kimi-k2-instruct).',
  ],
};
