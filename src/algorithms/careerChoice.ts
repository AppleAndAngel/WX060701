import { generateId, hashString, reduceNumber } from '@/utils/math'
import { calculateCoreNumbers } from './numerology'
import { buildBaseMatrix, applyTransformations } from './matrix'
import { generateStarMap } from './astronomy'
import { generateGeometry } from './geometry'
import type {
  CareerChoiceInput,
  CareerChoiceResult,
  CoreNumbers,
  PathAnalysis,
  CareerChoiceComparison,
  CareerChoiceInterpretation,
  CalculationStep
} from '@/types'

const numberMeanings: Record<number, { title: string; traits: string[]; essence: string }> = {
  1: { title: '开创之源', traits: ['独立', '领导', '创新', '自信'], essence: '万物之始，创造的火花' },
  2: { title: '和谐之舞', traits: ['合作', '平衡', '敏感', '直觉'], essence: '阴阳交汇，关系的艺术' },
  3: { title: '创造之光', traits: ['表达', '乐观', '想象', '社交'], essence: '三位一体，灵感的绽放' },
  4: { title: '稳固之基', traits: ['务实', '秩序', '勤勉', '可靠'], essence: '四方稳固，物质的基石' },
  5: { title: '自由之风', traits: ['变化', '冒险', '多才', '好奇'], essence: '五行流转，自由的追寻' },
  6: { title: '爱与责任', traits: ['关怀', '和谐', '责任', '美学'], essence: '六芒完美，爱的奉献' },
  7: { title: '智慧之门', traits: ['内省', '分析', '神秘', '真理'], essence: '七星指引，灵性的探索' },
  8: { title: '力量之环', traits: ['权威', '力量', '效率', '丰盛'], essence: '无限循环，力量的显化' },
  9: { title: '圆满之境', traits: ['慈悲', '智慧', '博爱', '完成'], essence: '九九归一，周期的完成' },
  11: { title: '直觉之门', traits: ['灵感', '直觉', '灵性', '启发'], essence: '主数字，灵性的通道' },
  22: { title: '建造大师', traits: ['实践', '宏大', '创造', '成就'], essence: '主数字，梦想的建构' },
  33: { title: '慈悲之师', traits: ['大爱', '智慧', '奉献', '引导'], essence: '主数字，无条件的爱' }
}

const advantageTemplates: Record<number, string[]> = {
  1: ['能够独立自主地开展工作', '具备领导才能，适合带领团队', '创新思维强，能开创新局面', '自信心充足，敢于接受挑战'],
  2: ['善于协调合作，团队协作能力强', '直觉敏锐，能察觉细微变化', '耐心细致，适合处理细节工作', '外交手腕出色，善于沟通'],
  3: ['创意丰富，适合创造性工作', '表达能力强，善于分享想法', '乐观积极，能带动团队氛围', '社交能力强，人脉资源丰富'],
  4: ['务实可靠，做事有条理', '执行力强，能保质保量完成任务', '注重细节，追求完美', '耐心坚持，适合长期积累'],
  5: ['适应能力强，善于应对变化', '多才多艺，能胜任多种角色', '好奇心旺盛，学习能力强', '热爱自由，不喜欢被束缚'],
  6: ['责任感强，值得信赖', '关怀他人，善于服务和支持', '审美能力强，注重品质', '追求和谐，善于化解冲突'],
  7: ['分析能力强，善于深度思考', '直觉精准，能洞察本质', '内省智慧，适合研究型工作', '追求真理，不断探索未知'],
  8: ['组织能力强，善于管理资源', '意志坚定，目标导向明确', '效率优先，结果导向', '商业嗅觉敏锐，善于把握机会'],
  9: ['全局观念强，有远见卓识', '慈悲为怀，善于帮助他人', '智慧深邃，能看透事物本质', '包容性强，善于整合资源'],
  11: ['直觉超凡，灵感源源不断', '灵性觉醒，意识层次高', '启发他人，具有感染力', '创新突破，不走寻常路'],
  22: ['执行力强，能将梦想落地', '格局宏大，能成就大业', '务实与理想平衡', '建造能力强，善于架构'],
  33: ['慈悲为怀，具有大爱精神', '智慧引导，善于教导他人', '服务意识强，无私奉献', '能量强大，能治愈他人']
}

