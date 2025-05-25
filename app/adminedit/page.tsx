"use client"

import { useState } from "react"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminEditPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success)
  }

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated ? <AdminDashboard /> : <AdminLogin onLogin={handleLogin} />}
    </div>
  )
}
