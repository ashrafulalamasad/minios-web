import { useMemo } from 'react'

const PROCESS_COLORS = [
  'bg-amber-600',
  'bg-emerald-600',
  'bg-orange-500',
  'bg-red-500',
  'bg-slate-700',
  'bg-rose-500',
  'bg-yellow-500',
  'bg-stone-600',
]

function getColor(pid, colorMap) {
  if (!colorMap.has(pid)) {
    colorMap.set(pid, PROCESS_COLORS[colorMap.size % PROCESS_COLORS.length])
  }
  return colorMap.get(pid)
}

/**
 * Gantt chart with process bars and time labels positioned at breakpoints below.
 * gantt: [{ pid, start, end }]
 */
export default function GanttChart({ gantt, title = 'Gantt Chart' }) {
  const { segments, totalTime, colorMap, uniquePids, breakpoints } = useMemo(() => {
    if (!gantt?.length) return { segments: [], totalTime: 0, colorMap: new Map(), uniquePids: [], breakpoints: [] }

    const map = new Map()
    const maxEnd = Math.max(...gantt.map((s) => s.end))
    const pids = [...new Set(gantt.map((s) => s.pid).filter((p) => p !== 'idle'))]

    const bps = []
    for (const seg of gantt) {
      if (!bps.includes(seg.start)) bps.push(seg.start)
      if (!bps.includes(seg.end)) bps.push(seg.end)
    }
    bps.sort((a, b) => a - b)

    return { segments: gantt, totalTime: maxEnd, colorMap: map, uniquePids: pids, breakpoints: bps }
  }, [gantt])

  if (!segments.length) {
    return (
      <div className="glass-card p-6 text-center text-slate-500 dark:text-slate-400">
        Run a simulation to see the Gantt chart.
      </div>
    )
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <h3 className="font-semibold text-slate-800 dark:text-white">{title}</h3>

      <div>
        {/* Gantt bars */}
        <div className="flex h-14 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
          {segments.map((seg, i) => {
            const duration = seg.end - seg.start
            const widthPct = (duration / totalTime) * 100
            const isIdle = seg.pid === 'idle'
            const color = isIdle ? '' : getColor(seg.pid, colorMap)
            return (
              <div
                key={i}
                className={`flex items-center justify-center text-xs font-bold border-r border-white/20 last:border-r-0 ${
                  isIdle
                    ? 'gantt-idle'
                    : `${color} text-white`
                }`}
                style={{ width: `${widthPct}%` }}
                title={isIdle ? `Idle: ${seg.start} → ${seg.end}` : `${seg.pid}: ${seg.start} → ${seg.end} (${duration} units)`}
              >
                {!isIdle && seg.pid}
              </div>
            )
          })}
        </div>

        {/* Time labels — each label's left edge aligns with its breakpoint */}
        <div className="relative h-6">
          {breakpoints.map((t, i) => {
            const leftPct = (t / totalTime) * 100
            const isLast = i === breakpoints.length - 1
            return (
              <span
                key={t}
                className="absolute text-xs font-mono text-slate-700 dark:text-slate-200 leading-none"
                style={isLast ? { right: 0 } : { left: `${leftPct}%` }}
              >
                {t}
              </span>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {uniquePids.map((pid) => (
          <div key={pid} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <div className={`h-3 w-3 rounded ${getColor(pid, colorMap)}`} />
            {pid}
          </div>
        ))}
        {segments.some((s) => s.pid === 'idle') && (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="h-3 w-3 rounded gantt-idle" />
            Idle
          </div>
        )}
      </div>
    </div>
  )
}
