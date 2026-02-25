"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth-context"
import { FileText, Eye, MessageSquare } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import type { Report } from "@/lib/data"

const statusColors: Record<string, string> = {
  submitted: "bg-[#4FC3F7] text-[#01579B]",
  in_review: "bg-risk-yellow text-[#1a2e1a]",
  resolved: "bg-risk-green text-[#ffffff]",
  rejected: "bg-risk-red text-[#ffffff]",
}

export function ReportsPage() {
  const { reports, setReports } = useAuth()
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [consultantNote, setConsultantNote] = useState("")

  const handleResolve = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "resolved" as const, consultantReport: consultantNote || undefined } : r))
    setSelectedReport(null)
    setConsultantNote("")
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Community Reports</h1>
        <p className="text-sm text-muted-foreground">Manage water issue and symptom reports from community</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <FileText className="h-8 w-8 text-[#01579B]" />
            <div>
              <p className="text-xs text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-bold text-card-foreground">{reports.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <FileText className="h-8 w-8 text-[#4FC3F7]" />
            <div>
              <p className="text-xs text-muted-foreground">Submitted</p>
              <p className="text-2xl font-bold text-card-foreground">{reports.filter(r => r.status === "submitted").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <Eye className="h-8 w-8 text-risk-yellow" />
            <div>
              <p className="text-xs text-muted-foreground">In Review</p>
              <p className="text-2xl font-bold text-card-foreground">{reports.filter(r => r.status === "in_review").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <MessageSquare className="h-8 w-8 text-risk-green" />
            <div>
              <p className="text-xs text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold text-card-foreground">{reports.filter(r => r.status === "resolved").length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-card-foreground">All Reports</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-xs font-medium">{report.referenceId}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{report.type.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {report.village}, {report.district}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">{report.description}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[report.status]}>{report.status.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setSelectedReport(report); setConsultantNote("") }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle className="font-serif text-card-foreground">Report: {selectedReport?.referenceId}</DialogTitle>
            <DialogDescription>Review and respond to this community report</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-muted p-3">
                <p className="mb-1 text-xs font-semibold text-muted-foreground">Type</p>
                <p className="text-sm capitalize text-card-foreground">{selectedReport.type.replace("_", " ")}</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="mb-1 text-xs font-semibold text-muted-foreground">Location</p>
                <p className="text-sm text-card-foreground">{selectedReport.village}, {selectedReport.district}, {selectedReport.state}</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="mb-1 text-xs font-semibold text-muted-foreground">Description</p>
                <p className="text-sm text-card-foreground">{selectedReport.description}</p>
              </div>
              {selectedReport.consultantReport && (
                <div className="rounded-lg border border-[#1B5E20] bg-secondary p-3">
                  <p className="mb-1 text-xs font-semibold text-[#1B5E20]">Consultant Response</p>
                  <p className="text-sm text-card-foreground">{selectedReport.consultantReport}</p>
                </div>
              )}
              {selectedReport.status !== "resolved" && (
                <>
                  <Textarea
                    placeholder="Write consultant report / response..."
                    value={consultantNote}
                    onChange={(e) => setConsultantNote(e.target.value)}
                  />
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-[#2E7D32]"
                    onClick={() => handleResolve(selectedReport.id)}
                  >
                    Resolve & Send Response
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
