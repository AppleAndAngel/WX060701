<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import gsap from 'gsap'
import type { GeometryData } from '@/types'

interface Props {
  geometry: GeometryData
  coreNumbers: { lifePath: number; destiny: number; soul: number; personality: number }
}

const props = defineProps<Props>()
const svgRef = ref<SVGSVGElement | null>(null)
const isAnimating = ref(false)

const pathData = computed(() => {
  if (!props.geometry?.vertices?.length) return ''
  const vertices = props.geometry.vertices
  return vertices.map((v, i) => 
    `${i === 0 ? 'M' : 'L'} ${v.x} ${v.y}`
  ).join(' ') + ' Z'
})

const internalLines = computed(() => {
  if (!props.geometry?.vertices?.length) return []
  const vertices = props.geometry.vertices
  const center = props.geometry.center
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
  
  vertices.forEach((v, i) => {
    lines.push({ x1: center.x, y1: center.y, x2: v.x, y2: v.y })
    const nextIdx = (i + Math.floor(vertices.length / 2)) % vertices.length
    if (i < nextIdx) {
      lines.push({ x1: v.x, y1: v.y, x2: vertices[nextIdx].x, y2: vertices[nextIdx].y })
    }
  })
  
  return lines
})

const numberLabels = computed(() => {
  const nums = [
    { value: props.coreNumbers.lifePath, label: '生命' },
    { value: props.coreNumbers.destiny, label: '命运' },
    { value: props.coreNumbers.soul, label: '灵魂' },
    { value: props.coreNumbers.personality, label: '个性' }
  ]
  
  const center = props.geometry.center
  const radius = 60
  
  return nums.map((num, i) => {
    const angle = (i / nums.length) * Math.PI * 2 - Math.PI / 2
    return {
      ...num,
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    }
  })
})

const animateIn = () => {
  if (!svgRef.value || isAnimating.value) return
  isAnimating.value = true
  
  const paths = svgRef.value.querySelectorAll('path, line')
  gsap.set(paths, { strokeDashoffset: (i, el: SVGGeometryElement) => el.getTotalLength?.() || 200 })
  gsap.set(paths, { strokeDasharray: (i, el: SVGGeometryElement) => el.getTotalLength?.() || 200 })
  
  gsap.to(paths, {
    strokeDashoffset: 0,
    duration: 2,
    stagger: 0.1,
    ease: 'power2.out',
    onComplete: () => { isAnimating.value = false }
  })
  
  const circles = svgRef.value.querySelectorAll('circle')
  gsap.fromTo(circles, { scale: 0, transformOrigin: 'center' }, {
    scale: 1,
    duration: 0.6,
    stagger: 0.1,
    delay: 0.5,
    ease: 'back.out(1.7)'
  })
  
  const texts = svgRef.value.querySelectorAll('text')
  gsap.fromTo(texts, { opacity: 0, y: 10 }, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1,
    delay: 1
  })
}

onMounted(() => {
  setTimeout(animateIn, 300)
})

watch(() => props.geometry, () => {
  setTimeout(animateIn, 100)
})
</script>

<template>
  <div class="relative">
    <svg
      ref="svgRef"
      viewBox="0 0 400 400"
      class="w-full max-w-md mx-auto"
    >
      <defs>
        <filter id="chartGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#d4af37;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#d4af37;stop-opacity:0" />
        </radialGradient>
      </defs>
      
      <circle
        :cx="geometry.center.x"
        :cy="geometry.center.y"
        r="100"
        fill="url(#centerGlow)"
        class="animate-pulse-slow"
      />
      
      <circle
        v-for="(line, idx) in internalLines"
        :key="'dot-' + idx"
        :cx="geometry.vertices[idx % geometry.vertices.length]?.x"
        :cy="geometry.vertices[idx % geometry.vertices.length]?.y"
        r="6"
        fill="#d4af37"
        filter="url(#chartGlow)"
      />
      
      <line
        v-for="(line, idx) in internalLines"
        :key="'line-' + idx"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        stroke="rgba(212, 175, 55, 0.3)"
        stroke-width="1"
      />
      
      <path
        :d="pathData"
        fill="none"
        stroke="#d4af37"
        stroke-width="2"
        filter="url(#chartGlow)"
      />
      
      <g v-for="(num, idx) in numberLabels" :key="'num-' + idx">
        <circle
          :cx="num.x"
          :cy="num.y"
          r="22"
          fill="rgba(10, 10, 26, 0.8)"
          stroke="#d4af37"
          stroke-width="1"
        />
        <text
          :x="num.x"
          :y="num.y - 2"
          text-anchor="middle"
          class="text-lg font-bold fill-gold font-display"
        >
          {{ num.value }}
        </text>
        <text
          :x="num.x"
          :y="num.y + 12"
          text-anchor="middle"
          class="text-[10px] fill-silver/60 font-display tracking-wider"
        >
          {{ num.label }}
        </text>
      </g>
      
      <circle
        :cx="geometry.center.x"
        :cy="geometry.center.y"
        r="4"
        fill="#d4af37"
        filter="url(#chartGlow)"
      />
    </svg>
  </div>
</template>
