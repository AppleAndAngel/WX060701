import { generateId, hashString, reduceNumber } from '@/utils/math'
import { calculateCoreNumbers } from './numerology'
import { buildBaseMatrix, applyTransformations } from './matrix'
import { generateStarMap } from './astronomy'
import { generateGeometry } from './geometry'
import type {
  SynastryInput,
  SynastryResult,
  CoreNumbers,
  NumberCompatibility,
  AttractionPoint,
  ConflictPoint,
  RhythmPattern,
  SynastryInterpretation,
  CalculationStep
} from '@/types'

const numberCompatibilityTable: Record<string, { score: number; description: string }> = {
  '1-1': { score: 75, description: '两个独立灵魂的相遇，旗鼓相当的吸引力，需要学习彼此让步' },
  '1-2': { score: 90, description: '领导者与协调者的完美互补，一动一静构成和谐韵律' },
  '1-3': { score: 85, description: '开创者与表达者的相遇，创意火花四溅，相互激励成长' },
  '1-4': { score: 70, description: '先锋与守护者的张力，一个渴望突破，一个需要稳定' },
  '1-5': { score: 88, description: '两个热爱自由的灵魂，彼此理解，共同探索无限可能' },
  '1-6': { score: 82, description: '领导者与关怀者的组合，一个在外打拼，一个在内滋养' },
  '1-7': { score: 65, description: '外向与内向的对话，需要理解彼此不同的能量补充方式' },
  '1-8': { score: 86, description: '强者与强者的联盟，共同追求成功，需注意权力平衡' },
  '1-9': { score: 78, description: '开创与圆满的呼应，一个发起，一个完成，彼此成全' },
  '2-2': { score: 85, description: '两个敏感灵魂的深度连接，直觉相通，情感同频' },
  '2-3': { score: 88, description: '倾听者与表达者的默契，一个懂得聆听，一个乐于分享' },
  '2-4': { score: 92, description: '稳定与温暖的结合，建立安全的情感港湾，彼此滋养' },
  '2-5': { score: 72, description: '稳定与变化的拉扯，需要在安全感与新鲜感中找到平衡' },
  '2-6': { score: 95, description: '和谐与爱的共振，天生的伴侣能量，彼此珍惜与照顾' },
  '2-7': { score: 80, description: '直觉与内省的相遇，精神层面的深度交流，心灵相通' },
  '2-8': { score: 78, description: '柔软与力量的互补，以柔克刚，相互成就' },
  '2-9': { score: 86, description: '关怀与慈悲的融合，充满大爱的组合，彼此温暖' },
  '3-3': { score: 82, description: '两个创意灵魂的狂欢，灵感不断，生活充满色彩' },
  '3-4': { score: 75, description: '梦幻与现实的碰撞，需要学习落地与变通的艺术' },
  '3-5': { score: 90, description: '自由与欢乐的共舞，对生活充满热情，共同创造精彩' },
  '3-6': { score: 84, description: '表达与关怀的平衡，用爱温暖彼此，用创意点亮生活' },
  '3-7': { score: 68, description: '外向表达与内向思考的差异，需要学习相互理解' },
  '3-8': { score: 80, description: '创意与执行的完美搭档，梦想与行动的结合' },
  '3-9': { score: 88, description: '创造与智慧的结合，理想主义的灵魂伴侣' },
  '4-4': { score: 80, description: '两个稳固基石的结合，建立坚实的未来，可靠可信赖' },
  '4-5': { score: 62, description: '安全与自由的根本差异，最大的成长课题在于接纳' },
  '4-6': { score: 90, description: '稳定与爱的家园，最具家庭感的组合，温馨美满' },
  '4-7': { score: 72, description: '务实与内省的对话，需要尊重彼此不同的世界' },
  '4-8': { score: 88, description: '基石与力量的结合，共同建造物质与精神的帝国' },
  '4-9': { score: 78, description: '稳固与慈悲的融合，需要理解彼此表达爱的方式' },
  '5-5': { score: 85, description: '两个自由灵魂的冒险，一起探索世界，精彩不断' },
  '5-6': { score: 76, description: '自由与责任的平衡，在爱与自由中寻找交集' },
  '5-7': { score: 82, description: '探索与内省的互补，一个向外求，一个向内观' },
  '5-8': { score: 84, description: '自由与力量的结合，共同突破限制，创造可能' },
  '5-9': { score: 86, description: '探索与智慧的相遇，共同追求真理，拓展视野' },
  '6-6': { score: 92, description: '双倍的爱与关怀，天生的治愈者组合，温暖彼此' },
  '6-7': { score: 78, description: '入世之爱与出世之智的对话，需要相互尊重' },
  '6-8': { score: 84, description: '爱与力量的结合，用智慧经营关系，共同成长' },
  '6-9': { score: 94, description: '爱与慈悲的完美共振，最具神性的伴侣组合' },
  '7-7': { score: 80, description: '两个内省灵魂的深度连接，精神世界的知己' },
  '7-8': { score: 72, description: '内省与外显的差异，需要学习彼此的语言' },
  '7-9': { score: 88, description: '智慧与慈悲的相遇，灵性道路上的同修' },
  '8-8': { score: 82, description: '两个力量灵魂的联盟，共同成就，需要注意平衡' },
  '8-9': { score: 86, description: '力量与慈悲的结合，带着爱去创造与显化' },
  '9-9': { score: 88, description: '两个圆满灵魂的相遇，共同完成人生使命' }
}

