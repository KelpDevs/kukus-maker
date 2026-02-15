
import { World, Entity, Vector2, ComponentType } from '../types';

export class CoreEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private world: World;
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private keys: Set<string> = new Set();
  
  // Internal state for "Physics"
  private velocities: Map<string, Vector2> = new Map();

  constructor(canvas: HTMLCanvasElement, world: World) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get canvas context");
    this.ctx = ctx;
    this.world = JSON.parse(JSON.stringify(world)); // Deep copy to avoid mutating source in play mode

    window.addEventListener('keydown', (e) => this.keys.add(e.code));
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
  }

  public start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  public stop() {
    this.isRunning = false;
  }

  private loop(time: number) {
    if (!this.isRunning) return;

    const deltaTime = (time - this.lastTime) / 1000;
    this.lastTime = time;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.loop.bind(this));
  }

  private update(dt: number) {
    // Basic Movement and Gravity logic
    this.world.entities.forEach(entity => {
      const transform = entity.components.Transform;
      const controller = entity.components.PlayerController;
      const collider = entity.components.Collider;

      if (controller) {
        let dx = 0;
        let dy = 0;
        if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) dy -= 1;
        if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) dy += 1;
        if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) dx -= 1;
        if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) dx += 1;

        if (dx !== 0 || dy !== 0) {
          const length = Math.sqrt(dx * dx + dy * dy);
          transform.position.x += (dx / length) * controller.speed;
          transform.position.y += (dy / length) * controller.speed;
        }
      }

      // Simple collision against world boundaries
      if (collider) {
        if (transform.position.x < 0) transform.position.x = 0;
        if (transform.position.y < 0) transform.position.y = 0;
        if (transform.position.x > this.canvas.width - collider.size.x) transform.position.x = this.canvas.width - collider.size.x;
        if (transform.position.y > this.canvas.height - collider.size.y) transform.position.y = this.canvas.height - collider.size.y;
      }
    });
  }

  private render() {
    this.ctx.fillStyle = this.world.settings.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Grid (optional during play, but helpful)
    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += this.world.settings.tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += this.world.settings.tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // Render Tiles
    this.world.tiles.forEach(tile => {
      this.ctx.fillStyle = '#1e293b'; // Placeholder
      this.ctx.fillRect(
        tile.x * this.world.settings.tileSize, 
        tile.y * this.world.settings.tileSize, 
        this.world.settings.tileSize, 
        this.world.settings.tileSize
      );
    });

    // Render Entities
    this.world.entities.forEach(entity => {
      const transform = entity.components.Transform;
      const sprite = entity.components.Sprite;

      if (sprite) {
        this.ctx.fillStyle = sprite.color;
        this.ctx.save();
        this.ctx.translate(transform.position.x, transform.position.y);
        this.ctx.rotate(transform.rotation);
        this.ctx.fillRect(0, 0, this.world.settings.tileSize * transform.scale.x, this.world.settings.tileSize * transform.scale.y);
        
        // Name label
        this.ctx.fillStyle = 'white';
        this.ctx.font = '10px sans-serif';
        this.ctx.fillText(entity.name, 0, -5);
        
        this.ctx.restore();
      }
    });
  }
}
