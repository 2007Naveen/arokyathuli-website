"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  STATES,
  DISTRICTS,
  FORECAST_DATA,
  WEEKLY_TREND_DATA,
  getRiskBgClass,
} from "@/lib/data"
import type { RiskCategory } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { useState, useMemo } from "react"
import {
  Users,
  Droplets,
  AlertTriangle,
  FileText,
  TrendingUp,
  Activity,
  MapPin,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const PIE_COLORS = ["#4CAF50", "#FFC107", "#FF9800", "#F44336"]

export function AdminDashboard() {
  const { users, reports, waterSamples, alerts, villages } = useAuth()
  const [selectedState, setSelectedState] = useState("all")

  const filteredDistricts = useMemo(() => {
    if (selectedState === "all") return DISTRICTS
    return DISTRICTS.filter((d) => d.stateId === selectedState)
  }, [selectedState])

  const filteredAlerts = useMemo(() => {
    if (selectedState === "all") return alerts
    return alerts.filter((a) => a.stateId === selectedState)
  }, [selectedState, alerts])

  const filteredSamples = useMemo(() => {
    if (selectedState === "all") return waterSamples
    return waterSamples.filter((s) => s.stateId === selectedState)
  }, [selectedState, waterSamples])

  const riskDistribution = useMemo(() => {
    const counts = { Green: 0, Yellow: 0, Orange: 0, Red: 0 }
    filteredDistricts.forEach((d) => {
      counts[d.riskCategory]++
    })
    return [
      { name: "Green (Safe)", value: counts.Green },
      { name: "Yellow (Low)", value: counts.Yellow },
      { name: "Orange (Medium)", value: counts.Orange },
      { name: "Red (High)", value: counts.Red },
    ]
  }, [filteredDistricts])

  const topRiskDistricts = useMemo(() => {
    return [...filteredDistricts]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
  }, [filteredDistricts])

  const unsafeSamples = filteredSamples.filter((s) => s.isUnsafe).length
  const totalUsers = users.length
  const criticalAlerts = filteredAlerts.filter((a) => a.severity === "Red").length
  const pendingReports = reports.filter((r) => r.status === "submitted").length
  const totalVillages = villages.length
  const totalReports = reports.length

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Smart Community Health Monitoring - Real-time Overview
          </p>
        </div>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Filter by State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {STATES.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Total Users"
          value={totalUsers}
          color="bg-[#01579B]"
        />
        <StatCard
          icon={<Droplets className="h-5 w-5" />}
          label="Unsafe Samples"
          value={unsafeSamples}
          color="bg-[#FF9800]"
          subtitle={`of ${filteredSamples.length} total`}
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Critical Alerts"
          value={criticalAlerts}
          color="bg-[#F44336]"
        />
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Total Reports"
          value={totalReports}
          color="bg-[#1B5E20]"
          subtitle={`${pendingReports} pending`}
        />
        <StatCard
          icon={<MapPin className="h-5 w-5" />}
          label="Villages"
          value={totalVillages}
          color="bg-[#6A1B9A]"
        />
        <StatCard
          icon={<Activity className="h-5 w-5" />}
          label="Districts"
          value={filteredDistricts.length}
          color="bg-[#00695C]"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* 14-day Forecast */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
              <TrendingUp className="h-4 w-4 text-[#01579B]" />
              14-Day Outbreak Forecast
            </CardTitle>
            <CardDescription>Predicted risk score and outbreak probability</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={FORECAST_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c8e6c9" />
                <XAxis dataKey="day" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="riskScore" name="Risk Score" stroke="#F44336" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="outbreakProb" name="Outbreak %" stroke="#FF9800" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rainfall" name="Rainfall mm" stroke="#4FC3F7" strokeWidth={1} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution Pie */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
              <Activity className="h-4 w-4 text-[#1B5E20]" />
              District Risk Distribution
            </CardTitle>
            <CardDescription>Current risk level across {filteredDistricts.length} districts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine
                  fontSize={11}
                >
                  {riskDistribution.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Weekly Trend */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-lg text-card-foreground">Weekly Trend Analysis</CardTitle>
            <CardDescription>Contamination, symptoms, and rainfall over 6 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={WEEKLY_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c8e6c9" />
                <XAxis dataKey="week" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="contamination" name="Contamination" fill="#F44336" radius={[4, 4, 0, 0]} />
                <Bar dataKey="symptoms" name="Symptoms" fill="#FF9800" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rainfall" name="Rainfall" fill="#4FC3F7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Risk Districts Table */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-lg text-card-foreground">Top Risk Districts</CardTitle>
            <CardDescription>Highest risk areas requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {topRiskDistricts.map((d) => {
                const state = STATES.find((s) => s.id === d.stateId)
                return (
                  <div key={d.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-card-foreground">{d.name}</span>
                      <span className="text-xs text-muted-foreground">{state?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-card-foreground">{d.riskScore}</p>
                        <p className="text-xs text-muted-foreground">{d.outbreakProbability}% outbreak</p>
                      </div>
                      <Badge className={getRiskBgClass(d.riskCategory as RiskCategory)}>
                        {d.riskCategory}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-lg text-card-foreground">Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {filteredAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <AlertTriangle className={`h-5 w-5 shrink-0 ${alert.severity === "Red" ? "text-risk-red" : alert.severity === "Orange" ? "text-risk-orange" : "text-risk-yellow"}`} />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-card-foreground">{alert.title}</span>
                    <Badge className={getRiskBgClass(alert.severity)} variant="secondary">
                      {alert.severity}
                    </Badge>
                    {alert.isAutoBroadcast && (
                      <Badge variant="outline" className="text-xs">Auto</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
  subtitle,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
  subtitle?: string
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${color} text-[#ffffff]`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
