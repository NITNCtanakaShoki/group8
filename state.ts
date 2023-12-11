import { ImpressionStat } from "./deps.ts";

export class State {
  readonly #v: ImpressionStat[][];
  constructor(v: ImpressionStat[][]) {
    this.#v = v;
  }

  get key(): string {
    return this.#v.flatMap((v) => v)
      .map((v) => `Like: ${v.likeCount}, Dislike: ${v.dislikeCount}`)
      .join(", ");
  }
}
type Self = State;
