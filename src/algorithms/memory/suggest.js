/**
 * Smart suggestion engine for memory allocation.
 */
import { allocateMemory } from './allocate'

export function analyzeMemorySuggestions(blocks, processes, errors, results, algorithm) {
  const invalidSizes = errors.filter((e) =>
    ['negative_block_size', 'negative_proc_size', 'invalid_block_size', 'invalid_proc_size'].includes(e.type),
  )
  if (invalidSizes.length) {
    return {
      severity: 'error',
      title: 'Invalid Memory Sizes',
      explanation: 'Memory block and process sizes must be positive integers. Negative or zero sizes are physically meaningless.',
      details: invalidSizes.map((e) => e.message),
      actions: [{ label: 'Quick Fix: Set minimum 1 KB', variant: 'primary', fixType: 'sanitize_sizes' }],
    }
  }

  if (!results) return null

  const failed = results.allocations.filter((a) => a.status === 'FAILED')
  if (failed.length) {
    const totalFree = results.metrics.totalFreeKB
    const largestBlock = Math.max(...blocks.map((b) => b.sizeKB))
    const totalMemory = results.metrics.totalMemory

    const details = failed.map((f) => {
      const maxBlock = Math.max(...blocks.map((b) => b.sizeKB))
      if (f.sizeKB > totalMemory) {
        return `${f.pid} (${f.sizeKB} KB) exceeds total system memory (${totalMemory} KB) — allocation is impossible.`
      }
      if (f.sizeKB > maxBlock) {
        return `${f.pid} (Size: ${f.sizeKB} KB) failed — no single block is large enough, despite ${totalFree} KB of total free space combined. This is external fragmentation.`
      }
      return `${f.pid} (${f.sizeKB} KB) could not be allocated — all suitable blocks are already occupied.`
    })

    const actions = []
    if (failed.some((f) => f.sizeKB <= largestBlock) && algorithm !== 'best-fit') {
      actions.push({ label: 'Try Best Fit', variant: 'primary', fixType: 'switch_best_fit' })
    }
    if (failed.some((f) => f.sizeKB > totalMemory)) {
      actions.push({ label: 'Quick Fix: Cap to largest block', variant: 'secondary', fixType: 'cap_processes' })
    }

    return {
      severity: 'warning',
      title: 'Allocation Failure — Fragmentation Detected',
      explanation:
        'A process cannot fit into any available memory block. Even when total free memory appears sufficient, fragmented holes may be too small individually (external fragmentation).',
      details,
      actions,
    }
  }

  // High internal fragmentation check
  const highWaste = results.allocations.filter(
    (a) => a.status === 'ALLOCATED' && a.internalFrag > 0 && a.internalFrag / (a.sizeKB + a.internalFrag) > 0.4,
  )
  if (highWaste.length && algorithm === 'worst-fit') {
    return {
      severity: 'warning',
      title: 'High Internal Fragmentation',
      explanation: 'Worst Fit often leaves large leftover holes inside blocks, wasting memory as internal fragmentation.',
      details: highWaste.map(
        (a) => `${a.pid} in ${a.blockId} wastes ${a.internalFrag} KB (${Math.round((a.internalFrag / (a.sizeKB + a.internalFrag)) * 100)}% of block).`,
      ),
      actions: [{ label: 'Try Best Fit', variant: 'primary', fixType: 'switch_best_fit' }],
    }
  }

  return null
}

/**
 * Run all three algorithms and return a comparison object.
 */
function compareAlgorithms(blocks, processes, partitionType) {
  const algos = ['first-fit', 'best-fit', 'worst-fit']
  const results = {}

  for (const algo of algos) {
    const res = allocateMemory(blocks, processes, algo, partitionType)
    const allocated = res.allocations.filter((a) => a.status === 'ALLOCATED')
    const failed = res.allocations.filter((a) => a.status === 'FAILED')
    const totalInternalFrag = allocated.reduce((sum, a) => sum + a.internalFrag, 0)
    results[algo] = {
      allocated: allocated.length,
      failed: failed.length,
      totalInternalFrag,
      largestHole: res.metrics.largestHoleKB,
      totalFree: res.metrics.totalFreeKB,
      usedKB: res.metrics.usedKB,
      totalMemory: res.metrics.totalMemory,
      allocations: res.allocations,
    }
  }

  return results
}

/**
 * Rich post-simulation analysis. Returns an object with stats, insights, and
 * per-process details.
 */
