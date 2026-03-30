import { Container } from "pixi.js";

export class BaseScene extends Container {
  // Appelée quand la scène devient active
  // → c'est ici qu'on construit l'écran
  enter(): void {}

  // Appelée quand la scène est détruite
  // → c'est ici qu'on nettoie
  exit(): void {}
}
