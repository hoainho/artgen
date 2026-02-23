
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

export const PROXY_MODELS_BY_TIER: Record<ModelTier, string[]> = {
  economy: ['gemini-3-pro-image-preview'],
  standard: ['gemini-3-pro-image-preview'],
  pro: ['gemini-3-pro-image-preview'],
};

export const PRO_ACCESS_KEYS = ['RD-PRO-2025-UNLIMITED', 'RD-BETA-ACCESS-KEY'];

export const INITIAL_RELEASE_NOTES: ReleaseNote = {
  version: '3.4.0',
  date: 'February 23, 2026',
  changes: [
    'Token optimization: Economy/Standard/Pro tiers now use different prompt complexities.',
    'Economy tier uses minimal prompts for lowest token cost.',
    'Pro tier uses full enhanced prompts with all style details and quality boosters.',
    'Improved image download: proper Blob-based download for reliable file exports.',
    'Professional prompt engineering with 15 style-specific templates.',
  ],
};