const costTemplates: Record<number, string[]> = {
  1: ['可能过于独立，缺乏协作精神', '控制欲强，容易独断专行', '不耐烦于细节，容易忽视基础', '自我中心，不易听取他人意见'],
  2: ['可能过于依赖他人，缺乏主见', '敏感脆弱，容易受到伤害', '犹豫不决，难以做出决断', '过度迁就，容易失去自我'],
  3: ['可能过于乐观，忽视现实问题', '注意力分散，难以持之以恒', '表达过度，言多必失', '不够务实，想法难以落地'],
  4: ['可能过于保守，缺乏灵活性', '固执己见，难以接受变化', '过于注重细节，效率不高', '安全感需求强，不敢冒险'],
  5: ['可能过于冲动，缺乏耐心', '稳定性差，容易半途而废', '过度追求自由，缺乏责任', '兴趣广泛，难以深入专精'],
  6: ['可能过于责任，负担过重', '过度干涉，容易引发反感', '追求完美，容易苛责他人', '牺牲自我，容易失去平衡'],
  7: ['可能过于孤僻，难以融入团队', '过度分析，容易陷入纠结', '精神洁癖，难以包容差异', '行动力不足，想得多做得少'],
  8: ['可能过于强势，控制欲过强', '功利心重，容易不择手段', '工作狂倾向，忽视生活平衡', '权力欲望，容易引发冲突'],
  9: ['可能过于理想主义，脱离现实', '过度包容，容易被利用', '关注全局，忽视个人利益', '容易倦怠，需要不断寻找意义'],
  11: ['可能过于敏感，情绪起伏大', '精神紧张，容易焦虑', '想法天马行空，难以落地', '容易自我怀疑，需要肯定'],
  22: ['可能过于追求宏大，忽视当下', '压力过大，容易崩溃', '标准过高，难以满足', '容易被误解，曲高和寡'],
  33: ['可能过于牺牲，自我价值感低', '情感负担重，容易疲惫', '过于理想化，容易失望', '边界感弱，容易被侵犯']
}

const comparisonAspects = [
  { aspect: '个人天赋匹配度', description: '该选择与你天生特质的契合程度' },
  { aspect: '长期发展潜力', description: '未来3-5年的成长空间' },
  { aspect: '短期可行性', description: '未来6-12个月的可操作性' },
  { aspect: '风险承受度', description: '该选择的风险水平与你承受能力的匹配' },
  { aspect: '价值观念契合', description: '与你核心价值观的一致性' },
  { aspect: '生活平衡影响', description: '对工作生活平衡的影响' }
]

const recommendationTemplates = [
  '综合来看，{option} 更符合你当下的能量状态，建议勇敢迈出这一步。',
  '算法显示 {option} 与你的核心频率更加共振，这是值得深入探索的方向。',
  '从长期发展的角度，{option} 能够为你提供更大的成长空间，建议优先考虑。',
  '{option} 与你的生命路径更加契合，选择它会让你感到更加充实和满足。',
  '虽然两条路径都有其价值，但 {option} 更能激发你的潜能，建议重点投入。'
]

const calculatePathNumbers = (
  baseNumbers: CoreNumbers,
  optionName: string,
  seed: string
): CoreNumbers => {
  const nameHash = hashString(optionName + seed)
  return {
    lifePath: reduceNumber(baseNumbers.lifePath + (nameHash % 9)),
    destiny: reduceNumber(baseNumbers.destiny + ((nameHash >> 4) % 9)),
    soul: reduceNumber(baseNumbers.soul + ((nameHash >> 8) % 9)),
    personality: reduceNumber(baseNumbers.personality + ((nameHash >> 12) % 9))
  }
}

