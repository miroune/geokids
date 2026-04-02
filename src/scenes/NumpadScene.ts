import { Text, Container, Graphics } from "pixi.js";
import { gsap } from "gsap";
import { BaseScene } from "../core/BaseScene";
import { SceneManager } from "../core/SceneManager";
import { GameState } from "../core/GameState";
import { ResultsScene } from "./ResultsScene";

export class NumpadScene extends BaseScene {
  private manager: SceneManager;
  private state: GameState;
  private input: string = "";

  constructor(manager: SceneManager, state: GameState) {
    super();
    this.manager = manager;
    this.state = state;
  }

  enter(): void {
    const largeur = Math.floor(Math.random() * 9) + 1;
    const hauteur = Math.floor(Math.random() * 9) + 1;
    const bonneReponse = (largeur + hauteur) * 2;

    // ── Question ────────────────────────────────
    const question = new Text({
      text: "Quel est le périmètre de ce rectangle ?",
      style: { fontFamily: "Arial", fontSize: 30, fill: 0xffffff },
    });
    question.anchor.set(0.5);
    question.x = 400;
    question.y = 50;
    this.addChild(question);

    // ── Rectangle ────────────────────────────────
    const maxH = 150; // hauteur max disponible
    const scale = Math.min(20, Math.floor(maxH / hauteur));
    const rectW = largeur * scale;
    const rectH = hauteur * scale;

    const rect = new Graphics();
    rect.rect(-rectW / 2, -rectH / 2, rectW, rectH);
    rect.fill(0xe74c3c);
    rect.x = 580;
    rect.y = 200;
    this.addChild(rect);

    // ── Labels dimensions ────────────────────────
    const lgLabel = new Text({
      text: `${largeur} cm`,
      style: { fontFamily: "Arial", fontSize: 16, fill: 0xffffff },
    });
    lgLabel.anchor.set(0.5);
    lgLabel.x = 580;
    lgLabel.y = rect.y - rectH / 2 - 20;
    this.addChild(lgLabel);

    const htLabel = new Text({
      text: `${hauteur} cm`,
      style: { fontFamily: "Arial", fontSize: 16, fill: 0xffffff },
    });
    htLabel.anchor.set(0, 0.5);
    htLabel.x = rect.x + rectW / 2 + 10;
    htLabel.y = rect.y;
    this.addChild(htLabel);

    // ── Zone de saisie ───────────────────────────
    const inputBox = new Graphics();
    inputBox.roundRect(-80, -25, 160, 50, 8);
    inputBox.fill({ color: 0x000000, alpha: 0.3 });
    inputBox.stroke({ width: 2, color: 0xffd700 });
    inputBox.x = 580;
    inputBox.y = 330;
    this.addChild(inputBox);

    const inputText = new Text({
      text: "",
      style: { fontFamily: "Arial", fontSize: 28, fill: 0xffd700 },
    });
    inputText.anchor.set(0.5);
    inputText.x = 580;
    inputText.y = 330;
    this.addChild(inputText);

    // ── Feedback (créé une seule fois ici) ───────
    const feedback = new Text({
      text: "",
      style: { fontFamily: "Arial", fontSize: 26, fill: 0xffffff },
    });
    feedback.anchor.set(0.5);
    feedback.x = 580;
    feedback.y = 390;
    this.addChild(feedback);

    // ── Clavier ──────────────────────────────────
    const startX = 200;
    const startY = 150;
    const btnSize = 80;
    const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"];

    labels.forEach((element, index) => {
      const btn = this.makeNumpadButton(
        element,
        inputText,
        feedback,
        bonneReponse,
      );
      const col = index % 3;
      const ligne = Math.floor(index / 3);
      btn.x = startX + col * btnSize;
      btn.y = startY + ligne * btnSize;
      this.addChild(btn);
    });
  }

  exit(): void {
    this.input = "";
    this.removeChildren();
  }

  // ── Helper bouton numpad ─────────────────────
  private makeNumpadButton(
    label: string,
    inputText: Text,
    feedback: Text,
    bonneReponse: number,
  ): Container {
    const btn = new Container();
    btn.eventMode = "static";
    btn.cursor = "pointer";

    const bg = new Graphics();
    const draw = (col: number) => {
      bg.clear();
      bg.roundRect(-30, -20, 60, 40, 10);
      bg.fill(col);
    };
    draw(0x2471a3);

    const txt = new Text({
      text: label,
      style: { fontFamily: "Arial", fontSize: 18, fill: 0xffffff },
    });
    txt.anchor.set(0.5);

    btn.addChild(bg, txt);

    btn.on("pointerover", () => draw(0x2471a3 + 0x222222));
    btn.on("pointerout", () => draw(0x2471a3));

    btn.on("pointerdown", () => {
      if (label === "⌫") {
        // ── Effacer dernier caractère ───────────
        this.input = this.input.slice(0, -1);
        inputText.text = this.input;
        feedback.text = "";
      } else if (label === "✓") {
        // ── Vérifier la réponse ─────────────────
        if (this.input === "") return; // rien tapé → ignorer

        if (this.input === bonneReponse.toString()) {
          // ✅ Bonne réponse
          feedback.text = "✅ Bravo !";
          feedback.style.fill = 0x2ecc71;
          this.state.score++;
          this.state.total++;

          gsap.from(inputText, {
            pixi: { scaleX: 1.3, scaleY: 1.3 },
            duration: 0.3,
            ease: "back.out(1.5)",
          });

          setTimeout(() => {
            this.manager.go(
              new ResultsScene(this.manager, this.state, "numpad"),
            );
          }, 1200);
        } else {
          // ❌ Mauvaise réponse → réessayer
          feedback.text = "❌ Essaie encore !";
          feedback.style.fill = 0xe74c3c;

          gsap.to(inputText, {
            pixi: { x: inputText.x + 8 },
            duration: 0.05,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
              this.input = "";
              inputText.text = "";
            },
          });
        }
      } else {
        // ── Ajouter chiffre ─────────────────────
        if (this.input.length >= 3) return; // max 3 chiffres
        this.input = this.input + label;
        inputText.text = this.input;
        feedback.text = "";
      }
    });

    return btn;
  }
}
