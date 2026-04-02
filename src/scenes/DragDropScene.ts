import {
  Text,
  Container,
  Graphics,
  FederatedPointerEvent,
  Rectangle,
} from "pixi.js";
import { gsap } from "gsap";
import { BaseScene } from "../core/BaseScene";
import { SceneManager } from "../core/SceneManager";
import { GameState } from "../core/GameState";
import { MenuScene } from "./MenuScene";
import { ResultsScene } from "./ResultsScene";

export class DragDropScene extends BaseScene {
  private manager: SceneManager;
  private state: GameState;
  private dragTarget: Container | null = null;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private zones: Container[] = [];
  private matched: number = 0;

  constructor(manager: SceneManager, state: GameState) {
    super();
    this.manager = manager;
    this.state = state;
  }

  enter(): void {
    // ── Question ────────────────────────────────
    const prompt = new Text({
      text: "Glisse chaque opération vers son résultat !",
      style: { fontFamily: "Arial", fontSize: 26, fill: 0xffffff },
    });
    prompt.anchor.set(0.5);
    prompt.x = 400;
    prompt.y = 60;
    this.addChild(prompt);

    // ── Données : résultats tous différents ─────
    const pairs = [
      { operation: "3 + 4", result: 7 },
      { operation: "2 × 5", result: 10 },
      { operation: "8 - 3", result: 5 },
    ];

    const zonesX = [160, 400, 640];

    // ── Zones cibles (une seule boucle) ──────────
    pairs.forEach((pair, i) => {
      const zone = this.makeZone(String(pair.result));
      zone.x = zonesX[i];
      zone.y = 315;
      (zone as any)._expectedResult = pair.result;
      this.zones.push(zone);
      this.addChild(zone);
    });

    // ── Cartes draggables (mélangées) ────────────
    const shuffledPairs = this.shuffle([...pairs]);
    shuffledPairs.forEach((pair, i) => {
      const card = this.makeCard(pair.operation, pair.result);
      card.x = zonesX[i];
      card.y = 165;
      (card as any)._homeX = zonesX[i];
      (card as any)._homeY = 165;
      this.addChild(card);
    });

    // ── Bouton Menu ─────────────────────────────
    const menuBtn = this.makeButton("← Menu");
    menuBtn.x = 400;
    menuBtn.y = 416;
    menuBtn.on("pointerdown", () =>
      this.manager.go(new MenuScene(this.manager, this.state)),
    );
    this.addChild(menuBtn);

    // ── Événements globaux drag ──────────────────
    this.eventMode = "static";
    this.hitArea = new Rectangle(0, 0, 800, 450);
    this.on("pointermove", this.onDragMove.bind(this));
    this.on("pointerup", this.onDragEnd.bind(this));
  }

  // ── Drag move ───────────────────────────────
  private onDragMove(e: FederatedPointerEvent): void {
    if (!this.dragTarget) return;
    this.dragTarget.x = e.global.x - this.offsetX;
    this.dragTarget.y = e.global.y - this.offsetY;
  }

  // ── Drag end ────────────────────────────────
  private onDragEnd(): void {
    if (!this.dragTarget) return;

    const card = this.dragTarget;
    this.dragTarget = null;
    card.cursor = "grab";

    let dropped = false;

    for (const zone of this.zones) {
      const dx = card.x - zone.x;
      const dy = card.y - zone.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 80) {
        dropped = true;
        const cardResult = (card as any)._result;
        const expectedResult = (zone as any)._expectedResult;

        if (cardResult === expectedResult) {
          // ✅ Bonne zone
          card.x = zone.x;
          card.y = zone.y - 90;
          card.eventMode = "none"; // plus draggable
          //this.state.score++;
          this.matched++;

          // Animation succès
          gsap.from(card, {
            pixi: { scaleX: 1.3, scaleY: 1.3 },
            duration: 0.3,
            ease: "back.out(1.5)",
          });

          // Colorer la carte en vert
          (card.children[0] as Graphics).clear();
          (card.children[0] as Graphics).roundRect(-70, -30, 140, 60, 12);
          (card.children[0] as Graphics).fill(0x27ae60);

          // Toutes les cartes placées → aller aux résultats
          if (this.matched === this.zones.length) {
            this.state.score++;
            this.state.total++;
            setTimeout(() => {
              this.manager.go(
                new ResultsScene(this.manager, this.state, "dragdrop"),
              );
            }, 1200);
          }
        } else {
          // ❌ Mauvaise zone → retour position initiale
          gsap.to(card, {
            pixi: {
              x: (card as any)._homeX,
              y: (card as any)._homeY,
            },
            duration: 0.4,
            ease: "back.out(1.5)",
          });

          // Shake
          gsap.to(card, {
            pixi: { x: card.x + 8 },
            duration: 0.05,
            yoyo: true,
            repeat: 5,
          });
        }
        break;
      }
    }

    // Pas sur une zone → retour position initiale
    if (!dropped) {
      gsap.to(card, {
        pixi: {
          x: (card as any)._homeX,
          y: (card as any)._homeY,
        },
        duration: 0.4,
        ease: "back.out(1.5)",
      });
    }
  }

  // ── Fabriquer une carte draggable ────────────
  private makeCard(label: string, result: number): Container {
    const c = new Container();
    c.eventMode = "static";
    c.cursor = "grab";
    (c as any)._result = result;

    const bg = new Graphics();
    bg.roundRect(-70, -30, 140, 60, 12);
    bg.fill(0x2980b9);

    const txt = new Text({
      text: label,
      style: { fontFamily: "Arial", fontSize: 24, fill: 0xffffff },
    });
    txt.anchor.set(0.5);

    c.addChild(bg, txt);

    // Un seul listener pointerdown
    c.on("pointerdown", (e: FederatedPointerEvent) => {
      (c as any)._homeX = c.x;
      (c as any)._homeY = c.y;
      this.dragTarget = c;
      this.offsetX = e.global.x - c.x;
      this.offsetY = e.global.y - c.y;
      c.cursor = "grabbing";
      this.addChild(c); // bring to front
    });

    return c;
  }

  // ── Fabriquer une zone cible ─────────────────
  private makeZone(label: string): Container {
    const c = new Container();

    const bg = new Graphics();
    bg.roundRect(-70, -35, 140, 70, 12);
    bg.fill(0x1a1a2e);
    bg.stroke({ color: 0x3498db, width: 2 });

    const txt = new Text({
      text: label,
      style: { fontFamily: "Arial", fontSize: 28, fill: 0x3498db },
    });
    txt.anchor.set(0.5);

    c.addChild(bg, txt);
    return c;
  }

  // ── Fabriquer un bouton ──────────────────────
  private makeButton(label: string, color = 0x555555): Container {
    const c = new Container();
    c.eventMode = "static";
    c.cursor = "pointer";

    const bg = new Graphics();
    const draw = (col: number) => {
      bg.clear();
      bg.roundRect(-60, -25, 120, 50, 10);
      bg.fill(col);
    };
    draw(color);

    const txt = new Text({
      text: label,
      style: { fontFamily: "Arial", fontSize: 20, fill: 0xffffff },
    });
    txt.anchor.set(0.5);

    c.addChild(bg, txt);
    c.on("pointerover", () => draw(color + 0x222222));
    c.on("pointerout", () => draw(color));

    return c;
  }

  // ── Shuffle générique ────────────────────────
  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  exit(): void {
    this.removeChildren();
    this.removeAllListeners();
    this.zones = [];
    this.matched = 0;
  }
}
