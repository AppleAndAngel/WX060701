<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useYearlyStore } from '@/stores/yearly'
import GeometryChart from '@/components/result/GeometryChart.vue'
import CalculationTrace from '@/components/result/CalculationTrace.vue'
import MysticButton from '@/components/common/MysticButton.vue'
import { yearNumberMeanings } from '@/algorithms/yearly'

const route = useRoute()
const router = useRouter()
const store = useYearlyStore()
const activeTab = ref<'overview' | 'phases' | 'months' | 'trace'>('overview')
const expandedMonth = ref<number | null>(null)
const isLoading = ref(true)
const notFound = ref(false)

const result = computed(() => store.currentResult)

const yearMeaning = computed(() => {
  if (!result.value) return null
  return yearNumberMeanings[result.value.yearNumber] || yearNumberMeanings[9]
})

const loadResultData = () => {
  const id = route.params.id as string
  isLoading.value = true
  notFound.value = false
  
  if (store.currentResult?.id === id) {
    isLoading.value = false
    return
  }
  
  const loaded = store.loadResult(id)
  if (!loaded) {
    notFound.value = true
  }
  isLoading.value = false
}

onMounted(() => {
  loadResultData()
})

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      loadResultData()
    }
  }
)

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getMonthColorClass = (monthNumber: number) => {
  const colors: Record<number, string> = {
    1: 'bg-red-500/10 border-red-500/30 text-red-400',
    2: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
    3: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    4: 'bg-lime-500/10 border-lime-500/30 text-lime-400',
    5: 'bg-green-500/10 border-green-500/30 text-green-400',
    6: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    7: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
    8: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    9: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    10: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    11: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
    12: 'bg-purple-500/10 border-purple-500/30 text-purple-400'
  }
  return colors[monthNumber] || colors[9]
}

const getPhaseIcon = (phaseName: string) => {
  const icons: Record<string, string> = {
    '播种期': '🌱',
    '生长期': '🌿',
    '开花期': '🌸',
    '收获期': '🌾'
  }
  return icons[phaseName] || '✧'
}

const toggleMonth = (month: number) => {
  expandedMonth.value = expandedMonth.value === month ? null : month
}

const newDivination = () => {
  store.reset()
  router.push('/yearly')
}

const goToArchive = () => {
  router.push('/archive')
}

