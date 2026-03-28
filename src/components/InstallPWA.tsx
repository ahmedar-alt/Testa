import React, { useState, useEffect } from 'react';
import { trackEvent } from '../services/analytics';

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si déjà installé
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // Détection Android / Desktop
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      trackEvent('PWA_PROMPT_AVAILABLE');
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Détection iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    trackEvent('INSTALL_CLICK', { platform: isIOS ? 'iOS' : 'Android/Desktop' });
    
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        trackEvent('INSTALL_ACCEPTED');
        setDeferredPrompt(null);
      } else {
        trackEvent('INSTALL_DISMISSED');
      }
    } else if (isIOS) {
      setShowIOSInstructions(true);
      trackEvent('IOS_INSTRUCTIONS_SHOWN');
    }
  };

  if (isInstalled || (!deferredPrompt && !isIOS)) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border border-slate-200"
      >
        <span>📲</span>
        <span className="hidden sm:inline">Installer l'app</span>
      </button>

      {/* Modal Instructions iOS */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in-up" onClick={() => setShowIOSInstructions(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button 
                onClick={() => setShowIOSInstructions(false)}
                className="absolute top-2 right-2 p-2 text-slate-400 hover:text-slate-600"
            >
                ✕
            </button>
            <div className="text-center">
                <div className="text-4xl mb-4">📲</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Installer sur iPhone</h3>
                <p className="text-sm text-slate-500 mb-6">
                    Apple ne permet pas l'installation automatique. Suivez ces 3 étapes simples :
                </p>
                
                <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="bg-slate-200 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">1</span>
                        <p className="text-sm text-slate-700">Appuyez sur le bouton <span className="font-bold">Partager</span> <img src="https://cdn-icons-png.flaticon.com/512/1358/1358023.png" className="w-4 h-4 inline opacity-60" alt="share" /> en bas de Safari.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="bg-slate-200 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">2</span>
                        <p className="text-sm text-slate-700">Cherchez et appuyez sur <span className="font-bold">"Sur l'écran d'accueil"</span>.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="bg-slate-200 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">3</span>
                        <p className="text-sm text-slate-700">Appuyez sur <span className="font-bold text-blue-600">Ajouter</span> en haut à droite.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};