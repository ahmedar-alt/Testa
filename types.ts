
export interface Source {
  nom: string;
  lien: string;
  reliability?: 'high' | 'medium' | 'low';
}

export interface BaseResult {
  confidence?: number;
  timestamp?: number;
}

export interface FactCheckResult extends BaseResult {
  resume: string;
  verdict: "VRAI" | "FAUX" | "TROMPEUR" | "NON VÉRIFIABLE";
  explication_tunisien: string;
  sources: Source[];
  ui_hints: { couleur_verdict: string; icon: string; };
  is_tunisia_related: boolean;
}

export interface BranchInfo { nom: string; adresse: string; }

// NOUVEAU TYPE POUR UN ITEM DU TOP 3
export interface TopPlace {
  rank: number;
  nom: string;
  note: number;
  avis_count: string;
  desc_court: string;
}

export interface ReviewResult extends BaseResult {
  // Mode Fiche Unique
  nom: string;
  categorie: string;
  adresse: string;
  note_globale: number;
  nombre_avis: string;
  prix_niveau: "€" | "€€" | "€€€" | "Inconnu";
  conclusion_derja: string;
  points_forts: string[];
  points_faibles: string[];
  autres_branches?: BranchInfo[];
  is_found: boolean;
  is_tunisian: boolean;
  map_link?: string;
  
  // Mode Guide (Top 3)
  is_guide_mode?: boolean;
  top_list?: TopPlace[];
}

export interface ProductItem {
  titre: string; prix: number; devise: string; magasin: string; type_commerce: 'WEB' | 'SOCIAL';
  site_web?: string; lien: string | null; disponibilite: string;
  note?: number; nombre_avis?: number; source_reliability?: 'high' | 'medium' | 'low';
  is_boycotted?: boolean; boycott_alternative?: string;
}

export interface PriceResult extends BaseResult {
  produit_recherche: string;
  items: ProductItem[];
  conseil_achat_derja: string;
  prix_moyen: number;
  price_range?: { min: number; max: number };
  sources?: Source[];
}

export type AppMode = 'FACT' | 'REVIEW' | 'PRICE';
export interface TrendsData { FACT: string[]; REVIEW: string[]; PRICE: string[]; }
