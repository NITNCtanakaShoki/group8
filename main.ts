import { Environment, Person } from "./deps.ts";
import { Action } from "./action.ts";
import { ProfitSharingAgent } from "./profitSharingAgent.ts";
import { QTable } from "./qTable.ts";
import { State } from "./state.ts";

// 環境のパラメータ設定
const w = 1; // 同室希望の場合の幸福度
const d = -1; // 同室拒否の場合の幸福度
const s = 0; // どちらでもない場合の幸福度
const a = 2; // attended roomsの数
const m = 1; // movable peopleの数

// 評価関数の定義
const evaluate = (happinesses: number[]) => {
  return happinesses.reduce((a, b) => a + b, 0);
};

// Profit Sharingのパラメータ設定（調整された値）
const learningRate = 0.1; // 学習率を調整
const discountFactor = 0.9; // 割引率を調整

function prepareEnvironment(): Environment {
  const people = [
    new Person("佐藤"),
    new Person("鈴木"),
    new Person("田中"),
    new Person("明石"),
    new Person("石田"),
    new Person("牛若"),
    new Person("今西"),
    new Person("岡本"),
    new Person("楽間"),
    new Person("清水"),
    new Person("阪本"),
    new Person("堀田"),
  ] as const;
  for (const person of people) {
    const others = people.filter((p) => p !== person);
    for (const other of others) {
      const random = Math.floor(Math.random() * 3);
      switch (random) {
        case 0:
          person.likes(other);
          break;
        case 1:
          person.dislikes(other);
          break;
        case 2:
          break;
        default:
          throw new Error(`random ${random}`);
      }
    }
  }
  return new Environment(new Set(people), w, d, s, a, m, evaluate);
}

// 学習ループ
for (let i = 0; i < 1; i++) {
  let agent = new ProfitSharingAgent(
    learningRate,
    discountFactor,
    Action.allCases,
    [],
    QTable.create(),
  );
  for (let episode = 0; episode < 1000; episode++) {
    const env = prepareEnvironment();
    for (let step = 0; step < 10; step++) {
      for (let j = 0; j < 10; j++) {
        const state = new State(env.getState());
        const action = agent.choose(state);
        const _ = env.receive(action.lib);
        agent = agent.log(action, state);
      }
      if (step === 9) {
        const evaluationValue = env.getEvaluationValue();
        agent = agent.learn(evaluationValue);
      }
    }

    if (episode % 10 === 0) {
      console.log(env.getEvaluationValue());
    }
    if (episode % 100 === 0) {
      console.log("⭐️", agent.display);
    }
  }
}
