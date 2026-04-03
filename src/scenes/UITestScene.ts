import { Graphics, Text } from "pixi.js";
import { FancyButton, ProgressBar } from "@pixi/ui";
import { BaseScene } from "../core/BaseScene";
import { SceneManager } from "../core/SceneManager";
import { GameState } from "../core/GameState";

export class UITestScene extends BaseScene {
  //private manager: SceneManager;
  //private state: GameState;

  constructor(_manager: SceneManager, _state: GameState) {
    super();
    //this.manager = manager;
    //this.state = state;
  }

  enter(): void {
    const btn = this.makeFancyButton("Test !", 0x2980b9, 200, 60);
    btn.x = 400;
    btn.y = 225;
    btn.anchor.set(0.5);
    btn.onPress.connect(() => (progressBar.progress += 10));
    this.addChild(btn);

    const progressBar = new ProgressBar({
      bg: new Graphics().roundRect(0, 0, 300, 20, 10).fill({ color: 0x444444 }), // gris foncé
      fill: new Graphics()
        .roundRect(0, 0, 300, 20, 10)
        .fill({ color: 0x2ecc71 }), // vert
      progress: 60,
    });
    progressBar.x = 250;
    progressBar.y = 100;
    this.addChild(progressBar);
  }

  exit(): void {
    this.removeChildren();
  }

  // Helper
  private makeFancyButton(
    label: string, // texte
    color: number, // couleur fond
    width: number, // largeur
    height: number, // hauteur
  ): FancyButton {
    const bg = new Graphics()
      .roundRect(0, 0, width, height, 10)
      .fill({ color: color });

    const bgHover = new Graphics()
      .roundRect(0, 0, width, height, 10)
      .fill({ color: Math.max(0, color - 0x111111) });

    const btn = new FancyButton({
      defaultView: bg,
      hoverView: bgHover,
      text: new Text({
        text: label,
        style: { fill: 0xffffff, fontSize: 24 },
      }),
    });
    return btn;
  }
}
