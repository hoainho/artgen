
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
      <div className="w-full aspect-square max-h-[500px] rounded-2xl bg-surface-100 border border-white/5 flex flex-col items-center justify-center gap-4 overflow-hidden relative">
        <div className="absolute inset-0 shimmer-bg" />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-accent-500/30 border-t-accent-500 animate-spin" />
          <p className="text-sm text-gray-500">Creating your image...</p>
        </div>
      </div>
    );
  }

  if (!imageDataUrl) {
    return (
      <div className="w-full py-16 rounded-2xl border border-dashed border-white/8 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
        <p className="text-sm text-gray-600">Your creation will appear here</p>
      </div>
    );
  }

  return (
    <div className="w-full group relative">
      <div className="rounded-2xl overflow-hidden border border-white/8 animate-glow">
        <img
          src={imageDataUrl}
          alt="Generated Art"
          className="w-full max-h-[600px] object-contain bg-surface-50"
        />
      </div>
      <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
        <button
          onClick={handleDownload}
          className="px-5 py-2.5 bg-white/90 hover:bg-white text-gray-900 text-sm font-medium rounded-xl backdrop-blur-sm transition-all duration-150 flex items-center gap-2 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
};
