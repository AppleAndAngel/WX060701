import { generateId } from '@/utils/math'
import { calculateCoreNumbers } from './numerology'
import { buildBaseMatrix, applyTransformations } from './matrix'
import { generateStarMap } from './astronomy'
import { generateGeometry } from './geometry'
import { generateInterpretation } from './interpretation'
import type { DivinationInput, DivinationResult } from '@/types'

export const performDivination = (input: DivinationInput): DivinationResult => {
  const { name, birthDate, query, selectedRunes, starConnection, timestamp } = input
  
  const { coreNumbers, allSteps: numerologySteps } = calculateCoreNumbers(name, birthDate)
  
  const baseMatrix = buildBaseMatrix(coreNumbers)
  const { transformedMatrix, eigenvalues, steps: matrixSteps } = applyTransformations(baseMatrix, coreNumbers)
  
  const { starMap, steps: astronomySteps } = generateStarMap(
    eigenvalues,
    timestamp,
    selectedRunes,
    starConnection
  )
  
  const { geometry, steps: geometrySteps } = generateGeometry(
    coreNumbers,
    eigenvalues,
    query
  )
  
  const interpretation = generateInterpretation(
    coreNumbers,
    geometry,
    starMap,
    query,
    timestamp
  )
  
  const calculationTrace = [
    ...numerologySteps,
    ...matrixSteps,
    ...astronomySteps,
    ...geometrySteps
  ]
  
  return {
    id: generateId(),
    input,
    coreNumbers,
    matrix: transformedMatrix,
    starMap,
    geometry,
    interpretation,
    calculationTrace,
    createdAt: Date.now()
  }
}
