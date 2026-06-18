/**
 * Shortest Remaining Time First (SRTF) — preemptive SJF.
 */
export function runSRTF(processes) {
  if (!processes.length) {
    return { gantt: [], processes: [], averages: { wt: 0, tat: 0 }, idleTime: 0, totalTime: 0 }
  }

  const state = processes.map((p) => ({
    id: p.id,
    arrival: p.arrival,
    burst: p.burst,
    remaining: p.burst,
    firstStart: null,
    completion: null,
  }))

  const gantt = []
  let currentTime = 0
  let totalIdle = 0
  let running = null
  let segStart = 0

  const maxTime = Math.max(...processes.map((p) => p.arrival + p.burst * 2)) + 100
  let iterations = 0

  const finishSegment = (end) => {
    if (running && segStart < end) {
      gantt.push({ pid: running.id, start: segStart, end })
    }
  }

  const pickNext = (time) => {
    const ready = state.filter((p) => p.arrival <= time && p.remaining > 0)
    if (!ready.length) return null
    ready.sort((a, b) => a.remaining - b.remaining || a.arrival - b.arrival)
    return ready[0]
  }

  while (state.some((p) => p.remaining > 0) && iterations < maxTime) {
    iterations++
    const next = pickNext(currentTime)

    if (!next) {
      const future = state.filter((p) => p.remaining > 0)
      const nextArrival = Math.min(...future.map((p) => p.arrival))
      if (running) finishSegment(currentTime)
      totalIdle += nextArrival - currentTime
      gantt.push({ pid: 'idle', start: currentTime, end: nextArrival })
      currentTime = nextArrival
      running = null
      segStart = currentTime
      continue
    }

    if (running?.id !== next.id) {
      finishSegment(currentTime)
      running = next
      segStart = currentTime
      if (next.firstStart === null) next.firstStart = currentTime
    }

    // Run 1 time unit
    next.remaining -= 1
    currentTime += 1

    if (next.remaining === 0) {
      next.completion = currentTime
      finishSegment(currentTime)
      running = null
      segStart = currentTime
    }
  }

  const results = state.map((p) => ({
    pid: p.id,
    arrival: p.arrival,
    burst: p.burst,
    waiting: p.completion - p.arrival - p.burst,
    turnaround: p.completion - p.arrival,
  }))

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
