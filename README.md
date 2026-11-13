# Newspaper Seller Simulation (Monorepo)

React + Tailwind client and Node + Express server for the newspaper seller problem
(Banks, Carson, Nelson & Nicol, *Discrete-Event System Simulation*, Chapter 2).

## Structure

```
newspaper-sim/
├── package.json              npm workspaces + scripts
├── client/                   React + Vite + Tailwind (port 5173)
│   ├── src/App.jsx
│   ├── src/api.js            fetch calls to the backend
│   └── src/components/       InputForm, ModelData, Summary, ResultTable, CompareChart
└── server/                   Express API (port 3001)
    ├── src/simulation.js     simulation logic (pure functions)
    ├── src/routes.js         /api/config, /api/simulate, /api/compare
    ├── src/index.js          app entry
    └── test/                 unit tests
```

## Run

Needs Node 18.11 or newer.

```bash
npm install        # in the repo root, installs client and server
npm run dev        # server on :3001, client on :5173
```

Open http://localhost:5173

Other commands:

```bash
npm test           # server unit tests
npm start          # build client, then serve everything from Express on :3001
```

## API

| Method | Route | Body | Returns |
|---|---|---|---|
| GET | /api/config | none | day types, demand tables, defaults |
| POST | /api/simulate | `{orderSize, days, cost, price, scrap, seed?}` | day-by-day rows + summary |
| POST | /api/compare | same | total profit for order sizes 40..100 and the best one |

## Model

- Day type: Good 0.35, Fair 0.45, Poor 0.20
- Demand 40..100 depends on the day type (tables shown in the app)
- Daily profit = revenue − cost of papers − lost profit from excess demand + salvage of scrap
- Defaults: cost $0.33, price $0.50, scrap $0.05, 20 days
