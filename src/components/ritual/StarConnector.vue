<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useDivinationStore } from '@/stores/divination'
import type { RitualStore } from '@/types'

interface Props {
  store?: RitualStore
}

const props = withDefaults(defineProps<Props>(), {
  store: undefined
})

const store = computed(() => props.store || useDivinationStore())
const svgRef = ref<SVGSVGElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
const startPoint = ref<number | null>(null)
const mousePos = ref({ x: 0, y: 0 })
const svgSize = ref({ width: 600, height: 600 })

const getSVGPoint = (e: MouseEvent | TouchEvent) => {
  if (!svgRef.value) return null
  const svg = svgRef.value
  const rect = svg.getBoundingClientRect()
  let clientX: number, clientY: number
  
  if ('touches' in e) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else {
    clientX = e.clientX
    clientY = e.clientY
  }
  
  return {
    x: ((clientX - rect.left) / rect.width) * svgSize.value.width,
    y: ((clientY - rect.top) / rect.height) * svgSize.value.height
  }
}

const findNearestPoint = (x: number, y: number): number | null => {
  let nearestId: number | null = null
  let minDist = Infinity
  
  store.value.starPoints.forEach(point => {
    const dist = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2))
    if (dist < 40 && dist < minDist) {
      minDist = dist
      nearestId = point.id
    }
  })
  
  return nearestId
}

const handleStart = (e: MouseEvent | TouchEvent) => {
  const point = getSVGPoint(e)
  if (!point) return
  
  const nearestId = findNearestPoint(point.x, point.y)
  if (nearestId !== null) {
    isDragging.value = true
    startPoint.value = nearestId
    mousePos.value = point
  }
}

const handleMove = (e: MouseEvent | TouchEvent) => {
  const point = getSVGPoint(e)
  if (point) {
    mousePos.value = point
  }
}

const handleEnd = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || startPoint.value === null) {
    isDragging.value = false
    startPoint.value = null
    return
  }
  
  const point = getSVGPoint(e)
  if (point) {
    const nearestId = findNearestPoint(point.x, point.y)
    if (nearestId !== null && nearestId !== startPoint.value) {
      store.value.addStarConnection(startPoint.value, nearestId)
    }
  }
  
  isDragging.value = false
  startPoint.value = null
}

const handleUndo = () => {
  store.value.removeLastStarConnection()
}

const updateSize = () => {
  if (containerRef.value) {
    const size = Math.min(containerRef.value.clientWidth - 40, 600)
    svgSize.value = { width: size, height: size }
  }
}

onMounted(() => {
  updateSize()
  store.value.initStarPoints(svgSize.value.width, svgSize.value.height)
  window.addEventListener('resize', updateSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSize)
})

watch(() => store.value.phase, (phase) => {
  if (phase === 'stars') {
    setTimeout(() => {
      updateSize()
      store.value.initStarPoints(svgSize.value.width, svgSize.value.height)
    }, 100)
  }
})
</script>

<template>
  <div class="w-full max-w-4xl mx-auto">
    <div class="text-center mb-6">
      <h3 class="font-display text-2xl text-gold mb-3 tracking-wider">连接星轨</h3>
      <p class="font-body text-silver/70">
        拖动鼠标连接 <span class="text-gold">至少 2</span> 对星体，绘制你的能量轨迹
        <span class="ml-2 text-gold">{{ store.starConnections.length }} 条连线</span>
      </p>
    </div>
    
    <div ref="containerRef" class="flex justify-center">
      <div class="relative">
        <div
          class="absolute inset-0 rounded-full animate-breathing pointer-events-none"
          style="background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)"
        />
        
        <svg
          ref="svgRef"
          :width="svgSize.width"
          :height="svgSize.height"
          class="cursor-crosshair touch-none"
          @mousedown="handleStart"
          @mousemove="handleMove"
          @mouseup="handleEnd"
          @mouseleave="handleEnd"
          @touchstart="handleStart"
          @touchmove="handleMove"
          @touchend="handleEnd"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#d4af37;stop-opacity:0.3" />
              <stop offset="50%" style="stop-color:#d4af37;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#d4af37;stop-opacity:0.3" />
            </linearGradient>
          </defs>
          
          <circle
            :cx="svgSize.width / 2"
            :cy="svgSize.height / 2"
            :r="Math.min(svgSize.width, svgSize.height) * 0.35"
            fill="none"
            stroke="rgba(212, 175, 55, 0.1)"
            stroke-width="1"
            stroke-dasharray="5,5"
          />
          
          <line
            v-for="(conn, index) in store.starConnections"
            :key="'line-' + index"
            :x1="store.starPoints.find(p => p.id === conn[0])?.x || 0"
            :y1="store.starPoints.find(p => p.id === conn[0])?.y || 0"
            :x2="store.starPoints.find(p => p.id === conn[1])?.x || 0"
            :y2="store.starPoints.find(p => p.id === conn[1])?.y || 0"
            stroke="url(#lineGradient)"
            stroke-width="2"
            filter="url(#glow)"
            class="animate-fade-in"
          />
          
          <line
            v-if="isDragging && startPoint !== null"
            :x1="store.starPoints.find(p => p.id === startPoint)?.x || 0"
            :y1="store.starPoints.find(p => p.id === startPoint)?.y || 0"
            :x2="mousePos.x"
            :y2="mousePos.y"
            stroke="rgba(212, 175, 55, 0.5)"
            stroke-width="1"
            stroke-dasharray="5,5"
          />
          
          <g v-for="point in store.starPoints" :key="'point-' + point.id">
            <circle
              :cx="point.x"
              :cy="point.y"
              :r="point.connected ? 12 : 8"
              :fill="point.connected ? '#d4af37' : 'rgba(192, 192, 192, 0.3)'"
              filter="url(#glow)"
              class="transition-all duration-300"
            />
            <circle
              :cx="point.x"
              :cy="point.y"
              :r="point.connected ? 20 : 15"
              fill="none"
              :stroke="point.connected ? 'rgba(212, 175, 55, 0.5)' : 'rgba(192, 192, 192, 0.2)'"
              stroke-width="1"
              class="transition-all duration-300"
            />
            <text
              :x="point.x"
              :y="point.y + 25"
              text-anchor="middle"
              class="text-xs fill-silver/50 font-mono"
            >
              {{ point.id + 1 }}
            </text>
          </g>
        </svg>
        
        <div
          class="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <div
            class="w-16 h-16 rounded-full border border-gold/30 animate-breathing"
          />
        </div>
      </div>
    </div>
    
    <div class="flex justify-center mt-6">
      <button
        @click="handleUndo"
        :disabled="store.starConnections.length === 0"
        class="px-6 py-2 text-sm font-display tracking-wider text-silver/70 hover:text-gold transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← 撤销上一条连线
      </button>
    </div>
  </div>
</template>
