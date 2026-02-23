
export interface ArtisticStyle {
  value: string; // Style key used for prompt building
  label: string;
}

export type AspectRatioValue = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface AspectRatio {
  value: AspectRatioValue;
  label: string;
}

export type ExportMimeType = 'image/png' | 'image/jpeg';

export interface ExportFormat {
  value: ExportMimeType;
  label: string;
}

export type ModelTier = 'economy' | 'standard' | 'pro';

export interface ModelTierInfo {
  value: ModelTier;
  label: string;
  description: string;
  requiresProAccess: boolean;
}

export interface GenerationParams {
  prompt: string;
  style: string; // The value from ArtisticStyle
  aspectRatio: AspectRatioValue;
  exportFormat: ExportMimeType;
  modelTier: ModelTier;
}

export interface ReleaseNote {
  version: string;
  date: string;
  changes: string[];
}
