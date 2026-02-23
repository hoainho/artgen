import React from 'react';
import { AppPage } from '../hooks/useHashRouter';

interface FooterProps {
  onShowReleaseNotes: () => void;
  onNavigate: (page: AppPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowReleaseNotes, onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>&copy; {currentYear} Hoai Nho</span>
            <span className="w-px h-3 bg-white/10" />
            <a href="https://www.hoainho.info" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">hoainho.info</a>
          </div>
          <nav className="flex items-center gap-4 text-xs text-gray-600">
            <button onClick={() => onNavigate('home')} className="hover:text-gray-400 transition-colors">Home</button>
            <span className="w-px h-3 bg-white/10" />
            <button onClick={() => onNavigate('create')} className="hover:text-gray-400 transition-colors">Create</button>
            <span className="w-px h-3 bg-white/10" />
            <button onClick={() => onNavigate('guide')} className="hover:text-gray-400 transition-colors">Guide</button>
            <span className="w-px h-3 bg-white/10" />
            <button onClick={onShowReleaseNotes} className="hover:text-gray-400 transition-colors">Changelog</button>
          </nav>
        </div>
      </div>
    </footer>
  );
};
