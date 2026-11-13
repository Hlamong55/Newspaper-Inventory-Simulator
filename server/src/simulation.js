// server/src/simulation.js
// Newspaper seller problem (Banks, Carson, Nelson & Nicol, Ch. 2).
// Pure logic: no Express code in here, so it is easy to test.

const DAY_TYPES = [
  { name: "Good", prob: 0.35 },
  { name: "Fair", prob: 0.45 },
  { name: "Poor", prob: 0.20 },
];

const DEMANDS = [40, 50, 60, 70, 80, 90, 100];

// P(demand | day type), same order as DEMANDS
const DEMAND_PROBS = {
  Good: [0.03, 0.05, 0.15, 0.2, 0.35, 0.15, 0.07],
  Fair: [0.1, 0.18, 0.4, 0.2, 0.08, 0.04, 0.0],
  Poor: [0.44, 0.22, 0.16, 0.12, 0.06, 0.0, 0.0],
};

const DEFAULTS = {
  orderSize: 70,
  days: 20,
  cost: 0.33, // purchase cost per paper
  price: 0.5, // selling price per paper
  scrap: 0.05, // scrap value per unsold paper
  seed: null, // null = different every run
};

// Seedable random generator (mulberry32) so a run can be reproduced.
function makeRng(seed) {
  if (seed === null || seed === undefined || seed === "") return Math.random;
  let a = (Number(seed) >>> 0) || 1;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Inverse transform: first category whose cumulative probability >= r
function pick(r, probs) {
  let cum = 0;
  for (let i = 0; i < probs.length; i++) {
    cum += probs[i];
    if (r <= cum + 1e-12) return i;
  }
  return probs.length - 1;
}

const round2 = (x) => Math.round(x * 100) / 100;

// Profit for one day:
// revenue from sales - cost of papers - lost profit from excess demand + salvage of scrap
function dailyProfit({ demand, orderSize, cost, price, scrap }) {
  const sold = Math.min(demand, orderSize);
  const revenue = sold * price;
  const buyCost = orderSize * cost;
  const lostProfit = Math.max(demand - orderSize, 0) * (price - cost);
  const salvage = Math.max(orderSize - demand, 0) * scrap;
  return { revenue, buyCost, lostProfit, salvage, profit: revenue - buyCost - lostProfit + salvage };
}

function simulate(input = {}) {
  const p = { ...DEFAULTS, ...input };
  const rng = makeRng(p.seed);
  const dayProbs = DAY_TYPES.map((d) => d.prob);

  const rows = [];
  const tot = { revenue: 0, cost: 0, lost: 0, salvage: 0, profit: 0 };
  const dayCount = { Good: 0, Fair: 0, Poor: 0 };

  for (let day = 1; day <= p.days; day++) {
    const rn1 = rng();
    const dayType = DAY_TYPES[pick(rn1, dayProbs)].name;
    const rn2 = rng();
    const demand = DEMANDS[pick(rn2, DEMAND_PROBS[dayType])];

    const d = dailyProfit({ demand, orderSize: p.orderSize, cost: p.cost, price: p.price, scrap: p.scrap });
    tot.revenue += d.revenue;
    tot.cost += d.buyCost;
    tot.lost += d.lostProfit;
    tot.salvage += d.salvage;
    tot.profit += d.profit;
    dayCount[dayType]++;

    rows.push({
      day,
      rn1: round2(rn1),
      dayType,
      rn2: round2(rn2),
      demand,
      revenue: round2(d.revenue),
      lostProfit: round2(d.lostProfit),
      salvage: round2(d.salvage),
      profit: round2(d.profit),
    });
  }

  return {
    params: p,
    rows,
    summary: {
      totalRevenue: round2(tot.revenue),
      totalCost: round2(tot.cost),
      totalLostProfit: round2(tot.lost),
      totalSalvage: round2(tot.salvage),
      totalProfit: round2(tot.profit),
      avgProfitPerDay: round2(tot.profit / p.days),
      dayCount,
    },
  };
}

// Compare order sizes on the SAME random draws, so the comparison is fair.
function compare(input = {}, orderSizes = DEMANDS) {
  const noSeed = input.seed === null || input.seed === undefined || input.seed === "";
  const seed = noSeed ? Math.floor(Math.random() * 1e9) : input.seed;
  const results = orderSizes.map((q) => {
    const r = simulate({ ...input, orderSize: q, seed });
    return { orderSize: q, totalProfit: r.summary.totalProfit, avgProfitPerDay: r.summary.avgProfitPerDay };
  });
  const best = results.reduce((a, b) => (b.totalProfit > a.totalProfit ? b : a));
  return { seed, days: input.days ?? DEFAULTS.days, results, best };
}

module.exports = { simulate, compare, dailyProfit, DAY_TYPES, DEMANDS, DEMAND_PROBS, DEFAULTS };
