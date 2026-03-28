
import { useState, useCallback, useEffect, useRef } from 'react';

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synth.current = window.speechSynthesis;

      const loadVoices = () => {
        const voices = synth.current?.getVoices() || [];
        // Priorité : Arabe > Français > Anglais
        voiceRef.current = 
          voices.find(v => v.lang.includes('ar')) || 
          voices.find(v => v.lang.includes('fr')) || 
          null;
      };

      loadVoices();
      if (synth.current.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!synth.current) return;

    if (synth.current.speaking) {
      synth.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) {
        utterance.voice = voiceRef.current;
        // Ajustement langue si voix non trouvée
        utterance.lang = voiceRef.current.lang; 
    } else {
        utterance.lang = 'fr-FR'; // Fallback ultime
    }

    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.current.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (synth.current) {
        synth.current.cancel();
        setIsSpeaking(false);
    }
  }, []);

  return { isSpeaking, speak, stop };
};