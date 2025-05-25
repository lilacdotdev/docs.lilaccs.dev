import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Sidebar } from "@/components/sidebar"
import { LoadingSpinner } from "@/components/loading-spinner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LilacCS - Devlogs",
  description: "Documentation and blog for lilaccs projects",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen">
            <Suspense fallback={<div className="w-64 bg-background/50" />}>
              <Sidebar />
            </Suspense>
            <main className="flex-1">
              <Suspense fallback={<LoadingSpinner />}>
                {children}
              </Suspense>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}