import { reduceNumber, hashString, DeterministicRandom } from '@/utils/math'
import { calculateCoreNumbers } from './numerology'
import type {
  CalculationStep,
  DreamInterpretationInput,
  DreamInterpretationResult,
  DreamInterpretation,
  DreamEmotion,
  DreamSymbol,
  PotentialWarning,
  ActionSuggestion,
  GeometryData,
  CoreNumbers
} from '@/types'

const dreamEmotions: Record<string, DreamEmotion> = {
  joy: { name: '喜悦', intensity: 0, description: '梦境中充满快乐与满足', color: '#FFD700' },
  fear: { name: '恐惧', intensity: 0, description: '面对未知与威胁的焦虑', color: '#4B0082' },
  sadness: { name: '悲伤', intensity: 0, description: '失落与哀伤的情绪流动', color: '#4682B4' },
  anger: { name: '愤怒', intensity: 0, description: '积压的情绪正在寻求出口', color: '#DC143C' },
  surprise: { name: '惊讶', intensity: 0, description: '意外事件带来的冲击', color: '#FF69B4' },
  peace: { name: '平静', intensity: 0, description: '内心深处的祥和与安宁', color: '#98FB98' },
  confusion: { name: '困惑', intensity: 0, description: '方向不明的迷茫感', color: '#708090' },
  longing: { name: '渴望', intensity: 0, description: '对某物或某人的深切向往', color: '#DDA0DD' }
}

const dreamSymbolLibrary: Record<string, { symbol: string; meaning: string; rune: string; number: number }[]> = {
  water: [
    { symbol: '海洋', meaning: '潜意识的浩瀚与情感的深度', rune: 'ᛝ', number: 7 },
    { symbol: '河流', meaning: '生命的流动与变化', rune: 'ᚱ', number: 5 },
    { symbol: '雨水', meaning: '情绪的释放与净化', rune: 'ᚹ', number: 6 }
  ],
  flying: [
    { symbol: '飞翔', meaning: '超越限制、追求自由', rune: '᛫', number: 1 },
    { symbol: '坠落', meaning: '失控感与不安全感', rune: 'ᚺ', number: 5 }
  ],
  animals: [
    { symbol: '蛇', meaning: '转化、智慧与原始能量', rune: 'ᛊ', number: 8 },
    { symbol: '狼', meaning: '本能、孤独与自由', rune: 'ᚢ', number: 4 },
    { symbol: '鸟', meaning: '讯息、自由与灵性', rune: 'ᛖ', number: 3 }
  ],
  nature: [
    { symbol: '森林', meaning: '探索未知、潜意识的迷宫', rune: 'ᛞ', number: 7 },
    { symbol: '山', meaning: '挑战、障碍与目标', rune: 'ᛟ', number: 4 },
    { symbol: '花', meaning: '美丽、绽放与可能性', rune: 'ᛒ', number: 6 }
  ],
  structures: [
    { symbol: '房子', meaning: '自我、内心世界与安全感', rune: 'ᛟ', number: 4 },
    { symbol: '道路', meaning: '人生方向与旅程', rune: 'ᚱ', number: 5 },
    { symbol: '门', meaning: '新的机会与转变', rune: 'ᚦ', number: 3 }
  ],
  celestial: [
    { symbol: '月亮', meaning: '直觉、情绪周期与神秘', rune: 'ᛗ', number: 2 },
    { symbol: '太阳', meaning: '活力、意识与自我表达', rune: 'ᛋ', number: 1 },
    { symbol: '星星', meaning: '希望、指引与灵感', rune: 'ᛉ', number: 9 }
  ]
}

