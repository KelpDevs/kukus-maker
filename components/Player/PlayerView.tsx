
import React, { useEffect, useRef, useState } from 'react';
import { World } from '../../types';
import { CoreEngine } from '../../engine/CoreEngine';

interface PlayerViewProps {
  world: World;
  onExit: () => void;
}

const PlayerView: React.FC<PlayerViewProps> = ({ world, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CoreEngine | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      engineRef.current = new CoreEngine(canvasRef.current, world);
      engineRef.current.start();
      setIsLoaded(true);
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, [world]);

  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col items-center justify-center">
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-50">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-400 font-medium tracking-widest animate-pulse">LOADING WORLD...</p>
        </div>
      )}

      {/* Control Overlay */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl">
          <h2 className="text-xl font-bold mb-1">{world.name}</h2>
          <p className="text-xs text-slate-400 mb-4">by {world.creator}</p>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">WASD</span>
              <span>Move</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">SPACE</span>
              <span>Jump</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onExit}
        className="absolute top-6 right-6 z-10 p-3 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 rounded-xl transition-all shadow-lg"
      >
        <span className="text-lg">✖️</span> Exit Game
      </button>

      {/* Game Canvas */}
      <div className="border-8 border-slate-900 rounded-lg shadow-2xl overflow-hidden ring-4 ring-blue-900/20">
        <canvas 
          ref={canvasRef} 
          width={1024} 
          height={576}
          className="bg-black"
        />
      </div>

      {/* Social / Chat Placeholder */}
      <div className="absolute bottom-6 left-6 w-80 max-h-48 overflow-hidden bg-black/30 backdrop-blur rounded-lg border border-white/5 p-3 flex flex-col">
        <div className="flex-1 text-sm space-y-1 overflow-y-auto mb-2">
          <p><span className="text-blue-400 font-bold">System:</span> Welcome to {world.name}!</p>
          <p><span className="text-indigo-400 font-bold">PlayerX:</span> Yo check this world out.</p>
          <p><span className="text-slate-400">Server: Waiting for players...</span></p>
        </div>
        <input 
          type="text" 
          placeholder="Press Enter to chat..."
          className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-1.5 text-xs focus:outline-none"
        />
      </div>
    </div>
  );
};

export default PlayerView;
