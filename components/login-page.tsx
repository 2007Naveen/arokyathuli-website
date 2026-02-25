"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STATES, DISTRICTS } from "@/lib/data"
import type { Role } from "@/lib/data"
import { Droplets, ShieldCheck } from "lucide-react"

export function LoginPage() {
  const { login, register } = useAuth()
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const [regFullName, setRegFullName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regRole, setRegRole] = useState<Role>("community_member")
  const [regState, setRegState] = useState("")
  const [regDistrict, setRegDistrict] = useState("")
  const [regError, setRegError] = useState("")
  const [regSuccess, setRegSuccess] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    const result = login(loginEmail, loginPassword)
    if (!result.success) {
      setLoginError(result.error || "Login failed")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setRegError("")
    setRegSuccess("")
    const result = register({
      email: regEmail,
      password: regPassword,
      fullName: regFullName,
      role: regRole,
      phone: regPhone,
      state: regState,
      district: regDistrict,
    })
    if (!result.success) {
      setRegError(result.error || "Registration failed")
    } else {
      if (regRole === "health_worker") {
        setRegSuccess("Registration submitted! Awaiting admin approval.")
      } else {
        setRegSuccess("Registration successful! You are now logged in.")
      }
    }
  }

  const filteredDistricts = DISTRICTS.filter((d) => d.stateId === regState)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1B5E20] p-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 rounded-full bg-[#ffffff]/10 px-5 py-3">
          <Droplets className="h-8 w-8 text-[#4FC3F7]" />
          <ShieldCheck className="h-8 w-8 text-[#81C784]" />
        </div>
        <h1 className="text-center font-serif text-2xl font-bold text-[#ffffff] md:text-3xl">
          Smart Community Health Monitor
        </h1>
        <p className="text-center text-sm text-[#81C784]">
          AI-Powered Early Warning System for Water-Borne Diseases | SIH25001
        </p>
        <p className="text-center text-xs text-[#ffffff]/60">
          Team 25RBU214
        </p>
      </div>

      <Card className="w-full max-w-md border-[#c8e6c9] bg-[#ffffff] shadow-xl">
        <Tabs defaultValue="login">
          <CardHeader className="pb-2">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Login</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Register</TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="login">
            <CardHeader className="pt-0">
              <CardTitle className="font-serif text-lg text-[#1B5E20]">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                {loginError && (
                  <p className="text-sm text-destructive">{loginError}</p>
                )}
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-[#2E7D32]">
                  Sign In
                </Button>
              </form>
            </CardContent>
          </TabsContent>

          <TabsContent value="register">
            <CardHeader className="pt-0">
              <CardTitle className="font-serif text-lg text-[#1B5E20]">Create Account</CardTitle>
              <CardDescription>Register as a Community Member or Health Worker</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input id="reg-name" value={regFullName} onChange={(e) => setRegFullName(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-phone">Phone</Label>
                  <Input id="reg-phone" type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Register as</Label>
                  <Select value={regRole} onValueChange={(v) => setRegRole(v as Role)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="community_member">Community Member</SelectItem>
                      <SelectItem value="health_worker">Health Worker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>State</Label>
                  <Select value={regState} onValueChange={(v) => { setRegState(v); setRegDistrict("") }}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {STATES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {regState && (
                  <div className="flex flex-col gap-2">
                    <Label>District</Label>
                    <Select value={regDistrict} onValueChange={setRegDistrict}>
                      <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                      <SelectContent>
                        {filteredDistricts.map((d) => (
                          <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {regError && <p className="text-sm text-destructive">{regError}</p>}
                {regSuccess && <p className="text-sm text-[#1B5E20] font-medium">{regSuccess}</p>}
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-[#2E7D32]">
                  {regRole === "health_worker" ? "Submit for Approval" : "Register"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      <p className="mt-6 text-center text-xs text-[#ffffff]/50">
        Government of India | Ministry of Health & Family Welfare | Smart India Hackathon 2025
      </p>
    </div>
  )
}
