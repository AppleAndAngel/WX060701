import { goldenRatio, degToRad, hashString } from '@/utils/math'
import type { CalculationStep, CoreNumbers, GeometryData } from '@/types'

const geometryTypes = ['triangle', 'square', 'pentagon', 'hexagon', 'heptagon', 'octagon', 'star', 'dodecagon', 'enneagram']

export const determineGeometryType = (coreNumbers: CoreNumbers): string => {
  const sum = coreNumbers.lifePath + coreNumbers.destiny + coreNumbers.soul + coreNumbers.personality
  const index = (sum - 4) % geometryTypes.length
  return geometryTypes[Math.abs(index)]
}

export const generatePolygonVertices = (
  sides: number,
  centerX: number,
  centerY: number,
  radius: number,
  rotation: number = 0
): { x: number; y: number }[] => {
  const vertices: { x: number; y: number }[] = []
  const startAngle = degToRad(rotation - 90)
  
  for (let i = 0; i < sides; i++) {
    const angle = startAngle + (2 * Math.PI * i) / sides
    const r = radius * (0.9 + Math.sin(i * goldenRatio) * 0.1)
    vertices.push({
      x: Math.round((centerX + r * Math.cos(angle)) * 100) / 100,
      y: Math.round((centerY + r * Math.sin(angle)) * 100) / 100
    })
  }
  
  return vertices
}

export const generateStarVertices = (
  points: number,
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  rotation: number = 0
): { x: number; y: number }[] => {
  const vertices: { x: number; y: number }[] = []
  const startAngle = degToRad(rotation - 90)
  const step = Math.PI / points
  
  for (let i = 0; i < points * 2; i++) {
    const angle = startAngle + i * step
    const r = i % 2 === 0 ? outerRadius : innerRadius
    vertices.push({
      x: Math.round((centerX + r * Math.cos(angle)) * 100) / 100,
      y: Math.round((centerY + r * Math.sin(angle)) * 100) / 100
    })
  }
  
  return vertices
}

export const applyGoldenRatio = (
  vertices: { x: number; y: number }[],
  centerX: number,
  centerY: number,
  intensity: number
): { x: number; y: number }[] => {
  return vertices.map(v => {
    const dx = v.x - centerX
    const dy = v.y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const factor = 1 + (Math.sin(distance * 0.1) * intensity * 0.1)
    return {
      x: Math.round((centerX + dx * factor) * 100) / 100,
      y: Math.round((centerY + dy * factor) * 100) / 100
    }
  })
}

export const generateGeometry = (
  coreNumbers: CoreNumbers,
  eigenvalues: number[],
  query: string
): {
  geometry: GeometryData
  steps: CalculationStep[]
} => {
  const steps: CalculationStep[] = []
  
  const type = determineGeometryType(coreNumbers)
  const step1: CalculationStep = {
    step: 60,
    name: '几何类型判定',
    formula: 'type = geometryTypes[(Σ(coreNumbers) - 4) mod 9]',
    input: coreNumbers,
    output: type,
    description: `核心数字之和 ${coreNumbers.lifePath + coreNumbers.destiny + coreNumbers.soul + coreNumbers.personality} 决定几何图形类型`
  }
  steps.push(step1)
  
  const centerX = 200 + eigenvalues[0] * 10
  const centerY = 200 + eigenvalues[1] * 10
  const baseRadius = 120 + Math.abs(eigenvalues[2]) * 2
  const rotation = hashString(query) % 360
  
  let vertices: { x: number; y: number }[] = []
  let formula = ''
  
  switch (type) {
    case 'triangle':
      vertices = generatePolygonVertices(3, centerX, centerY, baseRadius, rotation)
      formula = 'triangle(3, center, r, θ)'
      break
    case 'square':
      vertices = generatePolygonVertices(4, centerX, centerY, baseRadius, rotation)
      formula = 'square(4, center, r, θ)'
      break
    case 'pentagon':
      vertices = generatePolygonVertices(5, centerX, centerY, baseRadius, rotation)
      formula = 'pentagon(5, center, r, θ)'
      break
    case 'hexagon':
      vertices = generatePolygonVertices(6, centerX, centerY, baseRadius, rotation)
      formula = 'hexagon(6, center, r, θ)'
      break
    case 'heptagon':
      vertices = generatePolygonVertices(7, centerX, centerY, baseRadius, rotation)
      formula = 'heptagon(7, center, r, θ)'
      break
    case 'octagon':
      vertices = generatePolygonVertices(8, centerX, centerY, baseRadius, rotation)
      formula = 'octagon(8, center, r, θ)'
      break
    case 'dodecagon':
      vertices = generatePolygonVertices(12, centerX, centerY, baseRadius, rotation)
      formula = 'dodecagon(12, center, r, θ)'
      break
    case 'star':
      vertices = generateStarVertices(5, centerX, centerY, baseRadius, baseRadius / goldenRatio, rotation)
      formula = 'star(5, center, r, r/φ, θ)'
      break
    case 'enneagram':
      vertices = generateStarVertices(9, centerX, centerY, baseRadius, baseRadius * 0.6, rotation)
      formula = 'enneagram(9, center, r, 0.6r, θ)'
      break
    default:
      vertices = generatePolygonVertices(6, centerX, centerY, baseRadius, rotation)
      formula = 'hexagon(6, center, r, θ)'
  }
  
  const step2: CalculationStep = {
    step: 61,
    name: '基础顶点生成',
    formula,
    input: { center: { x: centerX, y: centerY }, radius: baseRadius, rotation },
    output: vertices,
    description: '根据几何类型生成基础顶点坐标'
  }
  steps.push(step2)
  
  const intensity = (coreNumbers.destiny + coreNumbers.soul) / 2
  const adjustedVertices = applyGoldenRatio(vertices, centerX, centerY, intensity)
  const step3: CalculationStep = {
    step: 62,
    name: '黄金分割调整',
    formula: 'v\' = f(v, φ, intensity)',
    input: { vertices, intensity, phi: goldenRatio },
    output: adjustedVertices,
    description: `应用黄金分割比例 φ=${goldenRatio.toFixed(6)} 微调顶点位置，强度 ${intensity.toFixed(1)}`
  }
  steps.push(step3)
  
  return {
    geometry: {
      type,
      vertices: adjustedVertices,
      center: { x: Math.round(centerX * 100) / 100, y: Math.round(centerY * 100) / 100 }
    },
    steps
  }
}
