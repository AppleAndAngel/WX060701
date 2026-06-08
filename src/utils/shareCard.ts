import type { CoreNumbers, DivinationResult, SynastryResult } from '@/types'

export interface ShareCardData {
  cardTitle: string
  chartName: string
  coreNumbers: CoreNumbers
  summary: string
  keywords: string[]
  secondaryInfo?: {
    label: string
    value: string | number
  }
  type: 'divination' | 'synastry'
}

const geometryNames: Record<string, string> = {
  triangle: '三角圣坛',
  square: '四方结界',
  pentagon: '五芒星阵',
  hexagon: '六芒合一',
  heptagon: '七星奥秘',
  octagon: '八方向导',
  star: '星光圣殿',
  dodecagon: '十二宫轮',
  enneagram: '九型迷宫'
}

export function generateDivinationShareCard(result: DivinationResult): ShareCardData {
  const { coreNumbers, geometry, interpretation } = result

  const chartName = geometryNames[geometry.type] || geometry.type
  
  const lifePath = coreNumbers.lifePath
  const destiny = coreNumbers.destiny
  const soul = coreNumbers.soul
  const personality = coreNumbers.personality
  
  const dominantNumber = [lifePath, destiny, soul, personality].reduce((a, b) => 
    (a === 11 || a === 22 || a === 33) ? a : 
    (b === 11 || b === 22 || b === 33) ? b : 
    Math.max(a, b)
  )
  
  const summaryTemplates = [
    `生命路径 ${lifePath} · 命运 ${destiny} · 灵魂 ${soul} · 个性 ${personality}。在${chartName}的指引下，你的能量场呈现出独特的共振频率。`,
    `核心数字 ${lifePath}/${destiny}/${soul}/${personality} 构成你的命盘基础。${interpretation.title} 揭示了你当下的能量状态。`,
    `数字 ${lifePath} 引领你的生命旅程，${destiny} 昭示命运方向，${soul} 低语灵魂渴望，${personality} 展现外在光华。`
  ]
  
  const seed = (lifePath + destiny + soul + personality) % summaryTemplates.length
  
  return {
    cardTitle: interpretation.title,
    chartName,
    coreNumbers,
    summary: summaryTemplates[seed],
    keywords: interpretation.keywords,
    type: 'divination'
  }
}

export function generateSynastryShareCard(result: SynastryResult): ShareCardData {
  const { personANumbers, personBNumbers, geometry, interpretation } = result
  
  const chartName = geometryNames[geometry.type] || geometry.type
  
  const coreNumbers: CoreNumbers = {
    lifePath: personANumbers.lifePath,
    destiny: personBNumbers.destiny,
    soul: personANumbers.soul,
    personality: personBNumbers.personality
  }
  
  const score = interpretation.overallScore
  const scoreLevel = score >= 90 ? '天作之合' : score >= 80 ? '高度契合' : score >= 70 ? '良好匹配' : score >= 60 ? '需要磨合' : '差异显著'
  
  const summary = `${result.input.personA.name} × ${result.input.personB.name} · ${result.input.relationshipType} · 匹配度 ${score}分。${scoreLevel}，${interpretation.overallDescription.slice(0, 60)}...`
  
  return {
    cardTitle: interpretation.title,
    chartName,
    coreNumbers,
    summary,
    keywords: interpretation.keywords,
    secondaryInfo: {
      label: '匹配度',
      value: `${score}分`
    },
    type: 'synastry'
  }
}

