import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { performDailyRitual, getTodayDateKey, calculateConsecutiveStreak, calculateCycleData, getMostFrequentThemes } from '@/algorithms/dailyRitual'
import { questionCategories } from '@/algorithms/questionCategory'
import { saveDailyRitualResult, getAllDailyRitualRecords, getDailyRitualRecordByDate } from '@/utils/storage'
import type { DailyRitualInput, DailyRitualResult, Rune, QuestionCategory, QuestionCategoryOption } from '@/types'

type RitualPhase = 'intro' | 'category' | 'mood' | 'intention' | 'rune' | 'calculating' | 'complete'

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

const moodOptions = [
  { value: '平静', emoji: '😌' },
  { value: '愉悦', emoji: '😊' },
  { value: '兴奋', emoji: '🤩' },
  { value: '焦虑', emoji: '😰' },
  { value: '疲惫', emoji: '😴' },
  { value: '悲伤', emoji: '😢' },
  { value: '愤怒', emoji: '😠' },
  { value: '好奇', emoji: '🤔' },
  { value: '感恩', emoji: '🙏' },
  { value: '专注', emoji: '🧘' }
]

export const useDailyRitualStore = defineStore('dailyRitual', () => {
  const phase = ref<RitualPhase>('intro')
  const name = ref('')
  const birthDate = ref('')
  const questionCategory = ref<QuestionCategory | null>(null)
  const mood = ref('')
  const intention = ref('')
  const selectedRune = ref<number | null>(null)
  const currentResult = ref<DailyRitualResult | null>(null)
  const isCalculating = ref(false)
  const calculationProgress = ref(0)
  const todayRecord = ref<DailyRitualResult | null>(null)

  const runes = ref<Rune[]>(runesData)
  const moods = moodOptions
  const categories = ref<QuestionCategoryOption[]>(questionCategories)

  const hasCheckedInToday = computed(() => {
    const todayKey = getTodayDateKey()
    return getDailyRitualRecordByDate(todayKey) !== null
  })

  const allRecords = computed(() => {
    return getAllDailyRitualRecords()
  })

  const ritualDates = computed(() => {
    return allRecords.value.map(r => r.dateKey)
  })

  const consecutiveStreak = computed(() => {
    return calculateConsecutiveStreak(ritualDates.value)
  })

  const cycleData = computed(() => {
    return calculateCycleData(allRecords.value)
  })

  const frequentThemes = computed(() => {
    return getMostFrequentThemes(allRecords.value, 5)
  })

  const totalRituals = computed(() => {
    return allRecords.value.length
  })

  const canProceedToCategory = computed(() => {
    return true
  })

  const canProceedToMood = computed(() => {
    return questionCategory.value !== null
  })

  const canProceedToIntention = computed(() => {
    return mood.value.length > 0
  })

  const canProceedToRune = computed(() => {
    return intention.value.trim().length >= 0
  })

  const canStartCalculation = computed(() => {
    return selectedRune.value !== null
  })

  const loadTodayRecord = () => {
    const todayKey = getTodayDateKey()
    todayRecord.value = getDailyRitualRecordByDate(todayKey)
    if (todayRecord.value) {
      currentResult.value = todayRecord.value
      questionCategory.value = todayRecord.value.input.questionCategory
      phase.value = 'complete'
    }
  }

  const setQuestionCategory = (category: QuestionCategory) => {
    questionCategory.value = category
  }

  const setMood = (moodValue: string) => {
    mood.value = moodValue
  }

  const setIntention = (intentionValue: string) => {
    intention.value = intentionValue
  }

  const selectRune = (runeId: number) => {
    selectedRune.value = runeId
  }

  const nextPhase = () => {
    if (phase.value === 'intro') {
      if (hasCheckedInToday.value) {
        loadTodayRecord()
        return
      }
      phase.value = 'category'
    } else if (phase.value === 'category' && canProceedToMood.value) {
      phase.value = 'mood'
    } else if (phase.value === 'mood' && canProceedToIntention.value) {
      phase.value = 'intention'
    } else if (phase.value === 'intention') {
      phase.value = 'rune'
    } else if (phase.value === 'rune' && canStartCalculation.value) {
      phase.value = 'calculating'
      startCalculation()
    }
  }

  const prevPhase = () => {
    if (phase.value === 'category') {
      phase.value = 'intro'
    } else if (phase.value === 'mood') {
      phase.value = 'category'
    } else if (phase.value === 'intention') {
      phase.value = 'mood'
    } else if (phase.value === 'rune') {
      phase.value = 'intention'
    }
  }

  const startCalculation = async () => {
    isCalculating.value = true
    calculationProgress.value = 0

    const input: DailyRitualInput = {
      name: name.value.trim() || 'Anonymous',
      birthDate: birthDate.value || '1990-01-01',
      questionCategory: questionCategory.value,
      mood: mood.value,
      intention: intention.value.trim(),
      selectedRune: selectedRune.value!,
      timestamp: Date.now()
    }

    await new Promise<void>((resolve) => {
      const totalSteps = 12
      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        calculationProgress.value = Math.min((currentStep / totalSteps) * 100, 95)
        if (currentStep >= totalSteps) {
          clearInterval(interval)
          resolve()
        }
      }, 120)
    })

    const result = performDailyRitual(input)
    calculationProgress.value = 100

    await new Promise(resolve => setTimeout(resolve, 200))

    currentResult.value = result
    saveDailyRitualResult(result)
    phase.value = 'complete'
    isCalculating.value = false
  }

  const reset = () => {
    phase.value = 'intro'
    name.value = ''
    birthDate.value = ''
    questionCategory.value = null
    mood.value = ''
    intention.value = ''
    selectedRune.value = null
    currentResult.value = null
    isCalculating.value = false
    calculationProgress.value = 0
    todayRecord.value = null
  }

  const setUserInfo = (userName: string, userBirthDate: string) => {
    name.value = userName
    birthDate.value = userBirthDate
  }

  return {
    phase,
    name,
    birthDate,
    questionCategory,
    mood,
    intention,
    selectedRune,
    currentResult,
    isCalculating,
    calculationProgress,
    todayRecord,
    runes,
    moods,
    categories,
    hasCheckedInToday,
    allRecords,
    ritualDates,
    consecutiveStreak,
    cycleData,
    frequentThemes,
    totalRituals,
    canProceedToCategory,
    canProceedToMood,
    canProceedToIntention,
    canProceedToRune,
    canStartCalculation,
    loadTodayRecord,
    setQuestionCategory,
    setMood,
    setIntention,
    selectRune,
    nextPhase,
    prevPhase,
    startCalculation,
    reset,
    setUserInfo
  }
})
