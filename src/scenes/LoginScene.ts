import { Text, Container, Graphics } from "pixi.js";
import { gsap } from "gsap";
import { Input } from "@pixi/ui";
import { BaseScene } from "../core/BaseScene";
import { SceneManager } from "../core/SceneManager";
import { GameState } from "../core/GameState";
import { supabase } from "../core/supabase";
import { MenuScene } from "./MenuScene";
import { Theme } from "../core/Theme";

export class LoginScene extends BaseScene {
  private manager: SceneManager;
  private state: GameState;

  constructor(manager: SceneManager, state: GameState) {
    super();
    this.manager = manager;
    this.state = state;
  }

  enter(): void {
    // ── Fond carte centrale ──────────────────────
    const card = new Graphics();
    card.roundRect(0, 0, 440, 340, 20);
    card.fill({ color: 0xffffff, alpha: 0.05 });
    card.stroke({ color: 0xffffff, width: 1, alpha: 0.2 });
    card.x = 180;
    card.y = 50;
    this.addChild(card);

    // ── Titre ────────────────────────────────────
    const title = new Text({
      text: "🔷 GéoKids",
      style: { fontFamily: "Arial", fontSize: 38, fill: 0xffd700 },
    });
    title.anchor.set(0.5);
    title.x = 400;
    title.y = 85;
    this.addChild(title);

    // ── Sous-titre ───────────────────────────────
    const subtitle = new Text({
      text: "Connecte-toi pour jouer !",
      style: { fontFamily: "Arial", fontSize: 18, fill: 0xaaaaaa },
    });
    subtitle.anchor.set(0.5);
    subtitle.x = 400;
    subtitle.y = 125;
    this.addChild(subtitle);

    // ── Champ Email ──────────────────────────────
    const emailLabel = new Text({
      text: "Email",
      style: { fontFamily: "Arial", fontSize: 16, fill: 0xcccccc },
    });
    emailLabel.x = 210;
    emailLabel.y = 155;
    this.addChild(emailLabel);

    const emailInput = this.makeInput("email@exemple.com");
    emailInput.x = 210;
    emailInput.y = 175;
    this.addChild(emailInput);

    // ── Champ Password ───────────────────────────
    const passLabel = new Text({
      text: "Mot de passe",
      style: { fontFamily: "Arial", fontSize: 16, fill: 0xcccccc },
    });
    passLabel.x = 210;
    passLabel.y = 235;
    this.addChild(passLabel);

    const passInput = this.makeInput("••••••••");
    passInput.x = 210;
    passInput.y = 255;
    this.addChild(passInput);

    // ── Feedback ─────────────────────────────────
    const feedback = new Text({
      text: "",
      style: { fontFamily: "Arial", fontSize: 16, fill: 0xffffff },
    });
    feedback.anchor.set(0.5);
    feedback.x = 400;
    feedback.y = 318;
    this.addChild(feedback);

    // ── Bouton Connexion ─────────────────────────
    const btnLogin = this.makeButton("Se connecter", Theme.primary);
    btnLogin.x = 245;
    btnLogin.y = 345;
    btnLogin.on("pointerdown", async () => {
      feedback.text = "⏳ Connexion...";
      feedback.style.fill = 0xffffff;

      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput.value,
        password: passInput.value,
      });

      if (error) {
        feedback.text = "❌ Email ou mot de passe incorrect";
        feedback.style.fill = Theme.danger;
        gsap.from(feedback, {
          pixi: { x: feedback.x + 8 },
          duration: 0.05,
          yoyo: true,
          repeat: 5,
        });
      } else {
        feedback.text = "✅ Connecté !";
        feedback.style.fill = Theme.success;
        setTimeout(() => {
          this.manager.go(new MenuScene(this.manager, this.state));
        }, 800);
      }
    });
    this.addChild(btnLogin);

    // ── Bouton Inscription ───────────────────────
    const btnSignup = this.makeButton("S'inscrire", Theme.secondary);
    btnSignup.x = 460;
    btnSignup.y = 345;
    btnSignup.on("pointerdown", async () => {
      feedback.text = "⏳ Inscription...";
      feedback.style.fill = 0xffffff;

      const { error } = await supabase.auth.signUp({
        email: emailInput.value,
        password: passInput.value,
      });

      if (error) {
        feedback.text = "❌ " + error.message;
        feedback.style.fill = Theme.danger;
      } else {
        feedback.text = "✅ Vérifie ton email pour confirmer !";
        feedback.style.fill = Theme.success;
      }
    });
    this.addChild(btnSignup);

    // ── Animation d'entrée ───────────────────────
    gsap.from(card, {
      pixi: { alpha: 0, y: card.y + 20 },
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.from(title, {
      pixi: { scaleX: 0, scaleY: 0 },
      duration: 0.5,
      delay: 0.2,
      ease: "back.out(1.5)",
    });
  }

  exit(): void {
    this.removeChildren();
  }

  // ── Input field ──────────────────────────────
  private makeInput(placeholder: string): Input {
    return new Input({
      bg: new Graphics()
        .roundRect(0, 0, 380, 45, 8)
        .fill({ color: 0xffffff, alpha: 0.1 }),
      placeholder,
      padding: { left: 12, right: 12, top: 8, bottom: 8 },
    });
  }

  // ── Bouton standard ──────────────────────────
  private makeButton(label: string, color: number): Container {
    const btn = new Container();
    btn.eventMode = "static";
    btn.cursor = "pointer";

    const bg = new Graphics();
    const draw = () => {
      bg.clear();
      bg.roundRect(0, 0, 140, 45, 10);
      bg.fill(color);
    };
    draw();

    const txt = new Text({
      text: label,
      style: { fontFamily: "Arial", fontSize: 18, fill: 0xffffff },
    });
    txt.anchor.set(0.5);
    txt.x = 70;
    txt.y = 22;

    btn.addChild(bg, txt);
    btn.on("pointerover", () => (bg.alpha = 0.8));
    btn.on("pointerout", () => (bg.alpha = 1));

    return btn;
  }
}
