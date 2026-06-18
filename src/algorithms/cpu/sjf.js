/**
 * Shortest Job First (SJF) — non-preemptive.
 */
export function runSJF(processes) {
  const remaining = processes.map((p) => ({ ...p, remaining: p.burst }))
  const gantt = []
  const results = []
  let currentTime = 0
  let totalIdle = 0
  const completed = new Set()

  while (completed.size < processes.length) {
    const available = remaining.filter((p) => !completed.has(p.id) && p.arrival <= currentTime)

    if (available.length === 0) {
      const nextArrival = Math.min(...remaining.filter((p) => !completed.has(p.id)).map((p) => p.arrival))
      totalIdle += nextArrival - currentTime
      gantt.push({ pid: 'idle', start: currentTime, end: nextArrival })
      currentTime = nextArrival
      continue
    }

    available.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival)
    const proc = available[0]
    const start = currentTime
    const end = start + proc.burst
    gantt.push({ pid: proc.id, start, end })
    results.push({
      pid: proc.id,
      arrival: proc.arrival,
      burst: proc.burst,
      waiting: start - proc.arrival,
      turnaround: end - proc.arrival,
    })
    currentTime = end
    completed.add(proc.id)
  }

  const n = results.length
  return {
    gantt,
    processes: results,
    averages: {
      wt: n ? results.reduce((s, p) => s + p.waiting, 0) / n : 0,
      tat: n ? results.reduce((s, p) => s + p.turnaround, 0) / n : 0,
    },
    idleTime: totalIdle,
    totalTime: currentTime,
  }
}
