"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Shield, Save, Info } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function SettingsPage() {
  const [turbidityThreshold, setTurbidityThreshold] = useState(10)
  const [phMin, setPhMin] = useState(6.5)
  const [phMax, setPhMax] = useState(8.5)
  const [riskAutoAlert, setRiskAutoAlert] = useState(70)
  const [outbreakAutoAlert, setOutbreakAutoAlert] = useState(65)
  const [criticalBroadcast, setCriticalBroadcast] = useState(85)
  const [symptomSpikeThreshold, setSymptomSpikeThreshold] = useState(30)

  const handleSave = () => {
    toast.success("Risk thresholds updated successfully")
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Risk Configuration</h1>
        <p className="text-sm text-muted-foreground">Configure alert thresholds and WHO compliance limits</p>
      </div>

      {/* Water Quality Thresholds */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
            <Shield className="h-5 w-5 text-[#01579B]" />
            Water Quality Thresholds (WHO Standards)
          </CardTitle>
          <CardDescription>Samples exceeding these limits are flagged as unsafe</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label>Max Turbidity (NTU)</Label>
              <Input
                type="number"
                value={turbidityThreshold}
                onChange={e => setTurbidityThreshold(Number(e.target.value))}
                step={0.5}
              />
              <p className="text-xs text-muted-foreground">WHO limit: 5 NTU</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>pH Minimum</Label>
              <Input
                type="number"
                value={phMin}
                onChange={e => setPhMin(Number(e.target.value))}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground">WHO range: 6.5-8.5</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>pH Maximum</Label>
              <Input
                type="number"
                value={phMax}
                onChange={e => setPhMax(Number(e.target.value))}
                step={0.1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Thresholds */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-card-foreground">Auto-Alert Thresholds</CardTitle>
          <CardDescription>System will auto-generate alerts when these thresholds are exceeded</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Risk Score Auto-Alert</Label>
              <span className="text-sm font-bold text-risk-orange">{riskAutoAlert}</span>
            </div>
            <Slider value={[riskAutoAlert]} onValueChange={([v]) => setRiskAutoAlert(v)} max={100} step={5} />
            <p className="text-xs text-muted-foreground">
              <Info className="mr-1 inline h-3 w-3" />
              Alert generated when district risk score exceeds {riskAutoAlert}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Outbreak Probability Auto-Alert</Label>
              <span className="text-sm font-bold text-risk-orange">{outbreakAutoAlert}%</span>
            </div>
            <Slider value={[outbreakAutoAlert]} onValueChange={([v]) => setOutbreakAutoAlert(v)} max={100} step={5} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Critical Auto-Broadcast Threshold</Label>
              <span className="text-sm font-bold text-risk-red">{criticalBroadcast}</span>
            </div>
            <Slider value={[criticalBroadcast]} onValueChange={([v]) => setCriticalBroadcast(v)} max={100} step={5} />
            <p className="text-xs text-muted-foreground">
              <Info className="mr-1 inline h-3 w-3" />
              Auto-broadcast critical alert when risk exceeds {criticalBroadcast}. Admin can override.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Symptom Spike Threshold (%)</Label>
              <span className="text-sm font-bold text-risk-yellow">{symptomSpikeThreshold}%</span>
            </div>
            <Slider value={[symptomSpikeThreshold]} onValueChange={([v]) => setSymptomSpikeThreshold(v)} max={100} step={5} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-fit bg-primary text-primary-foreground hover:bg-[#2E7D32]">
        <Save className="mr-2 h-4 w-4" /> Save Configuration
      </Button>
    </div>
  )
}
