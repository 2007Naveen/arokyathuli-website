"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DISTRICTS } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { Droplets, AlertTriangle, CheckCircle } from "lucide-react"

export function WaterSamplesPage() {
  const { waterSamples, villages } = useAuth()

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Water Samples</h1>
        <p className="text-sm text-muted-foreground">Water quality testing records across all monitored villages</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <Droplets className="h-8 w-8 text-[#4FC3F7]" />
            <div>
              <p className="text-xs text-muted-foreground">Total Samples</p>
              <p className="text-2xl font-bold text-card-foreground">{waterSamples.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-8 w-8 text-risk-red" />
            <div>
              <p className="text-xs text-muted-foreground">Unsafe</p>
              <p className="text-2xl font-bold text-card-foreground">{waterSamples.filter(s => s.isUnsafe).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle className="h-8 w-8 text-risk-green" />
            <div>
              <p className="text-xs text-muted-foreground">Safe</p>
              <p className="text-2xl font-bold text-card-foreground">{waterSamples.filter(s => !s.isUnsafe).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <Droplets className="h-8 w-8 text-risk-orange" />
            <div>
              <p className="text-xs text-muted-foreground">Avg Turbidity</p>
              <p className="text-2xl font-bold text-card-foreground">
                {waterSamples.length > 0 ? (waterSamples.reduce((a, s) => a + s.turbidity, 0) / waterSamples.length).toFixed(1) : "0"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-card-foreground">All Samples</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Village</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Turbidity (NTU)</TableHead>
                <TableHead>pH</TableHead>
                <TableHead>Temp (C)</TableHead>
                <TableHead>Contamination %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waterSamples.map((sample) => {
                const village = villages.find(v => v.id === sample.villageId)
                const district = DISTRICTS.find(d => d.id === sample.districtId)
                return (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">{village?.name || sample.villageId}</TableCell>
                    <TableCell>{district?.name || sample.districtId}</TableCell>
                    <TableCell className={sample.turbidity > 10 ? "font-semibold text-risk-red" : ""}>{sample.turbidity}</TableCell>
                    <TableCell className={sample.ph < 6.5 || sample.ph > 8.5 ? "font-semibold text-risk-red" : ""}>{sample.ph}</TableCell>
                    <TableCell>{sample.temperature}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${sample.contaminationLevel}%`,
                              backgroundColor: sample.contaminationLevel > 60 ? "#F44336" : sample.contaminationLevel > 40 ? "#FF9800" : "#4CAF50",
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium">{sample.contaminationLevel}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={sample.isUnsafe ? "bg-risk-red text-[#ffffff]" : "bg-risk-green text-[#ffffff]"}>
                        {sample.isUnsafe ? "Unsafe" : "Safe"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(sample.timestamp).toLocaleDateString("en-IN")}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
