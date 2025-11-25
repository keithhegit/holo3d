
import React from 'react';

export interface ModelData {
  id: string;
  name: string;
  url: string;
  category: 'PLANET' | 'CITY' | 'SCENE';
  description: string;
}

export const MODELS: ModelData[] = [
  {
    id: 'earth-std',
    name: 'STANDARD EARTH',
    category: 'PLANET',
    description: 'High fidelity terrestrial representation.',
    url: 'https://glb.keithhe.com/planet/planet_earth.glb'
  },
  {
    id: 'afroditi',
    name: 'AFRODITI PRIME',
    category: 'PLANET',
    description: 'Exoplanet survey. Sector 7G.',
    url: 'https://pub-c3dcdec15115492abed04027c565ca91.r2.dev/planet/planet_afroditi.glb'
  },
  {
    id: 'alien',
    name: 'XENON WORLD',
    category: 'PLANET',
    description: 'Unknown biological signatures detected.',
    url: 'https://glb.keithhe.com/planet/alien_planet%20(1).glb'
  },
  {
    id: 'toy-earth',
    name: 'CUTE POLY',
    category: 'PLANET',
    description: 'Low polygon simulation target.',
    url: 'https://glb.keithhe.com/planet/cute_little_planet.glb'
  },
  {
    id: 'desert',
    name: 'DESERT OUTPOST',
    category: 'SCENE',
    description: 'Remote tactical monitoring station.',
    url: 'https://glb.keithhe.com/city/small_desert-outpost_composition.glb'
  },
  {
    id: 'apoc',
    name: 'NEO RUINS',
    category: 'CITY',
    description: 'Post-collapse urban density scan.',
    url: 'https://glb.keithhe.com/city/apocalyptic_city.glb'
  }
];

interface ModelSelectorProps {
  onSelect: (model: ModelData) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onSelect }) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10 overflow-y-auto">
      
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in-down">
        <h2 className="text-cyan-500 text-xs tracking-[0.5em] mb-2 border-b border-cyan-900/50 pb-2 inline-block">SYSTEM_INIT</h2>
        <h1 className="text-4xl md:text-6xl text-white font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
          SELECT TARGET
        </h1>
        <p className="text-cyan-400/60 mt-2 font-mono text-sm">CHOOSE A HOLOGRAPHIC PROJECTION SOURCE</p>
      </div>

      {/* Grid / Carousel */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model)}
            className="group relative h-48 border border-cyan-900/50 bg-gradient-to-b from-cyan-950/30 to-black hover:border-cyan-400/80 hover:bg-cyan-900/20 transition-all duration-300 flex flex-col items-start justify-between p-6 text-left overflow-hidden rounded-sm"
          >
            {/* Hover Glitch Effect Overlay */}
            <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            
            {/* Top Tag */}
            <div className="flex justify-between w-full items-start z-10">
              <span className="text-[10px] font-mono text-cyan-600 border border-cyan-900 px-2 py-0.5 bg-black/50">
                {model.category}
              </span>
              {/* Animated Icon Placeholder */}
              <div className="w-8 h-8 border border-cyan-800 rounded-full flex items-center justify-center group-hover:border-cyan-400 transition-colors">
                <div className="w-4 h-4 bg-cyan-900/50 rounded-full group-hover:bg-cyan-400 group-hover:shadow-[0_0_10px_rgba(0,255,255,1)] transition-all duration-500" />
              </div>
            </div>

            {/* Info */}
            <div className="z-10 mt-auto">
              <h3 className="text-xl text-white font-bold tracking-widest group-hover:text-cyan-300 transition-colors">
                {model.name}
              </h3>
              <p className="text-xs text-cyan-500/70 font-mono mt-1 group-hover:text-cyan-400">
                {model.description}
              </p>
            </div>

            {/* Decorative Corner */}
            <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[20px] border-r-[20px] border-b-cyan-900/0 border-r-cyan-800 group-hover:border-r-cyan-400 transition-colors" />
          </button>
        ))}
      </div>
      
      <div className="mt-auto text-cyan-900 text-[10px] uppercase tracking-widest">
        Waiting for User Input...
      </div>
    </div>
  );
};

export default ModelSelector;
