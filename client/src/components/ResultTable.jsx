const MAX_ROWS = 500; // keep the page fast for very long runs

const dayColor = {
  Good: "bg-emerald-100 text-emerald-800",
  Fair: "bg-amber-200 text-amber-800",
  Poor: "bg-red-200 text-rose-800",
};

export default function ResultTable({ rows }) {
  const shown = rows.slice(0, MAX_ROWS);
  const th = "sticky top-0 bg-slate-100 px-3 py-2 text-right font-semibold first:text-left";
  const td = "px-3 py-2 text-right border-t border-slate-200 first:text-left";

  return (
    <div>
      <div className="max-h-96 overflow-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={th}>Day</th>
              <th className={th}>Random no. (day)</th>
              <th className={th}>Day type</th>
              <th className={th}>Random no. (demand)</th>
              <th className={th}>Demand</th>
              <th className={th}>Revenue</th>
              <th className={th}>Lost profit</th>
              <th className={th}>Salvage</th>
              <th className={th}>Daily profit</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.day} className="hover:bg-slate-50">
                <td className={td}>{r.day}</td>
                <td className={td}>{r.rn1.toFixed(2)}</td>
                <td className={td}>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${dayColor[r.dayType]}`}>
                    {r.dayType}
                  </span>
                </td>
                <td className={td}>{r.rn2.toFixed(2)}</td>
                <td className={td}>{r.demand}</td>
                <td className={td}>${r.revenue.toFixed(2)}</td>
                <td className={td}>${r.lostProfit.toFixed(2)}</td>
                <td className={td}>${r.salvage.toFixed(2)}</td>
                <td className={`${td} font-semibold`}>${r.profit.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > MAX_ROWS && (
        <p className="mt-2 text-xs text-slate-500">
          Showing the first {MAX_ROWS} of {rows.length} days. Totals above include all days.
        </p>
      )}
    </div>
  );
}
