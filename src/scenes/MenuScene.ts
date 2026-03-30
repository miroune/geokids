import { Text, Container, Graphics, Sprite, Texture } from "pixi.js";
import { BaseScene } from "../core/BaseScene";
import { SceneManager } from "../core/SceneManager";
import { QCMScene } from "./QCMScene";
import { GameState } from "../core/GameState";

export class MenuScene extends BaseScene {
  // Déclare la propriété en haut de la classe
  private manager: SceneManager;
  private state: GameState;

  constructor(manager: SceneManager, state: GameState) {
    super();
    this.manager = manager; // assigne manuellement
    this.state = state;
  }

  enter(): void {
    // Dans enter() — pas besoin d'await !
    const bunny = new Sprite(Texture.from("bunny"));
    bunny.anchor.set(0.5);
    bunny.x = 400;
    bunny.y = 150;
    this.addChild(bunny);
    // ── Titre ──────────────────────────────────
    const title = new Text({
      text: "🔷 GéoKids",
      style: { fontFamily: "Arial", fontSize: 52, fill: 0xffd700 },
    });
    title.anchor.set(0.5);
    title.x = 400;
    title.y = 250;
    this.addChild(title);

    // ── Bouton Jouer ───────────────────────────
    const button = new Container();
    button.x = 400;
    button.y = 400;
    button.eventMode = "static";
    button.cursor = "pointer";

    const bg = new Graphics();
    const drawBg = (color: number) => {
      bg.clear();
      bg.roundRect(-60, -30, 120, 60, 12);
      bg.fill(color);
    };
    drawBg(0x2471a3);

    const label = new Text({
      text: "Jouer",
      style: { fontFamily: "Arial", fontSize: 28, fill: 0xffffff },
    });
    label.anchor.set(0.5);

    button.addChild(bg);
    button.addChild(label);
    this.addChild(button);

    // ── Événements ─────────────────────────────
    button.on("pointerover", () => drawBg(0x3498db));
    button.on("pointerout", () => drawBg(0x2471a3));
    button.on("pointerdown", () => {
      this.state.reset(); // ← remet score=0, total=0
      this.manager.go(new QCMScene(this.manager, this.state));
    });
  }

  exit(): void {
    this.removeChildren(); // nettoie tout
  }
}
