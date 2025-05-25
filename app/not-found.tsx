"use client"

import { useRouter } from "next/navigation"
import { Flower2, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Flower2 className="pb-4 w-24 h-24 text-foreground animate-pulse" />
      <div className="text-center space-y-6">
        
        <div className="space-y-2">
          <span className="text-4xl font-bold">404</span>
          <h1 className="text-2xl font-bold">Lilac Not Found :(</h1>
          <p className="text-foreground/60">The flower you're looking for seems to have wilted away...</p>
        </div>

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-foreground/5 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to garden
        </button>
      </div>
    </div>
  )
} 