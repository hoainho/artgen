import { useState, useEffect, useCallback } from 'react';

const API_KEY_STORAGE_KEY = 'artgen_ai_api_key';

export const useApiKey = (): [string | null, (apiKey: string) => void, () => void] => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    } catch (error) {
      console.error("Failed to retrieve API key from localStorage:", error);
    }
    setIsInitialized(true); 
  }, []);

  const saveApiKey = useCallback((newApiKey: string) => {
    try {
      if (newApiKey && newApiKey.trim() !== '') {
        localStorage.setItem(API_KEY_STORAGE_KEY, newApiKey);
        setApiKey(newApiKey);
      } else {
        // If newApiKey is empty or whitespace, treat as removal
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        setApiKey(null);
      }
    } catch (error) {
      console.error("Failed to save API key to localStorage:", error);
    }
  }, []);

  const clearApiKey = useCallback(() => {
     try {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        setApiKey(null);
    } catch (error) {
      console.error("Failed to clear API key from localStorage:", error);
    }
  }, []);


  // Return apiKey only after initialization to avoid flash of incorrect state
  return [isInitialized ? apiKey : null, saveApiKey, clearApiKey];
};