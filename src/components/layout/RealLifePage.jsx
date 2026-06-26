import { useState, useCallback, useEffect, useRef } from 'react'
import {
  Cpu, HardDrive, ShieldAlert, Globe, Coffee, Hotel, TrafficCone,
  Play, RotateCcw, SkipForward, Check, X, Timer, Users, DoorOpen, Car,
  BarChart3, SplitSquareVertical, Ban, ChevronRight, ListChecks,
  ArrowUp, ArrowDown, ArrowRight, ArrowLeft,
} from 'lucide-react'

/* ══════════════════════════════════════════════════════════════
   1. COFFEE SHOP CPU SCHEDULER
   ══════════════════════════════════════════════════════════════ */

const DRINKS = [
  { name: 'Espresso', time: 2, icon: '☕' },
  { name: 'Americano', time: 3, icon: '🥤' },
  { name: 'Latte', time: 5, icon: '🧋' },
  { name: 'Smoothie', time: 7, icon: '🍹' },
  { name: 'Frappé', time: 9, icon: '🍧' },
]

const CUSTOMERS = [
  { id: 'A', drink: 0 }, { id: 'B', drink: 2 }, { id: 'C', drink: 1 },
  { id: 'D', drink: 4 }, { id: 'E', drink: 1 }, { id: 'F', drink: 3 },
]

