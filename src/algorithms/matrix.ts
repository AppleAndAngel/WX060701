import { matrixMultiply, matrixEigenvalues, hashString, reduceNumber } from '@/utils/math'
import type { CalculationStep, CoreNumbers } from '@/types'

export const buildBaseMatrix = (coreNumbers: CoreNumbers): number[][] => {
  const { lifePath, destiny, soul, personality } = coreNumbers
  const hash = hashString(`${lifePath}${destiny}${soul}${personality}`)
  
  const matrix: number[][] = [
    [lifePath, reduceNumber(destiny + soul), reduceNumber(personality + (hash % 9 + 1))],
    [reduceNumber(soul + personality), destiny, reduceNumber(lifePath + ((hash >> 4) % 9 + 1))],
    [reduceNumber(personality + lifePath), reduceNumber(destiny + ((hash >> 8) % 9 + 1)), soul]
  ]
  
  return matrix
}

export const rotateMatrix = (m: number[][], angleDeg: number): number[][] => {
  const angle = angleDeg * (Math.PI / 180)
  const cos = Math.round(Math.cos(angle) * 1000) / 1000
  const sin = Math.round(Math.sin(angle) * 1000) / 1000
  
  const rotationMatrix = [
    [cos, -sin, 0],
    [sin, cos, 0],
    [0, 0, 1]
  ]
  
  return matrixMultiply(rotationMatrix, m)
}

export const scaleMatrix = (m: number[][], factor: number): number[][] => {
  const scaleMatrix = [
    [factor, 0, 0],
    [0, factor, 0],
    [0, 0, 1]
  ]
  
  return matrixMultiply(scaleMatrix, m)
}

export const shearMatrix = (m: number[][], shearX: number, shearY: number): number[][] => {
  const shearMatrix = [
    [1, shearX, 0],
    [shearY, 1, 0],
    [0, 0, 1]
  ]
  
  return matrixMultiply(shearMatrix, m)
}

export const applyTransformations = (
  baseMatrix: number[][],
  coreNumbers: CoreNumbers
): {
  transformedMatrix: number[][]
  eigenvalues: number[]
  steps: CalculationStep[]
} => {
  const steps: CalculationStep[] = []
  
  const step1: CalculationStep = {
    step: 40,
    name: '构建基础矩阵',
    formula: 'M₀ = buildMatrix(coreNumbers)',
    input: coreNumbers,
    output: baseMatrix,
    description: '基于四个核心数字构建3×3基础矩阵'
  }
  steps.push(step1)
  
  const rotationAngle = coreNumbers.lifePath * 36
  const rotated = rotateMatrix(baseMatrix, rotationAngle)
  const step2: CalculationStep = {
    step: 41,
    name: '旋转变换',
    formula: `M₁ = R(${rotationAngle}°) × M₀`,
    input: { matrix: baseMatrix, angle: rotationAngle },
    output: rotated,
    description: `生命路径数 ${coreNumbers.lifePath} × 36° = ${rotationAngle}° 旋转`
  }
  steps.push(step2)
  
  const scaleFactor = 1 + (coreNumbers.destiny % 5) * 0.1
  const scaled = scaleMatrix(rotated, scaleFactor)
  const step3: CalculationStep = {
    step: 42,
    name: '缩放变换',
    formula: `M₂ = S(${scaleFactor.toFixed(1)}) × M₁`,
    input: { matrix: rotated, factor: scaleFactor },
    output: scaled,
    description: `命运数 ${coreNumbers.destiny} % 5 = ${coreNumbers.destiny % 5}，缩放因子 ${scaleFactor.toFixed(1)}`
  }
  steps.push(step3)
  
  const shearX = (coreNumbers.soul - 5) * 0.05
  const shearY = (coreNumbers.personality - 5) * 0.05
  const sheared = shearMatrix(scaled, shearX, shearY)
  const step4: CalculationStep = {
    step: 43,
    name: '剪切变换',
    formula: `M₃ = Sh(${shearX.toFixed(2)}, ${shearY.toFixed(2)}) × M₂`,
    input: { matrix: scaled, shearX, shearY },
    output: sheared,
    description: `灵魂数 (${coreNumbers.soul}-5)×0.05 = ${shearX.toFixed(2)}，个性数 (${coreNumbers.personality}-5)×0.05 = ${shearY.toFixed(2)}`
  }
  steps.push(step4)
  
  const eigenvalues = matrixEigenvalues(sheared)
  const step5: CalculationStep = {
    step: 44,
    name: '特征值计算',
    formula: 'det(M₃ - λI) = 0',
    input: sheared,
    output: eigenvalues,
    description: '求解矩阵的特征方程，得到三个特征值，用于星象坐标映射'
  }
  steps.push(step5)
  
  return {
    transformedMatrix: sheared,
    eigenvalues,
    steps
  }
}
