export class GameState {
  score: number = 0;
  total: number = 0;

  reset(): void {
    this.score = 0;
    this.total = 0;
  }
}
