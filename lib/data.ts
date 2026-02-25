// ────────────────────────────────────────────────
// TYPES & INTERFACES
// ────────────────────────────────────────────────

export type Role = "super_admin" | "admin" | "health_worker" | "community_member"
export type RiskCategory = "Green" | "Yellow" | "Orange" | "Red"
export type ReportStatus = "submitted" | "in_review" | "resolved" | "rejected"
export type WorkerStatus = "pending" | "approved" | "rejected"
export type FloodStatus = "Flood-prone" | "Semi-flood-prone" | "Safe"

export interface User {
  id: string
  email: string
  password: string
  fullName: string
  role: Role
  phone?: string
  state?: string
  district?: string
  village?: string
  createdAt: string
  isActive: boolean
  workerStatus?: WorkerStatus
  points?: number
}

export interface PointActivity {
  id: string
  userId: string
  action: PointAction
  points: number
  description: string
  timestamp: string
}

export type PointAction =
  | "sample_collected"
  | "report_submitted"
  | "report_resolved"
  | "alert_responded"
  | "community_visit"
  | "training_completed"
  | "bonus_awarded"

export const POINT_VALUES: Record<PointAction, { points: number; label: string }> = {
  sample_collected: { points: 10, label: "Water Sample Collected" },
  report_submitted: { points: 5, label: "Report Submitted" },
  report_resolved: { points: 20, label: "Report Resolved" },
  alert_responded: { points: 15, label: "Alert Responded" },
  community_visit: { points: 8, label: "Community Visit" },
  training_completed: { points: 25, label: "Training Completed" },
  bonus_awarded: { points: 50, label: "Admin Bonus Awarded" },
}

export function getPointsBadge(points: number): { label: string; color: string } {
  if (points >= 500) return { label: "Gold", color: "bg-[#FFD700] text-[#1a2e1a]" }
  if (points >= 250) return { label: "Silver", color: "bg-[#C0C0C0] text-[#1a2e1a]" }
  if (points >= 100) return { label: "Bronze", color: "bg-[#CD7F32] text-[#ffffff]" }
  return { label: "Starter", color: "bg-muted text-muted-foreground" }
}

export interface State {
  id: string
  name: string
  code: string
}

export interface District {
  id: string
  name: string
  stateId: string
  riskScore: number
  riskCategory: RiskCategory
  outbreakProbability: number
  population: number
}

export interface Village {
  id: string
  name: string
  districtId: string
  stateId: string
  latitude: number
  longitude: number
  floodStatus: FloodStatus
  population: number
}

export interface WaterSample {
  id: string
  villageId: string
  districtId: string
  stateId: string
  collectedBy: string
  turbidity: number
  ph: number
  temperature: number
  contaminationLevel: number
  timestamp: string
  isUnsafe: boolean
}

export interface Report {
  id: string
  referenceId: string
  userId: string
  type: "water_issue" | "symptoms"
  description: string
  imageUrl?: string
  latitude?: number
  longitude?: number
  status: ReportStatus
  village?: string
  district?: string
  state?: string
  createdAt: string
  consultantReport?: string
}

export interface Alert {
  id: string
  title: string
  message: string
  severity: RiskCategory
  districtId: string
  stateId: string
  createdAt: string
  isAutoBroadcast: boolean
  createdBy: string
}

export interface RiskScore {
  id: string
  districtId: string
  stateId: string
  waterContamination: number
  symptomSpike: number
  monsoonFactor: number
  floodVulnerability: number
  historicalTrend: number
  totalScore: number
  category: RiskCategory
  outbreakProbability: number
  calculatedAt: string
}

export interface RainfallData {
  id: string
  districtId: string
  stateId: string
  month: string
  rainfallMm: number
  monsoonRiskIndex: number
}

// ────────────────────────────────────────────────
// STATES
// ────────────────────────────────────────────────

