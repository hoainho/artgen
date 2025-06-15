
import React from 'react';

interface ImageDisplayProps {
  imageDataUrl: string | null;
  isLoading: boolean;
  mimeType: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageDataUrl, isLoading, mimeType }) => {
  const handleDownload = () => {
    if (imageDataUrl) {
      const link = document.createElement('a');
      link.href = imageDataUrl;
      const fileExtension = mimeType.split('/')[1] || 'png';
      link.download = `artgen_ai_image.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-slate-700/50 rounded-lg p-4 text-gray-300">
        <svg className="animate-spin h-12 w-12 text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl">Generating your masterpiece...</p>
        <p className="text-sm">This might take a moment.</p>
      </div>
    );
  }

  if (!imageDataUrl) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-slate-700/50 rounded-lg p-4 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.225.225 0 0 1 .225.225V8.7a.225.225 0 0 1-.45 0V8.475a.225.225 0 0 1 .225-.225Z" />
        </svg>
        <p className="text-xl">Your generated image will appear here.</p>
        <p className="text-sm">Enter a prompt and click "Generate Image" to start.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="bg-slate-700/50 p-2 rounded-lg shadow-lg">
        <img 
            src={imageDataUrl} 
            alt="Generated Art" 
            className="max-w-full max-h-[60vh] h-auto rounded-md object-contain" 
        />
      </div>
      <button
        onClick={handleDownload}
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors"
      >
        Download Image
      </button>
    </div>
  );
};
