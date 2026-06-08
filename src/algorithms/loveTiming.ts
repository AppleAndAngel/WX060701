import { generateId, hashString, reduceNumber } from '@/utils/math'
import { calculateCoreNumbers } from './numerology'
import { buildBaseMatrix, applyTransformations } from './matrix'
import { generateStarMap } from './astronomy'
import { generateGeometry } from './geometry'
import type {
  LoveTimingInput,
  LoveTimingResult,
  LoveTimingScenario,
  CoreNumbers,
  StageSuggestion,
  RiskWarning,
  ActionWindow,
  EnergyPattern,
  LoveTimingInterpretation,
  CalculationStep
} from '@/types'

const scenarioInfo: Record<LoveTimingScenario, {
  title: string
  icon: string
  stageNames: string[]
  coreThemes: string[]
}> = {
  progression: {
    title: '关系推进',
    icon: '♥',
    stageNames: ['试探期', '升温期', '确认期', '稳定期', '深化期'],
    coreThemes: ['勇气', '真诚', '耐心', '承诺', '成长']
  },
  reconciliation: {
    title: '复合时机',
    icon: '∞',
    stageNames: ['反思期', '修复期', '重建期', '信任期', '新生期'],
    coreThemes: ['宽恕', '理解', '改变', '信任', '重生']
  },
  confession: {
    title: '表白时机',
    icon: '♡',
    stageNames: ['准备期', '酝酿期', '突破期', '等待期', '绽放期'],
    coreThemes: ['勇气', '真诚', '时机', '表达', '接纳']
  }
}

const numberLoveTraits: Record<number, {
  strengths: string[]
  challenges: string[]
  loveStyle: string
}> = {
  1: { strengths: ['热情主动', '有领导力', '真诚直接'], challenges: ['自我中心', '急躁', '控制欲'], loveStyle: '热烈直接，愿意为爱情冲锋陷阵' },
  2: { strengths: ['温柔体贴', '善于倾听', '敏感细腻'], challenges: ['过度依赖', '优柔寡断', '容易受伤'], loveStyle: '温柔如水，渴望深度的情感连接' },
  3: { strengths: ['浪漫有趣', '善于表达', '乐观积极'], challenges: ['不够专注', '言多必失', '情绪化'], loveStyle: '浪漫多彩，喜欢用创意表达爱意' },
  4: { strengths: ['忠诚可靠', '稳重踏实', '有责任感'], challenges: ['不够浪漫', '固执保守', '安全感低'], loveStyle: '稳扎稳打，用实际行动证明爱意' },
  5: { strengths: ['自由奔放', '新鲜有趣', '多才多艺'], challenges: ['难以稳定', '害怕承诺', '容易厌倦'], loveStyle: '自由自在，追求充满变化的爱情' },
  6: { strengths: ['关怀备至', '有牺牲精神', '重视家庭'], challenges: ['过度付出', '控制欲强', '追求完美'], loveStyle: '全心付出，渴望温馨长久的关系' },
  7: { strengths: ['精神共鸣', '深度思考', '直觉敏锐'], challenges: ['过于理性', '难以亲近', '自我封闭'], loveStyle: '追求灵魂伴侣，重视精神层面的契合' },
  8: { strengths: ['坚定执着', '有保护欲', '负责担当'], challenges: ['过于强势', '工作优先', '不懂示弱'], loveStyle: '稳定可靠，愿意为爱人撑起一片天' },
  9: { strengths: ['包容大度', '有智慧', '善解人意'], challenges: ['过于理想化', '容易逃避', '边界感弱'], loveStyle: '博爱包容，追求精神层面的共同成长' },
  11: { strengths: ['直觉超凡', '灵性觉醒', '善解人意'], challenges: ['情绪波动大', '敏感脆弱', '容易焦虑'], loveStyle: '灵魂伴侣式，追求深度的灵性连接' },
  22: { strengths: ['稳健可靠', '有远见', '执行力强'], challenges: ['压力过大', '标准过高', '容易疲惫'], loveStyle: '稳定持久，愿意为共同未来努力' },
  33: { strengths: ['慈悲为怀', '治愈能力', '无私奉献'], challenges: ['过度牺牲', '情感负担重', '边界感弱'], loveStyle: '无条件的爱，治愈系伴侣' }
}

const stageVibes = [
  '如同晨曦微光，一切都在悄然酝酿',
  '如同春日暖阳，温暖而充满希望',
  '如同盛夏繁星，璀璨而热烈',
  '如秋收的果实，沉甸甸的喜悦',
  '如同冬日炉火，温暖而绵长'
]

