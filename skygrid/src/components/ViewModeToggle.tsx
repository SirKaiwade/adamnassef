import { MapPin, Globe, Navigation, Plane } from 'lucide-react';
import type { ViewMode } from '../types';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  const modes: Array<{ value: ViewMode; label: string; icon: React.ReactNode }> = [
    { value: 'local', label: 'Local', icon: <MapPin className="w-4 h-4" /> },
    { value: 'regional', label: 'Regional', icon: <Navigation className="w-4 h-4" /> },
    { value: 'global', label: 'Global', icon: <Globe className="w-4 h-4" /> },
    { value: 'airport', label: 'Airport', icon: <Plane className="w-4 h-4" /> },
  ];

  return (
    <div className="absolute top-16 left-6 z-20 flex gap-2">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onViewModeChange(mode.value)}
          className={`
            flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest
            border transition-all font-medium
            ${
              viewMode === mode.value
                ? 'bg-[#0a0a0a] border-slate-200 text-slate-200'
                : 'bg-[#0a0a0a] border-[#1a1a1a] text-gray-500 hover:border-gray-600 hover:text-gray-400'
            }
          `}
        >
          {mode.icon}
          <span>{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
