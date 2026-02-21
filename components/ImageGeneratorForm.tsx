
import React, { useState } from 'react';
import { ArtisticStyle, ExportFormat, GenerationParams } from '../types';

interface ImageGeneratorFormProps {
  onGenerate: (params: Omit<GenerationParams, 'aspectRatio'>) => void;
  isLoading: boolean;
  artisticStyles: ReadonlyArray<ArtisticStyle>;
  exportFormats: ReadonlyArray<ExportFormat>;
  isApiKeySet: boolean;
}

export const ImageGeneratorForm: React.FC<ImageGeneratorFormProps> = ({
  onGenerate,
  isLoading,
  artisticStyles,
  exportFormats,
  isApiKeySet
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>(artisticStyles[0].value);
  const [selectedExportFormat, setSelectedExportFormat] = useState<string>(exportFormats[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApiKeySet) return;
    if (!prompt.trim()) return;
    onGenerate({
      prompt,
      style: selectedStyle,
      exportFormat: selectedExportFormat as 'image/png' | 'image/jpeg'
    });
  };

  const formDisabled = isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="relative">
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to create..."
          rows={4}
          className="w-full px-4 py-3.5 bg-surface-100 border border-white/8 rounded-2xl text-[15px] text-gray-100 placeholder-gray-600 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/25 resize-none transition-all duration-200"
          disabled={formDisabled}
        />
      </div>

      <div className="space-y-2.5">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Style</span>
        <div className="flex flex-wrap gap-2">
          {artisticStyles.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => setSelectedStyle(style.value)}
              disabled={formDisabled}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border ${
                selectedStyle === style.value
                  ? 'bg-accent-600/20 border-accent-500/50 text-accent-300'
                  : 'bg-surface-100 border-white/6 text-gray-400 hover:border-white/15 hover:text-gray-300'
              } disabled:opacity-40`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Format</span>
        <div className="flex bg-surface-100 border border-white/6 rounded-lg p-0.5">
          {exportFormats.map((format) => (
            <button
              key={format.value}
              type="button"
              onClick={() => setSelectedExportFormat(format.value)}
              disabled={formDisabled}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                selectedExportFormat === format.value
                  ? 'bg-accent-600/20 text-accent-300'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={formDisabled || !isApiKeySet || !prompt.trim()}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-accent-500/10"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        ) : (
          'Generate'
        )}
      </button>
    </form>
  );
};