const riskAspects = [
  '沟通不畅', '时机不当', '情绪不稳定', '外部压力',
  '前任干扰', '价值观差异', '生活节奏不合', '信任问题'
]

const generateStages = (
  input: LoveTimingInput,
  yourNumbers: CoreNumbers,
  theirNumbers: CoreNumbers,
  seed: string,
  steps: CalculationStep[]
): StageSuggestion[] => {
  const stages: StageSuggestion[] = []
  const hash = hashString(seed)
  const info = scenarioInfo[input.scenario]

  for (let i = 0; i < 5; i++) {
    const stageHash = hashString(seed + i.toString())
    const baseEnergy = 55 + ((stageHash >> (i * 4)) & 0xff) % 45
    const energy = Math.min(baseEnergy + (i * 3), 98)

    const periodDates = generateStagePeriod(i, input.timestamp)
    const actions = generateStageActions(input.scenario, i, stageHash)

    steps.push({
      step: 100 + i * 20,
      name: `阶段分析 · 第${i + 1}阶段`,
      formula: `stageEnergy(${i}, ${yourNumbers.lifePath}, ${theirNumbers.lifePath})`,
      input: { stage: i, yourNumber: yourNumbers.lifePath, theirNumber: theirNumbers.lifePath },
      output: { name: info.stageNames[i], energy },
      description: `计算「${info.stageNames[i]}」阶段的能量状态`
    })

    stages.push({
      stage: i + 1,
      name: info.stageNames[i],
      period: periodDates,
      energy,
      description: generateStageDescription(input.scenario, i, energy, stageHash, yourNumbers, theirNumbers),
      actions,
      vibe: stageVibes[(stageHash + i) % stageVibes.length]
    })
  }

  return stages
}

