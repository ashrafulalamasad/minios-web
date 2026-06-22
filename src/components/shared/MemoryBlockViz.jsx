const PROCESS_HUES = [
  'bg-amber-600',
  'bg-emerald-600',
  'bg-orange-500',
  'bg-red-500',
  'bg-slate-700',
  'bg-rose-500',
]

function getProcessColor(pid, index) {
  return PROCESS_HUES[index % PROCESS_HUES.length]
}

/**
 * Visualize memory blocks with allocated/free/waste segments.
 * blocks: [{ id, totalSize, segments: [{ type, pid?, size }] }]
 */
export default function MemoryBlockViz({ blocks, title = 'Memory Layout', metrics }) {
  if (!blocks?.length) {
    return (
      <div className="glass-card p-6 text-center text-slate-500 dark:text-slate-400">
        Run a simulation to see memory blocks.
      </div>
    )
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="font-semibold text-slate-800 dark:text-white">{title}</h3>
        {metrics && (
          <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Total Free: <strong className="text-slate-700 dark:text-slate-200">{metrics.totalFreeKB} KB</strong></span>
            <span>Largest Hole: <strong className="text-slate-700 dark:text-slate-200">{metrics.largestHoleKB} KB</strong></span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {blocks.map((block) => {
          const used = block.segments
            .filter((s) => s.type === 'allocated')
            .reduce((sum, s) => sum + s.size, 0)
          const free = block.totalSize - used
          const fragPct = block.totalSize > 0 ? Math.round((free / block.totalSize) * 100) : 0

          return (
            <div key={block.id}>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-200">{block.id} ({block.totalSize} KB)</span>
                <span>Used: {used} KB · Free: {free} KB · {fragPct}% free</span>
              </div>
              <div className="flex h-10 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
                {block.segments.map((seg, segIdx) => {
                  const widthPct = (seg.size / block.totalSize) * 100
                  let className = 'bg-emerald-400/80'
                  let label = 'Free'

                  if (seg.type === 'allocated') {
                    const pidIndex = parseInt(seg.pid?.replace(/\D/g, '') || '0', 10)
                    className = getProcessColor(seg.pid, pidIndex)
                    label = seg.pid
                  } else if (seg.type === 'waste') {
                    className = 'striped-waste opacity-80'
                    label = 'Waste'
                  }

                  return (
                    <div
                      key={segIdx}
                      className={`${className} flex items-center justify-center text-white text-[10px] font-bold border-r border-white/20 overflow-hidden`}
                      style={{ width: `${widthPct}%`, minWidth: widthPct > 5 ? 20 : 4 }}
                      title={`${label}: ${seg.size} KB`}
                    >
                      {widthPct > 8 ? label : ''}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-400/80" /> Free</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-600" /> Allocated</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded striped-waste" /> Internal Waste</span>
      </div>
    </div>
  )
}
