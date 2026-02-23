
import { useState, useEffect, useCallback } from 'react';

export type AppPage = 'home' | 'create' | 'guide';

function getPageFromHash(): AppPage {
  const hash = window.location.hash.replace('#', '').replace('/', '');
  if (hash === 'create' || hash === 'guide') return hash;
  return 'home';
}

export function useHashRouter(): [AppPage, (page: AppPage) => void] {
  const [currentPage, setCurrentPage] = useState<AppPage>(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((page: AppPage) => {
    window.location.hash = page === 'home' ? '' : page;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  return [currentPage, navigate];
}
