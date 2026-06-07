import { reduceNumber, hashString } from '@/utils/math'
import type { CalculationStep, CoreNumbers } from '@/types'

const letterValues: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
}

const vowels = ['a', 'e', 'i', 'o', 'u', 'y']

const isVowel = (char: string, index: number, name: string): boolean => {
  const lower = char.toLowerCase()
  if (vowels.includes(lower)) {
    if (lower === 'y' && index === 0) return false
    if (lower === 'y' && index < name.length - 1) {
      const prev = name[index - 1]?.toLowerCase()
      const next = name[index + 1]?.toLowerCase()
      if (vowels.includes(prev) || vowels.includes(next)) return false
    }
    return true
  }
  return false
}

export const calculateLifePath = (birthDate: string): { result: number; steps: CalculationStep[] } => {
  const steps: CalculationStep[] = []
  const digits = birthDate.replace(/\D/g, '')
  
  const step1: CalculationStep = {
    step: 1,
    name: '生日数位分解',
    formula: '提取生日日期中的所有数字',
    input: birthDate,
    output: digits.split(''),
    description: '将生日日期中的数字逐个提取'
  }
  steps.push(step1)
  
  const digitsSum = digits.split('').reduce((acc, d) => acc + parseInt(d, 10), 0)
  const step2: CalculationStep = {
    step: 2,
    name: '数位求和',
    formula: 'Σ(digits)',
    input: digits.split(''),
    output: digitsSum,
    description: '将所有数字相加得到初始和'
  }
  steps.push(step2)
  
  const result = reduceNumber(digitsSum)
  const step3: CalculationStep = {
    step: 3,
    name: '数字约简',
    formula: digitsSum > 9 ? `reduce(${digitsSum}) = ${result}` : `${digitsSum} (无需约简)`,
    input: digitsSum,
    output: result,
    description: result === 11 || result === 22 || result === 33 
      ? `${result} 是特殊的主数字，保留两位` 
      : `持续求和直到得到个位数 (1-9) 或主数字 (11, 22, 33)`
  }
  steps.push(step3)
  
  return { result, steps }
}

export const calculateDestiny = (name: string): { result: number; steps: CalculationStep[] } => {
  const steps: CalculationStep[] = []
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '')
  
  const step1: CalculationStep = {
    step: 1,
    name: '字母数值映射',
    formula: 'a=1, b=2, ..., i=9, j=1, ...',
    input: cleanName,
    output: cleanName.split('').map(c => `${c}→${letterValues[c]}`),
    description: '将每个字母映射为对应的数字 (1-9, 循环)'
  }
  steps.push(step1)
  
  const sum = cleanName.split('').reduce((acc, c) => acc + (letterValues[c] || 0), 0)
  const step2: CalculationStep = {
    step: 2,
    name: '数值求和',
    formula: `Σ(letterValues)`,
    input: cleanName.split('').map(c => letterValues[c] || 0),
    output: sum,
    description: '将所有字母对应的数字相加'
  }
  steps.push(step2)
  
  const result = reduceNumber(sum)
  const step3: CalculationStep = {
    step: 3,
    name: '数字约简',
    formula: sum > 9 ? `reduce(${sum}) = ${result}` : `${sum} (无需约简)`,
    input: sum,
    output: result,
    description: result === 11 || result === 22 || result === 33 
      ? `${result} 是特殊的主数字，保留两位` 
      : `持续求和直到得到个位数 (1-9) 或主数字 (11, 22, 33)`
  }
  steps.push(step3)
  
  return { result, steps }
}

export const calculateSoul = (name: string): { result: number; steps: CalculationStep[] } => {
  const steps: CalculationStep[] = []
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '')
  const vowelChars: string[] = []
  const vowelValues: number[] = []
  
  for (let i = 0; i < cleanName.length; i++) {
    const char = cleanName[i]
    if (isVowel(char, i, cleanName)) {
      vowelChars.push(char)
      vowelValues.push(letterValues[char] || 0)
    }
  }
  
  const step1: CalculationStep = {
    step: 1,
    name: '提取元音字母',
    formula: '识别姓名中的元音字母 (a, e, i, o, u, y作为元音的情况)',
    input: cleanName,
    output: vowelChars,
    description: 'y在特定情况下作为元音：不是首字母且前后不是元音'
  }
  steps.push(step1)
  
  const step2: CalculationStep = {
    step: 2,
    name: '元音数值映射',
    formula: 'a=1, e=5, i=9, o=6, u=3, y=7',
    input: vowelChars,
    output: vowelChars.map((c, i) => `${c}→${vowelValues[i]}`),
    description: '将每个元音字母映射为对应的数字'
  }
  steps.push(step2)
  
  const sum = vowelValues.reduce((acc, v) => acc + v, 0)
  const step3: CalculationStep = {
    step: 3,
    name: '元音数值求和',
    formula: `Σ(vowelValues)`,
    input: vowelValues,
    output: sum,
    description: '将所有元音对应的数字相加'
  }
  steps.push(step3)
  
  const result = reduceNumber(sum)
  const step4: CalculationStep = {
    step: 4,
    name: '数字约简',
    formula: sum > 9 ? `reduce(${sum}) = ${result}` : `${sum} (无需约简)`,
    input: sum,
    output: result,
    description: result === 11 || result === 22 || result === 33 
      ? `${result} 是特殊的主数字，保留两位` 
      : `持续求和直到得到个位数 (1-9) 或主数字 (11, 22, 33)`
  }
  steps.push(step4)
  
  return { result, steps }
}

