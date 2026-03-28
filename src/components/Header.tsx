import React from 'react';
import { InstallPWA } from './InstallPWA';

interface HeaderProps {
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode = false, toggleDarkMode }) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-4 px-4 sm:px-6 sticky top-0 z-50 dark:bg-slate-900 dark:border-slate-700">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer" title="Retour au début">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-xl">🛡️</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight dark:text-white">Tounes Check</h1>
            <p className="text-xs text-slate-500 font-medium dark:text-slate-400">Fact • Spot • Soum</p>
          </div>
        </a>
        
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          {toggleDarkMode && (
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
              title={darkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {darkMode ? (
                <span className="text-xl">☀️</span>
              ) : (
                <span className="text-xl">🌙</span>
              )}
            </button>
          )}
          
          {/* Bouton d'installation PWA */}
          <InstallPWA />
        </div>
      </div>
    </header>
  );
};