import { Application } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { SceneManager } from "./core/SceneManager";
import { GameState } from "./core/GameState";
import { MenuScene } from "./scenes/MenuScene";
import { AssetsLoader } from "./core/AssetsLoader";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI({ Application });

// ── Taille de référence fixe (ton design) ────
const GAME_W = 800;
const GAME_H = 450;

const app = new Application();
await app.init({
  width: GAME_W,
  height: GAME_H,
  backgroundColor: 0x1a1a2e,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  antialias: true,
});
document.body.appendChild(app.canvas);

// ── Adapter le canvas à l'écran ──────────────
function resize(): void {
  const scaleX = window.innerWidth / GAME_W;
  const scaleY = window.innerHeight / GAME_H;
  const scale = Math.min(scaleX, scaleY);

  app.canvas.style.width = `${GAME_W * scale}px`;
  app.canvas.style.height = `${GAME_H * scale}px`;
}

// ── Message rotation portrait → paysage ──────
function checkOrientation(): void {
  const msg = document.getElementById("rotate-msg")!;
  msg.style.display = window.innerHeight > window.innerWidth ? "flex" : "none";
}

// ── Un seul listener resize ───────────────────
window.addEventListener("resize", () => {
  resize();
  checkOrientation();
});

resize();
checkOrientation();

await AssetsLoader.loadAll();

const state = new GameState();
const manager = new SceneManager(app);

manager.go(new MenuScene(manager, state));
