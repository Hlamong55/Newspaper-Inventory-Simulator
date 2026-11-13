// Simple SVG bar chart (no chart library needed).
const W = 640;
const H = 280;
const PAD = { top: 20, right: 16, bottom: 40, left: 56 };

export default function CompareChart({ data }) {
  const { results, best, days, seed } = data;
  const max = Math.max(...results.map((r) => r.totalProfit), 1);
  const min = Math.min(...results.map((r) => r.totalProfit), 0);
  const span = max - min || 1;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / results.length;
  const barW = slot * 0.6;
  const y = (v) => PAD.top + innerH - ((v - min) / span) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => min + t * span);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Over {days} days with the same random draws (seed {seed}), the best order size is{" "}
        <b className="text-indigo-700">{best.orderSize}</b> papers, with total profit{" "}
        <b>${best.totalProfit.toFixed(2)}</b>. Enter this seed in the form to repeat the comparison.
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Total profit by order size">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#e2e8f0" />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#64748b">
              ${t.toFixed(0)}
            </text>
          </g>
        ))}
        {results.map((r, i) => {
          const x = PAD.left + i * slot + (slot - barW) / 2;
          const isBest = r.orderSize === best.orderSize;
          const top = Math.min(y(r.totalProfit), y(0));
          const h = Math.abs(y(r.totalProfit) - y(0));
          return (
            <g key={r.orderSize}>
              <rect x={x} y={top} width={barW} height={Math.max(h, 1)} rx="3" fill={isBest ? "#4f46e5" : "#a5b4fc"} />
              <text x={x + barW / 2} y={top - 5} textAnchor="middle" fontSize="11" fill="#334155">
                ${r.totalProfit.toFixed(0)}
              </text>
              <text x={x + barW / 2} y={H - 18} textAnchor="middle" fontSize="12" fill="#334155">
                {r.orderSize}
              </text>
            </g>
          );
        })}
        <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="11" fill="#64748b">
          Order size (papers/day)
        </text>
      </svg>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="px-3 py-2 text-left">Order size</th>
            <th className="px-3 py-2 text-right">Total profit</th>
            <th className="px-3 py-2 text-right">Avg profit / day</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.orderSize} className={r.orderSize === best.orderSize ? "bg-indigo-50 font-semibold" : ""}>
              <td className="border-t border-slate-200 px-3 py-1.5">{r.orderSize}</td>
              <td className="border-t border-slate-200 px-3 py-1.5 text-right">${r.totalProfit.toFixed(2)}</td>
              <td className="border-t border-slate-200 px-3 py-1.5 text-right">${r.avgProfitPerDay.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