const dreamMoodKeywords: Record<string, string[]> = {
  joy: ['开心', '快乐', '高兴', '兴奋', '喜悦', '满足', '幸福', '愉悦', '欢笑', '轻松'],
  fear: ['害怕', '恐惧', '担心', '焦虑', '恐怖', '惊恐', '不安', '紧张', '威胁', '危险'],
  sadness: ['难过', '伤心', '悲伤', '哭泣', '失落', '沮丧', '痛苦', '哀伤', '忧郁', '绝望'],
  anger: ['生气', '愤怒', '恼火', '暴怒', '愤恨', '不满', '发火', '气愤', '仇恨', '烦躁'],
  surprise: ['惊讶', '意外', '震惊', '突然', '没想到', '诧异', '惊奇', '惊呆'],
  peace: ['平静', '安宁', '祥和', '宁静', '放松', '舒适', '安心', '恬静', '平和'],
  confusion: ['困惑', '迷茫', '不知所措', '混乱', '模糊', '不清楚', '疑惑', '迷失'],
  longing: ['想念', '思念', '渴望', '向往', '期盼', '等待', '盼望', '期待', '怀念']
}

const dreamContentKeywords: Record<string, string[]> = {
  water: ['水', '海', '洋', '河', '江', '湖', '雨', '游泳', '潜水', '波浪', '潮汐'],
  flying: ['飞', '飞翔', '飞行', '飘', '坠落', '掉下来', '天空', '云端', '翅膀'],
  animals: ['动物', '蛇', '狼', '狗', '猫', '鸟', '鱼', '狮子', '老虎', '熊', '马'],
  nature: ['森林', '树', '山', '花', '草', '花园', '公园', '自然', '野外'],
  structures: ['房子', '家', '建筑', '楼', '房间', '门', '窗', '道路', '桥', '楼梯'],
  celestial: ['月亮', '太阳', '星星', '天空', '宇宙', '星球', '银河', '星空']
}

const numberDreamMeanings: Record<number, { theme: string; essence: string }> = {
  1: { theme: '新的开始', essence: '这个梦预示着新的机遇正在向你走来。你的潜意识正在为一次重要的新生做准备。' },
  2: { theme: '关系平衡', essence: '梦境反映了你在关系中的渴望与挑战。阴阳能量正在你的内在寻求调和。' },
  3: { theme: '创造表达', essence: '你的创造力正在梦中涌动。潜意识在提醒你，有些灵感需要被带到现实中。' },
  4: { theme: '稳固基础', essence: '梦境指向安全感与归属感的议题。你可能正在内在构建新的支撑结构。' },
  5: { theme: '变化自由', essence: '这个梦是变化的先兆。你的灵魂渴望突破限制，探索更广阔的可能性。' },
  6: { theme: '爱与疗愈', essence: '梦境涉及心的议题。有某些情感需要被看见、被接纳、被疗愈。' },
  7: { theme: '内省智慧', essence: '这是一个充满灵性讯息的梦。你的深层智慧正在尝试与你沟通。' },
  8: { theme: '力量显化', essence: '梦境揭示了你内在的力量。某些被压抑的能量正在寻求显化的通道。' },
  9: { theme: '圆满转化', essence: '这个梦标志着一个周期的完成。某些旧的模式正在终结，为新的可能性腾出空间。' },
  11: { theme: '直觉启示', essence: '主数字11的出现，意味着强烈的灵性讯息正在通过梦境传递。保持觉知。' },
  22: { theme: '宏大愿景', essence: '主数字22的出现，暗示你的梦与更大的人生使命相关。你正在被召唤去实现某个宏大的愿景。' },
  33: { theme: '慈悲疗愈', essence: '主数字33的出现，标志着深刻的疗愈正在发生。你的梦可能与服务他人的使命有关。' }
}

