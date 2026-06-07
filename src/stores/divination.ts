import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { performDivination } from '@/algorithms/divination'
import { saveResult, getRecordById } from '@/utils/storage'
import { DeterministicRandom, hashString } from '@/utils/math'
import type { DivinationInput, DivinationResult, RitualPhase, Rune, StarPoint } from '@/types'

const runesData: Rune[] = [
  { id: 1, name: '法胡', symbol: 'ᚠ', meaning: '财富、成就' },
  { id: 2, name: '乌鲁兹', symbol: 'ᚢ', meaning: '力量、勇气' },
  { id: 3, name: '图里萨兹', symbol: 'ᚦ', meaning: '防御、突破' },
  { id: 4, name: '安苏兹', symbol: 'ᚨ', meaning: '智慧、沟通' },
  { id: 5, name: '莱多', symbol: 'ᚱ', meaning: '旅程、方向' },
  { id: 6, name: '卡诺', symbol: 'ᚲ', meaning: '光明、启示' },
  { id: 7, name: '吉波', symbol: 'ᚷ', meaning: '礼物、交换' },
  { id: 8, name: '维纽', symbol: 'ᚹ', meaning: '喜悦、和谐' },
  { id: 9, name: '哈格拉兹', symbol: 'ᚺ', meaning: '变化、转化' }
]

export const useDivinationStore = defineStore('divination', () => {
  const phase = ref<RitualPhase>('input')
  const name = ref('')
  const birthDate = ref('')
  const query = ref('')
  const selectedRunes = ref<number[]>([])
  const starPoints = ref<StarPoint[]>([])
  const starConnections = ref<number[][]>([])
  const currentResult = ref<DivinationResult | null>(null)
  const isCalculating = ref(false)
  const calculationProgress = ref(0)
  const calculationStepIndex = ref(0)
  const divinationTimestamp = ref<number>(0)

  const runes = ref<Rune[]>(runesData)

  const canProceedToRunes = computed(() => {
    return name.value.trim().length > 0 && 
           birthDate.value.length > 0
  })

  const canProceedToStars = computed(() => {
    return selectedRunes.value.length >= 3
  })

  const canStartCalculation = computed(() => {
    return starConnections.value.length >= 2
  })

  const initStarPoints = (width: number, height: number) => {
    const seed = `${name.value}-${birthDate.value}-${divinationTimestamp.value}`
    const rng = new DeterministicRandom(seed)
    const points: StarPoint[] = []
    const count = 7
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2
      const radius = Math.min(width, height) * 0.3
      points.push({
        id: i,
        x: width / 2 + Math.cos(angle) * radius + (rng.next() - 0.5) * 40,
        y: height / 2 + Math.sin(angle) * radius + (rng.next() - 0.5) * 40,
        connected: false
      })
    }
    starPoints.value = points
    starConnections.value = []
  }

  const toggleRune = (runeId: number) => {
    const index = selectedRunes.value.indexOf(runeId)
    if (index > -1) {
      selectedRunes.value.splice(index, 1)
    } else if (selectedRunes.value.length < 5) {
      selectedRunes.value.push(runeId)
    }
  }

  const addStarConnection = (fromId: number, toId: number) => {
    const exists = starConnections.value.some(
      c => (c[0] === fromId && c[1] === toId) || (c[0] === toId && c[1] === fromId)
    )
    if (!exists && fromId !== toId) {
      starConnections.value.push([fromId, toId])
      const fromPoint = starPoints.value.find(p => p.id === fromId)
      const toPoint = starPoints.value.find(p => p.id === toId)
      if (fromPoint) fromPoint.connected = true
      if (toPoint) toPoint.connected = true
    }
  }

  const removeLastStarConnection = () => {
    const removed = starConnections.value.pop()
    if (removed) {
      const [fromId, toId] = removed
      const hasOtherFrom = starConnections.value.some(c => c.includes(fromId))
      const hasOtherTo = starConnections.value.some(c => c.includes(toId))
      if (!hasOtherFrom) {
        const fromPoint = starPoints.value.find(p => p.id === fromId)
        if (fromPoint) fromPoint.connected = false
      }
      if (!hasOtherTo) {
        const toPoint = starPoints.value.find(p => p.id === toId)
        if (toPoint) toPoint.connected = false
      }
    }
  }

  const nextPhase = () => {
    if (phase.value === 'input' && canProceedToRunes.value) {
      phase.value = 'runes'
    } else if (phase.value === 'runes' && canProceedToStars.value) {
      if (divinationTimestamp.value === 0) {
        divinationTimestamp.value = Date.now()
      }
      phase.value = 'stars'
    } else if (phase.value === 'stars' && canStartCalculation.value) {
      phase.value = 'calculating'
      startCalculation()
    }
  }

  const prevPhase = () => {
    if (phase.value === 'runes') {
      phase.value = 'input'
    } else if (phase.value === 'stars') {
      phase.value = 'runes'
    }
  }

  const startCalculation = async () => {
    isCalculating.value = true
    calculationProgress.value = 0
    calculationStepIndex.value = 0

    const input: DivinationInput = {
      name: name.value.trim(),
      birthDate: birthDate.value,
      query: query.value.trim(),
      selectedRunes: selectedRunes.value,
      starConnection: starConnections.value,
      timestamp: divinationTimestamp.value > 0 ? divinationTimestamp.value : Date.now()
    }

    await new Promise<void>((resolve) => {
      const totalSteps = 20
      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        calculationProgress.value = Math.min((currentStep / totalSteps) * 100, 95)
        calculationStepIndex.value = currentStep
        if (currentStep >= totalSteps) {
          clearInterval(interval)
          resolve()
        }
      }, 150)
    })

    const result = performDivination(input)
    calculationProgress.value = 100
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    currentResult.value = result
    saveResult(result)
    phase.value = 'complete'
    isCalculating.value = false
  }

  const loadResult = (id: string): boolean => {
    const result = getRecordById(id)
    if (result) {
      currentResult.value = result
      return true
    }
    return false
  }

  const reset = () => {
    phase.value = 'input'
    name.value = ''
    birthDate.value = ''
    query.value = ''
    selectedRunes.value = []
    starPoints.value = []
    starConnections.value = []
    currentResult.value = null
    isCalculating.value = false
    calculationProgress.value = 0
    calculationStepIndex.value = 0
    divinationTimestamp.value = 0
  }

  return {
    phase,
    name,
    birthDate,
    query,
    selectedRunes,
    starPoints,
    starConnections,
    currentResult,
    isCalculating,
    calculationProgress,
    calculationStepIndex,
    divinationTimestamp,
    runes,
    canProceedToRunes,
    canProceedToStars,
    canStartCalculation,
    initStarPoints,
    toggleRune,
    addStarConnection,
    removeLastStarConnection,
    nextPhase,
    prevPhase,
    startCalculation,
    loadResult,
    reset
  }
})
