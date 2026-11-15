
import { useEffect, useState } from "react";
import { getConfig, runSimulation, compareOrderSizes } from "./api.js";
import InputForm from "./components/InputForm.jsx";
import ModelData from "./components/ModelData.jsx";
import Summary from "./components/Summary.jsx";
import ResultTable from "./components/ResultTable.jsx";
import CompareChart from "./components/CompareChart.jsx";

const navigation = [
  { label: "Overview", href: "#overview", number: "1" },
  { label: "Simulation setup", href: "#simulation", number: "2" },
  { label: "Daily results", href: "#results", number: "3" },
  { label: "Order comparison", href: "#comparison", number: "4" },
  { label: "Model data", href: "#model", number: "5" },
];

function Section({
  id,
  number,
  title,
  description,
  children,
  aside,
}) {
  return (
    <section
      id={id}
      className="scroll-mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
            {number}
          </span>

          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              {title}
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
        </div>

        {aside && (
          <div className="self-start">{aside}</div>
        )}
      </div>

      <div className="px-5 py-6 sm:px-7">
        {children}
      </div>
    </section>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-400 bg-slate-50 px-6 py-9 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-500">
        ▤
      </div>

      <p className="font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState(null);
  const [result, setResult] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getConfig()
      .then((data) => {
        if (active) {
          setConfig(data);
        }
      })
      .catch(() => {
        if (active) {
          setError(
            "Cannot reach the backend server. Start the project with: npm run dev"
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const run = async (call, onDone, params) => {
    setLoading(true);
    setError("");

    try {
      const data = await call(params);
      onDone(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRun = (params) =>
    run(runSimulation, setResult, params);

  const handleCompare = (params) =>
    run(compareOrderSizes, setComparison, params);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 lg:flex">

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 bg-slate-950 text-slate-200 lg:block">
        <div className="sticky top-0 flex h-screen flex-col px-5 py-7">

          {/* Brand */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-base font-extrabold text-slate-950">
              NS
            </div>

            <div>
              <p className="text-base font-bold tracking-tight text-white">
                NewsLab
              </p>

              <p className="text-xs text-slate-400">
                Simulation workspace
              </p>
            </div>
          </div>

          {/* Navigation */}
          <p className="mb-3 mt-9 px-3 text-[11px] font-bold uppercase tracking-[0.17em] text-slate-500">
            Workspace
          </p>

          <nav
            aria-label="Main navigation"
            className="space-y-1"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-300">
                  {item.number}
                </span>

                {item.label}
              </a>
            ))}
          </nav>

        </div>
      </aside>


      {/* Main Content */}
      <div className="min-w-0 flex-1">

        {/* Mobile Header */}
        <div className="bg-slate-950 px-5 py-4 text-white lg:hidden">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold tracking-tight">
              NewsLab
            </span>

            <span className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300">
              CSE 424
            </span>
          </div>

          <nav
            className="mt-4 flex gap-4 overflow-x-auto pb-1 text-xs text-slate-300"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <main className="mx-auto max-w-7xl space-y-7 px-5 py-8 sm:px-8 lg:px-10 ">

          {/* Overview */}
          <section
            id="overview"
            className="scroll-mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-md sm:p-8"
          >
            <div className="flex flex-wrap items-center gap-2">

              <span className="rounded-md bg-slate-900 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
                Simulation Lab
              </span>

              <span className="rounded-md border border-slate-400 px-2.5 py-1.5 text-[11px] font-medium text-slate-500">
                Monte Carlo simulation
              </span>

            </div>

            <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Newspaper Seller Problem
            </h1>

            <p className="mt-3 max-w-4xl  leading-7 text-slate-600 text-base">
              Explore daily newspaper demand, calculate sales
              profit, and compare order quantities using a
              repeatable simulation model.
            </p>

            <div className="mt-7 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-3">

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Simulation approach
                </p>

                <p className="mt-1  font-semibold text-slate-900">
                  Random sampling
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Decision variable
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  Order quantity
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Performance metric
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  Total &amp; daily profit
                </p>
              </div>

            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800"
            >
              <span className="font-semibold">
                Request error:
              </span>{" "}
              {error}
            </div>
          )}

          {/* Simulation Setup */}
          <Section
            id="simulation"
            number="2"
            title="Simulation setup"
            description="Set the order quantity, number of days, prices and random seed. Run the model or compare several quantities."
            aside={
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Parameters
              </span>
            }
          >
            {config ? (
              <InputForm
                defaults={config.defaults}
                loading={loading}
                onRun={handleRun}
                onCompare={handleCompare}
              />
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">
                {error
                  ? "Backend configuration could not be loaded."
                  : "Loading model configuration..."}
              </p>
            )}
          </Section>

          {/* Daily Results */}
          <Section
            id="results"
            number="3"
            title="Daily simulation results"
            description="Review revenue, costs, profit and the day-by-day random sampling results."
            aside={
              result && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {result.rows.length} days simulated
                </span>
              )
            }
          >
            {result ? (
              <div className="space-y-7">

                <Summary
                  summary={result.summary}
                  params={result.params}
                />

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="mb-4 text-sm font-bold text-slate-900">
                    Day-by-day data
                  </h3>

                  <ResultTable rows={result.rows} />
                </div>

              </div>
            ) : (
              <EmptyState
                title="No simulation results yet"
                description="Enter your parameters above and click Run simulation to view the daily profit analysis."
              />
            )}
          </Section>

          {/* Order Comparison */}
          <Section
            id="comparison"
            number="4"
            title="Order quantity comparison"
            description="Compare possible order quantities using the same random-number sequence for a fair comparison."
          >
            {comparison ? (
              <CompareChart data={comparison} />
            ) : (
              <EmptyState
                title="No order comparison yet"
                description="Click Find best order size in the setup section to compare the supported order quantities."
              />
            )}
          </Section>

          {/* Probability Model */}
          <Section
            id="model"
            number="5"
            title="Probability model"
            description="Reference probabilities for day types and conditional newspaper demand, as defined by the model."
          >
            {config ? (
              <ModelData config={config} />
            ) : (
              <p className="py-6 text-sm text-slate-500">
                Model data will appear when the backend is connected.
              </p>
            )}
          </Section>


          {/* Footer */}
          <footer className="border-t border-slate-200 py-3 text-center text-sm leading-6 ">
            CSE 424 | Simulation &amp; Modeling Sessional
            | Newspaper Seller Problem
          </footer>


        </main>
      </div>
    </div>
  );
}
