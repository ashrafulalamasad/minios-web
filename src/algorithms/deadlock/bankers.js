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
 * Prioritizes the resource that unblocks the most processes per unit added.
 */
export function optimizeResources(available, allocation, max) {
  let newAvailable = [...available]
  let safety = runSafetyCheck(newAvailable, allocation, max)
  let iterations = 0
  const maxIterations = 100
  const addedResources = new Array(available.length).fill(0)

  while (!safety.isSafe && iterations < maxIterations) {
    iterations++
    const need = computeNeed(allocation, max)
    const n = allocation.length
    const m = available.length

    // For each resource, count how many blocked processes would benefit from +1
    let bestResource = 0
    let bestScore = -1

    for (let j = 0; j < m; j++) {
      let score = 0
      for (let i = 0; i < n; i++) {
        // Process is blocked on this resource if need[i][j] > available[j]
        if (need[i][j] > newAvailable[j]) {
          // Score: how close this process is to being unblocked on resource j
          // Higher score if this is the only blocking resource
          const otherBlocked = need[i].filter((v, k) => k !== j && v > newAvailable[k]).length
          score += otherBlocked === 0 ? 3 : 1 // 3x bonus if this is the last blocker
        }
      }
      if (score > bestScore) {
        bestScore = score
        bestResource = j
      }
    }

    newAvailable[bestResource] += 1
    addedResources[bestResource] += 1
    safety = runSafetyCheck(newAvailable, allocation, max)
  }

  return { available: newAvailable, safety, addedResources }
}

/**
 * Find which process's Max reduction would have the most impact.
 * Returns the process index and suggested new Max.
 */
export function findBestReduceMax(allocation, max, available) {
  const need = computeNeed(allocation, max)
  const n = allocation.length
  let bestProcess = 0
  let bestScore = -1

  for (let i = 0; i < n; i++) {
    // Score = total over-allocation beyond available (how much this process is demanding)
    let score = 0
    for (let j = 0; j < need[i].length; j++) {
      if (need[i][j] > available[j]) {
        score += need[i][j] - available[j]
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestProcess = i
    }
  }

  // Reduce that process's max by 1 per resource (but not below allocation)
  const newMax = max.map((row) => [...row])
  newMax[bestProcess] = newMax[bestProcess].map((v, j) =>
    Math.max(allocation[bestProcess][j] || 0, v - 1),
  )

  return { process: bestProcess, newMax }
}

/**
 * Reduce all processes' Max by 1 per resource (but not below allocation).
 */
export function reduceAllMax(allocation, max) {
  const newMax = max.map((row, i) =>
    row.map((v, j) => Math.max(allocation[i][j] || 0, v - 1)),
  )
  return newMax
}

/**
 * Find the minimum resources needed to make a specific process finish.
 */
export function findResourcesForProcess(processIndex, available, need) {
  const gap = need[processIndex].map((val, j) => Math.max(0, val - available[j]))
  return gap
}

/**
 * Analyze which processes can finish now and which are blocked, with detailed
 * reasons and suggestions for each.
 */
export function findBottleneck(available, allocation, max) {
  const need = computeNeed(allocation, max)
  const n = allocation.length
  const details = []
  const canFinishNow = []
  const blocked = []

  for (let i = 0; i < n; i++) {
    const unmet = need[i].map((val, j) => ({ resource: j, need: val, available: available[j] }))
      .filter((r) => r.need > r.available)

    if (unmet.length === 0) {
      canFinishNow.push(i)
    } else {
      const parts = unmet.map((r) => `${r.need - r.available} more R${r.resource}`)
      blocked.push({ process: i, unmet, parts })
      details.push(`P${i} blocked — needs ${parts.join(', ')}`)
    }
  }

  if (canFinishNow.length > 0 && canFinishNow.length < n) {
    details.unshift(`${canFinishNow.length} of ${n} processes can finish now: ${canFinishNow.map((i) => `P${i}`).join(', ')}`)
  }

  return details
}
