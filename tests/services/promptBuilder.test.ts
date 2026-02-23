import { describe, it, expect } from 'vitest';
import { buildPromptForTier, buildEnhancedPrompt, buildSimplePrompt } from '../../services/promptBuilder';

describe('buildPromptForTier', () => {
  const userPrompt = 'a cat sitting on a rainbow';

  describe('economy tier', () => {
    it('returns minimal prompt with style keyword only', () => {
      const result = buildPromptForTier(userPrompt, 'Photorealistic', 'economy');
      expect(result).toBe('a cat sitting on a rainbow, ultra-realistic photograph');
    });

    it('returns just user prompt for unknown style', () => {
      const result = buildPromptForTier(userPrompt, 'UnknownStyle', 'economy');
      expect(result).toBe(userPrompt);
    });

    it('is shorter than standard tier', () => {
      const economy = buildPromptForTier(userPrompt, 'Anime style', 'economy');
      const standard = buildPromptForTier(userPrompt, 'Anime style', 'standard');
      expect(economy.length).toBeLessThan(standard.length);
    });
  });

  describe('standard tier', () => {
    it('includes base and quality but not lighting/composition/mood', () => {
      const result = buildPromptForTier(userPrompt, 'Photorealistic', 'standard');
      expect(result).toContain(userPrompt);
      expect(result).toContain('ultra-realistic photograph');
      expect(result).toContain('8K resolution');
      // Should NOT contain lighting, composition, mood, or quality boosters
      expect(result).not.toContain('golden hour');
      expect(result).not.toContain('rule of thirds');
      expect(result).not.toContain('cinematic color grading');
      expect(result).not.toContain('masterpiece');
    });

    it('returns fallback for unknown style', () => {
      const result = buildPromptForTier(userPrompt, 'UnknownStyle', 'standard');
      expect(result).toBe('a cat sitting on a rainbow, high quality, detailed');
    });

    it('is shorter than pro tier', () => {
      const standard = buildPromptForTier(userPrompt, 'Cyberpunk aesthetic', 'standard');
      const pro = buildPromptForTier(userPrompt, 'Cyberpunk aesthetic', 'pro');
      expect(standard.length).toBeLessThan(pro.length);
    });
  });

  describe('pro tier', () => {
    it('includes all template fields and quality boosters', () => {
      const result = buildPromptForTier(userPrompt, 'Photorealistic', 'pro');
      expect(result).toContain(userPrompt);
      expect(result).toContain('ultra-realistic photograph');
      expect(result).toContain('golden hour');
      expect(result).toContain('rule of thirds');
      expect(result).toContain('8K resolution');
      expect(result).toContain('cinematic color grading');
      expect(result).toContain('masterpiece');
      expect(result).toContain('trending 2026');
    });

    it('returns fallback for unknown style', () => {
      const result = buildPromptForTier(userPrompt, 'UnknownStyle', 'pro');
      expect(result).toBe('a cat sitting on a rainbow, high quality, detailed, professional');
    });
  });

  describe('token optimization', () => {
    it('economy < standard < pro in prompt length for all styles', () => {
      const styles = ['Photorealistic', 'Anime style', 'Pixel art', '3D render', 'Minimalist'];
      for (const style of styles) {
        const economy = buildPromptForTier(userPrompt, style, 'economy');
        const standard = buildPromptForTier(userPrompt, style, 'standard');
        const pro = buildPromptForTier(userPrompt, style, 'pro');
        expect(economy.length, `${style}: economy should be shorter than standard`).toBeLessThan(standard.length);
        expect(standard.length, `${style}: standard should be shorter than pro`).toBeLessThan(pro.length);
      }
    });
  });
});

describe('buildEnhancedPrompt', () => {
  it('includes all template fields for known style', () => {
    const result = buildEnhancedPrompt('a cat', 'Photorealistic');
    expect(result).toContain('a cat');
    expect(result).toContain('ultra-realistic photograph');
    expect(result).toContain('masterpiece');
  });

  it('returns simple fallback for unknown style', () => {
    const result = buildEnhancedPrompt('a cat', 'Unknown');
    expect(result).toBe('a cat, high quality, detailed, professional');
  });
});

describe('buildSimplePrompt', () => {
  it('includes base, quality, and mood for known style', () => {
    const result = buildSimplePrompt('a cat', 'Photorealistic');
    expect(result).toContain('a cat');
    expect(result).toContain('ultra-realistic photograph');
    expect(result).toContain('8K resolution');
    expect(result).toContain('cinematic color grading');
  });

  it('returns simple fallback for unknown style', () => {
    const result = buildSimplePrompt('a cat', 'Unknown');
    expect(result).toBe('a cat, high quality, detailed');
  });
});
