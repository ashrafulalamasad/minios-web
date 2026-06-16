import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../utils/storageKeys'

export function useTheme() {
  const [storedTheme, setTheme] = useLocalStorage(STORAGE_KEYS.THEME, 'light')
  const theme = storedTheme === 'dark' ? 'dark' : 'light'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return { theme, setTheme, toggleTheme }
}
