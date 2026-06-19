export function validateDeadlockInputs(available, allocation, max, processCount, resourceCount) {
  const errors = []

  if (processCount < 1 || resourceCount < 1) {
    errors.push({ type: 'invalid_dims', message: 'Must have at least 1 process and 1 resource.' })
  }

  available.forEach((val, j) => {
    if (val === '' || val === undefined) {
      errors.push({ type: 'empty_available', resource: j, message: `Available R${j} cannot be empty.` })
    } else if (val < 0) {
      errors.push({ type: 'negative_available', resource: j, message: `Available R${j} cannot be negative.` })
    }
  })

  allocation.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val === '' || val === undefined) {
        errors.push({ type: 'empty_allocation', message: `Allocation[P${i}][R${j}] cannot be empty.` })
      } else if (val < 0) {
        errors.push({ type: 'negative_allocation', message: `Allocation[P${i}][R${j}] cannot be negative.` })
      } else if (val > max[i][j]) {
        errors.push({ type: 'alloc_exceeds_max', message: `Allocation[P${i}][R${j}]=${val} exceeds Max=${max[i][j]}.` })
      }
    })
  })

  max.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val === '' || val === undefined) {
        errors.push({ type: 'empty_max', message: `Max[P${i}][R${j}] cannot be empty.` })
      } else if (val < 0) {
        errors.push({ type: 'negative_max', message: `Max[P${i}][R${j}] cannot be negative.` })
      }
    })
  })

  return errors
}
