import { generateId, DeterministicRandom } from '@/utils/math'
import { calculateCoreNumbers } from './numerology'
import { buildBaseMatrix, applyTransformations } from './matrix'
import { generateStarMap } from './astronomy'
import { generateGeometry } from './geometry'
import type { TimeCapsuleInput, TimeCapsuleResult, TimeCapsulePrediction, TimeCapsuleSeal, CoreNumbers, GeometryData, StarMap } from '@/types'

const sealTexts = [
  '时光之封印已镌刻于星尘之中，待约定之日降临',
  '此胶囊已被数字矩阵封印，唯有时间之钥能开启',
  '命运的预言已被封存，静候未来的回响',
  '宇宙的记忆已在此定格，等待重逢的时刻',
  '时间的河流在此打结，未来将在此处展开'
]

const sealSymbols = ['✦', '✧', '☽', '☸', '∞', '⚚', '✵', '❂', '☯']

const predictionThemes = [
  '变革与重生', '稳定与积累', '关系与连接',
  '事业与成就', '内在成长', '创意表达',
  '财富与丰盛', '健康与活力', '智慧与洞察'
]

const outcomeTemplates = [
  '在{date}前后，你可能会经历一个重要的转折点，它将改变你对{theme}的看法',
  '宇宙的能量将在{period}期间汇聚，为你带来关于{theme}的深刻启示',
  '一个意想不到的事件可能会在{season}出现，它将验证你此刻关于{theme}的疑问',
  '你将在{timeframe}获得 clarity，理解此刻困惑的真正含义',
  '命运的齿轮将在{moment}开始转动，带你走向与{theme}相关的新旅程'
]

const warningTemplates = [
  '注意不要在{period}过于执着于某个特定结果，保持开放',
  '当{theme}相关的机会出现时，不要让恐惧阻碍你的步伐',
  '在{season}可能会有混淆的能量，建议在重要决定前多给自己时间',
  '避免在{timeframe}冲动行事，尤其是与{theme}相关的事务',
  '留意{moment}前后出现的重复模式，它们可能是重要的信号'
]

const guidanceTemplates = [
  '保持记录的习惯，特别是关于{theme}的想法和感受，未来的你会感谢此刻的自己',
  '在接下来的日子里，多关注内心的声音，它将指引你走向正确的方向',
  '培养耐心，{theme}的展开需要时间，每一步都有其意义',
  '相信宇宙的 timing，一切都在完美的秩序中展开',
  '保持好奇心和开放性，答案可能以你意想不到的方式到来'
]

