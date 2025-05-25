// components/LogoutButton.tsx
"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/adminedit"
    })
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  )
}