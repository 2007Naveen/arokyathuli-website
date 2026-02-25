"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VILLAGES, DISTRICTS, STATES, SEED_WATER_SAMPLES, getRiskBgClass } from "@/lib/data"
import type { RiskCategory } from "@/lib/data"
import { MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useMemo } from "react"

export function MapPage() {
  const [selectedState, setSelectedState] = useState("all")

  const filteredVillages = useMemo(() => {
    if (selectedState === "all") return VILLAGES
    return VILLAGES.filter(v => v.stateId === selectedState)
  }, [selectedState])

  const filteredDistricts = useMemo(() => {
    if (selectedState === "all") return DISTRICTS
    return DISTRICTS.filter(d => d.stateId === selectedState)
  }, [selectedState])

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Risk Map</h1>
          <p className="text-sm text-muted-foreground">Geographical view of health risk across regions</p>
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

      {/* Map Visualization (Satellite-style placeholder with real data points) */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-card-foreground">Interactive Risk Map</CardTitle>
          <CardDescription>Villages and districts with risk indicators. Integrate Google Maps API for satellite view.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative min-h-[400px] overflow-hidden rounded-lg bg-[#1B5E20]/10 md:min-h-[500px]">
            {/* Grid-based map visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-full w-full">
                {filteredVillages.map((village) => {
                  const district = DISTRICTS.find(d => d.id === village.districtId)
                  const samples = SEED_WATER_SAMPLES.filter(s => s.villageId === village.id)
                  const latestSample = samples[samples.length - 1]
                  const riskCategory = district?.riskCategory || "Green"

                  // Normalize coordinates to percentage positions
                  const minLat = 8, maxLat = 29, minLng = 79, maxLng = 96
                  const top = ((maxLat - village.latitude) / (maxLat - minLat)) * 100
                  const left = ((village.longitude - minLng) / (maxLng - minLng)) * 100

                  return (
                    <div
                      key={village.id}
                      className="group absolute"
                      style={{ top: `${Math.min(90, Math.max(5, top))}%`, left: `${Math.min(90, Math.max(5, left))}%` }}
                    >
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#ffffff] shadow-lg ${
                        riskCategory === "Red" ? "bg-risk-red" : riskCategory === "Orange" ? "bg-risk-orange" : riskCategory === "Yellow" ? "bg-risk-yellow" : "bg-risk-green"
                      }`}>
                        <MapPin className="h-3 w-3 text-[#ffffff]" />
                      </div>
                      {village.floodStatus === "Flood-prone" && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#4FC3F7] text-[6px] font-bold text-[#ffffff]">F</span>
                      )}
                      {/* Tooltip */}
                      <div className="invisible absolute left-8 top-0 z-10 w-48 rounded-lg border border-border bg-card p-2 shadow-xl group-hover:visible">
                        <p className="text-xs font-bold text-card-foreground">{village.name}</p>
                        <p className="text-xs text-muted-foreground">{district?.name}, {STATES.find(s => s.id === village.stateId)?.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge className={getRiskBgClass(riskCategory as RiskCategory)} variant="secondary">
                            {riskCategory}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{village.floodStatus}</span>
                        </div>
                        {latestSample && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            <p>Turbidity: {latestSample.turbidity} NTU</p>
                            <p>pH: {latestSample.ph} | Contam: {latestSample.contaminationLevel}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* Map legend */}
                <div className="absolute bottom-3 right-3 rounded-lg border border-border bg-card/90 p-3 backdrop-blur">
                  <p className="mb-2 text-xs font-bold text-card-foreground">Legend</p>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-risk-green" />
                      <span className="text-xs text-muted-foreground">Safe (0-40)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-risk-yellow" />
                      <span className="text-xs text-muted-foreground">Low Risk (41-60)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-risk-orange" />
                      <span className="text-xs text-muted-foreground">Medium Risk (61-75)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-risk-red" />
                      <span className="text-xs text-muted-foreground">High Risk (76-100)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#4FC3F7] text-[5px] font-bold text-[#ffffff]">F</div>
                      <span className="text-xs text-muted-foreground">Flood-prone</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* District cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDistricts.sort((a, b) => b.riskScore - a.riskScore).map(district => {
          const state = STATES.find(s => s.id === district.stateId)
          const villagesInDistrict = VILLAGES.filter(v => v.districtId === district.id)
          return (
            <Card key={district.id} className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-card-foreground">{district.name}</p>
                    <p className="text-xs text-muted-foreground">{state?.name}</p>
                  </div>
                  <Badge className={getRiskBgClass(district.riskCategory as RiskCategory)}>
                    Score: {district.riskScore}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Villages: {villagesInDistrict.length}</span>
                  <span>Pop: {district.population.toLocaleString("en-IN")}</span>
                  <span>Outbreak: {district.outbreakProbability}%</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
