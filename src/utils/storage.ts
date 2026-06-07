import type { DivinationResult, SynastryResult, ArchiveRecord, YearlyResult } from '@/types'
import { simpleEncrypt, simpleDecrypt } from './hash'

const STORAGE_KEY = 'divination_archive'
const SYNASTRY_STORAGE_KEY = 'synastry_archive'
const YEARLY_STORAGE_KEY = 'yearly_archive'
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

export const getAllArchiveRecords = (): ArchiveRecord[] => {
  const divinationRecords = getAllRecords()
  const synastryRecords = getAllSynastryRecords()
  const yearlyRecords = getAllYearlyRecords()
  const allRecords = [...divinationRecords, ...synastryRecords, ...yearlyRecords]
  return allRecords.sort((a, b) => b.createdAt - a.createdAt)
}

export const getArchiveRecordById = (id: string): ArchiveRecord | null => {
  return getRecordById(id) || getSynastryRecordById(id) || getYearlyRecordById(id) || null
}

export const deleteArchiveRecord = (id: string): void => {
  deleteRecord(id)
  deleteSynastryRecord(id)
  deleteYearlyRecord(id)
}

export const clearAllArchiveRecords = (): void => {
  clearAllRecords()
  clearAllSynastryRecords()
  clearAllYearlyRecords()
}
