
import React, { useState } from 'react';
import { ArtisticStyle, ExportFormat, GenerationParams } from '../types'; // Removed AspectRatio

interface ImageGeneratorFormProps {
  onGenerate: (params: Omit<GenerationParams, 'aspectRatio'>) => void; // aspectRatio removed
  isLoading: boolean;
  artisticStyles: ReadonlyArray<ArtisticStyle>;
  // aspectRatios: ReadonlyArray<AspectRatio>; // REMOVED
  exportFormats: ReadonlyArray<ExportFormat>;
  isApiKeySet: boolean;
}

export const ImageGeneratorForm: React.FC<ImageGeneratorFormProps> = ({ 
  onGenerate, 
  isLoading, 
  artisticStyles,
  // aspectRatios, // REMOVED
  exportFormats,
  isApiKeySet 
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>(artisticStyles[0].value);
  // const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>(aspectRatios[0].value); // REMOVED
  const [selectedExportFormat, setSelectedExportFormat] = useState<string>(exportFormats[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApiKeySet) {
      return;
    }
    if (!prompt.trim()) {
      alert("Please enter a prompt.");
      return;
    }
    onGenerate({ 
      prompt, 
      style: selectedStyle, 
      // aspectRatio: selectedAspectRatio, // REMOVED
      exportFormat: selectedExportFormat as 'image/png' | 'image/jpeg'
    });
  };

  const formDisabled = isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">
          Image Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A futuristic city skyline at sunset"
          rows={4}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-100 placeholder-gray-400 transition-colors"
          disabled={formDisabled}
        />
      </div>

      <div>
        <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-1">
          Artistic Style
        </label>
        <select
          id="style"
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-100 transition-colors"
          disabled={formDisabled}
        >
          {artisticStyles.map((style) => (
            <option key={style.value} value={style.value}>
              {style.label}
            </option>
          ))}
        </select>
      </div>

      {/* Aspect Ratio Dropdown Removed
      <div>
        <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-1">
          Aspect Ratio
        </label>
        <select
          id="aspectRatio"
          value={selectedAspectRatio}
          onChange={(e) => setSelectedAspectRatio(e.target.value)}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-100 transition-colors"
          disabled={formDisabled}
        >
          {aspectRatios.map((ratio) => (
            <option key={ratio.value} value={ratio.value}>
              {ratio.label}
            </option>
          ))}
        </select>
      </div>
      */}
      
      <div>
        <label htmlFor="exportFormat" className="block text-sm font-medium text-gray-300 mb-1">
          Export Format
        </label>
        <select
          id="exportFormat"
          value={selectedExportFormat}
          onChange={(e) => setSelectedExportFormat(e.target.value)}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-100 transition-colors"
          disabled={formDisabled}
        >
          {exportFormats.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={formDisabled || !isApiKeySet}
        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Image'
        )}
      </button>
       <p className="text-xs text-gray-500 mt-2 text-center">
        Aspect ratio selection is temporarily disabled. Images will use a default ratio.
      </p>
    </form>
  );
};
