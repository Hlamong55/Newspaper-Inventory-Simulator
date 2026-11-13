import { useState } from "react";

const FIELDS = [
  { name: "orderSize", label: "Order size (papers/day)", step: 1, min: 0 },
  { name: "days", label: "Number of days", step: 1, min: 1 },
  { name: "cost", label: "Cost per paper ($)", step: 0.01, min: 0 },
  { name: "price", label: "Selling price ($)", step: 0.01, min: 0 },
  { name: "scrap", label: "Scrap value ($)", step: 0.01, min: 0 },
  { name: "seed", label: "Seed (optional, repeatable results)", step: 1, min: 0, placeholder: "random" },
];

export default function InputForm({ defaults, loading, onRun, onCompare }) {
  const [values, setValues] = useState({
    orderSize: defaults.orderSize,
    days: defaults.days,
    cost: defaults.cost,
    price: defaults.price,
    scrap: defaults.scrap,
    seed: "",
  });

  const change = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onRun(values);
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FIELDS.map((f) => (
        <label key={f.name} className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          {f.label}
          <input
            type="number"
            name={f.name}
            value={values[f.name]}
            onChange={change}
            step={f.step}
            min={f.min}
            placeholder={f.placeholder}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal
                       focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>
      ))}
      <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white shadow-sm
                     hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Running..." : "Run simulation"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => onCompare(values)}
          className="rounded-lg border border-indigo-600 bg-white px-5 py-2 font-semibold text-indigo-700
                     hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Find best order size
        </button>
      </div>
    </form>
  );
}
