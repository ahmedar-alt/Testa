
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { FactSkeleton, ReviewSkeleton, PriceSkeleton } from './components/SkeletonLoader';
import { checkFactWithGemini, checkReviewWithGemini, checkPriceWithGemini } from './services/geminiService';
import { AppMode } from './types';
import { safeStorage } from './utils/storage';

// Lazy load modales pour réduire bundle initial
const OnboardingModal = lazy(() => import('./components/OnboardingModal'));
const StoryModal = lazy(() => import('./components/StoryModal'));
const PremiumModal = lazy(() => import('./components/PremiumModal'));
const TrendsDashboard = lazy(() => import('./components/TrendsDashboard'));

// Imports explicites
import { ResultCard } from './components/ResultCard';
import { ReviewCard } from './components/ReviewCard';
import { PriceCard } from './components/PriceCard';

function App() {
  const [mode, setMode] = useState<AppMode>('FACT');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = safeStorage.get('darkMode');
      if (stored !== null) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [showTrends, setShowTrends] = useState(false);
  
  const [results, setResults] = useState<{FACT: any, REVIEW: any, PRICE: any}>({
    FACT: null,
    REVIEW: null,
    PRICE: null
  });
  
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [storyData, setStoryData] = useState<{data: any, mode: AppMode} | null>(null);
  const [quotaError, setQuotaError] = useState(false);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    safeStorage.set('darkMode', darkMode);
  }, [darkMode]);

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
        setResults(prev => ({ ...prev, [currentMode]: data }));
      } else {
        setError("Aucun résultat trouvé. Réessaie !");
      }
    } catch (err: any) {
      console.error("App Error:", err);
      if (err.message === "QUOTA_EXCEEDED") {
        setQuotaError(true);
      } else if (err.message.includes("CONFIG_ERROR")) {
        setError("⚠️ Configuration manquante : La clé API n'est pas activée sur le serveur. Veuillez redéployer sur Cloudflare.");
      } else {
        setError(err.message || "Problème de connexion. Vérifiez votre internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentResult = results[mode];

  // Lazy modales avec Suspense fallback
  const renderModal = (component: React.ReactNode) => (
    <Suspense fallback={null}>
      {component}
    </Suspense>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans dark:bg-slate-900">
      {showOnboarding && renderModal(<OnboardingModal onClose={() => { setShowOnboarding(false); safeStorage.set('tounes_check_intro_seen', true); }} />)}
      {quotaError && renderModal(<PremiumModal onClose={() => setQuotaError(false)} />)}
      {storyData && renderModal(<StoryModal data={storyData.data} mode={storyData.mode} onClose={() => setStoryData(null)} />)}
      {showTrends && renderModal(<TrendsDashboard onClose={() => setShowTrends(false)} darkMode={darkMode} />)}

      <Header 
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)} 
        onTrendsClick={() => setShowTrends(true)}
      />
      
      <main id="main-content" className="max-w-3xl mx-auto px-4 py-6 flex-grow w-full">
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
          <div className="p-5 mb-6 rounded-2xl bg-red-50 text-red-700 border border-red-200 font-bold text-center animate-fade-in-up shadow-sm">
            {error}
            <button onClick={() => window.location.reload()} className="block mx-auto mt-3 text-xs underline opacity-70">Actualiser la page</button>
          </div>
        )}

        {loading && (
            <div className="animate-pulse">
                {mode === 'FACT' && <FactSkeleton />}
                {mode === 'REVIEW' && <ReviewSkeleton />}
                {mode === 'PRICE' && <PriceSkeleton />}
            </div>
        )}

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
