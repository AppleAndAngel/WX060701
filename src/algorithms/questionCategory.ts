import type { QuestionCategory, QuestionCategoryOption } from '@/types'

export const questionCategories: QuestionCategoryOption[] = [
  {
    key: 'love',
    label: '感情',
    icon: '♥',
    color: '#e91e63',
    description: '探索感情关系、桃花运、情感发展'
  },
  {
    key: 'career',
    label: '事业',
    icon: '⚔',
    color: '#2196f3',
    description: '洞察事业发展、工作机会、职业方向'
  },
  {
    key: 'wealth',
    label: '财富',
    icon: '◈',
    color: '#ffc107',
    description: '揭示财运走势、投资机遇、物质收获'
  },
  {
    key: 'self-growth',
    label: '自我成长',
    icon: '✧',
    color: '#9c27b0',
    description: '启迪内心智慧、个人提升、灵性觉醒'
  }
]

interface CategoryLanguage {
  moodPrompt: string
  intentionPlaceholder: string
  intentionHint: string
  runePrompt: string
  calculatingText: string
  energyTitle: string
  keywordsTitle: string
  runeTitle: string
  interpretationTitle: string
  guidanceTitle: string
  weekEnergyTitle: string
}

const categoryLanguages: Record<QuestionCategory, CategoryLanguage> = {
  'love': {
    moodPrompt: '此刻的情感状态',
    intentionPlaceholder: '今天我在感情中希望...',
    intentionHint: '可以是关于脱单、关系升温、化解矛盾或内心的情感期待。即使留白，宇宙也会接收到你当下的情感能量。',
    runePrompt: '选择与你情感共鸣的符文',
    calculatingText: '正在连接爱的能量场...',
    energyTitle: '情感能量指数',
    keywordsTitle: '情感关键词',
    runeTitle: '情感符文启示',
    interpretationTitle: '情感运势解读',
    guidanceTitle: '✧ 情感指引',
    weekEnergyTitle: '本周情感能量轨迹'
  },
  'career': {
    moodPrompt: '此刻的工作状态',
    intentionPlaceholder: '今天我在事业上希望...',
    intentionHint: '可以是关于项目推进、职场关系、机会把握或职业发展方向。即使留白，宇宙也会接收到你当下的事业能量。',
    runePrompt: '选择与你事业共鸣的符文',
    calculatingText: '正在连接事业能量场...',
    energyTitle: '事业能量指数',
    keywordsTitle: '事业关键词',
    runeTitle: '事业符文启示',
    interpretationTitle: '事业运势解读',
    guidanceTitle: '✧ 事业指引',
    weekEnergyTitle: '本周事业能量轨迹'
  },
  'wealth': {
    moodPrompt: '此刻的财富心态',
    intentionPlaceholder: '今天我在财富上希望...',
    intentionHint: '可以是关于收入增长、投资决策、机会把握或金钱观念的转变。即使留白，宇宙也会接收到你当下的财富能量。',
    runePrompt: '选择与你财富共鸣的符文',
    calculatingText: '正在连接财富能量场...',
    energyTitle: '财富能量指数',
    keywordsTitle: '财富关键词',
    runeTitle: '财富符文启示',
    interpretationTitle: '财富运势解读',
    guidanceTitle: '✧ 财富指引',
    weekEnergyTitle: '本周财富能量轨迹'
  },
  'self-growth': {
    moodPrompt: '此刻的心灵状态',
    intentionPlaceholder: '今天我在成长中希望...',
    intentionHint: '可以是关于习惯养成、技能提升、心灵觉醒或自我认知的深化。即使留白，宇宙也会接收到你当下的成长能量。',
    runePrompt: '选择与你成长共鸣的符文',
    calculatingText: '正在连接成长能量场...',
    energyTitle: '成长能量指数',
    keywordsTitle: '成长关键词',
    runeTitle: '成长符文启示',
    interpretationTitle: '成长运势解读',
    guidanceTitle: '✧ 成长指引',
    weekEnergyTitle: '本周成长能量轨迹'
  }
}

interface CategoryInterpretation {
  numberMeanings: Record<number, string>
  energyDescriptions: Record<string, string>
  guidanceThemes: string[]
  titlePrefix: string
}

