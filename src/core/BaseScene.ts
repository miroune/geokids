import { Container } from "pixi.js";

export class BaseScene extends Container {
  // Appelée quand la scène devient active → construire l'écran
  enter(): void {}

  // Appelée quand la scène est détruite → nettoyer
  exit(): void {}
}
