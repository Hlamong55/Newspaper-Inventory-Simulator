import { useEffect, useState } from "react";
import { getConfig, runSimulation, compareOrderSizes } from "./api.js";
import InputForm from "./components/InputForm.jsx";
import ModelData from "./components/ModelData.jsx";
import Summary from "./components/Summary.jsx";
import ResultTable from "./components/ResultTable.jsx";
import CompareChart from "./components/CompareChart.jsx";

function Card({ title, children }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  const [config, setConfig] = useState(null);
  const [result, setResult] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getConfig()
      .then(setConfig)
      .catch(() => setError("Cannot reach the server. Start it with: npm run dev"));
  }, []);

  // Run an API call and handle loading and error state in one place.
  const run = async (call, onDone, params) => {
    setLoading(true);
    setError("");
    try {
      onDone(await call(params));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRun = (params) => run(runSimulation, setResult, params);
  const handleCompare = (params) => run(compareOrderSizes, setComparison, params);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Newspaper Seller Problem</h1>
        <p className="mt-1 text-slate-600">
          Simulation of daily demand and profit: how many papers should the seller buy each day?
        </p>
      </header>

      {error && (
        <div role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {config && (
        <>
          <Card title="1. Inputs">
            <InputForm defaults={config.defaults} loading={loading} onRun={handleRun} onCompare={handleCompare} />
          </Card>

          {result && (
            <Card title="2. Simulation results">
              <div className="space-y-5">
                <Summary summary={result.summary} params={result.params} />
                <ResultTable rows={result.rows} />
              </div>
            </Card>
          )}

          {comparison && (
            <Card title="3. Order size vs. total profit">
              <CompareChart data={comparison} />
            </Card>
          )}

          <Card title="Model data (from the textbook)">
            <ModelData config={config} />
          </Card>
        </>
      )}

      <footer className="pb-4 text-center text-xs text-slate-500">
        Based on Banks, Carson, Nelson &amp; Nicol, <i>Discrete-Event System Simulation</i>, Chapter 2.
      </footer>
    </div>
  );
}
