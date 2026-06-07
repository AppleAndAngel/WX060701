import { reduceNumber, hashString, DeterministicRandom } from '@/utils/math'
import { calculateLifePath } from './numerology'
import type { 
  CalculationStep, 
  YearlyDivinationInput, 
  YearlyResult, 
  YearlyInterpretation, 
  MonthData, 
  PhaseData,
  GeometryData
} from '@/types'

const yearNumberMeanings: Record<number, { theme: string; essence: string; keywords: string[] }> = {
  1: {
    theme: '开创与新生',
    essence: '万象更新的起始之年，独立意识觉醒，新的可能性正在萌芽',
    keywords: ['独立', '开创', '突破', '勇气', '新起点']
  },
  2: {
    theme: '合作与平衡',
    essence: '关系之年，需要耐心与敏感度，在互动中寻找和谐与平衡',
    keywords: ['合作', '平衡', '耐心', '关系', '协调']
  },
  3: {
    theme: '创造与表达',
    essence: '灵感迸发的一年，创意涌现，社交活跃，自我表达的渴望强烈',
    keywords: ['创造', '表达', '乐观', '社交', '灵感']
  },
  4: {
    theme: '稳固与建设',
    essence: '扎实耕耘的一年，需要耐心构建基础，为未来奠定稳固根基',
    keywords: ['务实', '稳固', '建设', '勤勉', '秩序']
  },
  5: {
    theme: '变化与自由',
    essence: '充满变数的一年，冒险精神被唤醒，机遇与挑战并存',
    keywords: ['变化', '自由', '冒险', '多才', '探索']
  },
  6: {
    theme: '爱与责任',
    essence: '聚焦于家庭与关系的一年，需要承担责任，也将收获温暖',
    keywords: ['关怀', '和谐', '责任', '家庭', '美学']
  },
  7: {
    theme: '内省与智慧',
    essence: '向内探索的一年，适合深度学习、反思与灵性成长',
    keywords: ['内省', '分析', '智慧', '真理', '成长']
  },
  8: {
    theme: '力量与丰盛',
    essence: '能量充沛的一年，事业与物质领域可能迎来重要进展',
    keywords: ['权威', '力量', '效率', '丰盛', '成就']
  },
  9: {
    theme: '圆满与超越',
    essence: '周期完成之年，适合总结、放下与升华，为新周期做准备',
    keywords: ['慈悲', '智慧', '圆满', '放下', '升华']
  },
  11: {
    theme: '灵感与启示',
    essence: '主数字年份，灵性通道打开，可能经历重要的觉醒与启发',
    keywords: ['灵感', '直觉', '灵性', '启发', '愿景']
  },
  22: {
    theme: '建造与显化',
    essence: '主数字年份，拥有强大的显化能力，可将宏大愿景付诸实现',
    keywords: ['实践', '宏大', '建造', '成就', '显化']
  },
  33: {
    theme: '大爱与奉献',
    essence: '主数字年份，慈悲能量强烈，适合服务他人与传递智慧',
    keywords: ['大爱', '智慧', '奉献', '引导', '慈悲']
  }
}

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

const monthThemes: Record<number, string[]> = {
  1: ['新计划启动', '独立行动', '展现自我'],
  2: ['关系协调', '耐心等待', '合作共赢'],
  3: ['创意爆发', '社交活跃', '表达自我'],
  4: ['基础建设', '务实推进', '细节打磨'],
  5: ['机遇出现', '突破常规', '灵活应变'],
  6: ['家庭关怀', '关系深化', '艺术创造'],
  7: ['深度思考', '学习进修', '内观自省'],
  8: ['事业推进', '资源整合', '成果显现'],
  9: ['总结复盘', '放下过去', '心怀感恩'],
  10: ['新的开始', '突破现状', '确立目标'],
  11: ['灵感指引', '直觉决策', '灵性提升'],
  12: ['回顾展望', '休息调整', '能量沉淀']
}

