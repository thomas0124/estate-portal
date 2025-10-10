"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  resetUserPassword: (userId: string, newPassword: string) => Promise<void>
  isAdmin: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for development
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    name: "管理者",
    role: "admin",
    color: "#6366f1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "user@example.com",
    password: "user123",
    name: "田中太郎",
    role: "user",
    color: "#10b981",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock authentication
    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (!foundUser) {
      throw new Error("メールアドレスまたはパスワードが正しくありません")
    }

    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const resetUserPassword = async (userId: string, newPassword: string) => {
    if (user?.role !== "admin") {
      throw new Error("管理者権限が必要です")
    }

    // Mock password reset
    console.log(`[v0] Password reset for user ${userId}`)
    // In real implementation, this would call an API
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        resetUserPassword,
        isAdmin: user?.role === "admin",
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
