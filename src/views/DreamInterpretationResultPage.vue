<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDreamInterpretationStore } from '@/stores/dreamInterpretation'
import GeometryChart from '@/components/result/GeometryChart.vue'
import CalculationTrace from '@/components/result/CalculationTrace.vue'
import MysticButton from '@/components/common/MysticButton.vue'
import { numberDreamMeanings } from '@/algorithms/dreamInterpretation'

const route = useRoute()
const router = useRouter()
const store = useDreamInterpretationStore()
const activeTab = ref<'overview' | 'emotions' | 'symbols' | 'warnings' | 'actions' | 'trace'>('overview')
const isLoading = ref(true)
const notFound = ref(false)

const result = computed(() => store.currentResult)

const dreamMeaning = computed(() => {
  if (!result.value) return null
  return numberDreamMeanings[result.value.dreamNumber] || numberDreamMeanings[9]
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

const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
  const colors = {
    low: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    high: 'bg-red-500/10 border-red-500/30 text-red-400'
  }
  return colors[severity] || colors.low
}

const getSeverityLabel = (severity: 'low' | 'medium' | 'high') => {
  const labels = { low: '低', medium: '中', high: '高' }
  return labels[severity]
}

const getPriorityColor = (priority: 'immediate' | 'short-term' | 'long-term') => {
  const colors = {
    'immediate': 'bg-red-500/10 border-red-500/30',
    'short-term': 'bg-yellow-500/10 border-yellow-500/30',
    'long-term': 'bg-blue-500/10 border-blue-500/30'
  }
  return colors[priority] || colors['short-term']
}

const getPriorityLabel = (priority: 'immediate' | 'short-term' | 'long-term') => {
  const labels = {
    'immediate': '立即行动',
    'short-term': '短期',
    'long-term': '长期'
  }
  return labels[priority]
}

const getPriorityIcon = (priority: 'immediate' | 'short-term' | 'long-term') => {
  const icons = {
    'immediate': '⚡',
    'short-term': '✨',
    'long-term': '🌱'
  }
  return icons[priority]
}

const newDivination = () => {
  store.reset()
  router.push('/dream-interpretation')
}

const goToArchive = () => {
  router.push('/archive')
}

const goBack = () => {
  router.push('/dream-interpretation')
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
        <div class="text-6xl mb-6">☽</div>
        <h2 class="font-display text-2xl text-gold mb-4 tracking-wider">记录未找到</h2>
        <p class="font-body text-silver/70 mb-8">
          该梦境解读记录可能已被清除或不存在。
        </p>
        <div class="flex justify-center gap-4">
          <MysticButton @click="goBack">返回梦境解读</MysticButton>
          <MysticButton variant="secondary" @click="goToArchive">查看档案</MysticButton>
        </div>
      </div>
    </div>

    <div v-else-if="!result || !dreamMeaning" class="w-full h-full flex items-center justify-center px-6">
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
            <span class="text-lg">☽</span>
            <span class="font-display tracking-wider text-gold">梦境解读占卜</span>
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
              v-for="keyword in result.interpretation.keywords"
              :key="keyword"
              class="px-4 py-1.5 text-sm font-display tracking-wider rounded-full bg-gold/10 text-gold border border-gold/30"
            >
              ✧ {{ keyword }}
            </span>
          </div>

          <div v-if="result.interpretation.warning" class="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 max-w-2xl mx-auto">
            <p class="font-body text-sm text-red-400 leading-relaxed">
              ⚠ {{ result.interpretation.warning }}
            </p>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-8 mb-16">
          <div class="lg:col-span-1">
            <div class="sticky top-8">
              <div class="p-6 rounded-2xl bg-gradient-to-br from-gold/5 to-gold/0 border border-gold/20">
                <h3 class="font-display text-xl text-gold mb-6 text-center tracking-wider">
                  梦境命盘
                </h3>

                <GeometryChart
                  :geometry="result.geometry"
                  :core-numbers="result.coreNumbers"
                />

                <div class="grid grid-cols-2 gap-4 mt-8">
                  <div class="p-4 rounded-lg bg-silver/10 border border-silver/20 text-center">
                    <div class="font-display text-3xl text-gold mb-1">
                      {{ result.coreNumbers.lifePath }}
                    </div>
                    <div class="text-xs font-display tracking-wider text-silver/70">生命路径</div>
                  </div>
                  <div class="p-4 rounded-lg bg-gold/10 border border-gold/30 text-center">
                    <div class="font-display text-3xl text-gold mb-1">
                      {{ result.dreamNumber }}
                    </div>
                    <div class="text-xs font-display tracking-wider text-gold/70">梦境数字</div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div class="p-4 rounded-lg bg-silver/10 border border-silver/20 text-center">
                    <div class="font-display text-2xl text-gold mb-1">
                      {{ result.coreNumbers.soul }}
                    </div>
                    <div class="text-xs font-display tracking-wider text-silver/70">灵魂数字</div>
                  </div>
                  <div class="p-4 rounded-lg bg-silver/10 border border-silver/20 text-center">
                    <div class="font-display text-2xl text-gold mb-1">
                      {{ result.coreNumbers.destiny }}
                    </div>
                    <div class="text-xs font-display tracking-wider text-silver/70">命运数字</div>
                  </div>
                </div>

                <div class="mt-6 p-4 rounded-lg bg-silver/5 border border-silver/20">
                  <div class="font-display text-sm text-gold mb-2">梦境主题</div>
                  <div class="font-body text-silver/90 text-sm leading-relaxed">
                    {{ dreamMeaning.theme }}
                  </div>
                  <div class="mt-3 text-xs text-silver/60 leading-relaxed">
                    {{ dreamMeaning.essence }}
                  </div>
                </div>

                <div class="mt-4 p-4 rounded-lg bg-silver/5 border border-silver/20">
                  <div class="font-display text-sm text-gold mb-2">原始梦境</div>
                  <div class="font-body text-silver/70 text-xs leading-relaxed italic">
                    "{{ result.input.dreamContent.slice(0, 100) }}{{ result.input.dreamContent.length > 100 ? '...' : '' }}"
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-3 mt-6">
                <MysticButton full-width @click="newDivination">
                  ✦ 新的梦境解读
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
                  { key: 'overview', label: '总览', icon: '☯' },
                  { key: 'emotions', label: '梦境情绪', icon: '💫' },
                  { key: 'symbols', label: '符文象征', icon: 'ᚠ' },
                  { key: 'warnings', label: '潜在提醒', icon: '⚠' },
                  { key: 'actions', label: '行动建议', icon: '✧' },
                  { key: 'trace', label: '计算溯源', icon: '∑' }
                ]"
                :key="tab.key"
                @click="activeTab = tab.key as any; scrollToTop()"
                class="flex-shrink-0 px-4 py-3 font-display tracking-wider text-sm transition-all duration-300 relative flex items-center gap-2"
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
                <div class="prose prose-invert max-w-none space-y-8">
                  <div class="p-6 rounded-2xl bg-gradient-to-br from-gold/5 to-transparent border border-gold/20">
                    <h3 class="font-display text-xl text-gold mb-4 flex items-center gap-2">
                      <span>☽</span>
                      潜意识讯息
                    </h3>
                    <p class="font-body text-lg leading-relaxed text-silver/90">
                      {{ result.interpretation.subconsciousMessage }}
                    </p>
                  </div>

                  <div class="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20">
                    <h3 class="font-display text-xl text-gold mb-4 flex items-center gap-2">
                      <span>🌟</span>
                      核心数字启示
                    </h3>
                    <div class="flex items-start gap-4">
                      <div class="flex-shrink-0 w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                        <span class="font-display text-4xl text-gold">{{ result.dreamNumber }}</span>
                      </div>
                      <div class="flex-1">
                        <div class="font-display text-xl text-gold mb-2">
                          数字 {{ result.dreamNumber }} · {{ dreamMeaning.theme }}
                        </div>
                        <p class="font-body text-silver/80 leading-relaxed">
                          {{ dreamMeaning.essence }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="grid md:grid-cols-2 gap-4">
                    <div class="p-6 rounded-xl bg-blue-500/5 border border-blue-500/20">
                      <h4 class="font-display text-lg text-gold mb-4 flex items-center gap-2">
                        <span>💫</span>
                        主要情绪
                      </h4>
                      <div class="space-y-3">
                        <div
                          v-for="emotion in result.interpretation.emotions.slice(0, 3)"
                          :key="emotion.name"
                          class="flex items-center gap-3"
                        >
                          <div
                            class="w-3 h-3 rounded-full"
                            :style="{ backgroundColor: emotion.color }"
                          />
                          <span class="font-body text-silver/90 flex-1">{{ emotion.name }}</span>
                          <div class="w-24 h-2 bg-silver/20 rounded-full overflow-hidden">
                            <div
                              class="h-full rounded-full transition-all duration-500"
                              :style="{
                                width: `${emotion.intensity}%`,
                                backgroundColor: emotion.color
                              }"
                            />
                          </div>
                          <span class="font-mono text-xs text-silver/60 w-10 text-right">
                            {{ emotion.intensity }}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="p-6 rounded-xl bg-purple-500/5 border border-purple-500/20">
                      <h4 class="font-display text-lg text-gold mb-4 flex items-center gap-2">
                        <span>ᚠ</span>
                        关键象征
                      </h4>
                      <div class="space-y-3">
                        <div
                          v-for="symbol in result.interpretation.symbols.slice(0, 3)"
                          :key="symbol.symbol"
                          class="flex items-center gap-3"
                        >
                          <div class="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold font-display">
                            {{ symbol.numerologyNumber }}
                          </div>
                          <div class="flex-1">
                            <div class="font-body text-silver/90">{{ symbol.symbol }}</div>
                            <div class="text-xs text-silver/60">{{ symbol.meaning.slice(0, 20) }}...</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 rounded-2xl bg-silver/5 border border-silver/20">
                    <h3 class="font-display text-xl text-gold mb-6 flex items-center gap-2">
                      <span>📊</span>
                      核心数字命盘
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div class="p-4 rounded-xl bg-silver/5 border border-silver/20 text-center hover:border-gold/40 transition-all duration-300">
                        <div class="font-display text-3xl text-gold mb-1">
                          {{ result.coreNumbers.lifePath }}
                        </div>
                        <div class="text-sm font-display tracking-wider text-silver/70">生命路径</div>
                      </div>
                      <div class="p-4 rounded-xl bg-silver/5 border border-silver/20 text-center hover:border-gold/40 transition-all duration-300">
                        <div class="font-display text-3xl text-gold mb-1">
                          {{ result.coreNumbers.destiny }}
                        </div>
                        <div class="text-sm font-display tracking-wider text-silver/70">命运数字</div>
                      </div>
                      <div class="p-4 rounded-xl bg-silver/5 border border-silver/20 text-center hover:border-gold/40 transition-all duration-300">
                        <div class="font-display text-3xl text-gold mb-1">
                          {{ result.coreNumbers.soul }}
                        </div>
                        <div class="text-sm font-display tracking-wider text-silver/70">灵魂数字</div>
                      </div>
                      <div class="p-4 rounded-xl bg-silver/5 border border-silver/20 text-center hover:border-gold/40 transition-all duration-300">
                        <div class="font-display text-3xl text-gold mb-1">
                          {{ result.coreNumbers.personality }}
                        </div>
                        <div class="text-sm font-display tracking-wider text-silver/70">个性数字</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="activeTab === 'emotions'" key="emotions">
                <div class="space-y-6">
                  <div class="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20">
                    <h3 class="font-display text-xl text-gold mb-4 flex items-center gap-2">
                      <span>💫</span>
                      梦境情绪分析
                    </h3>
                    <p class="font-body text-silver/70 mb-6">
                      梦境中的情绪是潜意识向你传递信息的重要方式。以下是算法从你的梦境描述中识别出的核心情绪及其强度。
                      高烈度的情绪可能对应着现实生活中需要关注的议题。
                    </p>
                  </div>

                  <div class="space-y-4">
                    <div
                      v-for="(emotion, idx) in result.interpretation.emotions"
                      :key="emotion.name"
                      class="p-6 rounded-2xl border transition-all duration-500 hover:shadow-lg"
                      :class="[
                        idx === 0 ? 'bg-gradient-to-br from-gold/5 to-transparent border-gold/30' :
                        'bg-silver/5 border-silver/20'
                      ]"
                    >
                      <div class="flex items-start gap-6">
                        <div
                          class="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center border-2"
                          :style="{
                            backgroundColor: `${emotion.color}15`,
                            borderColor: `${emotion.color}40`
                          }"
                        >
                          <div class="text-center">
                            <div
                              class="font-display text-3xl"
                              :style="{ color: emotion.color }"
                            >
                              {{ emotion.intensity }}
                            </div>
                            <div class="text-xs font-mono text-silver/50">%</div>
                          </div>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between mb-2">
                            <h4
                              class="font-display text-2xl"
                              :style="{ color: emotion.color }"
                            >
                              {{ emotion.name }}
                            </h4>
                            <div class="flex-1 mx-4 h-3 bg-silver/20 rounded-full overflow-hidden">
                              <div
                                class="h-full rounded-full transition-all duration-1000"
                                :style="{
                                  width: `${emotion.intensity}%`,
                                  backgroundColor: emotion.color
                                }"
                              />
                            </div>
                          </div>
                          <p class="font-body text-silver/80 leading-relaxed">
                            {{ emotion.description }}
                          </p>
                          <div class="mt-4 p-3 rounded-lg bg-silver/5 border border-silver/10">
                            <p class="text-sm text-silver/60">
                              <span class="text-gold">洞见：</span>
                              梦中的{{ emotion.name }}情绪可能反映了你在清醒生活中
                              {{ emotion.intensity > 70 ? '被强烈压抑或需要关注' : '正在经历和整合' }}的感受。
                              尝试在安静的状态下回想这种情绪，并询问自己：这种感受在告诉我什么？
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 rounded-2xl bg-silver/5 border border-silver/20 mt-8">
                    <h4 class="font-display text-gold mb-4 flex items-center gap-2">
                      <span>📈</span>
                      情绪能量分布
                    </h4>
                    <div class="flex items-end justify-between h-48 gap-3 px-4">
                      <div
                        v-for="emotion in result.interpretation.emotions"
                        :key="emotion.name"
                        class="flex-1 rounded-t-lg transition-all duration-500 group relative cursor-pointer"
                        :style="{
                          height: `${Math.max(20, emotion.intensity)}%`,
                          background: `linear-gradient(to top, ${emotion.color}40, ${emotion.color}80)`
                        }"
                      >
                        <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-gold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {{ emotion.name }} {{ emotion.intensity }}%
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-between mt-4 px-4">
                      <div
                        v-for="emotion in result.interpretation.emotions"
                        :key="emotion.name"
                        class="text-xs text-silver/60 text-center flex-1"
                      >
                        {{ emotion.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="activeTab === 'symbols'" key="symbols">
                <div class="space-y-6">
                  <div class="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent border border-indigo-500/20">
                    <h3 class="font-display text-xl text-gold mb-4 flex items-center gap-2">
                      <span>ᚠ</span>
                      符文象征解读
                    </h3>
                    <p class="font-body text-silver/70 mb-6">
                      梦境中的象征是潜意识的语言。算法将你梦中的意象与古老的卢恩符文（Runes）象征系统相对应，
                      并结合数字命理学，为你揭示每个象征背后的深层含义。
                    </p>
                  </div>

                  <div class="space-y-6">
                    <div
                      v-for="(symbol, idx) in result.interpretation.symbols"
                      :key="symbol.symbol"
                      class="p-6 rounded-2xl bg-silver/5 border border-silver/20 hover:border-gold/30 transition-all duration-500"
                    >
                      <div class="flex items-start gap-6">
                        <div class="flex-shrink-0">
                          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center border-2 border-gold/30">
                            <div class="text-center">
                              <div class="font-display text-4xl text-gold/80">
                                {{ symbol.numerologyNumber }}
                              </div>
                              <div class="text-[10px] font-mono text-silver/50 tracking-wider">数字</div>
                            </div>
                          </div>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between mb-3">
                            <h4 class="font-display text-2xl text-gold">
                              {{ symbol.symbol }}
                            </h4>
                            <span class="px-3 py-1 rounded-full text-xs bg-gold/10 text-gold/80 border border-gold/20 font-mono">
                              数字 {{ symbol.numerologyNumber }}
                            </span>
                          </div>
                          <p class="font-body text-silver/90 leading-relaxed mb-4">
                            {{ symbol.meaning }}
                          </p>
                          <div class="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                            <h5 class="font-display text-sm text-indigo-400 mb-2 flex items-center gap-2">
                              <span>ᚠ</span>
                              符文启示
                            </h5>
                            <p class="text-sm text-silver/80 leading-relaxed">
                              {{ symbol.runeConnection }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 rounded-2xl bg-gold/5 border border-gold/20 mt-8">
                    <h4 class="font-display text-gold mb-3 flex items-center gap-2">
                      <span>💡</span>
                      象征解读建议
                    </h4>
                    <p class="font-body text-silver/80 leading-relaxed">
                      梦境象征的含义是高度个人化的。虽然算法提供了传统的解读，但最重要的是这些象征对你个人意味着什么。
                      尝试回想：在你的生活中，这些事物让你联想到什么？它们唤起了怎样的回忆和感受？
                      你个人的联想往往比传统解读更加准确和有力。
                    </p>
                  </div>
                </div>
              </div>

              <div v-else-if="activeTab === 'warnings'" key="warnings">
                <div class="space-y-6">
                  <div class="p-6 rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20">
                    <h3 class="font-display text-xl text-gold mb-4 flex items-center gap-2">
                      <span>⚠</span>
                      潜在提醒
                    </h3>
                    <p class="font-body text-silver/70 mb-6">
                      梦境常常是潜意识在提醒我们注意清醒生活中被忽略的信号。
                      以下是算法从你的梦境能量场中识别出的需要关注的领域。
                      请以开放的心态对待这些提醒，它们是来自你深层智慧的善意提示。
                    </p>
                  </div>

                  <div class="space-y-4">
                    <div
                      v-for="(warning, idx) in result.interpretation.warnings"
                      :key="warning.aspect"
                      class="p-6 rounded-2xl border transition-all duration-500 hover:shadow-lg"
                      :class="getSeverityColor(warning.severity)"
                    >
                      <div class="flex items-start gap-4">
                        <div
                          class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
                          :class="getSeverityColor(warning.severity)"
                        >
                          {{ warning.severity === 'high' ? '❗' : warning.severity === 'medium' ? '⚠' : '💡' }}
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between mb-2">
                            <h4 class="font-display text-xl">
                              {{ warning.aspect }}
                            </h4>
                            <span
                              class="px-3 py-1 rounded-full text-xs font-display tracking-wider border"
                              :class="getSeverityColor(warning.severity)"
                            >
                              优先级 · {{ getSeverityLabel(warning.severity) }}
                            </span>
                          </div>
                          <p class="font-body leading-relaxed text-silver/90">
                            {{ warning.description }}
                          </p>
                          <div class="mt-4 flex items-start gap-2 text-sm text-silver/60">
                            <span>✨</span>
                            <p>
                              建议：留出一些安静的时间，审视这个领域在你生活中的状态。
                              你是否忽略了某些重要的信号？需要做出什么调整吗？
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 rounded-2xl bg-silver/5 border border-silver/20 mt-8">
                    <h4 class="font-display text-gold mb-3 flex items-center gap-2">
                      <span>🌱</span>
                      关于提醒的正念态度
                    </h4>
                    <p class="font-body text-silver/80 leading-relaxed">
                      请记住，这些"提醒"不是预言，而是能量状态的反映。它们显示的是当前的趋势和可能性，
                      而非注定的命运。你的觉知和选择可以改变一切。将这些提醒视为来自深层自我的关怀，
                      而非恐惧的理由。每一个被看见的阴影，都是一次转化的机会。
                    </p>
                  </div>
                </div>
              </div>

              <div v-else-if="activeTab === 'actions'" key="actions">
                <div class="space-y-6">
                  <div class="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20">
                    <h3 class="font-display text-xl text-gold mb-4 flex items-center gap-2">
                      <span>✧</span>
                      行动建议
                    </h3>
                    <p class="font-body text-silver/70 mb-6">
                      基于你的梦境数字、情绪和象征分析，算法为你生成了以下行动建议。
                      这些建议按优先级排列，帮助你将梦境的洞见转化为现实生活中的积极变化。
                    </p>
                  </div>

                  <div class="space-y-6">
                    <div
                      v-for="(action, idx) in result.interpretation.actionSuggestions"
                      :key="action.title"
                      class="p-6 rounded-2xl border transition-all duration-500 hover:shadow-lg"
                      :class="getPriorityColor(action.priority)"
                    >
                      <div class="flex items-start gap-6">
                        <div class="flex-shrink-0">
                          <div
                            class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2"
                            :class="getPriorityColor(action.priority)"
                          >
                            {{ getPriorityIcon(action.priority) }}
                          </div>
                          <div class="mt-2 text-center">
                            <span class="text-xs font-mono text-gold/80">#{{ action.relatedNumber }}</span>
                          </div>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between mb-3">
                            <h4 class="font-display text-2xl text-gold">
                              {{ action.title }}
                            </h4>
                            <span
                              class="px-3 py-1 rounded-full text-xs font-display tracking-wider border"
                              :class="getPriorityColor(action.priority)"
                            >
                              {{ getPriorityLabel(action.priority) }}
                            </span>
                          </div>
                          <p class="font-body text-silver/90 leading-relaxed">
                            {{ action.description }}
                          </p>
                          <div class="mt-4 flex items-center gap-4">
                            <div class="flex items-center gap-2 text-sm text-silver/60">
                              <span>🎯</span>
                              <span>关联数字：{{ action.relatedNumber }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-silver/60">
                              <span>✨</span>
                              <span>
                                建议在
                                <span class="text-gold">
                                  {{ action.priority === 'immediate' ? '接下来的3天内' :
                                     action.priority === 'short-term' ? '接下来的2-4周' :
                                     '接下来的3-6个月' }}
                                </span>
                                开始
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="grid md:grid-cols-3 gap-4 mt-8">
                    <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                      <div class="text-2xl mb-2">⚡</div>
                      <div class="font-display text-sm text-red-400 mb-1">立即行动</div>
                      <div class="text-xs text-silver/60">
                        建议在3天内开始执行
                      </div>
                    </div>
                    <div class="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                      <div class="text-2xl mb-2">✨</div>
                      <div class="font-display text-sm text-yellow-400 mb-1">短期行动</div>
                      <div class="text-xs text-silver/60">
                        建议在2-4周内开始执行
                      </div>
                    </div>
                    <div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                      <div class="text-2xl mb-2">🌱</div>
                      <div class="font-display text-sm text-blue-400 mb-1">长期行动</div>
                      <div class="text-xs text-silver/60">
                        建议在3-6个月内持续践行
                      </div>
                    </div>
                  </div>

                  <div class="p-6 rounded-2xl bg-gold/5 border border-gold/20 mt-8">
                    <h4 class="font-display text-gold mb-3 flex items-center gap-2">
                      <span>💫</span>
                      行动指南
                    </h4>
                    <p class="font-body text-silver/80 leading-relaxed mb-4">
                      你不需要一次性完成所有建议。从一个"立即行动"的项目开始，逐步建立习惯。
                      记住，真正的转变来自持续的小步前行，而非一蹴而就的巨大改变。
                    </p>
                    <ul class="space-y-2 text-sm text-silver/70">
                      <li class="flex items-start gap-2">
                        <span class="text-gold mt-0.5">•</span>
                        <span>选择一个你最有共鸣的行动，从今天开始</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-gold mt-0.5">•</span>
                        <span>将行动拆解为每天可以完成的小步骤</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-gold mt-0.5">•</span>
                        <span>在日记中记录你的进展和感受</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-gold mt-0.5">•</span>
                        <span>每周回顾一次，根据实际情况调整计划</span>
                      </li>
                    </ul>
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
              ✦ 新的梦境解读
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
              梦境数字 {{ result.dreamNumber }} · 生命路径 {{ result.coreNumbers.lifePath }} ·
              灵魂数字 {{ result.coreNumbers.soul }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
