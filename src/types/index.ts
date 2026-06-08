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

export type ArchiveRecord = DivinationResult | SynastryResult
