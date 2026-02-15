
import React, { useState } from 'react';

const CATEGORIES = ['All', 'Characters', 'UI Packs', 'Terrain', 'Scripts', 'Prefabs'];

const MarketplaceView: React.FC = () => {
  const [category, setCategory] = useState('All');

  const assets = [
    { id: 1, name: 'Cyber Knight', creator: 'PixelMaster', price: 250, type: 'Character', rating: 4.8, img: 'https://picsum.photos/seed/cyber/200/200' },
    { id: 2, name: 'Crystal Caves Tilemap', creator: 'EarthGazer', price: 100, type: 'Terrain', rating: 4.5, img: 'https://picsum.photos/seed/cave/200/200' },
    { id: 3, name: 'Advanced Physics Script', creator: 'CodeGod', price: 0, type: 'Scripts', rating: 4.9, img: 'https://picsum.photos/seed/script/200/200' },
    { id: 4, name: 'Modern UI Kit', creator: 'DesignerPro', price: 500, type: 'UI Packs', rating: 4.2, img: 'https://picsum.photos/seed/ui/200/200' },
    { id: 5, name: 'Explosion FX', creator: 'VFX_Wizard', price: 150, type: 'Prefabs', rating: 4.7, img: 'https://picsum.photos/seed/fx/200/200' },
    { id: 6, name: 'Steampunk Tiles', creator: 'GearHead', price: 200, type: 'Terrain', rating: 4.4, img: 'https://picsum.photos/seed/steam/200/200' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Search & Filter Header */}
      <div className="bg-slate-900 p-6 border-b border-slate-800 shrink-0">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
              <input 
                type="text" 
                placeholder="Search assets, creators, or scripts..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-900/30">
              Search
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {assets.map(asset => (
            <div key={asset.id} className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all">
              <div className="h-48 relative overflow-hidden">
                <img src={asset.img} alt={asset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-400 border border-white/10">
                  {asset.type}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg truncate pr-2">{asset.name}</h4>
                  <div className="flex items-center text-yellow-500 text-xs">
                    <span>⭐</span>
                    <span className="ml-1 font-bold">{asset.rating}</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-6">By <span className="text-slate-300 hover:text-blue-400 cursor-pointer">{asset.creator}</span></p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Price</span>
                    <span className="font-bold text-xl flex items-center gap-1">
                      <span className="text-blue-500">◈</span> {asset.price === 0 ? 'FREE' : asset.price}
                    </span>
                  </div>
                  <button className="bg-slate-800 hover:bg-blue-600 px-6 py-2.5 rounded-xl text-sm font-bold transition-all">
                    Get Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceView;