export function generateCardImage(cardData: ShareCardData, canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('无法获取 canvas 上下文'))
        return
      }

      const width = 750
      const height = 1200
      canvas.width = width
      canvas.height = height

      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#050510')
      gradient.addColorStop(0.5, '#1a0a2e')
      gradient.addColorStop(1, '#0a0a1a')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = 'rgba(212, 175, 55, 0.03)'
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const r = Math.random() * 3 + 1
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      const goldGradient = ctx.createLinearGradient(0, 100, 0, height - 100)
      goldGradient.addColorStop(0, 'rgba(212, 175, 55, 0.3)')
      goldGradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.1)')
      goldGradient.addColorStop(1, 'rgba(212, 175, 55, 0.3)')
      ctx.strokeStyle = goldGradient
      ctx.lineWidth = 2
      ctx.strokeRect(40, 40, width - 80, height - 80)

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)'
      ctx.lineWidth = 1
      ctx.strokeRect(55, 55, width - 110, height - 110)

      ctx.fillStyle = '#d4af37'
      ctx.font = 'bold 48px Cinzel, serif'
      ctx.textAlign = 'center'
      ctx.fillText('✧', width / 2, 140)

      ctx.fillStyle = '#d4af37'
      ctx.font = 'bold 36px Cinzel, serif'
      ctx.textAlign = 'center'
      ctx.fillText(cardData.cardTitle, width / 2, 200)

      ctx.fillStyle = '#c0c0c0'
      ctx.font = '24px "Cormorant Garamond", serif'
      ctx.fillText(cardData.chartName, width / 2, 250)

      const numbersY = 340
      const numberBoxWidth = 130
      const numberBoxHeight = 150
      const startX = (width - numberBoxWidth * 4 - 30 * 3) / 2

      const numberLabels = ['生命路径', '命运', '灵魂', '个性']
      const numbers = [
        cardData.coreNumbers.lifePath,
        cardData.coreNumbers.destiny,
        cardData.coreNumbers.soul,
        cardData.coreNumbers.personality
      ]

      numbers.forEach((num, index) => {
        const x = startX + index * (numberBoxWidth + 30)
        const y = numbersY

        ctx.fillStyle = 'rgba(212, 175, 55, 0.1)'
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)'
        ctx.lineWidth = 2
        roundRect(ctx, x, y, numberBoxWidth, numberBoxHeight, 12)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#d4af37'
        ctx.font = 'bold 72px Cinzel, serif'
        ctx.textAlign = 'center'
        ctx.fillText(String(num), x + numberBoxWidth / 2, y + 90)

        ctx.fillStyle = '#c0c0c0'
        ctx.font = '18px "Cormorant Garamond", serif'
        ctx.fillText(numberLabels[index], x + numberBoxWidth / 2, y + 130)
      })

      if (cardData.secondaryInfo) {
        const infoY = numbersY + numberBoxHeight + 60
        ctx.fillStyle = 'rgba(147, 112, 219, 0.1)'
        ctx.strokeStyle = 'rgba(147, 112, 219, 0.3)'
        ctx.lineWidth = 2
        roundRect(ctx, width / 2 - 120, infoY, 240, 80, 12)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#9370db'
        ctx.font = 'bold 48px Cinzel, serif'
        ctx.textAlign = 'center'
        ctx.fillText(String(cardData.secondaryInfo.value), width / 2, infoY + 55)

        ctx.fillStyle = '#c0c0c0'
        ctx.font = '16px "Cormorant Garamond", serif'
        ctx.fillText(cardData.secondaryInfo.label, width / 2, infoY + 110)
      }

      const summaryY = cardData.secondaryInfo 
        ? numbersY + numberBoxHeight + 220 
        : numbersY + numberBoxHeight + 120

      ctx.fillStyle = 'rgba(192, 192, 192, 0.1)'
      ctx.strokeStyle = 'rgba(192, 192, 192, 0.2)'
      ctx.lineWidth = 1
      roundRect(ctx, 80, summaryY, width - 160, 180, 16)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#c0c0c0'
      ctx.font = '22px "Cormorant Garamond", serif'
      ctx.textAlign = 'left'
      wrapText(ctx, cardData.summary, 110, summaryY + 45, width - 220, 35)

      const keywordsY = summaryY + 220
      ctx.fillStyle = '#d4af37'
      ctx.font = '20px Cinzel, serif'
      ctx.textAlign = 'center'
      ctx.fillText('关键词', width / 2, keywordsY)

      const keywordStartY = keywordsY + 40
      const keywordPadding = 20
      let currentX = 80
      let currentY = keywordStartY

      cardData.keywords.forEach(keyword => {
        ctx.font = '18px "JetBrains Mono", monospace'
        const textWidth = ctx.measureText(keyword).width + 30
        
        if (currentX + textWidth > width - 80) {
          currentX = 80
          currentY += 45
        }

        ctx.fillStyle = 'rgba(212, 175, 55, 0.1)'
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)'
        roundRect(ctx, currentX, currentY, textWidth, 35, 18)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#d4af37'
        ctx.textAlign = 'center'
        ctx.fillText(keyword, currentX + textWidth / 2, currentY + 24)
        
        currentX += textWidth + 15
      })

      const footerY = height - 100
      ctx.fillStyle = 'rgba(192, 192, 192, 0.5)'
      ctx.font = '16px Cinzel, serif'
      ctx.textAlign = 'center'
      ctx.fillText('✧ 数字命理学 · 算法神谕 ✧', width / 2, footerY)

      const dataUrl = canvas.toDataURL('image/png')
      resolve(dataUrl)
    } catch (error) {
      reject(error)
    }
  })
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split('')
  let line = ''
  let lineY = y

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n]
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, lineY)
      line = words[n]
      lineY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, lineY)
}