export const STATES: State[] = [
  { id: "s1", name: "Assam", code: "AS" },
  { id: "s2", name: "Meghalaya", code: "ML" },
  { id: "s3", name: "Manipur", code: "MN" },
  { id: "s4", name: "Mizoram", code: "MZ" },
  { id: "s5", name: "Tripura", code: "TR" },
  { id: "s6", name: "Nagaland", code: "NL" },
  { id: "s7", name: "Arunachal Pradesh", code: "AR" },
  { id: "s8", name: "Sikkim", code: "SK" },
  { id: "s9", name: "Tamil Nadu", code: "TN" },
]

// ────────────────────────────────────────────────
// DISTRICTS (Northeast + Tamil Nadu)
// ────────────────────────────────────────────────

export const DISTRICTS: District[] = [
  // Assam
  { id: "d1", name: "Kamrup Metropolitan", stateId: "s1", riskScore: 42, riskCategory: "Yellow", outbreakProbability: 35, population: 1260419 },
  { id: "d2", name: "Nagaon", stateId: "s1", riskScore: 68, riskCategory: "Orange", outbreakProbability: 55, population: 2823768 },
  { id: "d3", name: "Dibrugarh", stateId: "s1", riskScore: 55, riskCategory: "Yellow", outbreakProbability: 40, population: 1327748 },
  { id: "d4", name: "Cachar", stateId: "s1", riskScore: 78, riskCategory: "Red", outbreakProbability: 72, population: 1736617 },
  { id: "d5", name: "Barpeta", stateId: "s1", riskScore: 82, riskCategory: "Red", outbreakProbability: 78, population: 1693622 },
  // Meghalaya
  { id: "d6", name: "East Khasi Hills", stateId: "s2", riskScore: 35, riskCategory: "Green", outbreakProbability: 20, population: 825922 },
  { id: "d7", name: "West Garo Hills", stateId: "s2", riskScore: 61, riskCategory: "Orange", outbreakProbability: 48, population: 643291 },
  // Manipur
  { id: "d8", name: "Imphal West", stateId: "s3", riskScore: 38, riskCategory: "Green", outbreakProbability: 22, population: 514683 },
  { id: "d9", name: "Thoubal", stateId: "s3", riskScore: 71, riskCategory: "Orange", outbreakProbability: 58, population: 422168 },
  // Mizoram
  { id: "d10", name: "Aizawl", stateId: "s4", riskScore: 28, riskCategory: "Green", outbreakProbability: 15, population: 404054 },
  // Tripura
  { id: "d11", name: "West Tripura", stateId: "s5", riskScore: 52, riskCategory: "Yellow", outbreakProbability: 38, population: 917534 },
  // Nagaland
  { id: "d12", name: "Dimapur", stateId: "s6", riskScore: 45, riskCategory: "Yellow", outbreakProbability: 30, population: 379769 },
  // Arunachal Pradesh
  { id: "d13", name: "Papum Pare", stateId: "s7", riskScore: 33, riskCategory: "Green", outbreakProbability: 18, population: 176573 },
  // Sikkim
  { id: "d14", name: "East Sikkim", stateId: "s8", riskScore: 25, riskCategory: "Green", outbreakProbability: 12, population: 283583 },
  // Tamil Nadu
  { id: "d15", name: "Chennai", stateId: "s9", riskScore: 58, riskCategory: "Yellow", outbreakProbability: 42, population: 4646732 },
  { id: "d16", name: "Coimbatore", stateId: "s9", riskScore: 35, riskCategory: "Green", outbreakProbability: 20, population: 3458045 },
  { id: "d17", name: "Madurai", stateId: "s9", riskScore: 48, riskCategory: "Yellow", outbreakProbability: 33, population: 3038252 },
  { id: "d18", name: "Tiruchirappalli", stateId: "s9", riskScore: 41, riskCategory: "Yellow", outbreakProbability: 28, population: 2722290 },
  { id: "d19", name: "Nagapattinam", stateId: "s9", riskScore: 74, riskCategory: "Orange", outbreakProbability: 65, population: 1614069 },
  { id: "d20", name: "Cuddalore", stateId: "s9", riskScore: 69, riskCategory: "Orange", outbreakProbability: 55, population: 2605914 },
  { id: "d21", name: "Ramanathapuram", stateId: "s9", riskScore: 62, riskCategory: "Orange", outbreakProbability: 50, population: 1353445 },
]

