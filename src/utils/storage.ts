import type { DivinationResult } from '@/types'
import { simpleEncrypt, simpleDecrypt } from './hash'

const STORAGE_KEY = 'divination_archive'
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
