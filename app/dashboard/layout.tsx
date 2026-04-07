"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}