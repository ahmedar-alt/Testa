import { useState, useCallback } from 'react';
import { checkWithGemini } from '../services/geminiService';
import { AppMode } from '../types';
import { trackEvent } from '../services/analytics';

export const useTounesCheck = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quotaError, setQuotaError] = useState(false);
  
  // State global des résultats
  const [results, setResults] = useState<Record<string, any>>({});

  const performCheck = useCallback(async (mode: AppMode, query: string) => {
    setLoading(true);
    setError(null);
    setQuotaError(false);
    
    // On nettoie le résultat précédent pour ce mode pour forcer le refresh visuel
    setResults(prev => ({ ...prev, [mode]: null }));

    try {
      const data = await checkWithGemini(mode, query);
      
      if (data) {
        setResults(prev => ({ ...prev, [mode]: data }));
        trackEvent('SEARCH_SUCCESS', { mode });
      } else {
        setError("Aucun résultat.");
      }

    } catch (err: any) {
      console.error(err);
      if (err.message === "QUOTA_EXCEEDED") {
        setQuotaError(true);
      } else {
        setError("Une erreur est survenue. Réessaie.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const resetQuota = () => setQuotaError(false);

  return { loading, error, quotaError, results, performCheck, resetQuota };
};