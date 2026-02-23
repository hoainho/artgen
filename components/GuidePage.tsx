
import React from 'react';
import { AppPage } from '../hooks/useHashRouter';
interface GuidePageProps {
  onNavigate: (page: AppPage) => void;
}

const styleDescriptions = [
  { name: 'Photorealistic', desc: 'Ultra-realistic photographs with Canon-quality detail, golden hour lighting, and cinematic color grading.' },
  { name: 'Anime', desc: 'Studio Ghibli-inspired illustrations with cel-shading, vibrant colors, and expressive linework.' },
  { name: 'Pixel Art', desc: 'Masterful 32-bit retro game aesthetic with rich color palettes and deliberate pixel placement.' },
  { name: 'Vector Illustration', desc: 'Clean geometric designs with flat color blocks, sharp edges, and modern graphic principles.' },
  { name: '3D Render', desc: 'Octane Render quality with PBR materials, cinematic lighting, and ray-traced global illumination.' },
  { name: 'Abstract Art', desc: 'Contemporary mixed media aesthetic with dynamic forms, gestural brushwork, and layered depth.' },
  { name: 'Impressionism', desc: 'Masterful oil painting with visible brushstrokes, fleeting light effects, and atmospheric perspective.' },
  { name: 'Cyberpunk', desc: 'Blade Runner 2049 aesthetic with neon lights, rain-soaked streets, and synthwave color palettes.' },
  { name: 'Low Poly', desc: 'Stylized geometric 3D illustrations with faceted surfaces, pastel palettes, and clean aesthetics.' },
  { name: 'Watercolor', desc: 'Delicate paintings on cold-press paper with transparent washes, granulation, and color blooming.' },
  { name: 'Sketch', desc: 'Detailed pencil sketches with cross-hatching, varied line weight, and Da Vinci study quality.' },
  { name: 'Comic Book', desc: 'Dynamic illustrations with bold ink outlines, Ben-Day dots, and high-contrast halftone shading.' },
  { name: 'Fantasy Art', desc: 'Epic concept art with magical lighting, grand compositions, and intricate detail.' },
  { name: 'Steampunk', desc: 'Victorian-era mechanical aesthetic with brass, copper, clockwork elements, and gas lamp glow.' },
  { name: 'Minimalist', desc: 'Japanese zen aesthetic with generous white space, single focal points, and refined color palettes.' },
];

const ratioUseCases = [
  { ratio: '1:1', use: 'Social media posts, profile images, album covers' },
  { ratio: '4:3', use: 'Traditional photos, presentations, print media' },
  { ratio: '3:4', use: 'Portraits, mobile wallpapers, book covers' },
  { ratio: '16:9', use: 'Desktop wallpapers, YouTube thumbnails, banners' },
  { ratio: '9:16', use: 'Stories, reels, mobile-first content' },
];

export const GuidePage: React.FC<GuidePageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        <div className="mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600">
              Guide
            </span>
          </h1>
          <p className="mt-3 text-gray-400 text-lg">
            Learn how to create stunning images with ArtGen AI.
          </p>
        </div>

        <section className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-6">Getting Started</h2>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Enter a prompt', desc: 'Describe the image you want to create in natural language. Be as specific or abstract as you like.' },
              { step: '2', title: 'Select a style', desc: 'Choose from 15 curated artistic styles. Each style applies professional modifiers automatically.' },
              { step: '3', title: 'Choose aspect ratio and format', desc: 'Pick the dimensions that fit your use case and select PNG or JPEG output.' },
              { step: '4', title: 'Generate', desc: 'Click Generate or press Enter. Your image will be ready in seconds.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-4 rounded-xl bg-surface-100 border border-white/[0.06]">
                <div className="w-7 h-7 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-400 text-xs font-bold shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">{item.title}</h3>
                  <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-3">Writing Effective Prompts</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            ArtGen AI automatically enhances your prompts with professional-grade modifiers for each style.
            You focus on the creative vision; the system handles the technical details.
          </p>

          <div className="space-y-4 mb-8">
            <div className="rounded-xl border border-white/[0.06] overflow-hidden">
              <div className="px-4 py-2.5 bg-surface-200/50 border-b border-white/[0.04]">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Example: Photorealistic</span>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Your prompt</span>
                  <p className="text-sm text-gray-300 mt-1 font-mono bg-surface-100 rounded-lg px-3 py-2">a cat sitting on a windowsill</p>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Auto-enhanced</span>
                  <p className="text-sm text-gray-400 mt-1 font-mono bg-surface-100 rounded-lg px-3 py-2 leading-relaxed">
                    a cat sitting on a windowsill. ultra-realistic photograph, shot on Canon EOS R5 with 85mm f/1.4 lens. natural golden hour lighting with soft ambient fill. rule of thirds composition, shallow depth of field with creamy bokeh. 8K resolution, hyper-detailed textures. cinematic color grading, rich warm tones.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-200 mb-3">Tips for better results</h3>
          <ul className="space-y-2">
            {[
              'Be specific about subject, setting, and action',
              'Describe the mood or atmosphere you want',
              'Mention specific details like colors, textures, or time of day',
              'Let the style system handle technical details like lighting and composition',
              'Keep prompts concise but descriptive - quality over quantity',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-gray-400 leading-relaxed">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-accent-500/60 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-6">Art Styles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {styleDescriptions.map((style) => (
              <div key={style.name} className="p-4 rounded-xl bg-surface-100 border border-white/[0.06]">
                <h3 className="text-sm font-semibold text-gray-200 mb-1">{style.name}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{style.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-6">Aspect Ratios</h2>
          <div className="space-y-2">
            {ratioUseCases.map((item) => (
              <div key={item.ratio} className="flex items-center gap-4 p-3 rounded-lg bg-surface-100 border border-white/[0.06]">
                <span className="text-sm font-mono font-semibold text-accent-400 w-12">{item.ratio}</span>
                <span className="text-[13px] text-gray-400">{item.use}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-3">API Key</h2>
          <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
            <p>
              ArtGen AI works out of the box with a built-in proxy. No API key is required to start creating images.
            </p>
            <p>
              For the best experience, you can optionally add your own Google API key from Google AI Studio.
              This unlocks direct access to Imagen 4.0, eliminates cooldown limits, and uses your own quota.
            </p>
            <p>
              To configure your key, click the settings icon in the top-right corner of the header.
            </p>
          </div>
        </section>

        <section className="pt-8 pb-4 border-t border-white/[0.06] text-center">
          <p className="text-base font-medium text-gray-300 mb-5">Ready to create?</p>
          <button
            onClick={() => onNavigate('create')}
            className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 transition-all duration-200 shadow-lg shadow-accent-500/20"
          >
            Start Creating
          </button>
        </section>

      </div>
    </div>
  );
};
