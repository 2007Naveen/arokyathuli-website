"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WEEKLY_TREND_DATA, SEED_RAINFALL, DISTRICTS, STATES } from "@/lib/data"
import { BarChart3, TrendingUp, CloudRain } from "lucide-react"
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
} from "recharts"

export function TrendsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Trend Analysis</h1>
        <p className="text-sm text-muted-foreground">Historical patterns and seasonal analysis of health indicators</p>
      </div>

      {/* Weekly Contamination vs Symptoms */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
            <BarChart3 className="h-5 w-5 text-[#01579B]" />
            Weekly Contamination vs Symptom Reports
          </CardTitle>
          <CardDescription>6-week rolling analysis showing correlation between water quality and health outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={WEEKLY_TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c8e6c9" />
              <XAxis dataKey="week" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend />
              <Bar dataKey="contamination" name="Contamination %" fill="#F44336" radius={[4, 4, 0, 0]} />
              <Bar dataKey="symptoms" name="Symptom Reports" fill="#FF9800" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rainfall Trend */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
            <CloudRain className="h-5 w-5 text-[#4FC3F7]" />
            Rainfall & Monsoon Risk Index
          </CardTitle>
          <CardDescription>Monthly rainfall patterns and their contribution to disease risk</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={WEEKLY_TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c8e6c9" />
              <XAxis dataKey="week" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#4FC3F7" strokeWidth={2} />
              <Line type="monotone" dataKey="contamination" name="Contamination %" stroke="#F44336" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rainfall data table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
            <TrendingUp className="h-5 w-5 text-[#1B5E20]" />
            District Rainfall Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {SEED_RAINFALL.map(r => {
              const district = DISTRICTS.find(d => d.id === r.districtId)
              const state = STATES.find(s => s.id === r.stateId)
              return (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{district?.name}</p>
                    <p className="text-xs text-muted-foreground">{state?.name} | {r.month}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-card-foreground">{r.rainfallMm}mm</p>
                    <Badge variant="outline" className="text-xs">
                      Risk: {r.monsoonRiskIndex}%
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