const runeDreamMeanings: Record<string, { name: string; message: string }> = {
  'ᚠ': { name: '法胡', message: '财富与成就的能量在你的梦中流动。某些有价值的东西正在向你靠近。' },
  'ᚢ': { name: '乌鲁兹', message: '力量与勇气的原始能量被唤醒。你被召唤去面对某些需要勇气的事情。' },
  'ᚦ': { name: '图里萨兹', message: '防御与突破的张力存在于你的梦中。某些障碍需要被突破。' },
  'ᚨ': { name: '安苏兹', message: '智慧与沟通的讯息正在传递。注意梦中的声音、文字或对话。' },
  'ᚱ': { name: '莱多', message: '旅程与方向的能量在转动。你的人生道路正在经历重要的转向。' },
  'ᚲ': { name: '卡诺', message: '光明与启示正在驱散黑暗。某些之前看不清的事情即将变得清晰。' },
  'ᚷ': { name: '吉波', message: '礼物与交换的法则在运作。你可能即将收到或需要给予某些重要的东西。' },
  'ᚹ': { name: '维纽', message: '喜悦与和谐的能量在流动。关系中的某些美好的事物正在显化。' },
  'ᚺ': { name: '哈格拉兹', message: '变化与转化的风暴正在酝酿。某些意外可能带来深远的转变。' },
  'ᚾ': { name: '那乌提兹', message: '需求与限制的功课正在显现。某些匮乏感需要被正视和转化。' },
  'ᛁ': { name: '伊萨', message: '冻结与等待的能量。有些事情需要时间来解冻，保持耐心。' },
  'ᛃ': { name: '耶拉', message: '收获与循环完成的能量。你之前种下的某些种子即将成熟。' },
  'ᛇ': { name: '艾瓦兹', message: '守护与超越的能量。你被保护着，正在穿越重要的人生门槛。' },
  'ᛈ': { name: '佩索', message: '奥秘与重生的能量正在运作。某些事情正在经历深层的转化。' },
  'ᛉ': { name: '艾尔吉兹', message: '保护与神性连接的能量。你的守护力量正在梦中与你沟通。' },
  'ᛊ': { name: '索维洛', message: '太阳的能量正在照耀你的道路。 clarity（清晰）正在到来。' },
  'ᛏ': { name: '提瓦兹', message: '正义与胜利的能量。你内在的战士正在被唤醒。' },
  'ᛒ': { name: '伯卡纳', message: '诞生与滋养的能量。新的事物正在你的内在孕育。' },
  'ᛖ': { name: '伊瓦', message: '马匹与旅程的能量。自由的渴望正在你的梦中显现。' },
  'ᛗ': { name: '曼纳兹', message: '人性与自我的议题。你正在梦中探索更深层的自我认知。' },
  'ᛚ': { name: '拉各兹', message: '水与流动的能量。情绪正在寻求自然的表达通道。' },
  'ᛜ': { name: '英格瓦兹', message: '内在的成长与肥沃。某些潜力正在你的内在成熟。' },
  'ᛞ': { name: '达格兹', message: '黎明与觉醒的能量。一个新的意识阶段正在破晓。' },
  'ᛟ': { name: '欧瑟拉', message: '家园与传承的能量。根基与归属感的议题在梦中显现。' }
}

const analyzeEmotions = (dreamContent: string, dreamMood: string, seed: string): DreamEmotion[] => {
  const rng = new DeterministicRandom(`${seed}-emotions`)
  const detectedEmotions: DreamEmotion[] = []
  const emotionScores: Record<string, number> = {}

  for (const [emotion, keywords] of Object.entries(dreamMoodKeywords)) {
    let score = 0
    for (const keyword of keywords) {
      if (dreamContent.includes(keyword)) score += 2
      if (dreamMood.includes(keyword)) score += 3
    }
    emotionScores[emotion] = score
  }

  const hasAnyScore = Object.values(emotionScores).some(s => s > 0)

  for (const [emotion, baseEmotion] of Object.entries(dreamEmotions)) {
    let intensity = emotionScores[emotion] || 0
    if (!hasAnyScore) {
      intensity = rng.next() * 60 + 20
    } else {
      intensity = Math.min(100, intensity * 10 + rng.next() * 20)
    }

    if (intensity > 30) {
      detectedEmotions.push({
        ...baseEmotion,
        intensity: Math.round(intensity)
      })
    }
  }

  if (detectedEmotions.length === 0) {
    detectedEmotions.push({
      ...dreamEmotions.peace,
      intensity: 50 + Math.round(rng.next() * 30)
    })
  }

  return detectedEmotions.sort((a, b) => b.intensity - a.intensity).slice(0, 4)
}

