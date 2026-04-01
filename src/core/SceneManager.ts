import { Application } from "pixi.js";
import { gsap } from "gsap";
import { BaseScene } from "./BaseScene";

export class SceneManager {
  private app: Application;
  private current: BaseScene | null = null;

  constructor(app: Application) {
    this.app = app;
  }

  go(nextScene: BaseScene): void {
    const launch = () => {
      // 1. Détruire l'ancienne scène
      if (this.current) {
        this.current.exit();
        this.app.stage.removeChild(this.current);
      }
      // 2. Installer la nouvelle scène
      this.current = nextScene;
      this.app.stage.addChild(nextScene);
      nextScene.alpha = 0;
      nextScene.enter();
      // 3. Fade in
      gsap.to(nextScene, { alpha: 1, duration: 0.3, ease: "power2.out" });
    };

    // Fade out l'ancienne scène d'abord
    if (this.current) {
      gsap.to(this.current, {
        alpha: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: launch,
      });
    } else {
      launch();
    }
  }
}
