import { Action as LibAction } from "./deps.ts";
export class Action {
  readonly #v: LibAction;
  constructor(lib: LibAction) {
    this.#v = lib;
  }

  get lib(): LibAction {
    return this.#v;
  }

  static make(memberIndex1: number, memberIndex2: number): Action {
    return new Action(new LibAction(memberIndex1, memberIndex2));
  }

  static allCases: readonly Self[] = (() => {
    const result: Self[] = [];
    for (let i = 1; i <= 2; i++) {
      for (let j = 1; j <= i; j++) {
        result.push(Action.make(i, j));
      }
    }
    return result;
  })();

  get key(): string {
    return `m1: ${this.#v.memberIndex1}, m2: ${this.#v.memberIndex2}`;
  }
}
type Self = Action;
