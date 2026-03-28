import React, { useState, useEffect } from 'react';
import { trackEvent } from '../services/analytics';
import { safeStorage } from '../utils/storage';

interface PremiumModalProps {
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  
  useEffect(() => { trackEvent('PAYWALL_SHOWN'); }, []);

  const handleBuy = async () => {
    trackEvent('PAYWALL_CONVERSION_ATTEMPT');
    setStatus('processing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStatus('success');
    const today = new Date().toDateString();
    safeStorage.set(`quota_${today}`, 0);
    setTimeout(() => { onClose(); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-black mb-2">Quota Atteint (10/10)</h2>
        <p className="text-slate-600 mb-6">Passez Premium pour continuer.</p>
        
        <div className="bg-emerald-50 p-4 rounded-xl mb-2">
            <span className="text-3xl font-black text-slate-900">5 DT</span> / mois
        </div>
        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-4 rounded-xl mb-6 border border-emerald-200 relative">
            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">BEST</div>
            <span className="text-3xl font-black text-slate-900">50 DT</span> / an
        </div>

        <button onClick={handleBuy} disabled={status !== 'idle'} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold mb-3">
            {status === 'idle' ? 'Débloquer 💎' : status === 'processing' ? '...' : 'Succès ✅'}
        </button>
        <button onClick={onClose} className="text-slate-400 text-sm">Non merci</button>
      </div>
    </div>
  );
};