import { useState, useCallback, useEffect } from 'react'

/**
 * Persists state to localStorage with JSON serialization.
 * Handles parse errors gracefully by falling back to defaultValue.
 */
export function useLocalStorage(key, defaultValue) {
  const readValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item != null ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }, [key, defaultValue])

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item != null ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        const next = typeof value === 'function' ? value(readValue()) : value
        window.localStorage.setItem(key, JSON.stringify(next))
        setStoredValue(next)
        window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(next) }))
      } catch (err) {
        console.warn(`useLocalStorage: failed to set key "${key}"`, err)
      }
    },
    [key, readValue],
  )

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === key) setStoredValue(readValue())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key, readValue])

  return [storedValue, setValue]
}

export function getStorageItem(key, defaultValue) {
  try {
    const item = window.localStorage.getItem(key)
    return item != null ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setStorageItem(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function pushHistory(key, entry, max = 20) {
  const history = getStorageItem(key, [])
  const next = [{ ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() }, ...history].slice(0, max)
  setStorageItem(key, next)
  return next
}
