/**
 * Memory allocation: First Fit, Best Fit, Worst Fit.
 * Each block can hold one process; internal fragmentation = blockSize - processSize.
 */
export function allocateMemory(blocks, processes, algorithm) {
  // Clone blocks with free space tracking
  const memBlocks = blocks.map((b) => ({
    id: b.id,
    totalSize: b.sizeKB,
    freeSize: b.sizeKB,
    allocated: null,
    processSize: 0,
  }))

  const allocations = []
  const initialBlocks = buildBlockViz(memBlocks)

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
      chosen.allocated = proc.id
      chosen.processSize = proc.sizeKB
      chosen.freeSize = chosen.totalSize - proc.sizeKB
      allocations.push({
        pid: proc.id,
        sizeKB: proc.sizeKB,
        blockId: chosen.id,
        blockIndex: chosen.idx,
        status: 'ALLOCATED',
        internalFrag: chosen.totalSize - proc.sizeKB,
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

  const finalBlocks = buildBlockViz(memBlocks)
  const metrics = computeFragmentationMetrics(memBlocks)

  return { allocations, initialBlocks, finalBlocks, metrics }
}

function buildBlockViz(memBlocks) {
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

function computeFragmentationMetrics(memBlocks) {
  const freeBlocks = memBlocks.filter((b) => !b.allocated)
  const totalFreeKB = freeBlocks.reduce((s, b) => s + b.totalSize, 0)
  const largestHoleKB = freeBlocks.length ? Math.max(...freeBlocks.map((b) => b.totalSize)) : 0
  const totalMemory = memBlocks.reduce((s, b) => s + b.totalSize, 0)
  const usedKB = memBlocks.filter((b) => b.allocated).reduce((s, b) => s + b.processSize, 0)

  return { totalFreeKB, largestHoleKB, totalMemory, usedKB }
}
