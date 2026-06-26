import { findBottleneck, runSafetyCheck, computeNeed, findBestReduceMax, reduceAllMax } from './bankers'

/**
 * Calculate resource utilization percentages.
 */
function calculateResourceUtilization(available, allocation) {
  if (!allocation.length || !available.length) return []
  const totalAllocated = allocation.reduce((sums, row) =>
    sums.map((s, j) => s + row[j]),
    new Array(available.length).fill(0),
  )
  return totalAllocated.map((used, j) => ({
    resource: j,
    used,
    total: used + available[j],
    free: available[j],
    percentage: used + available[j] > 0 ? Math.round((used / (used + available[j])) * 100) : 0,
  }))
}

/**
 * Find the minimum additional resources needed for any single process to become unblocked.
 */
function findMinimumUnblock(available, need) {
  let best = null
  let bestTotal = Infinity
  for (let i = 0; i < need.length; i++) {
    const gap = need[i].map((val, j) => Math.max(0, val - available[j]))
    const totalGap = gap.reduce((a, b) => a + b, 0)
    if (totalGap > 0 && totalGap < bestTotal) {
      bestTotal = totalGap
      best = { process: i, gap, totalGap }
    }
  }
  return best
}

/**
 * Smart suggestion engine for Banker's Algorithm.
 * Returns { severity, title, explanation, details[], actions[], meta? }
 */
export function analyzeDeadlockSuggestions(state, safety, requestErrors, requestResult) {
  if (requestErrors?.length) {
    const exceedsNeed = requestErrors.filter((e) => e.type === 'exceeds_need')
    if (exceedsNeed.length) {
      return {
        severity: 'error',
        title: '⚠ Request Exceeds Need',
        explanation: "A process cannot request more resources than its remaining Need (Max − Allocation). This violates Banker's Algorithm precondition.",
        details: exceedsNeed.map((e) => e.message),
        actions: [{ label: '✎ Clamp to Need', variant: 'primary', fixType: 'clamp_request', dismissOnClick: true }],
      }
    }

    const exceedsAvail = requestErrors.filter((e) => e.type === 'exceeds_available')
    if (exceedsAvail.length) {
      return {
        severity: 'error',
        title: '⚠ Request Exceeds Available',
        explanation: 'The system does not have enough free resource instances to grant this request immediately.',
        details: exceedsAvail.map((e) => e.message),
        actions: [
          { label: '⟳ Try Optimize', variant: 'primary', fixType: 'optimize' },
          { label: '✕ Deny Request', variant: 'secondary', fixType: 'zero_request', dismissOnClick: true },
        ],
      }
    }
  }

  const checkSafety = requestResult?.safety ?? safety

  if (checkSafety?.isSafe) {
    const utilization = calculateResourceUtilization(state.available, state.allocation)
    const mostUsed = [...utilization].sort((a, b) => b.percentage - a.percentage)[0]

    const details = [
      `Safe sequence: ${checkSafety.safeSequence.join(' → ')}`,
    ]

    if (utilization.length) {
      const utilStr = utilization.map((u) => `R${u.resource}: ${u.percentage}% used (${u.used}/${u.total})`).join(' · ')
      details.push(`Resource utilization — ${utilStr}`)
    }
    if (mostUsed && mostUsed.percentage > 70) {
      details.push(`R${mostUsed.resource} is highly contended (${mostUsed.percentage}% utilized)`)
    }

    return {
      severity: 'success',
      title: '✓ Safe State',
      explanation: `All ${state.processCount} processes can complete without deadlock.`,
      details,
      actions: [],
    }
  }

  if (checkSafety && !checkSafety.isSafe) {
    const need = computeNeed(state.allocation, state.max)
    const bottleneckDetails = findBottleneck(state.available, state.allocation, state.max)
    const minUnblock = findMinimumUnblock(state.available, need)
    const utilization = calculateResourceUtilization(state.available, state.allocation)
    const bestReduce = findBestReduceMax(state.allocation, state.max, state.available)

    const details = []

    // Scarcest resources
    const scarce = [...utilization].sort((a, b) => a.percentage - b.percentage)
    const critical = scarce.filter((u) => u.percentage < 40)
    if (critical.length) {
      details.push(
        `Scarce resources: ${critical.map((u) => `R${u.resource} (${u.free} free of ${u.total})`).join(', ')}`,
      )
    }

    // Per-process blocking details
    if (bottleneckDetails.length) {
      details.push(...bottleneckDetails)
    }

    // Closest to unblocking
    if (minUnblock) {
      const gapStr = minUnblock.gap.map((g, j) => g > 0 ? `+${g}×R${j}` : null).filter(Boolean).join(', ')
      details.push(
        `Closest to unblocking: P${minUnblock.process} — needs ${gapStr} (${minUnblock.totalGap} more instance${minUnblock.totalGap > 1 ? 's' : ''})`,
      )
    }

    // Build smart actions
    const actions = []

    // Primary: optimize resources
    actions.push({ label: '⟳ Optimize Resources', variant: 'primary', fixType: 'optimize' })

    // Reduce max for the most demanding process
    actions.push({
      label: `↓ Reduce Max (P${bestReduce.process})`,
      variant: 'secondary',
      fixType: 'reduce_max',
    })

    // Reduce all processes' max
    actions.push({ label: '↓ Reduce All Max', variant: 'secondary', fixType: 'reduce_all_max' })

    return {
      severity: 'unsafe',
      title: '✗ Unsafe State — Deadlock Risk',
      explanation:
        'The safety algorithm could not find a sequence where all processes finish. Some processes may never complete, leading to deadlock.',
      details,
      actions,
    }
  }

  return null
}

export function applyDeadlockFix(fixType, state, need) {
  switch (fixType) {
    case 'clamp_request': {
      const pi = state.requestProcess
      const clamped = state.request.map((val, j) => Math.min(val, need[pi][j]))
      return { ...state, request: clamped }
    }
    case 'zero_request':
      return { ...state, request: state.request.map(() => 0) }
    case 'reduce_max': {
      const { newMax } = findBestReduceMax(state.allocation, state.max, state.available)
      return { ...state, max: newMax }
    }
    case 'reduce_all_max': {
      const newMax = reduceAllMax(state.allocation, state.max)
      return { ...state, max: newMax }
    }
    default:
      return state
  }
}
