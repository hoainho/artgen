
import { ArtisticStyle, ReleaseNote, ExportFormat } from './types';

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
  version: '2.0.0',
  date: 'February 21, 2026',
  changes: [
    'Complete UI redesign with premium dark theme and violet accent palette.',
    'Integrated CLIProxy for out-of-the-box usage — no API key required.',
    'New single-column centered layout with style pills and segmented format toggle.',
    'Added shimmer loading animations and hover-to-download on generated images.',
    'Improved error handling for model cooldown and quota limits with user-friendly messages.',
    'Optional custom Google API key support via settings.',
  ],
};
