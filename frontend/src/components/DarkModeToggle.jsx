import { useContext } from 'react'
import { ThemeContext } from '../App'

function DarkModeToggle() {
  const { darkMode, setDarkMode } = useContext(ThemeContext)
  
  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light')
  }
  
  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  )
}

export default DarkModeToggle