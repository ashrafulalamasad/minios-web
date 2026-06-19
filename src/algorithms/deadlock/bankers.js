/**
 * Banker's Algorithm — safety check and resource request validation.
 */

export function computeNeed(allocation, max) {
  return allocation.map((row, i) => row.map((val, j) => max[i][j] - val))
}

export function runSafetyCheck(available, allocation, max) {
  const n = allocation.length
  const m = available.length
  const need = computeNeed(allocation, max)
  const work = [...available]
  const finish = new Array(n).fill(false)
  const safeSequence = []
  const steps = []

  let progress = true
  while (progress) {
    progress = false
    for (let i = 0; i < n; i++) {
      if (finish[i]) continue
      const canAllocate = need[i].every((val, j) => val <= work[j])
      if (canAllocate) {
        for (let j = 0; j < m; j++) work[j] += allocation[i][j]
        finish[i] = true
        safeSequence.push(`P${i}`)
        steps.push({
          process: `P${i}`,
          action: 'Can finish',
          work: [...work],
          finish: [...finish],
        })
        progress = true
      }
    }
  }

  const isSafe = finish.every(Boolean)

  if (!isSafe) {
    steps.push({
      process: '—',
      action: 'No safe sequence found',
      work: [...work],
      finish: [...finish],
    })
  }

  return { isSafe, safeSequence, steps, need }
}

export function validateRequest(processIndex, request, available, need) {
  const errors = []

  request.forEach((val, j) => {
    if (val > need[processIndex][j]) {
      errors.push({
        type: 'exceeds_need',
        resource: j,
        message: `P${processIndex} requested ${val} of R${j} but Need is only ${need[processIndex][j]} — violates Banker's condition.`,
      })
    }
    if (val > available[j]) {
      errors.push({
        type: 'exceeds_available',
        resource: j,
        message: `P${processIndex} requests ${val}×R${j} but only ${available[j]} available.`,
      })
    }
  })

  return errors
}

export function simulateRequest(processIndex, request, available, allocation, max) {
  const newAvailable = available.map((a, j) => a - request[j])
  const newAllocation = allocation.map((row, i) =>
    i === processIndex ? row.map((val, j) => val + request[j]) : [...row],
  )
  const safety = runSafetyCheck(newAvailable, newAllocation, max)
  return { newAvailable, newAllocation, safety }
}

/**
 * Greedy optimizer: increment Available for bottleneck resources until safe.
 */
export function optimizeResources(available, allocation, max) {
  let newAvailable = [...available]
  let safety = runSafetyCheck(newAvailable, allocation, max)
  let iterations = 0
  const maxIterations = 100

  while (!safety.isSafe && iterations < maxIterations) {
    iterations++
    const need = computeNeed(allocation, max)
    const n = allocation.length
    const m = available.length

    // Find resource most blocking processes
    let bestResource = 0
    let maxBlocked = 0

    for (let j = 0; j < m; j++) {
      let blocked = 0
      for (let i = 0; i < n; i++) {
        if (need[i][j] > newAvailable[j]) blocked++
      }
      if (blocked > maxBlocked) {
        maxBlocked = blocked
        bestResource = j
      }
    }

    // Increment scarcest blocking resource
    const minNeeded = Math.min(
      ...need.map((row) => row[bestResource]).filter((_, idx) => {
        const canOtherFinish = need[idx].every((val, j) => j === bestResource || val <= newAvailable[j])
        return !canOtherFinish || need[idx][bestResource] > newAvailable[bestResource]
      }),
    )
    newAvailable[bestResource] += Math.max(1, minNeeded - newAvailable[bestResource])
    safety = runSafetyCheck(newAvailable, allocation, max)
  }

  return { available: newAvailable, safety }
}

export function findBottleneck(available, allocation, max) {
  const need = computeNeed(allocation, max)
  const n = allocation.length
  const details = []

  for (let i = 0; i < n; i++) {
    const unmet = need[i].map((val, j) => ({ resource: j, need: val, available: available[j] }))
      .filter((r) => r.need > r.available)
    if (unmet.length) {
      const parts = unmet.map((r) => `needs ${r.need - r.available} more of R${r.resource} (has ${available[r.resource]} available)`)
      details.push(`P${i} cannot finish: ${parts.join('; ')}.`)
    }
  }

  return details
}
