
import { ArtisticStyle, ReleaseNote, ExportFormat, ExportMimeType } from './types'; // Removed AspectRatio, AspectRatioValue

export const ARTISTIC_STYLES: ReadonlyArray<ArtisticStyle> = [
  { value: 'Photorealistic', label: 'Photorealistic' },
  { value: 'Anime style', label: 'Anime' },
  { value: 'Pixel art', label: 'Pixel Art' },
  { value: 'Vector illustration', label: 'Vector Illustration' },
  { value: '3D render, cinematic lighting', label: '3D Render (Cinematic)' },
  { value: 'Abstract art', label: 'Abstract Art' },
  { value: 'Impressionistic painting', label: 'Impressionism' },
  { value: 'Cyberpunk aesthetic, neon lights', label: 'Cyberpunk' },
  { value: 'Low poly illustration', label: 'Low Poly' },
  { value: 'Watercolor painting', label: 'Watercolor Painting' },
  { value: 'Detailed sketch, line art', label: 'Sketch / Line Art' },
  { value: 'Comic book style, bold outlines', label: 'Comic Book Style' },
  { value: 'Fantasy art, epic', label: 'Fantasy Art' },
  { value: 'Steampunk design', label: 'Steampunk' },
  { value: 'Minimalist design', label: 'Minimalist' },
];

// ASPECT_RATIOS constant removed as the feature is temporarily disabled.
// export const ASPECT_RATIOS: ReadonlyArray<AspectRatio> = [
//   { value: 'SQUARE', label: 'Square (1:1)' },
//   { value: 'PORTRAIT', label: 'Portrait (Default Vertical)' },
//   { value: 'LANDSCAPE', label: 'Landscape (Default Horizontal)' },
// ];

export const EXPORT_FORMATS: ReadonlyArray<ExportFormat> = [
    { value: 'image/png', label: 'PNG' },
    { value: 'image/jpeg', label: 'JPEG' },
];

export const INITIAL_RELEASE_NOTES: ReleaseNote = {
  version: '1.0.1', // Incremented version
  date: 'July 30, 2024', // Updated date
  changes: [
    'Temporarily removed aspect ratio selection to resolve image generation errors. Images will now use the API default aspect ratio.',
    'Text-to-Image generation using Google Gemini API (model: imagen-3.0-generate-002).',
    'Choose from 15 distinct artistic styles to guide image creation.',
    'Export generated images in PNG or JPEG format.',
    'View application updates via the integrated Release Notes display.'
  ],
};
