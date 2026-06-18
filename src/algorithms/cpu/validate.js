/**
 * Validates CPU scheduling process inputs.
 */
export function validateCpuInputs(processes) {
  const errors = []
  const ids = new Set()

  processes.forEach((p, i) => {
    if (!p.id?.trim()) {
      errors.push({ type: 'empty_id', index: i, pid: p.id, message: `Row ${i + 1}: Process ID cannot be empty.` })
    }
    if (ids.has(p.id)) {
      errors.push({ type: 'duplicate_id', index: i, pid: p.id, message: `Duplicate process ID "${p.id}".` })
    }
    ids.add(p.id)

    if (p.arrival === '' || p.arrival === undefined) {
      errors.push({ type: 'empty_arrival', index: i, pid: p.id, message: `${p.id}: Arrival time cannot be empty.` })
    } else if (p.arrival < 0) {
      errors.push({ type: 'negative_arrival', index: i, pid: p.id, message: `${p.id}: Arrival time cannot be negative.` })
    } else if (p.arrival > 10000) {
      errors.push({ type: 'extreme_arrival', index: i, pid: p.id, message: `${p.id}: Arrival time ${p.arrival} is extremely large.` })
    }

    if (p.burst === '' || p.burst === undefined) {
      errors.push({ type: 'empty_burst', index: i, pid: p.id, message: `${p.id}: Burst time cannot be empty.` })
    } else if (p.burst < 0) {
      errors.push({ type: 'negative_burst', index: i, pid: p.id, message: `${p.id}: Burst time cannot be negative.` })
    } else if (p.burst === 0) {
      errors.push({ type: 'zero_burst', index: i, pid: p.id, message: `${p.id}: Burst time must be greater than 0.` })
    }
  })

  return errors
}

export function hasBlockingErrors(errors) {
  return errors.some((e) =>
    ['negative_burst', 'negative_arrival', 'zero_burst', 'empty_id', 'empty_arrival', 'empty_burst'].includes(e.type),
  )
}
