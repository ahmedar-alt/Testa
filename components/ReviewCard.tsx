import React from 'react';
import { ReviewResult } from '../types';
import { ActionToolbar } from './ActionToolbar';

interface ReviewCardProps {
  result: ReviewResult;
  onStory?: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ result, onStory }) => {
  if (!result.is_found) {
    return (
      <div className="animate-fade-in-up mt-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
        <span className="text-3xl block mb-2">🤷‍♂️</span>
        <h3 className="font-bold text-slate-800">Spot introuvable</h3>
        <p className="text-slate-600 text-sm mt-2">Impossible de trouver "{result.nom}" sur Maps.</p>
      </div>
    );
  }

  // --- MODE GUIDE (TOP 3) SÉCURISÉ ---
  if (result.is_guide_mode && result.top_list && result.top_list.length > 0) {
    
    // Génération du texte de partage sécurisé
    const shareText = `🏆 Top ${result.categorie || 'Adresses'} :\n` + 
      result.top_list.slice(0,3).map(p => `${p.rank}. ${p.nom} (${p.note}/5)`).join('\n') + 
      `\nVia Tounes Check`;

    return (
        <div className="animate-fade-in-up mt-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                    <div className="flex items-center gap-2 mb-1 opacity-80">
                        <span className="text-xs font-bold uppercase tracking-widest">GUIDE TOUNES CHECK</span>
                    </div>
                    <h2 className="text-3xl font-black">{result.categorie || "Top Adresses"}</h2>
                    <p className="text-sm opacity-90 mt-1">Les mieux notés du moment 🔥</p>
                </div>

                <div className="p-4 space-y-4">
                    {result.top_list.map((place, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 bottom-0 w-1 ${idx===0?'bg-yellow-400':idx===1?'bg-slate-300':'bg-orange-700'}`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white ${idx===0?'bg-yellow-400':idx===1?'bg-slate-400':'bg-orange-800'}`}>
                                {place.rank}
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-800 text-lg">{place.nom}</h3>
                                    <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-sm">
                                        <span className="text-yellow-500 text-xs">★</span>
                                        <span className="font-bold text-sm text-slate-700">{place.note}</span>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-xs mt-1 ar-text" dir="rtl">{place.desc_court}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="px-6 pb-6">
                    <ActionToolbar shareText={shareText} mode="REVIEW" onStory={onStory} />
                </div>
            </div>
        </div>
    );
  }

  // --- MODE CLASSIQUE (FICHE UNIQUE) ---
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(<span key={i} className={i <= Math.round(result.note_globale) ? "text-yellow-400" : "text-slate-200"}>★</span>);
  }
  const shareTextSingle = `📍 Avis : ${result.nom} (${result.note_globale}/5)\n\n${result.conclusion_derja}\n\nVia Tounes Check`;

  return (
    <div className="animate-fade-in-up mt-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-orange-50 p-6 border-b border-orange-100 flex justify-between items-start">
            <div>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">{result.categorie}</span>
                <h2 className="text-2xl font-bold text-slate-800 my-1">{result.nom}</h2>
                <p className="text-slate-500 text-sm">{result.adresse}</p>
            </div>
            <div className="flex flex-col items-end">
                <div className="flex text-2xl">{stars}</div>
                <p className="text-sm font-bold text-slate-700">{result.note_globale}/5 <span className="text-slate-400 text-xs">({result.nombre_avis})</span></p>
            </div>
        </div>
        <div className="p-6">
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm mb-6 relative">
                <p className="ar-text text-right text-lg text-slate-800 font-medium" dir="rtl">{result.conclusion_derja}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <h4 className="font-bold text-green-700 text-sm mb-2">Points Forts</h4>
                    <ul className="space-y-1">{result.points_forts.map((pt, i) => <li key={i} className="text-sm text-slate-600 pl-2 border-l-2 border-green-200">{pt}</li>)}</ul>
                </div>
                <div>
                    <h4 className="font-bold text-red-700 text-sm mb-2">Points Faibles</h4>
                    <ul className="space-y-1">{result.points_faibles.map((pt, i) => <li key={i} className="text-sm text-slate-600 pl-2 border-l-2 border-red-200">{pt}</li>)}</ul>
                </div>
            </div>
            {result.map_link && <a href={result.map_link} target="_blank" rel="noreferrer" className="block w-full py-3 bg-slate-100 text-slate-700 text-center rounded-xl font-bold text-sm mb-4 hover:bg-slate-200">Voir sur Maps 🗺️</a>}
            <ActionToolbar shareText={shareTextSingle} mode="REVIEW" onStory={onStory} />
        </div>
      </div>
    </div>
  );
};