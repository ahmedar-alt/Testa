import { GoogleGenAI } from "@google/genai";
import { TrendsData, AppMode } from "../types";
import { FACT_SYSTEM_INSTRUCTION, SPOT_SYSTEM_INSTRUCTION, SOUM_SYSTEM_INSTRUCTION, TRENDS_SYSTEM_INSTRUCTION } from "./prompts";
import { safeStorage } from "../utils/storage";

const FALLBACK_TRENDS: TrendsData = {
  FACT: ["Grèves Transport", "Coupure Eau SONEDE", "Météo Tunisie", "Match Équipe Nationale"],
  REVIEW: ["Plan B", "Smug's", "Cosmitto", "Ben Rahim", "Le Saf Saf"],
  PRICE: ["Huile d'olive", "Redmi 13C", "Pack Lissage", "Café Bondin", "Thon Sidi Daoud"]
};

// Durée de vie du cache des trends : 1 Heure (3600000 ms)
const TRENDS_CACHE_TTL = 3600 * 1000;
const TRENDS_CACHE_KEY = 'tc_trends_v5_cache';

const extractJSON = (text?: string): any => {
  if (!text) return null;
  try {
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const match = cleanText.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return null;
  } catch (e) {
    return null;
  }
};

const getAI = () => {
  const apiKey = process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

export const checkWithGemini = async (mode: AppMode, query: string): Promise<any> => {
  const ai = getAI();
  const quotaKey = `quota_${new Date().toDateString()}`;
  const used = safeStorage.get<number>(quotaKey, 0);
  if (used >= 15) throw new Error("QUOTA_EXCEEDED");

  let sysPrompt = "";
  let tools: any[] = [{ googleSearch: {} }]; 
  let modelName = "gemini-3-flash-preview";
  let temperature = 0.3;

  if (mode === 'FACT') {
    sysPrompt = FACT_SYSTEM_INSTRUCTION;
  } else if (mode === 'REVIEW') {
    sysPrompt = SPOT_SYSTEM_INSTRUCTION;
    // Combinaison Maps + Search pour plus de robustesse
    tools = [{ googleMaps: {} }, { googleSearch: {} }];
    // On force la version stable
    modelName = "gemini-2.5-flash"; 
  } else {
    sysPrompt = SOUM_SYSTEM_INSTRUCTION;
    temperature = 0.2;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Analyse ceci pour la Tunisie : ${query}. Réponds uniquement en JSON valide (Pas de Markdown, pas de texte).`,
      config: { 
        systemInstruction: sysPrompt, 
        tools,
        temperature
      },
    });

    const data = extractJSON(response.text);
    if (!data) throw new Error("Format JSON invalide");

    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const chunks = response.candidates[0].groundingMetadata.groundingChunks;
      const groundingSources = chunks.map((chunk: any) => {
        if (chunk.web) return { nom: chunk.web.title || 'Web', lien: chunk.web.uri };
        if (chunk.maps) return { nom: chunk.maps.title || 'Maps', lien: chunk.maps.uri };
        return null;
      }).filter(Boolean);
      
      if (groundingSources.length > 0) {
        data.sources = [...(data.sources || []), ...groundingSources];
      }
    }

    safeStorage.set(quotaKey, used + 1);
    return data;

  } catch (e: any) {
    if (e.message === "QUOTA_EXCEEDED") throw e;
    throw new Error("Erreur IA");
  }
};

export const getLiveTrends = async (): Promise<TrendsData> => {
  const cached = safeStorage.get<{data: TrendsData, timestamp: number} | null>(TRENDS_CACHE_KEY, null);
  const now = Date.now();

  if (cached && (now - cached.timestamp < TRENDS_CACHE_TTL)) {
    return cached.data;
  }

  const ai = getAI();
  const dateContext = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: "Génère les tendances Tunisie actuelles en JSON.",
      config: { 
        systemInstruction: TRENDS_SYSTEM_INSTRUCTION(dateContext), 
        tools: [{ googleSearch: {} }],
        temperature: 0.5 
      }
    });
    
    const data = extractJSON(response.text);
    
    if (!data || typeof data !== 'object') {
      return FALLBACK_TRENDS;
    }

    const cleanData: TrendsData = {
      FACT: Array.isArray(data.FACT) ? data.FACT.slice(0,4) : FALLBACK_TRENDS.FACT,
      REVIEW: Array.isArray(data.REVIEW) ? data.REVIEW.slice(0,4) : FALLBACK_TRENDS.REVIEW,
      PRICE: Array.isArray(data.PRICE) ? data.PRICE.slice(0,4) : FALLBACK_TRENDS.PRICE,
    };

    safeStorage.set(TRENDS_CACHE_KEY, { data: cleanData, timestamp: now });
    
    return cleanData;

  } catch (e) {
    return FALLBACK_TRENDS;
  }
};

export const checkFactWithGemini = (q: string) => checkWithGemini('FACT', q);
export const checkReviewWithGemini = (q: string) => checkWithGemini('REVIEW', q);
export const checkPriceWithGemini = (q: string) => checkWithGemini('PRICE', q);