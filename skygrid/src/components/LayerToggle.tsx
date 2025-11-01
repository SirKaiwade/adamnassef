import { Route, AlertTriangle, Wind, Zap } from 'lucide-react';

interface LayerToggleProps {
  layers: {
    trails: boolean;
    airRoutes: boolean;
    restrictedAirspace: boolean;
    weather: boolean;
  };
  onToggle: (layer: keyof LayerToggleProps['layers']) => void;
}

export function LayerToggle({ layers, onToggle }: LayerToggleProps) {
  const layerOptions = [
    { key: 'trails' as const, label: 'Trails', icon: <Zap className="w-4 h-4" /> },
    { key: 'airRoutes' as const, label: 'Air Routes', icon: <Route className="w-4 h-4" /> },
    { key: 'restrictedAirspace' as const, label: 'Restricted', icon: <AlertTriangle className="w-4 h-4" /> },
    { key: 'weather' as const, label: 'Weather', icon: <Wind className="w-4 h-4" /> },
  ];

  return (
    <div className="absolute top-[140px] right-6 z-10 bg-[#0a0a0a] border border-[#1a1a1a] p-4">
      <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-4 font-medium">LAYERS</div>
      <div className="flex flex-col gap-2">
        {layerOptions.map((layer) => (
          <button
            key={layer.key}
            onClick={() => onToggle(layer.key)}
            className={`
              flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest
              border transition-all font-medium
              ${
                layers[layer.key]
                  ? 'bg-[#0a0a0a] border-slate-200 text-slate-200'
                  : 'bg-[#0a0a0a] border-[#1a1a1a] text-gray-500 hover:border-gray-600 hover:text-gray-400'
              }
            `}
          >
            {layer.icon}
            <span>{layer.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
