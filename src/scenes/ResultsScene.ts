import { Text, Container, Graphics } from "pixi.js";
import { gsap } from "gsap";
import { BaseScene } from "../core/BaseScene";
import { SceneManager } from "../core/SceneManager";
import { GameState } from "../core/GameState";
import { MenuScene } from "./MenuScene";
import { QCMScene } from "./QCMScene";
import { DragDropScene } from "./DragDropScene";
import { NumpadScene } from "./NumpadScene";
import { Theme } from "../core/Theme";
import { ScoreService } from "../core/ScoreService";

export class ResultsScene extends BaseScene {
  private manager: SceneManager;
  private state: GameState;
  private sceneOrigin: string;

  constructor(
    manager: SceneManager,
    state: GameState,
    sceneOrigin: "qcm" | "dragdrop" | "numpad",
  ) {
    super();
    this.manager = manager;
    this.state = state;
    this.sceneOrigin = sceneOrigin;
  }

  enter(): void {
    ScoreService.saveScore(
      this.sceneOrigin as "qcm" | "dragdrop" | "numpad",
      this.state.score,
      this.state.total,
    );

    // ── Titre ────────────────────────────────────
    const titre = new Text({
      text: "Résultats",
      style: { fontFamily: "Arial", fontSize: 36, fill: 0xffffff },
    });
    titre.anchor.set(0.5);
    titre.x = 400;
    titre.y = 112;
    this.addChild(titre);

    // ── Score ─────────────────────────────────────
    const score = new Text({
      text: `${this.state.score} / ${this.state.total}`,
      style: { fontFamily: "Arial", fontSize: 64, fill: 0xffd700 },
    });
    score.anchor.set(0.5);
    score.x = 400;
    score.y = 202;
    this.addChild(score);

    // ── Étoiles ───────────────────────────────────
    const ratio = this.state.score / this.state.total;
    const etoiles = ratio === 1 ? "⭐⭐⭐" : ratio >= 0.6 ? "⭐⭐" : "⭐";
    const stars = new Text({
      text: etoiles,
      style: { fontFamily: "Arial", fontSize: 42 },
    });
    stars.anchor.set(0.5);
    stars.x = 400;
    stars.y = 277;
    this.addChild(stars);

    // ── Bouton Rejouer ────────────────────────────
    const rejouer = this.makeButton("🔄 Rejouer", Theme.success);
    rejouer.x = 280;
    rejouer.y = 360;
    rejouer.on("pointerdown", () => {
      this.state.reset();
      if (this.sceneOrigin === "dragdrop") {
        this.manager.go(new DragDropScene(this.manager, this.state));
      } else if (this.sceneOrigin === "numpad") {
        this.manager.go(new NumpadScene(this.manager, this.state));
      } else {
        this.manager.go(new QCMScene(this.manager, this.state));
      }
    });
    this.addChild(rejouer);

    // ── Bouton Menu ───────────────────────────────
    const menu = this.makeButton("🏠 Menu", Theme.bgCard);
    menu.x = 520;
    menu.y = 360;
    menu.on("pointerdown", () => {
      this.manager.go(new MenuScene(this.manager, this.state));
    });
    this.addChild(menu);

    // ── Animation d'entrée ────────────────────────
    gsap.from(score, {
      pixi: { scaleX: 0, scaleY: 0 },
      duration: 0.5,
      ease: "back.out(1.5)",
    });
    gsap.from(stars, {
      pixi: { alpha: 0, y: stars.y + 30 },
      duration: 0.5,
      delay: 0.3,
      ease: "power2.out",
    });
  }

  exit(): void {
    this.removeChildren();
  }

  // ── Helper bouton ─────────────────────────────
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

    btn.on("pointerover", () => (bg.alpha = 0.8)); // légèrement transparent au survol;
    btn.on("pointerout", () => {
      bg.alpha = 1; // opaque normal
    });

    return btn;
  }
}
