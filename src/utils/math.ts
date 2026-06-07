export const reduceNumber = (n: number): number => {
  if (n === 11 || n === 22 || n === 33) return n
  if (n < 10) return n
  const sum = String(n).split('').reduce((acc, d) => acc + parseInt(d, 10), 0)
  return reduceNumber(sum)
}

export const sumDigits = (str: string): number => {
  return str.split('').reduce((acc, char) => {
    if (/\d/.test(char)) {
      return acc + parseInt(char, 10)
    }
    return acc
  }, 0)
}

export const hashString = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

export const goldenRatio = 1.618033988749895

export const degToRad = (deg: number): number => deg * (Math.PI / 180)

export const radToDeg = (rad: number): number => rad * (180 / Math.PI)

export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t
}

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export class DeterministicRandom {
  private seed: number

  constructor(seed: string | number) {
    this.seed = typeof seed === 'string' ? hashString(seed) : Math.abs(seed)
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min)
  }
}

export const matrixMultiply = (a: number[][], b: number[][]): number[][] => {
  const result: number[][] = []
  const rowsA = a.length
  const colsA = a[0].length
  const colsB = b[0].length
  for (let i = 0; i < rowsA; i++) {
    result[i] = []
    for (let j = 0; j < colsB; j++) {
      let sum = 0
      for (let k = 0; k < colsA; k++) {
        sum += a[i][k] * b[k][j]
      }
      result[i][j] = sum
    }
  }
  return result
}

export const matrixDeterminant = (m: number[][]): number => {
  const n = m.length
  if (n === 1) return m[0][0]
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0]
  let det = 0
  for (let j = 0; j < n; j++) {
    const subMatrix: number[][] = []
    for (let i = 1; i < n; i++) {
      subMatrix.push([...m[i].slice(0, j), ...m[i].slice(j + 1)])
    }
    det += Math.pow(-1, j) * m[0][j] * matrixDeterminant(subMatrix)
  }
  return det
}

export const matrixEigenvalues = (m: number[][]): number[] => {
  const trace = m[0][0] + m[1][1] + m[2][2]
  const det = matrixDeterminant(m)
  const a = m[0][0], b = m[0][1], c = m[0][2]
  const d = m[1][0], e = m[1][1], f = m[1][2]
  const g = m[2][0], h = m[2][1], i = m[2][2]
  const minor1 = e * i - f * h
  const minor2 = a * i - c * g
  const minor3 = a * e - b * d
  const sumMinors = minor1 + minor2 + minor3
  const p = -trace
  const q = sumMinors
  const r = -det
  const roots = solveCubic(p, q, r)
  return roots.map(x => Math.round(x * 1000) / 1000)
}

const solveCubic = (p: number, q: number, r: number): number[] => {
  const roots: number[] = []
  const discriminant = Math.pow(q, 3) / 27 + Math.pow(r, 2) / 4 + Math.pow(p, 2) * q / 27 - Math.pow(p, 3) * r / 2048 - Math.pow(p, 4) / 256
  if (discriminant >= 0) {
    const a = -r / 2 + Math.sqrt(discriminant)
    const b = -r / 2 - Math.sqrt(discriminant)
    const cubeA = Math.cbrt(a)
    const cubeB = Math.cbrt(b)
    roots.push(cubeA + cubeB - p / 4)
  } else {
    const rho = Math.sqrt(-Math.pow(q, 3) / 27)
    const theta = Math.acos(-r / (2 * rho))
    const phi = 2 * Math.PI / 3
    for (let k = 0; k < 3; k++) {
      roots.push(2 * Math.cbrt(rho) * Math.cos(theta / 3 + k * phi) - p / 4)
    }
  }
  if (roots.length === 1) {
    const a = 1
    const b = p + roots[0]
    const c = q + b * roots[0]
    const disc = b * b - 4 * a * c
    if (disc >= 0) {
      roots.push((-b + Math.sqrt(disc)) / (2 * a))
      roots.push((-b - Math.sqrt(disc)) / (2 * a))
    } else {
      roots.push(roots[0], roots[0])
    }
  }
  return roots
}
