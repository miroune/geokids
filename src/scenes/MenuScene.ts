import { Text, Container, Graphics, Sprite, Texture } from "pixi.js";
import { gsap } from "gsap";
import { BaseScene } from "../core/BaseScene";
import { SceneManager } from "../core/SceneManager";
import { GameState } from "../core/GameState";
import { DragDropScene } from "./DragDropScene";
import { NumpadScene } from "./NumpadScene";
import { QCMScene } from "./QCMScene";
import { UITestScene } from "./UITestScene";
import { Theme } from "../core/Theme";

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
    bunny.y = 60;
    this.addChild(bunny);

    // ── Titre ────────────────────────────────────
    const title = new Text({
      text: "🔷 GéoKids",
      style: { fontFamily: "Arial", fontSize: 48, fill: 0xffd700 },
    });
    title.anchor.set(0.5);
    title.x = 400;
    title.y = 150;
    this.addChild(title);

    // ── Sous-titre ───────────────────────────────
    const subtitle = new Text({
      text: "Choisis un exercice !",
      style: { fontFamily: "Arial", fontSize: 22, fill: 0xaaaaaa },
    });
    subtitle.anchor.set(0.5);
    subtitle.x = 400;
    subtitle.y = 210;
    this.addChild(subtitle);

    // ── 3 boutons côte à côte ────────────────────
    const btnQCM = this.makeButton("➕ Calcul\nmental", Theme.primary);
    btnQCM.x = 100;
    btnQCM.y = 330;
    btnQCM.on("pointerdown", () => {
      this.state.reset();
      this.manager.go(new QCMScene(this.manager, this.state));
    });
    this.addChild(btnQCM);

    const btnDrag = this.makeButton("🎯 Glisser\ndéposer", Theme.secondary);
    btnDrag.x = 300;
    btnDrag.y = 330;
    btnDrag.on("pointerdown", () => {
      this.state.reset();
      this.manager.go(new DragDropScene(this.manager, this.state));
    });
    this.addChild(btnDrag);

    const btnNumpad = this.makeButton("🔢 Saisie\nlibre", Theme.accent);
    btnNumpad.x = 500;
    btnNumpad.y = 330;
    btnNumpad.on("pointerdown", () => {
      this.state.reset();
      this.manager.go(new NumpadScene(this.manager, this.state));
    });
    this.addChild(btnNumpad);

    const btnUITest = this.makeButton("🔢 UI Test", Theme.danger);
    btnUITest.x = 700;
    btnUITest.y = 330;
    btnUITest.on("pointerdown", () => {
      this.state.reset();
      this.manager.go(new UITestScene(this.manager, this.state));
    });
    this.addChild(btnUITest);

    // ── Animation d'entrée ───────────────────────
    gsap.from(title, {
      pixi: { scaleX: 0, scaleY: 0 },
      duration: 0.6,
      ease: "back.out(1.5)",
    });
    gsap.from([btnQCM, btnDrag, btnNumpad], {
      pixi: { alpha: 0, y: 360 },
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.1,
      delay: 0.3,
    });
  }

  exit(): void {
    this.removeChildren();
  }

  // ── Helper bouton ────────────────────────────
  private makeButton(label: string, color = Theme.primary): Container {
    const btn = new Container();
    btn.eventMode = "static";
    btn.cursor = "pointer";

    const bg = new Graphics();
    const draw = (col: number) => {
      bg.clear();
      bg.roundRect(-80, -40, 160, 80, 12);
      bg.fill(col);
    };
    draw(color);

    const txt = new Text({
      text: label,
      style: {
        fontFamily: "Arial",
        fontSize: 22,
        fill: 0xffffff,
        align: "center",
      },
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
