import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { performDreamInterpretation } from '@/algorithms/dreamInterpretation'
import { saveDreamInterpretationResult, getDreamInterpretationRecordById } from '@/utils/storage'
import type { DreamInterpretationInput, DreamInterpretationResult } from '@/types'

export const useDreamInterpretationStore = defineStore('dreamInterpretation', () => {
  const name = ref('')
  const birthDate = ref('')
  const dreamContent = ref('')
  const dreamMood = ref('')
  const currentResult = ref<DreamInterpretationResult | null>(null)
  const isCalculating = ref(false)
  const calculationProgress = ref(0)

  const moodOptions = [
    { value: '', label: '请选择梦中的情绪基调' },
    { value: '开心快乐兴奋喜悦', label: '😊 愉悦开心' },
    { value: '害怕恐惧焦虑不安', label: '😨 恐惧害怕' },
    { value: '难过悲伤失落痛苦', label: '😢 悲伤难过' },
    { value: '生气愤怒不满烦躁', label: '😠 愤怒生气' },
    { value: '惊讶意外震惊', label: '😮 惊讶意外' },
    { value: '平静安宁放松舒适', label: '😌 平静安宁' },
    { value: '困惑迷茫混乱疑惑', label: '😕 困惑迷茫' },
    { value: '想念思念渴望向往', label: '🥺 思念渴望' }
  ]

  const canStartCalculation = computed(() => {
    return name.value.trim().length > 0 &&
           birthDate.value.length > 0 &&
           dreamContent.value.trim().length >= 10 &&
           dreamMood.value.length > 0
  })

  const startCalculation = async () => {
    if (!canStartCalculation.value) return

    isCalculating.value = true
    calculationProgress.value = 0

    const input: DreamInterpretationInput = {
      name: name.value.trim(),
      birthDate: birthDate.value,
      dreamContent: dreamContent.value.trim(),
      dreamMood: dreamMood.value,
      timestamp: Date.now()
    }

    await new Promise<void>((resolve) => {
      const totalSteps = 18
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

    const result = performDreamInterpretation(input)
    calculationProgress.value = 100

    await new Promise(resolve => setTimeout(resolve, 300))

    currentResult.value = result
    saveDreamInterpretationResult(result)
    isCalculating.value = false

    return result
  }

  const loadResult = (id: string): boolean => {
    const result = getDreamInterpretationRecordById(id)
    if (result) {
      currentResult.value = result
      name.value = result.input.name
      birthDate.value = result.input.birthDate
      dreamContent.value = result.input.dreamContent
      dreamMood.value = result.input.dreamMood
      return true
    }
    return false
  }

  const reset = () => {
    name.value = ''
    birthDate.value = ''
    dreamContent.value = ''
    dreamMood.value = ''
    currentResult.value = null
    isCalculating.value = false
    calculationProgress.value = 0
  }

  return {
    name,
    birthDate,
    dreamContent,
    dreamMood,
    currentResult,
    isCalculating,
    calculationProgress,
    moodOptions,
    canStartCalculation,
    startCalculation,
    loadResult,
    reset
  }
})
