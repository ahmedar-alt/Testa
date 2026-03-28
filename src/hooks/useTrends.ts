export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

export interface Trends {
  factCheck: TrendData[];
  spotCheck: TrendData[];
  soumCheck: TrendData[];
}

// Données mockées pour la démo - à remplacer par vraie API
const mockTrends: Trends = {
  factCheck: [
    { date: '2024-01', value: 120, label: 'Vérifications' },
    { date: '2024-02', value: 150 },
    { date: '2024-03', value: 180 },
    { date: '2024-04', value: 220 },
    { date: '2024-05', value: 280 },
    { date: '2024-06', value: 320 },
  ],
  spotCheck: [
    { date: '2024-01', value: 80, label: 'Signalements' },
    { date: '2024-02', value: 95 },
    { date: '2024-03', value: 110 },
    { date: '2024-04', value: 130 },
    { date: '2024-05', value: 145 },
    { date: '2024-06', value: 170 },
  ],
  soumCheck: [
    { date: '2024-01', value: 200, label: 'Comparaisons' },
    { date: '2024-02', value: 240 },
    { date: '2024-03', value: 290 },
    { date: '2024-04', value: 350 },
    { date: '2024-05', value: 410 },
    { date: '2024-06', value: 480 },
  ],
};

export async function fetchTrends(): Promise<Trends> {
  // Simuler un appel API
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTrends), 500);
  });
}

export function getModeTrendKey(mode: 'FACT' | 'REVIEW' | 'PRICE'): keyof Trends {
  switch (mode) {
    case 'FACT': return 'factCheck';
    case 'REVIEW': return 'spotCheck';
    case 'PRICE': return 'soumCheck';
    default: return 'factCheck';
  }
}