
import React, { useState, useEffect } from 'react';
import EditorView from './components/Editor/EditorView';
import PlayerView from './components/Player/PlayerView';
import MarketplaceView from './components/Marketplace/MarketplaceView';
import { World } from './types';
import { TILE_SIZE, DEFAULT_GRAVITY } from './constants';

type AppMode = 'home' | 'play' | 'create' | 'market';

const INITIAL_WORLD: World = {
  id: 'default-world',
  name: 'New Adventure',
  creator: 'Developer',
  entities: [
    {
      id: 'player-1',
      name: 'Player',
      components: {
        Transform: { position: { x: 100, y: 100 }, scale: { x: 1, y: 1 }, rotation: 0 },
        Sprite: { textureId: 'player', color: '#3b82f6', zIndex: 10 },
        Collider: { size: { x: 32, y: 32 }, isTrigger: false },
        PlayerController: { speed: 5 }
      }
    }
  ],
  tiles: [],
  settings: {
    gravity: DEFAULT_GRAVITY,
    backgroundColor: '#0f172a',
    tileSize: TILE_SIZE
  }
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('create');
  const [activeWorld, setActiveWorld] = useState<World>(INITIAL_WORLD);

  const handleSaveWorld = (world: World) => {
    setActiveWorld(world);
    // In a real app, this would send to a Go backend
    console.log("World saved:", JSON.stringify(world, null, 2));
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950">
      {/* Navigation Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">PF</div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">PixelForge</h1>
        </div>
        
        <nav className="flex items-center gap-1">
          <NavButton active={mode === 'play'} onClick={() => setMode('play')}>Play</NavButton>
          <NavButton active={mode === 'create'} onClick={() => setMode('create')}>Create</NavButton>
          <NavButton active={mode === 'market'} onClick={() => setMode('market')}>Marketplace</NavButton>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">DevUser</span>
            <span className="text-xs text-slate-400">Level 50</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {mode === 'create' && (
          <EditorView initialWorld={activeWorld} onSave={handleSaveWorld} />
        )}
        {mode === 'play' && (
          <PlayerView world={activeWorld} onExit={() => setMode('create')} />
        )}
        {mode === 'market' && (
          <MarketplaceView />
        )}
      </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-md font-medium transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    {children}
  </button>
);

export default App;
