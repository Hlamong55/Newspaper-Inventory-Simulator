// server/src/routes.js  --  REST API
const express = require("express");
const sim = require("./simulation");

const router = express.Router();

// Validate and clean the request body. Throws Error with a readable message.
function cleanInput(body = {}) {
  const num = (v, name, min, max, integer) => {
    const n = Number(v);
    if (v === "" || !Number.isFinite(n)) throw new Error(`${name} must be a number`);
    if (integer && !Number.isInteger(n)) throw new Error(`${name} must be a whole number`);
    if (n < min || n > max) throw new Error(`${name} must be between ${min} and ${max}`);
    return n;
  };
  const d = sim.DEFAULTS;
  const out = {
    orderSize: num(body.orderSize ?? d.orderSize, "Order size", 0, 1000, true),
    days: num(body.days ?? d.days, "Days", 1, 10000, true),
    cost: num(body.cost ?? d.cost, "Cost", 0, 1000, false),
    price: num(body.price ?? d.price, "Selling price", 0, 1000, false),
    scrap: num(body.scrap ?? d.scrap, "Scrap value", 0, 1000, false),
    seed:
      body.seed === undefined || body.seed === null || body.seed === ""
        ? null
        : num(body.seed, "Seed", 0, 4294967295, true),
  };
  if (out.price < out.cost) throw new Error("Selling price must be at least the cost");
  if (out.scrap > out.cost) throw new Error("Scrap value cannot be more than the cost");
  return out;
}

const wrap = (fn) => (req, res) => {
  try {
    res.json(fn(req));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

router.get("/config", (req, res) =>
  res.json({
    dayTypes: sim.DAY_TYPES,
    demands: sim.DEMANDS,
    demandProbs: sim.DEMAND_PROBS,
    defaults: sim.DEFAULTS,
  })
);

router.post("/simulate", wrap((req) => sim.simulate(cleanInput(req.body))));
router.post("/compare", wrap((req) => sim.compare(cleanInput(req.body))));

module.exports = router;
module.exports.cleanInput = cleanInput;