const analyzeSymbols = (dreamContent: string, seed: string): DreamSymbol[] => {
  const rng = new DeterministicRandom(`${seed}-symbols`)
  const detectedSymbols: DreamSymbol[] = []
  const matchedCategories: string[] = []

  for (const [category, keywords] of Object.entries(dreamContentKeywords)) {
    for (const keyword of keywords) {
      if (dreamContent.includes(keyword) && !matchedCategories.includes(category)) {
        matchedCategories.push(category)
        break
      }
    }
  }

  if (matchedCategories.length === 0) {
    const allCategories = Object.keys(dreamContentKeywords)
    const randomCount = 2 + Math.floor(rng.next() * 2)
    for (let i = 0; i < randomCount; i++) {
      const idx = Math.floor(rng.next() * allCategories.length)
      matchedCategories.push(allCategories[idx])
      allCategories.splice(idx, 1)
    }
  }

  for (const category of matchedCategories.slice(0, 4)) {
    const symbolOptions = dreamSymbolLibrary[category]
    if (symbolOptions && symbolOptions.length > 0) {
      const idx = Math.floor(rng.next() * symbolOptions.length)
      const symbolData = symbolOptions[idx]
      detectedSymbols.push({
        symbol: symbolData.symbol,
        meaning: symbolData.meaning,
        runeConnection: runeDreamMeanings[symbolData.rune]?.message || symbolData.rune,
        numerologyNumber: symbolData.number
      })
    }
  }

  return detectedSymbols
}

const generateWarnings = (emotions: DreamEmotion[], symbols: DreamSymbol[], seed: string): PotentialWarning[] => {
  const rng = new DeterministicRandom(`${seed}-warnings`)
  const warnings: PotentialWarning[] = []

  const highIntensityEmotion = emotions.find(e => e.intensity > 75)
  if (highIntensityEmotion) {
    const severity: 'low' | 'medium' | 'high' = highIntensityEmotion.intensity > 90 ? 'high' : highIntensityEmotion.intensity > 75 ? 'medium' : 'low'
    warnings.push({
      aspect: `情绪${highIntensityEmotion.name}`,
      severity,
      description: `梦中${highIntensityEmotion.name}的情绪强度达到${highIntensityEmotion.intensity}%，这可能是潜意识在提醒你关注现实生活中被压抑的${highIntensityEmotion.description.slice(0, -1)}。`
    })
  }

  const warningPool = [
    { aspect: '潜意识信号', description: '梦中反复出现的主题值得关注，它们是潜意识正在尝试沟通的重要讯息。' },
    { aspect: '能量流动', description: '某些能量可能在你的内在受阻，梦境提供了一个释放和整合的通道。' },
    { aspect: '未竟事务', description: '梦中的某些场景可能与过去未完成的经历相关，需要被正视和接纳。' },
    { aspect: '身心平衡', description: '注意你的身心健康，梦境的强度可能反映了你当前的压力水平。' }
  ]

  const additionalCount = 1 + Math.floor(rng.next() * 2)
  for (let i = 0; i < additionalCount && i < warningPool.length; i++) {
    const idx = Math.floor(rng.next() * warningPool.length)
    const warning = warningPool[idx]
    const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']
    warnings.push({
      aspect: warning.aspect,
      severity: severities[Math.floor(rng.next() * 3)],
      description: warning.description
    })
    warningPool.splice(idx, 1)
  }

  return warnings.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })
}

