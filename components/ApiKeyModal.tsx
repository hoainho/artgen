import React, { useState } from 'react';

interface ApiKeyModalProps {
  currentApiKey: string | null;
  onSave: (apiKey: string) => void;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ currentApiKey, onSave, onClose }) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>(currentApiKey || '');

  const handleSave = () => {
    if (apiKeyInput.trim()) {
      onSave(apiKeyInput.trim());
    } else {
      // Optionally, show an error if the key is empty, or just close
      onSave(''); // Save empty string to signify removal or rely on parent logic
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[100] backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="apiKeyModalTitle">
      <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 id="apiKeyModalTitle" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-pink-500">
            Enter API Key
          </h2>
          <button
            onClick={onClose}
            aria-label="Close API Key Modal"
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
              Google API Key
            </label>
            <input
              type="password" // Use password type to obscure the key
              id="apiKey"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Enter your Google API Key"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-100 placeholder-gray-400 transition-colors"
            />
          </div>
          <p className="text-xs text-gray-400">
            You can obtain your API key from{' '}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary-400 hover:underline"
            >
              Google AI Studio
            </a>. 
            The key will be stored locally in your browser.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0">
           <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary-500 transition-all duration-200"
          >
            Save Key
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 border border-slate-600 rounded-lg shadow-sm text-base font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary-500 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};