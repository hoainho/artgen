
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageGeneratorForm } from './components/ImageGeneratorForm';
import { ImageDisplay } from './components/ImageDisplay';
import { ReleaseNotesModal } from './components/ReleaseNotesModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateImageApi } from './services/geminiService';
import { GenerationParams } from './types';
import { INITIAL_RELEASE_NOTES, ARTISTIC_STYLES, EXPORT_FORMATS } from './constants';
import { useApiKey } from './hooks/useApiKey';

const App: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedImageMimeType, setGeneratedImageMimeType] = useState<string>('image/png');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showReleaseNotes, setShowReleaseNotes] = useState<boolean>(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);

  const [apiKey, saveApiKey] = useApiKey();

  const handleGenerateImage = useCallback(async (params: Omit<GenerationParams, 'aspectRatio'>) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const fullPrompt = `${params.prompt}, ${params.style}`;

    try {
      const result = await generateImageApi(fullPrompt, params.exportFormat, apiKey);
      setGeneratedImage(`data:${result.mimeType};base64,${result.base64Image}`);
      setGeneratedImageMimeType(result.mimeType);
    } catch (err) {
      console.error("Image generation failed:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during image generation.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const toggleReleaseNotes = () => {
    setShowReleaseNotes(prev => !prev);
  };

  const handleManageApiKey = () => {
    setShowApiKeyModal(true);
  };

  const handleSaveApiKey = (newApiKey: string) => {
    saveApiKey(newApiKey);
    setShowApiKeyModal(false);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <Header
        appName="ArtGen AI"
        onShowReleaseNotes={toggleReleaseNotes}
        onManageApiKey={handleManageApiKey}
      />

      <main className="flex-grow flex flex-col items-center px-4 sm:px-6 pt-8 pb-12">
        <div className="w-full max-w-2xl space-y-6">
          <ImageGeneratorForm
            onGenerate={handleGenerateImage}
            isLoading={isLoading}
            artisticStyles={ARTISTIC_STYLES}
            exportFormats={EXPORT_FORMATS}
            isApiKeySet={true}
          />

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
              {error}
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