const getCompatibility = (a: number, b: number): { score: number; description: string } => {
  const key = `${Math.min(a, b)}-${Math.max(a, b)}`
  return numberCompatibilityTable[key] || { score: 70, description: '独特的能量组合，在差异中学习成长' }
}

const attractionAspects = [
  { aspect: '灵魂吸引力', base: 0.8 },
  { aspect: '心智共鸣', base: 0.75 },
  { aspect: '情感互补', base: 0.85 },
  { aspect: '价值观契合', base: 0.7 },
  { aspect: '生活节奏协调', base: 0.65 }
]

const attractionAdvices: Record<string, string[]> = {
  '灵魂吸引力': ['珍惜这份难得的灵魂共鸣', '共同培养精神层面的爱好', '创造深度对话的空间'],
  '心智共鸣': ['保持思想的交流与碰撞', '一起学习新事物', '尊重彼此的观点差异'],
  '情感互补': ['看到对方情绪表达的价值', '学习对方处理情感的方式', '建立情感安全的沟通渠道'],
  '价值观契合': ['共同确认人生方向', '一起规划未来愿景', '在重要决策中相互支持'],
  '生活节奏协调': ['创造共同的生活仪式', '尊重彼此的作息差异', '找到共同享受的活动频率']
}

const conflictAspects = [
  { aspect: '沟通模式差异', base: 0.3 },
  { aspect: '安全感需求不同', base: 0.35 },
  { aspect: '权力平衡', base: 0.25 },
  { aspect: '处理冲突的方式', base: 0.4 },
  { aspect: '个人空间需求', base: 0.3 }
]

const conflictResolutions: Record<string, string[]> = {
  '沟通模式差异': ['学习对方的沟通语言', '设定无评判的对话时间', '用"我"语句表达感受'],
  '安全感需求不同': ['理解各自安全感的来源', '建立信任的小约定', '公开讨论安全感议题'],
  '权力平衡': ['轮流做决定', '认可彼此的贡献', '共同设定关系规则'],
  '处理冲突的方式': ['约定冷静时间', '学习非暴力沟通', '把冲突看作成长机会'],
  '个人空间需求': ['尊重独处的需求', '明确表达边界', '质量胜过数量']
}

const rhythmPatterns = [
  { name: '情感周期', frequency: 28 },
  { name: '能量高峰', frequency: 14 },
  { name: '创造周期', frequency: 42 },
  { name: '沟通节奏', frequency: 7 }
]

const rhythmDescriptions: Record<string, string> = {
  '情感周期': '情感能量的起伏规律，影响亲密关系的深度',
  '能量高峰': '行动力与活力的周期，影响共同计划的推进',
  '创造周期': '创意与灵感的循环，影响共同创造的质量',
  '沟通节奏': '思想交流的频率，影响理解与共识的达成'
}

