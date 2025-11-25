import React from 'react';
import { HandStatus } from '../types';

interface HUDProps {
  status: HandStatus;
  modelName?: string;
  onBack: () => void;
}

const HUD: React.FC<HUDProps> = ({ status, modelName = "UNKNOWN_TARGET", onBack }) => {
  
  // Helper to determine status text
  const getStatusText = () => {
    switch (status.gesture) {
        case 'PINCH': return 'MANIPULATION ACTIVE';
        case 'OPEN': return 'ZOOM IN [SPREAD]';
        case 'CLOSED': return 'ZOOM OUT [FIST]';
        case 'IDLE': 
        default: return 'IDLE';
    }
  };

  const getStatusColor = () => {
     switch (status.gesture) {
        case 'PINCH': return 'border-yellow-500 text-yellow-500 bg-yellow-500/10';
        case 'OPEN': return 'border-green-500 text-green-500 bg-green-500/10';
        case 'CLOSED': return 'border-pink-500 text-pink-500 bg-pink-500/10';
        default: return 'border-cyan-900 text-cyan-900';
     }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-8">
      
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-2xl md:text-4xl text-cyan-400 font-bold tracking-widest drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
            TERRA_HOLO
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${status.isDetected ? 'bg-green-500 shadow-[0_0_8px_#0f0]' : 'bg-red-500 animate-pulse'}`}></div>
            <span className="text-cyan-700 text-xs md:text-sm font-mono">
              {status.isDetected ? 'SYSTEM ONLINE // HAND LOCKED' : 'SEARCHING FOR INPUT...'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-4">
          <button 
            onClick={onBack}
            className="pointer-events-auto border border-cyan-500/50 px-4 py-1 bg-black/40 text-cyan-400 text-xs hover:bg-cyan-500/20 hover:border-cyan-400 transition-all uppercase tracking-wider"
          >
            &lt; CHANGE MODEL
          </button>

          <div className="text-right hidden md:block">
            <div className="text-cyan-800 text-xs border-b border-cyan-900 pb-1 mb-1">COORDINATES</div>
            <div className="text-cyan-400 font-mono text-xs">
              X: {status.cursor.x.toFixed(3)}
            </div>
            <div className="text-cyan-400 font-mono text-xs">
              Y: {status.cursor.y.toFixed(3)}
            </div>
          </div>
        </div>
      </div>

      {/* Center Reticle */}
      {status.isDetected && (
        <div 
            className="absolute w-12 h-12 border border-cyan-500 rounded-full transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,255,0.4)]"
            style={{ 
                left: `${status.cursor.x * 100}%`, 
                top: `${status.cursor.y * 100}%`,
                borderColor: status.isPinching ? '#ffff00' : '#00ffff'
            }}
        >
            <div className={`w-1 h-1 bg-white rounded-full ${status.isPinching ? 'scale-150' : ''}`} />
            {status.isPinching && (
                <div className="absolute w-16 h-16 border border-dashed border-yellow-400 rounded-full animate-spin-slow opacity-50" />
            )}
            {(status.gesture === 'OPEN' || status.gesture === 'CLOSED') && (
                <div className={`absolute w-16 h-16 border rounded-full animate-ping opacity-30 ${status.gesture === 'OPEN' ? 'border-green-400' : 'border-pink-400'}`} />
            )}
        </div>
      )}

      {/* Bottom Bar */}
      <div className="flex justify-between items-end pointer-events-auto">
        <div className="border-l-2 border-cyan-800 pl-4 bg-black/20 backdrop-blur-sm pr-4 py-2 rounded-r">
           <div className="text-cyan-600 text-[10px] mb-1">CURRENT PROJECTION</div>
           <div className="text-cyan-100 text-lg font-bold tracking-widest">{modelName}</div>
           
           <div className="mt-2 text-cyan-600 text-[10px] mb-1">GESTURE CONTROL</div>
           <div className="text-cyan-200 text-xs">1. PINCH : ROTATE</div>
           <div className="text-cyan-200 text-xs">2. OPEN HAND : ZOOM IN</div>
           <div className="text-cyan-200 text-xs">3. FIST : ZOOM OUT</div>
        </div>

        <div className="flex flex-col items-end gap-2">
            <div className={`px-4 py-1 border transition-colors duration-300 ${getStatusColor()}`}>
                {getStatusText()}
            </div>
            <div className="text-[10px] text-cyan-900">VER 3.1.0</div>
        </div>
      </div>
    </div>
  );
};

export default HUD;