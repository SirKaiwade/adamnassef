import { MapPin, Globe, Navigation, Plane } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { ViewMode } from '../types';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  const { theme } = useTheme();
  const modes: Array<{ value: ViewMode; label: string; icon: React.ReactNode }> = [
    { value: 'local', label: 'Local', icon: <MapPin className="w-4 h-4" /> },
    // { value: 'regional', label: 'Regional', icon: <Navigation className="w-4 h-4" /> }, // Hidden - local tracking only
    // { value: 'global', label: 'Global', icon: <Globe className="w-4 h-4" /> }, // Hidden - local tracking only
    // { value: 'airport', label: 'Airport', icon: <Plane className="w-4 h-4" /> }, // Hidden for now
  ];

  return (
    <div className="absolute top-16 left-6 z-20 flex gap-2">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onViewModeChange(mode.value)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded text-[10px] uppercase tracking-widest
            border transition-all font-medium
            ${
              viewMode === mode.value
                ? theme === 'light'
                  ? 'border border-slate-200 bg-slate-50 text-slate-900'
                  : 'border border-[#1a1a1a] bg-zinc-900 text-slate-200'
                : theme === 'light'
                  ? 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  : 'border border-[#1a1a1a] bg-zinc-900 text-gray-400 hover:text-gray-300'
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
