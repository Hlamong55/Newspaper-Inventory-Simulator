
const money = (value) => {
  const number = Number(value);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(number) ? number : 0);
};

function StatCard({
  label,
  value,
  description,
  primary = false,
  highlight = false,
}) {
  const cardStyle = primary
    ? "border-slate-900 bg-slate-900 text-white"
    : highlight
    ? "border-indigo-200 bg-indigo-50/100 text-slate-900"
    : "border-slate-300 bg-white text-slate-900";

  return (
    <div
      className={`flex min-w-0 flex-col justify-between rounded-xl border p-4 sm:p-5 ${cardStyle}`}
    >
      <div>
        <p
          className={`text-sm font-semibold uppercase tracking-wide ${
            primary ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {label}
        </p>

        <p className="mt-2 break-words text-2xl font-bold tracking-tight tabular-nums">
          {value}
        </p>
      </div>

      <p
        className={`mt-2 text-xs leading-5 ${
          primary ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function DayDistribution({ label, count, total, color }) {
  const percentage =
    total > 0 ? (count / total) * 100 : 0;

  const displayPercentage = percentage.toFixed(1);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-sm ${color}`}
          />

          <span className="text-sm font-medium text-slate-700">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            {displayPercentage}%
          </span>
        </div>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label={`${label} percentage`}
        aria-valuenow={Number(displayPercentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function Summary({ summary, params }) {
  const dayCount = summary.dayCount || {};

  const goodDays = dayCount.Good || 0;
  const fairDays = dayCount.Fair || 0;
  const poorDays = dayCount.Poor || 0;

  const totalDays = goodDays + fairDays + poorDays;

  const statistics = [
    {
      label: "Total Revenue",
      value: money(summary.totalRevenue),
      description: "Income from sold newspapers",
    },
    {
      label: "Purchase Cost",
      value: money(summary.totalCost),
      description: "Total cost of ordered papers",
    },
    {
      label: "Lost Profit",
      value: money(summary.totalLostProfit),
      description: "Opportunity cost of unmet demand",
    },
    {
      label: "Salvage Value",
      value: money(summary.totalSalvage),
      description: "Recovery from unsold papers",
    },
    {
      label: "Total Profit",
      value: money(summary.totalProfit),
      description: "Profit after all model adjustments",
      primary: true,
    },
    {
      label: "Average Daily Profit",
      value: money(summary.avgProfitPerDay),
      description: "Average profit per simulated day",
      highlight: true,
    },
  ];

  return (
    <div className="space-y-4">

      {/* Financial KPI Cards */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Financial Performance
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Summary of revenue, expenses and profitability.
            </p>
          </div>

          <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
            Currency: USD
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {statistics.map((stat) => (
            <StatCard
              key={stat.label}
              {...stat}
            />
          ))}
        </div>
      </div>

      {/* Day Type Distribution */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className=" font-bold text-slate-900">
              Day Type Distribution
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-700">
              Frequency of weather or newsstand demand
              conditions during the simulation.
            </p>
          </div>

          <div className="rounded-lg bg-slate-100 px-3 py-2 text-center">
            <p className="text-sm text-slate-700">
              Total Days
            </p>

            <p className="text-lg font-bold tabular-nums text-slate-900">
              {totalDays}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Distribution Bars */}
          <div className="space-y-5">
            <DayDistribution
              label="Good Day"
              count={goodDays}
              total={totalDays}
              color="bg-green-600"
            />

            <DayDistribution
              label="Fair Day"
              count={fairDays}
              total={totalDays}
              color="bg-yellow-500"
            />

            <DayDistribution
              label="Poor Day"
              count={poorDays}
              total={totalDays}
              color="bg-red-500"
            />
          </div>

          {/* Count Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Good",
                count: goodDays,
              },
              {
                label: "Fair",
                count: fairDays,
              },
              {
                label: "Poor",
                count: poorDays,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center rounded-lg border border-slate-300 bg-slate-50 p-3 text-center"
              >
                <p className="text-2xl font-bold tabular-nums text-slate-900">
                  {item.count}
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {item.label} Days
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
