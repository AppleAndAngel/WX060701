import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { performYearlyDivination } from '@/algorithms/yearly'
import { saveYearlyResult, getYearlyRecordById } from '@/utils/storage'
import type { YearlyDivinationInput, YearlyResult } from '@/types'

export const useYearlyStore = defineStore('yearly', () => {
  const name = ref('')
  const birthDate = ref('')
  const targetYear = ref<number>(new Date().getFullYear())
  const currentResult = ref<YearlyResult | null>(null)
  const isCalculating = ref(false)
  const calculationProgress = ref(0)

  const canStartCalculation = computed(() => {
    return name.value.trim().length > 0 && 
           birthDate.value.length > 0 &&
           targetYear.value > 0
  })

  const startCalculation = async () => {
    if (!canStartCalculation.value) return

    isCalculating.value = true
    calculationProgress.value = 0

    const input: YearlyDivinationInput = {
      name: name.value.trim(),
      birthDate: birthDate.value,
      targetYear: targetYear.value,
      timestamp: Date.now()
    }

    await new Promise<void>((resolve) => {
      const totalSteps = 15
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

    const result = performYearlyDivination(input)
    calculationProgress.value = 100

    await new Promise(resolve => setTimeout(resolve, 300))

    currentResult.value = result
    saveYearlyResult(result)
    isCalculating.value = false

    return result
  }

  const loadResult = (id: string): boolean => {
    const result = getYearlyRecordById(id)
    if (result) {
      currentResult.value = result
      name.value = result.input.name
      birthDate.value = result.input.birthDate
      targetYear.value = result.input.targetYear
      return true
    }
    return false
  }

  const reset = () => {
    name.value = ''
    birthDate.value = ''
    targetYear.value = new Date().getFullYear()
    currentResult.value = null
    isCalculating.value = false
    calculationProgress.value = 0
  }

  return {
    name,
    birthDate,
    targetYear,
    currentResult,
    isCalculating,
    calculationProgress,
    canStartCalculation,
    startCalculation,
    loadResult,
    reset
  }
})
