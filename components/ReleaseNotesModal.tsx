import React from 'react';
import { ReleaseNote } from '../types';

interface ReleaseNotesModalProps {
  releaseNotes: ReleaseNote;
  onClose: () => void;
}

export const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ releaseNotes, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100] backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="releaseNotesModalTitle">
      <div className="bg-surface-100 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-white/8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 id="releaseNotesModalTitle" className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600">
              Release Notes
            </h2>
            <p className="text-sm text-gray-500 mt-1">v{releaseNotes.version} · {releaseNotes.date}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Release Notes"
            className="text-gray-600 hover:text-gray-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Changes & Improvements</h3>
          <ul className="space-y-2">
            {releaseNotes.changes.map((change, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0"></span>
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-surface-200 border border-white/8 hover:bg-surface-300 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};