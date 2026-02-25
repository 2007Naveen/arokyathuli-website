"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { UserCheck, UserX, Clock } from "lucide-react"
import { toast } from "sonner"

export function WorkerApprovalPage() {
  const { users, approveWorker, rejectWorker } = useAuth()
  const pendingWorkers = users.filter(u => u.role === "health_worker" && u.workerStatus === "pending")
  const approvedWorkers = users.filter(u => u.role === "health_worker" && u.workerStatus === "approved")
  const rejectedWorkers = users.filter(u => u.role === "health_worker" && u.workerStatus === "rejected")

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Health Worker Approval</h1>
        <p className="text-sm text-muted-foreground">Review and approve health worker registration requests</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-8 w-8 text-risk-yellow" />
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-card-foreground">{pendingWorkers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <UserCheck className="h-8 w-8 text-risk-green" />
            <div>
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-card-foreground">{approvedWorkers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <UserX className="h-8 w-8 text-risk-red" />
            <div>
              <p className="text-xs text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-card-foreground">{rejectedWorkers.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-card-foreground">Pending Requests</CardTitle>
          <CardDescription>Workers awaiting approval to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingWorkers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending requests</p>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingWorkers.map(w => (
                <div key={w.id} className="flex items-center justify-between rounded-lg border border-risk-yellow/30 bg-risk-yellow/5 p-4">
                  <div>
                    <p className="font-semibold text-card-foreground">{w.fullName}</p>
                    <p className="text-sm text-muted-foreground">{w.email}</p>
                    <p className="text-xs text-muted-foreground">Phone: {w.phone} | Registered: {new Date(w.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-risk-green text-[#ffffff] hover:bg-risk-green/90"
                      onClick={() => { approveWorker(w.id); toast.success(`${w.fullName} approved`) }}
                    >
                      <UserCheck className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => { rejectWorker(w.id); toast.error(`${w.fullName} rejected`) }}
                    >
                      <UserX className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approved Workers */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-card-foreground">Approved Workers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {approvedWorkers.map(w => (
              <div key={w.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{w.fullName}</p>
                  <p className="text-xs text-muted-foreground">{w.email} | {w.phone}</p>
                </div>
                <Badge className="bg-risk-green text-[#ffffff]">Approved</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
