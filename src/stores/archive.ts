import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAllArchiveRecords, deleteArchiveRecord, clearAllArchiveRecords } from '@/utils/storage'
import type { ArchiveRecord, DivinationResult, SynastryResult } from '@/types'

export const useArchiveStore = defineStore('archive', () => {
  const records = ref<ArchiveRecord[]>([])
  const isLoading = ref(false)

  const recordCount = computed(() => records.value.length)
  const divinationCount = computed(() => records.value.filter(r => !('type' in r) || r.type !== 'synastry').length)
  const synastryCount = computed(() => records.value.filter(r => 'type' in r && r.type === 'synastry').length)

  const isSynastryRecord = (r: ArchiveRecord): r is SynastryResult => {
    return 'type' in r && r.type === 'synastry'
  }

  const isDivinationRecord = (r: ArchiveRecord): r is DivinationResult => {
    return !('type' in r) || r.type !== 'synastry'
  }

  const numberStats = computed(() => {
    const stats: Record<number, number> = {}
    records.value.forEach(r => {
      let nums: number[] = []
      if (isDivinationRecord(r)) {
        nums = [r.coreNumbers.lifePath, r.coreNumbers.destiny, r.coreNumbers.soul, r.coreNumbers.personality]
      } else if (isSynastryRecord(r)) {
        nums = [
          r.personANumbers.lifePath, r.personANumbers.destiny, r.personANumbers.soul, r.personANumbers.personality,
          r.personBNumbers.lifePath, r.personBNumbers.destiny, r.personBNumbers.soul, r.personBNumbers.personality
        ]
      }
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

  const relationshipStats = computed(() => {
    const stats: Record<string, number> = {}
    records.value.forEach(r => {
      if (isSynastryRecord(r)) {
        const type = r.input.relationshipType
        stats[type] = (stats[type] || 0) + 1
      }
    })
    return stats
  })

  const loadRecords = () => {
    isLoading.value = true
    records.value = getAllArchiveRecords()
    isLoading.value = false
  }

  const removeRecord = (id: string) => {
    deleteArchiveRecord(id)
    records.value = records.value.filter(r => r.id !== id)
  }

  const clearAll = () => {
    clearAllArchiveRecords()
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
    divinationCount,
    synastryCount,
    numberStats,
    geometryStats,
    relationshipStats,
    isSynastryRecord,
    isDivinationRecord,
    loadRecords,
    removeRecord,
    clearAll,
    getMostFrequentNumber
  }
})
