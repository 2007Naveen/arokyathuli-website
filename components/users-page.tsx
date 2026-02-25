"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth-context"
import { Users, Shield, UserCheck, User } from "lucide-react"

const roleColors: Record<string, string> = {
  super_admin: "bg-[#01579B] text-[#ffffff]",
  admin: "bg-[#1B5E20] text-[#ffffff]",
  health_worker: "bg-[#FF9800] text-[#ffffff]",
  community_member: "bg-[#4FC3F7] text-[#01579B]",
}

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  health_worker: "Health Worker",
  community_member: "Community",
}

export function UsersPage() {
  const { users } = useAuth()

  const admins = users.filter(u => u.role === "super_admin" || u.role === "admin")
  const workers = users.filter(u => u.role === "health_worker")
  const community = users.filter(u => u.role === "community_member")

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground">All registered users across the system</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-8 w-8 text-[#01579B]" />
            <div>
              <p className="text-xs text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-card-foreground">{users.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <Shield className="h-8 w-8 text-[#1B5E20]" />
            <div>
              <p className="text-xs text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold text-card-foreground">{admins.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <UserCheck className="h-8 w-8 text-[#FF9800]" />
            <div>
              <p className="text-xs text-muted-foreground">Workers</p>
              <p className="text-2xl font-bold text-card-foreground">{workers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <User className="h-8 w-8 text-[#4FC3F7]" />
            <div>
              <p className="text-xs text-muted-foreground">Community</p>
              <p className="text-2xl font-bold text-card-foreground">{community.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-card-foreground">All Users</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.fullName}</TableCell>
                  <TableCell className="text-sm">{u.email}</TableCell>
                  <TableCell>
                    <Badge className={roleColors[u.role]}>{roleLabels[u.role]}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{u.phone || "-"}</TableCell>
                  <TableCell>
                    {u.role === "health_worker" && u.workerStatus ? (
                      <Badge variant="outline" className="capitalize">{u.workerStatus}</Badge>
                    ) : (
                      <Badge className="bg-risk-green text-[#ffffff]">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString("en-IN")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
