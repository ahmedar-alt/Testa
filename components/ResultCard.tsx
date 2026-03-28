
import React from 'react';
import { FactCheckResult } from '../types';
import { ActionToolbar } from './ActionToolbar';

interface ResultCardProps {
  result: FactCheckResult;
  onStory?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onStory }) => {
  const getVerdictColorClass = (color: string) => {
    switch (color) {
      case 'vert': return 'bg-green-100 text-green-800 border-green-200';
      case 'rouge': return 'bg-red-100 text-red-800 border-red-200';
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const shareText = `${result.ui_hints.icon} VERDICT : ${result.verdict}\n\n${result.resume}\n\nVérifié par Tounes Check`;

  return (
    <div className="animate-fade-in-up mt-8">
      {!result.is_tunisia_related && (
        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm">
          <p className="text-sm text-yellow-700 font-medium flex items-center gap-2">⚠️ Info hors contexte Tunisie.</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 relative overflow-hidden">
        
        <div className="flex flex-col items-start gap-4 mb-6">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getVerdictColorClass(result.ui_hints.couleur_verdict)} shadow-sm uppercase tracking-wide`}>
                {result.ui_hints.icon} {result.verdict}
            </span>
            <h2 className="text-xl font-bold text-slate-800 leading-snug">{result.resume}</h2>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-200 pb-2">
                <img src="https://flagcdn.com/w40/tn.png" alt="TN" className="h-5 w-auto shadow-sm rounded-sm" />
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Explication</h3>
            </div>
            <p className="ar-text text-right text-lg text-slate-800 leading-relaxed" dir="rtl">
                {result.explication_tunisien}
            </p>
        </div>

        <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sources</h3>
            <div className="flex flex-wrap gap-2">
                {result.sources.map((source, index) => (
                <a key={index} href={source.lien} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
                    <span className="truncate max-w-[150px]">{source.nom}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
                ))}
            </div>
        </div>

        <ActionToolbar 
    shareText={shareText}
    mode="FACT"
    onStory={onStory}
/>

      </div>
    </div>
  );
};