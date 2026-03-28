import React, { ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    // NETTOYAGE CIBLE DU CACHE (Au lieu de tout vider)
    try {
        console.warn("Nettoyage sélectif du cache suite au crash...");
        // On supprime seulement les caches de résultats, pas le quota ni le tuto
        Object.keys(localStorage).forEach(key => {
            if (key.includes('tc_v4_cache') || key.includes('history')) {
                localStorage.removeItem(key);
            }
        });
    } catch(e) {}
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center font-sans">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl">🤕</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-3">Oups, petit problème technique !</h2>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">
            L'application a eu un petit vertige.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-1"
          >
            Relancer l'app 🔄
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}