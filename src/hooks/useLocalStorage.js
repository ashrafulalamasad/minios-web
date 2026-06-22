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
      } catch {
        // silent fail — localStorage may be full or disabled
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


