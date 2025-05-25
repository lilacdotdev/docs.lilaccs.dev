"use client"

import { useEffect } from "react"
import { ServerCrash, RotateCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <ServerCrash className="w-24 h-24 text-foreground animate-[spin_3s_ease-in-out_infinite]" />
      <div className="text-center space-y-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold">500</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Server Who?</h1>
          <p className="text-foreground/60">The server is having an existential crisis...</p>
        </div>

        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-foreground/5 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Come Back Later
        </button>
    </div>
  )
} 