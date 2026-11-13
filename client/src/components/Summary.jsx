const money = (n) => `$${n.toFixed(2)}`;

function Stat({ label, value, highlight }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-indigo-300 bg-indigo-50" : "border-slate-200 bg-white"}`}>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}

export default function Summary({ summary, params }) {
  const { dayCount } = summary;
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        Order size <b>{params.orderSize}</b> papers/day for <b>{params.days}</b> days.
        Day types: Good {dayCount.Good}, Fair {dayCount.Fair}, Poor {dayCount.Poor}.
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Stat label="Revenue" value={money(summary.totalRevenue)} />
        <Stat label="Paper cost" value={money(summary.totalCost)} />
        <Stat label="Lost profit" value={money(summary.totalLostProfit)} />
        <Stat label="Salvage" value={money(summary.totalSalvage)} />
        <Stat label="Total profit" value={money(summary.totalProfit)} highlight />
        <Stat label="Avg profit / day" value={money(summary.avgProfitPerDay)} highlight />
      </div>
    </div>
  );
}
