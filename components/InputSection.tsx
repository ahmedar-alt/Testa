import React, { useState, useEffect, useRef } from 'react';
import { AppMode, TrendsData } from '../types';
import { getLiveTrends } from '../services/geminiService';

interface InputSectionProps {
  onCheck: (query: string, mode: AppMode) => void;
  isLoading: boolean;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const CONFIG = {
  LOADING: [
    "Chwaya sabr... ⏳", 
    "Hani nferkes... 🔍", 
    "Dkika bark... 🕐", 
    "Nraka7lek fi jaw... 🤖", 
    "Hani جاي... 🚀", 
    "Tounes Check y5ammem... 🧠"
  ],
  PLACEHOLDERS: {
    FACT: [
      "Colle l'info ou le lien ici...",
      "Ex: Le prix de l'essence va augmenter ?",
      "Ex: Rumeur sur le sucre...",
      "Ex: Concours CNSS truqué ?"
    ],
    REVIEW: [
      "Nom du resto, café, hôtel...",
      "Ex: Plan B",
      "Ex: Café Journal Gammarth",
      "Ex: Movenpick Sousse"
    ],
    PRICE: [
      "Nom du produit...",
      "Ex: Redmi Note 13",
      "Ex: Huile d'olive Châal",
      "Ex: Pack Lissage Brazilian Glow"
    ]
  },
  COLORS: { FACT: 'red', REVIEW: 'orange', PRICE: 'emerald' } as Record<AppMode, string>
};

export const InputSection: React.FC<InputSectionProps> = ({ onCheck, isLoading, mode, setMode }) => {
  const [input, setInput] = useState('');
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [loadingText, setLoadingText] = useState(CONFIG.LOADING[0]);
  const [placeholderText, setPlaceholderText] = useState(CONFIG.PLACEHOLDERS[mode][0]);
  
  const loadingInterval = useRef<any>(null);
  const placeholderInterval = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    setLoadingTrends(true);
    getLiveTrends().then(data => {
        if (mounted) {
            setTrends(data);
            setLoadingTrends(false);
        }
    }).catch(() => {
        if (mounted) setLoadingTrends(false);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (isLoading) {
        let i = 0;
        setLoadingText(CONFIG.LOADING[0]);
        loadingInterval.current = setInterval(() => {
            i = (i + 1) % CONFIG.LOADING.length;
            setLoadingText(CONFIG.LOADING[i]);
        }, 2000);
    } else {
        clearInterval(loadingInterval.current);
    }
    return () => clearInterval(loadingInterval.current);
  }, [isLoading]);

  useEffect(() => {
    setPlaceholderText(CONFIG.PLACEHOLDERS[mode][0]);
    let i = 0;
    const currentPlaceholders = CONFIG.PLACEHOLDERS[mode];
    
    placeholderInterval.current = setInterval(() => {
      i = (i + 1) % currentPlaceholders.length;
      setPlaceholderText(currentPlaceholders[i]);
    }, 3000);
    
    return () => clearInterval(placeholderInterval.current);
  }, [mode]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim()) {
      onCheck(input.trim(), mode);
    }
  };

  const color = CONFIG.COLORS[mode];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 overflow-hidden transition-all duration-300">
      
      <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 border-b border-slate-100">
        {(['FACT', 'REVIEW', 'PRICE'] as AppMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === m ? `bg-white text-${CONFIG.COLORS[m]}-600 shadow-sm ring-1 ring-black/5` : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="text-xl">{m === 'FACT' ? '🕵️‍♂️' : m === 'REVIEW' ? '📍' : '💸'}</span>
            <span>{m === 'FACT' ? 'Fact' : m === 'REVIEW' ? 'Spot' : 'Soum'}</span>
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
            <textarea
                className={`w-full p-4 bg-white text-slate-900 placeholder:text-slate-400 border-2 border-slate-200 rounded-xl outline-none transition-all focus:ring-4 focus:ring-${color}-50 focus:border-${color}-500 min-h-[80px] resize-none`}
                placeholder={placeholderText}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
            />

            {/* Section Trends avec Skeleton et Validation */}
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide items-center h-8">
               <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap py-1">🔥 Trends:</span>
               
               {loadingTrends ? (
                   // SKELETON ANIMATION
                   <div className="flex gap-2 animate-pulse">
                       <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
                       <div className="h-6 w-24 bg-slate-100 rounded-full"></div>
                       <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
                   </div>
               ) : (
                   trends && trends[mode]?.map((t: any, i: number) => {
                    // Sécurisation : on n'affiche que si c'est une string valide
                    const label = typeof t === 'string' ? t : (t?.title || t?.name || 'Trend');
                    return (
                        <button key={i} type="button" onClick={() => onCheck(label, mode)} className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium border bg-${color}-50 text-${color}-600 border-${color}-100 hover:bg-${color}-100 transition-colors`}>{label}</button>
                    );
                  })
               )}
            </div>

            <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`mt-4 w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2
                ${!input.trim() || isLoading ? 'bg-slate-300' : `bg-${color}-600 hover:bg-${color}-700 active:scale-95`}`}
            >
                {isLoading ? <><span className="animate-spin">⏳</span> {loadingText}</> : <>Vérifier 🔎</>}
            </button>
        </form>
      </div>
    </div>
  );
};