const categoryInterpretations: Record<QuestionCategory, CategoryInterpretation> = {
  'love': {
    numberMeanings: {
      1: '今日在感情中你散发着独特的个人魅力，适合主动出击表达心意。',
      2: '今日感情讲究配合与平衡，倾听对方的心声将带来甜蜜的共鸣。',
      3: '今日情感表达顺畅，你的幽默与温暖将打动对方的心。',
      4: '今日适合为感情奠定稳固基础，共同规划未来会增进信任感。',
      5: '今日感情可能迎来新的变化或惊喜，保持开放的心态迎接缘分。',
      6: '今日充满爱的能量，适合表达关心、维系关系，单身者桃花旺盛。',
      7: '今日适合内省情感需求，独处能帮助你看清自己真正想要什么。',
      8: '今日感情运势高涨，你的个人魅力和影响力将达到高峰。',
      9: '今日是情感周期的完成日，放下过去才能迎接新的爱情可能。',
      11: '今日直觉敏锐，相信内心对感情的指引，灵感将照亮爱的道路。',
      22: '今日是构建稳定关系的大师日，你对感情的愿景有能力成为现实。',
      33: '今日是大爱之日，你的温暖与包容将深深影响你爱的人。'
    },
    energyDescriptions: {
      high: '今天你的情感能量充沛，是表达爱意、推进关系的好日子。',
      medium: '今天你的情感能量平稳，适合深度交流和稳步发展感情。',
      low: '今天你的情感能量较低，适合自我关怀、内省情感需求。'
    },
    guidanceThemes: [
      '建议你今天勇敢表达真实的感受，让对方知道你的心意。',
      '深呼吸，感受心轮的能量，让爱从内心自然流淌。',
      '记住，每一次真诚的沟通都是拉近彼此距离的机会。',
      '保持正念，观察生活中与爱相关的同步性，它们可能是宇宙的指引。',
      '善待自己和他人，今日的情感能量将支持你的关系成长。'
    ],
    titlePrefix: '情缘'
  },
  'career': {
    numberMeanings: {
      1: '今日在事业上你拥有独立开创的能量，适合主动领导新项目。',
      2: '今日事业讲究团队协作，善于沟通和协调将带来事半功倍的效果。',
      3: '今日创造力旺盛，用创新思维解决工作难题将获得认可。',
      4: '今日适合稳扎稳打，脚踏实地的努力将为事业奠定坚实基础。',
      5: '今日事业可能迎来变化或新机会，勇于尝试将开拓新局面。',
      6: '今日职场人际关系和谐，发挥关怀之心能赢得同事的信任与支持。',
      7: '今日适合深度思考工作方向，内省将带来对职业发展的新洞察。',
      8: '今日事业能量强盛，你的执行力和影响力将帮助你达成目标。',
      9: '今日是工作周期的完成日，收尾旧项目才能开启新的职业篇章。',
      11: '今日职场直觉敏锐，相信内心对工作选择的指引，灵感将带来突破。',
      22: '今日是构建事业格局的大师日，你的职业愿景有能力化为现实。',
      33: '今日是事业奉献日，用你的能力帮助他人将带来深远的职业影响力。'
    },
    energyDescriptions: {
      high: '今天你的事业能量充沛，是推动项目、展现能力的好日子。',
      medium: '今天你的事业能量平稳，适合稳步推进工作和深化技能。',
      low: '今天你的事业能量较低，适合规划、复盘和调整工作节奏。'
    },
    guidanceThemes: [
      '建议你今天专注于核心目标，让这份专注引领你的职业行动。',
      '深呼吸，感受内在的力量，让智慧引导你的每一个工作决策。',
      '记住，每一个小进步都是通向职业成功的基石。',
      '保持正念，观察工作中的同步性，它们可能是事业发展的信号。',
      '保持专注和耐心，今日的事业能量将支持你的职业成长。'
    ],
    titlePrefix: '业途'
  },
  'wealth': {
    numberMeanings: {
      1: '今日财运上你有独立开创的能量，适合主动寻找新的收入来源。',
      2: '今日财运讲究合作共赢，与他人分享资源将带来更多财富机会。',
      3: '今日财思活跃，创新的理财思路将为你开辟新的财富通道。',
      4: '今日适合稳健理财，脚踏实地的储蓄和投资将带来稳定回报。',
      5: '今日财运可能有新的变化，保持灵活将抓住意外的财富机遇。',
      6: '今日财富能量和谐，平衡收支和关爱他人都会带来丰盛的回流。',
      7: '今日适合深度思考财富观念，内省将帮助你看清真正的价值所在。',
      8: '今日财运旺盛，你的财务决策和行动将带来显著的物质回报。',
      9: '今日是财富周期的完成日，清算旧账才能迎接新的财富流入。',
      11: '今日财务直觉敏锐，相信内心对投资的指引，灵感将带来财富突破。',
      22: '今日是构建财富格局的大师日，你的财富愿景有能力化为现实。',
      33: '今日是财富布施日，慷慨分享将为你开启更大的丰盛之门。'
    },
    energyDescriptions: {
      high: '今天你的财富能量充沛，是采取财务行动、把握投资机会的好日子。',
      medium: '今天你的财富能量平稳，适合稳健理财和规划财务目标。',
      low: '今天你的财富能量较低，适合守财、复盘和调整消费观念。'
    },
    guidanceThemes: [
      '建议你今天专注于财富增值，让这份专注引导你的每一个财务决策。',
      '深呼吸，感受丰盛的能量在你体内流动，相信宇宙的富足。',
      '记住，财富是流动的能量，给予和接收同样重要。',
      '保持正念，观察生活中的财富信号，它们可能是机会来临的预兆。',
      '保持感恩的心态，今日的财富能量将支持你的物质丰盛。'
    ],
    titlePrefix: '财脉'
  },
  'self-growth': {
    numberMeanings: {
      1: '今日你有独立探索的能量，适合开启新的学习或自我提升计划。',
      2: '今日成长讲究内外平衡，倾听内心声音与外部反馈将获得全面提升。',
      3: '今日创造力勃发，尝试新的表达方式将帮助你认识全新的自己。',
      4: '今日适合建立成长习惯，规律的练习将为你的提升奠定稳固基础。',
      5: '今日成长可能迎来突破，勇于走出舒适区将带来质的飞跃。',
      6: '今日在关爱他人的过程中获得自我成长，付出就是最好的学习。',
      7: '今日适合深度内省，与自己对话将带来对生命的深刻洞察。',
      8: '今日个人能量强盛，你有力量克服成长路上的任何障碍。',
      9: '今日是成长周期的完成日，整合所学才能进入更高的意识层次。',
      11: '今日灵性直觉开启，相信更高自我的指引，灵感将照亮成长之路。',
      22: '今日是构建人生愿景的大师日，你对自我的期许有能力成为现实。',
      33: '今日是觉醒之日，你的领悟和行动将为他人带来成长的光。'
    },
    energyDescriptions: {
      high: '今天你的成长能量充沛，是学习新技能、突破自我的好日子。',
      medium: '今天你的成长能量平稳，适合稳步推进和深度思考。',
      low: '今天你的成长能量较低，适合休息、冥想和整合已学。'
    },
    guidanceThemes: [
      '建议你今天专注于内在成长，让这份觉知引导你的每一个选择。',
      '深呼吸，感受顶轮的能量，让智慧从更高维度流入你的意识。',
      '记住，每一次向内探索都是认识自己的珍贵机会。',
      '保持正念，观察生活中的同步性，它们可能是成长的指引。',
      '善待自己，今日的宇宙能量将全力支持你的灵性成长。'
    ],
    titlePrefix: '心程'
  }
}

