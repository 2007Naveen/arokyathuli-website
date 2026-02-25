"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, Database, Users } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { SEED_WATER_SAMPLES, SEED_REPORTS, SEED_ALERTS, DISTRICTS, VILLAGES, STATES } from "@/lib/data"
import { toast } from "sonner"

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  toast.success(`${filename} downloaded`)
}

export function ExportPage() {
  const { users } = useAuth()

  const exportUsers = () => {
    downloadCSV(
      "users_export.csv",
      ["ID", "Full Name", "Email", "Role", "Phone", "State", "District", "Status", "Joined"],
      users.map(u => [u.id, u.fullName, u.email, u.role, u.phone || "", u.state || "", u.district || "", u.workerStatus || "active", u.createdAt])
    )
  }

  const exportWaterSamples = () => {
    downloadCSV(
      "water_samples_export.csv",
      ["ID", "Village", "District", "Turbidity", "pH", "Temperature", "Contamination", "Unsafe", "Date"],
      SEED_WATER_SAMPLES.map(s => {
        const v = VILLAGES.find(vl => vl.id === s.villageId)
        const d = DISTRICTS.find(dl => dl.id === s.districtId)
        return [s.id, v?.name || "", d?.name || "", String(s.turbidity), String(s.ph), String(s.temperature), String(s.contaminationLevel), String(s.isUnsafe), s.timestamp]
      })
    )
  }

  const exportReports = () => {
    downloadCSV(
      "reports_export.csv",
      ["Reference ID", "Type", "Village", "District", "State", "Status", "Description", "Date"],
      SEED_REPORTS.map(r => [r.referenceId, r.type, r.village || "", r.district || "", r.state || "", r.status, `"${r.description}"`, r.createdAt])
    )
  }

  const exportAlerts = () => {
    downloadCSV(
      "alerts_export.csv",
      ["ID", "Title", "Severity", "District", "Auto-Broadcast", "Date", "Message"],
      SEED_ALERTS.map(a => {
        const d = DISTRICTS.find(dl => dl.id === a.districtId)
        return [a.id, a.title, a.severity, d?.name || "", String(a.isAutoBroadcast), a.createdAt, `"${a.message}"`]
      })
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Data Export</h1>
        <p className="text-sm text-muted-foreground">Download CSV files and database backups</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
              <Users className="h-5 w-5 text-[#01579B]" />
              Users CSV
            </CardTitle>
            <CardDescription>Export all registered user data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">{users.length} users will be exported</p>
            <Button onClick={exportUsers} className="bg-primary text-primary-foreground hover:bg-[#2E7D32]">
              <Download className="mr-2 h-4 w-4" /> Download Users CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
              <FileSpreadsheet className="h-5 w-5 text-[#4FC3F7]" />
              Water Samples CSV
            </CardTitle>
            <CardDescription>Export all water quality test data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">{SEED_WATER_SAMPLES.length} samples will be exported</p>
            <Button onClick={exportWaterSamples} className="bg-primary text-primary-foreground hover:bg-[#2E7D32]">
              <Download className="mr-2 h-4 w-4" /> Download Samples CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
              <FileSpreadsheet className="h-5 w-5 text-[#FF9800]" />
              Reports CSV
            </CardTitle>
            <CardDescription>Export all community reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">{SEED_REPORTS.length} reports will be exported</p>
            <Button onClick={exportReports} className="bg-primary text-primary-foreground hover:bg-[#2E7D32]">
              <Download className="mr-2 h-4 w-4" /> Download Reports CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
              <Database className="h-5 w-5 text-[#F44336]" />
              Alerts CSV
            </CardTitle>
            <CardDescription>Export all system alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">{SEED_ALERTS.length} alerts will be exported</p>
            <Button onClick={exportAlerts} className="bg-primary text-primary-foreground hover:bg-[#2E7D32]">
              <Download className="mr-2 h-4 w-4" /> Download Alerts CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