const generateActionSuggestions = (
  dreamNumber: number,
  coreNumbers: CoreNumbers,
  symbols: DreamSymbol[],
  seed: string
): ActionSuggestion[] => {
  const rng = new DeterministicRandom(`${seed}-actions`)

  const allActions: ActionSuggestion[] = [
    {
      title: '记录梦境日记',
      description: '每天醒来后立即记录梦境，即使只是片段。持续的记录会帮助你识别潜意识的模式和讯息。',
      priority: 'immediate',
      relatedNumber: 7
    },
    {
      title: '冥想连接梦境',
      description: '在安静的状态下，观想梦中的关键画面和感受。允许潜意识透过意象向你传递更深层的指引。',
      priority: 'immediate',
      relatedNumber: 9
    },
    {
      title: '情绪释放练习',
      description: '识别梦中的核心情绪，并在清醒生活中为这些情绪找到健康的表达通道。书写、运动或艺术创作都是很好的方式。',
      priority: 'short-term',
      relatedNumber: 2
    },
    {
      title: '关注身体信号',
      description: '梦境也可能反映身体的状态。注意最近的饮食、睡眠和运动习惯，确保身心处于平衡状态。',
      priority: 'short-term',
      relatedNumber: 4
    },
    {
      title: '探索梦中象征',
      description: '研究梦中出现的象征物在不同文化和传统中的含义，但最重要的是，它们对你个人而言意味着什么。',
      priority: 'short-term',
      relatedNumber: 3
    },
    {
      title: '设定显化意图',
      description: '基于梦境的启示，为接下来的一段时间设定清晰的意图。将梦境的能量引导到现实生活的创造中。',
      priority: 'long-term',
      relatedNumber: 8
    },
    {
      title: '保持梦境觉知',
      description: '练习在梦中保持觉知（清明梦），这将开启与潜意识更深层的合作。睡前暗示自己："我将记得我的梦。"',
      priority: 'long-term',
      relatedNumber: 1
    },
    {
      title: '分享与整合',
      description: '与信任的人分享你的梦境，通过讲述和反馈，你可能会获得新的洞察和理解。',
      priority: 'long-term',
      relatedNumber: 6
    }
  ]

  const selectedActions: ActionSuggestion[] = []
  const availableActions = [...allActions]

  const immediateCount = 1
  const shortTermCount = 2
  const longTermCount = 1

  const selectByPriority = (priority: 'immediate' | 'short-term' | 'long-term', count: number) => {
    const priorityActions = availableActions.filter(a => a.priority === priority)
    for (let i = 0; i < count && priorityActions.length > 0; i++) {
      const idx = Math.floor(rng.next() * priorityActions.length)
      const action = priorityActions[idx]
      selectedActions.push({
        ...action,
        relatedNumber: [dreamNumber, coreNumbers.lifePath, coreNumbers.soul][Math.floor(rng.next() * 3)]
      })
      priorityActions.splice(idx, 1)
      const globalIdx = availableActions.findIndex(a => a === action)
      if (globalIdx > -1) availableActions.splice(globalIdx, 1)
    }
  }

  selectByPriority('immediate', immediateCount)
  selectByPriority('short-term', shortTermCount)
  selectByPriority('long-term', longTermCount)

  return selectedActions
}