export const getCategoryLanguage = (category: QuestionCategory | null): CategoryLanguage => {
  if (!category) {
    return {
      moodPrompt: '此刻的心情',
      intentionPlaceholder: '今天我希望...',
      intentionHint: '意图可以是具体的目标，也可以是一种状态，如「保持平静」、「充满创造力」或「与他人建立连接」。即使留白，宇宙也会接收到你当下的能量状态。',
      runePrompt: '选择今日符文',
      calculatingText: '正在连接宇宙能量...',
      energyTitle: '能量指数',
      keywordsTitle: '今日关键词',
      runeTitle: '符文启示',
      interpretationTitle: '今日解读',
      guidanceTitle: '✧ 今日指引',
      weekEnergyTitle: '本周能量轨迹'
    }
  }
  return categoryLanguages[category]
}

export const getCategoryInterpretation = (category: QuestionCategory | null): CategoryInterpretation => {
  if (!category) {
    return {
      numberMeanings: {
        1: '今日是独立与开创的日子，你拥有独特的领导力和创新能量。',
        2: '今日是合作与平衡的日子，敏感和同理心是你最强大的工具。',
        3: '今日是创造与表达的日子，你的思维活跃，灵感如泉涌。',
        4: '今日是稳定与建设的日子，脚踏实地的努力将带来丰厚回报。',
        5: '今日是自由与变化的日子，新的机会和冒险正在等待你。',
        6: '今日是关爱与责任的日子，家庭和人际关系将成为焦点。',
        7: '今日是内省与智慧的日子，深度思考将带来深刻洞察。',
        8: '今日是力量与富足的日子，你的个人影响力将达到高峰。',
        9: '今日是完成与博爱之日，旧的循环结束，新的可能即将开启。',
        11: '今日是直觉与启示的日子，相信你的内在指引，灵感将照亮前路。',
        22: '今日是构建与显化的大师日，你的愿景有能力成为现实。',
        33: '今日是大爱与奉献的日子，你的行动将影响许多人。'
      },
      energyDescriptions: {
        high: '今天你的能量充沛，是采取行动的好日子。',
        medium: '今天你的能量平稳，适合深思熟虑和稳步推进。',
        low: '今天你的能量较低，适合休息、内省和自我照顾。'
      },
      guidanceThemes: [
        '建议你今天专注于当下，让这份能量引导你的行动。',
        '深呼吸，感受宇宙能量在你体内流动。',
        '记住，每一个清晨都是重新开始的机会，今天的选择将塑造你的未来。',
        '保持正念，观察生活中的同步性，它们可能是宇宙给你的讯息。',
        '善待自己，今日的宇宙能量将支持你的成长。'
      ],
      titlePrefix: '日签'
    }
  }
  return categoryInterpretations[category]
}

export const getCategoryTitle = (
  category: QuestionCategory | null,
  symbolThemeName: string,
  dailyNumber: number
): string => {
  const interpretation = getCategoryInterpretation(category)
  return `${interpretation.titlePrefix}·${symbolThemeName} · ${dailyNumber}`
}
