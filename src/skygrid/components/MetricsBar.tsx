interface MetricsBarProps {
  activeAircraft: number;
  avgAltitude: number;
  maxSpeed: number;
  avgSpeed: number;
}

export function MetricsBar({ activeAircraft, avgAltitude, maxSpeed, avgSpeed }: MetricsBarProps) {
  return (
    <div className="absolute top-16 left-6 right-6 z-10 flex gap-4">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 min-w-[180px]">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">TRACKED AIRCRAFT</div>
        <div className="text-3xl font-medium text-white leading-none mb-2">{activeAircraft}</div>
        <div className="h-[2px] bg-gradient-to-r from-slate-200 to-transparent" />
      </div>

      <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 min-w-[180px]">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">AVG ALTITUDE</div>
        <div className="text-3xl font-medium text-white leading-none mb-2">
          {Math.round(avgAltitude).toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 mt-1">ft</div>
        <div className="h-[2px] bg-gradient-to-r from-slate-200 to-transparent mt-2" />
      </div>

      <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 min-w-[180px]">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">MAX SPEED</div>
        <div className="text-3xl font-medium text-white leading-none mb-2">
          {Math.round(maxSpeed).toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 mt-1">kt</div>
        <div className="h-[2px] bg-gradient-to-r from-slate-200 to-transparent mt-2" />
      </div>

      <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 min-w-[180px]">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">AVG SPEED</div>
        <div className="text-3xl font-medium text-white leading-none mb-2">
          {Math.round(avgSpeed).toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 mt-1">kt</div>
        <div className="h-[2px] bg-gradient-to-r from-slate-200 to-transparent mt-2" />
      </div>
    </div>
  );
}