// ────────────────────────────────────────────────
// VILLAGES
// ────────────────────────────────────────────────

export const VILLAGES: Village[] = [
  // Assam villages
  { id: "v1", name: "Sila", districtId: "d1", stateId: "s1", latitude: 26.18, longitude: 91.75, floodStatus: "Safe", population: 8500 },
  { id: "v2", name: "Raha", districtId: "d2", stateId: "s1", latitude: 26.23, longitude: 92.52, floodStatus: "Flood-prone", population: 12000 },
  { id: "v3", name: "Lahowal", districtId: "d3", stateId: "s1", latitude: 27.45, longitude: 95.01, floodStatus: "Semi-flood-prone", population: 6800 },
  { id: "v4", name: "Lakhipur", districtId: "d4", stateId: "s1", latitude: 24.79, longitude: 93.01, floodStatus: "Flood-prone", population: 15000 },
  { id: "v5", name: "Howly", districtId: "d5", stateId: "s1", latitude: 26.43, longitude: 90.97, floodStatus: "Flood-prone", population: 11000 },
  // Meghalaya villages
  { id: "v6", name: "Mawsynram", districtId: "d6", stateId: "s2", latitude: 25.30, longitude: 91.58, floodStatus: "Semi-flood-prone", population: 5000 },
  { id: "v7", name: "Tura", districtId: "d7", stateId: "s2", latitude: 25.52, longitude: 90.22, floodStatus: "Safe", population: 9500 },
  // Manipur
  { id: "v8", name: "Lamphelpat", districtId: "d8", stateId: "s3", latitude: 24.82, longitude: 93.94, floodStatus: "Safe", population: 7200 },
  // Tamil Nadu
  { id: "v9", name: "Velachery", districtId: "d15", stateId: "s9", latitude: 12.98, longitude: 80.22, floodStatus: "Flood-prone", population: 200000 },
  { id: "v10", name: "Nagapattinam Town", districtId: "d19", stateId: "s9", latitude: 10.77, longitude: 79.84, floodStatus: "Flood-prone", population: 95000 },
]

// ────────────────────────────────────────────────
// DEFAULT ADMIN USER
// ────────────────────────────────────────────────

export const DEFAULT_ADMIN: User = {
  id: "usr-admin-001",
  email: "admin@sih25001.com",
  password: "admin@123",
  fullName: "NAVEENKUMAR R",
  role: "super_admin",
  phone: "+91-9876543210",
  state: "All",
  district: "All",
  createdAt: "2025-01-01T00:00:00Z",
  isActive: true,
}

// ────────────────────────────────────────────────
// SEED USERS
// ────────────────────────────────────────────────

export const SEED_USERS: User[] = [
  DEFAULT_ADMIN,
  {
    id: "usr-admin-002",
    email: "admin2@sih25001.com",
    password: "admin@456",
    fullName: "Priya Sharma",
    role: "admin",
    phone: "+91-9876543211",
    state: "s1",
    district: "d1",
    createdAt: "2025-02-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "usr-hw-001",
    email: "worker1@sih25001.com",
    password: "worker@123",
    fullName: "Anjali Devi",
    role: "health_worker",
    phone: "+91-9876543212",
    state: "s1",
    district: "d2",
    village: "v2",
    createdAt: "2025-03-01T00:00:00Z",
    isActive: true,
    workerStatus: "approved",
    points: 185,
  },
  {
    id: "usr-hw-002",
    email: "worker2@sih25001.com",
    password: "worker@456",
    fullName: "Rajan Bora",
    role: "health_worker",
    phone: "+91-9876543213",
    state: "s1",
    district: "d4",
    village: "v4",
    createdAt: "2025-03-15T00:00:00Z",
    isActive: true,
    workerStatus: "pending",
    points: 0,
  },
  {
    id: "usr-cm-001",
    email: "community1@sih25001.com",
    password: "comm@123",
    fullName: "Bhaskar Das",
    role: "community_member",
    phone: "+91-9876543214",
    state: "s1",
    district: "d2",
    village: "v2",
    createdAt: "2025-04-01T00:00:00Z",
    isActive: true,
  },
]

