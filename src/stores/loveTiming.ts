import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { performLoveTiming } from '@/algorithms/loveTiming'
import { saveLoveTimingResult, getLoveTimingRecordById } from '@/utils/storage'
import type { LoveTimingInput, LoveTimingResult, LoveTimingScenario } from '@/types'

type LoveTimingPhase = 'input' | 'calculating' | 'complete'

export const useLoveTimingStore = defineStore('loveTiming', () => {
  const phase = ref<LoveTimingPhase>('input')
  const yourName = ref('')
  const yourBirthDate = ref('')
  const theirName = ref('')
  const theirBirthDate = ref('')
  const scenario = ref<LoveTimingScenario>('progression')
  const currentSituation = ref('')
  const currentResult = ref<LoveTimingResult | null>(null)
  const isCalculating = ref(false)
  const calculationProgress = ref(0)
  const calculationStepIndex = ref(0)
  const loveTimingTimestamp = ref<number>(0)

  const canStartCalculation = computed(() => {
    return yourName.value.trim().length > 0 &&
           yourBirthDate.value.length > 0 &&
           theirName.value.trim().length > 0 &&
           theirBirthDate.value.length > 0
  })

  const setScenario = (s: LoveTimingScenario) => {
    scenario.value = s
  }

  const startCalculation = async () => {
    if (!canStartCalculation.value) return

    phase.value = 'calculating'
    isCalculating.value = true
    calculationProgress.value = 0
    calculationStepIndex.value = 0
    loveTimingTimestamp.value = Date.now()

    const input: LoveTimingInput = {
      yourName: yourName.value.trim(),
      yourBirthDate: yourBirthDate.value,
      theirName: theirName.value.trim(),
      theirBirthDate: theirBirthDate.value,
      scenario: scenario.value,
      currentSituation: currentSituation.value.trim(),
      timestamp: loveTimingTimestamp.value
    }

    await new Promise<void>((resolve) => {
      const totalSteps = 40
      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        calculationProgress.value = Math.min((currentStep / totalSteps) * 100, 95)
        calculationStepIndex.value = currentStep
        if (currentStep >= totalSteps) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    })

    const result = performLoveTiming(input)
    calculationProgress.value = 100

    await new Promise(resolve => setTimeout(resolve, 300))

    currentResult.value = result
    saveLoveTimingResult(result)
    phase.value = 'complete'
    isCalculating.value = false
  }

  const loadResult = (id: string): boolean => {
    const result = getLoveTimingRecordById(id)
    if (result) {
      currentResult.value = result
      return true
    }
    return false
  }

  const reset = () => {
    phase.value = 'input'
    yourName.value = ''
    yourBirthDate.value = ''
    theirName.value = ''
    theirBirthDate.value = ''
    scenario.value = 'progression'
    currentSituation.value = ''
    currentResult.value = null
    isCalculating.value = false
    calculationProgress.value = 0
    calculationStepIndex.value = 0
    loveTimingTimestamp.value = 0
  }

  return {
    phase,
    yourName,
    yourBirthDate,
    theirName,
    theirBirthDate,
    scenario,
    currentSituation,
    currentResult,
    isCalculating,
    calculationProgress,
    calculationStepIndex,
    loveTimingTimestamp,
    canStartCalculation,
    setScenario,
    startCalculation,
    loadResult,
    reset
  }
})