const calculateDreamNumber = (
  dreamContent: string,
  dreamMood: string,
  coreNumbers: CoreNumbers,
  timestamp: number
): { result: number; steps: CalculationStep[] } => {
  const steps: CalculationStep[] = []

  const cleanContent = dreamContent.toLowerCase().replace(/[^a-z\u4e00-\u9fa5]/g, '')
  const cleanMood = dreamMood.toLowerCase().replace(/[^a-z\u4e00-\u9fa5]/g, '')

  steps.push({
    step: 1,
    name: '梦境文本预处理',
    formula: '提取梦境描述中的有效字符',
    input: { dreamContent, dreamMood },
    output: { cleanContent: cleanContent.slice(0, 20), cleanMood },
    description: '清理梦境文本，去除无关字符，保留字母和汉字'
  })

  let contentSum = 0
  for (let i = 0; i < cleanContent.length; i++) {
    const char = cleanContent[i]
    const code = char.charCodeAt(0)
    contentSum += code % 9 || 9
  }

  let moodSum = 0
  for (let i = 0; i < cleanMood.length; i++) {
    const char = cleanMood[i]
    const code = char.charCodeAt(0)
    moodSum += code % 9 || 9
  }

  steps.push({
    step: 2,
    name: '字符编码求和',
    formula: 'Σ(charCode % 9 || 9)',
    input: { cleanContent, cleanMood },
    output: { contentSum, moodSum },
    description: '将每个字符的编码映射为1-9的数字后求和'
  })

  const contentReduced = reduceNumber(contentSum)
  const moodReduced = reduceNumber(moodSum)

  steps.push({
    step: 3,
    name: '数位约简',
    formula: `reduce(${contentSum}) = ${contentReduced}, reduce(${moodSum}) = ${moodReduced}`,
    input: { contentSum, moodSum },
    output: { contentReduced, moodReduced },
    description: '持续求和直到得到个位数或主数字(11, 22, 33)'
  })

  const timestampDigits = timestamp.toString().slice(-8)
  const timestampSum = timestampDigits.split('').reduce((acc, d) => acc + parseInt(d, 10), 0)
  const timestampReduced = reduceNumber(timestampSum)

  steps.push({
    step: 4,
    name: '时间能量融合',
    formula: `timestampDigits → Σ → reduce`,
    input: timestamp,
    output: { timestampDigits, timestampReduced },
    description: '融入占卜时刻的时间能量'
  })

  const totalSum = contentReduced + moodReduced + timestampReduced + coreNumbers.soul
  const dreamNumber = reduceNumber(totalSum)

  steps.push({
    step: 5,
    name: '梦境数字合成',
    formula: `content(${contentReduced}) + mood(${moodReduced}) + time(${timestampReduced}) + soul(${coreNumbers.soul}) = ${totalSum} → reduce(${totalSum}) = ${dreamNumber}`,
    input: { contentReduced, moodReduced, timestampReduced, soulNumber: coreNumbers.soul },
    output: dreamNumber,
    description: '整合所有能量维度，得到最终的梦境核心数字'
  })

  return { result: dreamNumber, steps }
}

