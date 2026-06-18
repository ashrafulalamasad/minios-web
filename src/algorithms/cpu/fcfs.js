/**
 * First-Come First-Served (FCFS) CPU scheduling — non-preemptive.
 */
export function runFCFS(processes) {
  const sorted = [...processes].sort((a, b) => a.arrival - b.arrival)
  const gantt = []
  let currentTime = 0
  let totalIdle = 0
  const results = []

  for (const proc of sorted) {
    if (currentTime < proc.arrival) {
      totalIdle += proc.arrival - currentTime
      gantt.push({ pid: 'idle', start: currentTime, end: proc.arrival })
      currentTime = proc.arrival
    }
    const start = currentTime
    const end = start + proc.burst
    gantt.push({ pid: proc.id, start, end })
    const waiting = start - proc.arrival
    const turnaround = end - proc.arrival
    results.push({ pid: proc.id, arrival: proc.arrival, burst: proc.burst, waiting, turnaround })
    currentTime = end
  }

  const n = results.length
  const avgWT = n ? results.reduce((s, p) => s + p.waiting, 0) / n : 0
  const avgTAT = n ? results.reduce((s, p) => s + p.turnaround, 0) / n : 0

  return {
    gantt,
    processes: results,
    averages: { wt: avgWT, tat: avgTAT },
    idleTime: totalIdle,
    totalTime: currentTime,
  }
}
