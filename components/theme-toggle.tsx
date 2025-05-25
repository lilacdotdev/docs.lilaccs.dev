"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button 
        className="relative p-3 rounded-full glass-effect hover-glow transition-all duration-300 group"
        aria-label="Toggle theme"
      >
        <div className="relative w-6 h-6" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative p-3 rounded-full glass-effect hover-glow transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <Sun
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
            theme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
            theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          }`}
        />
      </div>
    </button>
  )
}
