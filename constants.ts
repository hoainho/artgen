
import { ArtisticStyle, ReleaseNote, ExportFormat, ExportMimeType } from './types';

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

export const EXPORT_FORMATS: ReadonlyArray<ExportFormat> = [
    { value: 'image/png', label: 'PNG' },
    { value: 'image/jpeg', label: 'JPEG' },
];

export const INITIAL_RELEASE_NOTES: ReleaseNote = {
  version: '1.0.2',
  date: 'May 20, 2024',
  changes: [
    'Fixed 404 "Requested entity was not found" error by switching to the gemini-2.5-flash-image model.',
    'Updated API communication logic to use generateContent for image generation, ensuring better compatibility with the latest SDK.',
    'Improved error handling for API model availability and quota issues.',
    'Optimized text generation model to gemini-3-flash-preview.'
  ],
};
