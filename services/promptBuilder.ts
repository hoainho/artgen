
interface StyleTemplate {
  base: string;
  lighting: string;
  composition: string;
  quality: string;
  mood: string;
}

const STYLE_TEMPLATES: Record<string, StyleTemplate> = {
  Photorealistic: {
    base: 'ultra-realistic photograph, shot on Canon EOS R5 with 85mm f/1.4 lens',
    lighting: 'natural golden hour lighting with soft ambient fill, volumetric light rays',
    composition: 'rule of thirds composition, shallow depth of field with creamy bokeh',
    quality: '8K resolution, hyper-detailed textures, RAW photo quality, photojournalism',
    mood: 'cinematic color grading, rich warm tones, magazine editorial quality',
  },
  'Anime style': {
    base: 'high-quality anime illustration, Studio Ghibli meets modern anime aesthetic',
    lighting: 'dramatic rim lighting with soft cel-shading, ambient glow effects',
    composition: 'dynamic composition with strong focal point, expressive linework',
    quality: 'crisp clean lines, vibrant saturated colors, detailed background art',
    mood: 'emotionally evocative atmosphere, ethereal and dreamlike, trending on Pixiv',
  },
  'Pixel art': {
    base: 'masterful pixel art illustration, 32-bit retro game aesthetic',
    lighting: 'carefully crafted dithering for light and shadow transitions',
    composition: 'clean pixel placement with intentional anti-aliasing, isometric perspective',
    quality: 'high-resolution pixel art with rich color palette, sub-pixel rendering',
    mood: 'nostalgic retro gaming atmosphere, vibrant and playful, modern indie game style',
  },
  'Vector illustration': {
    base: 'premium vector illustration, clean geometric design, flat design 2.0',
    lighting: 'subtle gradients with flat color blocks, soft drop shadows',
    composition: 'balanced layout with negative space, modern graphic design principles',
    quality: 'razor-sharp edges, consistent line weight, harmonious color palette',
    mood: 'contemporary and professional, Silicon Valley tech aesthetic, Dribbble trending',
  },
  '3D render': {
    base: 'photorealistic 3D render, Octane Render quality, PBR materials',
    lighting: 'three-point cinematic lighting with HDRI environment, caustics and subsurface scattering',
    composition: 'dramatic camera angle with depth of field, volumetric fog',
    quality: 'ultra-high polygon count, 8K textures, ray-traced global illumination',
    mood: 'cinematic atmosphere, Unreal Engine 5 quality, ArtStation trending',
  },
  'Abstract art': {
    base: 'contemporary abstract art, mixed media aesthetic',
    lighting: 'dramatic interplay of light and dark, chiaroscuro with modern twist',
    composition: 'dynamic flowing forms, gestural brushwork, layered depth',
    quality: 'high-resolution with visible texture detail, impasto technique',
    mood: 'emotionally charged, bold and expressive, museum gallery quality',
  },
  'Impressionistic painting': {
    base: 'masterful impressionist oil painting, loose visible brushstrokes',
    lighting: 'capturing fleeting light effects, dappled sunlight, atmospheric perspective',
    composition: 'en plein air composition, natural scene framing, painterly depth',
    quality: 'rich impasto texture, layered color harmonies, canvas texture visible',
    mood: 'serene and contemplative, Monet-inspired luminosity, timeless beauty',
  },
  'Cyberpunk aesthetic': {
    base: 'cyberpunk scene, Blade Runner 2049 aesthetic, high-tech low-life',
    lighting: 'neon lights reflecting on wet surfaces, holographic displays, LED glow',
    composition: 'dense urban layering, extreme perspective, rain-soaked streets',
    quality: 'ultra-detailed with micro-details, chromatic aberration, film grain',
    mood: 'dystopian yet beautiful, electric atmosphere, synthwave color palette',
  },
  'Low poly illustration': {
    base: 'stylized low-poly 3D illustration, geometric faceted surfaces',
    lighting: 'clean soft lighting with subtle ambient occlusion, pastel palette',
    composition: 'minimalist scene with strong silhouette, isometric or slight tilt',
    quality: 'crisp polygon edges, harmonious limited color palette, smooth gradients',
    mood: 'modern and clean, playful minimalism, trending digital art style',
  },
  'Watercolor painting': {
    base: 'delicate watercolor painting on premium cold-press paper',
    lighting: 'transparent light washes, luminous white paper showing through',
    composition: 'organic flowing composition, intentional white space, wet-on-wet blending',
    quality: 'visible paper texture, granulation effects, controlled wet edges, color blooming',
    mood: 'ethereal and delicate, poetic atmosphere, traditional fine art mastery',
  },
  'Sketch / Line Art': {
    base: 'detailed pencil sketch on textured paper, cross-hatching technique',
    lighting: 'dramatic tonal values through hatching density, strong light-dark contrast',
    composition: 'architectural precision with artistic flair, detailed foreground fading to suggestion',
    quality: 'fine line detail, varied line weight, professional illustration quality',
    mood: 'raw and authentic, Da Vinci study quality, intellectual and refined',
  },
  'Comic book style': {
    base: 'dynamic comic book illustration, bold ink outlines, Ben-Day dots',
    lighting: 'dramatic spotlight effects, high contrast shadows, speed lines',
    composition: 'dynamic action pose, foreshortening, dramatic angle',
    quality: 'clean bold linework, vivid flat colors, halftone shading',
    mood: 'energetic and powerful, Marvel/DC quality, pop art influence',
  },
  'Fantasy art': {
    base: 'epic fantasy illustration, high fantasy concept art',
    lighting: 'magical ethereal glow, god rays through clouds, mystical atmosphere',
    composition: 'grand scale epic composition, sweeping vista, heroic perspective',
    quality: 'ultra-detailed environment, intricate armor and costume design, painterly finish',
    mood: 'awe-inspiring grandeur, mythological wonder, Lord of the Rings visual quality',
  },
  Steampunk: {
    base: 'steampunk design, Victorian-era mechanical aesthetic, brass and copper',
    lighting: 'warm gas lamp glow, amber light through steam, industrial atmosphere',
    composition: 'intricate mechanical detail, clockwork elements, layered depth',
    quality: 'highly detailed gears and pipes, ornate Victorian ornamentation, patina textures',
    mood: 'adventurous retro-futurism, Jules Verne inspired, elegant industrial',
  },
  Minimalist: {
    base: 'minimalist design, Japanese zen aesthetic, less is more',
    lighting: 'clean even lighting, subtle shadow for depth, no harsh contrasts',
    composition: 'generous white space, single focal point, perfect visual balance',
    quality: 'mathematically precise spacing, limited refined color palette, pixel-perfect',
    mood: 'calm and serene, sophisticated simplicity, Muji-inspired elegance',
  },
};

