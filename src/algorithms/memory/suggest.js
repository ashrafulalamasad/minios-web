/**
 * Smart suggestion engine for memory allocation.
 */
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

export function applyMemoryFix(fixType, blocks, processes, setAlgorithm) {
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
    case 'switch_best_fit':
      setAlgorithm?.('best-fit')
      return { blocks, processes }
    default:
      return { blocks, processes }
  }
}
