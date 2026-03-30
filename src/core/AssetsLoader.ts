import { Assets } from "pixi.js";

export const AssetsLoader = {
  async loadAll(): Promise<void> {
    await Assets.load([
      { alias: "bunny", src: "https://pixijs.com/assets/bunny.png" },
    ]);
  },
};
