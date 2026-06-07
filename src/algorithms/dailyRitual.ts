import { generateId, hashString, reduceNumber, clamp } from '@/utils/math'
import { calculateLifePath } from './numerology'
import { generatePolygonVertices, generateStarVertices } from './geometry'
import { getCategoryInterpretation, getCategoryTitle } from './questionCategory'
import type { DailyRitualInput, DailyRitualResult, GeometryData, QuestionCategory } from '@/types'

const symbolThemes = [
  { name: '晨曦启明', keywords: ['新开始', '希望', '突破'], element: 'fire' },
  { name: '心海微澜', keywords: ['情感', '直觉', '流动'], element: 'water' },
  { name: '大地之根', keywords: ['稳定', '扎根', '务实'], element: 'earth' },
  { name: '风之低语', keywords: ['沟通', '变化', '自由'], element: 'air' },
  { name: '金阳正位', keywords: ['自信', '成功', '光明'], element: 'fire' },
  { name: '月华朦胧', keywords: ['内省', '梦境', '潜意识'], element: 'water' },
  { name: '山岳巍峨', keywords: ['坚持', '力量', '成就'], element: 'earth' },
  { name: '星河璀璨', keywords: ['灵感', '创造', '连接'], element: 'air' },
  { name: '炼金黄沙', keywords: ['转化', '炼金', '重生'], element: 'fire' }
]

const moodEnergyMap: Record<string, number> = {
  '平静': 50,
  '愉悦': 75,
  '兴奋': 90,
  '焦虑': 30,
  '疲惫': 20,
  '悲伤': 25,
  '愤怒': 35,
  '好奇': 65,
  '感恩': 80,
  '专注': 70
}

const runeEnergyBoost: Record<number, number> = {
  1: 15,
  2: 10,
  3: 12,
  4: 8,
  5: 18,
  6: 5,
  7: 20,
  8: 14,
  9: 16
}

const getDateKey = (timestamp: number): string => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const calculateDailyNumber = (birthDate: string, timestamp: number): number => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const dateSum = String(year).split('').reduce((acc, d) => acc + parseInt(d, 10), 0) +
                  String(month).split('').reduce((acc, d) => acc + parseInt(d, 10), 0) +
                  String(day).split('').reduce((acc, d) => acc + parseInt(d, 10), 0)
  
  const lifePathResult = calculateLifePath(birthDate)
  const lifePath = lifePathResult.result
  
  return reduceNumber(dateSum + lifePath)
}

const calculateEnergyLevel = (mood: string, selectedRune: number, dailyNumber: number, intention: string): number => {
  const baseEnergy = moodEnergyMap[mood] || 50
  const runeBoost = runeEnergyBoost[selectedRune] || 10
  const intentionHash = hashString(intention || '无')
  const intentionFactor = (intentionHash % 20) / 100
  const dailyNumberFactor = dailyNumber * 1.5
  
  let energy = baseEnergy + runeBoost + dailyNumberFactor + (intentionFactor * 30)
  energy = clamp(energy, 10, 100)
  
  return Math.round(energy)
}

const determineSymbolTheme = (dailyNumber: number, energyLevel: number, timestamp: number, selectedRune: number) => {
  const dateKey = getDateKey(timestamp)
  const hash = hashString(`${dailyNumber}-${energyLevel}-${dateKey}-${selectedRune}`)
  const index = hash % symbolThemes.length
  return symbolThemes[Math.abs(index)]
}

const generateDailyGeometry = (dailyNumber: number, energyLevel: number): GeometryData => {
  const centerX = 200
  const centerY = 200
  const baseRadius = 80 + (energyLevel * 0.4)
  const rotation = (dailyNumber * 40) % 360
  
  const geometryTypes = ['triangle', 'square', 'pentagon', 'hexagon', 'star']
  const typeIndex = (dailyNumber - 1) % geometryTypes.length
  const type = geometryTypes[typeIndex]
  
  let vertices: { x: number; y: number }[] = []
  
  switch (type) {
    case 'triangle':
      vertices = generatePolygonVertices(3, centerX, centerY, baseRadius, rotation)
      break
    case 'square':
      vertices = generatePolygonVertices(4, centerX, centerY, baseRadius, rotation)
      break
    case 'pentagon':
      vertices = generatePolygonVertices(5, centerX, centerY, baseRadius, rotation)
      break
    case 'hexagon':
      vertices = generatePolygonVertices(6, centerX, centerY, baseRadius, rotation)
      break
    case 'star':
      vertices = generateStarVertices(5, centerX, centerY, baseRadius, baseRadius * 0.5, rotation)
      break
    default:
      vertices = generatePolygonVertices(dailyNumber % 6 + 3, centerX, centerY, baseRadius, rotation)
  }
  
  return {
    type,
    vertices,
    center: { x: centerX, y: centerY }
  }
}

