import React from 'react';
import { trackEvent } from '../services/analytics';

interface ActionToolbarProps {
  shareText: string;
  mode: string;
  onStory?: () => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({ shareText, mode, onStory }) => {
  const handleShare = () => {
    trackEvent('SHARE_CLICK', { mode });
    if (navigator.share) {
      navigator.share({ title: 'Tounes Check', text: shareText, url: 'https://tounes-check.pages.dev' }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Texte copié !');
    }
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    trackEvent('FEEDBACK', { type, mode });
    alert(type === 'positive' ? 'Merci ! 💪' : 'Merci, on note ça. 🙏');
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
        {/* Share Button */}
        <button onClick={handleShare} className="flex-grow py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
            <span>Partager</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        </button>

        {/* Story Button */}
        {onStory && (
            <button onClick={onStory} className="w-12 py-3 bg-gradient-to-tr from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center text-xl">
                📸
            </button>
        )}
        
        {/* Feedback (Simple Pouce) */}
        <div className="flex gap-1 ml-1 border-l pl-3 border-slate-100">
            <button onClick={() => handleFeedback('positive')} className="text-xl hover:scale-110 transition-transform p-1">👍</button>
            <button onClick={() => handleFeedback('negative')} className="text-xl hover:scale-110 transition-transform p-1">👎</button>
        </div>
    </div>
  );
};