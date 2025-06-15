
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageGeneratorForm } from './components/ImageGeneratorForm';
import { ImageDisplay } from './components/ImageDisplay';
import { ReleaseNotesModal } from './components/ReleaseNotesModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateImageApi } from './services/geminiService';
import { GenerationParams } from './types';
import { INITIAL_RELEASE_NOTES, ARTISTIC_STYLES, EXPORT_FORMATS } from './constants'; // ASPECT_RATIOS removed
import { useApiKey } from './hooks/useApiKey';

const App: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedImageMimeType, setGeneratedImageMimeType] = useState<string>('image/png');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showReleaseNotes, setShowReleaseNotes] = useState<boolean>(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);

  const [apiKey, saveApiKey] = useApiKey();

  useEffect(() => {
    if (apiKey === null && localStorage.getItem('artgen_ai_api_key') === null) {
       const hasBeenPrompted = sessionStorage.getItem('apiKeyPrompted');
       if (!hasBeenPrompted) {
        setShowApiKeyModal(true);
        sessionStorage.setItem('apiKeyPrompted', 'true');
       }
    }
  }, [apiKey]);

  const handleGenerateImage = useCallback(async (params: Omit<GenerationParams, 'aspectRatio'>) => { // aspectRatio removed from params
    if (!apiKey) {
      setError("API Key is missing. Please enter your API Key via the 'API Key' button in the header.");
      setShowApiKeyModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const fullPrompt = `${params.prompt}, ${params.style}`;
    
    try {
      // Pass params.exportFormat directly, aspectRatio is removed from generateImageApi call
      const result = await generateImageApi(fullPrompt, params.exportFormat, apiKey); 
      setGeneratedImage(`data:${result.mimeType};base64,${result.base64Image}`);
      setGeneratedImageMimeType(result.mimeType);
    } catch (err) {
      console.error("Image generation failed:", err);
      if (err instanceof Error) {
        setError(`Failed to generate image: ${err.message}`);
      } else {
        setError("An unknown error occurred during image generation.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]); // saveApiKey removed from dependencies as it's not directly used here

  const toggleReleaseNotes = () => {
    setShowReleaseNotes(prev => !prev);
  };

  const handleManageApiKey = () => {
    setShowApiKeyModal(true);
  };

  const handleSaveApiKey = (newApiKey: string) => {
    saveApiKey(newApiKey);
    setShowApiKeyModal(false);
    if (newApiKey && newApiKey.trim() !== '') {
        setError(null); 
    } else {
        setError("API Key was removed or not provided. Image generation will fail.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100">
      <Header 
        appName="ArtGen AI" 
        onShowReleaseNotes={toggleReleaseNotes}
        onManageApiKey={handleManageApiKey}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
          <ImageGeneratorForm
            onGenerate={handleGenerateImage}
            isLoading={isLoading}
            artisticStyles={ARTISTIC_STYLES}
            // aspectRatios={ASPECT_RATIOS} // REMOVED
            exportFormats={EXPORT_FORMATS}
            isApiKeySet={!!apiKey}
          />
           {!apiKey && (
            <div className="mt-4 p-3 bg-yellow-500/20 text-yellow-300 border border-yellow-500 rounded-lg text-sm">
              API Key not set. Click the "API Key" button in the header to enter your Google API Key.
            </div>
          )}
        </div>
        <div className="lg:w-2/3 bg-slate-800 p-6 rounded-xl shadow-2xl flex flex-col items-center justify-center border border-slate-700">
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 text-red-300 border border-red-500 rounded-lg w-full text-center">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}
          <ImageDisplay 
            imageDataUrl={generatedImage} 
            isLoading={isLoading}
            mimeType={generatedImageMimeType}
          />
        </div>
      </main>
      
      <Footer onShowReleaseNotes={toggleReleaseNotes} />
      
      {showReleaseNotes && (
        <ReleaseNotesModal
          releaseNotes={INITIAL_RELEASE_NOTES}
          onClose={toggleReleaseNotes}
        />
      )}
      {showApiKeyModal && (
        <ApiKeyModal
          currentApiKey={apiKey}
          onSave={handleSaveApiKey}
          onClose={() => setShowApiKeyModal(false)}
        />
      )}
    </div>
  );
};

export default App;