const phaseTemplates = [
  {
    name: '播种期',
    period: '1-3月',
    months: [1, 2, 3],
    theme: '设定目标，积蓄能量'
  },
  {
    name: '生长期',
    period: '4-6月',
    months: [4, 5, 6],
    theme: '积极行动，克服挑战'
  },
  {
    name: '开花期',
    period: '7-9月',
    months: [7, 8, 9],
    theme: '成果显现，关系深化'
  },
  {
    name: '收获期',
    period: '10-12月',
    months: [10, 11, 12],
    theme: '总结收获，规划未来'
  }
]

const calculateYearNumber = (birthDate: string, targetYear: number): { result: number; steps: CalculationStep[] } => {
  const steps: CalculationStep[] = []
  
  const lifePath = calculateLifePath(birthDate)
  
  steps.push({
    step: 1,
    name: '生命路径数计算',
    formula: 'lifePath(birthDate)',
    input: birthDate,
    output: lifePath.result,
    description: '基于出生日期计算核心生命路径数'
  })
  
  steps.push(...lifePath.steps.map(s => ({ ...s, name: `生命路径 · ${s.name}` })))
  
  const yearDigits = targetYear.toString().split('').map(d => parseInt(d, 10))
  const yearSum = yearDigits.reduce((acc, d) => acc + d, 0)
  
  steps.push({
    step: 10,
    name: '年份数字分解',
    formula: `${targetYear} → ${yearDigits.join(' + ')}`,
    input: targetYear,
    output: yearDigits,
    description: '将目标年份的每一位数字分解'
  })
  
  steps.push({
    step: 11,
    name: '年份数位求和',
    formula: `Σ(yearDigits)`,
    input: yearDigits,
    output: yearSum,
    description: '将年份的所有数字相加'
  })
  
  const yearReduced = reduceNumber(yearSum)
  
  steps.push({
    step: 12,
    name: '年份数字约简',
    formula: yearSum > 9 ? `reduce(${yearSum}) = ${yearReduced}` : `${yearSum} (无需约简)`,
    input: yearSum,
    output: yearReduced,
    description: yearReduced === 11 || yearReduced === 22 || yearReduced === 33
      ? `${yearReduced} 是特殊的主数字，保留两位`
      : '持续求和直到得到个位数或主数字'
  })
  
  const totalSum = lifePath.result + yearReduced
  const yearNumber = reduceNumber(totalSum)
  
  steps.push({
    step: 20,
    name: '流年数字计算',
    formula: `lifePath(${lifePath.result}) + yearDigit(${yearReduced}) = ${totalSum} → reduce(${totalSum}) = ${yearNumber}`,
    input: { lifePath: lifePath.result, yearDigit: yearReduced },
    output: yearNumber,
    description: '生命路径数与年份数字的共振，得到流年核心数字'
  })
  
  return { result: yearNumber, steps }
}

