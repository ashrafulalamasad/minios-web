export function validateMemoryInputs(blocks, processes) {
  const errors = []

  blocks.forEach((b, i) => {
    if (!b.id?.trim()) errors.push({ type: 'empty_block_id', index: i, message: `Block row ${i + 1}: ID cannot be empty.` })
    if (b.sizeKB === '' || b.sizeKB === undefined) {
      errors.push({ type: 'empty_block_size', index: i, message: `${b.id}: Block size cannot be empty.` })
    } else if (b.sizeKB < 0) {
      errors.push({ type: 'negative_block_size', index: i, message: `${b.id}: Block size cannot be negative.` })
    } else if (b.sizeKB <= 0) {
      errors.push({ type: 'invalid_block_size', index: i, message: `${b.id}: Block size must be > 0 KB.` })
    }
  })

  processes.forEach((p, i) => {
    if (!p.id?.trim()) errors.push({ type: 'empty_proc_id', index: i, message: `Process row ${i + 1}: ID cannot be empty.` })
    if (p.sizeKB === '' || p.sizeKB === undefined) {
      errors.push({ type: 'empty_proc_size', index: i, message: `${p.id}: Process size cannot be empty.` })
    } else if (p.sizeKB < 0) {
      errors.push({ type: 'negative_proc_size', index: i, message: `${p.id}: Process size cannot be negative.` })
    } else if (p.sizeKB <= 0) {
      errors.push({ type: 'invalid_proc_size', index: i, message: `${p.id}: Process size must be > 0 KB.` })
    }
  })

  const blockIds = blocks.map((b) => b.id)
  const dupBlocks = blockIds.filter((id, i) => blockIds.indexOf(id) !== i)
  if (dupBlocks.length) {
    errors.push({ type: 'duplicate_block_id', message: `Duplicate block IDs: ${[...new Set(dupBlocks)].join(', ')}` })
  }

  const procIds = processes.map((p) => p.id)
  const dupProcs = procIds.filter((id, i) => procIds.indexOf(id) !== i)
  if (dupProcs.length) {
    errors.push({ type: 'duplicate_proc_id', message: `Duplicate process IDs: ${[...new Set(dupProcs)].join(', ')}` })
  }

  return errors
}

export function hasBlockingMemoryErrors(errors) {
  return errors.some((e) =>
    ['negative_block_size', 'negative_proc_size', 'invalid_block_size', 'invalid_proc_size', 'empty_block_id', 'empty_proc_id', 'empty_block_size', 'empty_proc_size'].includes(e.type),
  )
}
