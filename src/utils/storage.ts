import type { DivinationResult, SynastryResult, ArchiveRecord, YearlyResult, CareerChoiceResult, LoveTimingResult, DailyRitualResult, DreamInterpretationResult, TimeCapsuleResult } from '@/types'
import { simpleEncrypt, simpleDecrypt } from './hash'

const STORAGE_KEY = 'divination_archive'
const SYNASTRY_STORAGE_KEY = 'synastry_archive'
const YEARLY_STORAGE_KEY = 'yearly_archive'
const CAREER_CHOICE_STORAGE_KEY = 'career_choice_archive'
const LOVE_TIMING_STORAGE_KEY = 'love_timing_archive'
const DAILY_RITUAL_STORAGE_KEY = 'daily_ritual_archive'
const DREAM_INTERPRETATION_STORAGE_KEY = 'dream_interpretation_archive'
const TIME_CAPSULE_STORAGE_KEY = 'time_capsule_archive'
const MAX_RECORDS = 50

export const saveResult = (result: DivinationResult): void => {
  const records = getAllRecords()
  records.unshift(result)
  if (records.length > MAX_RECORDS) {
    records.splice(MAX_RECORDS)
  }
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(STORAGE_KEY, encrypted)
}

export const getAllRecords = (): DivinationResult[] => {
  const encrypted = localStorage.getItem(STORAGE_KEY)
  if (!encrypted) return []
  try {
    const decrypted = simpleDecrypt(encrypted)
    return JSON.parse(decrypted) || []
  } catch {
    return []
  }
}

export const getRecordById = (id: string): DivinationResult | null => {
  const records = getAllRecords()
  return records.find(r => r.id === id) || null
}

export const deleteRecord = (id: string): void => {
  const records = getAllRecords().filter(r => r.id !== id)
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(STORAGE_KEY, encrypted)
}

export const clearAllRecords = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

export const saveSynastryResult = (result: SynastryResult): void => {
  const records = getAllSynastryRecords()
  records.unshift(result)
  if (records.length > MAX_RECORDS) {
    records.splice(MAX_RECORDS)
  }
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(SYNASTRY_STORAGE_KEY, encrypted)
}

export const getAllSynastryRecords = (): SynastryResult[] => {
  const encrypted = localStorage.getItem(SYNASTRY_STORAGE_KEY)
  if (!encrypted) return []
  try {
    const decrypted = simpleDecrypt(encrypted)
    return JSON.parse(decrypted) || []
  } catch {
    return []
  }
}

export const getSynastryRecordById = (id: string): SynastryResult | null => {
  const records = getAllSynastryRecords()
  return records.find(r => r.id === id) || null
}

export const deleteSynastryRecord = (id: string): void => {
  const records = getAllSynastryRecords().filter(r => r.id !== id)
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(SYNASTRY_STORAGE_KEY, encrypted)
}

export const clearAllSynastryRecords = (): void => {
  localStorage.removeItem(SYNASTRY_STORAGE_KEY)
}

export const saveYearlyResult = (result: YearlyResult): void => {
  const records = getAllYearlyRecords()
  records.unshift(result)
  if (records.length > MAX_RECORDS) {
    records.splice(MAX_RECORDS)
  }
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(YEARLY_STORAGE_KEY, encrypted)
}

export const getAllYearlyRecords = (): YearlyResult[] => {
  const encrypted = localStorage.getItem(YEARLY_STORAGE_KEY)
  if (!encrypted) return []
  try {
    const decrypted = simpleDecrypt(encrypted)
    return JSON.parse(decrypted) || []
  } catch {
    return []
  }
}

export const getYearlyRecordById = (id: string): YearlyResult | null => {
  const records = getAllYearlyRecords()
  return records.find(r => r.id === id) || null
}

export const deleteYearlyRecord = (id: string): void => {
  const records = getAllYearlyRecords().filter(r => r.id !== id)
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(YEARLY_STORAGE_KEY, encrypted)
}

export const clearAllYearlyRecords = (): void => {
  localStorage.removeItem(YEARLY_STORAGE_KEY)
}

export const saveCareerChoiceResult = (result: CareerChoiceResult): void => {
  const records = getAllCareerChoiceRecords()
  records.unshift(result)
  if (records.length > MAX_RECORDS) {
    records.splice(MAX_RECORDS)
  }
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(CAREER_CHOICE_STORAGE_KEY, encrypted)
}

