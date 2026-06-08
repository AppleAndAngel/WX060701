<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoveTimingStore } from '@/stores/loveTiming'
import GeometryChart from '@/components/result/GeometryChart.vue'
import CalculationTrace from '@/components/result/CalculationTrace.vue'
import ShareCardModal from '@/components/result/ShareCardModal.vue'
import MysticButton from '@/components/common/MysticButton.vue'
import { generateShareCard } from '@/utils/shareCard'
import type { ShareCardData } from '@/utils/shareCard'
import type { RiskWarning, ActionWindow } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useLoveTimingStore()
const activeTab = ref<'overview' | 'stages' | 'risks' | 'windows' | 'energy' | 'advice' | 'trace'>('overview')
const isLoading = ref(true)
const notFound = ref(false)
const showShareModal = ref(false)
const shareCardData = ref<ShareCardData | null>(null)

const result = computed(() => store.currentResult)

const openShareModal = () => {
  if (result.value) {
    shareCardData.value = generateShareCard(result.value)
    showShareModal.value = true
  }
}

const closeShareModal = () => {
  showShareModal.value = false
}

onMounted(() => {
  const id = route.params.id as string
  if (store.currentResult?.id === id) {
    isLoading.value = false
    return
  }
  
  const loaded = store.loadResult(id)
  if (!loaded) {
    notFound.value = true
  }
  isLoading.value = false
})

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getScoreColor = (score: number) => {
  if (score >= 85) return 'text-green-400'
  if (score >= 75) return 'text-gold'
  if (score >= 65) return 'text-yellow-500'
  if (score >= 55) return 'text-orange-400'
  return 'text-red-400'
}

const getScoreBg = (score: number) => {
  if (score >= 85) return 'bg-green-500'
  if (score >= 75) return 'bg-gold'
  if (score >= 65) return 'bg-yellow-500'
  if (score >= 55) return 'bg-orange-400'
  return 'bg-red-400'
}

const getRiskLevelInfo = (level: string) => {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    critical: { label: '极高风险', color: 'text-red-400', bg: 'bg-red-500' },
    high: { label: '高风险', color: 'text-orange-400', bg: 'bg-orange-400' },
    medium: { label: '中等风险', color: 'text-yellow-500', bg: 'bg-yellow-500' },
    low: { label: '低风险', color: 'text-green-400', bg: 'bg-green-500' }
  }
  return map[level] || map.low
}

const getWindowTypeInfo = (type: string) => {
  const map: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    optimal: { label: '黄金窗口', color: 'text-gold', bg: 'bg-gold/20', icon: '★' },
    good: { label: '有利时机', color: 'text-green-400', bg: 'bg-green-500/20', icon: '✓' },
    challenging: { label: '挑战时期', color: 'text-orange-400', bg: 'bg-orange-400/20', icon: '⚠' }
  }
  return map[type] || map.good
}

const getTrendIcon = (trend: string) => {
  const map: Record<string, string> = {
    rising: '↑',
    stable: '→',
    falling: '↓'
  }
  return map[trend] || '→'
}

const getTrendColor = (trend: string) => {
  const map: Record<string, string> = {
    rising: 'text-green-400',
    stable: 'text-silver',
    falling: 'text-red-400'
  }
  return map[trend] || 'text-silver'
}

const scenarioLabel = computed(() => {
  if (!result.value) return ''
  const map: Record<string, string> = {
    progression: '关系推进',
    reconciliation: '复合时机',
    confession: '表白时机'
  }
  return map[result.value.input.scenario] || ''
})

const scenarioIcon = computed(() => {
  if (!result.value) return '♥'
  const map: Record<string, string> = {
    progression: '♥',
    reconciliation: '∞',
    confession: '♡'
  }
  return map[result.value.input.scenario] || '♥'
})

const newLoveTiming = () => {
  store.reset()
  router.push('/love-timing')
}

const goToArchive = () => {
  router.push('/archive')
}
</script>

