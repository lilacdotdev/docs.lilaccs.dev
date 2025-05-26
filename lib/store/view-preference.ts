import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ViewMode = 'card' | 'list'

interface ViewPreferenceState {
  viewMode: ViewMode
  toggleViewMode: () => void
  setViewMode: (mode: ViewMode) => void
}

export const useViewPreferenceStore = create<ViewPreferenceState>()(
  persist(
    (set) => ({
      viewMode: 'card',
      toggleViewMode: () =>
        set((state) => ({
          viewMode: state.viewMode === 'card' ? 'list' : 'card',
        })),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'view-preference-storage',
    }
  )
) 