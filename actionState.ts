import { Action } from "./action.ts";
import { State } from "./state.ts";

export class ActionState {
  readonly #action: Action;
  readonly #state: State;

  constructor(action: Action, state: State) {
    this.#action = action;
    this.#state = state;
  }

  get key(): string {
    return `${this.#action.key}, ${this.#state.key}`;
  }
}