const generateDailyInterpretation = (
  dailyNumber: number,
  energyLevel: number,
  symbolTheme: { name: string; keywords: string[]; element: string },
  mood: string,
  intention: string,
  questionCategory: QuestionCategory | null
): {
  title: string
  paragraphs: string[]
  keywords: string[]
  guidance: string
} => {
  const categoryInterp = getCategoryInterpretation(questionCategory)
  const numberMeanings = categoryInterp.numberMeanings
  const energyDescriptions = categoryInterp.energyDescriptions
  const guidanceThemes = categoryInterp.guidanceThemes
  
  const baseMeaning = numberMeanings[dailyNumber] || numberMeanings[1]
  const energyLevelDesc = energyLevel >= 70 ? 'high' : energyLevel >= 40 ? 'medium' : 'low'
  const energyDesc = energyDescriptions[energyLevelDesc]
  
  const categoryLabel = questionCategory === 'love' ? '感情' : 
                       questionCategory === 'career' ? '事业' : 
                       questionCategory === 'wealth' ? '财富' : 
                       questionCategory === 'self-growth' ? '成长' : '今日'
  
  const paragraphs: string[] = [
    `${categoryLabel}数字：${dailyNumber}。${baseMeaning}`,
    `能量状态：${energyLevel}/100。${energyDesc}`,
    `${categoryLabel}象征：${symbolTheme.name}。${symbolTheme.keywords.join(' · ')}。`,
    `当前心情「${mood}」与意图「${intention || '无'}」正在与宇宙能量产生共鸣。`
  ]
  
  const elementDescription = symbolTheme.element === 'fire' ? '火焰般的热情' : 
                              symbolTheme.element === 'water' ? '水般的流动' : 
                              symbolTheme.element === 'earth' ? '大地般的稳固' : '风般的自由'
  
  const guidanceMessages = [
    ...guidanceThemes,
    `深呼吸，感受${elementDescription}在你体内流动。`,
    `保持正念，观察生活中的同步性，它们可能是宇宙给你的讯息。`
  ]
  
  const guidanceIndex = (dailyNumber + energyLevel) % guidanceMessages.length
  const guidance = guidanceMessages[guidanceIndex]
  
  const keywords = [
    `数字${dailyNumber}`,
    symbolTheme.name,
    ...symbolTheme.keywords.slice(0, 2),
    energyLevel >= 70 ? '高能量' : energyLevel >= 40 ? '中能量' : '低能量'
  ]
  
  const title = getCategoryTitle(questionCategory, symbolTheme.name, dailyNumber)
  
  return {
    title,
    paragraphs,
    keywords,
    guidance
  }
}

export const performDailyRitual = (input: DailyRitualInput): DailyRitualResult => {
  const { name, birthDate, questionCategory, mood, intention, selectedRune, timestamp } = input
  
  const dailyNumber = calculateDailyNumber(birthDate, timestamp)
  const energyLevel = calculateEnergyLevel(mood, selectedRune, dailyNumber, intention)
  const symbolTheme = determineSymbolTheme(dailyNumber, energyLevel, timestamp, selectedRune)
  const geometry = generateDailyGeometry(dailyNumber, energyLevel)
  const interpretation = generateDailyInterpretation(
    dailyNumber,
    energyLevel,
    symbolTheme,
    mood,
    intention,
    questionCategory
  )
  
  return {
    id: generateId(),
    type: 'daily-ritual',
    input,
    dailyNumber,
    energyLevel,
    symbolTheme: symbolTheme.name,
    symbolKeywords: symbolTheme.keywords,
    interpretation,
    geometry,
    createdAt: timestamp,
    dateKey: getDateKey(timestamp)
  }
}

export const getTodayDateKey = (): string => {
  return getDateKey(Date.now())
}

export const calculateConsecutiveStreak = (dates: string[]): number => {
  if (dates.length === 0) return 0
  
  const sortedDates = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let streak = 0
  let currentDate = new Date(today)
  
  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(currentDate)
    checkDate.setHours(0, 0, 0, 0)
    const dateKey = getDateKey(checkDate.getTime())
    
    if (sortedDates.includes(dateKey)) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (i === 0) {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayKey = getDateKey(yesterday.getTime())
      if (sortedDates.includes(yesterdayKey)) {
        streak++
        currentDate = new Date(yesterday)
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    } else {
      break
    }
  }
  
  return streak
}

export const calculateCycleData = (records: DailyRitualResult[]): {
  weekEnergy: number[]
  trend: 'rising' | 'stable' | 'falling'
  averageEnergy: number
} => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const weekEnergy: number[] = []
  
  for (let i = 6; i >= 0; i--) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const dateKey = getDateKey(checkDate.getTime())
    
    const record = records.find(r => r.dateKey === dateKey)
    weekEnergy.push(record ? record.energyLevel : 0)
  }
  
  const nonZeroEnergy = weekEnergy.filter(e => e > 0)
  const averageEnergy = nonZeroEnergy.length > 0
    ? Math.round(nonZeroEnergy.reduce((a, b) => a + b, 0) / nonZeroEnergy.length)
    : 0
  
  let trend: 'rising' | 'stable' | 'falling' = 'stable'
  const recentEnergy = weekEnergy.filter(e => e > 0).slice(-3)
  if (recentEnergy.length >= 2) {
    const diff = recentEnergy[recentEnergy.length - 1] - recentEnergy[0]
    if (diff > 10) trend = 'rising'
    else if (diff < -10) trend = 'falling'
  }
  
  return { weekEnergy, trend, averageEnergy }
}

export const getMostFrequentThemes = (records: DailyRitualResult[], limit: number = 5): { theme: string; count: number; keywords: string[] }[] => {
  const themeCounts: Record<string, { count: number; keywords: string[] }> = {}
  
  records.forEach(record => {
    if (!themeCounts[record.symbolTheme]) {
      themeCounts[record.symbolTheme] = { count: 0, keywords: [] }
    }
    themeCounts[record.symbolTheme].count++
    record.symbolKeywords.forEach(kw => {
      if (!themeCounts[record.symbolTheme].keywords.includes(kw)) {
        themeCounts[record.symbolTheme].keywords.push(kw)
      }
    })
  })
  
  return Object.entries(themeCounts)
    .map(([theme, data]) => ({ theme, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
