import React from 'react';

interface FooterProps {
  onShowReleaseNotes: () => void;
}

const EmailIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
  </svg>
);

const WebsiteIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM10 17.5c-3.87 0-7-1.57-7-3.5 0-.5.13-.98.37-1.42L10 17.5Zm0-5.5c-2.06 0-3.88.6-5.13 1.52.56-.83 1.34-1.52 2.25-2.05C8.01 10.78 9 10.5 10 10.5c.32 0 .63.02.94.05L10 12Zm-.25-4.5H9.5c-.28 0-.5.22-.5.5s.22.5.5.5h.25c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H9.5c-.28 0-.5.22-.5.5s.22.5.5.5h.25c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5Zm6.04 7.42C14.15 15.61 12.16 15 10 15c-2.16 0-4.15.61-5.79 1.58A7.95 7.95 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8a7.95 7.95 0 0 1-.21 1.42Z" />
  </svg>
);


export const Footer: React.FC<FooterProps> = ({ onShowReleaseNotes }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-400 p-6 text-center border-t border-slate-700">
      <div className="container mx-auto">
        <div className="flex justify-center items-center space-x-4 mb-3">
          <a 
            href="mailto:hoainho.work@gmail.com" 
            aria-label="Email Hoai Nho"
            className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
          >
            <EmailIcon />
          </a>
          <a 
            href="https://www.hoainho.info" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Hoai Nho's Website"
            className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
          >
            <WebsiteIcon />
          </a>
        </div>
        <p className="mb-2">
          <button
            onClick={onShowReleaseNotes}
            className="text-sm hover:text-primary-400 transition-colors duration-200"
          >
            View Release Notes
          </button>
        </p>
        <p className="text-sm">&copy; {currentYear} Hoài Nhớ | Nick. All rights reserved.</p>
      </div>
    </footer>
  );
};