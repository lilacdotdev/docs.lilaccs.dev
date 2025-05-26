'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Contact,
  FileText,
  Globe,
  FolderGit,
  User,
  Brain,
  Code,
  Cpu,
  Settings,
} from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useSidebarStore } from '@/lib/store/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

const filters = [
  { name: 'All Posts', icon: Globe },
  { name: 'Projects', icon: FolderGit },
  { name: 'Personal', icon: User },
  { name: 'AI/ML', icon: Brain },
  { name: 'Web Dev', icon: Code },
  { name: 'Hardware', icon: Cpu },
  { name: 'Software', icon: Settings },
]

const links = [
  { name: 'Home', icon: Home, href: 'https://lilaccs.dev' },
  { name: 'Contact', icon: Contact, href: 'https://card.lilaccs.dev' },
  { name: 'Resume', icon: FileText, href: 'https://resume.lilaccs.dev' },
]

export function Sidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'All Posts')
  const { isCollapsed, toggleCollapsed } = useSidebarStore()

  // Handle filter changes
  const handleFilterClick = (filter: string) => {
    const newFilter = filter === 'All Posts' ? null : filter
    if (newFilter) {
      router.push(`/?filter=${newFilter}`)
    } else {
      router.push('/')
    }
    setActiveFilter(filter)
  }

  // Update active filter when URL changes
  useEffect(() => {
    const filter = searchParams.get('filter')
    setActiveFilter(filter || 'All Posts')
  }, [searchParams])

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? '4rem' : '16rem',
      }}
      className="relative flex h-screen flex-col border-r border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950"
    >
      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapsed}
        className="absolute -right-4 top-8 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo */}
      <div className="mt-8 flex items-center">
        <motion.div
          animate={{ width: isCollapsed ? 0 : 'auto' }}
          className="overflow-hidden"
        >
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-zinc-950 dark:text-white">
              docs.
            </span>
            <motion.span
              className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-clip-text text-2xl font-bold text-transparent"
              style={{
                backgroundSize: '300% 300%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              lilaccs
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <nav className="mt-8 flex-1">
        <motion.div
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          className={cn('space-y-4', isCollapsed && 'hidden')}
        >
          <h2 className="px-2 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
            Filters
          </h2>
          <div className="space-y-1">
            {filters.map((filter) => (
              <button
                key={filter.name}
                onClick={() => handleFilterClick(filter.name)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
                  activeFilter === filter.name
                    ? 'text-zinc-950 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                )}
              >
                <filter.icon size={16} />
                {filter.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Collapsed Filter Icons */}
        {isCollapsed && (
          <div className="flex flex-col items-center space-y-4 py-4">
            {filters.map((filter) => (
              <Tooltip.Provider key={filter.name}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => handleFilterClick(filter.name)}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                        activeFilter === filter.name
                          ? 'text-zinc-950 dark:text-white'
                          : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                      )}
                    >
                      <filter.icon size={16} />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="rounded-md bg-zinc-950 px-2 py-1 text-xs text-white dark:bg-white dark:text-zinc-950"
                      side="right"
                      sideOffset={5}
                    >
                      {filter.name}
                      <Tooltip.Arrow className="fill-current" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            ))}
          </div>
        )}
      </nav>

      {/* Links */}
      <div className="mb-8">
        <motion.div
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          className={cn('space-y-4', isCollapsed && 'hidden')}
        >
          <h2 className="px-2 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
            Links
          </h2>
          <div className="space-y-1">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              >
                <link.icon size={16} />
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Collapsed Link Icons */}
        {isCollapsed && (
          <div className="flex flex-col items-center space-y-4">
            {links.map((link) => (
              <Tooltip.Provider key={link.name}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                    >
                      <link.icon size={16} />
                    </a>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="rounded-md bg-zinc-950 px-2 py-1 text-xs text-white dark:bg-white dark:text-zinc-950"
                      side="right"
                      sideOffset={5}
                    >
                      {link.name}
                      <Tooltip.Arrow className="fill-current" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            ))}
          </div>
        )}

        {/* Theme Toggle */}
        <div className="mt-4 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </motion.aside>
  )
} 