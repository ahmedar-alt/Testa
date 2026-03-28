import React, { useEffect, useState, useMemo } from 'react';
import { fetchTrends, getModeTrendKey, TrendData } from '../hooks/useTrends';
import { AppMode } from '../types';
import { safeStorage } from '../utils/storage';

interface TrendsDashboardProps {
  onClose: () => void;
  darkMode: boolean;
}

const COLORS = {
  FACT: '#dc2626',
  REVIEW: '#f59e0b',
  PRICE: '#10b981',
};

export const TrendsDashboard: React.FC<TrendsDashboardProps> = ({ onClose, darkMode }) => {
  const [trends, setTrends] = useState<any>(null);
  const [selectedMode, setSelectedMode] = useState<AppMode>(() => {
    return safeStorage.get('trends_mode') || 'FACT';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends().then((data) => {
      setTrends(data);
      setLoading(false);
    });
  }, []);

  const modeData = useMemo(() => {
    if (!trends) return null;
    const key = getModeTrendKey(selectedMode);
    return trends[key] as TrendData[];
  }, [trends, selectedMode]);

  // Calcul stats
  const stats = useMemo(() => {
    if (!modeData) return null;
    const values = modeData.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / values.length);
    const max = Math.max(...values);
    const growth = values.length >= 2 
      ? Math.round(((values[values.length - 1] - values[0]) / values[0]) * 100)
      : 0;
    return { avg, max, growth };
  }, [modeData]);

  // Build SVG path
  const svgPath = useMemo(() => {
    if (!modeData || modeData.length === 0) return '';
    const width = 600;
    const height = 300;
    const padding = 40;
    const maxVal = Math.max(...modeData.map(d => d.value)) * 1.1;
    const minVal = 0;
    
    const xScale = (i: number) => padding + (i / (modeData.length - 1)) * (width - 2 * padding);
    const yScale = (val: number) => height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    
    let path = `M ${xScale(0)} ${yScale(modeData[0].value)}`;
    for (let i = 1; i < modeData.length; i++) {
      const x = xScale(i);
      const y = yScale(modeData[i].value);
      // Smooth curve using quadratic bezier
      const prevX = xScale(i - 1);
      const prevY = yScale(modeData[i - 1].value);
      const cpX = (prevX + x) / 2;
      const cpY = (prevY + y) / 2;
      path += ` Q ${cpX} ${cpY} ${x} ${y}`;
    }
    
    // Area path
    const areaPath = `${path} L ${xScale(modeData.length - 1)} ${height - padding} L ${xScale(0)} ${height - padding} Z`;
    
    return { path, areaPath, xScale, yScale, width, height, padding, maxVal, minVal };
  }, [modeData]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const modeLabels = {
    FACT: 'Fact Check',
    REVIEW: 'Spot Check',
    PRICE: 'Soum Check'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">📈 Tendances Tounes Check</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition" aria-label="Fermer">
            ✕
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-900">
          {(Object.keys(modeLabels) as AppMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedMode === mode
                  ? 'bg-red-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {modeLabels[mode]}
            </button>
          ))}
        </div>

        {/* Chart Section */}
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[700px]">
            <svg viewBox={`0 0 ${svgPath.width} ${svgPath.height}`} className="w-full h-auto">
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(t => (
                <line
                  key={t}
                  x1={svgPath.padding}
                  y1={svgPath.height - svgPath.padding - t * (svgPath.height - 2 * svgPath.padding)}
                  x2={svgPath.width - svgPath.padding}
                  y2={svgPath.height - svgPath.padding - t * (svgPath.height - 2 * svgPath.padding)}
                  stroke={darkMode ? '#475569' : '#e2e8f0'}
                  strokeDasharray="4 4"
                />
              ))}
              
              {/* Area */}
              <path d={svgPath.areaPath} fill={COLORS[selectedMode]} fillOpacity={0.1} />
              
              {/* Line */}
              <path d={svgPath.path} fill="none" stroke={COLORS[selectedMode]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Points */}
              {modeData?.map((d, i) => (
                <circle
                  key={i}
                  cx={svgPath.xScale(i)}
                  cy={svgPath.yScale(d.value)}
                  r="5"
                  fill={COLORS[selectedMode]}
                  stroke="white"
                  strokeWidth="2"
                >
                  <title>{d.date}: {d.value} {d.label || ''}</title>
                </circle>
              ))}
              
              {/* X axis labels */}
              {modeData?.map((d, i) => (
                <text
                  key={i}
                  x={svgPath.xScale(i)}
                  y={svgPath.height - svgPath.padding + 20}
                  textAnchor="middle"
                  className="text-xs fill-slate-600 dark:fill-slate-400"
                >
                  {d.date}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 dark:bg-slate-900">
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Moyenne</p>
            <p className="text-2xl font-bold" style={{ color: COLORS[selectedMode] }}>{stats?.avg ?? 0}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Pic</p>
            <p className="text-2xl font-bold" style={{ color: COLORS[selectedMode] }}>{stats?.max ?? 0}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Croissance</p>
            <p className={`text-2xl font-bold ${(stats?.growth ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(stats?.growth ?? 0) >= 0 ? '+' : ''}{stats?.growth ?? 0}%
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
          Données de démonstration. Production: connexion à l'API analytics.
        </div>
      </div>
    </div>
  );
};