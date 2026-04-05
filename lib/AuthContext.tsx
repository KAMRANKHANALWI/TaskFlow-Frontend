"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "./api"
import { authStorage } from "./auth"
import type { User } from "./types"

// ── Types ─────────────────────────────────────────────
interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// ── Context ───────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null)

// ── Provider ──────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // on app load — if token exists, fetch current user
  useEffect(() => {
    async function loadUser() {
      if (authStorage.isAuthenticated()) {
        try {
          const response = await authApi.me()
          setUser(response.data)
        } catch {
          // token invalid or expired — clean up
          authStorage.removeToken()
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    const tokenResponse = await authApi.login({ username: email, password })
    authStorage.setToken(tokenResponse.data.access_token)

    const userResponse = await authApi.me()
    setUser(userResponse.data)

    router.push("/dashboard")
  }

  const logout = () => {
    authStorage.removeToken()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}