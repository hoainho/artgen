
export interface ArtisticStyle {
  value: string; // This will be appended to the prompt
  label: string;
}

// AspectRatio types removed as the feature is temporarily disabled.
// export type AspectRatioValue =
//   "SQUARE"
//   | "PORTRAIT"
//   | "LANDSCAPE";

// export interface AspectRatio {
//   value: AspectRatioValue;
//   label: string;
// }

export type ExportMimeType = 'image/png' | 'image/jpeg';

export interface ExportFormat {
  value: ExportMimeType;
  label: string;
}

export interface GenerationParams {
  prompt: string;
  style: string; // The value from ArtisticStyle
  // aspectRatio: string; // REMOVED - The value from AspectRatio (will be cast to AspectRatioValue)
  exportFormat: ExportMimeType;
}

export interface ReleaseNote {
  version: string;
  date: string;
  changes: string[];
}
