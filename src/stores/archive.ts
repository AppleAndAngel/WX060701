import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAllArchiveRecords, deleteArchiveRecord, clearAllArchiveRecords, getAllDailyRitualRecords, getAllDreamInterpretationRecords, getAllTimeCapsuleRecords } from '@/utils/storage'
import { calculateConsecutiveStreak, calculateCycleData, getMostFrequentThemes } from '@/algorithms/dailyRitual'
import type { ArchiveRecord, DivinationResult, SynastryResult, YearlyResult, CareerChoiceResult, LoveTimingResult, DailyRitualResult, DreamInterpretationResult, TimeCapsuleResult } from '@/types'

export const useArchiveStore = defineStore('archive', () => {
  const records = ref<ArchiveRecord[]>([])
  const isLoading = ref(false)

  const dailyRitualRecords = computed<DailyRitualResult[]>(() => {
    return getAllDailyRitualRecords()
  })

  const recordCount = computed(() => records.value.length)
  const divinationCount = computed(() => records.value.filter(r => isDivinationRecord(r)).length)
  const synastryCount = computed(() => records.value.filter(r => isSynastryRecord(r)).length)
  const yearlyCount = computed(() => records.value.filter(r => isYearlyRecord(r)).length)
  const careerChoiceCount = computed(() => records.value.filter(r => isCareerChoiceRecord(r)).length)
  const loveTimingCount = computed(() => records.value.filter(r => isLoveTimingRecord(r)).length)
  const dailyRitualCount = computed(() => records.value.filter(r => isDailyRitualRecord(r)).length)
  const dreamInterpretationCount = computed(() => records.value.filter(r => isDreamInterpretationRecord(r)).length)
  const timeCapsuleCount = computed(() => records.value.filter(r => isTimeCapsuleRecord(r)).length)

  const isSynastryRecord = (r: ArchiveRecord): r is SynastryResult => {
    return 'type' in r && r.type === 'synastry'
  }

  const isDivinationRecord = (r: ArchiveRecord): r is DivinationResult => {
    return !('type' in r)
  }

  const isYearlyRecord = (r: ArchiveRecord): r is YearlyResult => {
    return 'type' in r && r.type === 'yearly'
  }

  const isCareerChoiceRecord = (r: ArchiveRecord): r is CareerChoiceResult => {
    return 'type' in r && r.type === 'career-choice'
  }

  const isLoveTimingRecord = (r: ArchiveRecord): r is LoveTimingResult => {
    return 'type' in r && r.type === 'love-timing'
  }

  const isDailyRitualRecord = (r: ArchiveRecord): r is DailyRitualResult => {
    return 'type' in r && r.type === 'daily-ritual'
  }

  const isDreamInterpretationRecord = (r: ArchiveRecord): r is DreamInterpretationResult => {
    return 'type' in r && r.type === 'dream-interpretation'
  }

  const isTimeCapsuleRecord = (r: ArchiveRecord): r is TimeCapsuleResult => {
    return 'type' in r && r.type === 'time-capsule'
  }

  const consecutiveStreak = computed(() => {
    const dates = dailyRitualRecords.value.map(r => r.dateKey)
    return calculateConsecutiveStreak(dates)
  })

  const cycleData = computed(() => {
    return calculateCycleData(dailyRitualRecords.value)
  })

  const frequentThemes = computed(() => {
    return getMostFrequentThemes(dailyRitualRecords.value, 5)
  })

  const totalRituals = computed(() => {
    return dailyRitualRecords.value.length
  })

  const averageEnergy = computed(() => {
    if (dailyRitualRecords.value.length === 0) return 0
    const sum = dailyRitualRecords.value.reduce((acc, r) => acc + r.energyLevel, 0)
    return Math.round(sum / dailyRitualRecords.value.length)
  })

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
      } else if (isYearlyRecord(r)) {
        nums = [r.lifePathNumber, r.yearNumber]
      } else if (isCareerChoiceRecord(r)) {
        nums = [
          r.interpretation.pathA.coreNumbers.lifePath, r.interpretation.pathA.coreNumbers.destiny,
          r.interpretation.pathA.coreNumbers.soul, r.interpretation.pathA.coreNumbers.personality,
          r.interpretation.pathB.coreNumbers.lifePath, r.interpretation.pathB.coreNumbers.destiny,
          r.interpretation.pathB.coreNumbers.soul, r.interpretation.pathB.coreNumbers.personality
        ]
      } else if (isLoveTimingRecord(r)) {
        nums = [
          r.yourNumbers.lifePath, r.yourNumbers.destiny, r.yourNumbers.soul, r.yourNumbers.personality,
          r.theirNumbers.lifePath, r.theirNumbers.destiny, r.theirNumbers.soul, r.theirNumbers.personality
        ]
      } else if (isDailyRitualRecord(r)) {
        nums = [r.dailyNumber]
      } else if (isDreamInterpretationRecord(r)) {
        nums = [r.coreNumbers.lifePath, r.coreNumbers.destiny, r.coreNumbers.soul, r.coreNumbers.personality, r.dreamNumber]
      } else if (isTimeCapsuleRecord(r)) {
        nums = [r.coreNumbers.lifePath, r.coreNumbers.destiny, r.coreNumbers.soul, r.coreNumbers.personality]
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
    yearlyCount,
    careerChoiceCount,
    loveTimingCount,
    dailyRitualCount,
    dreamInterpretationCount,
    timeCapsuleCount,
    numberStats,
    geometryStats,
    relationshipStats,
    isSynastryRecord,
    isDivinationRecord,
    isYearlyRecord,
    isCareerChoiceRecord,
    isLoveTimingRecord,
    isDailyRitualRecord,
    isDreamInterpretationRecord,
    isTimeCapsuleRecord,
    consecutiveStreak,
    cycleData,
    frequentThemes,
    totalRituals,
    averageEnergy,
    dailyRitualRecords,
    loadRecords,
    removeRecord,
    clearAll,
    getMostFrequentNumber
  }
})
