
import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

const LoadingOverlay: React.FC = () => {
  const { progress, active, item } = useProgress();
  const [visible, setVisible] = useState(false);

  // Smooth fade logic
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (active) {
      setVisible(true);
    } else {
      // Small delay before hiding to ensure 100% is seen
      timeout = setTimeout(() => setVisible(false), 500);
    }
    return () => clearTimeout(timeout);
  }, [active]);

  if (!visible) return null;

  // Format the URL to just show filename for the "tech" look
  const getCurrentAsset = (url: string) => {
    if (!url) return 'INITIALIZING...';
    try {
      const parts = url.split('/');
      return parts[parts.length - 1].split('?')[0].toUpperCase();
    } catch (e) {
      return 'DATA STREAM';
    }
  };

  return (
    <div 
      className={`absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="w-64 md:w-96">
        
        {/* Header Text */}
        <div className="flex justify-between items-end mb-2">
           <div className="text-cyan-500 text-xs font-mono tracking-widest animate-pulse">
             DOWNLOADING ASSETS...
           </div>
           <div className="text-white font-mono text-xl font-bold">
             {progress.toFixed(0)}%
           </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-1 bg-gray-900 border border-cyan-900 rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
           {/* Animated Bar */}
           <div 
              className="h-full bg-cyan-400 shadow-[0_0_15px_#00ffff]"
              style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
           />
        </div>

        {/* Footer Info */}
        <div className="mt-4 flex flex-col gap-1">
           <div className="flex justify-between text-[10px] text-cyan-700 font-mono">
              <span>CURRENT PACKET:</span>
              <span>{active ? 'RECEIVING' : 'COMPLETE'}</span>
           </div>
           <div className="text-[10px] text-cyan-600 truncate font-mono border-l-2 border-cyan-800 pl-2">
              {getCurrentAsset(item)}
           </div>
        </div>

      </div>

      {/* Decorative Warning for large files */}
      {active && progress < 90 && (
         <div className="absolute bottom-10 text-cyan-900 text-[10px] tracking-[0.2em] animate-pulse">
            LARGE DATASET DETECTED // PLEASE WAIT
         </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
