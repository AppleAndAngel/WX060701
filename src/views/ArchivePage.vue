<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useArchiveStore } from '@/stores/archive'
import MysticButton from '@/components/common/MysticButton.vue'
import type { DivinationResult, SynastryResult, YearlyResult, CareerChoiceResult, LoveTimingResult, DailyRitualResult } from '@/types'

const router = useRouter()
const route = useRoute()
const archiveStore = useArchiveStore()
const isLoading = ref(true)
const showConfirmClear = ref(false)
const activeFilter = ref<'all' | 'divination' | 'synastry' | 'yearly' | 'career-choice' | 'love-timing' | 'daily-ritual'>('all')

const loadRecordsData = () => {
  isLoading.value = true
  archiveStore.loadRecords()
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

onMounted(() => {
  loadRecordsData()
})

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath === '/archive' && oldPath !== '/archive') {
      loadRecordsData()
    }
  }
)

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

const filteredRecords = computed(() => {
  if (activeFilter.value === 'divination') {
    return archiveStore.records.filter(r => archiveStore.isDivinationRecord(r))
  }
  if (activeFilter.value === 'synastry') {
    return archiveStore.records.filter(r => archiveStore.isSynastryRecord(r))
  }
  if (activeFilter.value === 'yearly') {
    return archiveStore.records.filter(r => archiveStore.isYearlyRecord(r))
  }
  if (activeFilter.value === 'career-choice') {
    return archiveStore.records.filter(r => archiveStore.isCareerChoiceRecord(r))
  }
  if (activeFilter.value === 'love-timing') {
    return archiveStore.records.filter(r => archiveStore.isLoveTimingRecord(r))
  }
  if (activeFilter.value === 'daily-ritual') {
    return archiveStore.records.filter(r => archiveStore.isDailyRitualRecord(r))
  }
  return archiveStore.records
})

const isSynastryRecord = (record: DivinationResult | SynastryResult | YearlyResult | CareerChoiceResult | LoveTimingResult | DailyRitualResult): record is SynastryResult => {
  return archiveStore.isSynastryRecord(record)
}

const isYearlyRecord = (record: DivinationResult | SynastryResult | YearlyResult | CareerChoiceResult | LoveTimingResult | DailyRitualResult): record is YearlyResult => {
  return archiveStore.isYearlyRecord(record)
}

const isCareerChoiceRecord = (record: DivinationResult | SynastryResult | YearlyResult | CareerChoiceResult | LoveTimingResult | DailyRitualResult): record is CareerChoiceResult => {
  return archiveStore.isCareerChoiceRecord(record)
}

const isLoveTimingRecord = (record: DivinationResult | SynastryResult | YearlyResult | CareerChoiceResult | LoveTimingResult | DailyRitualResult): record is LoveTimingResult => {
  return archiveStore.isLoveTimingRecord(record)
}

const isDailyRitualRecord = (record: DivinationResult | SynastryResult | YearlyResult | CareerChoiceResult | LoveTimingResult | DailyRitualResult): record is DailyRitualResult => {
  return archiveStore.isDailyRitualRecord(record)
}

const viewResult = (record: DivinationResult | SynastryResult | YearlyResult | CareerChoiceResult | LoveTimingResult | DailyRitualResult) => {
  if (isSynastryRecord(record)) {
    router.push(`/synastry/result/${record.id}`)
  } else if (isYearlyRecord(record)) {
    router.push(`/yearly/result/${record.id}`)
  } else if (isCareerChoiceRecord(record)) {
    router.push(`/career-choice/result/${record.id}`)
  } else if (isLoveTimingRecord(record)) {
    router.push(`/love-timing/result/${record.id}`)
  } else if (isDailyRitualRecord(record)) {
    router.push(`/daily-ritual`)
  } else {
    router.push(`/result/${record.id}`)
  }
}

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const getEnergyColor = (level: number) => {
  if (level >= 70) return 'from-emerald-400 to-green-500'
  if (level >= 40) return 'from-gold to-yellow-500'
  return 'from-orange-400 to-red-500'
}

const getTrendIcon = (trend: string) => {
  if (trend === 'rising') return '↑'
  if (trend === 'falling') return '↓'
  return '→'
}

