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
  type: 'divination'
  input: DivinationInput
  coreNumbers: CoreNumbers
  matrix: number[][]
  starMap: StarMap
  geometry: GeometryData
  interpretation: Interpretation
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

export interface CareerOption {
  name: string
  description: string
}

export interface CareerChoiceInput {
  name: string
  birthDate: string
  optionA: CareerOption
  optionB: CareerOption
  timestamp: number
}

export interface TimelineDescription {
  shortTerm: string
  mediumTerm: string
  longTerm: string
}

export interface KeyIndicator {
  name: string
  value: number
  description: string
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
  timeline: TimelineDescription
  keyIndicators: KeyIndicator[]
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
  aspect: string
  level: 'critical' | 'high' | 'medium' | 'low'
  description: string
  mitigation: string
}

export interface ActionWindow {
  name: string
  startDate: string
  endDate: string
  energyScore: number
  type: string
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
  scenario?: LoveTimingScenario
  overallScore: number
  overallDescription: string
  coreEnergy?: string
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

export interface LoveTimingInput {
  yourName: string
  yourBirthDate: string
  theirName: string
  theirBirthDate: string
  scenario: LoveTimingScenario
  currentSituation?: string
  timestamp: number
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

export type QuestionCategory = 'love' | 'career' | 'wealth' | 'self-growth'

export interface QuestionCategoryOption {
  key: QuestionCategory
  label: string
  icon: string
  color: string
  description: string
}

export interface DailyRitualInput {
  name: string
  birthDate: string
  mood: string
  intention: string
  questionCategory: QuestionCategory | null
  selectedRune: number
  timestamp: number
}

export interface DailyRitualInterpretation {
  title: string
  paragraphs: string[]
  keywords: string[]
  guidance: string
}

export interface DailyRitualResult {
  id: string
  type: 'daily-ritual'
  input: DailyRitualInput
  dailyNumber: number
  energyLevel: number
  geometry: GeometryData
  interpretation: DailyRitualInterpretation
  weekEnergy?: number[]
  dateKey: string
  symbolTheme: string
  symbolKeywords: string[]
  createdAt: number
}

export interface DreamEmotion {
  name: string
  intensity: number
  description: string
  color: string
}

export interface DreamSymbol {
  symbol: string
  meaning: string
  runeConnection: string
  numerologyNumber: number
  category?: string
  rune?: string
  number?: number
}

export interface PotentialWarning {
  aspect: string
  severity: 'high' | 'medium' | 'low'
  description: string
}

export interface ActionSuggestion {
  title: string
  description: string
  priority: 'immediate' | 'short-term' | 'long-term'
  relatedNumber?: number
}

export interface DreamInterpretation {
  title: string
  overallTheme: string
  coreNumber: number
  coreNumberMeaning?: string
  overallMeaning?: string
  coreMessage?: string
  warning?: string
  subconsciousMessage?: string
  actionSuggestions?: ActionSuggestion[]
  emotions: DreamEmotion[]
  symbols: DreamSymbol[]
  warnings: PotentialWarning[]
  suggestions?: ActionSuggestion[]
  keywords: string[]
}

export interface DreamInterpretationInput {
  name: string
  birthDate: string
  dreamContent: string
  dreamMood: string
  timestamp: number
}

export interface DreamInterpretationResult {
  id: string
  type: 'dream-interpretation'
  input: DreamInterpretationInput
  coreNumbers: CoreNumbers
  dreamNumber: number
  geometry: GeometryData
  starMap?: StarMap
  interpretation: DreamInterpretation
  calculationTrace: CalculationStep[]
  createdAt: number
}

export type CareerChoiceOption = CareerOption

export interface TimeCapsuleInput {
  name: string
  birthDate: string
  question: string
  targetDate: string
  selectedRunes: number[]
  starConnection: number[][]
  timestamp: number
}

export interface TimeCapsuleSeal {
  sealText: string
  sealSymbol: string
  encryptedHint: string
}

export interface TimeCapsulePrediction {
  summary: string
  keyThemes: string[]
  potentialOutcomes: string[]
  warningSigns: string[]
  guidance: string
}

export interface TimeCapsuleRealityCheck {
  actualSituation: string
  accuracyRating: number
  unexpectedChanges: string
  lessonsLearned: string
  completedAt: number
}

export interface TimeCapsuleResult {
  id: string
  type: 'time-capsule'
  input: TimeCapsuleInput
  coreNumbers: CoreNumbers
  matrix: number[][]
  starMap: StarMap
  geometry: GeometryData
  prediction: TimeCapsulePrediction
  seal: TimeCapsuleSeal
  realityCheck?: TimeCapsuleRealityCheck
  calculationTrace: CalculationStep[]
  createdAt: number
  unlockAt: number
  isUnlocked: boolean
}

export type ArchiveRecord = DivinationResult | SynastryResult | YearlyResult | CareerChoiceResult | LoveTimingResult | DailyRitualResult | DreamInterpretationResult | TimeCapsuleResult

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
