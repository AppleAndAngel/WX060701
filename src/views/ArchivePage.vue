<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useArchiveStore } from '@/stores/archive'
import MysticButton from '@/components/common/MysticButton.vue'
import type { DivinationResult } from '@/types'

const router = useRouter()
const archiveStore = useArchiveStore()
const isLoading = ref(true)
const showConfirmClear = ref(false)

onMounted(() => {
  archiveStore.loadRecords()
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getGeometryName = (type: string): string => {
  const names: Record<string, string> = {
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
  return names[type] || type
}

const viewResult = (id: string) => {
  router.push(`/result/${id}`)
}

const deleteRecord = (e: Event, id: string) => {
  e.stopPropagation()
  archiveStore.removeRecord(id)
}

const confirmClearAll = () => {
  showConfirmClear.value = true
}

const cancelClear = () => {
  showConfirmClear.value = false
}

const clearAll = () => {
  archiveStore.clearAll()
  showConfirmClear.value = false
}

const goToDivination = () => {
  router.push('/ritual')
}

const numberStatsArray = computed(() => {
  return Object.entries(archiveStore.numberStats)
    .map(([num, count]) => ({ number: parseInt(num, 10), count }))
    .sort((a, b) => b.count - a.count)
})

const geometryStatsArray = computed(() => {
  return Object.entries(archiveStore.geometryStats)
    .map(([type, count]) => ({ type, count, name: getGeometryName(type) }))
    .sort((a, b) => b.count - a.count)
})

const maxCount = computed(() => {
  const counts = [...Object.values(archiveStore.numberStats), ...Object.values(archiveStore.geometryStats)]
  return Math.max(...counts, 1)
})
</script>

<template>
  <div class="w-full h-full overflow-y-auto">
    <div class="max-w-5xl mx-auto px-6 py-12">
      <div class="text-center mb-12">
        <h1 class="font-display text-4xl text-gradient-gold tracking-wider mb-4">
          星图档案
        </h1>
        <p class="font-body text-silver/70">
          你过往的所有占卜记录，构成独特的数字轨迹
        </p>
      </div>
      
      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
      
      <div v-else-if="archiveStore.recordCount === 0" class="text-center py-20">
        <div class="text-6xl mb-6 opacity-50">✧</div>
        <h2 class="font-display text-2xl text-silver/70 mb-4 tracking-wider">
          暂无记录
        </h2>
        <p class="font-body text-silver/60 mb-8">
          开始你的第一次占卜，记录将保存在这里
        </p>
        <MysticButton @click="goToDivination">开始占卜 ✦</MysticButton>
      </div>
      
      <template v-else>
        <div class="grid md:grid-cols-2 gap-6 mb-12">
          <div class="p-6 rounded-xl bg-glass">
            <h3 class="font-display text-xl text-gold mb-6 tracking-wider">
              数字频率
            </h3>
            <div class="space-y-3">
              <div
                v-for="stat in numberStatsArray.slice(0, 9)"
                :key="stat.number"
                class="flex items-center gap-3"
              >
                <span class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center font-display text-gold text-sm">
                  {{ stat.number }}
                </span>
                <div class="flex-1 h-2 bg-silver/20 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full transition-all duration-1000"
                    :style="{ width: `${(stat.count / maxCount) * 100}%` }"
                  />
                </div>
                <span class="w-8 text-right font-mono text-xs text-silver/70">
                  {{ stat.count }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="p-6 rounded-xl bg-glass">
            <h3 class="font-display text-xl text-gold mb-6 tracking-wider">
              命盘分布
            </h3>
            <div class="space-y-3">
              <div
                v-for="stat in geometryStatsArray"
                :key="stat.type"
                class="flex items-center gap-3"
              >
                <span class="w-24 font-display text-sm text-silver/80">
                  {{ stat.name }}
                </span>
                <div class="flex-1 h-2 bg-silver/20 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-purple/60 to-purple rounded-full transition-all duration-1000"
                    :style="{ width: `${(stat.count / maxCount) * 100}%` }"
                  />
                </div>
                <span class="w-8 text-right font-mono text-xs text-silver/70">
                  {{ stat.count }}
                </span>
              </div>
            </div>
            
            <div class="mt-6 pt-6 border-t border-silver/20">
              <div class="flex justify-between items-center">
                <span class="text-silver/70 text-sm">总占卜次数</span>
                <span class="font-display text-2xl text-gold">{{ archiveStore.recordCount }}</span>
              </div>
              <div v-if="archiveStore.getMostFrequentNumber() !== null" class="flex justify-between items-center mt-2">
                <span class="text-silver/70 text-sm">高频数字</span>
                <span class="font-display text-2xl text-purple">{{ archiveStore.getMostFrequentNumber() }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-display text-xl text-gold tracking-wider">
            历史记录
          </h3>
          <button
            @click="confirmClearAll"
            class="text-sm font-mono text-silver/60 hover:text-mystic-red transition-colors duration-300"
          >
            清除全部记录
          </button>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="record in archiveStore.records"
            :key="record.id"
            @click="viewResult(record.id)"
            class="group p-6 rounded-xl bg-glass hover:bg-glass/80 cursor-pointer transition-all duration-300 hover:border-gold/30 border border-transparent"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="font-display text-xl text-gold">
                    {{ record.interpretation.title }}
                  </span>
                  <span class="text-xs font-mono text-silver/60">
                    {{ formatDate(record.createdAt) }}
                  </span>
                </div>
                
                <div class="flex flex-wrap gap-2 mb-3">
                  <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                    {{ record.input.name }}
                  </span>
                  <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                    {{ getGeometryName(record.geometry.type) }}
                  </span>
                  <span
                    v-for="kw in record.interpretation.keywords.slice(0, 3)"
                    :key="kw"
                    class="px-2 py-0.5 rounded bg-silver/10 text-silver/70 text-xs font-mono"
                  >
                    {{ kw }}
                  </span>
                </div>
                
                <p class="font-body text-silver/70 text-sm line-clamp-2">
                  {{ record.interpretation.paragraphs[0] }}
                </p>
                
                <div class="flex items-center gap-4 mt-4">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-xs font-display text-gold">
                      {{ record.coreNumbers.lifePath }}
                    </span>
                    <span class="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-xs font-display text-gold">
                      {{ record.coreNumbers.destiny }}
                    </span>
                    <span class="w-6 h-6 rounded-full bg-purple/20 flex items-center justify-center text-xs font-display text-purple">
                      {{ record.coreNumbers.soul }}
                    </span>
                    <span class="w-6 h-6 rounded-full bg-purple/20 flex items-center justify-center text-xs font-display text-purple">
                      {{ record.coreNumbers.personality }}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                @click="deleteRecord($event, record.id)"
                class="p-2 text-silver/50 hover:text-mystic-red transition-colors duration-300 opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
    
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showConfirmClear"
        class="fixed inset-0 z-50 flex items-center justify-center bg-cosmic-900/80 backdrop-blur-sm"
        @click.self="cancelClear"
      >
        <div class="bg-glass p-8 rounded-2xl max-w-md mx-4 text-center">
          <div class="text-4xl mb-4">⚠</div>
          <h3 class="font-display text-xl text-gold mb-4 tracking-wider">
            确认清除全部记录？
          </h3>
          <p class="font-body text-silver/70 mb-8">
            此操作将永久删除所有本地存储的占卜记录，且无法恢复。
          </p>
          <div class="flex items-center justify-center gap-4">
            <MysticButton variant="secondary" @click="cancelClear">
              取消
            </MysticButton>
            <MysticButton
              variant="primary"
              @click="clearAll"
              class="!border-mystic-red !text-mystic-red hover:!bg-mystic-red hover:!text-white"
            >
              确认清除
            </MysticButton>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
