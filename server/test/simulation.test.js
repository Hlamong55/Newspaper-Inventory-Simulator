// Run with:  npm test -w server     (uses Node's built-in test runner)
const test = require("node:test");
const assert = require("node:assert/strict");
const { simulate, compare, dailyProfit, DEMAND_PROBS, DAY_TYPES } = require("../src/simulation");

const base = { orderSize: 70, cost: 0.33, price: 0.5, scrap: 0.05 };
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test("excess demand: lost profit, no salvage", () => {
  const r = dailyProfit({ ...base, demand: 80 }); // sells 70, 10 unmet
  close(r.revenue, 35);
  close(r.buyCost, 23.1);
  close(r.lostProfit, 1.7);
  close(r.salvage, 0);
  close(r.profit, 10.2);
});

test("excess supply: salvage, no lost profit", () => {
  const r = dailyProfit({ ...base, demand: 60 }); // sells 60, 10 scrapped
  close(r.revenue, 30);
  close(r.lostProfit, 0);
  close(r.salvage, 0.5);
  close(r.profit, 7.4);
});

test("demand equals order: plain margin", () => {
  close(dailyProfit({ ...base, demand: 70 }).profit, 70 * 0.17);
});

test("probability tables each sum to 1", () => {
  close(DAY_TYPES.reduce((s, d) => s + d.prob, 0), 1);
  for (const k of Object.keys(DEMAND_PROBS)) close(DEMAND_PROBS[k].reduce((s, p) => s + p, 0), 1);
});

test("same seed gives the same run; row count equals days", () => {
  const a = simulate({ days: 20, seed: 42 });
  const b = simulate({ days: 20, seed: 42 });
  assert.equal(a.rows.length, 20);
  assert.deepEqual(a.rows, b.rows);
  assert.equal(a.summary.dayCount.Good + a.summary.dayCount.Fair + a.summary.dayCount.Poor, 20);
});

test("summary total equals sum of daily profits", () => {
  const r = simulate({ days: 50, seed: 7 });
  const sum = r.rows.reduce((s, x) => s + x.profit, 0);
  assert.ok(Math.abs(sum - r.summary.totalProfit) < 0.5);
});

test("demand never falls outside the table", () => {
  const r = simulate({ days: 2000, seed: 1 });
  assert.ok(r.rows.every((x) => x.demand >= 40 && x.demand <= 100 && x.demand % 10 === 0));
  assert.ok(!r.rows.some((x) => x.dayType === "Fair" && x.demand === 100)); // probability 0
});

test("compare returns every order size and a best one", () => {
  const c = compare({ days: 200, seed: 3 });
  assert.equal(c.results.length, 7);
  assert.ok(c.results.some((x) => x.orderSize === c.best.orderSize));
  assert.ok(c.results.every((x) => x.totalProfit <= c.best.totalProfit));
});

test("Fair day demand is correct at the 0.88 boundary", () => {
  const { rows } = simulate({
    ...base,
    days: 25,
    seed: 4097,
  });

  const row = rows[24];

  assert.equal(row.dayType, "Fair");
  assert.equal(row.rn2, 0.88);
  assert.equal(row.demand, 80);
  close(row.lostProfit, 1.7);
  close(row.profit, 10.2);
});