export const calculateSynastryCompatibility = (
  numbersA: CoreNumbers,
  numbersB: CoreNumbers
): { compatibilities: NumberCompatibility[]; overallScore: number; steps: CalculationStep[] } => {
  const steps: CalculationStep[] = []
  const compatibilities: NumberCompatibility[] = []
  const pairs = [
    { a: numbersA.lifePath, b: numbersB.lifePath, name: '生命路径' },
    { a: numbersA.destiny, b: numbersB.destiny, name: '命运' },
    { a: numbersA.soul, b: numbersB.soul, name: '灵魂' },
    { a: numbersA.personality, b: numbersB.personality, name: '个性' }
  ]

  let totalScore = 0
  pairs.forEach((pair, index) => {
    const compat = getCompatibility(pair.a, pair.b)
    compatibilities.push({
      numberA: pair.a,
      numberB: pair.b,
      score: compat.score,
      description: compat.description
    })
    totalScore += compat.score

    steps.push({
      step: 100 + index * 10,
      name: `${pair.name}数配对分析`,
      formula: `compatibility(${pair.a}, ${pair.b})`,
      input: { numberA: pair.a, numberB: pair.b },
      output: { score: compat.score, description: compat.description },
      description: `计算 ${pair.a} 与 ${pair.b} 的匹配度`
    })
  })

  const overallScore = Math.round(totalScore / pairs.length)

  steps.push({
    step: 150,
    name: '综合匹配度计算',
    formula: 'average(compatibility scores)',
    input: compatibilities.map(c => c.score),
    output: overallScore,
    description: '取四个核心维度的平均得分作为综合匹配度'
  })

  return { compatibilities, overallScore, steps }
}

export const generateAttractionPoints = (
  numbersA: CoreNumbers,
  numbersB: CoreNumbers,
  seed: string
): { points: AttractionPoint[]; steps: CalculationStep[] } => {
  const steps: CalculationStep[] = []
  const points: AttractionPoint[] = []
  const hash = hashString(seed)

  attractionAspects.forEach((aspect, index) => {
    const intensity = Math.round(60 + ((hash >> (index * 3)) & 0xff) % 40 * aspect.base)
    const adviceList = attractionAdvices[aspect.aspect] || attractionAdvices['灵魂吸引力']
    const adviceIndex = ((hash >> (index * 4)) & 0xff) % adviceList.length

    const descriptions: Record<string, (intensity: number) => string> = {
      '灵魂吸引力': (i) => i > 85 ? '你们有着强烈的灵魂共鸣，仿佛前世就已相识' : '在精神层面你们能够深度理解彼此',
      '心智共鸣': (i) => i > 85 ? '思想上的高度同频，总能理解对方的未竟之言' : '你们能够激发彼此的思考',
      '情感互补': (i) => i > 85 ? '情感上的完美互补，对方总是能给你恰好的慰藉' : '在情感表达上你们可以相互学习',
      '价值观契合': (i) => i > 85 ? '价值观高度一致，人生方向基本相同' : '在重要问题上你们能够找到共识',
      '生活节奏协调': (i) => i > 85 ? '生活节奏天然协调，在一起感到放松自在' : '你们可以共同创造舒适的相处节奏'
    }

    points.push({
      aspect: aspect.aspect,
      intensity,
      description: descriptions[aspect.aspect](intensity),
      advice: adviceList[adviceIndex]
    })

    steps.push({
      step: 200 + index * 10,
      name: `吸引力分析 · ${aspect.aspect}`,
      formula: `attractionScore(${aspect.aspect})`,
      input: { numbersA, numbersB },
      output: { intensity, description: descriptions[aspect.aspect](intensity) },
      description: `分析 ${aspect.aspect} 维度的吸引力强度`
    })
  })

  return { points, steps }
}