// ────────────────────────────────────────────────
// WATER SAMPLES
// ────────────────────────────────────────────────

export const SEED_WATER_SAMPLES: WaterSample[] = [
  { id: "ws1", villageId: "v2", districtId: "d2", stateId: "s1", collectedBy: "usr-hw-001", turbidity: 12.5, ph: 6.2, temperature: 28, contaminationLevel: 72, timestamp: "2025-06-10T08:30:00Z", isUnsafe: true },
  { id: "ws2", villageId: "v4", districtId: "d4", stateId: "s1", collectedBy: "usr-hw-002", turbidity: 8.3, ph: 7.1, temperature: 26, contaminationLevel: 45, timestamp: "2025-06-12T10:15:00Z", isUnsafe: false },
  { id: "ws3", villageId: "v5", districtId: "d5", stateId: "s1", collectedBy: "usr-hw-001", turbidity: 18.7, ph: 5.8, temperature: 30, contaminationLevel: 88, timestamp: "2025-06-15T09:00:00Z", isUnsafe: true },
  { id: "ws4", villageId: "v9", districtId: "d15", stateId: "s9", collectedBy: "usr-hw-001", turbidity: 6.1, ph: 7.4, temperature: 32, contaminationLevel: 30, timestamp: "2025-06-18T11:00:00Z", isUnsafe: false },
  { id: "ws5", villageId: "v10", districtId: "d19", stateId: "s9", collectedBy: "usr-hw-001", turbidity: 15.2, ph: 6.0, temperature: 31, contaminationLevel: 78, timestamp: "2025-06-20T14:30:00Z", isUnsafe: true },
  { id: "ws6", villageId: "v1", districtId: "d1", stateId: "s1", collectedBy: "usr-hw-001", turbidity: 3.2, ph: 7.2, temperature: 25, contaminationLevel: 15, timestamp: "2025-06-22T09:30:00Z", isUnsafe: false },
  { id: "ws7", villageId: "v6", districtId: "d6", stateId: "s2", collectedBy: "usr-hw-001", turbidity: 5.0, ph: 7.0, temperature: 22, contaminationLevel: 22, timestamp: "2025-06-25T08:00:00Z", isUnsafe: false },
  { id: "ws8", villageId: "v7", districtId: "d7", stateId: "s2", collectedBy: "usr-hw-001", turbidity: 11.8, ph: 6.3, temperature: 27, contaminationLevel: 62, timestamp: "2025-06-28T10:45:00Z", isUnsafe: true },
]

// ────────────────────────────────────────────────
// REPORTS
// ────────────────────────────────────────────────

