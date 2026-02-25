"use client"

import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Droplets,
  FileText,
  Bell,
  Users,
  MapPin,
  Brain,
  BarChart3,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight,
  UserCheck,
  MessageSquare,
  Download,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AppSidebarProps {
  activePage: string
  onNavigate: (page: string) => void
}

const NAV_ITEMS_ADMIN = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "water-samples", label: "Water Samples", icon: Droplets },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "map", label: "Risk Map", icon: MapPin },
  { id: "ai-prediction", label: "AI Prediction", icon: Brain },
  { id: "trends", label: "Trend Analysis", icon: BarChart3 },
  { id: "worker-approval", label: "Worker Approval", icon: UserCheck },
  { id: "users", label: "User Management", icon: Users },
  { id: "settings", label: "Risk Settings", icon: Shield },
  { id: "export", label: "Export Data", icon: Download },
]

const NAV_ITEMS_WORKER = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "water-samples", label: "Water Samples", icon: Droplets },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "map", label: "Risk Map", icon: MapPin },
  { id: "alerts", label: "Alerts", icon: Bell },
]

const NAV_ITEMS_COMMUNITY = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "my-reports", label: "My Reports", icon: FileText },
  { id: "submit-report", label: "Submit Report", icon: MessageSquare },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "map", label: "Risk Map", icon: MapPin },
]

export function AppSidebar({ activePage, onNavigate }: AppSidebarProps) {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  const navItems =
    user.role === "super_admin" || user.role === "admin"
      ? NAV_ITEMS_ADMIN
      : user.role === "health_worker"
      ? NAV_ITEMS_WORKER
      : NAV_ITEMS_COMMUNITY

  const roleLabel =
    user.role === "super_admin"
      ? "Super Admin"
      : user.role === "admin"
      ? "Admin"
      : user.role === "health_worker"
      ? "Health Worker"
      : "Community Member"

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#81C784] text-[#1B5E20]">
          <Droplets className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-bold text-sidebar-foreground">SIH25001</span>
            <span className="truncate text-xs text-[#81C784]">Health Monitor</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden text-sidebar-foreground hover:bg-sidebar-accent md:flex"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronRight className={cn("h-4 w-4 transition-transform", collapsed ? "" : "rotate-180")} />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  setMobileOpen(false)
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-sidebar-border" />

      {/* User section */}
      <div className="flex items-center gap-3 px-4 py-4">
        <Avatar className="h-8 w-8 border border-[#81C784]">
          <AvatarFallback className="bg-[#81C784] text-xs font-bold text-[#1B5E20]">{initials}</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold text-sidebar-foreground">{user.fullName}</span>
            <span className="truncate text-xs text-[#81C784]">{roleLabel}</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={logout}
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-3 top-3 z-50 bg-primary text-primary-foreground md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#000000]/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden h-screen shrink-0 transition-all duration-200 md:block",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