export const generateConflictPoints = (
  numbersA: CoreNumbers,
  numbersB: CoreNumbers,
  seed: string
): { points: ConflictPoint[]; steps: CalculationStep[] } => {
  const steps: CalculationStep[] = []
  const points: ConflictPoint[] = []
  const hash = hashString(seed)

  conflictAspects.forEach((aspect, index) => {
    const severity = Math.round(20 + ((hash >> (index * 3 + 1)) & 0xff) % 60 * aspect.base)
    const resolutionList = conflictResolutions[aspect.aspect] || conflictResolutions['沟通模式差异']
    const resolutionIndex = ((hash >> (index * 4 + 2)) & 0xff) % resolutionList.length

    const descriptions: Record<string, (severity: number) => string> = {
      '沟通模式差异': (s) => s > 60 ? '你们在沟通方式上存在明显差异，容易产生误解' : '在沟通中需要更有意识地理解对方',
      '安全感需求不同': (s) => s > 60 ? '你们获取安全感的方式不同，可能会让对方感到不安' : '需要理解彼此安全感的来源差异',
      '权力平衡': (s) => s > 60 ? '在关系中可能存在权力的拉扯，需要刻意维护平衡' : '注意在决策中保持平等和尊重',
      '处理冲突的方式': (s) => s > 60 ? '面对冲突时你们的处理方式截然不同，容易升级矛盾' : '学习共同的冲突处理方式很重要',
      '个人空间需求': (s) => s > 60 ? '对个人空间的需求差异较大，可能引发被忽视或被控制的感受' : '需要明确沟通各自的边界需求'
    }

    points.push({
      aspect: aspect.aspect,
      severity,
      description: descriptions[aspect.aspect](severity),
      resolution: resolutionList[resolutionIndex]
    })

    steps.push({
      step: 300 + index * 10,
      name: `冲突点分析 · ${aspect.aspect}`,
      formula: `conflictScore(${aspect.aspect})`,
      input: { numbersA, numbersB },
      output: { severity, description: descriptions[aspect.aspect](severity) },
      description: `分析 ${aspect.aspect} 维度的潜在冲突强度`
    })
  })

  return { points, steps }
}

export const generateRhythmPatterns = (
  timestamp: number,
  seed: string
): { patterns: RhythmPattern[]; steps: CalculationStep[] } => {
  const steps: CalculationStep[] = []
  const patterns: RhythmPattern[] = []
  const hash = hashString(seed)

  rhythmPatterns.forEach((pattern, index) => {
    const offset = ((hash >> (index * 5)) & 0xff) % pattern.frequency
    const bestStart = timestamp + offset * 86400000
    const challengeStart = timestamp + (offset + pattern.frequency / 2) * 86400000

    const bestDate = new Date(bestStart)
    const challengeDate = new Date(challengeStart)

    patterns.push({
      name: pattern.name,
      frequency: pattern.frequency,
      description: rhythmDescriptions[pattern.name] || '关系中的能量循环模式',
      bestPeriod: `${bestDate.getMonth() + 1}月${bestDate.getDate()}日起 ${pattern.frequency}天`,
      challengePeriod: `${challengeDate.getMonth() + 1}月${challengeDate.getDate()}日起 ${Math.floor(pattern.frequency / 2)}天`
    })

    steps.push({
      step: 400 + index * 10,
      name: `节奏分析 · ${pattern.name}`,
      formula: `rhythm(${pattern.frequency} days)`,
      input: { timestamp, seed },
      output: { bestPeriod: patterns[index].bestPeriod, challengePeriod: patterns[index].challengePeriod },
      description: `分析 ${pattern.name} 的周期规律与最佳/挑战时段`
    })
  })

  return { patterns, steps }
}

export const generateSynastryInterpretation = (
  input: SynastryInput,
  numbersA: CoreNumbers,
  numbersB: CoreNumbers,
  overallScore: number,
  attraction: AttractionPoint[],
  conflicts: ConflictPoint[],
  rhythm: RhythmPattern[]
): SynastryInterpretation => {
  const { personA, personB, relationshipType, timestamp } = input

  const titles = [
    `${personA.name} × ${personB.name} · ${relationshipType}合盘`,
    `星尘交织 · ${personA.name}与${personB.name}的${relationshipType}密码`,
    `量子纠缠 · ${relationshipType}关系的能量图谱`,
    `${relationshipType}炼金术 · ${personA.name}与${personB.name}的化合`
  ]

  const titleIndex = (reduceNumber(numbersA.lifePath + numbersB.lifePath) + timestamp) % titles.length
  const title = titles[titleIndex]

  const overallDescriptions = [
    `综合匹配度 ${overallScore}分。这是一段充满成长可能性的${relationshipType}关系，你们在彼此身上看到自己的影子，也看到自己的缺失。`,
    `综合匹配度 ${overallScore}分。你们的相遇不是偶然，是灵魂层面的约定。这段${relationshipType}关系将带领你们共同经历深刻的转化。`,
    `综合匹配度 ${overallScore}分。在这段${relationshipType}关系中，你们既是镜子也是老师，帮助彼此看见未曾察觉的自己。`
  ]

  const overallDescription = overallDescriptions[overallScore % overallDescriptions.length]

  const adviceList = [
    '在关系中保持独立，爱不是占有而是共同成长',
    '定期进行深度对话，分享内心真实的感受',
    '尊重彼此的差异，差异是关系的调味品',
    '共同创造属于你们的仪式与回忆',
    '在冲突中看到成长的机会，而不是对错',
    '学会表达感激，珍惜对方的付出',
    '保持各自的社交圈和兴趣爱好',
    '共同设定目标，一起努力实现'
  ]

  const hash = hashString(`${personA.name}-${personB.name}-${timestamp}`)
  const selectedAdvice: string[] = []
  for (let i = 0; i < 4; i++) {
    const index = ((hash >> (i * 4)) & 0xff) % adviceList.length
    if (!selectedAdvice.includes(adviceList[index])) {
      selectedAdvice.push(adviceList[index])
    }
  }
  if (selectedAdvice.length < 3) {
    selectedAdvice.push(adviceList[0], adviceList[4])
  }

  const keywords = [
    `${numbersA.lifePath}×${numbersB.lifePath}`,
    attraction[0].aspect,
    conflicts[0].aspect,
    rhythm[0].name,
    `${overallScore}分`
  ]

  return {
    title,
    overallScore,
    overallDescription,
    attraction,
    conflicts,
    rhythm,
    advice: selectedAdvice,
    keywords
  }
}