export const SEED_REPORTS: Report[] = [
  { id: "rpt1", referenceId: "RPT-2025-0001", userId: "usr-cm-001", type: "water_issue", description: "Muddy water supply from tube well, foul smell noticed since 3 days.", status: "in_review", village: "Raha", district: "Nagaon", state: "Assam", createdAt: "2025-06-10T06:00:00Z" },
  { id: "rpt2", referenceId: "RPT-2025-0002", userId: "usr-cm-001", type: "symptoms", description: "Multiple families reporting diarrhea and vomiting in Raha village.", status: "submitted", village: "Raha", district: "Nagaon", state: "Assam", createdAt: "2025-06-12T07:30:00Z" },
  { id: "rpt3", referenceId: "RPT-2025-0003", userId: "usr-cm-001", type: "water_issue", description: "Stagnant water accumulation near primary school after heavy rain.", status: "resolved", village: "Howly", district: "Barpeta", state: "Assam", createdAt: "2025-06-15T09:00:00Z", consultantReport: "Water cleared after drainage fix. Chlorination done." },
  { id: "rpt4", referenceId: "RPT-2025-0004", userId: "usr-cm-001", type: "symptoms", description: "Skin rashes among children playing near river bank.", status: "submitted", village: "Velachery", district: "Chennai", state: "Tamil Nadu", createdAt: "2025-06-18T11:30:00Z" },
]

// ────────────────────────────────────────────────
// ALERTS
// ────────────────────────────────────────────────

export const SEED_ALERTS: Alert[] = [
  { id: "alt1", title: "Critical: High Contamination - Barpeta", message: "Water contamination levels exceeded WHO limits in Howly village, Barpeta district. Immediate action required.", severity: "Red", districtId: "d5", stateId: "s1", createdAt: "2025-06-15T12:00:00Z", isAutoBroadcast: true, createdBy: "system" },
  { id: "alt2", title: "Warning: Rising Turbidity - Nagaon", message: "Turbidity levels rising in Raha area. Monitor closely.", severity: "Orange", districtId: "d2", stateId: "s1", createdAt: "2025-06-10T14:00:00Z", isAutoBroadcast: false, createdBy: "usr-admin-001" },
  { id: "alt3", title: "Advisory: Monsoon Preparedness - Cachar", message: "Heavy rainfall forecast. Pre-position chlorination tablets.", severity: "Yellow", districtId: "d4", stateId: "s1", createdAt: "2025-06-08T10:00:00Z", isAutoBroadcast: false, createdBy: "usr-admin-001" },
  { id: "alt4", title: "Critical: Coastal Risk - Nagapattinam", message: "Cyclone warning active. Water sources may be compromised by salinity ingress.", severity: "Red", districtId: "d19", stateId: "s9", createdAt: "2025-06-20T08:00:00Z", isAutoBroadcast: true, createdBy: "system" },
]

// ────────────────────────────────────────────────
// RISK SCORES
// ────────────────────────────────────────────────

export const SEED_RISK_SCORES: RiskScore[] = [
  { id: "rs1", districtId: "d5", stateId: "s1", waterContamination: 88, symptomSpike: 75, monsoonFactor: 82, floodVulnerability: 90, historicalTrend: 70, totalScore: 82, category: "Red", outbreakProbability: 78, calculatedAt: "2025-06-25T00:00:00Z" },
  { id: "rs2", districtId: "d2", stateId: "s1", waterContamination: 72, symptomSpike: 60, monsoonFactor: 70, floodVulnerability: 80, historicalTrend: 55, totalScore: 68, category: "Orange", outbreakProbability: 55, calculatedAt: "2025-06-25T00:00:00Z" },
  { id: "rs3", districtId: "d4", stateId: "s1", waterContamination: 78, symptomSpike: 70, monsoonFactor: 85, floodVulnerability: 85, historicalTrend: 65, totalScore: 78, category: "Red", outbreakProbability: 72, calculatedAt: "2025-06-25T00:00:00Z" },
  { id: "rs4", districtId: "d19", stateId: "s9", waterContamination: 78, symptomSpike: 65, monsoonFactor: 75, floodVulnerability: 70, historicalTrend: 60, totalScore: 74, category: "Orange", outbreakProbability: 65, calculatedAt: "2025-06-25T00:00:00Z" },
  { id: "rs5", districtId: "d1", stateId: "s1", waterContamination: 35, symptomSpike: 40, monsoonFactor: 50, floodVulnerability: 30, historicalTrend: 45, totalScore: 42, category: "Yellow", outbreakProbability: 35, calculatedAt: "2025-06-25T00:00:00Z" },
]

