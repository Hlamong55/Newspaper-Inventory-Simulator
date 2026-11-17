// server/src/simulation.js
// Newspaper Seller Problem simulation engine.
// Pure JavaScript (no Express dependency) so it can be tested independently.

const DAY_TYPES = [
  { name: "Good", prob: 0.35 },
  { name: "Fair", prob: 0.45 },
  { name: "Poor", prob: 0.20 },
];

const DEMANDS = [40, 50, 60, 70, 80, 90, 100];

// Conditional probabilities P(demand | day type), in DEMANDS order.
const DEMAND_PROBS = {
  Good: [0.03, 0.05, 0.15, 0.20, 0.35, 0.15, 0.07],
  Fair: [0.10, 0.18, 0.40, 0.20, 0.08, 0.04, 0.00],
  Poor: [0.44, 0.22, 0.16, 0.12, 0.06, 0.00, 0.00],
};

const DEFAULTS = {
  orderSize: 70,
  days: 20,
  cost: 0.33,
  price: 0.50,
  scrap: 0.05,
  seed: null, // Empty input generates a seed; the response returns it.
};

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

// Mulberry32 PRNG. Seed 0 is valid and different from seed 1.
function makeRng(seed) {
  let state = Number(seed) >>> 0;
  return function () {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A six-decimal random number, used BOTH for selection and display.
// This eliminates rounded-RN/category mismatches in the results table.
function drawRandom(rng) {
  return Math.floor(rng() * 1000000) / 1000000;
}

// Inverse-transform sampling: probability intervals are [start, end).
function pick(r, probabilities) {
  const randomInt = Math.round(r * 1_000_000);
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += Math.round(probabilities[i] * 1_000_000);

    if (randomInt < cumulative) return i;
  }

  return probabilities.length - 1;
}

// Course-model daily profit includes opportunity cost for unmet demand.
// Note: this is different from conventional accounting profit.
function dailyProfit({ demand, orderSize, cost, price, scrap }) {
  const sold = Math.min(demand, orderSize);
  const unsold = Math.max(orderSize - demand, 0);
  const shortage = Math.max(demand - orderSize, 0);
  const revenue = sold * price;
  const buyCost = orderSize * cost;
  const lostProfit = shortage * (price - cost);
  const salvage = unsold * scrap;
  const profit = revenue - buyCost - lostProfit + salvage;

  return { sold, unsold, shortage, revenue, buyCost, lostProfit, salvage, profit };
}

function simulate(input = {}) {
  const p = { ...DEFAULTS, ...input };
  const seed = p.seed === null || p.seed === undefined || p.seed === ""
    ? Math.floor(Math.random() * 4294967296)
    : Number(p.seed);
  const rng = makeRng(seed);
  const dayProbs = DAY_TYPES.map((d) => d.prob);

  const rows = [];
  const totals = { revenue: 0, cost: 0, lost: 0, salvage: 0, profit: 0 };
  const dayCount = { Good: 0, Fair: 0, Poor: 0 };

  for (let day = 1; day <= p.days; day++) {
    const rn1 = drawRandom(rng);
    const dayType = DAY_TYPES[pick(rn1, dayProbs)].name;
    const rn2 = drawRandom(rng);
    const demand = DEMANDS[pick(rn2, DEMAND_PROBS[dayType])];
    const d = dailyProfit({
      demand,
      orderSize: p.orderSize,
      cost: p.cost,
      price: p.price,
      scrap: p.scrap,
    });

    totals.revenue += d.revenue;
    totals.cost += d.buyCost;
    totals.lost += d.lostProfit;
    totals.salvage += d.salvage;
    totals.profit += d.profit;
    dayCount[dayType]++;

    rows.push({
      day,
      rn1,
      dayType,
      rn2,
      demand,
      orderSize: p.orderSize,
      sold: d.sold,
      unsold: d.unsold,
      shortage: d.shortage,
      revenue: round2(d.revenue),
      buyCost: round2(d.buyCost),
      lostProfit: round2(d.lostProfit),
      salvage: round2(d.salvage),
      profit: round2(d.profit),
    });
  }

  return {
    params: { ...p, seed }, // Actual seed makes even an unseeded run reproducible.
    rows,
    summary: {
      totalRevenue: round2(totals.revenue),
      totalCost: round2(totals.cost),
      totalLostProfit: round2(totals.lost),
      totalSalvage: round2(totals.salvage),
      totalProfit: round2(totals.profit),
      avgProfitPerDay: round2(totals.profit / p.days),
      dayCount,
    },
  };
}

// Compare all order sizes using identical random draws (common random numbers).
function compare(input = {}, orderSizes = DEMANDS) {
  const seed = input.seed === null || input.seed === undefined || input.seed === ""
    ? Math.floor(Math.random() * 4294967296)
    : Number(input.seed);

  const results = orderSizes.map((orderSize) => {
    const { summary } = simulate({ ...input, orderSize, seed });
    return {
      orderSize,
      totalProfit: summary.totalProfit,
      avgProfitPerDay: summary.avgProfitPerDay,
    };
  });

  const best = results.reduce((a, b) => (b.totalProfit > a.totalProfit ? b : a));
  return { seed, days: input.days ?? DEFAULTS.days, results, best };
}

module.exports = {
  simulate,
  compare,
  dailyProfit,
  DAY_TYPES,
  DEMANDS,
  DEMAND_PROBS,
  DEFAULTS,
};