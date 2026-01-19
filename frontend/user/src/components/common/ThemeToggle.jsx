// ============================================
// FILE: frontend/user/src/components/common/ThemeToggle.jsx
// Reusable Theme Toggle Component
// ============================================
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${className}`}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        // Moon Icon for Dark Mode
        <svg 
          className="w-5 h-5 text-slate-700 dark:text-slate-300" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      ) : (
        // Sun Icon for Light Mode
        <svg 
          className="w-5 h-5 text-yellow-400" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
      )}
    </button>
  );
}