const generatePathAnalysis = (
  optionName: string,
  optionDescription: string,
  baseNumbers: CoreNumbers,
  pathNumbers: CoreNumbers,
  seed: string,
  steps: CalculationStep[],
  stepOffset: number
): PathAnalysis => {
  const hash = hashString(seed + optionName)

  const advantages: string[] = []
  const costs: string[] = []

  const coreNumbersList = [pathNumbers.lifePath, pathNumbers.destiny, pathNumbers.soul, pathNumbers.personality]
  const uniqueNumbers = [...new Set(coreNumbersList)]

  uniqueNumbers.forEach((num, index) => {
    const advantageList = advantageTemplates[num] || advantageTemplates[1]
    const costList = costTemplates[num] || costTemplates[1]
    const advIndex = ((hash >> (index * 3)) & 0xff) % advantageList.length
    const costIndex = ((hash >> (index * 3 + 1)) & 0xff) % costList.length

    if (advantages.length < 4) {
      advantages.push(advantageList[advIndex])
    }
    if (costs.length < 4) {
      costs.push(costList[costIndex])
    }

    steps.push({
      step: stepOffset + index * 10,
      name: `[${optionName}] ${numberMeanings[num]?.title || '特质分析'}`,
      formula: `pathAnalysis(${num})`,
      input: { number: num, optionName },
      output: { advantage: advantageList[advIndex], cost: costList[costIndex] },
      description: `分析数字 ${num} 对选择「${optionName}」的影响`
    })
  })

  while (advantages.length < 4) {
    const num = coreNumbersList[advantages.length % coreNumbersList.length]
    const list = advantageTemplates[num] || advantageTemplates[1]
    advantages.push(list[(hash + advantages.length) % list.length])
  }

  while (costs.length < 4) {
    const num = coreNumbersList[costs.length % coreNumbersList.length]
    const list = costTemplates[num] || costTemplates[1]
    costs.push(list[(hash + costs.length) % list.length])
  }

  const suitability = Math.round(60 + (hash % 40))
  const energyLevel = Math.round(50 + ((hash >> 4) % 50))
  const growthPotential = Math.round(55 + ((hash >> 8) % 45))
  const riskLevel = Math.round(20 + ((hash >> 12) % 60))

  const timeline = {
    shortTerm: generateTimelineDescription(optionName, hash, 'short'),
    mediumTerm: generateTimelineDescription(optionName, hash >> 4, 'medium'),
    longTerm: generateTimelineDescription(optionName, hash >> 8, 'long')
  }

  const keyIndicators = [
    {
      name: '天赋匹配',
      value: Math.round(65 + ((hash >> 16) % 35)),
      description: '你的天赋特质与该选择的契合程度'
    },
    {
      name: '热情指数',
      value: Math.round(55 + ((hash >> 20) % 45)),
      description: '该选择能够激发你内在热情的程度'
    },
    {
      name: '安全感',
      value: Math.round(40 + ((hash >> 24) % 50)),
      description: '该选择能够给你带来的稳定感和安全感'
    },
    {
      name: '成就感',
      value: Math.round(50 + ((hash >> 28) % 50)),
      description: '在该路径上获得成就满足的可能性'
    }
  ]

  return {
    optionName,
    coreNumbers: pathNumbers,
    advantages,
    costs,
    suitability,
    energyLevel,
    growthPotential,
    riskLevel,
    timeline,
    keyIndicators
  }
}

const generateTimelineDescription = (optionName: string, hash: number, period: string): string => {
  const descriptions: Record<string, string[]> = {
    short: [
      `选择「${optionName}」的前3个月，你将经历一段适应期，需要快速学习新技能。`,
      `在「${optionName}」的初期阶段，你可能会感到有些挑战，但很快就能找到节奏。`,
      `「${optionName}」的起步阶段会为你带来新的人脉和机遇，保持开放心态。`,
      `前6个月是关键的打基础时期，投入的努力将在日后获得回报。`
    ],
    medium: [
      `1-2年后，你在「${optionName}」领域将积累足够的经验，开始独当一面。`,
      `中期阶段，「${optionName}」会为你带来意想不到的转折机会。`,
      `在「${optionName}」的道路上，2年左右你将面临重要的抉择点。`,
      `18个月后，你之前的积累将开始显现成效，进入快速发展期。`
    ],
    long: [
      `从长远来看，「${optionName}」将深刻塑造你的人生轨迹，带来质的飞跃。`,
      `3-5年后，「${optionName}」会让你达到一个新的人生高度。`,
      `长期坚持「${optionName}」，你将在这个领域建立起独特的个人品牌。`,
      `「${optionName}」是一条需要耐心的道路，但最终的收获将超出预期。`
    ]
  }

  const list = descriptions[period] || descriptions.short
  return list[hash % list.length]
}