export const calculatePersonality = (name: string): { result: number; steps: CalculationStep[] } => {
  const steps: CalculationStep[] = []
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '')
  const consonantChars: string[] = []
  const consonantValues: number[] = []
  
  for (let i = 0; i < cleanName.length; i++) {
    const char = cleanName[i]
    if (!isVowel(char, i, cleanName)) {
      consonantChars.push(char)
      consonantValues.push(letterValues[char] || 0)
    }
  }
  
  const step1: CalculationStep = {
    step: 1,
    name: '提取辅音字母',
    formula: '识别姓名中的辅音字母 (非元音字母)',
    input: cleanName,
    output: consonantChars,
    description: '排除元音字母后的所有字母'
  }
  steps.push(step1)
  
  const step2: CalculationStep = {
    step: 2,
    name: '辅音数值映射',
    formula: 'b=2, c=3, d=4, f=6, ...',
    input: consonantChars,
    output: consonantChars.map((c, i) => `${c}→${consonantValues[i]}`),
    description: '将每个辅音字母映射为对应的数字'
  }
  steps.push(step2)
  
  const sum = consonantValues.reduce((acc, v) => acc + v, 0)
  const step3: CalculationStep = {
    step: 3,
    name: '辅音数值求和',
    formula: `Σ(consonantValues)`,
    input: consonantValues,
    output: sum,
    description: '将所有辅音对应的数字相加'
  }
  steps.push(step3)
  
  const result = reduceNumber(sum)
  const step4: CalculationStep = {
    step: 4,
    name: '数字约简',
    formula: sum > 9 ? `reduce(${sum}) = ${result}` : `${sum} (无需约简)`,
    input: sum,
    output: result,
    description: result === 11 || result === 22 || result === 33 
      ? `${result} 是特殊的主数字，保留两位` 
      : `持续求和直到得到个位数 (1-9) 或主数字 (11, 22, 33)`
  }
  steps.push(step4)
  
  return { result, steps }
}

export const calculateCoreNumbers = (name: string, birthDate: string): {
  coreNumbers: CoreNumbers
  allSteps: CalculationStep[]
} => {
  const lifePath = calculateLifePath(birthDate)
  const destiny = calculateDestiny(name)
  const soul = calculateSoul(name)
  const personality = calculatePersonality(name)
  
  const allSteps: CalculationStep[] = [
    {
      step: 0,
      name: '生命路径数计算',
      formula: 'lifePath(birthDate)',
      input: { birthDate },
      output: lifePath.result,
      description: '基于出生日期计算生命路径数'
    },
    ...lifePath.steps.map(s => ({ ...s, name: `生命路径 · ${s.name}` })),
    {
      step: 10,
      name: '命运数计算',
      formula: 'destiny(name)',
      input: { name },
      output: destiny.result,
      description: '基于姓名计算命运数'
    },
    ...destiny.steps.map(s => ({ ...s, name: `命运 · ${s.name}` })),
    {
      step: 20,
      name: '灵魂数计算',
      formula: 'soul(name)',
      input: { name },
      output: soul.result,
      description: '基于姓名元音计算灵魂数'
    },
    ...soul.steps.map(s => ({ ...s, name: `灵魂 · ${s.name}` })),
    {
      step: 30,
      name: '个性数计算',
      formula: 'personality(name)',
      input: { name },
      output: personality.result,
      description: '基于姓名辅音计算个性数'
    },
    ...personality.steps.map(s => ({ ...s, name: `个性 · ${s.name}` }))
  ]
  
  return {
    coreNumbers: {
      lifePath: lifePath.result,
      destiny: destiny.result,
      soul: soul.result,
      personality: personality.result
    },
    allSteps
  }
}

export const hashToNumber = (str: string, min: number = 1, max: number = 9): number => {
  const hash = hashString(str)
  return min + (hash % (max - min + 1))
}
