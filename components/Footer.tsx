import React from 'react';

interface FooterProps {
  onShowReleaseNotes: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowReleaseNotes }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 text-center border-t border-white/5">
      <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
        <span>&copy; {currentYear} Hoai Nho</span>
        <span className="w-px h-3 bg-white/10" />
        <a href="https://www.hoainho.info" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">hoainho.info</a>
        <span className="w-px h-3 bg-white/10" />
        <button onClick={onShowReleaseNotes} className="hover:text-gray-400 transition-colors">Changelog</button>
      </div>
    </footer>
  );
};