const generateComparisons = (
  pathA: PathAnalysis,
  pathB: PathAnalysis,
  seed: string,
  steps: CalculationStep[]
): CareerChoiceComparison[] => {
  const comparisons: CareerChoiceComparison[] = []
  const hash = hashString(seed)

  comparisonAspects.forEach((aspect, index) => {
    const baseScoreA = pathA.suitability + ((hash >> (index * 4)) & 0x0f) * 2
    const baseScoreB = pathB.suitability + ((hash >> (index * 4 + 2)) & 0x0f) * 2

    const scoreA = Math.min(Math.round(baseScoreA * 0.7 + pathA.growthPotential * 0.3), 100)
    const scoreB = Math.min(Math.round(baseScoreB * 0.7 + pathB.growthPotential * 0.3), 100)

    const diff = Math.abs(scoreA - scoreB)
    let description: string
    let recommendation: string

    if (diff > 15) {
      const betterOption = scoreA > scoreB ? pathA.optionName : pathB.optionName
      description = `在${aspect.aspect}方面，${betterOption}具有明显优势，${aspect.description.toLowerCase()}。`
      recommendation = `建议优先考虑 ${betterOption}，在这个维度上它更符合你的需求。`
    } else if (diff > 5) {
      const betterOption = scoreA > scoreB ? pathA.optionName : pathB.optionName
      description = `在${aspect.aspect}方面，${betterOption}略胜一筹，但差距不大，${aspect.description.toLowerCase()}。`
      recommendation = `${betterOption}在这方面更有优势，但也要考虑其他因素的综合影响。`
    } else {
      description = `在${aspect.aspect}方面，两者不相上下，各有千秋，${aspect.description.toLowerCase()}。`
      recommendation = '这个维度上两者势均力敌，可以根据其他方面的权衡来做决定。'
    }

    comparisons.push({
      aspect: aspect.aspect,
      optionAScore: scoreA,
      optionBScore: scoreB,
      description,
      recommendation
    })

    steps.push({
      step: 500 + index * 10,
      name: `对照分析 · ${aspect.aspect}`,
      formula: `compare(${pathA.optionName}, ${pathB.optionName})`,
      input: { aspect: aspect.aspect, scoreA, scoreB },
      output: { description, recommendation },
      description: `对比分析两个选择在${aspect.aspect}维度的差异`
    })
  })

  return comparisons
}

const generateCareerChoiceInterpretation = (
  input: CareerChoiceInput,
  pathA: PathAnalysis,
  pathB: PathAnalysis,
  comparisons: CareerChoiceComparison[]
): CareerChoiceInterpretation => {
  const { name, timestamp, optionA, optionB } = input

  const totalA = comparisons.reduce((sum, c) => sum + c.optionAScore, 0)
  const totalB = comparisons.reduce((sum, c) => sum + c.optionBScore, 0)
  const avgA = Math.round(totalA / comparisons.length)
  const avgB = Math.round(totalB / comparisons.length)

  const betterOption = avgA >= avgB ? optionA.name : optionB.name
  const worseOption = avgA >= avgB ? optionB.name : optionA.name

  const titles = [
    `${name} · 职业抉择：${optionA.name} vs ${optionB.name}`,
    `岔路口的星图 · ${name}的${betterOption}之选`,
    `量子抉择 · 两条人生路径的能量对照`,
    `命运的分叉 · ${optionA.name}与${optionB.name}的算法解码`
  ]

  const titleIndex = (reduceNumber(pathA.coreNumbers.lifePath + pathB.coreNumbers.lifePath) + timestamp) % titles.length
  const title = titles[titleIndex]

  const overallDescription = `算法为你揭示了两条路径的能量图谱。「${optionA.name}」综合得分 ${avgA}分，「${optionB.name}」综合得分 ${avgB}分。这不是一个简单的对错选择题，而是关于你想要成为什么样的人的深层探索。每一条路径都有其独特的礼物和功课，关键在于哪一条更能让你活出真实的自己。`

  const hash = hashString(`${name}-${optionA.name}-${optionB.name}-${timestamp}`)
  const recIndex = Math.abs(hash % recommendationTemplates.length)
  const finalRecommendation = recommendationTemplates[recIndex].replace(/{option}/g, betterOption)

  const actionSteps = generateActionSteps(pathA, pathB, betterOption, hash)

  const keywords = [
    `${avgA}分vs${avgB}分`,
    betterOption,
    `生命路径${pathA.coreNumbers.lifePath}`,
    `生命路径${pathB.coreNumbers.lifePath}`,
    comparisons[0].aspect,
    comparisons[1].aspect
  ]

  const interpretation: CareerChoiceInterpretation = {
    title,
    overallDescription,
    pathA,
    pathB,
    comparisons,
    finalRecommendation,
    actionSteps,
    keywords
  }

  const allNumbers = [
    pathA.coreNumbers.lifePath, pathA.coreNumbers.destiny, pathA.coreNumbers.soul, pathA.coreNumbers.personality,
    pathB.coreNumbers.lifePath, pathB.coreNumbers.destiny, pathB.coreNumbers.soul, pathB.coreNumbers.personality
  ]

  if (allNumbers.some(n => [11, 22, 33].includes(n))) {
    interpretation.warning = '注意：你的路径分析中出现了主数字 (11, 22, 33)，这意味着特殊的灵性潜能和人生挑战。这些数字不被约简，它们携带着强烈的能量振动，暗示着不平凡的人生道路。'
  }

  return interpretation
}