const generateDreamGeometry = (dreamNumber: number, seed: string): GeometryData => {
  const rng = new DeterministicRandom(`${seed}-geometry`)

  const geometryTypes = ['circle', 'hexagon', 'star', 'pentagon', 'triangle', 'moon', 'flower']
  const type = geometryTypes[dreamNumber % geometryTypes.length]

  const vertexCount = dreamNumber === 11 || dreamNumber === 22 ? 12 : dreamNumber + 4
  const vertices: { x: number; y: number }[] = []
  const centerX = 200
  const centerY = 200

  for (let i = 0; i < vertexCount; i++) {
    const angle = (i / vertexCount) * Math.PI * 2 - Math.PI / 2
    const radius = 130 + (rng.next() - 0.5) * 30
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

const generateDreamInterpretation = (
  dreamNumber: number,
  coreNumbers: CoreNumbers,
  emotions: DreamEmotion[],
  symbols: DreamSymbol[],
  warnings: PotentialWarning[],
  actionSuggestions: ActionSuggestion[],
  input: DreamInterpretationInput
): DreamInterpretation => {
  const meaning = numberDreamMeanings[dreamNumber] || numberDreamMeanings[9]
  const seed = `${input.name}-${input.timestamp}-${dreamNumber}`
  const rng = new DeterministicRandom(seed)

  const titleVariations = [
    `梦境解码 · 数字${dreamNumber}的启示`,
    `潜意识的低语 · ${meaning.theme}`,
    `梦的神谕 · 数字${dreamNumber}之境`,
    `睡梦之镜 · ${meaning.theme}`
  ]
  const title = titleVariations[rng.next() % titleVariations.length]

  const primaryEmotion = emotions[0]
  const primarySymbol = symbols[0]

  const subconsciousMessages = [
    `你的潜意识正在通过梦境向你传达关于${meaning.theme}的重要讯息。注意${primarySymbol?.symbol || '梦中的象征'}所承载的含义，它可能是理解整个梦境的关键。在清醒生活中，保持对${primaryEmotion?.name || '内在情绪'}的觉知，将帮助你整合这份来自深层自我的礼物。`,
    `这不是一个普通的梦。数字${dreamNumber}的能量正在你的潜意识中运作，预示着${meaning.theme}的主题正在你的生命中展开。${primaryEmotion?.name || '情绪'}的强度揭示了你对这一议题的投入程度。倾听梦中的声音，它们是你内在智慧的表达。`,
    `梦是灵魂的语言，而你刚刚收到了一封来自深层自我的信。数字${dreamNumber}是这封信的密码，${meaning.essence}${primarySymbol ? `梦中的${primarySymbol.symbol}是信中的重点，${primarySymbol.meaning}。` : ''}请将这份洞见带入你的日常生活。`
  ]

  const subconsciousMessage = subconsciousMessages[rng.next() % subconsciousMessages.length]

  const keywords: string[] = [
    meaning.theme,
    ...emotions.slice(0, 2).map(e => e.name),
    ...symbols.slice(0, 2).map(s => s.symbol),
    '潜意识'
  ]

  const interpretation: DreamInterpretation = {
    title,
    overallTheme: meaning.theme,
    coreNumber: dreamNumber,
    coreNumberMeaning: meaning.essence,
    emotions,
    symbols,
    warnings,
    actionSuggestions,
    subconsciousMessage,
    keywords
  }

  if ([11, 22, 33].includes(dreamNumber)) {
    interpretation.warning = `注意：你的梦境数字是主数字 ${dreamNumber}，这意味着这个梦承载着特殊的灵性讯息和重要的人生指引。请给予它特别的关注和深度的冥想。`
  }

  return interpretation
}

export const performDreamInterpretation = (input: DreamInterpretationInput): DreamInterpretationResult => {
  const { name, birthDate, dreamContent, dreamMood, timestamp } = input

  const { coreNumbers, allSteps: coreSteps } = calculateCoreNumbers(name, birthDate)

  const seed = `${name}-${birthDate}-${timestamp}`

  const emotions = analyzeEmotions(dreamContent, dreamMood, seed)
  const symbols = analyzeSymbols(dreamContent, seed)

  const { result: dreamNumber, steps: dreamSteps } = calculateDreamNumber(
    dreamContent,
    dreamMood,
    coreNumbers,
    timestamp
  )

  const warnings = generateWarnings(emotions, symbols, seed)
  const actionSuggestions = generateActionSuggestions(dreamNumber, coreNumbers, symbols, seed)

  const interpretation = generateDreamInterpretation(
    dreamNumber,
    coreNumbers,
    emotions,
    symbols,
    warnings,
    actionSuggestions,
    input
  )

  const geometry = generateDreamGeometry(dreamNumber, seed)

  const calculationTrace = [
    {
      step: 0,
      name: '核心数字计算',
      formula: 'coreNumbers(name, birthDate)',
      input: { name, birthDate },
      output: coreNumbers,
      description: '基于姓名和出生日期计算核心数字命盘'
    },
    ...coreSteps,
    {
      step: 50,
      name: '梦境数字计算',
      formula: 'dreamNumber(content, mood, coreNumbers, timestamp)',
      input: { dreamContent, dreamMood },
      output: dreamNumber,
      description: '基于梦境内容计算专属梦境数字'
    },
    ...dreamSteps
  ]

  const id = hashString(`${name}-${birthDate}-${dreamContent.slice(0, 50)}-${timestamp}`).toString(16)

  return {
    id,
    type: 'dream-interpretation',
    input,
    coreNumbers,
    dreamNumber,
    interpretation,
    calculationTrace,
    geometry,
    createdAt: timestamp
  }
}

export { numberDreamMeanings, dreamEmotions }
