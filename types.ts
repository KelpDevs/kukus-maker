
export interface Vector2 {
  x: number;
  y: number;
}

export enum ComponentType {
  Transform = 'Transform',
  Sprite = 'Sprite',
  Collider = 'Collider',
  Script = 'Script',
  PlayerController = 'PlayerController'
}

export interface TransformComponent {
  position: Vector2;
  scale: Vector2;
  rotation: number;
}

export interface SpriteComponent {
  textureId: string;
  color: string;
  zIndex: number;
}

export interface ColliderComponent {
  size: Vector2;
  isTrigger: boolean;
}

export interface ScriptComponent {
  source: string;
}

export interface Entity {
  id: string;
  name: string;
  components: {
    [ComponentType.Transform]: TransformComponent;
    [ComponentType.Sprite]?: SpriteComponent;
    [ComponentType.Collider]?: ColliderComponent;
    [ComponentType.Script]?: ScriptComponent;
    [ComponentType.PlayerController]?: { speed: number };
  };
}

export interface Tile {
  x: number;
  y: number;
  type: string;
}

export interface World {
  id: string;
  name: string;
  creator: string;
  entities: Entity[];
  tiles: Tile[];
  settings: {
    gravity: number;
    backgroundColor: string;
    tileSize: number;
  };
}

export interface GameAsset {
  id: string;
  name: string;
  type: 'sprite' | 'script' | 'prefab';
  data: any;
  thumbnail: string;
  price: number;
}
