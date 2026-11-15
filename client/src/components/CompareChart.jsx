
const W = 700;
const H = 310;

const PAD = {
  top: 30,
  right: 24,
  bottom: 48,
  left: 65,
};

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

function InfoCard({ label, value, primary = false }) {
  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 ${
        primary
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-slate-50 text-slate-900"
      }`}
    >
      <p
        className={`text-xs font-medium uppercase tracking-wide ${
          primary ? "text-slate-300" : "text-slate-500"
        }`}
      >
        {label}
      </p>

      <p className="mt-2 break-words text-xl font-bold tabular-nums sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

export default function CompareChart({ data }) {
  const { results = [], best, days, seed } = data;

  if (!results.length || !best) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        No comparison results available.
      </p>
    );
  }

  // Chart calculations
  const profits = results.map((r) => r.totalProfit);

  const minProfit = Math.min(0, ...profits);
  const maxProfit = Math.max(0, ...profits);

  const range = Math.max(maxProfit - minProfit, 1);

  const lower =
    minProfit < 0
      ? minProfit - range * 0.15
      : 0;

  const upper =
    maxProfit > 0
      ? maxProfit + range * 0.15
      : 1;

  const span = upper - lower || 1;

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const slot = innerW / results.length;
  const barW = Math.min(slot * 0.58, 55);

  const y = (value) =>
    PAD.top +
    innerH -
    ((value - lower) / span) * innerH;

  const zeroY = y(0);

  const ticks = Array.from(
    { length: 5 },
    (_, i) => lower + (span * i) / 4
  );

  return (
    <div className="space-y-6">

      {/* Comparison Overview */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        <InfoCard
          label="Best Order Size"
          value={`${best.orderSize} Papers`}
          primary
        />

        <InfoCard
          label="Highest Total Profit"
          value={money(best.totalProfit)}
        />

        <InfoCard
          label="Simulation Days"
          value={days}
        />

        <InfoCard
          label="Random Seed"
          value={seed ?? "N/A"}
        />

      </div>

      {/* Chart Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">

        <div className="flex flex-wrap items-start justify-between gap-3">

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Profit by Order Quantity
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-700">
              Total simulated profit for each newspaper
              order quantity.
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs text-slate-600">

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-slate-400" />
              Other Orders
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-slate-900" />
              Best Order
            </div>

          </div>
        </div>

        {/* SVG Bar Chart */}
        <div className="mt-6 overflow-x-auto">

          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full min-w-[620px]"
            role="img"
            aria-label="Total profit comparison by newspaper order quantity"
          >

            {/* Grid Lines and Y Labels */}
            {ticks.map((tick, index) => (
              <g key={index}>

                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y(tick)}
                  y2={y(tick)}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />

                <text
                  x={PAD.left - 12}
                  y={y(tick) + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#5e708a"
                >
                  ${tick.toFixed(0)}
                </text>

              </g>
            ))}

            {/* Zero Baseline */}
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={zeroY}
              y2={zeroY}
              stroke="#94a3b8"
              strokeWidth="1"
            />

            {/* Bars */}
            {results.map((item, index) => {
              const x =
                PAD.left +
                index * slot +
                (slot - barW) / 2;

              const isBest =
                item.orderSize === best.orderSize;

              const valueY = y(item.totalProfit);

              const barTop = Math.min(
                valueY,
                zeroY
              );

              const barHeight = Math.max(
                Math.abs(zeroY - valueY),
                1.5
              );

              const labelY =
                item.totalProfit >= 0
                  ? valueY - 8
                  : valueY + 15;

              return (
                <g key={item.orderSize}>

                  {/* Bar */}
                  <rect
                    x={x}
                    y={barTop}
                    width={barW}
                    height={barHeight}
                    rx="3"
                    fill={
                      isBest
                        ? "#0f172a"
                        : "#cbd5e1"
                    }
                  >
                    <title>
                      {`${item.orderSize} papers: ${money(item.totalProfit)}`}
                    </title>
                  </rect>

                  {/* Profit Label */}
                  <text
                    x={x + barW / 2}
                    y={labelY}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isBest ? "700" : "500"}
                    fill={
                      isBest
                        ? "#0f172a"
                        : "#64748b"
                    }
                  >
                    ${item.totalProfit.toFixed(0)}
                  </text>

                  {/* Order Quantity Label */}
                  <text
                    x={x + barW / 2}
                    y={H - 24}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight={isBest ? "700" : "500"}
                    fill="#334155"
                  >
                    {item.orderSize}
                  </text>

                </g>
              );
            })}

            {/* X Axis Label */}
            <text
              x={W / 2}
              y={H - 5}
              textAnchor="middle"
              fontSize="11"
              fill="#556885"
            >
              Order Quantity (Papers per Day)
            </text>

          </svg>
        </div>

      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-4 py-4 sm:px-5">

          <h3 className="text-sm font-bold text-slate-900">
            Detailed Comparison
          </h3>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[480px] border-collapse text-sm">

            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                  Order Quantity
                </th>

                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">
                  Total Profit
                </th>

                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">
                  Avg Profit / Day
                </th>

                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {results.map((item) => {
                const isBest =
                  item.orderSize === best.orderSize;

                return (
                  <tr
                    key={item.orderSize}
                    className={`border-t border-slate-100 transition-colors hover:bg-slate-50 ${
                      isBest
                        ? "bg-slate-50 font-semibold"
                        : "bg-white"
                    }`}
                  >

                    <td className="px-4 py-3 text-slate-800">
                      {item.orderSize} papers
                    </td>

                    <td className="px-4 py-3 text-right tabular-nums text-slate-800">
                      {money(item.totalProfit)}
                    </td>

                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {money(item.avgProfitPerDay)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {isBest ? (
                        <span className="inline-flex rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white">
                          Best
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">
                          —
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

      {/* Analysis Note */}
      {/* <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">

        <h4 className="text-sm font-semibold text-slate-800">
          Simulation Conclusion
        </h4>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Based on the {days}-day simulation, ordering{" "}
          <span className="font-semibold text-slate-900">
            {best.orderSize} newspapers per day
          </span>{" "}
          generated the highest simulated total profit
          of{" "}
          <span className="font-semibold text-slate-900">
            {money(best.totalProfit)}
          </span>{" "}
          among the tested quantities.
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Note: This result is specific to the selected
          simulation period and random seed. It does
          not guarantee the globally optimal order quantity.
        </p>

      </div> */}

    </div>
  );
}