const generateMonthData = (
  month: number,
  yearNumber: number,
  lifePathNumber: number,
  seed: string
): MonthData => {
  const rng = new DeterministicRandom(`${seed}-${month}`)
  
  const monthNumber = reduceNumber(yearNumber + month)
  const themes = monthThemes[month] || monthThemes[1]
  const baseTheme = themes[rng.next() % themes.length]
  
  const monthMeaning = yearNumberMeanings[monthNumber] || yearNumberMeanings[9]
  
  const allKeywords = [...monthMeaning.keywords, '调整', '准备', '行动', '反思']
  const selectedKeywords: string[] = []
  while (selectedKeywords.length < 3 && allKeywords.length > 0) {
    const idx = rng.next() % allKeywords.length
    selectedKeywords.push(allKeywords[idx])
    allKeywords.splice(idx, 1)
  }
  
  const energyLevels = ['上升期', '平稳期', '峰值期', '调整期', '积累期']
  const energy = energyLevels[rng.next() % energyLevels.length]
  
  const opportunityPool = [
    '新的合作机会出现',
    '创意灵感容易迸发',
    '人际关系得到拓展',
    '专业能力获得提升',
    '财务状况有所改善',
    '内心更加平静笃定',
    '遇到重要的贵人',
    '学习新技能的好时机',
    '健康状态提升',
    '家庭关系更加和谐'
  ]
  
  const challengePool = [
    '需要更多耐心等待',
    '注意沟通中的误解',
    '避免过度消耗精力',
    '需要做出艰难选择',
    '面对旧有模式的挑战',
    '注意情绪管理',
    '可能遇到拖延阻碍',
    '需要放下某些执念',
    '平衡工作与休息',
    '面对不确定性'
  ]
  
  const opportunities: string[] = []
  for (let i = 0; i < 2; i++) {
    const idx = rng.next() % opportunityPool.length
    opportunities.push(opportunityPool[idx])
    opportunityPool.splice(idx, 1)
  }
  
  const challenges: string[] = []
  for (let i = 0; i < 2; i++) {
    const idx = rng.next() % challengePool.length
    challenges.push(challengePool[idx])
    challengePool.splice(idx, 1)
  }
  
  const reminderPool = [
    '保持正念，活在当下',
    '相信直觉，大胆行动',
    '适度休息，积蓄能量',
    '表达感恩，传递善意',
    '设定边界，保护自己',
    '保持开放，迎接变化',
    '专注当下，减少焦虑',
    '主动沟通，化解误会',
    '记录灵感，付诸实践',
    '关爱自己，照顾身心'
  ]
  
  const reminder = reminderPool[rng.next() % reminderPool.length]
  
  return {
    month,
    name: monthNames[month - 1],
    monthNumber,
    theme: baseTheme,
    keywords: selectedKeywords,
    energy,
    opportunities,
    challenges,
    reminder
  }
}

const generatePhaseData = (
  phaseIndex: number,
  yearNumber: number,
  seed: string
): PhaseData => {
  const template = phaseTemplates[phaseIndex]
  const rng = new DeterministicRandom(`${seed}-phase-${phaseIndex}`)
  
  const focusPool = [
    '明确年度目标',
    '建立日常习惯',
    '拓展社交圈',
    '深化专业能力',
    '关注身心健康',
    '整理财务规划',
    '培养新的爱好',
    '修复重要关系',
    '提升表达能力',
    '探索内在世界',
    '优化工作效率',
    '打造个人品牌'
  ]
  
  const focus: string[] = []
  for (let i = 0; i < 3; i++) {
    const idx = rng.next() % focusPool.length
    focus.push(focusPool[idx])
    focusPool.splice(idx, 1)
  }
  
  const energyPool = ['积蓄能量', '稳步推进', '快速上升', '达到顶峰', '深度沉淀', '回顾整合']
  const energy = energyPool[rng.next() % energyPool.length]
  
  return {
    name: template.name,
    period: template.period,
    months: template.months,
    theme: template.theme,
    focus,
    energy
  }
}

const generateYearlyGeometry = (yearNumber: number, targetYear: number): GeometryData => {
  const seed = `${yearNumber}-${targetYear}`
  const rng = new DeterministicRandom(seed)
  
  const geometryTypes = ['circle', 'hexagon', 'star', 'pentagon', 'triangle', 'square']
  const type = geometryTypes[yearNumber % geometryTypes.length]
  
  const vertexCount = yearNumber === 11 || yearNumber === 22 ? 12 : yearNumber + 5
  const vertices: { x: number; y: number }[] = []
  const centerX = 200
  const centerY = 200
  
  for (let i = 0; i < vertexCount; i++) {
    const angle = (i / vertexCount) * Math.PI * 2 - Math.PI / 2
    const radius = 140 + (rng.next() - 0.5) * 20
    vertices.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    })
  }
  
  return {
    type,
    vertices,
    center: { x: centerX, y: centerY }
  }
}

