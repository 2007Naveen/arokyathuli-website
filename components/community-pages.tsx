"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STATES, DISTRICTS } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { FileText, Send, Search } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type { Report } from "@/lib/data"

const statusColors: Record<string, string> = {
  submitted: "bg-[#4FC3F7] text-[#01579B]",
  in_review: "bg-risk-yellow text-[#1a2e1a]",
  resolved: "bg-risk-green text-[#ffffff]",
  rejected: "bg-risk-red text-[#ffffff]",
}

export function SubmitReportPage() {
  const { user, setReports } = useAuth()
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"water_issue" | "symptoms">("water_issue")
  const [state, setState] = useState("")
  const [district, setDistrict] = useState("")
  const [village, setVillage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description) return
    const refId = `RPT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`
    const stateName = STATES.find(s => s.id === state)?.name || ""
    const districtName = DISTRICTS.find(d => d.id === district)?.name || ""
    const newReport: Report = {
      id: `rpt-${Date.now()}`,
      referenceId: refId,
      userId: user?.id || "",
      type,
      description,
      status: "submitted",
      village: village || undefined,
      district: districtName || undefined,
      state: stateName || undefined,
      createdAt: new Date().toISOString(),
    }
    setReports(prev => [...prev, newReport])
    toast.success(`Report submitted! Reference ID: ${refId}`)
    setDescription("")
    setVillage("")
  }

  const filteredDistricts = DISTRICTS.filter(d => d.stateId === state)

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Submit Report</h1>
        <p className="text-sm text-muted-foreground">Report water issues or health symptoms in your area</p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
            <Send className="h-5 w-5 text-[#1B5E20]" />
            New Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Report Type</Label>
              <Select value={type} onValueChange={v => setType(v as "water_issue" | "symptoms")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="water_issue">Water Issue</SelectItem>
                  <SelectItem value="symptoms">Health Symptoms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>State</Label>
              <Select value={state} onValueChange={v => { setState(v); setDistrict("") }}>
                <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {STATES.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {state && (
              <div className="flex flex-col gap-2">
                <Label>District</Label>
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                  <SelectContent>
                    {filteredDistricts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label>Village Name</Label>
              <Input value={village} onChange={e => setVillage(e.target.value)} placeholder="Enter village name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                rows={4}
                required
              />
            </div>
            <Button type="submit" className="w-fit bg-primary text-primary-foreground hover:bg-[#2E7D32]">
              <Send className="mr-2 h-4 w-4" /> Submit Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function MyReportsPage() {
  const { user, reports } = useAuth()
  const [searchId, setSearchId] = useState("")
  const myReports = reports.filter(r => r.userId === user?.id)

  const searchResult = searchId
    ? reports.find(r => r.referenceId.toLowerCase() === searchId.toLowerCase())
    : null

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">My Reports</h1>
        <p className="text-sm text-muted-foreground">Track your submitted reports and consultant feedback</p>
      </div>

      {/* Track by Reference ID */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
            <Search className="h-5 w-5 text-[#01579B]" />
            Track Report
          </CardTitle>
          <CardDescription>Enter your report reference ID to check status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="e.g., RPT-2025-0001"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              className="max-w-xs"
            />
          </div>
          {searchResult && (
            <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-card-foreground">{searchResult.referenceId}</span>
                <Badge className={statusColors[searchResult.status]}>{searchResult.status.replace("_", " ")}</Badge>
              </div>
              <p className="mt-2 text-sm text-card-foreground">{searchResult.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">{searchResult.village}, {searchResult.district}</p>
              {searchResult.consultantReport && (
                <div className="mt-3 rounded-lg border border-[#1B5E20]/30 bg-secondary p-3">
                  <p className="text-xs font-semibold text-[#1B5E20]">Consultant Response</p>
                  <p className="text-sm text-card-foreground">{searchResult.consultantReport}</p>
                </div>
              )}
            </div>
          )}
          {searchId && !searchResult && (
            <p className="mt-3 text-sm text-muted-foreground">No report found with that reference ID</p>
          )}
        </CardContent>
      </Card>

      {/* My Reports List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
            <FileText className="h-5 w-5 text-[#1B5E20]" />
            Your Reports ({myReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myReports.length === 0 ? (
            <p className="text-sm text-muted-foreground">You have not submitted any reports yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {myReports.map(report => (
                <div key={report.id} className="flex items-start justify-between rounded-lg border border-border p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-card-foreground">{report.referenceId}</span>
                      <Badge className={statusColors[report.status]}>{report.status.replace("_", " ")}</Badge>
                      <Badge variant="outline" className="capitalize text-xs">{report.type.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-sm text-card-foreground">{report.description}</p>
                    <p className="text-xs text-muted-foreground">{report.village}, {report.district} | {new Date(report.createdAt).toLocaleDateString("en-IN")}</p>
                    {report.consultantReport && (
                      <div className="mt-2 rounded border border-[#1B5E20]/20 bg-secondary p-2">
                        <p className="text-xs font-semibold text-[#1B5E20]">Response:</p>
                        <p className="text-xs text-card-foreground">{report.consultantReport}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function CommunityDashboard() {
  const { user, reports } = useAuth()
  const myReports = reports.filter(r => r.userId === user?.id)
  const districtId = user?.district
  const district = districtId ? DISTRICTS.find(d => d.id === districtId) : null

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Welcome, {user?.fullName}
        </h1>
        <p className="text-sm text-muted-foreground">Your community health overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">My Reports</p>
            <p className="text-2xl font-bold text-card-foreground">{myReports.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">District Risk Level</p>
            {district ? (
              <>
                <p className="text-2xl font-bold text-card-foreground">{district.riskScore}/100</p>
                <Badge className={`mt-1 ${district.riskCategory === "Red" ? "bg-risk-red text-[#ffffff]" : district.riskCategory === "Orange" ? "bg-risk-orange text-[#ffffff]" : district.riskCategory === "Yellow" ? "bg-risk-yellow text-[#1a2e1a]" : "bg-risk-green text-[#ffffff]"}`}>
                  {district.riskCategory}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No district selected</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Outbreak Probability</p>
            <p className="text-2xl font-bold text-card-foreground">{district?.outbreakProbability || 0}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-card-foreground">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {myReports.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reports submitted yet. Use &quot;Submit Report&quot; to report water issues.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {myReports.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-card-foreground">{r.referenceId}</span>
                    <p className="text-xs text-muted-foreground">{r.description.slice(0, 60)}...</p>
                  </div>
                  <Badge className={statusColors[r.status]}>{r.status.replace("_", " ")}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