// ────────────────────────────────────────────────
// RAINFALL DATA
// ────────────────────────────────────────────────

export const SEED_RAINFALL: RainfallData[] = [
  { id: "rf1", districtId: "d5", stateId: "s1", month: "Jun 2025", rainfallMm: 380, monsoonRiskIndex: 85 },
  { id: "rf2", districtId: "d5", stateId: "s1", month: "May 2025", rainfallMm: 220, monsoonRiskIndex: 60 },
  { id: "rf3", districtId: "d5", stateId: "s1", month: "Apr 2025", rainfallMm: 120, monsoonRiskIndex: 35 },
  { id: "rf4", districtId: "d2", stateId: "s1", month: "Jun 2025", rainfallMm: 310, monsoonRiskIndex: 72 },
  { id: "rf5", districtId: "d2", stateId: "s1", month: "May 2025", rainfallMm: 180, monsoonRiskIndex: 50 },
  { id: "rf6", districtId: "d19", stateId: "s9", month: "Jun 2025", rainfallMm: 200, monsoonRiskIndex: 68 },
  { id: "rf7", districtId: "d19", stateId: "s9", month: "May 2025", rainfallMm: 140, monsoonRiskIndex: 45 },
  { id: "rf8", districtId: "d15", stateId: "s9", month: "Jun 2025", rainfallMm: 160, monsoonRiskIndex: 52 },
]

// ────────────────────────────────────────────────
// FORECAST DATA (for charts)
// ────────────────────────────────────────────────

export const FORECAST_DATA = [
  { day: "Day 1", riskScore: 68, outbreakProb: 55, rainfall: 45 },
  { day: "Day 2", riskScore: 72, outbreakProb: 60, rainfall: 60 },
  { day: "Day 3", riskScore: 75, outbreakProb: 63, rainfall: 80 },
  { day: "Day 4", riskScore: 78, outbreakProb: 68, rainfall: 95 },
  { day: "Day 5", riskScore: 82, outbreakProb: 74, rainfall: 110 },
  { day: "Day 6", riskScore: 80, outbreakProb: 72, rainfall: 90 },
  { day: "Day 7", riskScore: 76, outbreakProb: 65, rainfall: 70 },
  { day: "Day 8", riskScore: 73, outbreakProb: 62, rainfall: 55 },
  { day: "Day 9", riskScore: 70, outbreakProb: 58, rainfall: 40 },
  { day: "Day 10", riskScore: 66, outbreakProb: 52, rainfall: 30 },
  { day: "Day 11", riskScore: 63, outbreakProb: 48, rainfall: 25 },
  { day: "Day 12", riskScore: 60, outbreakProb: 45, rainfall: 20 },
  { day: "Day 13", riskScore: 58, outbreakProb: 42, rainfall: 15 },
  { day: "Day 14", riskScore: 55, outbreakProb: 40, rainfall: 12 },
]

export const WEEKLY_TREND_DATA = [
  { week: "Week 1", contamination: 45, symptoms: 30, rainfall: 120 },
  { week: "Week 2", contamination: 52, symptoms: 38, rainfall: 180 },
  { week: "Week 3", contamination: 68, symptoms: 55, rainfall: 280 },
  { week: "Week 4", contamination: 78, symptoms: 70, rainfall: 350 },
  { week: "Week 5", contamination: 82, symptoms: 75, rainfall: 380 },
  { week: "Week 6", contamination: 75, symptoms: 68, rainfall: 310 },
]

// ────────────────────────────────────────────────
// HELPER: risk color
// ────────────────────────────────────────────────

export function getRiskColor(category: RiskCategory) {
  switch (category) {
    case "Green": return "var(--risk-green)"
    case "Yellow": return "var(--risk-yellow)"
    case "Orange": return "var(--risk-orange)"
    case "Red": return "var(--risk-red)"
  }
}