export const getAllCareerChoiceRecords = (): CareerChoiceResult[] => {
  const encrypted = localStorage.getItem(CAREER_CHOICE_STORAGE_KEY)
  if (!encrypted) return []
  try {
    const decrypted = simpleDecrypt(encrypted)
    return JSON.parse(decrypted) || []
  } catch {
    return []
  }
}

export const getCareerChoiceRecordById = (id: string): CareerChoiceResult | null => {
  const records = getAllCareerChoiceRecords()
  return records.find(r => r.id === id) || null
}

export const deleteCareerChoiceRecord = (id: string): void => {
  const records = getAllCareerChoiceRecords().filter(r => r.id !== id)
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(CAREER_CHOICE_STORAGE_KEY, encrypted)
}

export const clearAllCareerChoiceRecords = (): void => {
  localStorage.removeItem(CAREER_CHOICE_STORAGE_KEY)
}

export const saveLoveTimingResult = (result: LoveTimingResult): void => {
  const records = getAllLoveTimingRecords()
  records.unshift(result)
  if (records.length > MAX_RECORDS) {
    records.splice(MAX_RECORDS)
  }
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(LOVE_TIMING_STORAGE_KEY, encrypted)
}

export const getAllLoveTimingRecords = (): LoveTimingResult[] => {
  const encrypted = localStorage.getItem(LOVE_TIMING_STORAGE_KEY)
  if (!encrypted) return []
  try {
    const decrypted = simpleDecrypt(encrypted)
    return JSON.parse(decrypted) || []
  } catch {
    return []
  }
}

export const getLoveTimingRecordById = (id: string): LoveTimingResult | null => {
  const records = getAllLoveTimingRecords()
  return records.find(r => r.id === id) || null
}

export const deleteLoveTimingRecord = (id: string): void => {
  const records = getAllLoveTimingRecords().filter(r => r.id !== id)
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(LOVE_TIMING_STORAGE_KEY, encrypted)
}

export const clearAllLoveTimingRecords = (): void => {
  localStorage.removeItem(LOVE_TIMING_STORAGE_KEY)
}

export const saveDailyRitualResult = (result: DailyRitualResult): void => {
  const records = getAllDailyRitualRecords()
  records.unshift(result)
  if (records.length > MAX_RECORDS) {
    records.splice(MAX_RECORDS)
  }
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(DAILY_RITUAL_STORAGE_KEY, encrypted)
}

export const getAllDailyRitualRecords = (): DailyRitualResult[] => {
  const encrypted = localStorage.getItem(DAILY_RITUAL_STORAGE_KEY)
  if (!encrypted) return []
  try {
    const decrypted = simpleDecrypt(encrypted)
    return JSON.parse(decrypted) || []
  } catch {
    return []
  }
}

export const getDailyRitualRecordById = (id: string): DailyRitualResult | null => {
  const records = getAllDailyRitualRecords()
  return records.find(r => r.id === id) || null
}

export const getDailyRitualRecordByDate = (dateKey: string): DailyRitualResult | null => {
  const records = getAllDailyRitualRecords()
  return records.find(r => r.dateKey === dateKey) || null
}

export const deleteDailyRitualRecord = (id: string): void => {
  const records = getAllDailyRitualRecords().filter(r => r.id !== id)
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(DAILY_RITUAL_STORAGE_KEY, encrypted)
}

export const clearAllDailyRitualRecords = (): void => {
  localStorage.removeItem(DAILY_RITUAL_STORAGE_KEY)
}

export const saveDreamInterpretationResult = (result: DreamInterpretationResult): void => {
  const records = getAllDreamInterpretationRecords()
  records.unshift(result)
  if (records.length > MAX_RECORDS) {
    records.splice(MAX_RECORDS)
  }
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(DREAM_INTERPRETATION_STORAGE_KEY, encrypted)
}

export const getAllDreamInterpretationRecords = (): DreamInterpretationResult[] => {
  const encrypted = localStorage.getItem(DREAM_INTERPRETATION_STORAGE_KEY)
  if (!encrypted) return []
  try {
    const decrypted = simpleDecrypt(encrypted)
    return JSON.parse(decrypted) || []
  } catch {
    return []
  }
}