const getTrendText = (trend: string) => {
  if (trend === 'rising') return '上升'
  if (trend === 'falling') return '下降'
  return '平稳'
}

const getTrendColor = (trend: string) => {
  if (trend === 'rising') return 'text-emerald-400'
  if (trend === 'falling') return 'text-orange-400'
  return 'text-silver/70'
}

const maxEnergyValue = computed(() => {
  if (!archiveStore.cycleData?.weekEnergy) return 100
  const max = Math.max(...archiveStore.cycleData.weekEnergy, 100)
  return Math.ceil(max / 10) * 10
})

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
        <div v-if="archiveStore.totalRituals > 0" class="mb-12">
          <h2 class="font-display text-2xl text-gold mb-6 tracking-wider">
            ✧ 能量轨迹
          </h2>
          
          <div class="grid md:grid-cols-4 gap-6 mb-8">
            <div class="p-6 rounded-xl bg-glass text-center">
              <div class="text-5xl mb-2">🔥</div>
              <div class="font-display text-4xl text-gold mb-1">{{ archiveStore.consecutiveStreak }}</div>
              <div class="text-sm text-silver/70 font-mono">连续签到天数</div>
            </div>
            <div class="p-6 rounded-xl bg-glass text-center">
              <div class="text-5xl mb-2">✦</div>
              <div class="font-display text-4xl text-purple mb-1">{{ archiveStore.totalRituals }}</div>
              <div class="text-sm text-silver/70 font-mono">累计仪式次数</div>
            </div>
            <div class="p-6 rounded-xl bg-glass text-center">
              <div class="text-5xl mb-2">⚡</div>
              <div class="font-display text-4xl text-cyan-400 mb-1">{{ archiveStore.averageEnergy }}</div>
              <div class="text-sm text-silver/70 font-mono">平均能量指数</div>
            </div>
            <div class="p-6 rounded-xl bg-glass text-center">
              <div class="text-5xl mb-2" :class="getTrendColor(archiveStore.cycleData?.trend || 'stable')">
                {{ getTrendIcon(archiveStore.cycleData?.trend || 'stable') }}
              </div>
              <div class="font-display text-4xl mb-1" :class="getTrendColor(archiveStore.cycleData?.trend || 'stable')">
                {{ getTrendText(archiveStore.cycleData?.trend || 'stable') }}
              </div>
              <div class="text-sm text-silver/70 font-mono">近期能量趋势</div>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div class="p-6 rounded-xl bg-glass">
              <h3 class="font-display text-xl text-gold mb-6 tracking-wider">
                本周能量波动
              </h3>
              <div class="flex items-end justify-between gap-2 h-40 mb-4">
                <div
                  v-for="(energy, idx) in archiveStore.cycleData?.weekEnergy || []"
                  :key="idx"
                  class="flex-1 flex flex-col items-center gap-2"
                >
                  <div class="w-full rounded-t-lg transition-all duration-700"
                    :class="energy > 0 ? `bg-gradient-to-t ${getEnergyColor(energy)}` : 'bg-silver/10'"
                    :style="{ height: energy > 0 ? `${(energy / maxEnergyValue) * 100}%` : '20%' }"
                  />
                  <span class="text-xs font-mono" :class="energy > 0 ? 'text-gold' : 'text-silver/40'">
                    {{ weekDays[idx] }}
                  </span>
                  <span v-if="energy > 0" class="text-xs font-mono text-silver/60">
                    {{ energy }}
                  </span>
                </div>
              </div>
            </div>

            <div class="p-6 rounded-xl bg-glass">
              <h3 class="font-display text-xl text-gold mb-6 tracking-wider">
                近期象征主题
              </h3>
              <div class="space-y-3">
                <div
                  v-for="theme in archiveStore.frequentThemes"
                  :key="theme.theme"
                  class="flex items-start gap-3"
                >
                  <div class="w-8 h-8 rounded-full bg-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="font-display text-sm text-purple">{{ theme.count }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-display text-silver/90">{{ theme.theme }}</div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span
                        v-for="kw in theme.keywords"
                        :key="kw"
                        class="px-2 py-0.5 rounded bg-silver/10 text-silver/60 text-xs font-mono"
                      >
                        {{ kw }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="archiveStore.frequentThemes?.length === 0" class="text-center py-8">
                <p class="text-silver/50">暂无主题数据</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mb-12">
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
          </div>
          
          <div class="p-6 rounded-xl bg-glass">
            <h3 class="font-display text-xl text-gold mb-6 tracking-wider">
              统计概览
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-silver/70 text-sm">总记录数</span>
                <span class="font-display text-2xl text-gold">{{ archiveStore.recordCount }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-silver/70 text-sm">个人占卜</span>
                <span class="font-display text-xl text-gold">{{ archiveStore.divinationCount }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-silver/70 text-sm">双人合盘</span>
                <span class="font-display text-xl text-purple">{{ archiveStore.synastryCount }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-silver/70 text-sm">年度流年</span>
                <span class="font-display text-xl text-cyan-400">{{ archiveStore.yearlyCount }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-silver/70 text-sm">职业抉择</span>
                <span class="font-display text-xl text-orange-400">{{ archiveStore.careerChoiceCount }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-silver/70 text-sm">爱情时机</span>
                <span class="font-display text-xl text-pink-400">{{ archiveStore.loveTimingCount }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-silver/70 text-sm">每日仪式</span>
                <span class="font-display text-xl text-emerald-400">{{ archiveStore.dailyRitualCount }}</span>
              </div>
              <div v-if="archiveStore.getMostFrequentNumber() !== null" class="flex justify-between items-center">
                <span class="text-silver/70 text-sm">高频数字</span>
                <span class="font-display text-2xl text-purple">{{ archiveStore.getMostFrequentNumber() }}</span>
              </div>
              <div class="pt-4 mt-4 border-t border-silver/20">
                <h4 class="font-display text-sm text-gold mb-3">关系类型分布</h4>
                <div class="space-y-2">
                  <div
                    v-for="(count, type) in archiveStore.relationshipStats"
                    :key="type"
                    class="flex items-center justify-between text-sm"
                  >
                    <span class="text-silver/70">{{ type }}</span>
                    <span class="font-mono text-purple">{{ count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-4">
            <h3 class="font-display text-xl text-gold tracking-wider">
              历史记录
            </h3>
            <div class="flex gap-2 flex-wrap">
              <button
                @click="activeFilter = 'all'"
                class="px-3 py-1 rounded-full text-xs font-mono transition-all duration-300"
                :class="{
                  'bg-gold/20 text-gold border border-gold/30': activeFilter === 'all',
                  'bg-silver/10 text-silver/60 border border-silver/20 hover:border-gold/30': activeFilter !== 'all'
                }"
              >
                全部 ({{ archiveStore.recordCount }})
              </button>
              <button
                @click="activeFilter = 'divination'"
                class="px-3 py-1 rounded-full text-xs font-mono transition-all duration-300"
                :class="{
                  'bg-gold/20 text-gold border border-gold/30': activeFilter === 'divination',
                  'bg-silver/10 text-silver/60 border border-silver/20 hover:border-gold/30': activeFilter !== 'divination'
                }"
              >
                占卜 ({{ archiveStore.divinationCount }})
              </button>
              <button
                @click="activeFilter = 'synastry'"
                class="px-3 py-1 rounded-full text-xs font-mono transition-all duration-300"
                :class="{
                  'bg-purple/20 text-purple border border-purple/30': activeFilter === 'synastry',
                  'bg-silver/10 text-silver/60 border border-silver/20 hover:border-purple/30': activeFilter !== 'synastry'
                }"
              >
                合盘 ({{ archiveStore.synastryCount }})
              </button>
              <button
                @click="activeFilter = 'yearly'"
                class="px-3 py-1 rounded-full text-xs font-mono transition-all duration-300"
                :class="{
                  'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30': activeFilter === 'yearly',
                  'bg-silver/10 text-silver/60 border border-silver/20 hover:border-cyan-500/30': activeFilter !== 'yearly'
                }"
              >
                流年 ({{ archiveStore.yearlyCount }})
              </button>
              <button
                @click="activeFilter = 'career-choice'"
                class="px-3 py-1 rounded-full text-xs font-mono transition-all duration-300"
                :class="{
                  'bg-orange-500/20 text-orange-400 border border-orange-500/30': activeFilter === 'career-choice',
                  'bg-silver/10 text-silver/60 border border-silver/20 hover:border-orange-500/30': activeFilter !== 'career-choice'
                }"
              >
                抉择 ({{ archiveStore.careerChoiceCount }})
              </button>
              <button
                @click="activeFilter = 'love-timing'"
                class="px-3 py-1 rounded-full text-xs font-mono transition-all duration-300"
                :class="{
                  'bg-pink-500/20 text-pink-400 border border-pink-500/30': activeFilter === 'love-timing',
                  'bg-silver/10 text-silver/60 border border-silver/20 hover:border-pink-500/30': activeFilter !== 'love-timing'
                }"
              >
                时机 ({{ archiveStore.loveTimingCount }})
              </button>
              <button
                @click="activeFilter = 'daily-ritual'"
                class="px-3 py-1 rounded-full text-xs font-mono transition-all duration-300"
                :class="{
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': activeFilter === 'daily-ritual',
                  'bg-silver/10 text-silver/60 border border-silver/20 hover:border-emerald-500/30': activeFilter !== 'daily-ritual'
                }"
              >
                日签 ({{ archiveStore.dailyRitualCount }})
              </button>
            </div>
          </div>
          <button
            @click="confirmClearAll"
            class="text-sm font-mono text-silver/60 hover:text-mystic-red transition-colors duration-300"
          >
            清除全部记录
          </button>
        </div>
        
        <div v-if="filteredRecords.length === 0" class="text-center py-12">
          <p class="font-body text-silver/50">暂无该类型的记录</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="record in filteredRecords"
            :key="record.id"
            @click="viewResult(record)"
            class="group p-6 rounded-xl bg-glass hover:bg-glass/80 cursor-pointer transition-all duration-300 hover:border-gold/30 border border-transparent"
            :class="{
              'border-l-4 border-l-purple': isSynastryRecord(record),
              'border-l-4 border-l-cyan-400': isYearlyRecord(record),
              'border-l-4 border-l-orange-400': isCareerChoiceRecord(record),
              'border-l-4 border-l-pink-400': isLoveTimingRecord(record),
              'border-l-4 border-l-emerald-400': isDailyRitualRecord(record)
            }"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2 flex-wrap">
                  <span class="font-display text-xl text-gold">
                    {{ record.interpretation.title }}
                  </span>
                  <span
                    v-if="isSynastryRecord(record)"
                    class="px-2 py-0.5 rounded bg-purple/20 text-purple text-xs font-mono"
                  >
                    合盘 · {{ (record as SynastryResult).input.relationshipType }}
                  </span>
                  <span
                    v-else-if="isYearlyRecord(record)"
                    class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono"
                  >
                    流年 · {{ (record as YearlyResult).input.targetYear }}
                  </span>
                  <span
                    v-else-if="isCareerChoiceRecord(record)"
                    class="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-xs font-mono"
                  >
                    抉择
                  </span>
                  <span
                    v-else-if="isLoveTimingRecord(record)"
                    class="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 text-xs font-mono"
                  >
                    时机 · {{ (record as LoveTimingResult).input.scenario === 'progression' ? '关系推进' : (record as LoveTimingResult).input.scenario === 'reconciliation' ? '复合' : '表白' }}
                  </span>
                  <span
                    v-else-if="isDailyRitualRecord(record)"
                    class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono"
                  >
                    日签 · 数字 {{ (record as DailyRitualResult).dailyNumber }}
                  </span>
                  <span v-else class="px-2 py-0.5 rounded bg-gold/20 text-gold text-xs font-mono">
                    占卜
                  </span>
                  <span class="text-xs font-mono text-silver/60">
                    {{ formatDate(record.createdAt) }}
                  </span>
                </div>
                
                <div class="flex flex-wrap gap-2 mb-3">
                  <template v-if="isSynastryRecord(record)">
                    <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                      {{ (record as SynastryResult).input.personA.name }}
                    </span>
                    <span class="text-silver/50">×</span>
                    <span class="px-2 py-0.5 rounded bg-purple/10 text-purple/80 text-xs font-mono">
                      {{ (record as SynastryResult).input.personB.name }}
                    </span>
                    <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                      {{ getGeometryName(record.geometry.type) }}
                    </span>
                  </template>
                  <template v-else-if="isYearlyRecord(record)">
                    <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                      {{ (record as YearlyResult).input.name }}
                    </span>
                    <span class="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400/80 text-xs font-mono">
                      流年数字 {{ (record as YearlyResult).yearNumber }}
                    </span>
                    <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                      生命路径 {{ (record as YearlyResult).lifePathNumber }}
                    </span>
                  </template>
                  <template v-else-if="isCareerChoiceRecord(record)">
                    <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                      {{ (record as CareerChoiceResult).input.name }}
                    </span>
                    <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                      {{ (record as CareerChoiceResult).input.optionA.name }}
                    </span>
                    <span class="text-silver/50">vs</span>
                    <span class="px-2 py-0.5 rounded bg-purple/10 text-purple/80 text-xs font-mono">
                      {{ (record as CareerChoiceResult).input.optionB.name }}
                    </span>
                  </template>
                  <template v-else-if="isLoveTimingRecord(record)">
                    <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                      {{ (record as LoveTimingResult).input.yourName }}
                    </span>
                    <span class="text-silver/50">♥</span>
                    <span class="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400/80 text-xs font-mono">
                      {{ (record as LoveTimingResult).input.theirName }}
                    </span>
                    <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                      {{ getGeometryName(record.geometry.type) }}
                    </span>
                  </template>
                  <template v-else-if="isDailyRitualRecord(record)">
                    <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400/80 text-xs font-mono">
                      {{ (record as DailyRitualResult).symbolTheme }}
                    </span>
                    <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                      能量 {{ (record as DailyRitualResult).energyLevel }}
                    </span>
                    <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                      {{ getGeometryName(record.geometry.type) }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                      {{ record.input.name }}
                    </span>
                    <span class="px-2 py-0.5 rounded bg-gold/10 text-gold/80 text-xs font-mono">
                      {{ getGeometryName(record.geometry.type) }}
                    </span>
                  </template>
                  <span
                    v-for="kw in (isDailyRitualRecord(record) ? (record as DailyRitualResult).symbolKeywords : (isYearlyRecord(record) ? record.interpretation.coreKeywords : record.interpretation.keywords)).slice(0, 3)"
                    :key="kw"
                    class="px-2 py-0.5 rounded bg-silver/10 text-silver/70 text-xs font-mono"
                  >
                    {{ kw }}
                  </span>
                </div>
                
                <p class="font-body text-silver/70 text-sm line-clamp-2">
                  <template v-if="isSynastryRecord(record)">
                    {{ (record as SynastryResult).interpretation.overallDescription }}
                  </template>
                  <template v-else-if="isYearlyRecord(record)">
                    {{ (record as YearlyResult).interpretation.overallDescription }}
                  </template>
                  <template v-else-if="isCareerChoiceRecord(record)">
                    {{ (record as CareerChoiceResult).interpretation.overallDescription }}
                  </template>
                  <template v-else-if="isLoveTimingRecord(record)">
                    {{ (record as LoveTimingResult).interpretation.overallDescription }}
                  </template>
                  <template v-else-if="isDailyRitualRecord(record)">
                    {{ (record as DailyRitualResult).interpretation.guidance }}
                  </template>
                  <template v-else>
                    {{ record.interpretation.paragraphs[0] }}
                  </template>
                </p>
                
                <div class="flex items-center gap-4 mt-4 flex-wrap">
                  <template v-if="isSynastryRecord(record)">
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-silver/60 font-mono">{{ (record as SynastryResult).input.personA.name }}</span>
                      <span class="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-xs font-display text-gold">
                        {{ (record as SynastryResult).personANumbers.lifePath }}
                      </span>
                      <span class="w-6 h-6 rounded-full bg-purple/20 flex items-center justify-center text-xs font-display text-purple">
                        {{ (record as SynastryResult).personANumbers.soul }}
                      </span>
                    </div>
                    <span class="text-silver/40">×</span>
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-silver/60 font-mono">{{ (record as SynastryResult).input.personB.name }}</span>
                      <span class="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-xs font-display text-gold">
                        {{ (record as SynastryResult).personBNumbers.lifePath }}
                      </span>
                      <span class="w-6 h-6 rounded-full bg-purple/20 flex items-center justify-center text-xs font-display text-purple">
                        {{ (record as SynastryResult).personBNumbers.soul }}
                      </span>
                    </div>
                    <div class="ml-auto flex items-center gap-1">
                      <span class="text-xs text-silver/60 font-mono">匹配度</span>
                      <span class="font-display text-lg text-gold">
                        {{ (record as SynastryResult).interpretation.overallScore }}
                      </span>
                    </div>
                  </template>
                  <template v-else-if="isYearlyRecord(record)">
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-silver/60 font-mono">生命路径</span>
                      <span class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-sm font-display text-gold">
                        {{ (record as YearlyResult).lifePathNumber }}
                      </span>
                      <span class="text-silver/40">+</span>
                      <span class="text-xs text-silver/60 font-mono">流年</span>
                      <span class="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-sm font-display text-cyan-400">
                        {{ (record as YearlyResult).yearNumber }}
                      </span>
                    </div>
                    <div class="ml-auto flex items-center gap-1">
                      <span class="text-xs text-silver/60 font-mono">年度主题</span>
                      <span class="font-display text-sm text-cyan-400">
                        {{ (record as YearlyResult).interpretation.theme }}
                      </span>
                    </div>
                  </template>
                  <template v-else-if="isCareerChoiceRecord(record)">
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-silver/60 font-mono">{{ (record as CareerChoiceResult).input.optionA.name }}</span>
                      <span class="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-xs font-display text-gold">
                        {{ (record as CareerChoiceResult).interpretation.pathA.suitability }}
                      </span>
                      <span class="text-silver/40">vs</span>
                      <span class="w-6 h-6 rounded-full bg-purple/20 flex items-center justify-center text-xs font-display text-purple">
                        {{ (record as CareerChoiceResult).interpretation.pathB.suitability }}
                      </span>
                      <span class="text-xs text-silver/60 font-mono">{{ (record as CareerChoiceResult).input.optionB.name }}</span>
                    </div>
                  </template>
                  <template v-else-if="isLoveTimingRecord(record)">
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-silver/60 font-mono">{{ (record as LoveTimingResult).input.yourName }}</span>
                      <span class="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-xs font-display text-gold">
                        {{ (record as LoveTimingResult).yourNumbers.lifePath }}
                      </span>
                      <span class="w-6 h-6 rounded-full bg-purple/20 flex items-center justify-center text-xs font-display text-purple">
                        {{ (record as LoveTimingResult).yourNumbers.soul }}
                      </span>
                    </div>
                    <span class="text-silver/40">♥</span>
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-xs font-display text-gold">
                        {{ (record as LoveTimingResult).theirNumbers.lifePath }}
                      </span>
                      <span class="w-6 h-6 rounded-full bg-purple/20 flex items-center justify-center text-xs font-display text-purple">
                        {{ (record as LoveTimingResult).theirNumbers.soul }}
                      </span>
                      <span class="text-xs text-silver/60 font-mono">{{ (record as LoveTimingResult).input.theirName }}</span>
                    </div>
                    <div class="ml-auto flex items-center gap-1">
                      <span class="text-xs text-silver/60 font-mono">时机指数</span>
                      <span class="font-display text-lg text-pink-400">
                        {{ (record as LoveTimingResult).interpretation.overallScore }}
                      </span>
                    </div>
                  </template>
                  <template v-else-if="isDailyRitualRecord(record)">
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-silver/60 font-mono">心情</span>
                      <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                        {{ (record as DailyRitualResult).input.mood }}
                      </span>
                      <span class="text-silver/40">·</span>
                      <span class="text-xs text-silver/60 font-mono">日签数字</span>
                      <span class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-display text-emerald-400">
                        {{ (record as DailyRitualResult).dailyNumber }}
                      </span>
                    </div>
                    <div class="ml-auto flex items-center gap-1">
                      <span class="text-xs text-silver/60 font-mono">能量指数</span>
                      <span class="font-display text-lg text-emerald-400">
                        {{ (record as DailyRitualResult).energyLevel }}
                      </span>
                    </div>
                  </template>
                  <template v-else>
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
                  </template>
                </div>
              </div>
              
              <button
                @click="deleteRecord($event, record.id)"
                class="p-2 text-silver/50 hover:text-mystic-red transition-colors duration-300 opacity-0 group-hover:opacity-100 flex-shrink-0"
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
