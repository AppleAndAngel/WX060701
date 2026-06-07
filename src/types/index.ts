export interface DivinationInput {
  name: string
  birthDate: string
  query: string
  selectedRunes: number[]
  starConnection: number[][]
  timestamp: number
}

export interface CoreNumbers {
  lifePath: number
  destiny: number
  soul: number
  personality: number
}

export interface StarPosition {
  x: number
  y: number
  z: number
}

export interface StarMap {
  positions: StarPosition[]
  connections: number[][]
}

export interface GeometryData {
  type: string
  vertices: { x: number; y: number }[]
  center: { x: number; y: number }
}

export interface Interpretation {
  title: string
  paragraphs: string[]
  keywords: string[]
  warning?: string
}

export interface CalculationStep {
  step: number
  name: string
  formula: string
  input: unknown
  output: unknown
  description: string
}

export interface DivinationResult {
  id: string
  input: DivinationInput
  coreNumbers: CoreNumbers
  matrix: number[][]
  starMap: StarMap
  geometry: GeometryData
  interpretation: Interpretation
  calculationTrace: CalculationStep[]
  createdAt: number
}

export interface Rune {
  id: number
  name: string
  symbol: string
  meaning: string
}

export interface StarPoint {
  id: number
  x: number
  y: number
  connected: boolean
}

export type RitualPhase = 'input' | 'runes' | 'stars' | 'calculating' | 'complete'

export interface PersonInfo {
  name: string
  birthDate: string
}

export interface SynastryInput {
  personA: PersonInfo
  personB: PersonInfo
  relationshipType: string
  timestamp: number
}

export interface NumberCompatibility {
  numberA: number
  numberB: number
  score: number
  description: string
}

export interface AttractionPoint {
  aspect: string
  intensity: number
  description: string
  advice: string
}

export interface ConflictPoint {
  aspect: string
  severity: number
  description: string
  resolution: string
}

export interface RhythmPattern {
  name: string
  frequency: number
  description: string
  bestPeriod: string
  challengePeriod: string
}

export interface SynastryInterpretation {
  title: string
  overallScore: number
  overallDescription: string
  attraction: AttractionPoint[]
  conflicts: ConflictPoint[]
  rhythm: RhythmPattern[]
  advice: string[]
  keywords: string[]
}

export interface SynastryResult {
  id: string
  type: 'synastry'
  input: SynastryInput
  personANumbers: CoreNumbers
  personBNumbers: CoreNumbers
  compatibilityMatrix: NumberCompatibility[]
  geometry: GeometryData
  starMap: StarMap
  interpretation: SynastryInterpretation
  calculationTrace: CalculationStep[]
  createdAt: number
}

export interface YearlyDivinationInput {
  name: string
  birthDate: string
  targetYear: number
  timestamp: number
}

export interface MonthData {
  month: number
  name: string
  monthNumber: number
  theme: string
  keywords: string[]
  energy: string
  opportunities: string[]
  challenges: string[]
  reminder: string
}

export interface PhaseData {
  name: string
  period: string
  months: number[]
  theme: string
  focus: string[]
  energy: string
}

export interface YearlyInterpretation {
  title: string
  yearNumber: number
  theme: string
  coreKeywords: string[]
  overallDescription: string
  phases: PhaseData[]
  months: MonthData[]
  keyReminders: string[]
  auspiciousDays?: string[]
}

export interface YearlyResult {
  id: string
  type: 'yearly'
  input: YearlyDivinationInput
  lifePathNumber: number
  yearNumber: number
  interpretation: YearlyInterpretation
  calculationTrace: CalculationStep[]
  geometry: GeometryData
  createdAt: number
}

export interface CareerChoiceOption {
  name: string
  description: string
}

export interface CareerChoiceInput {
  name: string
  birthDate: string
  optionA: CareerChoiceOption
  optionB: CareerChoiceOption
  timestamp: number
}

export interface PathAnalysis {
  optionName: string
  coreNumbers: CoreNumbers
  advantages: string[]
  costs: string[]
  suitability: number
  energyLevel: number
  growthPotential: number
  riskLevel: number
  timeline: {
    shortTerm: string
    mediumTerm: string
    longTerm: string
  }
  keyIndicators: {
    name: string
    value: number
    description: string
  }[]
}

export interface CareerChoiceComparison {
  aspect: string
  optionAScore: number
  optionBScore: number
  description: string
  recommendation: string
}

export interface CareerChoiceInterpretation {
  title: string
  overallDescription: string
  pathA: PathAnalysis
  pathB: PathAnalysis
  comparisons: CareerChoiceComparison[]
  finalRecommendation: string
  actionSteps: string[]
  keywords: string[]
  warning?: string
}

export interface CareerChoiceResult {
  id: string
  type: 'career-choice'
  input: CareerChoiceInput
  geometry: GeometryData
  starMap: StarMap
  interpretation: CareerChoiceInterpretation
  calculationTrace: CalculationStep[]
  createdAt: number
}

export type LoveTimingScenario = 'progression' | 'reconciliation' | 'confession'

export interface LoveTimingInput {
  yourName: string
  yourBirthDate: string
  theirName: string
  theirBirthDate: string
  scenario: LoveTimingScenario
  currentSituation: string
  timestamp: number
}

export interface StageSuggestion {
  stage: number
  name: string
  period: string
  energy: number
  description: string
  actions: string[]
  vibe: string
}

export interface RiskWarning {
  level: 'low' | 'medium' | 'high' | 'critical'
  aspect: string
  description: string
  mitigation: string
}

export interface ActionWindow {
  name: string
  startDate: string
  endDate: string
  energyScore: number
  type: 'optimal' | 'good' | 'challenging'
  description: string
  recommendedActions: string[]
}

export interface EnergyPattern {
  name: string
  value: number
  description: string
  trend: 'rising' | 'stable' | 'falling'
}

export interface LoveTimingInterpretation {
  title: string
  overallScore: number
  overallDescription: string
  coreEnergy: string
  stages: StageSuggestion[]
  risks: RiskWarning[]
  actionWindows: ActionWindow[]
  energyPatterns: EnergyPattern[]
  finalAdvice: string
  doList: string[]
  dontList: string[]
  keywords: string[]
  warning?: string
}

export interface LoveTimingResult {
  id: string
  type: 'love-timing'
  input: LoveTimingInput
  yourNumbers: CoreNumbers
  theirNumbers: CoreNumbers
  geometry: GeometryData
  starMap: StarMap
  interpretation: LoveTimingInterpretation
  calculationTrace: CalculationStep[]
  createdAt: number
}

export type ArchiveRecord = DivinationResult | SynastryResult | YearlyResult | CareerChoiceResult | LoveTimingResult