export const getDreamInterpretationRecordById = (id: string): DreamInterpretationResult | null => {
  const records = getAllDreamInterpretationRecords()
  return records.find(r => r.id === id) || null
}

export const deleteDreamInterpretationRecord = (id: string): void => {
  const records = getAllDreamInterpretationRecords().filter(r => r.id !== id)
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(DREAM_INTERPRETATION_STORAGE_KEY, encrypted)
}

export const clearAllDreamInterpretationRecords = (): void => {
  localStorage.removeItem(DREAM_INTERPRETATION_STORAGE_KEY)
}

export const saveTimeCapsuleResult = (result: TimeCapsuleResult): void => {
  const records = getAllTimeCapsuleRecords()
  records.unshift(result)
  if (records.length > MAX_RECORDS) {
    records.splice(MAX_RECORDS)
  }
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(TIME_CAPSULE_STORAGE_KEY, encrypted)
}

export const getAllTimeCapsuleRecords = (): TimeCapsuleResult[] => {
  const encrypted = localStorage.getItem(TIME_CAPSULE_STORAGE_KEY)
  if (!encrypted) return []
  try {
    const decrypted = simpleDecrypt(encrypted)
    return JSON.parse(decrypted) || []
  } catch {
    return []
  }
}

export const getTimeCapsuleRecordById = (id: string): TimeCapsuleResult | null => {
  const records = getAllTimeCapsuleRecords()
  return records.find(r => r.id === id) || null
}

export const updateTimeCapsuleResult = (result: TimeCapsuleResult): void => {
  const records = getAllTimeCapsuleRecords()
  const index = records.findIndex(r => r.id === result.id)
  if (index > -1) {
    records[index] = result
    const encrypted = simpleEncrypt(JSON.stringify(records))
    localStorage.setItem(TIME_CAPSULE_STORAGE_KEY, encrypted)
  }
}

export const deleteTimeCapsuleRecord = (id: string): void => {
  const records = getAllTimeCapsuleRecords().filter(r => r.id !== id)
  const encrypted = simpleEncrypt(JSON.stringify(records))
  localStorage.setItem(TIME_CAPSULE_STORAGE_KEY, encrypted)
}

export const clearAllTimeCapsuleRecords = (): void => {
  localStorage.removeItem(TIME_CAPSULE_STORAGE_KEY)
}

export const getAllArchiveRecords = (): ArchiveRecord[] => {
  const divinationRecords = getAllRecords()
  const synastryRecords = getAllSynastryRecords()
  const yearlyRecords = getAllYearlyRecords()
  const careerChoiceRecords = getAllCareerChoiceRecords()
  const loveTimingRecords = getAllLoveTimingRecords()
  const dailyRitualRecords = getAllDailyRitualRecords()
  const dreamInterpretationRecords = getAllDreamInterpretationRecords()
  const timeCapsuleRecords = getAllTimeCapsuleRecords()
  const allRecords = [...divinationRecords, ...synastryRecords, ...yearlyRecords, ...careerChoiceRecords, ...loveTimingRecords, ...dailyRitualRecords, ...dreamInterpretationRecords, ...timeCapsuleRecords]
  return allRecords.sort((a, b) => b.createdAt - a.createdAt)
}

export const getArchiveRecordById = (id: string): ArchiveRecord | null => {
  return getRecordById(id) || getSynastryRecordById(id) || getYearlyRecordById(id) || getCareerChoiceRecordById(id) || getLoveTimingRecordById(id) || getDailyRitualRecordById(id) || getDreamInterpretationRecordById(id) || getTimeCapsuleRecordById(id) || null
}

export const deleteArchiveRecord = (id: string): void => {
  deleteRecord(id)
  deleteSynastryRecord(id)
  deleteYearlyRecord(id)
  deleteCareerChoiceRecord(id)
  deleteLoveTimingRecord(id)
  deleteDailyRitualRecord(id)
  deleteDreamInterpretationRecord(id)
  deleteTimeCapsuleRecord(id)
}

export const clearAllArchiveRecords = (): void => {
  clearAllRecords()
  clearAllSynastryRecords()
  clearAllYearlyRecords()
  clearAllCareerChoiceRecords()
  clearAllLoveTimingRecords()
  clearAllDailyRitualRecords()
  clearAllDreamInterpretationRecords()
  clearAllTimeCapsuleRecords()
}