const generateStagePeriod = (stageIndex: number, timestamp: number): string => {
  const startDate = new Date(timestamp)
  const endDate = new Date(timestamp)

  const durations = [
    { weeks: 2 },
    { weeks: 4 },
    { weeks: 6 },
    { weeks: 8 },
    { weeks: 12 }
  ]

  const duration = durations[stageIndex]
  let weeksBefore = 0
  for (let i = 0; i < stageIndex; i++) {
    weeksBefore += durations[i].weeks
  }

  startDate.setDate(startDate.getDate() + weeksBefore * 7)
  endDate.setDate(endDate.getDate() + (weeksBefore + duration.weeks) * 7)

  const format = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`
  return `${format(startDate)} - ${format(endDate)}`
}

const generateStageActions = (scenario: LoveTimingScenario, stageIndex: number, hash: number): string[] => {
  const allActions: Record<LoveTimingScenario, string[][]> = {
    progression: [
      ['增加日常问候的频率', '观察对方的反应和态度', '寻找共同兴趣话题', '保持轻松愉快的氛围'],
      ['尝试单独约会', '分享更多个人故事', '适当表达欣赏和赞美', '创造温馨的相处时刻'],
      ['试探性的身体接触', '表达对未来的期待', '观察对方的承诺意愿', '确认彼此的心意'],
      ['正式确定关系', '介绍给重要的朋友', '规划共同的活动', '建立日常相处模式'],
      ['深入了解彼此的价值观', '规划共同的未来', '学习包容和理解', '一起面对挑战']
    ],
    reconciliation: [
      ['给自己时间和空间反思', '客观分析分手原因', '理清自己的真实想法', '避免冲动联系'],
      ['通过中间人了解近况', '适当发送关心信息', '展示自己的积极变化', '避免重提过往矛盾'],
      ['尝试以朋友身份见面', '轻松愉快地交流', '展现成熟的一面', '表达歉意和改变'],
      ['深入沟通过往问题', '表达复合的意愿', '讨论如何避免重蹈覆辙', '给对方考虑的时间'],
      ['正式复合并设定新的相处规则', '重建信任需要时间', '一起创造新的美好回忆', '珍惜第二次机会']
    ],
    confession: [
      ['了解对方的喜好和习惯', '通过朋友打探态度', '增加出现在对方面前的机会', '建立好感基础'],
      ['增加一对一相处的机会', '展现自己的优点', '适当制造暧昧氛围', '观察对方的回应'],
      ['选择合适的时机和地点', '准备真诚的表白话语', '调整好自己的心态', '做好接受任何结果的准备'],
      ['勇敢表达自己的心意', '真诚而非压力', '给对方考虑的时间', '尊重对方的决定'],
      ['无论结果如何都保持尊严', '如果成功就好好珍惜', '如果失败就优雅退场', '感谢这段经历让自己成长']
    ]
  }

  const stageActions = allActions[scenario][stageIndex]
  const selected: string[] = []
  for (let i = 0; i < 4; i++) {
    const index = ((hash >> (i * 4)) & 0xff) % stageActions.length
    if (!selected.includes(stageActions[index])) {
      selected.push(stageActions[index])
    }
  }
  return selected.length >= 3 ? selected.slice(0, 3) : stageActions.slice(0, 3)
}

const generateStageDescription = (
  scenario: LoveTimingScenario,
  stageIndex: number,
  energy: number,
  hash: number,
  yourNumbers: CoreNumbers,
  theirNumbers: CoreNumbers
): string => {
  const info = scenarioInfo[scenario]
  const stageName = info.stageNames[stageIndex]
  const yourTrait = numberLoveTraits[yourNumbers.lifePath] || numberLoveTraits[1]
  const theirTrait = numberLoveTraits[theirNumbers.lifePath] || numberLoveTraits[1]

  if (energy >= 85) {
    return `这是「${stageName}」的黄金时期。你的${yourTrait.strengths[0]}与对方的${theirTrait.strengths[0]}形成完美共振，能量处于巅峰状态。这是推进关系的最佳时机，大胆行动吧！`
  } else if (energy >= 70) {
    return `「${stageName}」阶段能量良好。你的${yourTrait.strengths[1]}能够帮助你，对方的${theirTrait.strengths[1]}也在开放状态。保持耐心，顺势而为，会有不错的进展。`
  } else if (energy >= 55) {
    return `「${stageName}」阶段能量平稳。需要注意你的${yourTrait.challenges[0]}可能造成阻碍，对方的${theirTrait.challenges[0]}也需要被理解。稳扎稳打，不要急于求成。`
  } else {
    return `「${stageName}」阶段能量偏低。你的${yourTrait.challenges[1]}与对方的${theirTrait.challenges[1]}可能产生摩擦。这是一个需要耐心和理解的时期，放慢脚步，打好基础更重要。`
  }
}

const generateRisks = (
  yourNumbers: CoreNumbers,
  theirNumbers: CoreNumbers,
  seed: string,
  steps: CalculationStep[]
): RiskWarning[] => {
  const risks: RiskWarning[] = []
  const hash = hashString(seed)

  const selectedAspects: string[] = []
  for (let i = 0; i < 6; i++) {
    const index = ((hash >> (i * 4)) & 0xff) % riskAspects.length
    if (!selectedAspects.includes(riskAspects[index])) {
      selectedAspects.push(riskAspects[index])
    }
  }

  const yourTrait = numberLoveTraits[yourNumbers.soul] || numberLoveTraits[1]
  const theirTrait = numberLoveTraits[theirNumbers.soul] || numberLoveTraits[1]

  selectedAspects.slice(0, 4).forEach((aspect, i) => {
    const riskHash = hashString(seed + 'risk' + i.toString())
    const levelRoll = (riskHash >> (i * 2)) & 0x03
    const levels: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical']
    const level = levels[levelRoll]

    steps.push({
      step: 200 + i * 15,
      name: `风险评估 · ${aspect}`,
      formula: `riskAnalysis(${aspect}, ${yourNumbers.soul}, ${theirNumbers.soul})`,
      input: { aspect, yourSoul: yourNumbers.soul, theirSoul: theirNumbers.soul },
      output: { level },
      description: `评估「${aspect}」方面的潜在风险`
    })

    risks.push({
      level,
      aspect,
      description: generateRiskDescription(aspect, level, yourTrait, theirTrait, riskHash),
      mitigation: generateRiskMitigation(aspect, level, riskHash)
    })
  })

  return risks.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 }
    return order[a.level] - order[b.level]
  })
}

const generateRiskDescription = (
  aspect: string,
  level: string,
  yourTrait: { challenges: string[] },
  theirTrait: { challenges: string[] },
  hash: number
): string => {
  const templates: Record<string, string[]> = {
    '沟通不畅': [
      '你们的沟通方式存在差异，容易产生误解。你的${yours}与对方的${theirs}可能不在同一频道。',
      '言语表达上的差异需要被重视。你的直接可能被对方误解为冷漠，或者对方的含蓄让你困惑。'
    ],
    '时机不当': [
      '当前的时机可能不是最佳选择。双方都有各自的生活压力需要处理。',
      '宇宙能量显示，有些事情需要更多时间酝酿。急于推进可能适得其反。'
    ],
    '情绪不稳定': [
      '双方的情绪波动可能影响关系发展。你的${yours}需要更多的自我觉察。',
      '情绪管理是这段关系的重要课题。学会在情绪激动时暂停沟通。'
    ],
    '外部压力': [
      '来自家庭、工作或社会的压力可能对关系造成影响。需要共同面对。',
      '外部环境的变化可能考验你们的感情。坚定内心很重要。'
    ],
    '前任干扰': [
      '前任的能量可能还在影响一方或双方。需要明确边界，专注当下。',
      '过往感情的阴影可能投射到现在。学会区分过去和现在。'
    ],
    '价值观差异': [
      '在某些核心价值观上存在差异。需要开放地讨论和理解。',
      '对未来的规划可能有不同的想法。求同存异是关键。'
    ],
    '生活节奏不合': [
      '生活节奏和作息习惯存在差异。需要找到平衡点。',
      '一个人喜欢热闹，一个人喜欢安静。学会尊重和适应。'
    ],
    '信任问题': [
      '信任感的建立需要时间和诚意。过往的经历可能影响现在的判断。',
      '安全感是这段关系的基石。通过行动逐步建立信任。'
    ]
  }

  const template = templates[aspect]?.[hash % 2] || templates['沟通不畅'][0]
  return template.replace('${yours}', yourTrait.challenges[0]).replace('${theirs}', theirTrait.challenges[0])
}

const generateRiskMitigation = (aspect: string, level: string, hash: number): string => {
  const solutions: Record<string, string[]> = {
    '沟通不畅': [
      '尝试每天固定时间深度交流，学会先倾听再表达。',
      '用「我感觉」代替「你总是」，减少指责式沟通。',
      '重要话题选择双方都平静的时候讨论。'
    ],
    '时机不当': [
      '给自己和对方更多时间，有些事情值得等待。',
      '专注于提升自己，当你准备好时，对的时机自然会来。',
      '可以先保持朋友关系，让感情自然升温。'
    ],
    '情绪不稳定': [
      '学习情绪管理技巧，深呼吸能帮你度过激动时刻。',
      '建立情绪安全的约定，吵架时不说伤人的话。',
      '情绪激动时先暂停24小时再沟通。'
    ],
    '外部压力': [
      '把压力说出来，一起面对比独自承受更好。',
      '建立「我们vs问题」的心态，而不是「我vs你」。',
      '设定专属的二人时光，暂时忘记外界的烦恼。'
    ],
    '前任干扰': [
      '明确告诉前任你现在的状态，保持适当距离。',
      '不要在现任面前过多谈论前任，珍惜眼前人。',
      '与现任一起创造新的回忆，覆盖过去的影子。'
    ],
    '价值观差异': [
      '开诚布公地讨论彼此的核心价值观，寻找共同点。',
      '尊重差异，不是所有事情都需要达成一致。',
      '找到双方都能接受的折中点。'
    ],
    '生活节奏不合': [
      '制定「共处时间表」和「独处时间表」，双方都有空间。',
      '尝试参与对方的兴趣活动，找到共同乐趣。',
      '理解并尊重对方的充电方式（社交/独处）。'
    ],
    '信任问题': [
      '信任是通过一次次信守承诺建立的，从小事做起。',
      '坦诚自己的不安，让对方知道如何能给你安全感。',
      '不要考验对方，信任是选择，不是证明题。'
    ]
  }

  const list = solutions[aspect] || solutions['沟通不畅']
  return list[hash % list.length]
}

const generateActionWindows = (
  input: LoveTimingInput,
  yourNumbers: CoreNumbers,
  theirNumbers: CoreNumbers,
  seed: string,
  steps: CalculationStep[]
): ActionWindow[] => {
  const windows: ActionWindow[] = []
  const hash = hashString(seed)
  const now = new Date(input.timestamp)

  const windowNames = {
    progression: ['新月契机', '金星逆行后', '满月能量', '重要纪念日', '季节转换'],
    reconciliation: ['水星顺行后', '满月疗愈', '重要节点', '共同回忆日', '新的开始'],
    confession: ['金星入庙', '新月许愿', '重要节日', '对方生日', '特殊纪念日']
  }

  const names = windowNames[input.scenario]

  for (let i = 0; i < 5; i++) {
    const windowHash = hashString(seed + 'window' + i.toString())
    const energyScore = Math.round(60 + ((windowHash >> (i * 4)) & 0xff) % 40)
    const typeRoll = (windowHash >> (i * 2)) & 0x03
    const types: ('optimal' | 'good' | 'challenging')[] = ['optimal', 'good', 'challenging', 'good']
    const type = types[typeRoll]

    const startOffset = (windowHash % 90) + 7
    const duration = 3 + ((windowHash >> 4) % 10)

    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() + startOffset)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + duration)

    const format = (d: Date) => `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`

    steps.push({
      step: 300 + i * 10,
      name: `行动窗口 · ${names[i]}`,
      formula: `windowEnergy(${i}, ${yourNumbers.destiny}, ${theirNumbers.destiny})`,
      input: { windowIndex: i, yourDestiny: yourNumbers.destiny, theirDestiny: theirNumbers.destiny },
      output: { name: names[i], energyScore, type },
      description: `分析「${names[i]}」期间的行动适宜度`
    })

    windows.push({
      name: names[i],
      startDate: format(startDate),
      endDate: format(endDate),
      energyScore,
      type,
      description: generateWindowDescription(type, energyScore, names[i], windowHash),
      recommendedActions: generateWindowActions(input.scenario, type, windowHash)
    })
  }

  return windows.sort((a, b) => {
    const order: Record<string, number> = { optimal: 0, good: 1, challenging: 2 }
    return order[a.type] - order[b.type]
  })
}

const generateWindowDescription = (
  type: string,
  energyScore: number,
  name: string,
  hash: number
): string => {
  if (type === 'optimal') {
    return `「${name}」期间能量极强（${energyScore}分），宇宙能量强烈支持你的行动。这是难得的黄金窗口期，勇敢迈出重要一步吧！`
  } else if (type === 'good') {
    return `「${name}」期间能量良好（${energyScore}分），是推进关系的有利时机。保持真诚和耐心，会有积极的回应。`
  } else {
    return `「${name}」期间能量具有挑战性（${energyScore}分），可能会遇到一些阻碍。这是一个考验和成长的机会，需要更多智慧和耐心。`
  }
}

const generateWindowActions = (
  scenario: LoveTimingScenario,
  type: string,
  hash: number
): string[] => {
  const optimalActions = {
    progression: ['安排精心设计的约会', '表达内心真实感受', '做出重要承诺', '共同规划未来'],
    reconciliation: ['真诚道歉和表达改变', '安排具有纪念意义的见面', '深入沟通未来的相处模式', '共同创造新的美好回忆'],
    confession: ['选择浪漫的地点表白', '准备真诚的告白话语', '用行动证明心意', '勇敢表达爱意']
  }

  const goodActions = {
    progression: ['增加日常互动', '送贴心小礼物', '一起尝试新事物', '深入交流'],
    reconciliation: ['发送温暖的问候', '分享生活趣事', '以朋友身份见面', '展现积极变化'],
    confession: ['制造偶遇机会', '展现自己的优点', '适当暧昧互动', '试探对方态度']
  }

  const challengingActions = {
    progression: ['保持适当距离', '专注自我提升', '给予对方空间', '反思关系状态'],
    reconciliation: ['暂时减少联系', '专注自我成长', '给对方时间思考', '不要急于求成'],
    confession: ['暂缓表白计划', '继续培养感情基础', '观察对方态度变化', '调整自己的心态']
  }

  const actions = type === 'optimal' ? optimalActions[scenario]
    : type === 'good' ? goodActions[scenario]
    : challengingActions[scenario]

  const selected: string[] = []
  for (let i = 0; i < 4; i++) {
    const index = ((hash >> (i * 4)) & 0xff) % actions.length
    if (!selected.includes(actions[index])) {
      selected.push(actions[index])
    }
  }
  return selected.length >= 3 ? selected.slice(0, 3) : actions.slice(0, 3)
}

const generateEnergyPatterns = (
  yourNumbers: CoreNumbers,
  theirNumbers: CoreNumbers,
  seed: string,
  steps: CalculationStep[]
): EnergyPattern[] => {
  const patterns: EnergyPattern[] = []
  const hash = hashString(seed)

  const patternNames = [
    { name: '情感流动', desc: '你们之间情感能量的流动状态' },
    { name: '沟通频率', desc: '双方沟通的顺畅程度' },
    { name: '默契指数', desc: '不用言语就能理解对方的程度' },
    { name: '激情火花', desc: '浪漫和吸引力的强度' },
    { name: '稳定根基', desc: '关系的稳定和安全感' }
  ]

  patternNames.forEach((p, i) => {
    const patternHash = hashString(seed + 'pattern' + i.toString())
    const value = Math.round(50 + ((patternHash >> (i * 4)) & 0xff) % 50)
    const trendRoll = (patternHash >> (i * 2)) & 0x03
    const trends: ('rising' | 'stable' | 'falling')[] = ['rising', 'stable', 'falling', 'stable']
    const trend = trends[trendRoll]

    steps.push({
      step: 400 + i * 10,
      name: `能量模式 · ${p.name}`,
      formula: `energyPattern(${i}, ${yourNumbers.personality}, ${theirNumbers.personality})`,
      input: { patternIndex: i, yourPersonality: yourNumbers.personality, theirPersonality: theirNumbers.personality },
      output: { name: p.name, value, trend },
      description: `分析「${p.name}」的能量状态和趋势`
    })

    patterns.push({
      name: p.name,
      value,
      description: p.desc,
      trend
    })
  })

  return patterns
}

const generateDoDontLists = (
  scenario: LoveTimingScenario,
  yourNumbers: CoreNumbers,
  theirNumbers: CoreNumbers,
  seed: string
): { doList: string[]; dontList: string[] } => {
  const hash = hashString(seed)

  const allDos = {
    progression: [
      '保持真诚，不要伪装自己',
      '给对方足够的安全感',
      '记住重要的纪念日和细节',
      '在对方需要时给予支持',
      '保持自己的独立性和魅力',
      '定期表达爱意和欣赏',
      '共同成长，一起进步',
      '尊重对方的朋友圈子'
    ],
    reconciliation: [
      '真诚反思自己的问题',
      '用行动证明改变，而不是口头承诺',
      '给对方足够的时间和空间',
      '不要重提过去的矛盾',
      '建立新的相处模式',
      '珍惜第二次机会',
      '一起创造新的美好回忆',
      '学会感恩和珍惜'
    ],
    confession: [
      '保持自信，你值得被爱',
      '选择合适的时机和地点',
      '真诚表达，不要过度修饰',
      '做好接受任何结果的准备',
      '尊重对方的决定',
      '即使失败也保持优雅',
      '表白前确保有一定感情基础',
      '用行动证明你的心意'
    ]
  }

  const allDonts = {
    progression: [
      '不要急于求成，感情需要时间培养',
      '不要在情绪激动时说伤人的话',
      '不要试图改变对方，接受本来的样子',
      '不要把对方的付出当成理所当然',
      '不要冷战，有问题及时沟通',
      '不要和前任保持暧昧联系',
      '不要在公共场合让对方难堪',
      '不要忽视对方的感受'
    ],
    reconciliation: [
      '不要急于求成，修复需要时间',
      '不要重提过去的伤痛',
      '不要用指责的方式沟通',
      '不要在同一个问题上反复犯错',
      '不要把对方的包容当成理所当然',
      '不要冷战，有矛盾及时解决',
      '不要和其他异性保持暧昧',
      '不要拿现任和前任比较'
    ],
    confession: [
      '不要在对方心情不好时表白',
      '不要在公共场合逼迫对方',
      '不要用玩笑的方式表白太严肃的话题',
      '不要因为害怕拒绝而错过',
      '不要表白后过度纠缠',
      '不要在醉酒状态下表白',
      '不要通过第三方传话表白',
      '不要把表白当成赌注'
    ]
  }

  const doList: string[] = []
  const dontList: string[] = []
  const scenarioDos = allDos[scenario]
  const scenarioDonts = allDonts[scenario]

  for (let i = 0; i < 6; i++) {
    const doIndex = ((hash >> (i * 4)) & 0xff) % scenarioDos.length
    if (!doList.includes(scenarioDos[doIndex])) {
      doList.push(scenarioDos[doIndex])
    }
    const dontIndex = ((hash >> (i * 4 + 2)) & 0xff) % scenarioDonts.length
    if (!dontList.includes(scenarioDonts[dontIndex])) {
      dontList.push(scenarioDonts[dontIndex])
    }
  }

  return {
    doList: doList.slice(0, 5),
    dontList: dontList.slice(0, 5)
  }
}

const generateLoveTimingInterpretation = (
  input: LoveTimingInput,
  yourNumbers: CoreNumbers,
  theirNumbers: CoreNumbers,
  stages: StageSuggestion[],
  risks: RiskWarning[],
  actionWindows: ActionWindow[],
  energyPatterns: EnergyPattern[]
): LoveTimingInterpretation => {
  const info = scenarioInfo[input.scenario]

  const avgStageEnergy = Math.round(stages.reduce((sum, s) => sum + s.energy, 0) / stages.length)
  const optimalWindows = actionWindows.filter(w => w.type === 'optimal').length
  const highRisks = risks.filter(r => r.level === 'critical' || r.level === 'high').length

  const overallScore = Math.min(Math.round(
    avgStageEnergy * 0.4 +
    optimalWindows * 15 +
    (5 - highRisks) * 10
  ), 100)

  const yourTrait = numberLoveTraits[yourNumbers.lifePath] || numberLoveTraits[1]
  const theirTrait = numberLoveTraits[theirNumbers.lifePath] || numberLoveTraits[1]

  const titles = {
    progression: [
      `${input.yourName} & ${input.theirName} · 关系推进时机指南`,
      `爱情星图 · 你们关系的最佳推进路线`,
      `量子共振 · 「${info.coreThemes[0]}」与「${info.coreThemes[1]}」的协奏`,
      `命运分岔口 · 何时牵起彼此的手`
    ],
    reconciliation: [
      `${input.yourName} & ${input.theirName} · 复合时机解码`,
      `破镜重圆的星图指引 · 何时重新出发`,
      `爱的第二次机会 · 修复与重建的时间表`,
      `回溯与新生 · 你们复合的最佳时机`
    ],
    confession: [
      `${input.yourName} · 表白时机星图`,
      `鼓起勇气的最佳时刻 · ${input.theirName}的心意解码`,
      `爱要怎么说出口 · 成功率最高的时间表`,
      `心跳加速的瞬间 · 表白的宇宙时机`
    ]
  }

  const titleIndex = (reduceNumber(yourNumbers.lifePath + theirNumbers.lifePath) + input.timestamp) % titles[input.scenario].length
  const title = titles[input.scenario][titleIndex]

  const coreEnergy = `${info.icon} 你的爱情模式：${yourTrait.loveStyle}\n${info.icon} 对方的爱情模式：${theirTrait.loveStyle}`

  const overallDescription = `算法为你解析了这段关系的能量图谱。综合得分 ${overallScore}分，这意味着${overallScore >= 80 ? '成功的概率很高，大胆行动吧！' : overallScore >= 60 ? '有较大的成功机会，需要一些策略和耐心。' : overallScore >= 40 ? '有一定挑战，需要更多准备和等待。' : '时机尚未成熟，建议先打好基础。'} 你的${yourTrait.strengths[0]}与对方的${theirTrait.strengths[0]}能够形成美妙的共振，但也要注意你的${yourTrait.challenges[0]}和对方的${theirTrait.challenges[0]}可能带来的摩擦。`

  const { doList, dontList } = generateDoDontLists(
    input.scenario,
    yourNumbers,
    theirNumbers,
    `${input.yourName}-${input.theirName}-${input.timestamp}`
  )

  const finalAdviceTemplates = {
    progression: [
      '记住，最好的关系是两个人一起成长，而不是一个人追着另一个人跑。保持你的独立性，同时学会依赖对方。',
      '爱情不是竞赛，不需要谁赢谁输。学会示弱，学会妥协，学会在对方的世界里找到自己的位置。',
      '每一段感情都有它的节奏，不要因为外界的声音而匆忙。按照你们自己的速度，一步步走向幸福。'
    ],
    reconciliation: [
      '破镜重圆需要的不是回到过去，而是一起创造新的未来。带着感恩的心，珍惜这第二次机会。',
      '真正的原谅不是忘记，而是选择不让过去的伤痛影响现在的幸福。学会放下，才能真正重新开始。',
      '复合不是认输，而是勇敢地给爱一次机会。但记住，真正的改变需要时间来证明。'
    ],
    confession: [
      '表白不是终点，而是一个新的起点。无论结果如何，勇敢表达自己心意的你都值得被尊重。',
      '最好的表白是：我喜欢你，而你恰好也喜欢我。但如果不是，也没关系，至少你不会后悔。',
      '爱情需要勇气，也需要时机。当你准备好了，就去说吧，答案是什么不重要，重要的是你为自己的心意努力过。'
    ]
  }

  const adviceIndex = hashString(input.yourName + input.theirName + input.timestamp) % finalAdviceTemplates[input.scenario].length
  const finalAdvice = finalAdviceTemplates[input.scenario][adviceIndex]

  const keywords = [
    `${overallScore}分`,
    info.title,
    optimalWindows > 0 ? `${optimalWindows}个黄金窗口` : '等待时机',
    `${yourNumbers.lifePath}↔${theirNumbers.lifePath}`,
    info.coreThemes[0],
    info.coreThemes[1]
  ]

  const interpretation: LoveTimingInterpretation = {
    title,
    overallScore,
    overallDescription,
    coreEnergy,
    stages,
    risks,
    actionWindows,
    energyPatterns,
    finalAdvice,
    doList,
    dontList,
    keywords
  }

  const allNumbers = [
    yourNumbers.lifePath, yourNumbers.destiny, yourNumbers.soul, yourNumbers.personality,
    theirNumbers.lifePath, theirNumbers.destiny, theirNumbers.soul, theirNumbers.personality
  ]

  if (allNumbers.some(n => [11, 22, 33].includes(n))) {
    interpretation.warning = '注意：你们的核心数字中出现了主数字 (11, 22, 33)，这意味着这段关系携带着特殊的灵性潜能和人生课题。这些数字不被约简，它们暗示着不平凡的缘分和更深层的学习。'
  }

  return interpretation
}

export const performLoveTiming = (input: LoveTimingInput): LoveTimingResult => {
  const { yourName, yourBirthDate, theirName, theirBirthDate, scenario, currentSituation, timestamp } = input

  const { coreNumbers: yourNumbers, allSteps: yourSteps } = calculateCoreNumbers(yourName, yourBirthDate)
  const { coreNumbers: theirNumbers, allSteps: theirSteps } = calculateCoreNumbers(theirName, theirBirthDate)

  const labeledYourSteps = yourSteps.map(s => ({ ...s, name: `[你的] ${s.name}` }))
  const labeledTheirSteps = theirSteps.map(s => ({ ...s, name: `[对方] ${s.name}` }))

  const analysisSeed = `${yourName}-${yourBirthDate}-${theirName}-${theirBirthDate}-${scenario}-${timestamp}`
  const analysisSteps: CalculationStep[] = []

  const stages = generateStages(input, yourNumbers, theirNumbers, analysisSeed, analysisSteps)
  const risks = generateRisks(yourNumbers, theirNumbers, analysisSeed, analysisSteps)
  const actionWindows = generateActionWindows(input, yourNumbers, theirNumbers, analysisSeed, analysisSteps)
  const energyPatterns = generateEnergyPatterns(yourNumbers, theirNumbers, analysisSeed, analysisSteps)

  const interpretation = generateLoveTimingInterpretation(
    input,
    yourNumbers,
    theirNumbers,
    stages,
    risks,
    actionWindows,
    energyPatterns
  )

  const combinedNumbers = {
    lifePath: reduceNumber(yourNumbers.lifePath + theirNumbers.lifePath),
    destiny: reduceNumber(yourNumbers.destiny + theirNumbers.destiny),
    soul: reduceNumber(yourNumbers.soul + theirNumbers.soul),
    personality: reduceNumber(yourNumbers.personality + theirNumbers.personality)
  }

  const coreSum = combinedNumbers.lifePath + combinedNumbers.destiny + combinedNumbers.soul + combinedNumbers.personality
  const baseMatrix = buildBaseMatrix({ lifePath: coreSum, destiny: coreSum, soul: coreSum, personality: coreSum })
  const { transformedMatrix, eigenvalues, steps: matrixSteps } = applyTransformations(baseMatrix, combinedNumbers)

  const { starMap, steps: astronomySteps } = generateStarMap(eigenvalues, timestamp, [], [])
  const { geometry, steps: geometrySteps } = generateGeometry(combinedNumbers, eigenvalues, scenario)

  const calculationTrace = [
    ...labeledYourSteps,
    ...labeledTheirSteps,
    ...analysisSteps,
    ...matrixSteps,
    ...astronomySteps,
    ...geometrySteps
  ]

  return {
    id: generateId(),
    type: 'love-timing',
    input,
    yourNumbers,
    theirNumbers,
    geometry,
    starMap,
    interpretation,
    calculationTrace,
    createdAt: Date.now()
  }
}