function CoffeeSim() {
  const [algo, setAlgo] = useState('fcfs')
  const [phase, setPhase] = useState('idle')
  const [queue, setQueue] = useState([])
  const [serving, setServing] = useState(null)
  const [done, setDone] = useState([])
  const [time, setTime] = useState(0)
  const timer = useRef(null)

  useEffect(() => {
    if (phase === 'idle') {
      setQueue(CUSTOMERS.map(c => ({ ...c, remaining: DRINKS[c.drink].time, drinkObj: DRINKS[c.drink] })))
    }
  }, [algo, phase])

  const run = useCallback(() => {
    setPhase('running')
    setQueue(CUSTOMERS.map(c => ({ ...c, remaining: DRINKS[c.drink].time, drinkObj: DRINKS[c.drink] })))
    setServing(null)
    setDone([])
    setTime(0)
  }, [])

  useEffect(() => {
    if (phase !== 'running') return
    let q = CUSTOMERS.map(c => ({ ...c, remaining: DRINKS[c.drink].time, drinkObj: DRINKS[c.drink] }))
    let sv = null
    let dn = []
    let t = 0
    let rrIndex = 0
    const QUANTUM = 3
    let rrProgress = 0

    timer.current = setInterval(() => {
      if (!sv && q.length > 0) {
        let idx = 0
        if (algo === 'sjf') {
          let minIdx = 0
          q.forEach((c, i) => { if (c.remaining < q[minIdx].remaining) minIdx = i })
          idx = minIdx
        } else if (algo === 'rr') {
          if (rrIndex >= q.length) rrIndex = 0
          idx = rrIndex
          rrIndex++
        }
        sv = { ...q[idx] }
        q.splice(idx, 1)
        rrProgress = 0
      }

      if (sv) {
        sv.remaining--
        rrProgress++
        if (sv.remaining <= 0) {
          dn.push({ ...sv })
          sv = null
          rrProgress = 0
        } else if (algo === 'rr' && rrProgress >= QUANTUM) {
          q.push({ ...sv })
          sv = null
          rrProgress = 0
        }
      }

      t++
      setQueue([...q])
      setServing(sv ? { ...sv } : null)
      setDone([...dn])
      setTime(t)

      if (dn.length === CUSTOMERS.length) {
        clearInterval(timer.current)
        setPhase('done')
      }
    }, 600)

    return () => clearInterval(timer.current)
  }, [phase, algo])

  const reset = () => {
    clearInterval(timer.current)
    setPhase('idle')
    setServing(null)
    setDone([])
    setTime(0)
  }

  const algos = [
    { id: 'fcfs', label: 'FCFS', desc: 'Order of arrival' },
    { id: 'sjf', label: 'SJF', desc: 'Shortest drink first' },
    { id: 'rr', label: 'Round Robin', desc: 'Fair time-sharing' },
  ]

  const cupFill = (total, remaining) => `${((total - remaining) / total) * 100}%`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {algos.map(a => (
          <button key={a.id} type="button" onClick={() => { setAlgo(a.id); reset() }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${algo === a.id ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>
            {a.label}
            <span className="block text-[10px] font-normal opacity-70">{a.desc}</span>
          </button>
        ))}
        <div className="flex-1" />
        {phase === 'idle' && (
          <button type="button" onClick={run}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 hover:bg-amber-700 transition-all cursor-pointer">
            <Play className="h-4 w-4" /> Start Serving
          </button>
        )}
        {(phase === 'running' || phase === 'done') && (
          <button type="button" onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        )}
      </div>

      <div className="flex items-center gap-6 text-sm text-slate-500 flex-wrap bg-white dark:bg-slate-900/50 rounded-xl px-5 py-3 border border-slate-200 dark:border-slate-700">
        <span className="flex items-center gap-2"><Timer className="h-4 w-4 text-amber-500" /> Time: <strong className="text-slate-800 dark:text-white text-base">{time}s</strong></span>
        <span className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
        <span className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-500" /> Waiting: <strong className="text-slate-800 dark:text-white text-base">{queue.length}</strong></span>
        <span className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
        <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Done: <strong className="text-slate-800 dark:text-white text-base">{done.length}/{CUSTOMERS.length}</strong></span>
        {phase === 'done' && (
          <>
            <span className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
            <span className="text-emerald-600 font-bold">✓ All orders completed in {time}s!</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="h-4 w-4" /> Waiting Room <span className="text-slate-300">({queue.length} customers)</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {queue.map((c, i) => (
              <div key={`${c.id}-${i}`} className="flex flex-col items-center gap-1">
                <div className="relative w-16 h-16 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                  <span className="text-2xl">{c.drinkObj.icon}</span>
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-md shadow-amber-500/30">{c.id}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">{c.remaining}s</span>
              </div>
            ))}
            {queue.length === 0 && phase === 'running' && (
              <p className="text-sm text-slate-400 italic py-4">No one waiting</p>
            )}
          </div>
        </div>

        <div className={`rounded-xl p-6 text-center border-2 transition-all duration-500 min-h-[280px] flex flex-col ${serving ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-400 dark:border-amber-600 shadow-lg shadow-amber-500/10' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'}`}>
          <p className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
            <span className="text-amber-600 text-lg">☕</span>
            <span className="text-amber-600">Now Serving</span>
          </p>
          <div className="flex-1 flex items-center justify-center">
          {serving ? (
            <div className="space-y-3">
              <span className="text-6xl block">{serving.drinkObj.icon}</span>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">Customer {serving.id}</p>
                <p className="text-sm text-slate-500 mt-0.5">{serving.drinkObj.name}</p>
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-[160px] mx-auto">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300 shadow-sm" style={{ width: cupFill(serving.drinkObj.time, serving.remaining) }} />
                </div>
                <p className="text-xs text-slate-400 font-mono">{serving.remaining}s / {serving.drinkObj.time}s</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-slate-400">{phase === 'idle' ? 'Press "Start Serving" to begin' : 'Preparing next order...'}</p>
            </div>
          )}
          </div>
        </div>
      </div>

      {done.length > 0 && (
        <div className="bg-white dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Check className="h-4 w-4" /> Completed ({done.length}/{CUSTOMERS.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {done.map(c => (
              <div key={c.id} className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 border border-emerald-200 dark:border-emerald-800/40">
                <span className="text-emerald-500 font-bold text-sm">✓</span>
                <span className="text-xl">{c.drinkObj.icon}</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">{c.id}</span>
                <span className="text-[10px] text-emerald-500/70 font-mono">({c.drinkObj.time}s)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


/* ══════════════════════════════════════════════════════════════
   2. HOTEL MEMORY ALLOCATOR
   ══════════════════════════════════════════════════════════════ */

const HOTEL_ROOMS = [
  { id: 0, size: 2 }, { id: 1, size: 1 }, { id: 2, size: 4 }, { id: 3, size: 1 },
  { id: 4, size: 3 }, { id: 5, size: 2 }, { id: 6, size: 5 }, { id: 7, size: 1 },
  { id: 8, size: 2 }, { id: 9, size: 3 },
]

const GUESTS = [
  { id: 0, label: 'Solo', size: 1, emoji: '🧑' },
  { id: 1, label: 'Couple', size: 2, emoji: '👫' },
  { id: 2, label: 'Family', size: 3, emoji: '👨‍👩‍👧' },
  { id: 3, label: 'Team', size: 2, emoji: '👔' },
  { id: 4, label: 'Big Fam', size: 4, emoji: '👨‍👩‍👧‍👦' },
]

const GUEST_COLORS = ['bg-amber-400', 'bg-emerald-400', 'bg-blue-400', 'bg-purple-400', 'bg-rose-400']

function HotelSim() {
  const [strategy, setStrategy] = useState('first-fit')
  const [occupied, setOccupied] = useState({})
  const [nextGuest, setNextGuest] = useState(0)
  const [log, setLog] = useState([])
  const [animRoom, setAnimRoom] = useState(null)
  const assigningRef = useRef(false)

  const findRoom = (currentOccupied, guestSize) => {
    if (strategy === 'first-fit') {
      return HOTEL_ROOMS.findIndex(r => currentOccupied[r.id] === undefined && r.size >= guestSize)
    }
    if (strategy === 'best-fit') {
      let best = Infinity, bestIdx = -1
      HOTEL_ROOMS.forEach((r, i) => {
        if (currentOccupied[r.id] === undefined && r.size >= guestSize && r.size < best) { best = r.size; bestIdx = i }
      })
      return bestIdx
    }
    if (strategy === 'worst-fit') {
      let worst = -1, worstIdx = -1
      HOTEL_ROOMS.forEach((r, i) => {
        if (currentOccupied[r.id] === undefined && r.size >= guestSize && r.size > worst) { worst = r.size; worstIdx = i }
      })
      return worstIdx
    }
    return -1
  }

  const assignNext = useCallback(() => {
    if (nextGuest >= GUESTS.length || assigningRef.current) return
    assigningRef.current = true
    const guest = GUESTS[nextGuest]
    const idx = findRoom(occupied, guest.size)

    if (idx >= 0) {
      setAnimRoom(idx)
      setTimeout(() => {
        setOccupied(o => ({ ...o, [idx]: guest.id }))
        setLog(l => [...l, {
          guest: guest.emoji, label: guest.label, size: guest.size,
          room: idx, roomSize: HOTEL_ROOMS[idx].size, waste: HOTEL_ROOMS[idx].size - guest.size, success: true,
        }])
        setNextGuest(n => n + 1)
        setAnimRoom(null)
        assigningRef.current = false
      }, 350)
    } else {
      setLog(l => [...l, { guest: guest.emoji, label: guest.label, size: guest.size, success: false }])
      setNextGuest(n => n + 1)
      assigningRef.current = false
    }
  }, [nextGuest, strategy, occupied])

  const autoAssign = () => {
    if (assigningRef.current) return
    setOccupied({})
    setNextGuest(0)
    setLog([])
    setAnimRoom(null)
    assigningRef.current = true

    const runSequence = (guestIdx, currentOccupied) => {
      if (guestIdx >= GUESTS.length) { assigningRef.current = false; return }
      const guest = GUESTS[guestIdx]
      const idx = findRoom(currentOccupied, guest.size)
      if (idx >= 0) {
        const newOccupied = { ...currentOccupied, [idx]: guest.id }
        setAnimRoom(idx)
        setTimeout(() => {
          setOccupied(newOccupied)
          setLog(l => [...l, { guest: guest.emoji, label: guest.label, size: guest.size, room: idx, roomSize: HOTEL_ROOMS[idx].size, waste: HOTEL_ROOMS[idx].size - guest.size, success: true }])
          setNextGuest(guestIdx + 1)
          setAnimRoom(null)
          setTimeout(() => runSequence(guestIdx + 1, newOccupied), 300)
        }, 350)
      } else {
        setLog(l => [...l, { guest: guest.emoji, label: guest.label, size: guest.size, success: false }])
        setNextGuest(guestIdx + 1)
        setTimeout(() => runSequence(guestIdx + 1, currentOccupied), 300)
      }
    }
    setTimeout(() => runSequence(0, {}), 300)
  }

  const reset = () => {
    assigningRef.current = false
    setOccupied({})
    setNextGuest(0)
    setLog([])
    setAnimRoom(null)
  }

  const stats = {
    total: HOTEL_ROOMS.length,
    occupied: Object.keys(occupied).length,
    free: HOTEL_ROOMS.length - Object.keys(occupied).length,
    totalWaste: log.filter(l => l.success).reduce((s, l) => s + l.waste, 0),
  }

  const strategies = [
    { id: 'first-fit', label: 'First Fit', desc: 'First room that fits' },
    { id: 'best-fit', label: 'Best Fit', desc: 'Smallest that fits' },
    { id: 'worst-fit', label: 'Worst Fit', desc: 'Largest room' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        {strategies.map(s => (
          <button key={s.id} type="button" onClick={() => { setStrategy(s.id); if (!assigningRef.current) reset() }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${strategy === s.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>
            {s.label}
            <span className="block text-[10px] font-normal opacity-70">{s.desc}</span>
          </button>
        ))}
        <div className="flex-1" />
        {!assigningRef.current && nextGuest < GUESTS.length && (
          <>
            <button type="button" onClick={assignNext}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer">
              <SkipForward className="h-4 w-4" /> Assign One
            </button>
            <button type="button" onClick={autoAssign}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition-all cursor-pointer">
              <Play className="h-4 w-4" /> Auto Assign All
            </button>
          </>
        )}
        {(nextGuest >= GUESTS.length || assigningRef.current) && (
          <button type="button" onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 text-sm bg-white dark:bg-slate-900/50 rounded-xl px-5 py-3 border border-slate-200 dark:border-slate-700">
        <span className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-slate-400" /> Occupied: <strong className="text-slate-800 dark:text-white">{stats.occupied}/{stats.total}</strong></span>
        <span className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
        <span className="flex items-center gap-2"><SplitSquareVertical className="h-4 w-4 text-emerald-500" /> Free: <strong className="text-emerald-600">{stats.free}</strong></span>
        <span className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
        <span className="flex items-center gap-2"><Ban className="h-4 w-4 text-orange-500" /> Waste: <strong className="text-orange-600">{stats.totalWaste} units</strong></span>
      </div>

      {/* Guest queue */}
      <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap bg-white dark:bg-slate-900/50 rounded-xl px-5 py-3 border border-slate-200 dark:border-slate-700">
        <span className="font-semibold text-slate-600 dark:text-slate-300">Guests:</span>
        {GUESTS.map((g, i) => {
          const assigned = log.find(l => l.success && l.label === g.label)
          const isNext = i === nextGuest && !assigned
          return (
            <span key={g.id} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              assigned ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400' :
              isNext ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 ring-2 ring-amber-300 dark:ring-amber-700' :
              'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}>
              {assigned ? '✓' : g.emoji} {g.label} <span className="opacity-60">({g.size})</span>
            </span>
          )
        })}
      </div>

      {/* Hotel Floor */}
      <div className="grid grid-cols-5 gap-3">
        {HOTEL_ROOMS.map((room, i) => {
          const guestId = occupied[i]
          const guest = guestId !== undefined ? GUESTS[guestId] : null
          const isAnim = animRoom === i
          return (
            <div key={room.id} className={`rounded-xl p-3 text-center border-2 transition-all duration-300 ${isAnim ? 'scale-110 shadow-lg z-10' : ''} ${guest ? `${GUEST_COLORS[guestId]} text-white border-transparent shadow-md` : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'}`}>
              <p className={`text-[9px] font-bold ${guest ? 'text-white/70' : 'text-slate-400'}`}>Room {room.id}</p>
              <p className="text-xl font-bold">{room.size}</p>
              {guest ? (
                <div>
                  <p className="text-xl">{guest.emoji}</p>
                  {room.size - guest.size > 0 && (
                    <p className="text-[8px] font-semibold bg-white/20 rounded-full px-1.5 py-0.5 inline-block mt-0.5">waste {room.size - guest.size}</p>
                  )}
                </div>
              ) : (
                <p className="text-[9px] text-slate-400 mt-1">Free</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div className="bg-white dark:bg-slate-900/30 rounded-xl p-4 border border-slate-200/40 dark:border-slate-700/40 max-h-[110px] overflow-y-auto space-y-1">
          {log.map((entry, i) => (
            <p key={i} className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {entry.success
                ? `✅ ${entry.guest} ${entry.label} → Room ${entry.room} (size ${entry.roomSize}) waste ${entry.waste}`
                : `⚠️ ${entry.guest} ${entry.label} (size ${entry.size}) — no room!`}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}


/* ══════════════════════════════════════════════════════════════
   3. TRAFFIC INTERSECTION DEADLOCK
   ══════════════════════════════════════════════════════════════ */

const CAR_COLORS = {
  n: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800/40' },
  s: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800/40' },
  e: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800/40' },
  w: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800/40' },
}

const CAR_DEPS = {
  n: { holds: 'North Lane', needs: 'South Lane', blockedBy: 's' },
  s: { holds: 'South Lane', needs: 'East Lane', blockedBy: 'e' },
  e: { holds: 'East Lane', needs: 'West Lane', blockedBy: 'w' },
  w: { holds: 'West Lane', needs: 'North Lane', blockedBy: 'n' },
}

const DIR_META = [
  { id: 'n', label: 'North', icon: '🚗', x: '50%', y: '4%', tx: '-50%', ty: '0' },
  { id: 's', label: 'South', icon: '🚙', x: '50%', y: '76%', tx: '-50%', ty: '0' },
  { id: 'e', label: 'East', icon: '🚕', x: '76%', y: '50%', tx: '0', ty: '-50%' },
  { id: 'w', label: 'West', icon: '🚐', x: '4%', y: '50%', tx: '0', ty: '-50%' },
]

const SAFE_SEQ = ['n', 's', 'e', 'w']

function TrafficSim() {
  const [phase, setPhase] = useState('idle')
  const [carPhase, setCarPhase] = useState({ n: 'empty', s: 'empty', e: 'empty', w: 'empty' })
  const [clearedOrder, setClearedOrder] = useState([])
  const [msg, setMsg] = useState('Click "Simulate Arrival" to watch 4 cars enter the intersection one by one')
  const [clearing, setClearing] = useState(false)
  const [shaking, setShaking] = useState(null)
  const arrivalRef = useRef(null)

  const simulateArrival = useCallback(() => {
    setPhase('arriving')
    setClearedOrder([])
    setMsg('Cars arriving one by one...')
    const order = ['n', 's', 'e', 'w']
    let i = 0
    const tick = () => {
      if (i >= order.length) {
        setTimeout(() => {
          setPhase('gridlock')
          setMsg('DEADLOCK! Circular wait detected. Each car holds a lane and needs the next car\'s lane.')
        }, 600)
        return
      }
      setCarPhase(p => ({ ...p, [order[i]]: 'present' }))
      i++
      arrivalRef.current = setTimeout(tick, 700)
    }
    arrivalRef.current = setTimeout(tick, 400)
  }, [])

  const tryMoveCar = useCallback((dir) => {
    if (phase !== 'gridlock' || clearing) return
    const dep = CAR_DEPS[dir]
    const blocker = dep.blockedBy
    if (carPhase[blocker] === 'present') {
      setShaking(dir)
      setMsg(`${dir.toUpperCase()} is blocked! Waits for ${blocker.toUpperCase()} (${dep.needs} occupied).`)
      setTimeout(() => setShaking(null), 600)
    } else {
      setCarPhase(p => ({ ...p, [dir]: 'cleared' }))
      setClearedOrder(o => [...o, dir])
      const remaining = Object.values(carPhase).filter(p => p === 'present').length - 1
      setMsg(remaining === 0
        ? 'All cars cleared! Intersection safe.'
        : `${dir.toUpperCase()} cleared. ${remaining} car${remaining > 1 ? 's' : ''} remaining.`)
      if (remaining === 0) setPhase('clear')
    }
  }, [phase, clearing, carPhase])

  const autoClear = useCallback(() => {
    if (phase !== 'gridlock' || clearing) return
    setClearing(true)
    setMsg('Finding safe sequence...')
    let i = 0
    const step = () => {
      if (i >= SAFE_SEQ.length) {
        setTimeout(() => { setPhase('clear'); setMsg('All cars cleared safely.'); setClearing(false) }, 400)
        return
      }
      const dir = SAFE_SEQ[i]
      setCarPhase(p => ({ ...p, [dir]: 'next' }))
      setMsg(`Safe sequence: ${dir.toUpperCase()} can move now.`)
      setTimeout(() => {
        setCarPhase(p => ({ ...p, [dir]: 'cleared' }))
        setClearedOrder(o => [...o, dir])
        i++
        setTimeout(step, 350)
      }, 600)
    }
    setTimeout(step, 500)
  }, [phase, clearing])

  const reset = () => {
    clearTimeout(arrivalRef.current)
    setClearing(false)
    setPhase('idle')
    setShaking(null)
    setCarPhase({ n: 'empty', s: 'empty', e: 'empty', w: 'empty' })
    setClearedOrder([])
    setMsg('Click "Simulate Arrival" to watch 4 cars enter the intersection one by one')
  }

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {phase === 'idle' && (
          <button type="button" onClick={simulateArrival}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-600/30 hover:shadow-lg hover:from-orange-500 hover:to-red-500 transition-all cursor-pointer">
            <Car className="h-4 w-4" /> Simulate Arrival
          </button>
        )}
        {phase === 'arriving' && (
          <span className="text-sm text-slate-400 italic">Cars entering...</span>
        )}
        {phase === 'gridlock' && (
          <>
            <button type="button" onClick={autoClear}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 hover:shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer">
              <ListChecks className="h-4 w-4" /> Banker's Auto-Clear
            </button>
            <button type="button" onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </>
        )}
        {phase === 'clear' && (
          <button type="button" onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/30 hover:shadow-lg hover:from-emerald-500 hover:to-green-500 transition-all cursor-pointer">
            <Car className="h-4 w-4" /> Simulate Again
          </button>
        )}
      </div>

      {/* Status */}
      <div className={`rounded-2xl p-4 border-2 transition-all duration-500 ${
        phase === 'gridlock' ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700' :
        phase === 'clear' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700' :
        'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-700'
      }`}>
        <p className={`text-sm font-bold ${
          phase === 'gridlock' ? 'text-red-600 dark:text-red-400' :
          phase === 'clear' ? 'text-emerald-600 dark:text-emerald-400' :
          'text-slate-500'
        }`}>{msg}</p>
      </div>

      {/* Main: Intersection + Resource Table */}
      <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
        {/* Intersection */}
        <div className="relative w-[340px] h-[340px] shrink-0 mx-auto lg:mx-0">
          <div className="absolute inset-4 rounded-2xl bg-slate-700 dark:bg-slate-600 overflow-hidden">
            <div className="absolute top-1/2 left-0 right-0 h-20 -translate-y-1/2">
              <div className="h-full w-full" style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 10px, transparent 10px, transparent 16px)' }} />
            </div>
            <div className="absolute left-1/2 top-0 bottom-0 w-20 -translate-x-1/2">
              <div className="h-full w-full" style={{ background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 10px, transparent 10px, transparent 16px)' }} />
            </div>
          </div>

          {/* Center indicator */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-xl flex items-center justify-center z-20 transition-all duration-500 ${
            phase === 'gridlock' ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/50' :
            phase === 'clear' ? 'bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/50' :
            'bg-slate-800 dark:bg-slate-500'
          }`}>
            <span className="text-white text-2xl font-bold">
              {phase === 'gridlock' ? '\u2717' : phase === 'clear' ? '\u2713' : '?'}
            </span>
          </div>

          {/* Cars */}
          {DIR_META.map(d => {
            const cp = carPhase[d.id]
            const isPresent = cp === 'present' || cp === 'next'
            const isCleared = cp === 'cleared'
            const isNextSafe = cp === 'present' && phase === 'gridlock'
            const canClick = isNextSafe && !clearing
            const dep = CAR_DEPS[d.id]
            const isBlocked = isNextSafe && carPhase[dep.blockedBy] === 'present'
            const c = CAR_COLORS[d.id]

            return (
              <div key={d.id} className="absolute z-10 transition-all duration-500" style={{
                left: d.x, top: d.y, transform: `translate(${d.tx}, ${d.ty})`,
                opacity: isPresent || isCleared ? 1 : 0.12,
              }}>
                <button type="button" onClick={() => tryMoveCar(d.id)} disabled={!canClick}
                  className={`relative w-[72px] h-[72px] rounded-2xl flex flex-col items-center justify-center shadow-lg transition-all duration-300 ${
                    isCleared ? 'bg-emerald-400 shadow-emerald-400/40 scale-90' :
                    shaking === d.id ? 'bg-red-400 shadow-red-400/50 animate-shake' :
                    isBlocked ? `${c.bg} shadow-lg ring-4 ring-red-400/60 animate-pulse` :
                    isPresent ? `${c.bg} shadow-lg` : 'bg-slate-300 dark:bg-slate-600'
                  } ${canClick ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}>
                  {isCleared ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-2xl">{d.icon}</span>
                  )}
                </button>
                <p className={`text-center text-[10px] font-bold mt-1 transition-all ${
                  isCleared ? 'text-emerald-500' :
                  isBlocked ? 'text-red-400' :
                  isPresent ? 'text-white/60' : 'text-slate-500'
                }`}>
                  {isCleared ? '\u2713 Cleared' : isBlocked ? `\u26A0 Blocked by ${dep.blockedBy.toUpperCase()}` : d.label}
                </p>
              </div>
            )
          })}

          {/* Circular wait arrows (only in gridlock) */}
          {phase === 'gridlock' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 340 340">
              <defs>
                <marker id="arrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6 Z" fill="#ef4444" />
                </marker>
              </defs>
              <line x1="185" y1="75" x2="185" y2="265" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" markerEnd="url(#arrowR)" opacity="0.7" />
              <line x1="265" y1="185" x2="75" y2="185" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" markerEnd="url(#arrowR)" opacity="0.7" />
              <line x1="155" y1="265" x2="155" y2="75" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" markerEnd="url(#arrowR)" opacity="0.7" />
              <line x1="75" y1="155" x2="265" y2="155" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" markerEnd="url(#arrowR)" opacity="0.7" />
              <text x="195" y="170" fill="#ef4444" fontSize="9" fontWeight="bold">N→S</text>
              <text x="170" y="197" fill="#ef4444" fontSize="9" fontWeight="bold">S→E</text>
              <text x="125" y="170" fill="#ef4444" fontSize="9" fontWeight="bold">E→W</text>
              <text x="170" y="145" fill="#ef4444" fontSize="9" fontWeight="bold">W→N</text>
            </svg>
          )}

          <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400/20 pointer-events-none" />
        </div>

        {/* Right panel */}
        <div className="flex-1 w-full min-w-[260px] space-y-4">
          {/* Resource Allocation Table */}
          {(phase === 'gridlock' || phase === 'clear') && (
            <div className="bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Resource Allocation</p>
              <div className="space-y-2">
                {DIR_META.map(d => {
                  const cp = carPhase[d.id]
                  const isPresent = cp === 'present' || cp === 'next'
                  const isCleared = cp === 'cleared'
                  const dep = CAR_DEPS[d.id]
                  const c = CAR_COLORS[d.id]
                  const isBlocked = isPresent && carPhase[dep.blockedBy] === 'present'
                  return (
                    <div key={d.id} className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 border transition-all ${
                      isCleared ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40' :
                      isBlocked ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40' :
                      isPresent ? `${c.light} ${c.border}` :
                      'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                    }`}>
                      <span className="font-bold w-5">{d.icon}</span>
                      <span className={`font-bold w-12 ${isCleared ? 'text-emerald-600' : isPresent ? c.text : 'text-slate-400'}`}>
                        {d.id.toUpperCase()}
                      </span>
                      {isPresent || isCleared ? (
                        <>
                          <span className="text-slate-400">|</span>
                          <span className="text-slate-500">Holds:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{dep.holds}</span>
                          <span className="text-slate-400">→</span>
                          <span className="text-slate-500">Needs:</span>
                          <span className={`font-semibold ${isBlocked ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>{dep.needs}</span>
                        </>
                      ) : (
                        <span className="text-slate-400 italic">Not arrived</span>
                      )}
                      {isCleared && <span className="ml-auto text-emerald-500 font-bold">✓</span>}
                      {isBlocked && <span className="ml-auto text-red-500 font-bold text-[10px]">BLOCKED</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Safe sequence progress */}
          {(phase === 'clear') && clearedOrder.length > 0 && (
            <div className="bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clearance Order</p>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                  {clearedOrder.length}/4
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {clearedOrder.map((dir, i) => {
                  const c = CAR_COLORS[dir]
                  const d = DIR_META.find(dd => dd.id === dir)
                  return (
                    <span key={`${dir}-${i}`} className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold ${c.light} ${c.text} ${c.border} border`}>
                      {d.icon} {dir.toUpperCase()}
                      {i < clearedOrder.length - 1 && <ChevronRight className="h-3 w-3 opacity-40" />}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Coffman Conditions */}
          {(phase === 'gridlock' || phase === 'clear') && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${phase === 'gridlock' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                Coffman Conditions {phase === 'gridlock' ? '(all 4 met)' : '(resolved)'}
              </p>
              {[
                { id: 'mutex', label: 'Mutual Exclusion', desc: 'Only one car per lane' },
                { id: 'hold', label: 'Hold & Wait', desc: 'Cars hold their lane while waiting' },
                { id: 'nopreempt', label: 'No Preemption', desc: "Can't push cars away" },
                { id: 'circular', label: 'Circular Wait', desc: 'N→S→E→W→N cycle' },
              ].map(c => (
                <div key={c.id} className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 border transition-all ${
                  phase === 'gridlock'
                    ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40 hover:bg-red-100 dark:hover:bg-red-950/50'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40'
                }`}>
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold shadow-sm ${
                    phase === 'gridlock' ? 'bg-red-500 shadow-red-500/30' : 'bg-emerald-500 shadow-emerald-500/30'
                  }`}>✓</div>
                  <div>
                    <p className={`text-xs font-semibold ${phase === 'gridlock' ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{c.label}</p>
                    <p className={`text-[9px] ${phase === 'gridlock' ? 'text-red-500/70 dark:text-red-400/70' : 'text-emerald-500/70 dark:text-emerald-400/70'}`}>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Idle hint */}
          {phase === 'idle' && (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Car className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Click <strong>"Simulate Arrival"</strong> to watch cars enter the intersection.</p>
              <p className="text-xs mt-2 opacity-70">Then try clicking a blocked car to see the deadlock!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════ */

export default function RealLifePage({ onNavigate }) {
  return (
    <div className="space-y-6 animate-slide-down">
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-4 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/25">
            <Globe className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">OS Concepts in Real Life</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Play with interactive simulations that show how OS algorithms work in the real world</p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden border border-amber-200/50 dark:border-amber-800/30 bg-amber-50/30 dark:bg-amber-950/20">
        <div className="p-6 sm:p-8 pb-0 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white shrink-0"><Coffee className="h-5 w-5" /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">CPU Scheduling</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Run a coffee shop — different strategies decide whose drink to make next</p>
          </div>
        </div>
        <div className="p-6 sm:p-8"><CoffeeSim /></div>
      </div>

      <div className="glass-card overflow-hidden border border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/30 dark:bg-emerald-950/20">
        <div className="p-6 sm:p-8 pb-0 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0"><Hotel className="h-5 w-5" /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Memory Allocation</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Assign hotel rooms to guests using different allocation strategies</p>
          </div>
        </div>
        <div className="p-6 sm:p-8"><HotelSim /></div>
      </div>

      <div className="glass-card overflow-hidden border border-orange-200/50 dark:border-orange-800/30 bg-orange-50/30 dark:bg-orange-950/20">
        <div className="p-6 sm:p-8 pb-0 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shrink-0"><TrafficCone className="h-5 w-5" /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Deadlock Detection</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage a traffic intersection — detect gridlock and find safe passage</p>
          </div>
        </div>
        <div className="p-6 sm:p-8"><TrafficSim /></div>
      </div>

      <div className="glass-card p-6 sm:p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Try the Real Simulators</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 max-w-lg mx-auto">These are simplified demos. The full simulators let you control every parameter with detailed metrics.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => onNavigate('cpu')}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-700 active:scale-[0.97] cursor-pointer">
            <Cpu className="h-4 w-4" /> CPU Scheduling
          </button>
          <button type="button" onClick={() => onNavigate('memory')}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.97] cursor-pointer">
            <HardDrive className="h-4 w-4" /> Memory Allocation
          </button>
          <button type="button" onClick={() => onNavigate('deadlock')}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-700 active:scale-[0.97] cursor-pointer">
            <ShieldAlert className="h-4 w-4" /> Deadlock Detection
          </button>
        </div>
      </div>
    </div>
  )
}
