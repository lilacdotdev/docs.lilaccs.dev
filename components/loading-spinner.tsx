"use client"

import { Loader2 } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-foreground/60" />
      <p className="mt-4 text-sm text-foreground/60">Loading...</p>
    </div>
  )
} 