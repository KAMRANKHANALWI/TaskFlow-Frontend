"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "./api"
import { authStorage } from "./auth"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      // no token at all — done immediately, no API call needed
      if (!authStorage.isAuthenticated()) {
        setLoading(false)
        return
      }

      // token exists — fetch user to validate it
      try {
        const response = await authApi.me()
        setUser(response.data)
      } catch {
        // token invalid or expired
        authStorage.removeToken()
      } finally {
        setLoading(false)
      }
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}