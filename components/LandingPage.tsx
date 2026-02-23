
import React from 'react';
import { AppPage } from '../hooks/useHashRouter';
interface LandingPageProps {
  onNavigate: (page: AppPage) => void;
}

const features = [
  {
    title: 'Imagen 4.0',
    description: 'Dedicated image generation API. No text model tokens consumed — dramatically lower cost per image.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: 'Smart Prompts',
    description: 'Style-specific templates automatically enhance your prompts with lighting, composition, and mood modifiers.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: '15 Art Styles',
    description: 'Photorealistic, Anime, Cyberpunk, Watercolor, Fantasy Art, and ten more curated styles.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </svg>
    ),
  },
  {
    title: 'Aspect Ratios',
    description: 'Square, landscape, portrait, wide, and tall formats to fit any platform or use case.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
  },
  {
    title: 'Smart Fallback',
    description: 'Automatic fallback to Gemini when Imagen is unavailable. Your generation always completes.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Zero Config',
    description: 'Works out of the box with a built-in proxy. Optionally add your own Google API key for direct access.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
      </svg>
    ),
  },
];

const steps = [
  { number: '01', title: 'Describe', description: 'Enter your creative vision in natural language' },
  { number: '02', title: 'Customize', description: 'Choose style, aspect ratio, and export format' },
  { number: '03', title: 'Generate', description: 'AI creates your image in seconds' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col">
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600">
              ArtGen AI
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Create stunning AI-generated images with professional-grade prompt engineering and Imagen 4.0.
            No tokens wasted. No complexity. Just results.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('create')}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 transition-all duration-200 shadow-lg shadow-accent-500/20"
            >
              Start Creating
            </button>
            <button
              onClick={() => onNavigate('guide')}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all duration-200"
            >
              View Guide
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              Everything you need
            </h2>
            <p className="mt-3 text-gray-500 text-sm">
              Professional image generation with a clean, focused workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-5 rounded-xl bg-surface-100 border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-lg bg-accent-500/10 flex items-center justify-center text-accent-400 mb-4 group-hover:bg-accent-500/15 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1.5">{feature.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              How it works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center sm:text-left">
                {index < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-px bg-white/[0.06]" />
                )}
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-500/10 text-accent-400 text-xs font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1.5">{step.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-lg font-medium text-gray-300 mb-6">Ready to create?</p>
          <button
            onClick={() => onNavigate('create')}
            className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 transition-all duration-200 shadow-lg shadow-accent-500/20"
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};
