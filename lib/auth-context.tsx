"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import type { User, Role } from "@/lib/data"
import { SEED_USERS } from "@/lib/data"

// ────────────────────────────────────────────────
// Auth Context
// ────────────────────────────────────────────────

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  register: (data: {
    email: string
    password: string
    fullName: string
    role: Role
    phone?: string
    state?: string
    district?: string
    village?: string
  }) => { success: boolean; error?: string }
  users: User[]
  approveWorker: (userId: string) => void
  rejectWorker: (userId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(SEED_USERS)
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback(
    (email: string, password: string) => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )
      if (!found) {
        return { success: false, error: "Invalid email or password" }
      }
      if (!found.isActive) {
        return { success: false, error: "Account is deactivated" }
      }
      if (found.role === "health_worker" && found.workerStatus === "pending") {
        return { success: false, error: "Your account is pending admin approval" }
      }
      if (found.role === "health_worker" && found.workerStatus === "rejected") {
        return { success: false, error: "Your registration request was rejected" }
      }
      setUser(found)
      return { success: true }
    },
    [users]
  )

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const register = useCallback(
    (data: {
      email: string
      password: string
      fullName: string
      role: Role
      phone?: string
      state?: string
      district?: string
      village?: string
    }) => {
      const exists = users.find(
        (u) => u.email.toLowerCase() === data.email.toLowerCase()
      )
      if (exists) {
        return { success: false, error: "Email already registered" }
      }
      const newUser: User = {
        id: `usr-${Date.now()}`,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: data.role,
        phone: data.phone,
        state: data.state,
        district: data.district,
        village: data.village,
        createdAt: new Date().toISOString(),
        isActive: true,
        workerStatus: data.role === "health_worker" ? "pending" : undefined,
      }
      setUsers((prev) => [...prev, newUser])
      if (data.role === "community_member") {
        setUser(newUser)
      }
      return { success: true }
    },
    [users]
  )

  const approveWorker = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, workerStatus: "approved" as const } : u
      )
    )
  }, [])

  const rejectWorker = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, workerStatus: "rejected" as const } : u
      )
    )
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        users,
        approveWorker,
        rejectWorker,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
