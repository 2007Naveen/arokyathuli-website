"use client"

import { AuthProvider, useAuth } from "@/lib/auth-context"
import { LoginPage } from "@/components/login-page"
import { AppSidebar } from "@/components/app-sidebar"
import { AdminDashboard } from "@/components/admin-dashboard"
import { WaterSamplesPage } from "@/components/water-samples-page"
import { ReportsPage } from "@/components/reports-page"
import { AlertsPage } from "@/components/alerts-page"
import { MapPage } from "@/components/map-page"
import { AIPredictionPage } from "@/components/ai-prediction-page"
import { TrendsPage } from "@/components/trends-page"
import { WorkerApprovalPage } from "@/components/worker-approval-page"
import { UsersPage } from "@/components/users-page"
import { SettingsPage } from "@/components/settings-page"
import { ExportPage } from "@/components/export-page"
import {
  SubmitReportPage,
  MyReportsPage,
  CommunityDashboard,
} from "@/components/community-pages"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { useState } from "react"

function AppContent() {
  const { isAuthenticated, user } = useAuth()
  const [activePage, setActivePage] = useState("dashboard")

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const renderPage = () => {
    // Community member pages
    if (user?.role === "community_member") {
      switch (activePage) {
        case "dashboard":
          return <CommunityDashboard />
        case "my-reports":
          return <MyReportsPage />
        case "submit-report":
          return <SubmitReportPage />
        case "alerts":
          return <AlertsPage />
        case "map":
          return <MapPage />
        default:
          return <CommunityDashboard />
      }
    }

    // Health worker pages
    if (user?.role === "health_worker") {
      switch (activePage) {
        case "dashboard":
          return <AdminDashboard />
        case "water-samples":
          return <WaterSamplesPage />
        case "reports":
          return <ReportsPage />
        case "map":
          return <MapPage />
        case "alerts":
          return <AlertsPage />
        default:
          return <AdminDashboard />
      }
    }

    // Admin / Super Admin pages
    switch (activePage) {
      case "dashboard":
        return <AdminDashboard />
      case "water-samples":
        return <WaterSamplesPage />
      case "reports":
        return <ReportsPage />
      case "alerts":
        return <AlertsPage />
      case "map":
        return <MapPage />
      case "ai-prediction":
        return <AIPredictionPage />
      case "trends":
        return <TrendsPage />
      case "worker-approval":
        return <WorkerApprovalPage />
      case "users":
        return <UsersPage />
      case "settings":
        return <SettingsPage />
      case "export":
        return <ExportPage />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
      <ChatbotWidget />
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
