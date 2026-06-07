import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAllRecords, deleteRecord, clearAllRecords } from '@/utils/storage'
import type { DivinationResult } from '@/types'

export const useArchiveStore = defineStore('archive', () => {
  const records = ref<DivinationResult[]>([])
  const isLoading = ref(false)

  const recordCount = computed(() => records.value.length)

  const numberStats = computed(() => {
    const stats: Record<number, number> = {}
    records.value.forEach(r => {
      const nums = [r.coreNumbers.lifePath, r.coreNumbers.destiny, r.coreNumbers.soul, r.coreNumbers.personality]
      nums.forEach(n => {
        stats[n] = (stats[n] || 0) + 1
      })
    })
    return stats
  })

  const geometryStats = computed(() => {
    const stats: Record<string, number> = {}
    records.value.forEach(r => {
      stats[r.geometry.type] = (stats[r.geometry.type] || 0) + 1
    })
    return stats
  })

  const loadRecords = () => {
    isLoading.value = true
    records.value = getAllRecords()
    isLoading.value = false
  }

  const removeRecord = (id: string) => {
    deleteRecord(id)
    records.value = records.value.filter(r => r.id !== id)
  }

  const clearAll = () => {
    clearAllRecords()
    records.value = []
  }

  const getMostFrequentNumber = (): number | null => {
    let max = 0
    let result: number | null = null
    Object.entries(numberStats.value).forEach(([num, count]) => {
      if (count > max) {
        max = count
        result = parseInt(num, 10)
      }
    })
    return result
  }

  return {
    records,
    isLoading,
    recordCount,
    numberStats,
    geometryStats,
    loadRecords,
    removeRecord,
    clearAll,
    getMostFrequentNumber
  }
})
