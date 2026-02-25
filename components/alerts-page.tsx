"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STATES, DISTRICTS, getRiskBgClass } from "@/lib/data"
import type { Alert, RiskCategory } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { Bell, AlertTriangle, Plus } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(SEED_ALERTS)
  const [open, setOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [newSeverity, setNewSeverity] = useState<RiskCategory>("Yellow")
  const [newState, setNewState] = useState("")
  const [newDistrict, setNewDistrict] = useState("")

  const handleCreate = () => {
    if (!newTitle || !newMessage) return
    const alert: Alert = {
      id: `alt-${Date.now()}`,
      title: newTitle,
      message: newMessage,
      severity: newSeverity,
      districtId: newDistrict,
      stateId: newState,
      createdAt: new Date().toISOString(),
      isAutoBroadcast: false,
      createdBy: "usr-admin-001",
    }
    setAlerts(prev => [alert, ...prev])
    setOpen(false)
    setNewTitle("")
    setNewMessage("")
  }

  const filteredDistricts = DISTRICTS.filter(d => d.stateId === newState)

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Alerts & Broadcasts</h1>
          <p className="text-sm text-muted-foreground">System-generated and manual health alerts</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-[#2E7D32]">
              <Plus className="mr-2 h-4 w-4" /> Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle className="font-serif text-card-foreground">Create New Alert</DialogTitle>
              <DialogDescription>Broadcast a health alert to selected area</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Title</Label>
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Alert title" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Message</Label>
                <Textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Detailed alert message" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Severity</Label>
                <Select value={newSeverity} onValueChange={v => setNewSeverity(v as RiskCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Green">Green</SelectItem>
                    <SelectItem value="Yellow">Yellow</SelectItem>
                    <SelectItem value="Orange">Orange</SelectItem>
                    <SelectItem value="Red">Red (Critical)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>State</Label>
                <Select value={newState} onValueChange={v => { setNewState(v); setNewDistrict("") }}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {STATES.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {newState && (
                <div className="flex flex-col gap-2">
                  <Label>District</Label>
                  <Select value={newDistrict} onValueChange={setNewDistrict}>
                    <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                    <SelectContent>
                      {filteredDistricts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-[#2E7D32]">
                Broadcast Alert
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4">
        {alerts.map((alert) => {
          const state = STATES.find(s => s.id === alert.stateId)
          const district = DISTRICTS.find(d => d.id === alert.districtId)
          return (
            <Card key={alert.id} className="border-border bg-card">
              <CardContent className="flex items-start gap-4 p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  alert.severity === "Red" ? "bg-risk-red" : alert.severity === "Orange" ? "bg-risk-orange" : alert.severity === "Yellow" ? "bg-risk-yellow" : "bg-risk-green"
                }`}>
                  {alert.severity === "Red" ? (
                    <AlertTriangle className="h-5 w-5 text-[#ffffff]" />
                  ) : (
                    <Bell className={`h-5 w-5 ${alert.severity === "Yellow" ? "text-[#1a2e1a]" : "text-[#ffffff]"}`} />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-card-foreground">{alert.title}</span>
                    <Badge className={getRiskBgClass(alert.severity)}>{alert.severity}</Badge>
                    {alert.isAutoBroadcast && <Badge variant="outline" className="text-xs">Auto-generated</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>{state?.name} - {district?.name}</span>
                    <span>{new Date(alert.createdAt).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