const generateYearlyInterpretation = (
  yearNumber: number,
  lifePathNumber: number,
  targetYear: number,
  name: string,
  steps: CalculationStep[]
): YearlyInterpretation => {
  const meaning = yearNumberMeanings[yearNumber] || yearNumberMeanings[9]
  const lifePathMeaning = yearNumberMeanings[lifePathNumber] || yearNumberMeanings[9]
  
  const seed = `${name}-${targetYear}-${yearNumber}`
  const rng = new DeterministicRandom(seed)
  
  const titleVariations = [
    `${targetYear}流年 · ${meaning.theme}之境`,
    `${meaning.theme} · ${targetYear}年度预言`,
    `${targetYear}年运势 · 数字${yearNumber}的启示`,
    `流年卦象 · ${targetYear}${meaning.theme}`
  ]
  const title = titleVariations[rng.next() % titleVariations.length]
  
  const overallDescriptions = [
    `${targetYear}年，你的流年数字为 ${yearNumber}——${meaning.essence}。这是与生命路径数 ${lifePathNumber}（${lifePathMeaning.theme}）共振的一年，能量场域正为你开启独特的成长通道。在算法的视野中，这一年的每一个月都承载着特定的生命课题，等待你去体验与超越。`,
    `当时间的指针指向 ${targetYear}，数字 ${yearNumber} 的能量开始在你的生命场域中流动。${meaning.essence}。与你本质的 ${lifePathNumber} 号人（${lifePathMeaning.theme}）相呼应，这一年将是你生命旅程中独特的一站。每一次选择都在书写这一年的主题，每一个月份都有其独特的功课。`,
    `${targetYear}年对你而言是数字 ${yearNumber} 主导的流年。${meaning.essence}。这与你生命路径 ${lifePathNumber} 的本质（${lifePathMeaning.theme}）形成了独特的能量对话。算法显示，这一年的能量将在不同月份以不同形态呈现，理解这种节奏，你便能顺势而为。`
  ]
  
  const overallDescription = overallDescriptions[rng.next() % overallDescriptions.length]
  
  const phases: PhaseData[] = []
  for (let i = 0; i < 4; i++) {
    phases.push(generatePhaseData(i, yearNumber, seed))
  }
  
  const months: MonthData[] = []
  for (let m = 1; m <= 12; m++) {
    months.push(generateMonthData(m, yearNumber, lifePathNumber, seed))
  }
  
  const reminderPool = [
    '流年数字揭示的是能量趋势，而非注定的命运，你的选择永远是最关键的变量',
    '每个数字都有其阴阳两面，保持觉知，便能化挑战为成长',
    '这一年的主题需要你用一整年的时间去体验和领悟，不必急于求成',
    '当你感到迷茫时，回归流年数字的核心本质，便能找到方向',
    '记住：相同的能量在不同的人身上会以不同的方式显现，这正是你的独特之处',
    '年度主题是背景，而你才是自己人生大戏的主角和导演'
  ]
  
  const keyReminders: string[] = []
  const usedIndices = new Set<number>()
  while (keyReminders.length < 3 && usedIndices.size < reminderPool.length) {
    const idx = rng.next() % reminderPool.length
    if (!usedIndices.has(idx)) {
      usedIndices.add(idx)
      keyReminders.push(reminderPool[idx])
    }
  }
  
  return {
    title,
    yearNumber,
    theme: meaning.theme,
    coreKeywords: meaning.keywords.slice(0, 4),
    overallDescription,
    phases,
    months,
    keyReminders
  }
}

export const performYearlyDivination = (input: YearlyDivinationInput): YearlyResult => {
  const { name, birthDate, targetYear, timestamp } = input
  
  const yearCalc = calculateYearNumber(birthDate, targetYear)
  const lifePathCalc = calculateLifePath(birthDate)
  
  const interpretation = generateYearlyInterpretation(
    yearCalc.result,
    lifePathCalc.result,
    targetYear,
    name,
    yearCalc.steps
  )
  
  const geometry = generateYearlyGeometry(yearCalc.result, targetYear)
  
  const id = hashString(`${name}-${birthDate}-${targetYear}-${timestamp}`).toString(16)
  
  return {
    id,
    type: 'yearly',
    input,
    lifePathNumber: lifePathCalc.result,
    yearNumber: yearCalc.result,
    interpretation,
    calculationTrace: yearCalc.steps,
    geometry,
    createdAt: timestamp
  }
}

export { yearNumberMeanings }
