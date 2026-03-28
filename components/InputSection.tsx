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
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 mb-6 overflow-hidden transition-all duration-300">
      
      {/* Sélecteur de Mode Agrandi : Plus haut, plus visuel */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border-b border-slate-100">
        {(['FACT', 'REVIEW', 'PRICE'] as AppMode[]).map((m) => {
          const isActive = mode === m;
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex flex-col items-center justify-center gap-2 py-6 rounded-2xl text-sm sm:text-base font-black transition-all duration-500 ${
                isActive 
                  ? `bg-white text-${CONFIG.COLORS[m]}-600 shadow-lg ring-1 ring-black/5 scale-[1.04]` 
                  : 'text-slate-400 hover:text-slate-500 bg-transparent'
              }`}
            >
              <span className={`text-4xl sm:text-5xl transition-all duration-700 transform ${
                  isActive 
                    ? 'grayscale-0 scale-110 drop-shadow-xl' 
                    : 'grayscale opacity-100 scale-95'
              }`}>
                {m === 'FACT' ? '🕵️‍♂️' : m === 'REVIEW' ? '📍' : '💸'}
              </span>
              <span className={`uppercase tracking-tighter text-[10px] sm:text-xs transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {m === 'FACT' ? 'Fact Check' : m === 'REVIEW' ? 'Spot Check' : 'Soum Check'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-5 sm:p-8">
        <form onSubmit={handleSubmit}>
            <textarea
                className={`w-full p-5 bg-white text-slate-900 placeholder:text-slate-400 border-2 border-slate-200 rounded-2xl outline-none transition-all focus:ring-4 focus:ring-${color}-50 focus:border-${color}-500 min-h-[100px] text-lg resize-none`}
                placeholder={placeholderText}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
            />

            {/* Trends Section : Gardée comme à l'origine */}
            <div className="mt-4 flex gap-2 overflow-x-auto overflow-y-hidden pb-1 scrollbar-hide items-center min-h-[40px]">
               <span className="text-[10px] font-black text-slate-400 uppercase whitespace-nowrap py-1 tracking-widest">🔥 TRENDS:</span>
               
               {loadingTrends ? (
                   <div className="flex gap-2 animate-pulse items-center">
                       <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
                       <div className="h-6 w-24 bg-slate-100 rounded-full"></div>
                   </div>
               ) : (
                   trends && trends[mode]?.map((t: any, i: number) => {
                    const label = typeof t === 'string' ? t : (t?.title || t?.name || 'Trend');
                    return (
                        <button 
                            key={i} 
                            type="button" 
                            onClick={() => onCheck(label, mode)} 
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border bg-${color}-50 text-${color}-700 border-${color}-100 hover:bg-${color}-100 transition-colors shadow-sm`}
                        >
                            {label}
                        </button>
                    );
                  })
               )}
            </div>

            <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`mt-6 w-full py-5 rounded-2xl font-black text-white text-xl transition-all shadow-xl flex items-center justify-center gap-3
                ${!input.trim() || isLoading ? 'bg-slate-300 shadow-none translate-y-0' : `bg-${color}-600 hover:bg-${color}-700 active:scale-95 hover:-translate-y-1`}`}
            >
                {isLoading ? <><span className="animate-spin text-2xl">⏳</span> {loadingText}</> : <>Vérifier 🔎</>}
            </button>
        </form>
      </div>
    </div>
  );
};
