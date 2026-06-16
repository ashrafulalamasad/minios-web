export const DEFAULT_CPU = {
  algorithm: 'fcfs',
  processes: [
    { id: 'P1', arrival: 0, burst: 8 },
    { id: 'P2', arrival: 1, burst: 4 },
    { id: 'P3', arrival: 2, burst: 9 },
    { id: 'P4', arrival: 3, burst: 5 },
  ],
}

export const DEFAULT_MEMORY = {
  algorithm: 'first-fit',
  blocks: [
    { id: 'B0', sizeKB: 100 },
    { id: 'B1', sizeKB: 500 },
    { id: 'B2', sizeKB: 200 },
    { id: 'B3', sizeKB: 300 },
    { id: 'B4', sizeKB: 600 },
  ],
  processes: [
    { id: 'P1', sizeKB: 212 },
    { id: 'P2', sizeKB: 417 },
    { id: 'P3', sizeKB: 112 },
    { id: 'P4', sizeKB: 426 },
  ],
}

export const DEFAULT_DEADLOCK = {
  processCount: 5,
  resourceCount: 3,
  available: [3, 3, 2],
  allocation: [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2],
  ],
  max: [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3],
  ],
  requestProcess: 1,
  request: [1, 0, 2],
  enableRequest: false,
}

export const MODULES = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'cpu', label: 'CPU Scheduling', icon: 'Cpu' },
  { id: 'memory', label: 'Memory Allocation', icon: 'HardDrive' },
  { id: 'deadlock', label: 'Deadlock Detection', icon: 'ShieldAlert' },
]
