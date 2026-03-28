
import React, { ErrorInfo, ReactNode, Component } from "react";

// Props interface including children. Making it optional resolves some JSX validation errors.
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary is a class component that catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
// Fix: Use Component directly and explicitly extend it with generic types to ensure 'props' and 'state' are correctly inherited and recognized.
export class ErrorBoundary extends Component<Props, State> {
  // Fix: Explicitly define the state property to avoid "Property 'state' does not exist on type 'ErrorBoundary'" error.
  public state: State = {
    hasError: false,
  };

  // Fix: Explicitly defining the constructor and calling super(props) ensures that 'this.props' is correctly initialized in the component instance.
  constructor(props: Props) {
    super(props);
  }

  /**
   * getDerivedStateFromError is a static method used to update the state after an error occurs.
   */
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  /**
   * componentDidCatch is used to perform side effects like logging the error or cleaning up local storage.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    // Targeted cache cleanup after a crash to prevent persistent failure states.
    try {
        console.warn("Nettoyage sélectif du cache suite au crash...");
        // Remove only result caches and history, preserving critical user settings like quota.
        Object.keys(localStorage).forEach(key => {
            if (key.includes('tc_v4_cache') || key.includes('history')) {
                localStorage.removeItem(key);
            }
        });
    } catch(e) {
      // Ignore cleanup errors
    }
  }

  // Fix: The render method now correctly identifies 'this.state' and 'this.props' as members inherited from the Component base class.
  public render(): ReactNode {
    // If an error has been caught, display the fallback UI.
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

    // Fix: Default behavior is to render the child components using this.props.children, now correctly identified.
    return this.props.children;
  }
}