const UNIVERSAL_QUALITY_BOOSTERS = [
  'masterpiece',
  'award-winning',
  'professionally crafted',
  'trending 2026',
];

export function buildEnhancedPrompt(userPrompt: string, styleKey: string): string {
  const template = STYLE_TEMPLATES[styleKey];

  if (!template) {
    return `${userPrompt}, high quality, detailed, professional`;
  }
  const enhancedPrompt = [
    userPrompt,
    template.base,
    template.lighting,
    template.composition,
    template.quality,
    template.mood,
    UNIVERSAL_QUALITY_BOOSTERS.join(', '),
  ].join('. ');
  return enhancedPrompt;
}
export function buildSimplePrompt(userPrompt: string, styleKey: string): string {
  const template = STYLE_TEMPLATES[styleKey];

  if (!template) {
    return `${userPrompt}, high quality, detailed`;
  }
  return `${userPrompt}. ${template.base}. ${template.quality}. ${template.mood}`;
}

/**
 * Build prompt based on model tier for token optimization.
 * - economy: Minimal prompt — user text + style keyword only. Lowest token cost.
 * - standard: Balanced prompt — user text + base style + quality hint.
 * - pro: Full enhanced prompt — all style fields + quality boosters. Best quality.
 */
export function buildPromptForTier(
  userPrompt: string,
  styleKey: string,
  tier: 'economy' | 'standard' | 'pro',
): string {
  const template = STYLE_TEMPLATES[styleKey];

  switch (tier) {
    case 'economy': {
      // Minimal: user prompt + style label only (~10-20 tokens saved per request)
      if (!template) return userPrompt;
      // Extract just the first descriptor from base (e.g. 'ultra-realistic photograph')
      const styleLabel = template.base.split(',')[0].trim();
      return `${userPrompt}, ${styleLabel}`;
    }
    case 'standard': {
      // Balanced: user prompt + base + quality
      if (!template) return `${userPrompt}, high quality, detailed`;
      return `${userPrompt}. ${template.base}. ${template.quality}`;
    }
    case 'pro': {
      // Full: all template fields + quality boosters
      if (!template) return `${userPrompt}, high quality, detailed, professional`;
      return [
        userPrompt,
        template.base,
        template.lighting,
        template.composition,
        template.quality,
        template.mood,
        UNIVERSAL_QUALITY_BOOSTERS.join(', '),
      ].join('. ');
    }
  }
}
