import { degToRad, hashString } from '@/utils/math'
import type { CalculationStep, StarMap, StarPosition } from '@/types'

const planetNames = ['水星', '金星', '火星', '木星', '土星', '天王星', '海王星']

export const calculatePlanetaryAngles = (timestamp: number, seed: number): {
  angles: number[]
  steps: CalculationStep[]
} => {
  const steps: CalculationStep[] = []
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  
  const step1: CalculationStep = {
    step: 50,
    name: '时间参数提取',
    formula: 't = f(year, month, day, hour, minute)',
    input: { timestamp, date: date.toISOString() },
    output: { year, month, day, hours, minutes },
    description: '从时间戳中提取日期时间参数'
  }
  steps.push(step1)
  
  const baseAngles = planetNames.map((_, i) => {
    const orbitalPeriod = 88 + i * 4320
    const phase = (seed + i * 47) % 360
    const timeFactor = (year * 365.25 + month * 30 + day + hours / 24 + minutes / 1440) % orbitalPeriod
    const angle = (phase + (timeFactor / orbitalPeriod) * 360) % 360
    return Math.round(angle * 100) / 100
  })
  
  const step2: CalculationStep = {
    step: 51,
    name: '行星角度计算',
    formula: 'θᵢ = (seedᵢ + (t / Tᵢ) × 360°) mod 360°',
    input: { seed, timestamp },
    output: baseAngles.map((a, i) => `${planetNames[i]}: ${a}°`),
    description: '基于时间和轨道周期计算7颗行星的黄道角度位置'
  }
  steps.push(step2)
  
  return { angles: baseAngles, steps }
}

export const sphericalToCartesian = (theta: number, phi: number, radius: number = 1): StarPosition => {
  const thetaRad = degToRad(theta)
  const phiRad = degToRad(phi)
  return {
    x: radius * Math.sin(phiRad) * Math.cos(thetaRad),
    y: radius * Math.sin(phiRad) * Math.sin(thetaRad),
    z: radius * Math.cos(phiRad)
  }
}

export const fourierSmooth = (points: number[], harmonics: number = 3): number[] => {
  const n = points.length
  const smoothed: number[] = []
  
  for (let i = 0; i < n; i++) {
    let sum = 0
    for (let h = 0; h <= harmonics; h++) {
      let cosSum = 0
      let sinSum = 0
      for (let j = 0; j < n; j++) {
        const angle = (2 * Math.PI * h * j) / n
        cosSum += points[j] * Math.cos(angle)
        sinSum += points[j] * Math.sin(angle)
      }
      const weight = h === 0 ? 1 / n : 2 / n
      const angle = (2 * Math.PI * h * i) / n
      sum += weight * (cosSum * Math.cos(angle) + sinSum * Math.sin(angle))
    }
    smoothed.push(Math.round(sum * 100) / 100)
  }
  
  return smoothed
}

export const generateStarMap = (
  eigenvalues: number[],
  timestamp: number,
  selectedRunes: number[],
  starConnection: number[][]
): {
  starMap: StarMap
  steps: CalculationStep[]
} => {
  const steps: CalculationStep[] = []
  
  const seed = Math.abs(eigenvalues.reduce((a, b) => a + b, 0)) * 1000
  const { angles, steps: angleSteps } = calculatePlanetaryAngles(timestamp, seed)
  steps.push(...angleSteps)
  
  const normalizedEigenvalues = eigenvalues.map(e => {
    const absE = Math.abs(e)
    return absE > 0 ? 1 - 1 / (1 + absE / 100) : 0
  })
  
  const positions: StarPosition[] = angles.map((angle, i) => {
    const phi = 30 + normalizedEigenvalues[i % 3] * 120
    const radius = 0.7 + (selectedRunes[i % selectedRunes.length] || 5) * 0.06
    return sphericalToCartesian(angle, phi, radius)
  })
  
  const step3: CalculationStep = {
    step: 52,
    name: '球面坐标转换',
    formula: '(x,y,z) = (r·sinφ·cosθ, r·sinφ·sinθ, r·cosφ)',
    input: { angles, eigenvalues: normalizedEigenvalues, runes: selectedRunes },
    output: positions,
    description: '将行星角度和特征值转换为三维笛卡尔坐标'
  }
  steps.push(step3)
  
  const connections: number[][] = []
  const hash = hashString(starConnection.flat().join(','))
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const connectionHash = (hash >> (i * j)) & 1
      if (connectionHash === 1 || (starConnection[i] && starConnection[i].includes(j))) {
        connections.push([i, j])
      }
    }
  }
  
  const step4: CalculationStep = {
    step: 53,
    name: '星轨连接生成',
    formula: 'C = hash(starConnection) ∪ userConnections',
    input: { starConnection, hash },
    output: connections,
    description: '基于用户星轨交互和哈希算法生成星体间的连接关系'
  }
  steps.push(step4)
  
  return {
    starMap: { positions, connections },
    steps
  }
}