export function analyzePostSimulation(results, blocks, processes, algorithm, partitionType) {
  if (!results) return null

  const totalMemory = results.metrics.totalMemory
  const usedKB = results.metrics.usedKB
  const totalFreeKB = results.metrics.totalFreeKB
  const largestHole = results.metrics.largestHoleKB

  const allocated = results.allocations.filter((a) => a.status === 'ALLOCATED')
  const failed = results.allocations.filter((a) => a.status === 'FAILED')
  const totalInternalFrag = allocated.reduce((sum, a) => sum + a.internalFrag, 0)
  const totalProcessKB = allocated.reduce((sum, a) => sum + a.sizeKB, 0)

  const utilizationPct = totalMemory > 0 ? Math.round((usedKB / totalMemory) * 100) : 0
  const internalFragPct = totalMemory > 0 ? Math.round((totalInternalFrag / totalMemory) * 100) : 0
  const externalFragPct = totalMemory > 0 ? Math.round((totalFreeKB / totalMemory) * 100) : 0
  const efficiencyPct = totalProcessKB > 0 ? Math.round((totalProcessKB / (totalProcessKB + totalInternalFrag)) * 100) : 100

  // Run algorithm comparison
  const comparison = compareAlgorithms(blocks, processes, partitionType)

  // Find best alternative
  const algoKeys = ['first-fit', 'best-fit', 'worst-fit']
  const bestAlt = algoKeys
    .filter((a) => a !== algorithm)
    .reduce((best, a) => {
      const r = comparison[a]
      if (!r) return best
      // Score: fewer failures better, less internal frag better
      const score = r.failed * 10000 + r.totalInternalFrag
      if (!best || score < best.score) return { algo: a, score, ...r }
      return best
    }, null)

  const isBestAlgorithm = bestAlt
    ? (comparison[algorithm].failed * 10000 + comparison[algorithm].totalInternalFrag) <= bestAlt.score
    : true

  // Per-process details
  const processDetails = results.allocations.map((a) => {
    const insight = []
    if (a.status === 'FAILED') {
      if (a.sizeKB > totalMemory) {
        insight.push('Exceeds total memory — impossible to allocate')
      } else {
        const maxBlock = Math.max(...blocks.map((b) => b.sizeKB))
        if (a.sizeKB > maxBlock) {
          insight.push('Too large for any single block — external fragmentation')
        } else {
          insight.push('No free block available — all blocks occupied')
        }
      }
    } else if (a.internalFrag > 0) {
      const pct = Math.round((a.internalFrag / (a.sizeKB + a.internalFrag)) * 100)
      if (pct > 40) {
        insight.push(`High waste: ${pct}% of allocated block unused`)
      } else if (pct > 20) {
        insight.push(`Moderate waste: ${pct}% of allocated block unused`)
      }
    } else {
      insight.push('Perfect fit — no waste')
    }

    return { ...a, insights: insight }
  })

  // Overall insight
  const overallInsight = []
  if (failed.length === 0 && totalInternalFrag === 0) {
    overallInsight.push({ type: 'success', text: 'All processes allocated with zero waste — perfect run.' })
  } else if (failed.length === 0) {
    overallInsight.push({ type: 'info', text: `All ${allocated.length} processes allocated successfully.` })
    if (totalInternalFrag > 0) {
      overallInsight.push({ type: 'warning', text: `${totalInternalFrag} KB of internal fragmentation across allocated blocks.` })
    }
  } else {
    overallInsight.push({ type: 'error', text: `${failed.length} of ${processes.length} processes failed to allocate.` })
  }

  if (partitionType === 'fixed') {
    overallInsight.push({ type: 'info', text: 'Fixed partitioning limits each block to one process. Switch to dynamic partitioning to reduce internal fragmentation.' })
  } else {
    overallInsight.push({ type: 'info', text: 'Dynamic partitioning splits holes to fit processes exactly — no internal fragmentation.' })
  }

  if (!isBestAlgorithm && bestAlt) {
    const betterAlgoName = bestAlt.algo.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    overallInsight.push({
      type: 'suggestion',
      text: `${betterAlgoName} would${bestAlt.failed < comparison[algorithm].failed ? ` reduce failures from ${comparison[algorithm].failed} to ${bestAlt.failed}` : ''}${bestAlt.totalInternalFrag < comparison[algorithm].totalInternalFrag ? `${bestAlt.failed < comparison[algorithm].failed ? ' and ' : ''}reduce internal fragmentation from ${comparison[algorithm].totalInternalFrag} to ${bestAlt.totalInternalFrag} KB` : ''}.`,
    })
  }

  return {
    stats: {
      utilizationPct,
      internalFragPct,
      externalFragPct,
      efficiencyPct,
      totalMemory,
      usedKB,
      totalFreeKB,
      totalInternalFrag,
      totalProcessKB,
      allocatedCount: allocated.length,
      failedCount: failed.length,
      totalCount: processes.length,
    },
    comparison: algoKeys.map((a) => ({
      algorithm: a,
      label: a.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
      isCurrent: a === algorithm,
      ...comparison[a],
    })),
    processDetails,
    overallInsight,
    isBestAlgorithm,
  }
}

export function applyMemoryFix(fixType, blocks, processes) {
  switch (fixType) {
    case 'sanitize_sizes':
      return {
        blocks: blocks.map((b) => ({ ...b, sizeKB: b.sizeKB <= 0 ? 1 : b.sizeKB })),
        processes: processes.map((p) => ({ ...p, sizeKB: p.sizeKB <= 0 ? 1 : p.sizeKB })),
      }
    case 'cap_processes': {
      const maxBlock = Math.max(...blocks.map((b) => b.sizeKB))
      return {
        blocks,
        processes: processes.map((p) => ({ ...p, sizeKB: Math.min(p.sizeKB, maxBlock) })),
      }
    }
    default:
      return { blocks, processes }
  }
}