export const generateTimeCapsulePrediction = (
  coreNumbers: CoreNumbers,
  geometry: GeometryData,
  starMap: StarMap,
  question: string,
  targetDate: string,
  createdAt: number
): TimeCapsulePrediction => {
  const seed = `${coreNumbers.lifePath}-${coreNumbers.destiny}-${coreNumbers.soul}-${coreNumbers.personality}-${targetDate}-${createdAt}`
  const rng = new DeterministicRandom(seed)
  
  const coreSum = coreNumbers.lifePath + coreNumbers.destiny + coreNumbers.soul + coreNumbers.personality
  const targetDateObj = new Date(targetDate)
  const targetYear = targetDateObj.getFullYear()
  const targetMonth = targetDateObj.getMonth() + 1
  const targetDay = targetDateObj.getDate()
  
  const timeUntilTarget = targetDateObj.getTime() - createdAt
  const daysUntilTarget = Math.ceil(timeUntilTarget / (1000 * 60 * 60 * 24))
  
  const keyThemes: string[] = []
  const usedThemeIndices = new Set<number>()
  while (keyThemes.length < 3) {
    const idx = Math.floor(rng.next() * predictionThemes.length)
    if (!usedThemeIndices.has(idx)) {
      usedThemeIndices.add(idx)
      keyThemes.push(predictionThemes[idx])
    }
  }
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  
  const getSeason = (month: number) => {
    if (month >= 3 && month <= 5) return '春季'
    if (month >= 6 && month <= 8) return '夏季'
    if (month >= 9 && month <= 11) return '秋季'
    return '冬季'
  }
  
  const getTimeframe = (days: number) => {
    if (days <= 30) return '未来一个月'
    if (days <= 90) return '未来三个月'
    if (days <= 180) return '未来半年'
    if (days <= 365) return '未来一年'
    return `未来${Math.ceil(days / 365)}年`
  }
  
  const potentialOutcomes: string[] = []
  for (let i = 0; i < 3; i++) {
    const template = outcomeTemplates[Math.floor(rng.next() * outcomeTemplates.length)]
    const theme = keyThemes[i % keyThemes.length]
    let outcome = template
      .replace('{date}', formatDate(targetDateObj))
      .replace('{period}', getTimeframe(daysUntilTarget))
      .replace('{season}', getSeason(targetMonth))
      .replace('{timeframe}', getTimeframe(daysUntilTarget))
      .replace('{moment}', `${targetYear}年${targetMonth}月`)
      .replace('{theme}', theme)
    potentialOutcomes.push(outcome)
  }
  
  const warningSigns: string[] = []
  for (let i = 0; i < 2; i++) {
    const template = warningTemplates[Math.floor(rng.next() * warningTemplates.length)]
    const theme = keyThemes[i % keyThemes.length]
    let warning = template
      .replace('{period}', getTimeframe(daysUntilTarget))
      .replace('{season}', getSeason(targetMonth))
      .replace('{timeframe}', getTimeframe(daysUntilTarget))
      .replace('{theme}', theme)
    warningSigns.push(warning)
  }
  
  const guidanceIndex = Math.floor(rng.next() * guidanceTemplates.length)
  const guidance = guidanceTemplates[guidanceIndex].replace('{theme}', keyThemes[0])
  
  const summaries = [
    `从现在到${formatDate(targetDateObj)}，你的生命能量将围绕${keyThemes.join('、')}展开一场深刻的旅程。数字${coreSum % 9 + 1}作为这个时间段的核心频率，预示着你将在这些领域获得重要的成长与领悟。`,
    `在接下来${getTimeframe(daysUntilTarget)}里，宇宙正在为你编织与${keyThemes.join('、')}相关的剧情。你的生命路径数${coreNumbers.lifePath}与命运数${coreNumbers.destiny}的共振，将在${formatDate(targetDateObj)}前后达到一个关键的顶点。`,
    `时间的箭头指向${formatDate(targetDateObj)}，在那里，你关于"${question}"的疑问将得到某种形式的回应。${keyThemes.join('、')}将是这段旅程的关键词，而几何形态${geometry.type}暗示了解决方案的形态。`
  ]
  
  const summary = summaries[Math.floor(rng.next() * summaries.length)]
  
  return {
    summary,
    keyThemes,
    potentialOutcomes,
    warningSigns,
    guidance
  }
}

export const generateTimeCapsuleSeal = (
  coreNumbers: CoreNumbers,
  targetDate: string,
  createdAt: number
): TimeCapsuleSeal => {
  const seed = `seal-${coreNumbers.lifePath}-${coreNumbers.destiny}-${targetDate}-${createdAt}`
  const rng = new DeterministicRandom(seed)
  
  const sealIndex = Math.floor(rng.next() * sealTexts.length)
  const symbolIndex = Math.floor(rng.next() * sealSymbols.length)
  
  const hintParts = [
    `生命路径 ${coreNumbers.lifePath}`,
    `命运 ${coreNumbers.destiny}`,
    `灵魂 ${coreNumbers.soul}`,
    `个性 ${coreNumbers.personality}`,
    `约定日期 ${targetDate}`
  ]
  
  const encryptedHint = hintParts.join(' · ')
  
  return {
    sealText: sealTexts[sealIndex],
    sealSymbol: sealSymbols[symbolIndex],
    encryptedHint
  }
}

export const performTimeCapsuleDivination = (input: TimeCapsuleInput): TimeCapsuleResult => {
  const { name, birthDate, question, targetDate, selectedRunes, starConnection, timestamp } = input
  
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
    question
  )
  
  const prediction = generateTimeCapsulePrediction(
    coreNumbers,
    geometry,
    starMap,
    question,
    targetDate,
    timestamp
  )
  
  const seal = generateTimeCapsuleSeal(
    coreNumbers,
    targetDate,
    timestamp
  )
  
  const calculationTrace = [
    ...numerologySteps,
    ...matrixSteps,
    ...astronomySteps,
    ...geometrySteps
  ]
  
  const unlockAt = new Date(targetDate).getTime()
  
  return {
    id: generateId(),
    type: 'time-capsule',
    input,
    coreNumbers,
    matrix: transformedMatrix,
    starMap,
    geometry,
    prediction,
    seal,
    calculationTrace,
    createdAt: timestamp,
    unlockAt,
    isUnlocked: false
  }
}
