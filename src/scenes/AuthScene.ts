import { Text } from "pixi.js";
import { BaseScene } from "../core/BaseScene";
import { SceneManager } from "../core/SceneManager";
import { GameState } from "../core/GameState";
import { supabase } from "../core/supabase";
import { MenuScene } from "./MenuScene";
import { LoginScene } from "./LoginScene";

export class AuthScene extends BaseScene {
  private manager: SceneManager;
  private state: GameState;

  constructor(manager: SceneManager, state: GameState) {
    super();
    this.manager = manager;
    this.state = state;
  }

  async enter(): Promise<void> {
    // ── Message de chargement ────────────────────
    const loading = new Text({
      text: "Chargement...",
      style: { fontFamily: "Arial", fontSize: 28, fill: 0xffffff },
    });
    loading.anchor.set(0.5);
    loading.x = 400;
    loading.y = 225;
    this.addChild(loading);

    // ── Vérifier si l'utilisateur est connecté ───
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      // ✅ Connecté → aller au menu
      this.manager.go(new MenuScene(this.manager, this.state));
    } else {
      // ❌ Non connecté → aller à la connexion
      this.manager.go(new LoginScene(this.manager, this.state));
    }
  }

  exit(): void {
    this.removeChildren();
  }
}
