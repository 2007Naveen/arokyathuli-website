"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VILLAGES, DISTRICTS, STATES, SEED_WATER_SAMPLES, getRiskBgClass } from "@/lib/data"
import type { RiskCategory } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useMemo, useEffect } from "react"
import dynamic from "next/dynamic"

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[500px] items-center justify-center rounded-lg bg-muted">
      <p className="text-sm text-muted-foreground">Loading satellite map...</p>
    </div>
  ),
})

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

  const markers = useMemo(() => {
    return filteredVillages.map(village => {
      const district = DISTRICTS.find(d => d.id === village.districtId)
      const state = STATES.find(s => s.id === village.stateId)
      const samples = SEED_WATER_SAMPLES.filter(s => s.villageId === village.id)
      const latestSample = samples[samples.length - 1]
      const riskCategory = (district?.riskCategory || "Green") as RiskCategory
      return {
        id: village.id,
        name: village.name,
        lat: village.latitude,
        lng: village.longitude,
        riskCategory,
        districtName: district?.name || "",
        stateName: state?.name || "",
        floodStatus: village.floodStatus,
        turbidity: latestSample?.turbidity,
        ph: latestSample?.ph,
        contamination: latestSample?.contaminationLevel,
        riskScore: district?.riskScore || 0,
      }
    })
  }, [filteredVillages])

  const center = useMemo(() => {
    if (markers.length === 0) return { lat: 22, lng: 87 }
    const avgLat = markers.reduce((s, m) => s + m.lat, 0) / markers.length
    const avgLng = markers.reduce((s, m) => s + m.lng, 0) / markers.length
    return { lat: avgLat, lng: avgLng }
  }, [markers])

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Risk Map</h1>
          <p className="text-sm text-muted-foreground">Satellite view of health risk across regions</p>
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

      {/* Satellite Map */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-card-foreground">Satellite Risk Map</CardTitle>
          <CardDescription>Real-time village risk markers on satellite imagery. Click markers for details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg">
            <LeafletMap markers={markers} center={center} />
          </div>
          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="text-xs font-semibold text-card-foreground">Legend:</span>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-risk-green" />
              <span className="text-xs text-muted-foreground">Safe (0-40)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-risk-yellow" />
              <span className="text-xs text-muted-foreground">Low Risk (41-60)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-risk-orange" />
              <span className="text-xs text-muted-foreground">Medium Risk (61-75)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-risk-red" />
              <span className="text-xs text-muted-foreground">High Risk (76-100)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#4FC3F7] text-[5px] font-bold text-[#ffffff]">F</div>
              <span className="text-xs text-muted-foreground">Flood-prone</span>
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
