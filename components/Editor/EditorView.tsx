
import React, { useState, useRef, useEffect } from 'react';
import { World, Entity, ComponentType, Vector2 } from '../../types';
import { MOCK_ASSETS, TILE_SIZE } from '../../constants';

interface EditorViewProps {
  initialWorld: World;
  onSave: (world: World) => void;
}

const EditorView: React.FC<EditorViewProps> = ({ initialWorld, onSave }) => {
  const [world, setWorld] = useState<World>(initialWorld);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'entities' | 'assets'>('entities');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedEntity = world.entities.find(e => e.id === selectedEntityId);

  // Draw loop for editor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.fillStyle = world.settings.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += TILE_SIZE) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += TILE_SIZE) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Entities
      world.entities.forEach(entity => {
        const transform = entity.components.Transform;
        const sprite = entity.components.Sprite;
        if (sprite) {
          ctx.fillStyle = sprite.color;
          ctx.fillRect(transform.position.x, transform.position.y, TILE_SIZE, TILE_SIZE);
          
          if (entity.id === selectedEntityId) {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.strokeRect(transform.position.x - 2, transform.position.y - 2, TILE_SIZE + 4, TILE_SIZE + 4);
          }
        }
      });

      requestAnimationFrame(draw);
    };

    const animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [world, selectedEntityId]);

  const addEntity = (asset: typeof MOCK_ASSETS[0]) => {
    const newEntity: Entity = {
      id: `e-${Math.random().toString(36).substr(2, 9)}`,
      name: asset.name,
      components: {
        [ComponentType.Transform]: { position: { x: 100, y: 100 }, scale: { x: 1, y: 1 }, rotation: 0 },
        [ComponentType.Sprite]: { textureId: asset.id, color: asset.color, zIndex: 1 },
        [ComponentType.Collider]: { size: { x: 32, y: 32 }, isTrigger: false }
      }
    };
    setWorld(prev => ({ ...prev, entities: [...prev.entities, newEntity] }));
    setSelectedEntityId(newEntity.id);
  };

  const updateTransform = (pos: Partial<Vector2>) => {
    if (!selectedEntityId) return;
    setWorld(prev => ({
      ...prev,
      entities: prev.entities.map(e => e.id === selectedEntityId ? {
        ...e,
        components: {
          ...e.components,
          Transform: {
            ...e.components.Transform,
            position: { ...e.components.Transform.position, ...pos }
          }
        }
      } : e)
    }));
  };

  return (
    <div className="flex h-full w-full">
      {/* Left Panel: Assets */}
      <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="flex border-b border-slate-800">
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'entities' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('entities')}
          >
            Scene
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'assets' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('assets')}
          >
            Assets
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === 'entities' ? (
            world.entities.map(e => (
              <button
                key={e.id}
                onClick={() => setSelectedEntityId(e.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedEntityId === e.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'hover:bg-slate-800 text-slate-300'}`}
              >
                {e.name}
              </button>
            ))
          ) : (
            MOCK_ASSETS.map(asset => (
              <div 
                key={asset.id} 
                onClick={() => addEntity(asset)}
                className="group p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: asset.color }}></div>
                  <div>
                    <div className="text-sm font-medium">{asset.name}</div>
                    <div className="text-xs text-slate-500 uppercase">{asset.type}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Middle: Canvas */}
      <div className="flex-1 bg-slate-950 flex flex-col relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-slate-900/80 backdrop-blur border border-slate-700 p-1 rounded-lg shadow-xl z-10">
          <ToolBtn icon="🎯" label="Select" active />
          <ToolBtn icon="↔️" label="Move" />
          <ToolBtn icon="🔄" label="Rotate" />
          <ToolBtn icon="📐" label="Scale" />
          <div className="w-px h-6 bg-slate-700 mx-1"></div>
          <button 
            onClick={() => onSave(world)}
            className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-bold flex items-center gap-2"
          >
            <span>💾</span> Save
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="bg-slate-900 shadow-2xl rounded-sm overflow-hidden border border-slate-700">
            <canvas 
              ref={canvasRef} 
              width={1024} 
              height={576} 
              className="cursor-crosshair"
            />
          </div>
        </div>
      </div>

      {/* Right Panel: Inspector */}
      <div className="w-80 bg-slate-900 border-l border-slate-800 p-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Inspector</h3>
        
        {selectedEntity ? (
          <div className="space-y-6">
            <section>
              <label className="text-sm font-medium text-slate-400 block mb-2">Entity Name</label>
              <input 
                type="text" 
                value={selectedEntity.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setWorld(w => ({ ...w, entities: w.entities.map(ent => ent.id === selectedEntityId ? { ...ent, name: val } : ent) }));
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </section>

            <section>
              <h4 className="text-xs font-bold text-blue-500 uppercase mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Transform
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Pos X</label>
                  <input 
                    type="number" 
                    value={selectedEntity.components.Transform.position.x} 
                    onChange={e => updateTransform({ x: parseInt(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Pos Y</label>
                  <input 
                    type="number" 
                    value={selectedEntity.components.Transform.position.y} 
                    onChange={e => updateTransform({ y: parseInt(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-indigo-500 uppercase mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Sprite
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded border border-slate-700" style={{ backgroundColor: selectedEntity.components.Sprite?.color }}></div>
                <input 
                  type="color" 
                  value={selectedEntity.components.Sprite?.color || '#ffffff'} 
                  onChange={e => {
                    const color = e.target.value;
                    setWorld(w => ({ ...w, entities: w.entities.map(ent => ent.id === selectedEntityId ? { 
                      ...ent, 
                      components: { ...ent.components, Sprite: { ...ent.components.Sprite!, color } } 
                    } : ent) }));
                  }}
                  className="bg-transparent border-none w-full"
                />
              </div>
            </section>

            <button 
              onClick={() => {
                setWorld(prev => ({ ...prev, entities: prev.entities.filter(e => e.id !== selectedEntityId) }));
                setSelectedEntityId(null);
              }}
              className="w-full py-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 rounded text-xs font-bold transition-colors"
            >
              Delete Entity
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-600 text-center space-y-3">
            <span className="text-4xl">🖱️</span>
            <p className="text-sm">Select an entity to view properties</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ToolBtn: React.FC<{ icon: string; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`p-2 rounded flex flex-col items-center gap-0.5 min-w-[50px] transition-colors ${active ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
    <span className="text-lg">{icon}</span>
    <span className="text-[10px] uppercase font-bold">{label}</span>
  </button>
);

export default EditorView;
