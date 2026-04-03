import { Text, Container, Graphics } from "pixi.js";
import { gsap } from "gsap";
import { BaseScene } from "../core/BaseScene";
import { SceneManager } from "../core/SceneManager";
import { GameState } from "../core/GameState";
import { MenuScene } from "./MenuScene";
import { ResultsScene } from "./ResultsScene";
import { ProgressBar } from "@pixi/ui";
import { Theme } from "../core/Theme";

export class QCMScene extends BaseScene {
  private manager: SceneManager;
  private state: GameState;

  constructor(manager: SceneManager, state: GameState) {
    super();
    this.manager = manager;
    this.state = state;
  }

  enter(): void {
    this.state.total++;

    // ── 1. Générer la question ──────────────────
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const bonneReponse = a + b;

    // ── 2. Mauvaises réponses uniques ───────────
    const mauvaise1 = bonneReponse + 2;
    const mauvaise2 = bonneReponse - 2;

    // ── 3. Mélanger les 3 réponses ──────────────
    const reponses = this.shuffle([bonneReponse, mauvaise1, mauvaise2]);

    // ── 4. Titre ────────────────────────────────
    const title = new Text({
      text: `Combien font  ${a} + ${b} ?`,
      style: { fontFamily: "Arial", fontSize: 42, fill: 0xffffff },
    });
    title.anchor.set(0.5);
    title.x = 400;
    title.y = 135;
    this.addChild(title);

    // ── 5. Feedback ─────────────────────────────
    const feedback = new Text({
      text: "",
      style: { fontFamily: "Arial", fontSize: 32, fill: Theme.success },
    });
    feedback.anchor.set(0.5);
    feedback.x = 400;
    feedback.y = 315;
    this.addChild(feedback);

    // ── 6. Boutons réponses ─────────────────────
    const positionsX = [180, 400, 620];
    let answered = false;

    reponses.forEach((valeur, i) => {
      const btn = this.makeButton(String(valeur), Theme.primary);
      btn.x = positionsX[i];
      btn.y = 225;
      this.addChild(btn);

      btn.on("pointerdown", () => {
        if (answered) return;
        answered = true;

        if (valeur === bonneReponse) {
          this.state.score++;

          feedback.text = "✅ Bravo !";
          feedback.style.fill = Theme.success;

          gsap.to(btn, {
            pixi: { scaleX: 1.2, scaleY: 1.2 },
            duration: 0.2,
            ease: "bounce.out",
          });
          gsap.to(btn, {
            pixi: { scaleX: 1, scaleY: 1 },
            duration: 0.2,
            delay: 0.4,
          });

          setTimeout(() => {
            if (this.state.total >= 5) {
              this.manager.go(
                new ResultsScene(this.manager, this.state, "qcm"),
              );
            } else {
              this.manager.go(new QCMScene(this.manager, this.state));
            }
          }, 1500);
        } else {
          feedback.text = "❌ Essaie encore !";
          feedback.style.fill = Theme.danger;

          gsap.to(btn, {
            pixi: { x: btn.x + 10 },
            duration: 0.05,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
              answered = false;
            },
          });
        }
      });
    });

    // ── 7. Bouton Menu ───────────────────────────
    const menuBtn = this.makeButton("← Menu", Theme.bgCard);
    menuBtn.x = 400;
    menuBtn.y = 390;
    menuBtn.on("pointerdown", () =>
      this.manager.go(new MenuScene(this.manager, this.state)),
    );
    this.addChild(menuBtn);

    // -------- ProgressBar ------------
    const progressBar = new ProgressBar({
      bg: new Graphics().roundRect(0, 0, 300, 20, 10).fill({ color: 0x444444 }), // gris foncé
      fill: new Graphics()
        .roundRect(0, 0, 300, 20, 10)
        .fill({ color: 0x2ecc71 }), // vert
      progress: (this.state.total / 5) * 100,
    });
    progressBar.x = 250;
    progressBar.y = 30;
    //progressBar.progress = (this.state.total / 5) * 100;
    this.addChild(progressBar);
  }

  exit(): void {
    this.removeChildren();
  }

  // ── Helpers ─────────────────────────────────
  private makeButton(label: string, color = 0x2471a3): Container {
    const btn = new Container();
    btn.eventMode = "static";
    btn.cursor = "pointer";

    const bg = new Graphics();
    const draw = (col: number) => {
      bg.clear();
      bg.roundRect(-60, -30, 120, 60, 12);
      bg.fill(col);
    };
    draw(color);

    const txt = new Text({
      text: label,
      style: { fontFamily: "Arial", fontSize: 28, fill: 0xffffff },
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

  private shuffle(arr: number[]): number[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
