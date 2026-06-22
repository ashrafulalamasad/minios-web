import { findBottleneck } from './bankers'

/**
 * Smart suggestion engine for Banker's Algorithm.
 */
export function analyzeDeadlockSuggestions(state, safety, requestErrors, requestResult) {
  if (requestErrors?.length) {
    const exceedsNeed = requestErrors.filter((e) => e.type === 'exceeds_need')
    if (exceedsNeed.length) {
      return {
        severity: 'error',
        title: 'Request Exceeds Need',
        explanation: "A process cannot request more resources than its remaining Need (Max - Allocation). This violates Banker's Algorithm precondition.",
        details: exceedsNeed.map((e) => e.message),
        actions: [{ label: 'Quick Fix: Clamp to Need', variant: 'primary', fixType: 'clamp_request' }],
      }
    }

    const exceedsAvail = requestErrors.filter((e) => e.type === 'exceeds_available')
    if (exceedsAvail.length) {
      return {
        severity: 'error',
        title: 'Request Exceeds Available Resources',
        explanation: 'The system does not have enough available resource instances to grant this request.',
        details: exceedsAvail.map((e) => e.message),
        actions: [
          { label: 'Optimize Resources', variant: 'primary', fixType: 'optimize' },
          { label: 'Quick Fix: Deny Request (set to 0)', variant: 'secondary', fixType: 'zero_request' },
        ],
      }
    }
  }

  const checkSafety = requestResult?.safety ?? safety

  if (checkSafety?.isSafe) {
    return {
      severity: 'success',
      title: 'System is in a Safe State',
      explanation: `A safe execution sequence exists: ${checkSafety.safeSequence.join(' → ')}. All processes can complete without deadlock.`,
      details: ['The Banker\'s safety algorithm found at least one order to allocate resources without entering an unsafe state.'],
      actions: [],
    }
  }

  if (checkSafety && !checkSafety.isSafe) {
    const bottlenecks = findBottleneck(state.available, state.allocation, state.max)
    return {
      severity: 'unsafe',
      title: 'Unsafe State Detected — Potential Deadlock',
      explanation:
        'The safety algorithm could not find a sequence where all processes finish. The system may enter deadlock if requests proceed in the current order.',
      details: bottlenecks.length
        ? bottlenecks
        : ['No process can proceed with current Available resources.'],
      actions: [
        { label: 'Optimize Resources', variant: 'primary', fixType: 'optimize' },
        { label: 'Reduce Max Demand for P0', variant: 'secondary', fixType: 'reduce_max' },
      ],
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
      const newMax = state.max.map((row) => [...row])
      newMax[0] = newMax[0].map((v, j) => Math.max(state.allocation[0][j] || 0, v - 1))
      return { ...state, max: newMax }
    }
    default:
      return state
  }
}
