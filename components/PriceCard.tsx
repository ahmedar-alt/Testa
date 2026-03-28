
import React, { useState, useMemo } from 'react';
import { PriceResult, ProductItem } from '../types';
import { ActionToolbar } from './ActionToolbar';

interface PriceCardProps {
  result: PriceResult;
  onStory?: () => void;
}

export const PriceCard: React.FC<PriceCardProps> = ({ result, onStory }) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Optimisation: useMemo pour ne pas retrier à chaque render inutilement
  const sortedItems = useMemo(() => {
    return [...result.items].sort((a, b) => {
        if (a.prix === 0) return 1;
        if (b.prix === 0) return -1;
        return sortOrder === 'asc' ? a.prix - b.prix : b.prix - a.prix;
    });
  }, [result.items, sortOrder]);

  const boycottItem = result.items.find(i => i.is_boycotted);
  const bestPrice = result.items.filter(i => i.prix > 0).sort((a,b)=>a.prix-b.prix)[0]?.prix;

  const generateSmartLink = (item: ProductItem) => {
    const cleanTitle = item.titre.replace('🇹🇳', '').replace(/\(.*?\)/g, '').trim(); 
    const query = item.type_commerce === 'SOCIAL' 
        ? `${item.magasin} Instagram Facebook Tunisie ${cleanTitle}`
        : `${item.site_web || item.magasin} ${cleanTitle} Tunisie prix`;
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  const shareText = `💸 Soum Check : ${result.produit_recherche}\nMeilleur prix : ${bestPrice} DT\n\n${result.conseil_achat_derja}\n\nVia Tounes Check`;

  return (
    <div className="animate-fade-in-up mt-8">
      {boycottItem && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm flex items-start gap-3">
            {/* Correction: Image forcée au lieu de l'emoji pour support Windows */}
            <img 
                src="https://flagcdn.com/w80/ps.png" 
                alt="Palestine Flag" 
                className="w-10 h-auto rounded shadow-sm object-cover border border-slate-200"
            />
            <div className="flex-1">
                <h4 className="font-bold text-red-700 text-sm">Alerte Boycott</h4>
                <p className="text-xs text-red-600 mt-1 flex flex-wrap items-center gap-1">
                  Marque ciblée. <span className="text-slate-600">Alternative :</span> 
                  <strong className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    {boycottItem.boycott_alternative || 'Marques locales 🇹🇳'}
                  </strong>
                </p>
            </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-emerald-50 p-6 border-b border-emerald-100 relative">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-emerald-700 font-bold text-xs uppercase bg-emerald-100 px-2 py-1 rounded">Soum Check</span>
                    <h2 className="text-2xl font-bold text-slate-800 mt-2">{result.produit_recherche}</h2>
                </div>
            </div>
            <div className="bg-white/60 p-3 rounded-lg border border-emerald-100/50">
                <p className="ar-text text-right text-emerald-900 font-medium" dir="rtl">💡 {result.conseil_achat_derja}</p>
            </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <span className="text-sm text-slate-500">{result.items.length} offres</span>
            <button onClick={() => setSortOrder(s => s === 'asc' ? 'desc' : 'asc')} className="text-xs font-bold text-emerald-600 bg-white border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors hover:bg-emerald-50">
                Prix {sortOrder === 'asc' ? 'Croissant ⬇️' : 'Décroissant ⬆️'}
            </button>
        </div>

        <div className="divide-y divide-slate-100">
            {sortedItems.map((item, idx) => {
                const isLocal = item.titre.includes('🇹🇳');
                const isBest = item.prix === bestPrice;
                return (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 gap-4 transition-colors">
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${item.type_commerce==='SOCIAL'?'bg-pink-50':(isLocal?'bg-emerald-50':'bg-slate-100')}`}>
                            {item.type_commerce==='SOCIAL'?'📸':(isLocal?'🇹🇳':'🛍️')}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">{item.titre}</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-1.5 rounded">{item.magasin}</span>
                                {isBest && <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 rounded animate-pulse">BEST DEAL</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <div className="text-right">
                            <div className="text-lg font-bold text-emerald-700">{item.prix > 0 ? item.prix.toFixed(3) : 'Sur demande'} <span className="text-xs">DT</span></div>
                            <div className="text-[10px] text-slate-400">{item.disponibilite}</div>
                        </div>
                        <a href={generateSmartLink(item)} target="_blank" rel="noreferrer" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 shadow-sm">Voir</a>
                    </div>
                </div>
            )})}
        </div>

        <div className="p-4 bg-slate-50">
            <ActionToolbar 
    shareText={shareText}
    mode="PRICE"
    onStory={onStory}
/>
        </div>
      </div>
    </div>
  );
};