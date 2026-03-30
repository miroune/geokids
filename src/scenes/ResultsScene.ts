import { Text, Container, Graphics } from "pixi.js";
import { gsap } from "gsap";
import { BaseScene } from "../core/BaseScene";
import { SceneManager } from "../core/SceneManager";
import { GameState } from "../core/GameState";
import { MenuScene } from "./MenuScene";
import { QCMScene } from "./QCMScene";

export class ResultsScene extends BaseScene {
  private manager: SceneManager;
  private state: GameState;

  constructor(manager: SceneManager, state: GameState) {
    super();
    this.manager = manager;
    this.state = state;
  }

  enter(): void {
    // ── Titre ──────────────────────────────────
    const titre = new Text({
      text: "Résultats",
      style: { fontFamily: "Arial", fontSize: 36, fill: 0xffffff },
    });
    titre.anchor.set(0.5);
    titre.x = 400;
    titre.y = 150;
    this.addChild(titre);

    // ── Score ───────────────────────────────────
    const score = new Text({
      text: `${this.state.score} / ${this.state.total}`,
      style: { fontFamily: "Arial", fontSize: 64, fill: 0xffd700 },
    });
    score.anchor.set(0.5);
    score.x = 400;
    score.y = 280;
    this.addChild(score);

    // ── Étoiles ─────────────────────────────────
    const ratio = this.state.score / this.state.total;
    const etoiles = ratio === 1 ? "⭐⭐⭐" : ratio >= 0.6 ? "⭐⭐" : "⭐";
    const stars = new Text({
      text: etoiles,
      style: { fontFamily: "Arial", fontSize: 42 },
    });
    stars.anchor.set(0.5);
    stars.x = 400;
    stars.y = 370;
    this.addChild(stars);

    // ── Bouton Rejouer ──────────────────────────
    const rejouer = this.makeButton("🔄 Rejouer", 0x27ae60);
    rejouer.x = 280;
    rejouer.y = 480;
    rejouer.on("pointerdown", () => {
      this.state.reset();
      this.manager.go(new QCMScene(this.manager, this.state));
    });
    this.addChild(rejouer);

    // ── Bouton Menu ─────────────────────────────
    const menu = this.makeButton("🏠 Menu", 0x555555);
    menu.x = 520;
    menu.y = 480;
    menu.on("pointerdown", () => {
      this.manager.go(new MenuScene(this.manager, this.state));
    });
    this.addChild(menu);

    // ── Animation d'entrée ──────────────────────
    gsap.from(score, {
      pixi: { scaleX: 0, scaleY: 0 },
      duration: 0.5,
      ease: "back.out(1.5)",
    });
  }

  exit(): void {
    this.removeChildren();
  }

  // ── Helper bouton ───────────────────────────
  private makeButton(label: string, color = 0x2471a3): Container {
    const btn = new Container();
    btn.eventMode = "static";
    btn.cursor = "pointer";

    const bg = new Graphics();
    const draw = (col: number) => {
      bg.clear();
      bg.roundRect(-80, -30, 160, 60, 12);
      bg.fill(col);
    };
    draw(color);

    const txt = new Text({
      text: label,
      style: { fontFamily: "Arial", fontSize: 24, fill: 0xffffff },
    });
    txt.anchor.set(0.5);

    btn.addChild(bg);
    btn.addChild(txt);

    btn.on("pointerover", () => draw(color + 0x222222));
    btn.on("pointerout", () => draw(color));

    return btn;
  }
}
