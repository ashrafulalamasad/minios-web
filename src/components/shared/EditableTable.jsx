import { Plus, Trash2 } from 'lucide-react'

/**
 * Reusable editable table for process/block inputs.
 * columns: [{ key, label, type, validate?(value, row) => boolean }]
 */
export default function EditableTable({
  columns,
  rows,
  onChange,
  onAdd,
  onRemove,
  addLabel = 'Add Row',
  minRows = 1,
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-700/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200/60 bg-slate-50/80 dark:border-slate-700/60 dark:bg-slate-800/50">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 w-12" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
              {columns.map((col) => {
                const val = row[col.key]
                const isEmpty = val === '' || val === undefined || val === null
                const isInvalid = !isEmpty && col.validate ? !col.validate(val, row) : false
                return (
                  <td key={col.key} className="px-4 py-2">
                    <input
                      type={col.type || 'text'}
                      value={row[col.key]}
                      onChange={(e) => {
                        const val = col.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value
                        onChange(rowIndex, col.key, val)
                      }}
                      className={`input-field ${isInvalid ? 'input-error' : ''}`}
                      min={col.type === 'number' ? col.min : undefined}
                      step={col.type === 'number' ? col.step || 1 : undefined}
                    />
                  </td>
                )
              })}
              <td className="px-4 py-2">
                <button
                  type="button"
                  onClick={() => onRemove(rowIndex)}
                  disabled={rows.length <= minRows}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed dark:hover:bg-red-950/50"
                  aria-label="Remove row"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 border-t border-slate-200/60 dark:border-slate-700/60">
        <button type="button" onClick={onAdd} className="btn-secondary text-xs">
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      </div>
    </div>
  )
}
