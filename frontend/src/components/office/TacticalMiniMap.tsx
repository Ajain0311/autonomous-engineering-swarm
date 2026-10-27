import React, { useState } from 'react';
import { Map, Minimize2, Maximize2, Crosshair } from 'lucide-react';
import { OfficeEmployeeData } from '../../types/office';
import { gameAudio } from '../../utils/gameAudio';

interface TacticalMiniMapProps {
  employees: OfficeEmployeeData[];
  selectedEmployeeId: string | null;
  onSelectEmployee: (emp: OfficeEmployeeData) => void;
}

export const TacticalMiniMap: React.FC<TacticalMiniMapProps> = ({
  employees,
  selectedEmployeeId,
  onSelectEmployee,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Map world coordinates [-18, 18] X and [-14, 14] Z to percentage [5%, 95%]
  const toMapCoords = (x: number, z: number) => {
    const left = ((x + 18) / 36) * 100;
    const top = ((z + 14) / 28) * 100;
    return {
      left: `${Math.max(5, Math.min(95, left))}%`,
      top: `${Math.max(5, Math.min(95, top))}%`,
    };
  };

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case 'Executive':
        return '#38bdf8'; // Sky Blue
      case 'Operations':
        return '#818cf8'; // Indigo
      case 'Core Engineering':
        return '#a855f7'; // Purple
      case 'Quality Assurance':
        return '#34d399'; // Emerald
      case 'DevOps & Cloud':
        return '#fb923c'; // Orange
      case 'Product & Design':
        return '#f472b6'; // Pink
      default:
        return '#cbd5e1';
    }
  };

  return (
    <div className="absolute left-4 bottom-5 pointer-events-auto z-20 transition-all duration-300">
      <div className="bg-slate-950/85 backdrop-blur-xl border border-sky-500/30 shadow-2xl rounded-2xl overflow-hidden text-white font-mono">
        {/* Radar Header */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <Crosshair className="w-3.5 h-3.5 text-sky-400" />
            <span className="tracking-wider">E-CONNECT RADAR</span>
          </div>
          <button
            onClick={() => {
              gameAudio.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
            title={isExpanded ? 'Minimize Radar' : 'Maximize Radar'}
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>

        {isExpanded && (
          <div className="relative w-56 h-44 p-2 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950">
            {/* Radar Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-sky-500/20 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-sky-500/20 pointer-events-none" />

            {/* Office Cabins / Zones on MiniMap */}
            {/* Aditya Cabin (Top Left) */}
            <div
              className="absolute border border-indigo-400/40 bg-indigo-950/30 rounded text-[8px] text-indigo-300 flex items-center justify-center font-sans font-bold"
              style={{ left: '6%', top: '6%', width: '26%', height: '32%' }}
            >
              EXEC
            </div>
            {/* Giriraj Cabin (Top Right) */}
            <div
              className="absolute border border-purple-400/40 bg-purple-950/30 rounded text-[8px] text-purple-300 flex items-center justify-center font-sans font-bold"
              style={{ right: '6%', top: '6%', width: '26%', height: '32%' }}
            >
              LEAD
            </div>
            {/* QA Lab (Mid Right) */}
            <div
              className="absolute border border-emerald-400/40 bg-emerald-950/30 rounded text-[8px] text-emerald-300 flex items-center justify-center font-sans font-bold"
              style={{ right: '6%', top: '42%', width: '26%', height: '26%' }}
            >
              QA
            </div>
            {/* DevOps (Bottom Right) */}
            <div
              className="absolute border border-amber-400/40 bg-amber-950/30 rounded text-[8px] text-amber-300 flex items-center justify-center font-sans font-bold"
              style={{ right: '6%', bottom: '6%', width: '26%', height: '22%' }}
            >
              DEVOPS
            </div>
            {/* BA Lounge (Mid Left) */}
            <div
              className="absolute border border-pink-400/40 bg-pink-950/30 rounded text-[8px] text-pink-300 flex items-center justify-center font-sans font-bold"
              style={{ left: '6%', top: '42%', width: '26%', height: '30%' }}
            >
              BA
            </div>
            {/* Dev Pod (Center) */}
            <div
              className="absolute border border-sky-400/30 bg-sky-950/20 rounded text-[8px] text-sky-300 flex items-center justify-center font-sans font-bold"
              style={{ left: '36%', top: '30%', width: '28%', height: '48%' }}
            >
              DEV POD
            </div>

            {/* Living Employee Radar Blips */}
            {employees.map((emp) => {
              const [x, , z] = emp.current_coords;
              const pos = toMapCoords(x, z);
              const isSelected = selectedEmployeeId === emp.id;
              const color = getDepartmentColor(emp.department);

              return (
                <button
                  key={emp.id}
                  onClick={() => {
                    gameAudio.playSelect();
                    onSelectEmployee(emp);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-transform"
                  style={{ left: pos.left, top: pos.top }}
                  title={`${emp.name} (${emp.role})`}
                >
                  {/* Selected Pulsing Ring */}
                  {isSelected && (
                    <span
                      className="absolute -inset-2 rounded-full border border-sky-300 animate-ping opacity-75"
                      style={{ borderColor: color }}
                    />
                  )}
                  {/* Blip Dot */}
                  <span
                    className={`block w-2.5 h-2.5 rounded-full shadow-lg transition-transform ${
                      isSelected ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-black' : 'group-hover:scale-150'
                    }`}
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}`,
                    }}
                  />
                  {/* Hover Name Tag */}
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-slate-950/95 border border-slate-700 text-[9px] text-white rounded whitespace-nowrap z-30 pointer-events-none shadow-xl font-sans">
                    {emp.name.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer info */}
        <div className="px-3 py-1 bg-slate-900/90 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800">
          <span>{employees.length} UNITS ONLINE</span>
          <span className="text-emerald-400 font-bold">LIVE SYNC</span>
        </div>
      </div>
    </div>
  );
};
