<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCareerChoiceStore } from '@/stores/careerChoice'
import GeometryChart from '@/components/result/GeometryChart.vue'
import CalculationTrace from '@/components/result/CalculationTrace.vue'
import MysticButton from '@/components/common/MysticButton.vue'
import type { CareerChoiceComparison } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useCareerChoiceStore()
const activeTab = ref<'overview' | 'pathA' | 'pathB' | 'comparison' | 'action' | 'trace'>('overview')
const isLoading = ref(true)
const notFound = ref(false)

const result = computed(() => store.currentResult)

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

const getScoreLabel = (score: number) => {
  if (score >= 85) return { label: '极高', color: 'text-green-400' }
  if (score >= 75) return { label: '高', color: 'text-gold' }
  if (score >= 65) return { label: '中等', color: 'text-yellow-500' }
  if (score >= 55) return { label: '一般', color: 'text-orange-400' }
  return { label: '较低', color: 'text-red-400' }
}

const getRiskLabel = (risk: number) => {
  if (risk >= 70) return { label: '高风险', color: 'text-red-400' }
  if (risk >= 50) return { label: '中等风险', color: 'text-orange-400' }
  if (risk >= 30) return { label: '低风险', color: 'text-yellow-500' }
  return { label: '风险极低', color: 'text-green-400' }
}

const averageScoreA = computed(() => {
  if (!result.value) return 0
  const comparisons = result.value.interpretation.comparisons as CareerChoiceComparison[]
  const total = comparisons.reduce((sum, c) => sum + c.optionAScore, 0)
  return Math.round(total / comparisons.length)
})

const averageScoreB = computed(() => {
  if (!result.value) return 0
  const comparisons = result.value.interpretation.comparisons as CareerChoiceComparison[]
  const total = comparisons.reduce((sum, c) => sum + c.optionBScore, 0)
  return Math.round(total / comparisons.length)
})

const betterOption = computed(() => {
  return averageScoreA.value >= averageScoreB.value ? 'A' : 'B'
})

