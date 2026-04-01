import { Application } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { SceneManager } from "./core/SceneManager";
import { GameState } from "./core/GameState";
import { MenuScene } from "./scenes/MenuScene";
import { AssetsLoader } from "./core/AssetsLoader";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI({ Application });

const app = new Application();
await app.init({
  width: 800,
  height: 600,
  backgroundColor: 0x1a1a2e,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  antialias: true,
});
document.body.appendChild(app.canvas);

await AssetsLoader.loadAll();

const state = new GameState();
const manager = new SceneManager(app);

manager.go(new MenuScene(manager, state));
