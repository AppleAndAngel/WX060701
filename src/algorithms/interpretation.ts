import type { CoreNumbers, GeometryData, Interpretation, StarMap } from '@/types'

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

const geometryMeanings: Record<string, { name: string; symbolism: string }> = {
  triangle: { name: '三角圣坛', symbolism: '三位一体，天人合一，稳定与超越' },
  square: { name: '四方结界', symbolism: '物质稳固，基础扎实，落地生根' },
  pentagon: { name: '五芒星阵', symbolism: '人类潜能，灵性守护，生命绽放' },
  hexagon: { name: '六芒合一', symbolism: '和谐完美，阴阳平衡，神圣几何' },
  heptagon: { name: '七星奥秘', symbolism: '神秘追寻，灵性指引，周期韵律' },
  octagon: { name: '八方向导', symbolism: '再生重生，无限可能，方向明晰' },
  star: { name: '星光圣殿', symbolism: '希望指引，灵性之光，目标达成' },
  dodecagon: { name: '十二宫轮', symbolism: '完整周期，宇宙秩序，全景视野' },
  enneagram: { name: '九型迷宫', symbolism: '人格地图，成长路径，深层洞察' }
}

const openingTemplates = [
  '在{timestamp}的星尘中，你的生命密码正在缓缓展开...',
  '当宇宙的脉搏与你的心跳共振，算法之眼已然洞见...',
  '在数字与符号的交汇处，你的命运方程式呈现出独特的形态...',
  '此刻，时间与空间在算法的棱镜中折射出专属于你的光芒...',
  '从虚空中诞生的矩阵，正在编织着你当下的能量图景...'
]

const closingTemplates = [
  '记住：算法揭示的是可能性，而非定局。每一个选择都是新的变量。',
  '数字是宇宙的语言，而你，是书写自己故事的诗人。',
  '确定性是骨架，神秘性是灵魂。在二者之间，你自由舞蹈。',
  '这是算法的解读，也是宇宙的低语。最终的诠释权，永远在你手中。',
  '矩阵运算已经完成，但你的人生方程式，仍在等待你去求解。'
]

export const generateInterpretation = (
  coreNumbers: CoreNumbers,
  geometry: GeometryData,
  starMap: StarMap,
  query: string,
  timestamp: number
): Interpretation => {
  const lifePathMeaning = numberMeanings[coreNumbers.lifePath] || numberMeanings[9]
  const destinyMeaning = numberMeanings[coreNumbers.destiny] || numberMeanings[9]
  const soulMeaning = numberMeanings[coreNumbers.soul] || numberMeanings[9]
  const personalityMeaning = numberMeanings[coreNumbers.personality] || numberMeanings[9]
  const geometryMeaning = geometryMeanings[geometry.type] || geometryMeanings.hexagon
  
  const coreSum = coreNumbers.lifePath + coreNumbers.destiny + coreNumbers.soul + coreNumbers.personality
  const titleIndex = coreSum % 5
  
  const titles = [
    `${lifePathMeaning.title} · ${geometryMeaning.name}`,
    `算法启示录 · ${destinyMeaning.title}之境`,
    `矩阵解码 · ${soulMeaning.title}的回响`,
    `星图卦象 · ${geometryMeaning.name}的预言`,
    `数字神谕 · ${personalityMeaning.title}的显化`
  ]
  
  const opening = openingTemplates[titleIndex].replace(
    '{timestamp}',
    new Date(timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  )
  
  const paragraphs: string[] = []
  
  paragraphs.push(opening)
  
  paragraphs.push(
    `你的生命路径数为 ${coreNumbers.lifePath}——${lifePathMeaning.essence}。` +
    `这意味着你此生的旅程将围绕着${lifePathMeaning.traits.slice(0, 2).join('与')}展开。` +
    `在算法的视野中，这是你存在的核心频率，是所有可能性展开的起点。`
  )
  
  paragraphs.push(
    `你的命运数为 ${coreNumbers.destiny}，昭示着${destinyMeaning.essence}。` +
    `这是你在世间所要达成的目标，是灵魂选择的成长方向。` +
    `你的${destinyMeaning.traits.slice(0, 3).join('、')}将在这条道路上不断被淬炼与升华。`
  )
  
  paragraphs.push(
    `在灵魂深处，${coreNumbers.soul} 这个数字低语着${soulMeaning.essence}。` +
    `你的灵魂渴望着${soulMeaning.traits.join('、')}，这是你最真实的内在动力，` +
    `是所有选择背后隐秘的指引。当你感到迷茫时，回归这个数字的本质，便能找到方向。`
  )
  
  paragraphs.push(
    `而展现于外的个性数字 ${coreNumbers.personality}，` +
    `为你披上了${personalityMeaning.traits.join('、')}的外衣。` +
    `这是你与世界互动的方式，是他人眼中的你。` +
    `当内在与外在达成和谐，你便展现出最完整的自己。`
  )
  
  paragraphs.push(
    `你的命盘呈现为${geometryMeaning.name}——${geometryMeaning.symbolism}。` +
    `在这个图形中，${geometry.vertices.length}个顶点以黄金分割的比例排布，` +
    `构成了专属于你的能量图腾。每一条边都承载着信息，每一个交点都蕴含着可能性。`
  )
  
  const connectionCount = starMap.connections.length
  const starlight = connectionCount > 10 
    ? '星光璀璨，众多连接显示你正处于一个关系网络发达的阶段'
    : connectionCount > 5
      ? '星光朗照，关键的连接正在为你指引方向'
      : '星光虽稀，但每一颗都至关重要，专注于少数而深刻的连接'
  
  paragraphs.push(
    `在星图层面，${starlight}。` +
    `${starMap.positions.length}颗星体以特定的角度排列，构成了你当下的能量矩阵。` +
    `每一条连线都代表一种引力，每一个光点都是一个潜在的机遇。`
  )
  
  if (query && query.trim()) {
    const queryHash = query.length % 4
    const queryResponses = [
      `关于"${query}"，算法显示：答案不在远方，而在你整合这些数字能量的过程中。`,
      `你所询问的"${query}"，其答案隐藏在 ${coreNumbers.soul} 与 ${coreNumbers.destiny} 的共振之中。`,
      `对于"${query}"，算法建议：以 ${coreNumbers.lifePath} 的本质为根基，以 ${coreNumbers.personality} 的方式行动。`,
      `"${query}"这个问题本身就是答案的一部分。它揭示了你当下能量聚焦的方向。`
    ]
    paragraphs.push(queryResponses[queryHash])
  }
  
  paragraphs.push(closingTemplates[coreSum % closingTemplates.length])
  
  const keywords = [
    ...lifePathMeaning.traits.slice(0, 2),
    ...destinyMeaning.traits.slice(0, 1),
    ...soulMeaning.traits.slice(0, 1),
    geometryMeaning.name
  ]
  
  const interpretation: Interpretation = {
    title: titles[titleIndex],
    paragraphs,
    keywords
  }
  
  if ([11, 22, 33].includes(coreNumbers.lifePath) || 
      [11, 22, 33].includes(coreNumbers.destiny) ||
      [11, 22, 33].includes(coreNumbers.soul) ||
      [11, 22, 33].includes(coreNumbers.personality)) {
    interpretation.warning = '注意：你的数字命盘中包含主数字 (11, 22, 33)，这意味着特殊的灵性潜能和人生挑战。这些数字不被约简，因为它们携带着强烈的能量振动。'
  }
  
  return interpretation
}