const newCareerChoice = () => {
  store.reset()
  router.push('/career-choice')
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
        <div class="text-6xl mb-6">⚖</div>
        <h2 class="font-display text-2xl text-gold mb-4 tracking-wider">记录未找到</h2>
        <p class="font-body text-silver/70 mb-8">
          该职业抉择记录可能已被清除或不存在。
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
              {{ result.input.name }}
            </span>
            <span class="text-gold/60">⚖</span>
            <span class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 font-mono">
              {{ result.input.optionA.name }}
            </span>
            <span class="text-silver/50">vs</span>
            <span class="px-3 py-1 rounded-full bg-purple/10 text-purple/80 border border-purple/20 font-mono">
              {{ result.input.optionB.name }}
            </span>
          </div>

          <div class="flex justify-center items-center gap-8 md:gap-16">
            <div class="text-center">
              <div class="relative inline-block">
                <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gold/30 flex items-center justify-center relative overflow-hidden">
                  <div
                    class="absolute inset-0 flex items-end"
                    :style="{ background: `linear-gradient(to top, ${averageScoreA >= 75 ? 'rgba(212, 175, 55, 0.3)' : averageScoreA >= 65 ? 'rgba(234, 179, 8, 0.3)' : 'rgba(249, 115, 22, 0.3)'} ${averageScoreA}%, transparent ${averageScoreA}%)` }"
                  />
                  <div class="relative z-10 text-center">
                    <div class="font-display text-4xl md:text-5xl" :class="getScoreColor(averageScoreA)">
                      {{ averageScoreA }}
                    </div>
                    <div class="font-mono text-xs text-silver/60">综合得分</div>
                  </div>
                </div>
                <div
                  v-if="betterOption === 'A'"
                  class="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white text-lg"
                >
                  ✓
                </div>
              </div>
              <div class="mt-3 font-display text-lg text-gold">
                {{ result.input.optionA.name }}
              </div>
            </div>

            <div class="text-4xl text-gold/40 font-display">VS</div>

            <div class="text-center">
              <div class="relative inline-block">
                <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-purple/30 flex items-center justify-center relative overflow-hidden">
                  <div
                    class="absolute inset-0 flex items-end"
                    :style="{ background: `linear-gradient(to top, ${averageScoreB >= 75 ? 'rgba(168, 85, 247, 0.3)' : averageScoreB >= 65 ? 'rgba(192, 132, 252, 0.3)' : 'rgba(251, 146, 60, 0.3)'} ${averageScoreB}%, transparent ${averageScoreB}%)` }"
                  />
                  <div class="relative z-10 text-center">
                    <div class="font-display text-4xl md:text-5xl" :class="getScoreColor(averageScoreB)">
                      {{ averageScoreB }}
                    </div>
                    <div class="font-mono text-xs text-silver/60">综合得分</div>
                  </div>
                </div>
                <div
                  v-if="betterOption === 'B'"
                  class="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-purple flex items-center justify-center text-white text-lg"
                >
                  ✓
                </div>
              </div>
              <div class="mt-3 font-display text-lg text-purple">
                {{ result.input.optionB.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="max-w-3xl mx-auto mb-12 p-6 rounded-xl bg-glass border border-gold/20">
          <p class="font-body text-lg text-silver/80 leading-relaxed text-center">
            {{ result.interpretation.overallDescription }}
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 class="font-display text-xl text-gold mb-6 text-center tracking-wider">
              抉择能量图
            </h3>
            <GeometryChart
              :geometry="result.geometry"
              :core-numbers="{
                lifePath: result.interpretation.pathA.coreNumbers.lifePath,
                destiny: result.interpretation.pathB.coreNumbers.destiny,
                soul: result.interpretation.pathA.coreNumbers.soul,
                personality: result.interpretation.pathB.coreNumbers.personality
              }"
            />
            
            <div class="grid grid-cols-2 gap-4 mt-8">
              <div class="p-4 rounded-lg bg-gold/10 border border-gold/20">
                <div class="font-display text-sm text-gold/70 mb-2 text-center">{{ result.input.optionA.name }}</div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-center">
                    <div class="font-display text-2xl text-gold">{{ result.interpretation.pathA.coreNumbers.lifePath }}</div>
                    <div class="text-xs text-silver/60">生命路径</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-gold">{{ result.interpretation.pathA.coreNumbers.destiny }}</div>
                    <div class="text-xs text-silver/60">命运</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-purple">{{ result.interpretation.pathA.coreNumbers.soul }}</div>
                    <div class="text-xs text-silver/60">灵魂</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-purple">{{ result.interpretation.pathA.coreNumbers.personality }}</div>
                    <div class="text-xs text-silver/60">个性</div>
                  </div>
                </div>
              </div>
              <div class="p-4 rounded-lg bg-purple/10 border border-purple/20">
                <div class="font-display text-sm text-purple/70 mb-2 text-center">{{ result.input.optionB.name }}</div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-center">
                    <div class="font-display text-2xl text-gold">{{ result.interpretation.pathB.coreNumbers.lifePath }}</div>
                    <div class="text-xs text-silver/60">生命路径</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-gold">{{ result.interpretation.pathB.coreNumbers.destiny }}</div>
                    <div class="text-xs text-silver/60">命运</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-purple">{{ result.interpretation.pathB.coreNumbers.soul }}</div>
                    <div class="text-xs text-silver/60">灵魂</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-purple">{{ result.interpretation.pathB.coreNumbers.personality }}</div>
                    <div class="text-xs text-silver/60">个性</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-display text-xl text-gold mb-6 text-center tracking-wider">
              核心指标对比
            </h3>
            <div class="space-y-4">
              <div
                v-for="comparison in result.interpretation.comparisons as CareerChoiceComparison[]"
                :key="comparison.aspect"
                class="p-4 rounded-lg bg-glass/50 border border-silver/20"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="font-display text-sm text-silver/80">{{ comparison.aspect }}</span>
                  <div class="flex items-center gap-3">
                    <span class="font-display text-lg" :class="getScoreColor(comparison.optionAScore)">
                      {{ comparison.optionAScore }}
                    </span>
                    <span class="text-silver/40">—</span>
                    <span class="font-display text-lg" :class="getScoreColor(comparison.optionBScore)">
                      {{ comparison.optionBScore }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2 mb-3">
                  <div class="flex-1 h-2 bg-silver/20 rounded-full overflow-hidden flex">
                    <div
                      class="h-full rounded-l-full transition-all duration-1000"
                      :class="getScoreBg(comparison.optionAScore)"
                      :style="{ width: `${comparison.optionAScore}%` }"
                    />
                    <div
                      class="h-full rounded-r-full transition-all duration-1000"
                      :class="comparison.optionBScore >= comparison.optionAScore ? 'bg-purple' : 'bg-purple/50'"
                      :style="{ width: `${comparison.optionBScore}%`, marginLeft: comparison.optionAScore + comparison.optionBScore > 100 ? '-20px' : '0' }"
                    />
                  </div>
                </div>
                <p class="font-body text-sm text-silver/70">
                  {{ comparison.description }}
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
              @click="activeTab = 'pathA'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'pathA',
                'text-silver/70 hover:text-silver': activeTab !== 'pathA'
              }"
            >
              ☽ {{ result.input.optionA.name }}
              <div
                v-if="activeTab === 'pathA'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'pathB'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-purple': activeTab === 'pathB',
                'text-silver/70 hover:text-silver': activeTab !== 'pathB'
              }"
            >
              ☾ {{ result.input.optionB.name }}
              <div
                v-if="activeTab === 'pathB'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple"
              />
            </button>
            <button
              @click="activeTab = 'comparison'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'comparison',
                'text-silver/70 hover:text-silver': activeTab !== 'comparison'
              }"
            >
              ⚖ 详细对照
              <div
                v-if="activeTab === 'comparison'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'action'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'action',
                'text-silver/70 hover:text-silver': activeTab !== 'action'
              }"
            >
              ➤ 行动指南
              <div
                v-if="activeTab === 'action'"
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
                  <span>✧</span> 最终推荐
                </h4>
                <p class="font-body text-lg text-silver/80 leading-relaxed">
                  {{ result.interpretation.finalRecommendation }}
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

            <div v-else-if="activeTab === 'pathA'" key="pathA" class="max-w-4xl mx-auto">
              <div class="p-6 rounded-xl bg-gradient-to-br from-gold/5 to-transparent border border-gold/20 mb-6">
                <h3 class="font-display text-2xl text-gold mb-4">{{ result.input.optionA.name }} · 路径分析</h3>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div class="text-center p-3 rounded-lg bg-gold/10">
                    <div class="font-display text-3xl" :class="getScoreColor(result.interpretation.pathA.suitability)">
                      {{ result.interpretation.pathA.suitability }}
                    </div>
                    <div class="text-xs text-silver/60 mt-1">适合度</div>
                  </div>
                  <div class="text-center p-3 rounded-lg bg-gold/10">
                    <div class="font-display text-3xl" :class="getScoreColor(result.interpretation.pathA.energyLevel)">
                      {{ result.interpretation.pathA.energyLevel }}
                    </div>
                    <div class="text-xs text-silver/60 mt-1">能量消耗</div>
                  </div>
                  <div class="text-center p-3 rounded-lg bg-gold/10">
                    <div class="font-display text-3xl" :class="getScoreColor(result.interpretation.pathA.growthPotential)">
                      {{ result.interpretation.pathA.growthPotential }}
                    </div>
                    <div class="text-xs text-silver/60 mt-1">成长潜力</div>
                  </div>
                  <div class="text-center p-3 rounded-lg bg-gold/10">
                    <div class="font-display text-3xl" :class="getRiskLabel(result.interpretation.pathA.riskLevel).color">
                      {{ result.interpretation.pathA.riskLevel }}
                    </div>
                    <div class="text-xs text-silver/60 mt-1">风险等级</div>
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 class="font-display text-lg text-green-400 mb-4 flex items-center gap-2">
                      <span>✓</span> 路径优势
                    </h4>
                    <ul class="space-y-2">
                      <li
                        v-for="(adv, index) in result.interpretation.pathA.advantages"
                        :key="index"
                        class="flex items-start gap-3 font-body text-silver/80"
                      >
                        <span class="text-green-400 mt-1">•</span>
                        {{ adv }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-display text-lg text-red-400 mb-4 flex items-center gap-2">
                      <span>⚠</span> 需要付出的代价
                    </h4>
                    <ul class="space-y-2">
                      <li
                        v-for="(cost, index) in result.interpretation.pathA.costs"
                        :key="index"
                        class="flex items-start gap-3 font-body text-silver/80"
                      >
                        <span class="text-red-400 mt-1">•</span>
                        {{ cost }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="space-y-4">
                  <h4 class="font-display text-lg text-gold mb-4">时间线展望</h4>
                  <div class="p-4 rounded-lg bg-silver/5 border border-silver/20">
                    <div class="font-display text-sm text-gold/80 mb-2">短期 · 0-6个月</div>
                    <p class="font-body text-silver/70">{{ result.interpretation.pathA.timeline.shortTerm }}</p>
                  </div>
                  <div class="p-4 rounded-lg bg-silver/5 border border-silver/20">
                    <div class="font-display text-sm text-gold/80 mb-2">中期 · 1-2年</div>
                    <p class="font-body text-silver/70">{{ result.interpretation.pathA.timeline.mediumTerm }}</p>
                  </div>
                  <div class="p-4 rounded-lg bg-silver/5 border border-silver/20">
                    <div class="font-display text-sm text-gold/80 mb-2">长期 · 3-5年以上</div>
                    <p class="font-body text-silver/70">{{ result.interpretation.pathA.timeline.longTerm }}</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="indicator in result.interpretation.pathA.keyIndicators"
                  :key="indicator.name"
                  class="p-4 rounded-lg bg-gold/5 border border-gold/20 text-center"
                >
                  <div class="font-display text-2xl" :class="getScoreColor(indicator.value)">
                    {{ indicator.value }}
                  </div>
                  <div class="font-display text-sm text-gold/80 mt-1">{{ indicator.name }}</div>
                  <div class="text-xs text-silver/60 mt-1">{{ indicator.description }}</div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'pathB'" key="pathB" class="max-w-4xl mx-auto">
              <div class="p-6 rounded-xl bg-gradient-to-br from-purple/5 to-transparent border border-purple/20 mb-6">
                <h3 class="font-display text-2xl text-purple mb-4">{{ result.input.optionB.name }} · 路径分析</h3>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div class="text-center p-3 rounded-lg bg-purple/10">
                    <div class="font-display text-3xl" :class="getScoreColor(result.interpretation.pathB.suitability)">
                      {{ result.interpretation.pathB.suitability }}
                    </div>
                    <div class="text-xs text-silver/60 mt-1">适合度</div>
                  </div>
                  <div class="text-center p-3 rounded-lg bg-purple/10">
                    <div class="font-display text-3xl" :class="getScoreColor(result.interpretation.pathB.energyLevel)">
                      {{ result.interpretation.pathB.energyLevel }}
                    </div>
                    <div class="text-xs text-silver/60 mt-1">能量消耗</div>
                  </div>
                  <div class="text-center p-3 rounded-lg bg-purple/10">
                    <div class="font-display text-3xl" :class="getScoreColor(result.interpretation.pathB.growthPotential)">
                      {{ result.interpretation.pathB.growthPotential }}
                    </div>
                    <div class="text-xs text-silver/60 mt-1">成长潜力</div>
                  </div>
                  <div class="text-center p-3 rounded-lg bg-purple/10">
                    <div class="font-display text-3xl" :class="getRiskLabel(result.interpretation.pathB.riskLevel).color">
                      {{ result.interpretation.pathB.riskLevel }}
                    </div>
                    <div class="text-xs text-silver/60 mt-1">风险等级</div>
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 class="font-display text-lg text-green-400 mb-4 flex items-center gap-2">
                      <span>✓</span> 路径优势
                    </h4>
                    <ul class="space-y-2">
                      <li
                        v-for="(adv, index) in result.interpretation.pathB.advantages"
                        :key="index"
                        class="flex items-start gap-3 font-body text-silver/80"
                      >
                        <span class="text-green-400 mt-1">•</span>
                        {{ adv }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-display text-lg text-red-400 mb-4 flex items-center gap-2">
                      <span>⚠</span> 需要付出的代价
                    </h4>
                    <ul class="space-y-2">
                      <li
                        v-for="(cost, index) in result.interpretation.pathB.costs"
                        :key="index"
                        class="flex items-start gap-3 font-body text-silver/80"
                      >
                        <span class="text-red-400 mt-1">•</span>
                        {{ cost }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="space-y-4">
                  <h4 class="font-display text-lg text-purple mb-4">时间线展望</h4>
                  <div class="p-4 rounded-lg bg-silver/5 border border-silver/20">
                    <div class="font-display text-sm text-purple/80 mb-2">短期 · 0-6个月</div>
                    <p class="font-body text-silver/70">{{ result.interpretation.pathB.timeline.shortTerm }}</p>
                  </div>
                  <div class="p-4 rounded-lg bg-silver/5 border border-silver/20">
                    <div class="font-display text-sm text-purple/80 mb-2">中期 · 1-2年</div>
                    <p class="font-body text-silver/70">{{ result.interpretation.pathB.timeline.mediumTerm }}</p>
                  </div>
                  <div class="p-4 rounded-lg bg-silver/5 border border-silver/20">
                    <div class="font-display text-sm text-purple/80 mb-2">长期 · 3-5年以上</div>
                    <p class="font-body text-silver/70">{{ result.interpretation.pathB.timeline.longTerm }}</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="indicator in result.interpretation.pathB.keyIndicators"
                  :key="indicator.name"
                  class="p-4 rounded-lg bg-purple/5 border border-purple/20 text-center"
                >
                  <div class="font-display text-2xl" :class="getScoreColor(indicator.value)">
                    {{ indicator.value }}
                  </div>
                  <div class="font-display text-sm text-purple/80 mt-1">{{ indicator.name }}</div>
                  <div class="text-xs text-silver/60 mt-1">{{ indicator.description }}</div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'comparison'" key="comparison" class="max-w-4xl mx-auto">
              <div class="space-y-6">
                <div
                  v-for="comparison in result.interpretation.comparisons as CareerChoiceComparison[]"
                  :key="comparison.aspect"
                  class="p-6 rounded-xl bg-glass/50 border border-silver/20"
                >
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="font-display text-xl text-gold">{{ comparison.aspect }}</h4>
                    <div class="flex items-center gap-4">
                      <div class="text-right">
                        <div class="font-display text-2xl" :class="getScoreColor(comparison.optionAScore)">
                          {{ comparison.optionAScore }}
                        </div>
                        <div class="text-xs text-silver/50">{{ result.input.optionA.name }}</div>
                      </div>
                      <div class="text-silver/40 text-xl">⚖</div>
                      <div class="text-left">
                        <div class="font-display text-2xl" :class="getScoreColor(comparison.optionBScore)">
                          {{ comparison.optionBScore }}
                        </div>
                        <div class="text-xs text-silver/50">{{ result.input.optionB.name }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="relative h-3 bg-silver/20 rounded-full overflow-hidden mb-4">
                    <div class="absolute left-0 top-0 bottom-0 flex items-center justify-end pr-2" :style="{ width: '50%' }">
                      <div
                        class="h-full rounded-l-full"
                        :class="getScoreBg(comparison.optionAScore)"
                        :style="{ width: `${comparison.optionAScore}%` }"
                      />
                    </div>
                    <div class="absolute right-0 top-0 bottom-0 flex items-center justify-start pl-2" :style="{ width: '50%' }">
                      <div
                        class="h-full rounded-r-full ml-auto"
                        :class="comparison.optionBScore >= comparison.optionAScore ? 'bg-purple' : 'bg-purple/50'"
                        :style="{ width: `${comparison.optionBScore}%` }"
                      />
                    </div>
                    <div class="absolute left-1/2 top-0 bottom-0 w-px bg-silver/40 transform -translate-x-1/2" />
                  </div>

                  <p class="font-body text-silver/80 mb-4">
                    {{ comparison.description }}
                  </p>

                  <div class="p-4 rounded-lg bg-gold/10 border border-gold/20">
                    <span class="text-gold text-sm font-display">建议：</span>
                    <span class="font-body text-sm text-silver/70">{{ comparison.recommendation }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'action'" key="action" class="max-w-3xl mx-auto">
              <div class="p-6 rounded-xl bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border border-gold/20 mb-8">
                <h4 class="font-display text-lg text-gold mb-6 flex items-center gap-2">
                  <span>➤</span> 行动步骤建议
                </h4>
                <ul class="space-y-4">
                  <li
                    v-for="(step, index) in result.interpretation.actionSteps"
                    :key="index"
                    class="flex items-start gap-4 p-4 rounded-lg bg-silver/5 border border-silver/10"
                  >
                    <span class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-display flex-shrink-0">
                      {{ index + 1 }}
                    </span>
                    <span class="font-body text-silver/80 leading-relaxed pt-1">
                      {{ step }}
                    </span>
                  </li>
                </ul>
              </div>

              <div class="p-6 rounded-xl bg-silver/5 border border-silver/20">
                <h4 class="font-display text-lg text-gold mb-4">温馨提示</h4>
                <p class="font-body text-silver/70 leading-relaxed">
                  算法揭示的是可能性，而非定局。每一个选择都需要你用行动去赋予它意义。
                  记住，真正重要的不是你选择了哪条路，而是你在那条路上如何前行。
                  相信自己的判断，勇敢迈出第一步，剩下的交给时间和努力。
                  无论你做出怎样的选择，那都是当下最好的选择。
                </p>
              </div>
            </div>
          </transition>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MysticButton variant="primary" size="lg" @click="newCareerChoice">
            ⚖ 新的抉择
          </MysticButton>
          <MysticButton variant="secondary" size="lg" @click="goToArchive">
            ☰ 查看档案
          </MysticButton>
        </div>
      </div>
    </template>
  </div>
</template>