export const performSynastry = (input: SynastryInput): SynastryResult => {
  const { personA, personB, timestamp } = input

  const { coreNumbers: numbersA, allSteps: stepsA } = calculateCoreNumbers(personA.name, personA.birthDate)
  const { coreNumbers: numbersB, allSteps: stepsB } = calculateCoreNumbers(personB.name, personB.birthDate)

  const labeledStepsA = stepsA.map(s => ({ ...s, name: `[${personA.name}] ${s.name}` }))
  const labeledStepsB = stepsB.map(s => ({ ...s, name: `[${personB.name}] ${s.name}` }))

  const { compatibilities, overallScore, steps: compatSteps } = calculateSynastryCompatibility(numbersA, numbersB)

  const seed = `${personA.name}-${personA.birthDate}-${personB.name}-${personB.birthDate}-${timestamp}`
  const { points: attraction, steps: attractionSteps } = generateAttractionPoints(numbersA, numbersB, seed)
  const { points: conflicts, steps: conflictSteps } = generateConflictPoints(numbersA, numbersB, seed)
  const { patterns: rhythm, steps: rhythmSteps } = generateRhythmPatterns(timestamp, seed)

  const interpretation = generateSynastryInterpretation(
    input,
    numbersA,
    numbersB,
    overallScore,
    attraction,
    conflicts,
    rhythm
  )

  const coreSum = numbersA.lifePath + numbersA.destiny + numbersB.lifePath + numbersB.destiny
  const baseMatrix = buildBaseMatrix({ lifePath: coreSum, destiny: coreSum, soul: coreSum, personality: coreSum })
  const { transformedMatrix, eigenvalues, steps: matrixSteps } = applyTransformations(baseMatrix, {
    lifePath: reduceNumber(numbersA.lifePath + numbersB.lifePath),
    destiny: reduceNumber(numbersA.destiny + numbersB.destiny),
    soul: reduceNumber(numbersA.soul + numbersB.soul),
    personality: reduceNumber(numbersA.personality + numbersB.personality)
  })

  const { starMap, steps: astronomySteps } = generateStarMap(eigenvalues, timestamp, [], [])
  const { geometry, steps: geometrySteps } = generateGeometry(
    { lifePath: numbersA.lifePath, destiny: numbersB.destiny, soul: numbersA.soul, personality: numbersB.personality },
    eigenvalues,
    ''
  )

  const calculationTrace = [
    ...labeledStepsA,
    ...labeledStepsB,
    ...compatSteps,
    ...attractionSteps,
    ...conflictSteps,
    ...rhythmSteps,
    ...matrixSteps,
    ...astronomySteps,
    ...geometrySteps
  ]

  return {
    id: generateId(),
    type: 'synastry',
    input,
    personANumbers: numbersA,
    personBNumbers: numbersB,
    compatibilityMatrix: compatibilities,
    geometry,
    starMap,
    interpretation,
    calculationTrace,
    createdAt: Date.now()
  }
}
