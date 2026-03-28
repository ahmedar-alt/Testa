import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { OnboardingModal } from './components/OnboardingModal';
import { FactSkeleton, ReviewSkeleton, PriceSkeleton } from './components/SkeletonLoader';
import { StoryModal } from './components/StoryModal';
import { PremiumModal } from './components/PremiumModal';
import { checkFactWithGemini, checkReviewWithGemini, checkPriceWithGemini } from './services/geminiService';
import { AppMode } from './types';
import { safeStorage } from './utils/storage';

// Imports directs pour éviter les flashs
import { ResultCard } from './components/ResultCard';
import { ReviewCard } from './components/ReviewCard';
import { PriceCard } from './components/PriceCard';

function App() {
  const [mode, setMode] = useState<AppMode>('FACT');
  const [loading, setLoading] = useState(false);
  
  // On sépare les résultats pour éviter les conflits
  const [results, setResults] = useState<{FACT: any, REVIEW: any, PRICE: any}>({
    FACT: null,
    REVIEW: null,
    PRICE: null
  });
  
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [storyData, setStoryData] = useState<{data: any, mode: AppMode} | null>(null);
  const [quotaError, setQuotaError] = useState(false);

  useEffect(() => {
    if (!safeStorage.get('tounes_check_intro_seen', false)) setShowOnboarding(true);
  }, []);

  const handleCheck = async (query: string, currentMode: AppMode) => {
    setLoading(true);
    setError(null);
    setQuotaError(false);

    try {
      let data;
      if (currentMode === 'FACT') data = await checkFactWithGemini(query);
      else if (currentMode === 'REVIEW') data = await checkReviewWithGemini(query);
      else if (currentMode === 'PRICE') data = await checkPriceWithGemini(query);

      if (data) {
        // Mise à jour ciblée du résultat pour le mode en cours
        setResults(prev => ({ ...prev, [currentMode]: data }));
      } else {
        setError("Aucun résultat trouvé. Réessaie !");
      }
    } catch (err: any) {
      console.error("App Error:", err);
      if (err.message === "QUOTA_EXCEEDED") {
        setQuotaError(true);
      } else {
        setError("Problème de connexion. Vérifie ton internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentResult = results[mode];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {showOnboarding && <OnboardingModal onClose={() => { setShowOnboarding(false); safeStorage.set('tounes_check_intro_seen', true); }} />}
      {quotaError && <PremiumModal onClose={() => setQuotaError(false)} />}
      {storyData && <StoryModal data={storyData.data} mode={storyData.mode} onClose={() => setStoryData(null)} />}

      <Header />
      
      <main className="max-w-3xl mx-auto px-4 py-6 flex-grow w-full">
        <section className="mb-6 text-center">
          <h2 className={`font-black text-3xl sm:text-5xl ar-text tracking-tight transition-colors duration-300
            ${mode === 'FACT' ? 'text-red-600' : mode === 'REVIEW' ? 'text-orange-600' : 'text-emerald-600'}`} dir="rtl">
            {mode === 'FACT' ? 'زعمة صحيح اللي سمعتو ؟' : mode === 'REVIEW' ? 'وين ناكلو اليوم؟' : 'وين نلقى أرخص سوم ؟'}
          </h2>
        </section>

        <InputSection 
            onCheck={handleCheck} 
            isLoading={loading} 
            mode={mode} 
            setMode={setMode} 
        />

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-50 text-red-700 border border-red-200 font-bold text-center animate-fade-in-up">
            {error}
          </div>
        )}

        {loading && (
            <div className="animate-pulse">
                {mode === 'FACT' && <FactSkeleton />}
                {mode === 'REVIEW' && <ReviewSkeleton />}
                {mode === 'PRICE' && <PriceSkeleton />}
            </div>
        )}

        {/* Affichage persistant : On affiche le résultat s'il existe et qu'on ne charge pas */}
        {!loading && currentResult && mode === 'FACT' && (
            <ResultCard result={currentResult} onStory={() => setStoryData({data: currentResult, mode: 'FACT'})} />
        )}
        {!loading && currentResult && mode === 'REVIEW' && (
            <ReviewCard result={currentResult} onStory={() => setStoryData({data: currentResult, mode: 'REVIEW'})} />
        )}
        {!loading && currentResult && currentResult.items && mode === 'PRICE' && (
            <PriceCard result={currentResult} onStory={() => setStoryData({data: currentResult, mode: 'PRICE'})} />
        )}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto text-center text-slate-400 text-xs">
        <p>© 2025 Tounes Check. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;