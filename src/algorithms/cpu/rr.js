export function runRR(processes, quantum = 2) {
  const n = processes.length
  const remaining = processes.map((p) => ({ ...p, remainingBurst: p.burst }))
  const gantt = []
  const completion = new Array(n).fill(0)
  let time = 0
  let done = false
  const queue = []

  const sorted = [...remaining].sort((a, b) => a.arrival - b.arrival)
  let idx = 0

  while (idx < n && sorted[idx].arrival <= time) {
    queue.push(idx)
    idx++
  }

  while (!done) {
    if (queue.length === 0) {
      const nextArrival = sorted[idx]?.arrival ?? time + 1
      gantt.push({ pid: 'idle', start: time, end: nextArrival })
      time = nextArrival
      while (idx < n && sorted[idx].arrival <= time) {
        queue.push(idx)
        idx++
      }
      if (queue.length === 0 && idx >= n) {
        done = true
      }
      continue
    }

    const current = queue.shift()
    const start = time
    const execTime = Math.min(quantum, remaining[current].remainingBurst)
    time += execTime
    remaining[current].remainingBurst -= execTime

    gantt.push({
      pid: remaining[current].id,
      start,
      end: time,
    })

    while (idx < n && sorted[idx].arrival <= time) {
      queue.push(idx)
      idx++
    }

    if (remaining[current].remainingBurst > 0) {
      queue.push(current)
    } else {
      completion[current] = time
    }

    done = remaining.every((p) => p.remainingBurst === 0)
  }

  const result = sorted.map((p, i) => {
    const turnaround = completion[i] - p.arrival
    const waiting = turnaround - p.burst
    return {
      pid: p.id,
      arrival: p.arrival,
      burst: p.burst,
      completion: completion[i],
      turnaround,
      waiting,
    }
  })

  const avgWt = result.reduce((s, r) => s + r.waiting, 0) / n
  const avgTat = result.reduce((s, r) => s + r.turnaround, 0) / n

  const totalTime = Math.max(...result.map((r) => r.completion))
  const busyTime = result.reduce((s, r) => s + r.burst, 0)
  const idleTime = totalTime - busyTime

  return {
    processes: result,
    gantt,
    averages: { wt: avgWt, tat: avgTat },
    idleTime,
    totalTime,
  }
}
