import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { performSynastry } from '@/algorithms/synastry'
import { saveSynastryResult, getSynastryRecordById } from '@/utils/storage'
import type { SynastryInput, SynastryResult, PersonInfo } from '@/types'

type SynastryPhase = 'input' | 'calculating' | 'complete'

const relationshipTypes = [
  '恋人',
  '夫妻',
  '朋友',
  '合作伙伴',
  '家人',
  '知己',
  '师生'
]

export const useSynastryStore = defineStore('synastry', () => {
  const phase = ref<SynastryPhase>('input')
  const personA = ref<PersonInfo>({ name: '', birthDate: '' })
  const personB = ref<PersonInfo>({ name: '', birthDate: '' })
  const relationshipType = ref('恋人')
  const currentResult = ref<SynastryResult | null>(null)
  const isCalculating = ref(false)
  const calculationProgress = ref(0)
  const calculationStepIndex = ref(0)
  const synastryTimestamp = ref<number>(0)

  const canStartCalculation = computed(() => {
    return personA.value.name.trim().length > 0 &&
           personA.value.birthDate.length > 0 &&
           personB.value.name.trim().length > 0 &&
           personB.value.birthDate.length > 0
  })

  const updatePersonA = (field: keyof PersonInfo, value: string) => {
    personA.value[field] = value
  }

  const updatePersonB = (field: keyof PersonInfo, value: string) => {
    personB.value[field] = value
  }

  const swapPersons = () => {
    const temp = { ...personA.value }
    personA.value = { ...personB.value }
    personB.value = temp
  }

  const startCalculation = async () => {
    if (!canStartCalculation.value) return

    phase.value = 'calculating'
    isCalculating.value = true
    calculationProgress.value = 0
    calculationStepIndex.value = 0
    synastryTimestamp.value = Date.now()

    const input: SynastryInput = {
      personA: { ...personA.value, name: personA.value.name.trim() },
      personB: { ...personB.value, name: personB.value.name.trim() },
      relationshipType: relationshipType.value,
      timestamp: synastryTimestamp.value
    }

    await new Promise<void>((resolve) => {
      const totalSteps = 30
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

    const result = performSynastry(input)
    calculationProgress.value = 100

    await new Promise(resolve => setTimeout(resolve, 300))

    currentResult.value = result
    saveSynastryResult(result)
    phase.value = 'complete'
    isCalculating.value = false
  }

  const loadResult = (id: string): boolean => {
    const result = getSynastryRecordById(id)
    if (result) {
      currentResult.value = result
      return true
    }
    return false
  }

  const reset = () => {
    phase.value = 'input'
    personA.value = { name: '', birthDate: '' }
    personB.value = { name: '', birthDate: '' }
    relationshipType.value = '恋人'
    currentResult.value = null
    isCalculating.value = false
    calculationProgress.value = 0
    calculationStepIndex.value = 0
    synastryTimestamp.value = 0
  }

  return {
    phase,
    personA,
    personB,
    relationshipType,
    relationshipTypes,
    currentResult,
    isCalculating,
    calculationProgress,
    calculationStepIndex,
    synastryTimestamp,
    canStartCalculation,
    updatePersonA,
    updatePersonB,
    swapPersons,
    startCalculation,
    loadResult,
    reset
  }
})