export function getRiskBgClass(category: RiskCategory) {
  switch (category) {
    case "Green": return "bg-risk-green text-[#ffffff]"
    case "Yellow": return "bg-risk-yellow text-[#1a2e1a]"
    case "Orange": return "bg-risk-orange text-[#ffffff]"
    case "Red": return "bg-risk-red text-[#ffffff]"
  }
}

// ────────────────────────────────────────────────
// SEED POINT ACTIVITIES
// ────────────────────────────────────────────────

export const SEED_POINT_ACTIVITIES: PointActivity[] = [
  { id: "pa1", userId: "usr-hw-001", action: "sample_collected", points: 10, description: "Collected water sample from Raha village", timestamp: "2025-06-10T08:30:00Z" },
  { id: "pa2", userId: "usr-hw-001", action: "sample_collected", points: 10, description: "Collected water sample from Howly village", timestamp: "2025-06-15T09:00:00Z" },
  { id: "pa3", userId: "usr-hw-001", action: "report_resolved", points: 20, description: "Resolved contamination report RPT-2025-0003", timestamp: "2025-06-16T14:00:00Z" },
  { id: "pa4", userId: "usr-hw-001", action: "alert_responded", points: 15, description: "Responded to Barpeta contamination alert", timestamp: "2025-06-15T13:00:00Z" },
  { id: "pa5", userId: "usr-hw-001", action: "community_visit", points: 8, description: "Conducted awareness visit at Raha primary school", timestamp: "2025-06-18T10:00:00Z" },
  { id: "pa6", userId: "usr-hw-001", action: "sample_collected", points: 10, description: "Collected water sample from Velachery", timestamp: "2025-06-18T11:00:00Z" },
  { id: "pa7", userId: "usr-hw-001", action: "sample_collected", points: 10, description: "Collected water sample from Sila village", timestamp: "2025-06-22T09:30:00Z" },
  { id: "pa8", userId: "usr-hw-001", action: "sample_collected", points: 10, description: "Collected water sample from Mawsynram", timestamp: "2025-06-25T08:00:00Z" },
  { id: "pa9", userId: "usr-hw-001", action: "training_completed", points: 25, description: "Completed water quality testing certification", timestamp: "2025-05-20T15:00:00Z" },
  { id: "pa10", userId: "usr-hw-001", action: "community_visit", points: 8, description: "Door-to-door hygiene awareness in Lakhipur", timestamp: "2025-06-20T09:00:00Z" },
  { id: "pa11", userId: "usr-hw-001", action: "report_submitted", points: 5, description: "Submitted field report for Nagaon district", timestamp: "2025-06-11T16:00:00Z" },
  { id: "pa12", userId: "usr-hw-001", action: "sample_collected", points: 10, description: "Collected water sample from West Garo Hills", timestamp: "2025-06-28T10:45:00Z" },
  { id: "pa13", userId: "usr-hw-001", action: "alert_responded", points: 15, description: "Responded to Nagaon turbidity alert", timestamp: "2025-06-10T15:00:00Z" },
  { id: "pa14", userId: "usr-hw-001", action: "sample_collected", points: 10, description: "Collected sample from Nagapattinam Town", timestamp: "2025-06-20T14:30:00Z" },
  { id: "pa15", userId: "usr-hw-001", action: "report_submitted", points: 5, description: "Submitted weekly monitoring report", timestamp: "2025-06-22T17:00:00Z" },
  { id: "pa16", userId: "usr-hw-001", action: "community_visit", points: 8, description: "Health camp at Howly village", timestamp: "2025-06-25T11:00:00Z" },
  { id: "pa17", userId: "usr-hw-001", action: "report_submitted", points: 5, description: "Submitted contamination follow-up report", timestamp: "2025-06-27T10:00:00Z" },
  { id: "pa18", userId: "usr-hw-001", action: "community_visit", points: 8, description: "Awareness drive at Tura market area", timestamp: "2025-06-28T14:00:00Z" },
]