<template>
  <div class="w-full h-full overflow-y-auto">
    <div v-if="isLoading" class="w-full h-full flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p class="font-display text-gold tracking-wider">加载中...</p>
      </div>
    </div>
    
    <div v-else-if="notFound" class="w-full h-full flex items-center justify-center px-6">
      <div class="text-center max-w-md">
        <div class="text-6xl mb-6">♥</div>
        <h2 class="font-display text-2xl text-gold mb-4 tracking-wider">记录未找到</h2>
        <p class="font-body text-silver/70 mb-8">
          该爱情时机记录可能已被清除或不存在。
        </p>
        <MysticButton @click="goToArchive">返回档案</MysticButton>
      </div>
    </div>
    
    <template v-else-if="result">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <div class="text-center mb-12">
          <div class="font-mono text-xs text-silver/60 tracking-wider mb-4">
            {{ formatDate(result.createdAt) }}
          </div>
          <h1 class="font-display text-3xl md:text-5xl text-gradient-gold tracking-wider mb-4">
            {{ result.interpretation.title }}
          </h1>
          <div class="flex flex-wrap justify-center gap-3 text-sm mb-8">
            <span class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 font-mono">
              {{ scenarioIcon }} {{ scenarioLabel }}
            </span>
            <span class="text-gold/60">·</span>
            <span class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 font-mono">
              {{ result.input.yourName }}
            </span>
            <span class="text-gold/40">↔</span>
            <span class="px-3 py-1 rounded-full bg-purple/10 text-purple/80 border border-purple/20 font-mono">
              {{ result.input.theirName }}
            </span>
          </div>

          <div class="relative inline-block">
            <div class="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-gold/30 flex items-center justify-center relative overflow-hidden">
              <div
                class="absolute inset-0 flex items-end"
                :style="{ background: `linear-gradient(to top, ${result.interpretation.overallScore >= 80 ? 'rgba(212, 175, 55, 0.3)' : result.interpretation.overallScore >= 60 ? 'rgba(234, 179, 8, 0.3)' : result.interpretation.overallScore >= 40 ? 'rgba(249, 115, 22, 0.3)' : 'rgba(239, 68, 68, 0.3)'} ${result.interpretation.overallScore}%, transparent ${result.interpretation.overallScore}%)` }"
              />
              <div class="relative z-10 text-center">
                <div class="font-display text-5xl md:text-6xl" :class="getScoreColor(result.interpretation.overallScore)">
                  {{ result.interpretation.overallScore }}
                </div>
                <div class="font-mono text-xs text-silver/60">时机指数</div>
              </div>
            </div>
            <div
              class="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center text-white text-xl animate-breathing"
            >
              {{ scenarioIcon }}
            </div>
          </div>
        </div>

        <div class="max-w-3xl mx-auto mb-12">
          <div class="p-6 rounded-xl bg-glass border border-gold/20 mb-6">
            <p class="font-body text-lg text-silver/80 leading-relaxed text-center">
              {{ result.interpretation.overallDescription }}
            </p>
          </div>

          <div class="p-6 rounded-xl bg-gradient-to-r from-purple/10 via-purple/5 to-transparent border border-purple/20">
            <h4 class="font-display text-lg text-purple mb-4 flex items-center gap-2">
              <span>✦</span> 核心能量模式
            </h4>
            <p class="font-body text-silver/80 leading-relaxed whitespace-pre-line">
              {{ result.interpretation.coreEnergy }}
            </p>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 class="font-display text-xl text-gold mb-6 text-center tracking-wider">
              关系能量图
            </h3>
            <GeometryChart
              :geometry="result.geometry"
              :core-numbers="{
                lifePath: result.yourNumbers.lifePath,
                destiny: result.theirNumbers.destiny,
                soul: result.yourNumbers.soul,
                personality: result.theirNumbers.personality
              }"
            />
            
            <div class="grid grid-cols-2 gap-4 mt-8">
              <div class="p-4 rounded-lg bg-gold/10 border border-gold/20">
                <div class="font-display text-sm text-gold/70 mb-2 text-center">{{ result.input.yourName }}</div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-center">
                    <div class="font-display text-2xl text-gold">{{ result.yourNumbers.lifePath }}</div>
                    <div class="text-xs text-silver/60">生命路径</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-gold">{{ result.yourNumbers.destiny }}</div>
                    <div class="text-xs text-silver/60">命运</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-purple">{{ result.yourNumbers.soul }}</div>
                    <div class="text-xs text-silver/60">灵魂</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-purple">{{ result.yourNumbers.personality }}</div>
                    <div class="text-xs text-silver/60">个性</div>
                  </div>
                </div>
              </div>
              <div class="p-4 rounded-lg bg-purple/10 border border-purple/20">
                <div class="font-display text-sm text-purple/70 mb-2 text-center">{{ result.input.theirName }}</div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-center">
                    <div class="font-display text-2xl text-gold">{{ result.theirNumbers.lifePath }}</div>
                    <div class="text-xs text-silver/60">生命路径</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-gold">{{ result.theirNumbers.destiny }}</div>
                    <div class="text-xs text-silver/60">命运</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-purple">{{ result.theirNumbers.soul }}</div>
                    <div class="text-xs text-silver/60">灵魂</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-purple">{{ result.theirNumbers.personality }}</div>
                    <div class="text-xs text-silver/60">个性</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-display text-xl text-gold mb-6 text-center tracking-wider">
              能量模式概览
            </h3>
            <div class="space-y-4">
              <div
                v-for="pattern in result.interpretation.energyPatterns"
                :key="pattern.name"
                class="p-4 rounded-lg bg-glass/50 border border-silver/20"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="font-display text-sm text-silver/80">{{ pattern.name }}</span>
                  <div class="flex items-center gap-3">
                    <span :class="getTrendColor(pattern.trend)" class="text-xl">
                      {{ getTrendIcon(pattern.trend) }}
                    </span>
                    <span class="font-display text-lg" :class="getScoreColor(pattern.value)">
                      {{ pattern.value }}
                    </span>
                  </div>
                </div>
                <div class="relative h-2 bg-silver/20 rounded-full overflow-hidden mb-3">
                  <div
                    class="absolute h-full rounded-full transition-all duration-1000"
                    :class="getScoreBg(pattern.value)"
                    :style="{ width: `${pattern.value}%` }"
                  />
                </div>
                <p class="font-body text-sm text-silver/70">
                  {{ pattern.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="result.interpretation.warning"
          class="max-w-3xl mx-auto mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
        >
          <p class="font-body text-sm text-red-400 flex items-start gap-2">
            <span>⚠</span>
            {{ result.interpretation.warning }}
          </p>
        </div>

        <div class="mb-12">
          <div class="flex flex-wrap justify-center gap-2 mb-8 border-b border-silver/20">
            <button
              @click="activeTab = 'overview'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'overview',
                'text-silver/70 hover:text-silver': activeTab !== 'overview'
              }"
            >
              总览建议
              <div
                v-if="activeTab === 'overview'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'stages'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'stages',
                'text-silver/70 hover:text-silver': activeTab !== 'stages'
              }"
            >
              ☀ 阶段建议
              <div
                v-if="activeTab === 'stages'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'risks'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'risks',
                'text-silver/70 hover:text-silver': activeTab !== 'risks'
              }"
            >
              ⚠ 风险预警
              <div
                v-if="activeTab === 'risks'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'windows'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'windows',
                'text-silver/70 hover:text-silver': activeTab !== 'windows'
              }"
            >
              ✦ 行动窗口
              <div
                v-if="activeTab === 'windows'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'energy'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'energy',
                'text-silver/70 hover:text-silver': activeTab !== 'energy'
              }"
            >
              ⚡ 能量模式
              <div
                v-if="activeTab === 'energy'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'advice'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'advice',
                'text-silver/70 hover:text-silver': activeTab !== 'advice'
              }"
            >
              ♡ 宜与忌
              <div
                v-if="activeTab === 'advice'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'trace'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'trace',
                'text-silver/70 hover:text-silver': activeTab !== 'trace'
              }"
            >
              数据溯源
              <div
                v-if="activeTab === 'trace'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
          </div>
          
          <transition
            mode="out-in"
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="opacity-0 translate-y-4"
            leave-to-class="opacity-0 -translate-y-4"
          >
            <template v-if="activeTab === 'trace'" key="trace">
              <CalculationTrace :trace="result.calculationTrace" />
            </template>

            <div v-else-if="activeTab === 'overview'" key="overview" class="max-w-3xl mx-auto">
              <div class="p-6 rounded-xl bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border border-gold/20 mb-8">
                <h4 class="font-display text-lg text-gold mb-4 flex items-center gap-2">
                  <span>✧</span> 最终建议
                </h4>
                <p class="font-body text-lg text-silver/80 leading-relaxed">
                  {{ result.interpretation.finalAdvice }}
                </p>
              </div>

              <div class="p-6 rounded-xl bg-silver/5 border border-silver/20">
                <h4 class="font-display text-lg text-gold mb-4">关键词</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="kw in result.interpretation.keywords"
                    :key="kw"
                    class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 text-sm font-mono border border-gold/20"
                  >
                    {{ kw }}
                  </span>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'stages'" key="stages" class="max-w-4xl mx-auto">
              <div class="space-y-6">
                <div
                  v-for="stage in result.interpretation.stages"
                  :key="stage.stage"
                  class="p-6 rounded-xl bg-gradient-to-br from-gold/5 to-transparent border border-gold/20 relative overflow-hidden"
                >
                  <div class="absolute top-0 left-0 w-1 h-full" :class="getScoreBg(stage.energy)" />
                  
                  <div class="flex items-start justify-between mb-4">
                    <div>
                      <div class="flex items-center gap-3 mb-2">
                        <span class="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-display">
                          {{ stage.stage }}
                        </span>
                        <h3 class="font-display text-2xl text-gold">{{ stage.name }}</h3>
                      </div>
                      <div class="font-mono text-sm text-silver/60">{{ stage.period }}</div>
                    </div>
                    <div class="text-right">
                      <div class="font-display text-3xl" :class="getScoreColor(stage.energy)">
                        {{ stage.energy }}
                      </div>
                      <div class="text-xs text-silver/60">能量值</div>
                    </div>
                  </div>

                  <p class="font-body text-sm text-gold/70 italic mb-4">
                    「{{ stage.vibe }}」
                  </p>

                  <p class="font-body text-silver/80 mb-6">
                    {{ stage.description }}
                  </p>

                  <div>
                    <h4 class="font-display text-sm text-gold mb-3">行动建议：</h4>
                    <ul class="space-y-2">
                      <li
                        v-for="(action, index) in stage.actions"
                        :key="index"
                        class="flex items-start gap-3 font-body text-silver/80"
                      >
                        <span class="text-gold mt-1">•</span>
                        {{ action }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'risks'" key="risks" class="max-w-4xl mx-auto">
              <div class="space-y-6">
                <div
                  v-for="(risk, index) in (result.interpretation.risks as RiskWarning[])"
                  :key="index"
                  class="p-6 rounded-xl bg-glass/50 border border-silver/20"
                >
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <span
                        class="w-10 h-10 rounded-full flex items-center justify-center text-white font-display"
                        :class="getRiskLevelInfo(risk.level).bg"
                      >
                        ⚠
                      </span>
                      <div>
                        <h3 class="font-display text-xl text-silver">{{ risk.aspect }}</h3>
                        <span
                          class="text-sm font-mono"
                          :class="getRiskLevelInfo(risk.level).color"
                        >
                          {{ getRiskLevelInfo(risk.level).label }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="font-display text-sm text-red-400 mb-2">风险描述：</h4>
                      <p class="font-body text-silver/70">{{ risk.description }}</p>
                    </div>
                    <div>
                      <h4 class="font-display text-sm text-green-400 mb-2">应对策略：</h4>
                      <p class="font-body text-silver/70">{{ risk.mitigation }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'windows'" key="windows" class="max-w-4xl mx-auto">
              <div class="space-y-6">
                <div
                  v-for="(window, index) in (result.interpretation.actionWindows as ActionWindow[])"
                  :key="index"
                  class="p-6 rounded-xl relative overflow-hidden"
                  :class="getWindowTypeInfo(window.type).bg + ' border border-silver/20'"
                >
                  <div class="absolute top-4 right-4">
                    <span
                      class="px-3 py-1 rounded-full text-sm font-mono"
                      :class="getWindowTypeInfo(window.type).color + ' bg-silver/10'"
                    >
                      {{ getWindowTypeInfo(window.type).icon }} {{ getWindowTypeInfo(window.type).label }}
                    </span>
                  </div>

                  <div class="flex items-start justify-between mb-4 pr-32">
                    <div>
                      <h3 class="font-display text-xl text-gold mb-2">{{ window.name }}</h3>
                      <div class="font-mono text-sm text-silver/60">
                        {{ window.startDate }} — {{ window.endDate }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-display text-3xl" :class="getScoreColor(window.energyScore)">
                        {{ window.energyScore }}
                      </div>
                      <div class="text-xs text-silver/60">能量值</div>
                    </div>
                  </div>

                  <p class="font-body text-silver/80 mb-6">
                    {{ window.description }}
                  </p>

                  <div>
                    <h4 class="font-display text-sm text-gold mb-3">推荐行动：</h4>
                    <ul class="space-y-2">
                      <li
                        v-for="(action, actIndex) in window.recommendedActions"
                        :key="actIndex"
                        class="flex items-start gap-3 font-body text-silver/80"
                      >
                        <span :class="getWindowTypeInfo(window.type).color" class="mt-1">
                          {{ getWindowTypeInfo(window.type).icon }}
                        </span>
                        {{ action }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'energy'" key="energy" class="max-w-4xl mx-auto">
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="(pattern, index) in result.interpretation.energyPatterns"
                  :key="index"
                  class="p-6 rounded-xl bg-gold/5 border border-gold/20 text-center"
                >
                  <div class="text-4xl mb-3" :class="getTrendColor(pattern.trend)">
                    {{ getTrendIcon(pattern.trend) }}
                  </div>
                  <div class="font-display text-4xl mb-2" :class="getScoreColor(pattern.value)">
                    {{ pattern.value }}
                  </div>
                  <h4 class="font-display text-lg text-gold mb-2">{{ pattern.name }}</h4>
                  <p class="font-body text-sm text-silver/70">
                    {{ pattern.description }}
                  </p>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'advice'" key="advice" class="max-w-4xl mx-auto">
              <div class="grid md:grid-cols-2 gap-8">
                <div class="p-6 rounded-xl bg-green-500/10 border border-green-500/20">
                  <h3 class="font-display text-2xl text-green-400 mb-6 text-center">✓ 应该做</h3>
                  <ul class="space-y-4">
                    <li
                      v-for="(item, index) in result.interpretation.doList"
                      :key="index"
                      class="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/10"
                    >
                      <span class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-sm flex-shrink-0">
                        ✓
                      </span>
                      <span class="font-body text-silver/80">{{ item }}</span>
                    </li>
                  </ul>
                </div>

                <div class="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
                  <h3 class="font-display text-2xl text-red-400 mb-6 text-center">✕ 不要做</h3>
                  <ul class="space-y-4">
                    <li
                      v-for="(item, index) in result.interpretation.dontList"
                      :key="index"
                      class="flex items-start gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/10"
                    >
                      <span class="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-sm flex-shrink-0">
                        ✕
                      </span>
                      <span class="font-body text-silver/80">{{ item }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="mt-12 p-6 rounded-xl bg-silver/5 border border-silver/20">
                <h4 class="font-display text-lg text-gold mb-4">温馨提示</h4>
                <p class="font-body text-silver/70 leading-relaxed">
                  算法揭示的是可能性和趋势，而非定局。爱情需要真诚和努力，时机只是其中的一部分。
                  相信自己的感受，尊重对方的意愿，用真诚的心去经营这段关系。
                  无论结果如何，每一次真诚的付出都是成长。
                  记住，最好的时机就是「现在」——当你准备好了，就勇敢去爱吧。
                </p>
              </div>
            </div>
          </transition>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MysticButton variant="primary" size="lg" @click="newLoveTiming">
            ♥ 新的爱情时机
          </MysticButton>
          <MysticButton variant="secondary" size="lg" @click="openShareModal">
            ✧ 生成分享卡
          </MysticButton>
          <MysticButton variant="secondary" size="lg" @click="goToArchive">
            ☰ 查看档案
          </MysticButton>
        </div>
      </div>
    </template>

    <ShareCardModal
      :show="showShareModal"
      :card-data="shareCardData"
      @close="closeShareModal"
    />
  </div>
</template>
