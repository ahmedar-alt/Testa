import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

interface StoryModalProps {
  data: any;
  mode: 'FACT' | 'REVIEW' | 'PRICE';
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ data, mode, onClose }) => {
  const storyRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (storyRef.current) {
      setIsGenerating(true);
      try {
        const dataUrl = await toPng(storyRef.current, { cacheBust: true, pixelRatio: 3 });
        const link = document.createElement('a');
        link.download = `tounes-check-story-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        alert('Erreur image.');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const getTheme = () => {
    switch (mode) {
      case 'FACT': return { bg: 'bg-gradient-to-br from-red-600 to-red-800', icon: '🕵️‍♂️' };
      case 'REVIEW': return { bg: 'bg-gradient-to-br from-orange-500 to-orange-700', icon: '📍' };
      case 'PRICE': return { bg: 'bg-gradient-to-br from-emerald-600 to-emerald-800', icon: '💸' };
    }
  };
  const theme = getTheme();

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-sm flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
        
        <div ref={storyRef} className={`w-[320px] h-[568px] ${theme.bg} rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden text-white font-sans`}>
            
            <div className="relative z-10 flex justify-between items-center opacity-80">
                <span className="text-xs font-bold tracking-widest uppercase">Tounes Check 🇹🇳</span>
                <span className="text-xs font-bold">{new Date().toLocaleDateString('fr-FR')}</span>
            </div>

            {/* CAS PARTICULIER : MODE GUIDE (TOP 3) */}
            {mode === 'REVIEW' && data.is_guide_mode ? (
                <div className="flex-grow flex flex-col z-10 pt-4">
                    <h1 className="text-3xl font-black mb-1 leading-none drop-shadow-lg text-center">TOP 3</h1>
                    <p className="text-center font-bold opacity-80 mb-6 uppercase tracking-wide">{data.categorie || "ADRESSES"}</p>
                    
                    <div className="space-y-3">
                        {data.top_list?.slice(0,3).map((place:any, idx:number) => (
                            <div key={idx} className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/20 flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-slate-900 ${idx===0?'bg-yellow-400':idx===1?'bg-slate-300':'bg-orange-300'}`}>{idx+1}</div>
                                <div className="flex-grow">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-lg leading-tight">{place.nom}</span>
                                        <span className="text-yellow-300 font-bold">★ {place.note}</span>
                                    </div>
                                    <p className="text-xs opacity-80 mt-1 line-clamp-1 ar-text" dir="rtl">{place.desc_court}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // MODE CLASSIQUE (FACT, SOUM, REVIEW SOLO)
                <div className="flex-grow flex flex-col justify-center items-center text-center z-10">
                    <div className="text-6xl mb-6">{mode==='FACT' ? data.ui_hints.icon : mode==='PRICE'?'💸':'⭐'}</div>
                    
                    <h1 className="text-3xl font-black mb-4 uppercase leading-tight line-clamp-3">
                        {data.verdict || data.nom || data.produit_recherche}
                    </h1>

                    <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20 w-full overflow-hidden">
                        <p className="ar-text text-lg font-medium leading-relaxed line-clamp-5 text-center" dir="rtl">
                            {mode === 'REVIEW' ? `"${data.conclusion_derja}"` : (data.resume || data.conseil_achat_derja)}
                        </p>
                    </div>

                    {mode === 'PRICE' && (
                        <div className="mt-6 bg-white text-emerald-900 px-6 py-3 rounded-xl font-black text-4xl shadow-xl transform rotate-1">
                            {data.items?.[0]?.prix} DT
                        </div>
                    )}
                </div>
            )}

            <div className="relative z-10 text-center mt-4">
                <div className="text-[10px] opacity-60 uppercase tracking-widest font-bold">Vérifié par IA</div>
            </div>
        </div>

        <button onClick={handleDownload} disabled={isGenerating} className="w-full max-w-[320px] bg-white text-slate-900 py-3.5 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-xl flex items-center justify-center gap-2">
            {isGenerating ? 'Génération...' : '⬇️ Télécharger pour Instagram'}
        </button>
        <button onClick={onClose} className="text-white/60 text-sm">Fermer</button>
      </div>
    </div>
  );
};