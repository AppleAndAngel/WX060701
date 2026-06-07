import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { performCareerChoice } from '@/algorithms/careerChoice'
import { saveCareerChoiceResult, getCareerChoiceRecordById } from '@/utils/storage'
import type { CareerChoiceInput, CareerChoiceResult, CareerChoiceOption } from '@/types'

type CareerChoicePhase = 'input' | 'calculating' | 'complete'

export const useCareerChoiceStore = defineStore('careerChoice', () => {
  const phase = ref<CareerChoicePhase>('input')
  const name = ref('')
  const birthDate = ref('')
  const optionA = ref<CareerChoiceOption>({ name: '', description: '' })
  const optionB = ref<CareerChoiceOption>({ name: '', description: '' })
  const currentResult = ref<CareerChoiceResult | null>(null)
  const isCalculating = ref(false)
  const calculationProgress = ref(0)
  const calculationStepIndex = ref(0)
  const careerChoiceTimestamp = ref<number>(0)

  const canStartCalculation = computed(() => {
    return name.value.trim().length > 0 &&
           birthDate.value.length > 0 &&
           optionA.value.name.trim().length > 0 &&
           optionB.value.name.trim().length > 0
  })

  const updateOptionA = (field: keyof CareerChoiceOption, value: string) => {
    optionA.value[field] = value
  }

  const updateOptionB = (field: keyof CareerChoiceOption, value: string) => {
    optionB.value[field] = value
  }

  const swapOptions = () => {
    const temp = { ...optionA.value }
    optionA.value = { ...optionB.value }
    optionB.value = temp
  }

  const startCalculation = async () => {
    if (!canStartCalculation.value) return

    phase.value = 'calculating'
    isCalculating.value = true
    calculationProgress.value = 0
    calculationStepIndex.value = 0
    careerChoiceTimestamp.value = Date.now()

    const input: CareerChoiceInput = {
      name: name.value.trim(),
      birthDate: birthDate.value,
      optionA: { ...optionA.value, name: optionA.value.name.trim(), description: optionA.value.description.trim() },
      optionB: { ...optionB.value, name: optionB.value.name.trim(), description: optionB.value.description.trim() },
      timestamp: careerChoiceTimestamp.value
    }

    await new Promise<void>((resolve) => {
      const totalSteps = 35
      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        calculationProgress.value = Math.min((currentStep / totalSteps) * 100, 95)
        calculationStepIndex.value = currentStep
        if (currentStep >= totalSteps) {
          clearInterval(interval)
          resolve()
        }
      }, 120)
    })

    const result = performCareerChoice(input)
    calculationProgress.value = 100

    await new Promise(resolve => setTimeout(resolve, 300))

    currentResult.value = result
    saveCareerChoiceResult(result)
    phase.value = 'complete'
    isCalculating.value = false
  }

  const loadResult = (id: string): boolean => {
    const result = getCareerChoiceRecordById(id)
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
    optionA.value = { name: '', description: '' }
    optionB.value = { name: '', description: '' }
    currentResult.value = null
    isCalculating.value = false
    calculationProgress.value = 0
    calculationStepIndex.value = 0
    careerChoiceTimestamp.value = 0
  }

  return {
    phase,
    name,
    birthDate,
    optionA,
    optionB,
    currentResult,
    isCalculating,
    calculationProgress,
    calculationStepIndex,
    careerChoiceTimestamp,
    canStartCalculation,
    updateOptionA,
    updateOptionB,
    swapOptions,
    startCalculation,
    loadResult,
    reset
  }
})
