const pct = (p) => (p === 0 ? "-" : p.toFixed(2));

export default function ModelData({ config }) {
  const { dayTypes, demands, demandProbs } = config;
  const th = "px-3 py-1.5 text-left font-semibold bg-slate-100";
  const td = "px-3 py-1.5 border-t border-slate-200";

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="mb-2 font-semibold">Type of day</h3>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={th}>Day type</th>
              <th className={th}>Probability</th>
            </tr>
          </thead>
          <tbody>
            {dayTypes.map((d) => (
              <tr key={d.name}>
                <td className={td}>{d.name}</td>
                <td className={td}>{d.prob.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <h3 className="mb-2 font-semibold">Demand distribution (given day type)</h3>
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
              <tr key={q}>
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
  );
}
