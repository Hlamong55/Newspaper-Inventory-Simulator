
const pct = (p) => (p === 0 ? "-" : p.toFixed(2));

export default function ModelData({ config }) {
  const { dayTypes, demands, demandProbs } = config;

  const th =
    "px-4 py-3 text-left text-sm font-semibold text-slate-700 bg-slate-50 border-b border-slate-200";

  const td =
    "px-4 py-2.5 border-t border-slate-200 text-sm text-slate-800";

  return (
    <div className="grid gap-6 md:grid-cols-2">

      {/* Type of Day */}
      <div className="min-w-0">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">
          Type of day
        </h3>

        <div className="overflow-hidden rounded-lg border border-slate-300 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className={th}>Day type</th>
                <th className={th}>Probability</th>
              </tr>
            </thead>

            <tbody>
              {dayTypes.map((d) => (
                <tr
                  key={d.name}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className={td}>{d.name}</td>
                  <td className={td}>{d.prob.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demand Distribution */}
      <div className="min-w-0">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">
          Demand distribution (given day type)
        </h3>

        <div className="overflow-x-auto rounded-lg border border-slate-300 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className={th}>Demand</th>

                {dayTypes.map((d) => (
                  <th key={d.name} className={th}>
                    {d.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {demands.map((q, i) => (
                <tr
                  key={q}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className={td}>{q}</td>

                  {dayTypes.map((d) => (
                    <td key={d.name} className={td}>
                      {pct(demandProbs[d.name][i])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
