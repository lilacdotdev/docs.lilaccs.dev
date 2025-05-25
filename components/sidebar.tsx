"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Home, Mail, FileText, ChevronLeft, ChevronRight } from "lucide-react"

const filters = ["Projects", "AI", "Machine Learning", "Web Dev", "Hardware", "Software", "Personal", "Other"]

const links = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Contact", icon: Mail, href: "/contact" },
  { name: "Resume", icon: FileText, href: "/resume" },
]

interface SidebarProps {
  onFilterChange: (filter: string | null) => void
}

export function Sidebar({ onFilterChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleFilterClick = (filter: string) => {
    const filterSlug = filter.toLowerCase().replace(" ", "-")
    router.push(`/${filterSlug}`)
    onFilterChange(filter)
  }

  const handleAllPostsClick = () => {
    router.push("/")
    onFilterChange(null)
  }

  const currentFilter = pathname === "/" ? null : pathname.slice(1).replace("-", " ")

  return (
    <aside
      className={`sticky top-0 h-screen bg-background border-r border-foreground/10 flex flex-col transition-all duration-300 ease-in-out relative z-20 ${
        isCollapsed ? "w-16" : "w-80"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-foreground/10 transition-all duration-200 z-10"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Content wrapper with proper padding */}
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-2xl font-bold transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}
          >
            docs.<span className="gradient-text">lilaccs</span>
          </h1>
        </div>

        {/* Content - only show when not collapsed */}
        <div
          className={`flex-1 transition-opacity duration-300 overflow-y-auto ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          {/* Divider */}
          <div className="w-full h-px bg-foreground/20 mb-6"></div>

          {/* Filters */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold mb-4 text-foreground/70">FILTERS</h2>
            <div className="space-y-2">
              <button
                onClick={handleAllPostsClick}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 hover-glow ${
                  !currentFilter ? "bg-foreground/10" : "hover:bg-foreground/5"
                }`}
              >
                All Posts
              </button>
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 hover-glow ${
                    currentFilter === filter.toLowerCase() ? "bg-foreground/10" : "hover:bg-foreground/5"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-foreground/20 mb-6"></div>

          {/* Links */}
          <div className="flex-1">
            <h2 className="text-sm font-semibold mb-4 text-foreground/70">LINKS</h2>
            <div className="space-y-2">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-foreground/5 hover-glow"
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsed state - show minimal icons with proper centering */}
      {isCollapsed && (
        <div className="flex flex-col items-center justify-start space-y-4 mt-20 px-2">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="p-3 rounded-lg hover:bg-foreground/10 transition-all duration-200 flex items-center justify-center"
              title={link.name}
            >
              <link.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      )}
    </aside>
  )
}
