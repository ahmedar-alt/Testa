
import { GoogleGenAI } from "@google/genai";
import { TrendsData, AppMode } from "../types";
import { FACT_SYSTEM_INSTRUCTION, SPOT_SYSTEM_INSTRUCTION, SOUM_SYSTEM_INSTRUCTION, TRENDS_SYSTEM_INSTRUCTION } from "./prompts";
import { safeStorage } from "../utils/storage";

const FALLBACK_TRENDS: TrendsData = {
  FACT: ["Prix de l'essence", "Concours CNSS 2025", "Grève des transports", "Coupure d'eau SONEDE"],
  REVIEW: ["Plan B", "Smug's", "Cosmitto", "Ben Rahim", "Le Saf Saf"],
  PRICE: ["Huile d'olive Châal", "Redmi 13C", "Pack Lissage", "Café Bondin", "Thon Sidi Daoud"]
};

const extractJSON = (text: string | undefined): any => {
  if (!text) return null;
  try {
    let cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const match = cleanText.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return null;
  } catch (e) {
    console.error("JSON Parse Error", e);
    return null;
  }
};

const checkQuota = () => {
  const key = `quota_${new Date().toDateString()}`;
  const used = safeStorage.get<number>(key, 0);
  if (used >= 10) throw new Error("QUOTA_EXCEEDED");
};

const incrementQuota = () => {
  const key = `quota_${new Date().toDateString()}`;
  const used = safeStorage.get<number>(key, 0);
  safeStorage.set(key, used + 1);
};

export const checkWithGemini = async (mode: AppMode, query: string): Promise<any> => {
  checkQuota();
  
  // Utilisation directe de process.env.API_KEY pour le remplacement statique de Vite
  if (!process.env.API_KEY || process.env.API_KEY === "undefined") {
    throw new Error("CONFIG_ERROR: Clé API manquante dans le build. Vérifiez vos variables Cloudflare.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let sysPrompt = "";
  let tools: any[] = [];
  let modelName = "gemini-3-flash-preview";
  
  if (mode === 'FACT') {
    sysPrompt = FACT_SYSTEM_INSTRUCTION;
    tools = [{ googleSearch: {} }];
  } else if (mode === 'REVIEW') {
    sysPrompt = SPOT_SYSTEM_INSTRUCTION;
    tools = [{ googleMaps: {} }];
    modelName = "gemini-2.5-flash";
  } else {
    sysPrompt = SOUM_SYSTEM_INSTRUCTION;
    tools = [{ googleSearch: {} }];
  }

  const userPrompt = `${query} (Consigne : Résumé en Français, mais l'explication en Derja doit être en alphabet ARABE uniquement. Pour Fact Check, inclus impérativement les sources avec nom et lien URL).`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: { 
        systemInstruction: sysPrompt, 
        tools,
        temperature: 0.2 
      },
    });

    const data = extractJSON(response.text);
    if (!data) throw new Error("Le modèle a renvoyé un format invalide. Réessayez.");

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      const links = groundingChunks.map((chunk: any) => {
        if (chunk.web) return { nom: chunk.web.title || "Source Web", lien: chunk.web.uri };
        if (chunk.maps) return { nom: chunk.maps.title || "Google Maps", lien: chunk.maps.uri };
        return null;
      }).filter(Boolean);

      if (links.length > 0) {
        if (mode === 'FACT') {
          data.sources = [...(data.sources || []), ...links];
        } else if (mode === 'PRICE') {
          data.sources = links;
        } else if (mode === 'REVIEW') {
          const mapLink = links.find((l: any) => l.nom === "Google Maps")?.lien;
          if (mapLink) data.map_link = mapLink;
        }
      }
    }

    incrementQuota();
    return data;
  } catch (e: any) {
    console.error("Gemini Error:", e);
    if (e.message.includes("API key not valid")) throw new Error("Clé API invalide sur Cloudflare.");
    if (e.message === "QUOTA_EXCEEDED") throw e;
    throw new Error(e.message || "Erreur de connexion IA.");
  }
};

export const getLiveTrends = async (): Promise<TrendsData> => {
  try {
    if (!process.env.API_KEY || process.env.API_KEY === "undefined") return FALLBACK_TRENDS;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Donne les tendances actuelles en Tunisie en FRANÇAIS (JSON strict).",
      config: { 
        systemInstruction: TRENDS_SYSTEM_INSTRUCTION, 
        tools: [{ googleSearch: {} }],
        temperature: 0.2
      }
    });
    
    const data = extractJSON(response.text);
    if (!data) return FALLBACK_TRENDS;

    return {
      FACT: (Array.isArray(data?.FACT) && data.FACT.length > 0) ? data.FACT : FALLBACK_TRENDS.FACT,
      REVIEW: (Array.isArray(data?.REVIEW) && data.REVIEW.length > 0) ? data.REVIEW : FALLBACK_TRENDS.REVIEW,
      PRICE: (Array.isArray(data?.PRICE) && data.PRICE.length > 0) ? data.PRICE : FALLBACK_TRENDS.PRICE,
    };
  } catch (e) {
    console.error("Trends error:", e);
    return FALLBACK_TRENDS;
  }
};

export const checkFactWithGemini = (q: string) => checkWithGemini('FACT', q);
export const checkReviewWithGemini = (q: string) => checkWithGemini('REVIEW', q);
export const checkPriceWithGemini = (q: string) => checkWithGemini('PRICE', q);
