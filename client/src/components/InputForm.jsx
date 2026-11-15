
import { useState } from "react";

const FIELD_GROUPS = [
  {
    title: "Simulation Settings",
    description: "Configure your newspaper simulation parameters.",
    fields: [
      {
        name: "orderSize",
        label: "Order Quantity",
        unit: "papers / day",
        min: 0,
        max: 1000,
        step: 1,
        required: true,
        hint: "Number of newspapers purchased each day.",
      },
      {
        name: "days",
        label: "Simulation Duration",
        unit: "days",
        min: 1,
        max: 10000,
        step: 1,
        required: true,
        hint: "How many days to simulate (1–10,000).",
      },
      {
        name: "seed",
        label: "Random Seed",
        unit: "optional",
        min: 0,
        max: 4294967295,
        step: 1,
        required: false,
        placeholder: "Leave blank for random",
        hint: "Use the same seed to reproduce a result.",
      },
    ],
  },
  {
    title: "Pricing Assumptions",
    description: "Set the values used to calculate daily profit.",
    fields: [
      {
        name: "cost",
        label: "Purchase Cost",
        unit: "$ / paper",
        min: 0,
        max: 1000,
        step: 0.01,
        required: true,
        hint: "Cost paid for each ordered newspaper.",
      },
      {
        name: "price",
        label: "Selling Price",
        unit: "$ / paper",
        min: 0,
        max: 1000,
        step: 0.01,
        required: true,
        hint: "Price received for each newspaper sold.",
      },
      {
        name: "scrap",
        label: "Scrap Value",
        unit: "$ / paper",
        min: 0,
        max: 1000,
        step: 0.01,
        required: true,
        hint: "Amount recovered for each unsold paper.",
      },
    ],
  },
];

function initialValues(defaults) {
  return {
    orderSize: String(defaults.orderSize ?? 70),
    days: String(defaults.days ?? 20),
    cost: String(defaults.cost ?? 0.33),
    price: String(defaults.price ?? 0.5),
    scrap: String(defaults.scrap ?? 0.05),
    seed: "",
  };
}

export default function InputForm({
  defaults,
  loading,
  onRun,
  onCompare,
}) {
  const [values, setValues] = useState(() =>
    initialValues(defaults)
  );

  const [validationError, setValidationError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationError("");
  }

  function getValidParams() {
    const cost = Number(values.cost);
    const price = Number(values.price);
    const scrap = Number(values.scrap);

    if (price < cost) {
      setValidationError(
        "Selling price must be greater than or equal to purchase cost."
      );
      return null;
    }

    if (scrap > cost) {
      setValidationError(
        "Scrap value cannot be greater than purchase cost."
      );
      return null;
    }

    setValidationError("");

    return {
      orderSize: Number(values.orderSize),
      days: Number(values.days),
      cost,
      price,
      scrap,
      seed:
        values.seed === "" ? "" : Number(values.seed),
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    const params = getValidParams();

    if (params) {
      onRun(params);
    }
  }

  function handleCompare(event) {
    if (
      loading ||
      !event.currentTarget.form.reportValidity()
    ) {
      return;
    }

    const params = getValidParams();

    if (params) {
      onCompare(params);
    }
  }

  function handleReset() {
    setValues(initialValues(defaults));
    setValidationError("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Input Sections */}
      <div className="grid gap-5 xl:grid-cols-2">

        {FIELD_GROUPS.map((group) => (
          <div
            key={group.title}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
          >

            {/* Section Header */}
            <div className="mb-5 border-b border-slate-200 pb-4">

              <h3 className=" font-bold text-slate-900">
                {group.title}
              </h3>

              <p className="mt-1 text-sm leading-5 text-slate-700">
                {group.description}
              </p>

            </div>

            {/* Input Fields */}
            <div className="space-y-5">

              {group.fields.map((field) => (
                <div key={field.name}>

                  <label
                    htmlFor={`input-${field.name}`}
                    className="mb-1.5 flex items-center justify-between gap-2 text-sm font-medium"
                  >
                    <span>{field.label}</span>

                    <span className="text-sm font-normal text-slate-700">
                      {field.unit}
                    </span>
                  </label>

                  <input
                    id={`input-${field.name}`}
                    name={field.name}
                    type="number"
                    inputMode={
                      field.step === 1
                        ? "numeric"
                        : "decimal"
                    }
                    value={values[field.name]}
                    onChange={handleChange}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    required={field.required}
                    placeholder={field.placeholder}
                    disabled={loading}
                    aria-describedby={`help-${field.name}`}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  />

                  <p
                    id={`help-${field.name}`}
                    className="mt-1 text-xs leading-5 text-slate-500"
                  >
                    {field.hint}
                  </p>

                </div>
              ))}

            </div>
          </div>
        ))}
      </div>

      {/* Validation Error */}
      {validationError && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          {validationError}
        </div>
      )}

      {/* Action Area */}
      <div className="flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-semibold text-slate-800">
            Ready to Simulate
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            Run a single order quantity or compare
            the available quantities.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="rounded-lg border border-slate-400 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset
          </button>

          {/* Compare Button */}
          <button
            type="button"
            onClick={handleCompare}
            disabled={loading}
            className="rounded-lg border border-slate-400 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : "Compare Order Sizes"}
          </button>

          {/* Run Button */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Running..."
              : "Run Simulation"}
          </button>

        </div>
      </div>

    </form>
  );
}
