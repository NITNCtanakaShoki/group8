import { Action } from "./action.ts";
import { QTable } from "./qTable.ts";
import { ActionState } from "./actionState.ts";
import { State } from "./state.ts";

export class ProfitSharingAgent {
  readonly #learningRate: number;
  readonly #discountFactor: number;
  readonly #actions: readonly Action[];
  readonly #history: readonly ActionState[];
  readonly #q: QTable;

  constructor(
    learningRate: number,
    discountFactor: number,
    actions: readonly Action[],
    history: readonly ActionState[],
    q: QTable,
  ) {
    this.#learningRate = learningRate;
    this.#discountFactor = discountFactor;
    this.#actions = actions;
    this.#history = history;
    this.#q = q;
  }

  choose(state: State): Action {
    return this.#q.chose(state);
  }

  log(action: Action, state: State): Self {
    const actionState = new ActionState(action, state);
    return this.#update({ history: [...this.#history, actionState] });
  }

  learn(reward: number): Self {
    let discountedReward = reward;
    let qTable = this.#q;
    for (const history of this.#history.slice().reverse()) {
      const oldQ = qTable.get(history);
      const newQ = oldQ + (discountedReward * this.#learningRate);
      qTable = qTable.set(history, newQ);
      discountedReward *= this.#discountFactor;
    }
    return this.#update({ q: qTable, history: [] });
  }

  #update(patch: {
    learningRate?: number;
    discountFactor?: number;
    actions?: readonly Action[];
    history?: readonly ActionState[];
    q?: QTable;
  }): Self {
    return new ProfitSharingAgent(
      patch.learningRate ?? this.#learningRate,
      patch.discountFactor ?? this.#discountFactor,
      patch.actions ?? this.#actions,
      patch.history ?? this.#history,
      patch.q ?? this.#q,
    );
  }

  get display(): string {
    return this.#q.display;
  }
}
type Self = ProfitSharingAgent;
