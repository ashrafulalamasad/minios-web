/**
 * Generic metrics/results table.
 * columns: [{ key, label, format?(value) => string }]
 * rows: object[]
 * footer?: object with same keys
 */
export default function MetricsTable({ columns, rows, footer, title }) {
  if (!rows?.length) return null

  return (
    <div className="glass-card overflow-hidden">
      {title && (
        <div className="px-5 py-3 border-b border-slate-200/50 dark:border-slate-700/50">
          <h3 className="font-semibold text-slate-800 dark:text-white">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2.5 text-slate-600 dark:text-slate-300 font-mono">
                    {col.format ? col.format(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {footer && (
              <tr className="border-t-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 font-semibold">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2.5 text-amber-700 dark:text-amber-300 font-mono">
                    {col.format ? col.format(footer[col.key], footer) : footer[col.key]}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
