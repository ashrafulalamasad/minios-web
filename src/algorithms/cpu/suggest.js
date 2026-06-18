/**
 * Smart suggestion engine for CPU scheduling module.
 */
export function analyzeCpuSuggestions(processes, errors, results, algorithm) {
  const negBurst = errors.filter((e) => e.type === 'negative_burst')
  if (negBurst.length) {
    return {
      severity: 'error',
      title: 'Invalid Burst Times',
      explanation:
        'Burst time represents how long a process needs the CPU. Negative time is undefined in scheduling theory — a process cannot execute for a negative duration.',
      details: negBurst.map((e) => e.message),
      actions: [{
        label: 'Quick Fix: Set to 1',
        variant: 'primary',
        onClick: null, // set by component
        fixType: 'clamp_burst',
      }],
    }
  }

  const zeroBurst = errors.filter((e) => e.type === 'zero_burst')
  if (zeroBurst.length) {
    return {
      severity: 'error',
      title: 'Zero Burst Time Detected',
      explanation: 'A process with 0 burst time completes instantly, which breaks scheduling calculations. Use a burst time of at least 1.',
      details: zeroBurst.map((e) => e.message),
      actions: [{ label: 'Quick Fix: Set to 1', variant: 'primary', fixType: 'clamp_burst' }],
    }
  }

  const dupIds = errors.filter((e) => e.type === 'duplicate_id')
  if (dupIds.length) {
    return {
      severity: 'error',
      title: 'Duplicate Process IDs',
      explanation: 'The scheduler cannot distinguish two processes with the same ID. Each process must have a unique identifier.',
      details: dupIds.map((e) => e.message),
      actions: [{ label: 'Quick Fix: Rename P1, P2...', variant: 'primary', fixType: 'rename_ids' }],
    }
  }

  const extreme = errors.filter((e) => e.type === 'extreme_arrival')
  if (extreme.length) {
    return {
      severity: 'warning',
      title: 'Extreme Arrival Times',
      explanation: 'Very large arrival times make the Gantt chart unreadable and inflate the timeline unnecessarily.',
      details: extreme.map((e) => e.message),
      actions: [{ label: 'Quick Fix: Normalize to start at 0', variant: 'primary', fixType: 'normalize_arrival' }],
    }
  }

  if (results && results.totalTime > 0) {
    const idlePct = (results.idleTime / results.totalTime) * 100
    if (idlePct > 50 && algorithm === 'fcfs') {
      return {
        severity: 'warning',
        title: 'High CPU Idle Time',
        explanation: `The CPU was idle ${idlePct.toFixed(0)}% of the time. Shorter jobs arriving later wait behind longer ones in FCFS.`,
        details: ['Consider switching to SJF or SRTF to reduce average waiting time.'],
        actions: [{ label: 'Try SJF', variant: 'secondary', fixType: 'switch_sjf' }],
      }
    }
  }

  return null
}

export function applyCpuFix(fixType, processes, setAlgorithm) {
  switch (fixType) {
    case 'clamp_burst':
      return processes.map((p) => ({ ...p, burst: p.burst <= 0 ? 1 : p.burst }))
    case 'rename_ids':
      return processes.map((p, i) => ({ ...p, id: `P${i + 1}` }))
    case 'normalize_arrival': {
      const minArr = Math.min(...processes.map((p) => p.arrival))
      return processes.map((p) => ({ ...p, arrival: p.arrival - minArr }))
    }
    case 'switch_sjf':
      setAlgorithm?.('sjf')
      return processes
    default:
      return processes
  }
}
