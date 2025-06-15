import React from 'react';

interface HeaderProps {
  appName: string;
  onShowReleaseNotes: () => void;
  onManageApiKey: () => void;
}

const ApiKeyIcon: React.FC = () => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
</svg>
);


export const Header: React.FC<HeaderProps> = ({ appName, onShowReleaseNotes, onManageApiKey }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md shadow-lg p-4 sticky top-0 z-50 border-b border-slate-700">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img 
            src="../logo.png" 
            alt="Website Icon" 
            className="h-10 w-10 rounded-full border-2 border-primary-500" 
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-pink-500">
            {appName}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onManageApiKey}
            className="flex items-center text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200"
            aria-label="Manage API Key"
          >
            <ApiKeyIcon />
            API Key
          </button>
          <button
            onClick={onShowReleaseNotes}
            className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200"
          >
            Release Notes
          </button>
        </div>
      </div>
    </header>
  );
};