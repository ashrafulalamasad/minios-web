/**
 * Memory allocation: First Fit, Best Fit, Worst Fit.
 *
 * Two partitioning schemes are supported:
 *  - "fixed":   each block holds exactly one process; leftover space inside a
 *               block is internal fragmentation.
 *  - "dynamic": blocks are free holes that split to fit processes exactly; many
 *               processes may share one original block and there is no internal
 *               fragmentation (only external fragmentation remains).
 */
export function allocateMemory(blocks, processes, algorithm, partitionType = 'fixed') {
  if (partitionType === 'dynamic') {
    return allocateDynamic(blocks, processes, algorithm)
  }
  return allocateFixed(blocks, processes, algorithm)
}

/**
 * Fixed partitioning — one process per block.
 */
function allocateFixed(blocks, processes, algorithm) {
  const memBlocks = blocks.map((b) => ({
    id: b.id,
    totalSize: b.sizeKB,
    freeSize: b.sizeKB,
    allocated: null,
    processSize: 0,
  }))

  const allocations = []
  const initialBlocks = buildFixedBlockViz(memBlocks)

  for (const proc of processes) {
    const candidates = memBlocks
      .map((b, idx) => ({ ...b, idx }))
      .filter((b) => b.allocated === null && b.freeSize >= proc.sizeKB)

    let chosen = null

    if (candidates.length) {
      switch (algorithm) {
        case 'best-fit':
          candidates.sort((a, b) => a.freeSize - b.freeSize)
          chosen = candidates[0]
          break
        case 'worst-fit':
          candidates.sort((a, b) => b.freeSize - a.freeSize)
          chosen = candidates[0]
          break
        default: // first-fit
          chosen = candidates[0]
      }
    }

    if (chosen) {
      const block = memBlocks[chosen.idx]
      block.allocated = proc.id
      block.processSize = proc.sizeKB
      block.freeSize = block.totalSize - proc.sizeKB
      allocations.push({
        pid: proc.id,
        sizeKB: proc.sizeKB,
        blockId: block.id,
        blockIndex: chosen.idx,
        status: 'ALLOCATED',
        internalFrag: block.totalSize - proc.sizeKB,
      })
    } else {
      allocations.push({
        pid: proc.id,
        sizeKB: proc.sizeKB,
        blockId: null,
        blockIndex: -1,
        status: 'FAILED',
        internalFrag: 0,
      })
    }
  }

  const finalBlocks = buildFixedBlockViz(memBlocks)
  const metrics = computeFixedMetrics(memBlocks)

  return { allocations, initialBlocks, finalBlocks, metrics }
}

/**
 * Dynamic partitioning — holes split to fit processes exactly.
 * Each original block is a contiguous region; multiple processes may be placed
 * inside one region, leaving a shrinking free hole. No internal fragmentation.
 */
function allocateDynamic(blocks, processes, algorithm) {
  // Holes are tracked independently. Each hole remembers which original block
  // it lives in and its base offset, so we can reconstruct the visual layout.
  const holes = blocks.map((b) => ({
    originId: b.id,
    originSize: b.sizeKB,
    base: 0,
    size: b.sizeKB,
  }))

  const allocations = []
  // originId -> list of allocated segments with base offset
  const segMap = new Map()

  const initialBlocks = blocks.map((b) => ({
    id: b.id,
    totalSize: b.sizeKB,
    segments: [{ type: 'free', size: b.sizeKB }],
  }))

  for (const proc of processes) {
    const candidates = holes
      .map((h, idx) => ({ ...h, idx }))
      .filter((h) => h.size >= proc.sizeKB)

    let chosen = null
    if (candidates.length) {
      switch (algorithm) {
        case 'best-fit':
          candidates.sort((a, b) => a.size - b.size)
          chosen = candidates[0]
          break
        case 'worst-fit':
          candidates.sort((a, b) => b.size - a.size)
          chosen = candidates[0]
          break
        default: // first-fit — lowest memory address (array order) first
          chosen = candidates[0]
      }
    }

    if (chosen) {
      const hole = holes[chosen.idx]
      if (!segMap.has(hole.originId)) segMap.set(hole.originId, [])
      segMap.get(hole.originId).push({
        type: 'allocated',
        pid: proc.id,
        size: proc.sizeKB,
        base: hole.base,
      })
      allocations.push({
        pid: proc.id,
        sizeKB: proc.sizeKB,
        blockId: hole.originId,
        blockIndex: blocks.findIndex((b) => b.id === hole.originId),
        status: 'ALLOCATED',
        internalFrag: 0,
      })
      // Shrink the hole (split). If exhausted, remove it.
      hole.base += proc.sizeKB
      hole.size -= proc.sizeKB
      if (hole.size === 0) holes.splice(chosen.idx, 1)
    } else {
      allocations.push({
        pid: proc.id,
        sizeKB: proc.sizeKB,
        blockId: null,
        blockIndex: -1,
        status: 'FAILED',
        internalFrag: 0,
      })
    }
  }

  const finalBlocks = blocks.map((b) => {
    const segs = (segMap.get(b.id) || []).slice().sort((a, c) => a.base - c.base)
    const ordered = segs.map((s) => ({ type: 'allocated', pid: s.pid, size: s.size }))
    const allocated = segs.reduce((sum, s) => sum + s.size, 0)
    const remaining = b.sizeKB - allocated
    if (remaining > 0) ordered.push({ type: 'free', size: remaining })
    return { id: b.id, totalSize: b.sizeKB, segments: ordered }
  })

  const metrics = computeDynamicMetrics(finalBlocks)

  return { allocations, initialBlocks, finalBlocks, metrics }
}

function buildFixedBlockViz(memBlocks) {
  return memBlocks.map((b) => {
    const segments = []
    if (b.allocated) {
      segments.push({ type: 'allocated', pid: b.allocated, size: b.processSize })
      const waste = b.totalSize - b.processSize
      if (waste > 0) segments.push({ type: 'waste', size: waste })
    } else {
      segments.push({ type: 'free', size: b.totalSize })
    }
    return { id: b.id, totalSize: b.totalSize, segments }
  })
}

function computeFixedMetrics(memBlocks) {
  const freeBlocks = memBlocks.filter((b) => !b.allocated)
  const totalFreeKB = freeBlocks.reduce((s, b) => s + b.totalSize, 0)
  const largestHoleKB = freeBlocks.length ? Math.max(...freeBlocks.map((b) => b.totalSize)) : 0
  const totalMemory = memBlocks.reduce((s, b) => s + b.totalSize, 0)
  const usedKB = memBlocks.filter((b) => b.allocated).reduce((s, b) => s + b.processSize, 0)

  return { totalFreeKB, largestHoleKB, totalMemory, usedKB }
}

function computeDynamicMetrics(finalBlocks) {
  let totalFreeKB = 0
  let largestHoleKB = 0
  let totalMemory = 0
  let usedKB = 0

  for (const b of finalBlocks) {
    totalMemory += b.totalSize
    for (const s of b.segments) {
      if (s.type === 'allocated') {
        usedKB += s.size
      } else if (s.type === 'free') {
        totalFreeKB += s.size
        if (s.size > largestHoleKB) largestHoleKB = s.size
      }
    }
  }

  return { totalFreeKB, largestHoleKB, totalMemory, usedKB }
}
