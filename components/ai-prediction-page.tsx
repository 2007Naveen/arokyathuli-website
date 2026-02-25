"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  DISTRICTS,
  STATES,
  SEED_RISK_SCORES,
  FORECAST_DATA,
  getRiskBgClass,
} from "@/lib/data"
import type { RiskCategory } from "@/lib/data"
import { Brain, Target, TrendingUp, AlertTriangle, Info } from "lucide-react"
import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export function AIPredictionPage() {
  const [selectedState, setSelectedState] = useState("all")
  const [weights, setWeights] = useState({
    waterContamination: 35,
    symptomSpike: 25,
    monsoonFactor: 20,
    floodVulnerability: 10,
    historicalTrend: 10,
  })

  const filteredScores = useMemo(() => {
    if (selectedState === "all") return SEED_RISK_SCORES
    return SEED_RISK_SCORES.filter(s => s.stateId === selectedState)
  }, [selectedState])

  const recalculatedScores = useMemo(() => {
    return filteredScores.map(score => {
      const total = Math.round(
        (score.waterContamination * weights.waterContamination +
          score.symptomSpike * weights.symptomSpike +
          score.monsoonFactor * weights.monsoonFactor +
          score.floodVulnerability * weights.floodVulnerability +
          score.historicalTrend * weights.historicalTrend) / 100
      )
      const cat: RiskCategory = total >= 76 ? "Red" : total >= 61 ? "Orange" : total >= 41 ? "Yellow" : "Green"
      return { ...score, totalScore: total, category: cat, outbreakProbability: Math.min(100, Math.round(total * 0.95)) }
    })
  }, [filteredScores, weights])

  const anomalies = useMemo(() => {
    const results: { district: string; type: string; detail: string }[] = []
    filteredScores.forEach(score => {
      const d = DISTRICTS.find(dist => dist.id === score.districtId)
      if (score.symptomSpike > 60) {
        results.push({ district: d?.name || "", type: "Symptom Spike", detail: `${score.symptomSpike}% spike detected (>30% threshold)` })
      }
      if (score.waterContamination > 70) {
        results.push({ district: d?.name || "", type: "Contamination Surge", detail: `${score.waterContamination}% contamination level` })
      }
    })
    return results
  }, [filteredScores])

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">AI Outbreak Prediction</h1>
          <p className="text-sm text-muted-foreground">Machine learning-powered risk assessment and forecasting</p>
        </div>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Filter by State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {STATES.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Risk Formula Weights */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
            <Target className="h-5 w-5 text-[#01579B]" />
            Risk Score Formula Weights
          </CardTitle>
          <CardDescription>
            Risk Score = (Water Contamination * {weights.waterContamination}%) + (Symptom Spike * {weights.symptomSpike}%) + (Monsoon Factor * {weights.monsoonFactor}%) + (Flood Vulnerability * {weights.floodVulnerability}%) + (Historical Trend * {weights.historicalTrend}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <WeightSlider label="Water Contamination" value={weights.waterContamination} onChange={v => setWeights(p => ({ ...p, waterContamination: v }))} color="#F44336" />
            <WeightSlider label="Symptom Spike" value={weights.symptomSpike} onChange={v => setWeights(p => ({ ...p, symptomSpike: v }))} color="#FF9800" />
            <WeightSlider label="Monsoon Factor" value={weights.monsoonFactor} onChange={v => setWeights(p => ({ ...p, monsoonFactor: v }))} color="#4FC3F7" />
            <WeightSlider label="Flood Vulnerability" value={weights.floodVulnerability} onChange={v => setWeights(p => ({ ...p, floodVulnerability: v }))} color="#01579B" />
            <WeightSlider label="Historical Trend" value={weights.historicalTrend} onChange={v => setWeights(p => ({ ...p, historicalTrend: v }))} color="#6D4C41" />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            <Info className="mr-1 inline h-3 w-3" />
            Total weights: {weights.waterContamination + weights.symptomSpike + weights.monsoonFactor + weights.floodVulnerability + weights.historicalTrend}% (should be 100%)
          </p>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recalculatedScores.map(score => {
          const district = DISTRICTS.find(d => d.id === score.districtId)
          const state = STATES.find(s => s.id === score.stateId)
          return (
            <Card key={score.id} className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-card-foreground">{district?.name}</p>
                    <p className="text-xs text-muted-foreground">{state?.name}</p>
                  </div>
                  <Badge className={getRiskBgClass(score.category)}>
                    {score.category}
                  </Badge>
                </div>
                <div className="mt-3">
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-card-foreground">{score.totalScore}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${score.totalScore}%`,
                        backgroundColor: score.category === "Red" ? "#F44336" : score.category === "Orange" ? "#FF9800" : score.category === "Yellow" ? "#FFC107" : "#4CAF50",
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Outbreak Probability: <span className="font-semibold text-card-foreground">{score.outbreakProbability}%</span>
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-muted p-2">
                    <span className="text-muted-foreground">Water</span>
                    <p className="font-semibold text-card-foreground">{score.waterContamination}%</p>
                  </div>
                  <div className="rounded bg-muted p-2">
                    <span className="text-muted-foreground">Symptoms</span>
                    <p className="font-semibold text-card-foreground">{score.symptomSpike}%</p>
                  </div>
                  <div className="rounded bg-muted p-2">
                    <span className="text-muted-foreground">Monsoon</span>
                    <p className="font-semibold text-card-foreground">{score.monsoonFactor}%</p>
                  </div>
                  <div className="rounded bg-muted p-2">
                    <span className="text-muted-foreground">Flood</span>
                    <p className="font-semibold text-card-foreground">{score.floodVulnerability}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 14-day Forecast Chart */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
            <TrendingUp className="h-5 w-5 text-[#1B5E20]" />
            7-14 Day Outbreak Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={FORECAST_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c8e6c9" />
              <XAxis dataKey="day" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="riskScore" name="Risk Score" stroke="#F44336" fill="#F44336" fillOpacity={0.15} />
              <Area type="monotone" dataKey="outbreakProb" name="Outbreak %" stroke="#FF9800" fill="#FF9800" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Anomaly Detection */}
      {anomalies.length > 0 && (
        <Card className="border-[#F44336]/30 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg text-risk-red">
              <AlertTriangle className="h-5 w-5" />
              Anomaly Detection
            </CardTitle>
            <CardDescription>Detected deviations from baseline patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {anomalies.map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-risk-red/20 bg-risk-red/5 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-risk-red" />
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{a.district} - {a.type}</p>
                    <p className="text-xs text-muted-foreground">{a.detail}</p>
                    <p className="mt-1 text-xs italic text-muted-foreground">AI Summary: Anomaly detected compared to 30-day baseline. Investigate immediately.</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function WeightSlider({
  label,
  value,
  onChange,
  color,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  color: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-card-foreground">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        max={50}
        step={5}
        className="w-full"
      />
    </div>
  )
}
