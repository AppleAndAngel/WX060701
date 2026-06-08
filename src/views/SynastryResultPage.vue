<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSynastryStore } from '@/stores/synastry'
import GeometryChart from '@/components/result/GeometryChart.vue'
import CalculationTrace from '@/components/result/CalculationTrace.vue'
import ShareCardModal from '@/components/result/ShareCardModal.vue'
import MysticButton from '@/components/common/MysticButton.vue'
import { generateSynastryShareCard } from '@/utils/shareCard'
import type { ShareCardData } from '@/utils/shareCard'
import type { NumberCompatibility } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useSynastryStore()
const activeTab = ref<'overview' | 'attraction' | 'conflict' | 'rhythm' | 'trace'>('overview')
const isLoading = ref(true)
const notFound = ref(false)
const showShareModal = ref(false)
const shareCardData = ref<ShareCardData | null>(null)

const result = computed(() => store.currentResult)

const openShareModal = () => {
  if (result.value) {
    shareCardData.value = generateSynastryShareCard(result.value)
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
  if (score >= 90) return 'text-green-400'
  if (score >= 80) return 'text-gold'
  if (score >= 70) return 'text-yellow-500'
  if (score >= 60) return 'text-orange-400'
  return 'text-red-400'
}

const getScoreBg = (score: number) => {
  if (score >= 90) return 'bg-green-500'
  if (score >= 80) return 'bg-gold'
  if (score >= 70) return 'bg-yellow-500'
  if (score >= 60) return 'bg-orange-400'
  return 'bg-red-400'
}

const getIntensityLevel = (intensity: number) => {
  if (intensity >= 85) return { label: '极强', color: 'text-red-400' }
  if (intensity >= 75) return { label: '强', color: 'text-orange-400' }
  if (intensity >= 65) return { label: '中等', color: 'text-gold' }
  return { label: '温和', color: 'text-silver/70' }
}

const getSeverityLevel = (severity: number) => {
  if (severity >= 60) return { label: '高', color: 'text-red-400' }
  if (severity >= 40) return { label: '中', color: 'text-orange-400' }
  return { label: '低', color: 'text-silver/70' }
}

const pairLabels: Record<string, string> = {
  '0': '生命路径',
  '1': '命运',
  '2': '灵魂',
  '3': '个性'
}

const newSynastry = () => {
  store.reset()
  router.push('/synastry')
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
        <div class="text-6xl mb-6">✧</div>
        <h2 class="font-display text-2xl text-gold mb-4 tracking-wider">记录未找到</h2>
        <p class="font-body text-silver/70 mb-8">
          该合盘记录可能已被清除或不存在。
        </p>
        <MysticButton @click="goToArchive">返回档案</MysticButton>
      </div>
    </div>
    
    <template v-else-if="result">
      <div class="max-w-6xl mx-auto px-6 py-12">
        <div class="text-center mb-12">
          <div class="font-mono text-xs text-silver/60 tracking-wider mb-4">
            {{ formatDate(result.createdAt) }}
          </div>
          <h1 class="font-display text-4xl md:text-5xl text-gradient-gold tracking-wider mb-4">
            {{ result.interpretation.title }}
          </h1>
          <div class="flex flex-wrap justify-center gap-3 text-sm mb-6">
            <span class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 font-mono">
              {{ result.input.personA.name }}
            </span>
            <span class="text-gold/60">×</span>
            <span class="px-3 py-1 rounded-full bg-purple/10 text-purple/80 border border-purple/20 font-mono">
              {{ result.input.personB.name }}
            </span>
            <span class="px-3 py-1 rounded-full bg-silver/10 text-silver/70 border border-silver/20 font-mono">
              {{ result.input.relationshipType }}
            </span>
          </div>

          <div class="relative inline-block">
            <div class="w-40 h-40 rounded-full border-4 border-gold/30 flex items-center justify-center relative overflow-hidden">
              <div
                class="absolute inset-0 flex items-end"
                :style="{ background: `linear-gradient(to top, ${result.interpretation.overallScore >= 80 ? 'rgba(212, 175, 55, 0.3)' : result.interpretation.overallScore >= 70 ? 'rgba(234, 179, 8, 0.3)' : 'rgba(249, 115, 22, 0.3)'} ${result.interpretation.overallScore}%, transparent ${result.interpretation.overallScore}%)` }"
              />
              <div class="relative z-10 text-center">
                <div class="font-display text-5xl" :class="getScoreColor(result.interpretation.overallScore)">
                  {{ result.interpretation.overallScore }}
                </div>
                <div class="font-mono text-xs text-silver/60">综合匹配度</div>
              </div>
            </div>
          </div>
        </div>

        <div class="max-w-2xl mx-auto mb-12 p-6 rounded-xl bg-glass border border-gold/20">
          <p class="font-body text-lg text-silver/80 leading-relaxed text-center">
            {{ result.interpretation.overallDescription }}
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 class="font-display text-xl text-gold mb-6 text-center tracking-wider">
              合盘能量图
            </h3>
            <GeometryChart
              :geometry="result.geometry"
              :core-numbers="{
                lifePath: result.personANumbers.lifePath,
                destiny: result.personBNumbers.destiny,
                soul: result.personANumbers.soul,
                personality: result.personBNumbers.personality
              }"
            />
            
            <div class="grid grid-cols-2 gap-4 mt-8">
              <div class="p-4 rounded-lg bg-gold/10 border border-gold/20">
                <div class="font-display text-sm text-gold/70 mb-2 text-center">{{ result.input.personA.name }}</div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-center">
                    <div class="font-display text-2xl text-gold">{{ result.personANumbers.lifePath }}</div>
                    <div class="text-xs text-silver/60">生命路径</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-gold">{{ result.personANumbers.destiny }}</div>
                    <div class="text-xs text-silver/60">命运</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-purple">{{ result.personANumbers.soul }}</div>
                    <div class="text-xs text-silver/60">灵魂</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-purple">{{ result.personANumbers.personality }}</div>
                    <div class="text-xs text-silver/60">个性</div>
                  </div>
                </div>
              </div>
              <div class="p-4 rounded-lg bg-purple/10 border border-purple/20">
                <div class="font-display text-sm text-purple/70 mb-2 text-center">{{ result.input.personB.name }}</div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-center">
                    <div class="font-display text-2xl text-gold">{{ result.personBNumbers.lifePath }}</div>
                    <div class="text-xs text-silver/60">生命路径</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-gold">{{ result.personBNumbers.destiny }}</div>
                    <div class="text-xs text-silver/60">命运</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-purple">{{ result.personBNumbers.soul }}</div>
                    <div class="text-xs text-silver/60">灵魂</div>
                  </div>
                  <div class="text-center">
                    <div class="font-display text-2xl text-purple">{{ result.personBNumbers.personality }}</div>
                    <div class="text-xs text-silver/60">个性</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-display text-xl text-gold mb-6 text-center tracking-wider">
              核心数字配对
            </h3>
            <div class="space-y-4">
              <div
                v-for="(compat, index) in result.compatibilityMatrix as NumberCompatibility[]"
                :key="index"
                class="p-4 rounded-lg bg-glass/50 border border-silver/20"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="font-display text-sm text-silver/80">{{ pairLabels[String(index)] }}数</span>
                  <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center font-display text-gold text-sm">
                      {{ compat.numberA }}
                    </span>
                    <span class="text-gold/60">×</span>
                    <span class="w-8 h-8 rounded-full bg-purple/20 flex items-center justify-center font-display text-purple text-sm">
                      {{ compat.numberB }}
                    </span>
                    <span class="ml-2 font-display text-lg" :class="getScoreColor(compat.score)">
                      {{ compat.score }}分
                    </span>
                  </div>
                </div>
                <div class="h-2 bg-silver/20 rounded-full overflow-hidden mb-3">
                  <div
                    class="h-full rounded-full transition-all duration-1000"
                    :class="getScoreBg(compat.score)"
                    :style="{ width: `${compat.score}%` }"
                  />
                </div>
                <p class="font-body text-sm text-silver/70">
                  {{ compat.description }}
                </p>
              </div>
            </div>
          </div>
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
              总览
              <div
                v-if="activeTab === 'overview'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'attraction'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'attraction',
                'text-silver/70 hover:text-silver': activeTab !== 'attraction'
              }"
            >
              ⟡ 吸引力
              <div
                v-if="activeTab === 'attraction'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'conflict'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'conflict',
                'text-silver/70 hover:text-silver': activeTab !== 'conflict'
              }"
            >
              ⚡ 冲突点
              <div
                v-if="activeTab === 'conflict'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'rhythm'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'rhythm',
                'text-silver/70 hover:text-silver': activeTab !== 'rhythm'
              }"
            >
              ≈ 相处节奏
              <div
                v-if="activeTab === 'rhythm'"
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
              <div class="p-6 rounded-xl bg-gold/5 border border-gold/20 mb-8">
                <h4 class="font-display text-lg text-gold mb-4 flex items-center gap-2">
                  <span>✧</span> 关系建议
                </h4>
                <ul class="space-y-3">
                  <li
                    v-for="(advice, index) in result.interpretation.advice"
                    :key="index"
                    class="flex items-start gap-3"
                  >
                    <span class="text-gold mt-1">{{ index + 1 }}.</span>
                    <span class="font-body text-silver/80">{{ advice }}</span>
                  </li>
                </ul>
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

            <div v-else-if="activeTab === 'attraction'" key="attraction" class="max-w-3xl mx-auto">
              <div class="space-y-4">
                <div
                  v-for="point in result.interpretation.attraction"
                  :key="point.aspect"
                  class="p-6 rounded-xl bg-gradient-to-r from-gold/5 to-transparent border border-gold/20"
                >
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">⟡</span>
                      <div>
                        <h4 class="font-display text-lg text-gold">{{ point.aspect }}</h4>
                        <span
                          class="text-sm font-mono"
                          :class="getIntensityLevel(point.intensity).color"
                        >
                          强度：{{ point.intensity }}% · {{ getIntensityLevel(point.intensity).label }}
                        </span>
                      </div>
                    </div>
                    <div class="w-24 h-2 bg-silver/20 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full"
                        :style="{ width: `${point.intensity}%` }"
                      />
                    </div>
                  </div>
                  <p class="font-body text-silver/80 mb-4">
                    {{ point.description }}
                  </p>
                  <div class="p-4 rounded-lg bg-gold/10 border border-gold/20">
                    <span class="text-gold text-sm font-display">建议：</span>
                    <span class="font-body text-sm text-silver/70">{{ point.advice }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'conflict'" key="conflict" class="max-w-3xl mx-auto">
              <div class="space-y-4">
                <div
                  v-for="point in result.interpretation.conflicts"
                  :key="point.aspect"
                  class="p-6 rounded-xl bg-gradient-to-r from-red-500/5 to-transparent border border-red-500/20"
                >
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">⚡</span>
                      <div>
                        <h4 class="font-display text-lg text-red-400">{{ point.aspect }}</h4>
                        <span
                          class="text-sm font-mono"
                          :class="getSeverityLevel(point.severity).color"
                        >
                          影响程度：{{ point.severity }}% · {{ getSeverityLevel(point.severity).label }}
                        </span>
                      </div>
                    </div>
                    <div class="w-24 h-2 bg-silver/20 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-gradient-to-r from-orange-400/60 to-red-400 rounded-full"
                        :style="{ width: `${point.severity}%` }"
                      />
                    </div>
                  </div>
                  <p class="font-body text-silver/80 mb-4">
                    {{ point.description }}
                  </p>
                  <div class="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span class="text-green-400 text-sm font-display">化解之道：</span>
                    <span class="font-body text-sm text-silver/70">{{ point.resolution }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'rhythm'" key="rhythm" class="max-w-3xl mx-auto">
              <div class="grid md:grid-cols-2 gap-4">
                <div
                  v-for="pattern in result.interpretation.rhythm"
                  :key="pattern.name"
                  class="p-6 rounded-xl bg-gradient-to-br from-purple/5 to-transparent border border-purple/20"
                >
                  <div class="flex items-center gap-3 mb-4">
                    <span class="text-2xl">≈</span>
                    <div>
                      <h4 class="font-display text-lg text-purple">{{ pattern.name }}</h4>
                      <span class="text-sm font-mono text-silver/60">
                        周期：{{ pattern.frequency }}天
                      </span>
                    </div>
                  </div>
                  <p class="font-body text-silver/80 mb-4 text-sm">
                    {{ pattern.description }}
                  </p>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-green-400/80">✓ 最佳时段</span>
                      <span class="font-mono text-silver/70">{{ pattern.bestPeriod }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-orange-400/80">⚠ 挑战时段</span>
                      <span class="font-mono text-silver/70">{{ pattern.challengePeriod }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-8 p-6 rounded-xl bg-silver/5 border border-silver/20">
                <h4 class="font-display text-lg text-gold mb-4">相处提示</h4>
                <p class="font-body text-silver/70 leading-relaxed">
                  每段关系都有其自然的起伏节奏。在最佳时段，你们可以共同推进重要事项、深化连接；
                  在挑战时段，则需要更多的耐心、理解与包容。记住，节奏的差异不是问题，
                  而是让关系更加丰富的契机。当你们能够尊重并善用这些节奏时，
                  关系便会进入一种和谐的舞蹈状态。
                </p>
              </div>
            </div>
          </transition>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MysticButton variant="primary" size="lg" @click="newSynastry">
            ∞ 新的合盘
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
