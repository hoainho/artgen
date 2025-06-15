import React from 'react';
import { ReleaseNote } from '../types';

interface ReleaseNotesModalProps {
  releaseNotes: ReleaseNote;
  onClose: () => void;
}

export const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ releaseNotes, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[100] backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="releaseNotesModalTitle">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 id="releaseNotesModalTitle" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-pink-500">
            Release Notes - v{releaseNotes.version}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close Release Notes"
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-400 mb-4">Date: {releaseNotes.date}</p>
        <div className="prose prose-invert prose-sm md:prose-base max-w-none text-gray-300">
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Changes & Improvements:</h3>
          <ul className="list-disc pl-5 space-y-2">
            {releaseNotes.changes.map((change, index) => (
              <li key={index}>{change}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};