const goBack = () => {
  router.push('/yearly')
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
        <div class="text-6xl mb-6">☸</div>
        <h2 class="font-display text-2xl text-gold mb-4 tracking-wider">记录未找到</h2>
        <p class="font-body text-silver/70 mb-8">
          该流年占卜记录可能已被清除或不存在。
        </p>
        <div class="flex justify-center gap-4">
          <MysticButton @click="goBack">返回流年</MysticButton>
          <MysticButton variant="secondary" @click="goToArchive">查看档案</MysticButton>
        </div>
      </div>
    </div>
    
    <div v-else-if="!result || !yearMeaning" class="w-full h-full flex items-center justify-center px-6">
      <div class="text-center max-w-md">
        <div class="w-16 h-16 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p class="font-display text-gold tracking-wider">数据加载中...</p>
      </div>
    </div>
    
    <template v-else>
      <div class="max-w-6xl mx-auto px-6 py-12">
        <div class="text-center mb-12">
          <div class="font-mono text-xs text-silver/60 tracking-wider mb-4">
            {{ formatDate(result.createdAt) }}
          </div>
          
          <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <span class="text-lg">☸</span>
            <span class="font-display tracking-wider text-gold">{{ result.input.targetYear }} 年度流年</span>
          </div>
          
          <h1 class="font-display text-4xl md:text-6xl text-gradient-gold tracking-wider mb-4">
            {{ result.interpretation.title }}
          </h1>
          
          <div class="flex flex-wrap justify-center gap-3 text-sm mb-6">
            <span class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 font-mono">
              {{ result.input.name }}
            </span>
            <span class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 font-mono">
              {{ result.input.birthDate }}
            </span>
          </div>
          
          <div class="flex flex-wrap justify-center gap-2 mt-6">
            <span
              v-for="keyword in result.interpretation.coreKeywords"
              :key="keyword"
              class="px-4 py-1.5 text-sm font-display tracking-wider rounded-full bg-gold/10 text-gold border border-gold/30"
            >
              ✧ {{ keyword }}
            </span>
          </div>
        </div>
        
        <div class="grid lg:grid-cols-3 gap-8 mb-16">
          <div class="lg:col-span-1">
            <div class="sticky top-8">
              <div class="p-6 rounded-2xl bg-gradient-to-br from-gold/5 to-gold/0 border border-gold/20">
                <h3 class="font-display text-xl text-gold mb-6 text-center tracking-wider">
                  流年命盘
                </h3>
                
                <GeometryChart
                  :geometry="result.geometry"
                  :core-numbers="{
                    lifePath: result.lifePathNumber,
                    destiny: result.yearNumber,
                    soul: result.yearNumber,
                    personality: result.lifePathNumber
                  }"
                />
                
                <div class="grid grid-cols-2 gap-4 mt-8">
                  <div class="p-4 rounded-lg bg-silver/10 border border-silver/20 text-center">
                    <div class="font-display text-3xl text-gold mb-1">
                      {{ result.lifePathNumber }}
                    </div>
                    <div class="text-xs font-display tracking-wider text-silver/70">生命路径</div>
                  </div>
                  <div class="p-4 rounded-lg bg-gold/10 border border-gold/30 text-center">
                    <div class="font-display text-3xl text-gold mb-1">
                      {{ result.yearNumber }}
                    </div>
                    <div class="text-xs font-display tracking-wider text-gold/70">流年数字</div>
                  </div>
                </div>
                
                <div class="mt-6 p-4 rounded-lg bg-silver/5 border border-silver/20">
                  <div class="font-display text-sm text-gold mb-2">年度主题</div>
                  <div class="font-body text-silver/90 text-sm leading-relaxed">
                    {{ yearMeaning.theme }}
                  </div>
                  <div class="mt-3 text-xs text-silver/60 leading-relaxed">
                    {{ yearMeaning.essence }}
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col gap-3 mt-6">
                <MysticButton full-width @click="newDivination">
                  ✦ 新的流年占卜
                </MysticButton>
                <MysticButton full-width variant="secondary" @click="goToArchive">
                  ☰ 查看档案
                </MysticButton>
              </div>
            </div>
          </div>
          
          <div class="lg:col-span-2">
            <div class="flex gap-2 mb-8 border-b border-silver/20 overflow-x-auto pb-px">
              <button
                v-for="tab in [
                  { key: 'overview', label: '年度总览', icon: '☯' },
                  { key: 'phases', label: '阶段走势', icon: '◐' },
                  { key: 'months', label: '月度线索', icon: '☾' },
                  { key: 'trace', label: '计算溯源', icon: '∑' }
                ]"
                :key="tab.key"
                @click="activeTab = tab.key as any; scrollToTop()"
                class="flex-shrink-0 px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative flex items-center gap-2"
                :class="{
                  'text-gold': activeTab === tab.key,
                  'text-silver/70 hover:text-silver': activeTab !== tab.key
                }"
              >
                <span>{{ tab.icon }}</span>
                <span>{{ tab.label }}</span>
                <div
                  v-if="activeTab === tab.key"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
                />
              </button>
            </div>
            
            <transition
              mode="out-in"
              enter-active-class="transition-all duration-500 ease-out"
              leave-active-class="transition-all duration-300 ease-in"
              enter-from-class="opacity-0 translate-y-4"
              leave-to-class="opacity-0 -translate-y-4"
            >
              <div v-if="activeTab === 'overview'" key="overview">
                <div class="prose prose-invert max-w-none">
                  <div class="p-6 rounded-2xl bg-gradient-to-br from-gold/5 to-transparent border border-gold/20 mb-8">
                    <h3 class="font-display text-xl text-gold mb-4 flex items-center gap-2">
                      <span>☯</span>
                      年度总览
                    </h3>
                    <p class="font-body text-lg leading-relaxed text-silver/90">
                      {{ result.interpretation.overallDescription }}
                    </p>
                  </div>
                  
                  <div class="mb-8">
                    <h3 class="font-display text-xl text-gold mb-6 flex items-center gap-2">
                      <span>⚡</span>
                      年度核心关键词
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div
                        v-for="(keyword, idx) in result.interpretation.coreKeywords"
                        :key="keyword"
                        class="p-4 rounded-xl bg-silver/5 border border-silver/20 text-center hover:border-gold/40 transition-all duration-300 group"
                      >
                        <div class="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                          {{ ['✦', '✧', '❋', '✺'][idx % 4] }}
                        </div>
                        <div class="font-display text-lg text-gold">{{ keyword }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-8">
                    <h3 class="font-display text-xl text-gold mb-6 flex items-center gap-2">
                      <span>◐</span>
                      四季能量流转
                    </h3>
                    <div class="grid grid-cols-4 gap-3">
                      <div
                        v-for="(phase, idx) in result.interpretation.phases"
                        :key="phase.name"
                        class="p-4 rounded-xl text-center transition-all duration-300"
                        :class="[
                          idx === 0 ? 'bg-green-500/10 border border-green-500/30' :
                          idx === 1 ? 'bg-yellow-500/10 border border-yellow-500/30' :
                          idx === 2 ? 'bg-red-500/10 border border-red-500/30' :
                          'bg-blue-500/10 border border-blue-500/30'
                        ]"
                      >
                        <div class="text-3xl mb-2">{{ getPhaseIcon(phase.name) }}</div>
                        <div class="font-display text-sm mb-1"
                          :class="[
                            idx === 0 ? 'text-green-400' :
                            idx === 1 ? 'text-yellow-400' :
                            idx === 2 ? 'text-red-400' :
                            'text-blue-400'
                          ]"
                        >
                          {{ phase.name }}
                        </div>
                        <div class="text-xs text-silver/60">{{ phase.period }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 class="font-display text-xl text-gold mb-6 flex items-center gap-2">
                      <span>⚠</span>
                      关键提醒
                    </h3>
                    <div class="space-y-4">
                      <div
                        v-for="(reminder, idx) in result.interpretation.keyReminders"
                        :key="idx"
                        class="p-4 rounded-xl bg-silver/5 border border-silver/20 flex items-start gap-4"
                      >
                        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold font-mono text-sm">
                          {{ idx + 1 }}
                        </div>
                        <p class="font-body text-silver/90 leading-relaxed">
                          {{ reminder }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else-if="activeTab === 'phases'" key="phases">
                <div class="space-y-6">
                  <div
                    v-for="(phase, idx) in result.interpretation.phases"
                    :key="phase.name"
                    class="p-6 rounded-2xl transition-all duration-500"
                    :class="[
                      idx === 0 ? 'bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30' :
                      idx === 1 ? 'bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/30' :
                      idx === 2 ? 'bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/30' :
                      'bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30'
                    ]"
                  >
                    <div class="flex items-start gap-4 mb-4">
                      <div class="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                        :class="[
                          idx === 0 ? 'bg-green-500/20' :
                          idx === 1 ? 'bg-yellow-500/20' :
                          idx === 2 ? 'bg-red-500/20' :
                          'bg-blue-500/20'
                        ]"
                      >
                        {{ getPhaseIcon(phase.name) }}
                      </div>
                      <div class="flex-1">
                        <h3 class="font-display text-2xl mb-1"
                          :class="[
                            idx === 0 ? 'text-green-400' :
                            idx === 1 ? 'text-yellow-400' :
                            idx === 2 ? 'text-red-400' :
                            'text-blue-400'
                          ]"
                        >
                          {{ phase.name }}
                        </h3>
                        <div class="font-mono text-sm text-silver/60 mb-2">
                          {{ phase.period }}
                        </div>
                        <div class="font-body text-silver/90">
                          {{ phase.theme }}
                        </div>
                      </div>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 class="font-display text-sm text-gold mb-3 tracking-wider">
                          能量状态
                        </h4>
                        <div class="inline-block px-4 py-2 rounded-full bg-silver/10 border border-silver/20 text-silver/90">
                          {{ phase.energy }}
                        </div>
                      </div>
                      <div>
                        <h4 class="font-display text-sm text-gold mb-3 tracking-wider">
                          涵盖月份
                        </h4>
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="m in phase.months"
                            :key="m"
                            class="px-3 py-1 rounded-full text-xs font-mono bg-silver/10 text-silver/80 border border-silver/20"
                          >
                            {{ m }}月
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="mt-6">
                      <h4 class="font-display text-sm text-gold mb-3 tracking-wider">
                        核心关注点
                      </h4>
                      <div class="flex flex-wrap gap-3">
                        <span
                          v-for="focus in phase.focus"
                          :key="focus"
                          class="px-4 py-2 rounded-lg text-sm"
                          :class="[
                            idx === 0 ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                            idx === 1 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                            idx === 2 ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          ]"
                        >
                          ✧ {{ focus }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="p-6 rounded-2xl bg-gold/5 border border-gold/20">
                    <h4 class="font-display text-gold mb-3 flex items-center gap-2">
                      <span>💡</span>
                      年度节奏建议
                    </h4>
                    <p class="font-body text-silver/80 leading-relaxed">
                      遵循自然的四季节奏，在播种期明确目标，在生长期积极行动，
                      在开花期享受成果，在收获期总结沉淀。
                      每个阶段都有其独特的能量特质，顺势而为，便能事半功倍。
                    </p>
                  </div>
                </div>
              </div>
              
              <div v-else-if="activeTab === 'months'" key="months">
                <div class="mb-6 p-4 rounded-xl bg-silver/5 border border-silver/20">
                  <p class="font-body text-sm text-silver/70">
                    <span class="text-gold">提示：</span>
                    点击任意月份卡片，查看该月的详细运势解读，包括机遇、挑战和关键提醒。
                  </p>
                </div>
                
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div
                    v-for="month in result.interpretation.months"
                    :key="month.month"
                    class="rounded-xl border overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-gold/5"
                    :class="expandedMonth === month.month ? 'border-gold/50 bg-gold/5' : 'border-silver/20 bg-silver/5 hover:border-gold/30'"
                    @click="toggleMonth(month.month)"
                  >
                    <div class="p-4">
                      <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                          <div
                            class="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg border"
                            :class="getMonthColorClass(month.monthNumber)"
                          >
                            {{ month.month }}
                          </div>
                          <div>
                            <h4 class="font-display text-lg text-gold">{{ month.name }}</h4>
                            <div class="text-xs font-mono text-silver/60">
                              月度数字：{{ month.monthNumber }}
                            </div>
                          </div>
                        </div>
                        <div
                          class="text-silver/40 transition-transform duration-300"
                          :class="{ 'rotate-180 text-gold': expandedMonth === month.month }"
                        >
                          ▼
                        </div>
                      </div>
                      
                      <div class="mb-3">
                        <span
                          class="inline-block px-3 py-1 rounded-full text-xs border"
                          :class="getMonthColorClass(month.monthNumber)"
                        >
                          {{ month.energy }}
                        </span>
                      </div>
                      
                      <p class="font-body text-sm text-silver/90 mb-3">
                        {{ month.theme }}
                      </p>
                      
                      <div class="flex flex-wrap gap-1.5">
                        <span
                          v-for="kw in month.keywords"
                          :key="kw"
                          class="px-2 py-0.5 rounded-full text-xs bg-silver/10 text-silver/70"
                        >
                          {{ kw }}
                        </span>
                      </div>
                    </div>
                    
                    <transition
                      enter-active-class="transition-all duration-300 ease-out"
                      enter-from-class="opacity-0 max-h-0"
                      enter-to-class="opacity-100 max-h-[500px]"
                      leave-active-class="transition-all duration-200 ease-in"
                      leave-from-class="opacity-100 max-h-[500px]"
                      leave-to-class="opacity-0 max-h-0"
                    >
                      <div v-if="expandedMonth === month.month" class="border-t border-silver/20">
                        <div class="p-4 space-y-4 bg-silver/5">
                          <div>
                            <h5 class="font-display text-sm text-gold mb-2 flex items-center gap-2">
                              <span>✨</span>
                              机遇
                            </h5>
                            <ul class="space-y-1">
                              <li
                                v-for="item in month.opportunities"
                                :key="item"
                                class="flex items-start gap-2 text-sm text-silver/80"
                              >
                                <span class="text-green-400 mt-0.5">•</span>
                                <span>{{ item }}</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div>
                            <h5 class="font-display text-sm text-gold mb-2 flex items-center gap-2">
                              <span>⚡</span>
                              挑战
                            </h5>
                            <ul class="space-y-1">
                              <li
                                v-for="item in month.challenges"
                                :key="item"
                                class="flex items-start gap-2 text-sm text-silver/80"
                              >
                                <span class="text-orange-400 mt-0.5">•</span>
                                <span>{{ item }}</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div class="p-3 rounded-lg bg-gold/10 border border-gold/20">
                            <h5 class="font-display text-sm text-gold mb-1 flex items-center gap-2">
                              <span>💫</span>
                              本月提醒
                            </h5>
                            <p class="text-sm text-gold/90">
                              {{ month.reminder }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
                
                <div class="mt-8 p-6 rounded-2xl bg-silver/5 border border-silver/20">
                  <h4 class="font-display text-gold mb-3 flex items-center gap-2">
                    <span>📊</span>
                    月度能量变化趋势
                  </h4>
                  <div class="flex items-end justify-between h-32 gap-1">
                    <div
                      v-for="(month, idx) in result.interpretation.months"
                      :key="month.month"
                      class="flex-1 rounded-t transition-all duration-300 group relative"
                      :style="{
                        height: `${Math.max(30, month.monthNumber * 10)}%`,
                        background: `linear-gradient(to top, rgba(212, 175, 55, ${0.2 + month.monthNumber * 0.05}), rgba(212, 175, 55, ${0.4 + month.monthNumber * 0.05}))`
                      }"
                    >
                      <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                        {{ month.monthNumber }}
                      </div>
                      <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-silver/60">
                        {{ idx + 1 }}月
                      </div>
                    </div>
                  </div>
                  <div class="mt-8 text-xs text-silver/60 text-center font-mono">
                    月度数字 = 流年数字 + 月份数字，约简后反映该月的能量振动频率
                  </div>
                </div>
              </div>
              
              <div v-else-if="activeTab === 'trace'" key="trace">
                <CalculationTrace :trace="result.calculationTrace" />
              </div>
            </transition>
          </div>
        </div>
        
        <div class="border-t border-silver/20 pt-8 mt-16">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MysticButton @click="newDivination">
              ✦ 新的流年占卜
            </MysticButton>
            <MysticButton variant="secondary" @click="goBack">
              ← 返回输入
            </MysticButton>
            <MysticButton variant="ghost" @click="goToArchive">
              ☰ 查看档案
            </MysticButton>
          </div>
          
          <div class="mt-12 text-center">
            <p class="font-mono text-xs text-silver/50 tracking-wider">
              本结果基于确定性数学算法生成
            </p>
            <p class="font-mono text-xs text-silver/40 tracking-wider mt-1">
              流年数字 {{ result.yearNumber }} · 生命路径 {{ result.lifePathNumber }} · {{ result.input.targetYear }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
