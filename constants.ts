
export const TILE_SIZE = 32;
export const DEFAULT_GRAVITY = 0.5;
export const COLORS = {
  primary: '#3b82f6',
  secondary: '#6366f1',
  background: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  text: '#f8fafc',
  textMuted: '#94a3b8'
};

export const MOCK_ASSETS = [
  { id: 'grass', name: 'Grass Block', type: 'sprite', color: '#22c55e' },
  { id: 'stone', name: 'Stone Block', type: 'sprite', color: '#64748b' },
  { id: 'player', name: 'Player Start', type: 'prefab', color: '#ef4444' },
  { id: 'coin', name: 'Collectible Coin', type: 'prefab', color: '#fbbf24' },
  { id: 'lava', name: 'Danger Tile', type: 'sprite', color: '#f97316' },
];
