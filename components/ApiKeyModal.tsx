import React, { useState } from 'react';

interface ApiKeyModalProps {
  currentApiKey: string | null;
  onSave: (key: string) => void;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ currentApiKey, onSave, onClose }) => {
  const [keyInput, setKeyInput] = useState<string>(currentApiKey || '');
  const handleSave = () => {
    onSave(keyInput.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100] backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="apiKeyModalTitle">
      <div className="bg-surface-100 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/8">
        <div className="flex justify-between items-center mb-6">
          <h2 id="apiKeyModalTitle" className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600">
            API Key Settings
          </h2>
          <button
            onClick={onClose}
            aria-label="Close API Key Modal"
            className="text-gray-600 hover:text-gray-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-5">
          <div>
            <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-400 mb-1.5">
              Google Gemini API Key
            </label>
            <input
              type="password"
              id="geminiApiKey"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Leave empty to use default proxy"
              className="w-full p-3 bg-surface-200 border border-white/8 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all"
            />
            <p className="mt-1.5 text-xs text-gray-600">
              Get your key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-400 hover:text-accent-300 underline underline-offset-2"
              >
                Google AI Studio
              </a>
            </p>
          </div>
          <div className="bg-surface-200/50 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-gray-500 leading-relaxed">
              Gemini works out of the box via built-in proxy. Provide your own API key to use your own quota or to unlock Pro tier models.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-surface-200 border border-white/8 hover:bg-surface-300 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 shadow-lg shadow-accent-500/20 transition-all"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};
