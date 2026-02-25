"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import type { User, Role, PointActivity, PointAction, Report, WaterSample, Alert, Village } from "@/lib/data"
import { SEED_USERS, SEED_POINT_ACTIVITIES, POINT_VALUES, SEED_REPORTS, SEED_WATER_SAMPLES, SEED_ALERTS, VILLAGES } from "@/lib/data"

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
  deleteUser: (userId: string) => { success: boolean; error?: string }
  awardPoints: (userId: string, action: PointAction, description: string) => void
  pointActivities: PointActivity[]
  // Shared data state
  reports: Report[]
  setReports: React.Dispatch<React.SetStateAction<Report[]>>
  waterSamples: WaterSample[]
  setWaterSamples: React.Dispatch<React.SetStateAction<WaterSample[]>>
  alerts: Alert[]
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>
  villages: Village[]
  setVillages: React.Dispatch<React.SetStateAction<Village[]>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(SEED_USERS)
  const [user, setUser] = useState<User | null>(null)
  const [pointActivities, setPointActivities] = useState<PointActivity[]>(SEED_POINT_ACTIVITIES)
  const [reports, setReports] = useState<Report[]>(SEED_REPORTS)
  const [waterSamples, setWaterSamples] = useState<WaterSample[]>(SEED_WATER_SAMPLES)
  const [alerts, setAlerts] = useState<Alert[]>(SEED_ALERTS)
  const [villages, setVillages] = useState<Village[]>(VILLAGES)

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

  const deleteUser = useCallback(
    (userId: string) => {
      const target = users.find((u) => u.id === userId)
      if (!target) return { success: false, error: "User not found" }
      if (target.id === "usr-admin-001") {
        return { success: false, error: "Cannot delete the primary Super Admin" }
      }
      if (user?.id === userId) {
        return { success: false, error: "Cannot delete your own account" }
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setPointActivities((prev) => prev.filter((pa) => pa.userId !== userId))
      return { success: true }
    },
    [users, user]
  )

  const awardPoints = useCallback(
    (userId: string, action: PointAction, description: string) => {
      const pts = POINT_VALUES[action].points
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, points: (u.points || 0) + pts } : u
        )
      )
      const newActivity: PointActivity = {
        id: `pa-${Date.now()}`,
        userId,
        action,
        points: pts,
        description,
        timestamp: new Date().toISOString(),
      }
      setPointActivities((prev) => [...prev, newActivity])
    },
    []
  )

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
        deleteUser,
        awardPoints,
        pointActivities,
        reports,
        setReports,
        waterSamples,
        setWaterSamples,
        alerts,
        setAlerts,
        villages,
        setVillages,
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
