import { Text, Container, Graphics, Sprite, Texture } from "pixi.js";
import { gsap } from "gsap";
import { BaseScene } from "../core/BaseScene";
import { SceneManager } from "../core/SceneManager";
import { GameState } from "../core/GameState";
import { DragDropScene } from "./DragDropScene";
import { NumpadScene } from "./NumpadScene";
import { QCMScene } from "./QCMScene";

export class MenuScene extends BaseScene {
  private manager: SceneManager;
  private state: GameState;

  constructor(manager: SceneManager, state: GameState) {
    super();
    this.manager = manager;
    this.state = state;
  }

  enter(): void {
    // ── Mascotte ────────────────────────────────
    const bunny = new Sprite(Texture.from("bunny"));
    bunny.anchor.set(0.5);
    bunny.x = 400;
    bunny.y = 120;
    this.addChild(bunny);

    // ── Titre ────────────────────────────────────
    const title = new Text({
      text: "🔷 GéoKids",
      style: { fontFamily: "Arial", fontSize: 52, fill: 0xffd700 },
    });
    title.anchor.set(0.5);
    title.x = 400;
    title.y = 230;
    this.addChild(title);

    // ── Bouton QCM ───────────────────────────────
    const btnQCM = this.makeButton("➕ Calcul mental");
    btnQCM.x = 400;
    btnQCM.y = 340;
    btnQCM.on("pointerdown", () => {
      this.state.reset();
      this.manager.go(new QCMScene(this.manager, this.state));
    });
    this.addChild(btnQCM);

    // ── Bouton Drag & Drop ───────────────────────
    const btnDrag = this.makeButton("🎯 Glisser-déposer");
    btnDrag.x = 400;
    btnDrag.y = 430;
    btnDrag.on("pointerdown", () => {
      this.state.reset();
      this.manager.go(new DragDropScene(this.manager, this.state));
    });
    this.addChild(btnDrag);

    // ── Bouton NUmpad ───────────────────────
    const btnNumpad = this.makeButton("🎯 Numpad");
    btnNumpad.x = 400;
    btnNumpad.y = 520;
    btnNumpad.on("pointerdown", () => {
      this.state.reset();
      this.manager.go(new NumpadScene(this.manager, this.state));
    });
    this.addChild(btnNumpad);

    // ── Animation d'entrée ───────────────────────
    gsap.from(title, {
      pixi: { scaleX: 0, scaleY: 0 },
      duration: 0.6,
      ease: "back.out(1.5)",
    });
  }

  exit(): void {
    this.removeChildren();
  }

  // ── Helper bouton ────────────────────────────
  private makeButton(label: string, color = 0x2471a3): Container {
    const btn = new Container();
    btn.eventMode = "static";
    btn.cursor = "pointer";

    const bg = new Graphics();
    const draw = (col: number) => {
      bg.clear();
      bg.roundRect(-110, -30, 220, 60, 12);
      bg.fill(col);
    };
    draw(color);

    const txt = new Text({
      text: label,
      style: { fontFamily: "Arial", fontSize: 26, fill: 0xffffff },
    });
    txt.anchor.set(0.5);

    btn.addChild(bg);
    btn.addChild(txt);

    btn.on("pointerover", () => draw(color + 0x222222));
    btn.on("pointerout", () => draw(color));

    return btn;
  }
}
