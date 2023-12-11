import { Action } from "./action.ts";
import { ActionState } from "./actionState.ts";
import { State } from "./state.ts";

export class QTable {
  readonly #q: ReadonlyMap<string, number>;
  readonly #actions: readonly Action[];

  constructor(
    q: ReadonlyMap<string, number> = new Map(),
    actions: readonly Action[],
  ) {
    this.#q = q;
    this.#actions = actions;
  }

  static create(): Self {
    return new QTable(new Map(), Action.allCases);
  }

  /** ボルツマン選択
   * tau: ボルツマン分布の温度パラメータ
   */
  chose(state: State, tau = 0.1): Action {
    const probabilities = new Map<Action, number>();
    let sum = 0;

    // 各アクションのボルツマン確率を計算
    for (const action of this.#actions) {
      const qValue = this.get(new ActionState(action, state));
      const probability = Math.exp(qValue / tau);
      probabilities.set(action, probability);
      sum += probability;
    }

    // 確率を正規化
    const normalizedProbabilities = Array.from(probabilities.entries()).map(([action, probability]) => {
      return { action, probability: probability / sum };
    });

    // 確率に基づいてアクションを選択
    let random = Math.random();
    for (const { action, probability } of normalizedProbabilities) {
      random -= probability;
      if (random <= 0) {
        return action;
      }
    }

    // フォールバック（万が一全ての確率を通過した場合）
    console.log('💚')
    return this.#actions[0];
  }

  set(actionState: ActionState, value: number): Self {
    const q = new Map(this.#q);
    q.set(actionState.key, value);
    return new QTable(q, this.#actions);
  }

  get(actionState: ActionState): number {
    return this.#q.get(actionState.key) ?? 0;
  }

  get display(): string {
    return Array.from(this.#q.entries()).map(([key, value]) =>
      `${key}: ${value}`
    ).join("\n");
  }

  #weightedRandom(probabilities: number[]): Action {
    const random = Math.random();
    for (let i = 0, sum = 0; i < this.#actions.length; i++) {
      sum += probabilities[i];
      if (random <= sum) return this.#actions[i];
    }
    console.error("💚")
    return this.#actions[this.#actions.length - 1];
  }
}
type Self = QTable;