const generateActionSteps = (
  pathA: PathAnalysis,
  pathB: PathAnalysis,
  betterOption: string,
  hash: number
): string[] => {
  const allSteps = [
    '在做出最终决定前，给自己至少3天的冷静期，不要在情绪激动时做选择。',
    '找一个安静的地方，闭上眼睛想象自己分别走上两条道路，感受内心的真实反应。',
    '列出两条路径的所有优缺点，以及你愿意为之付出的代价清单。',
    '与已经在这两个领域有经验的人交流，获取真实的一手信息。',
    '尝试进行72小时的「模拟体验」，用那72小时按照目标路径的方式生活。',
    '问问自己：如果不考虑金钱和他人的期待，我会选择哪条路？',
    '评估最坏情况：如果两条路都失败了，哪一个的结果是你更能接受的？',
    '相信你的直觉，身体的反应往往比头脑的分析更接近真相。',
    '记住：没有所谓的「正确选择」，只有「选择」和「让选择变得正确」。',
    '给自己留一条后路，即使选择了一条路，也保持另一条路的可能性。',
    '将大决定拆解成小步骤，先迈出最小的那一步来测试水温。',
    '写下你的核心价值观，看看哪条路更符合你的价值排序。'
  ]

  const selectedSteps: string[] = []
  for (let i = 0; i < 6; i++) {
    const index = Math.abs(((hash >> (i * 4)) & 0xff) % allSteps.length)
    if (!selectedSteps.includes(allSteps[index])) {
      selectedSteps.push(allSteps[index])
    }
  }

  if (selectedSteps.length < 5) {
    selectedSteps.push(allSteps[0], allSteps[allSteps.length - 1])
  }

  return selectedSteps
}

export const performCareerChoice = (input: CareerChoiceInput): CareerChoiceResult => {
  const { name, birthDate, optionA, optionB, timestamp } = input

  const { coreNumbers: baseNumbers, allSteps: baseSteps } = calculateCoreNumbers(name, birthDate)
  const labeledBaseSteps = baseSteps.map(s => ({ ...s, name: `[基础] ${s.name}` }))

  const seedA = `${name}-${birthDate}-${optionA.name}-${timestamp}`
  const seedB = `${name}-${birthDate}-${optionB.name}-${timestamp}`

  const pathNumbersA = calculatePathNumbers(baseNumbers, optionA.name, seedA)
  const pathNumbersB = calculatePathNumbers(baseNumbers, optionB.name, seedB)

  const analysisSteps: CalculationStep[] = []

  const pathA = generatePathAnalysis(
    optionA.name,
    optionA.description,
    baseNumbers,
    pathNumbersA,
    seedA,
    analysisSteps,
    200
  )

  const pathB = generatePathAnalysis(
    optionB.name,
    optionB.description,
    baseNumbers,
    pathNumbersB,
    seedB,
    analysisSteps,
    350
  )

  const comparisonSeed = `${name}-${optionA.name}-${optionB.name}-${timestamp}`
  const comparisons = generateComparisons(pathA, pathB, comparisonSeed, analysisSteps)

  const interpretation = generateCareerChoiceInterpretation(
    input,
    pathA,
    pathB,
    comparisons
  )

  const coreSum = baseNumbers.lifePath + baseNumbers.destiny + baseNumbers.soul + baseNumbers.personality
  const combinedNumbers = {
    lifePath: reduceNumber(pathA.coreNumbers.lifePath + pathB.coreNumbers.lifePath),
    destiny: reduceNumber(pathA.coreNumbers.destiny + pathB.coreNumbers.destiny),
    soul: reduceNumber(pathA.coreNumbers.soul + pathB.coreNumbers.soul),
    personality: reduceNumber(pathA.coreNumbers.personality + pathB.coreNumbers.personality)
  }

  const baseMatrix = buildBaseMatrix({ lifePath: coreSum, destiny: coreSum, soul: coreSum, personality: coreSum })
  const { transformedMatrix, eigenvalues, steps: matrixSteps } = applyTransformations(baseMatrix, combinedNumbers)

  const { starMap, steps: astronomySteps } = generateStarMap(eigenvalues, timestamp, [], [])
  const { geometry, steps: geometrySteps } = generateGeometry(combinedNumbers, eigenvalues, '')

  const calculationTrace = [
    ...labeledBaseSteps,
    ...analysisSteps,
    ...matrixSteps,
    ...astronomySteps,
    ...geometrySteps
  ]

  return {
    id: generateId(),
    type: 'career-choice',
    input,
    geometry,
    starMap,
    interpretation,
    calculationTrace,
    createdAt: Date.now()
  }
}
