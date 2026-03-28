
import React, { useState, useEffect } from 'react';

interface OnboardingModalProps {
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const slides = [
    {
      // Utilisation d'une image forcée pour le drapeau car l'emoji "TN" bug sur Windows
      image: "https://flagcdn.com/w160/tn.png", 
      title: "مرحبا bik fi Tounes Check",
      desc: "L'application IA 100% Tunisienne qui t'aide à ne plus te faire avoir. (Yezzi mel Ghacha !)",
      color: "bg-red-500"
    },
    {
      emoji: "🕵️‍♂️",
      title: "Fact Check - ثبت في المعلومة",
      desc: "Une rumeur sur Facebook ? Une info bizarre ? Colle le texte ici, on vérifie si c'est Vrai ou Faux en 3 secondes.",
      color: "bg-red-600"
    },
    {
      emoji: "📍",
      title: "Spot Check - وين ناكلو اليوم؟",
      desc: "Ne te fie pas aux photos Instagram. On scanne les vrais avis Google pour te dire si la makla est bonne.",
      color: "bg-orange-500"
    },
    {
      emoji: "💸",
      title: "Soum Check - شريت بالغالي؟",
      desc: "On compare les prix sur le Web et Instagram pour que tu achètes toujours au meilleur prix.",
      color: "bg-emerald-600"
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      setIsVisible(false);
      setTimeout(onClose, 300); // Attendre la fin de l'animation
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        {/* Header Coloré */}
        <div className={`${slides[step].color} p-8 text-center transition-colors duration-500`}>
            <div className="mb-4 h-16 flex items-center justify-center animate-[bounce_2s_infinite]">
                {/* Affichage conditionnel : Image pour le drapeau, Emoji pour le reste */}
                {(slides[step] as any).image ? (
                    <img 
                        src={(slides[step] as any).image} 
                        alt="Drapeau Tunisie" 
                        className="h-14 w-auto drop-shadow-md rounded-md"
                    />
                ) : (
                    <span className="text-6xl text-white">{(slides[step] as any).emoji}</span>
                )}
            </div>
            <h2 className="text-2xl font-bold text-white ar-text">{slides[step].title}</h2>
        </div>

        {/* Contenu */}
        <div className="p-8 text-center">
            <p className="text-slate-600 text-lg leading-relaxed mb-8 h-24 flex items-center justify-center">
                {slides[step].desc}
            </p>

            {/* Dots */}
            <div className="flex justify-center gap-2 mb-8">
                {slides.map((_, idx) => (
                    <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === step ? `w-8 ${slides[step].color.replace('bg-', 'bg-')}` : 'w-2 bg-slate-200'}`}></div>
                ))}
            </div>

            {/* Bouton */}
            <button 
                onClick={handleNext}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all ${slides[step].color}`}
            >
                {step === slides.length - 1 ? 'C\'est parti ! 🚀' : 'Suivant'}
            </button>
        </div>

      </div>
    </div>
  );
};