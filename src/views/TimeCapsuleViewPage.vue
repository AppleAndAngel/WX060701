<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTimeCapsuleStore } from '@/stores/timeCapsule'
import GeometryChart from '@/components/result/GeometryChart.vue'
import MysticButton from '@/components/common/MysticButton.vue'
import CalculationTrace from '@/components/result/CalculationTrace.vue'

const route = useRoute()
const router = useRouter()
const store = useTimeCapsuleStore()
const isLoading = ref(true)
const notFound = ref(false)
const activeTab = ref<'comparison' | 'prediction' | 'trace'>('comparison')

const result = computed(() => store.currentResult)

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getDaysBetween = (from: number, to: number) => {
  const diff = to - from
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const goToList = () => {
  router.push('/time-capsule/list')
}

const goToCreate = () => {
  store.reset()
  router.push('/time-capsule')
}

const getAccuracyColor = (rating: number) => {
  if (rating >= 80) return 'text-green-400'
  if (rating >= 50) return 'text-gold'
  return 'text-red-400'
}

const getAccuracyBgColor = (rating: number) => {
  if (rating >= 80) return 'bg-green-500/20 border-green-500/30'
  if (rating >= 50) return 'bg-gold/20 border-gold/30'
  return 'bg-red-500/20 border-red-500/30'
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
          该时间胶囊可能已被清除或不存在。
        </p>
        <MysticButton @click="goToList">返回胶囊列表</MysticButton>
      </div>
    </div>
    
    <template v-else-if="result">
      <div class="max-w-5xl mx-auto px-6 py-12">
        <div class="text-center mb-12">
          <div class="inline-block text-5xl mb-4">
            {{ result.seal.sealSymbol }}
          </div>
          <div class="font-mono text-xs text-silver/60 tracking-wider mb-4">
            {{ formatDate(result.createdAt) }} 封存 · {{ formatDate(result.unlockAt) }} 开启
            <span v-if="result.realityCheck"> · {{ formatDate(result.realityCheck.completedAt) }} 完成对照</span>
          </div>
          <h1 class="font-display text-4xl md:text-5xl text-gradient-gold tracking-wider mb-4">
            时间胶囊 · 命运与现实的对话
          </h1>
          <div class="flex flex-wrap justify-center gap-3 text-sm">
            <span class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 font-mono">
              {{ result.input.name }}
            </span>
            <span class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 font-mono">
              {{ result.input.birthDate }}
            </span>
            <span class="px-3 py-1 rounded-full bg-purple/10 text-purple/80 border border-purple/20 font-mono">
              {{ result.input.question }}
            </span>
          </div>
        </div>
        
        <div class="p-6 rounded-xl bg-silver/5 border border-silver/20 mb-12">
          <div class="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div class="font-mono text-xs text-silver/60 mb-2">等待时长</div>
              <div class="font-display text-3xl text-gold">
                {{ getDaysBetween(result.createdAt, result.unlockAt) }}
              </div>
              <div class="font-mono text-xs text-silver/60">天</div>
            </div>
            <div>
              <div class="font-mono text-xs text-silver/60 mb-2">核心数字</div>
              <div class="font-display text-3xl text-gold">
                {{ result.coreNumbers.lifePath }}/{{ result.coreNumbers.destiny }}/{{ result.coreNumbers.soul }}/{{ result.coreNumbers.personality }}
              </div>
              <div class="font-mono text-xs text-silver/60">生命/命运/灵魂/个性</div>
            </div>
            <div v-if="result.realityCheck">
              <div class="font-mono text-xs text-silver/60 mb-2">预言准确度</div>
              <div
                class="font-display text-3xl"
                :class="getAccuracyColor(result.realityCheck.accuracyRating)"
              >
                {{ result.realityCheck.accuracyRating }}%
              </div>
              <div class="font-mono text-xs text-silver/60">自我评估</div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-center gap-4 mb-8 border-b border-silver/20">
          <button
            @click="activeTab = 'comparison'"
            class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
            :class="{
              'text-gold': activeTab === 'comparison',
              'text-silver/70 hover:text-silver': activeTab !== 'comparison'
            }"
          >
            命运 vs 现实
            <div
              v-if="activeTab === 'comparison'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
            />
          </button>
          <button
            @click="activeTab = 'prediction'"
            class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
            :class="{
              'text-gold': activeTab === 'prediction',
              'text-silver/70 hover:text-silver': activeTab !== 'prediction'
            }"
          >
            完整预言
            <div
              v-if="activeTab === 'prediction'"
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
          <div v-if="activeTab === 'comparison'" key="comparison" class="mb-12">
            <div class="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 class="font-display text-xl text-gold mb-6 text-center tracking-wider">
                  当时的命盘判断
                </h3>
                <div class="p-6 rounded-xl bg-gold/5 border border-gold/20">
                  <div class="mb-6">
                    <h4 class="font-display text-lg text-gold mb-3">核心主题</h4>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="(theme, i) in result.prediction.keyThemes"
                        :key="i"
                        class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 text-sm"
                      >
                        {{ theme }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="mb-6">
                    <h4 class="font-display text-lg text-gold mb-3">预言摘要</h4>
                    <p class="font-body text-silver/90 leading-relaxed">
                      {{ result.prediction.summary }}
                    </p>
                  </div>
                  
                  <div class="mb-6">
                    <h4 class="font-display text-lg text-gold mb-3">可能的发展</h4>
                    <ul class="space-y-2">
                      <li
                        v-for="(outcome, i) in result.prediction.potentialOutcomes"
                        :key="i"
                        class="flex items-start gap-2 text-silver/80"
                      >
                        <span class="text-gold mt-1">✧</span>
                        <span>{{ outcome }}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 class="font-display text-lg text-gold mb-3">当时的指引</h4>
                    <p class="font-body text-silver/90 italic">
                      "{{ result.prediction.guidance }}"
                    </p>
                  </div>
                </div>
              </div>
              
              <div v-if="result.realityCheck">
                <h3 class="font-display text-xl text-purple mb-6 text-center tracking-wider">
                  现实的回响
                </h3>
                <div class="p-6 rounded-xl bg-purple/5 border border-purple/20">
                  <div class="mb-6">
                    <h4 class="font-display text-lg text-purple mb-3">实际情况</h4>
                    <p class="font-body text-silver/90 leading-relaxed">
                      {{ result.realityCheck.actualSituation }}
                    </p>
                  </div>
                  
                  <div class="mb-6">
                    <h4 class="font-display text-lg text-purple mb-3">自我评估准确度</h4>
                    <div
                      class="p-4 rounded-lg text-center"
                      :class="getAccuracyBgColor(result.realityCheck.accuracyRating)"
                    >
                      <div
                        class="font-display text-5xl mb-2"
                        :class="getAccuracyColor(result.realityCheck.accuracyRating)"
                      >
                        {{ result.realityCheck.accuracyRating }}%
                      </div>
                      <div class="text-sm text-silver/70">
                        {{ result.realityCheck.accuracyRating >= 80 ? '非常准确，命运的预言清晰显现' :
                           result.realityCheck.accuracyRating >= 50 ? '部分应验，存在变数与选择' :
                           '偏差较大，自由意志改变了轨迹' }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-6">
                    <h4 class="font-display text-lg text-purple mb-3">意料之外的变化</h4>
                    <p class="font-body text-silver/90 leading-relaxed">
                      {{ result.realityCheck.unexpectedChanges }}
                    </p>
                  </div>
                  
                  <div>
                    <h4 class="font-display text-lg text-purple mb-3">学到的教训</h4>
                    <p class="font-body text-silver/90 leading-relaxed">
                      {{ result.realityCheck.lessonsLearned }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="result.realityCheck" class="mt-12 p-8 rounded-xl bg-silver/5 border border-silver/20">
              <h3 class="font-display text-2xl text-gold mb-6 text-center tracking-wider">
                ✦ 命运与自由意志的对话 ✦
              </h3>
              <div class="grid md:grid-cols-3 gap-6 text-center">
                <div class="p-4 rounded-lg bg-cosmic-800/50">
                  <div class="text-3xl mb-2">🔮</div>
                  <div class="font-display text-lg text-gold mb-2">命盘揭示</div>
                  <p class="text-sm text-silver/70">
                    算法基于你的核心数字和能量矩阵，揭示了可能性的倾向和能量的流动方向
                  </p>
                </div>
                <div class="p-4 rounded-lg bg-cosmic-800/50">
                  <div class="text-3xl mb-2">⚡</div>
                  <div class="font-display text-lg text-gold mb-2">自由意志</div>
                  <p class="text-sm text-silver/70">
                    你的每一个选择都在改写命运的剧本，不确定性正是生命最珍贵的礼物
                  </p>
                </div>
                <div class="p-4 rounded-lg bg-cosmic-800/50">
                  <div class="text-3xl mb-2">🌱</div>
                  <div class="font-display text-lg text-gold mb-2">成长领悟</div>
                  <p class="text-sm text-silver/70">
                    无论预言是否应验，这段旅程中的领悟才是时间胶囊真正的价值所在
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="activeTab === 'prediction'" key="prediction" class="mb-12">
            <div class="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 class="font-display text-xl text-gold mb-6 text-center tracking-wider">
                  你的命盘
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
                    <div class="text-xs font-display tracking-wider text-silver/70">生命路径数</div>
                  </div>
                  <div class="p-4 rounded-lg bg-silver/10 border border-silver/20 text-center">
                    <div class="font-display text-3xl text-gold mb-1">
                      {{ result.coreNumbers.destiny }}
                    </div>
                    <div class="text-xs font-display tracking-wider text-silver/70">命运数</div>
                  </div>
                  <div class="p-4 rounded-lg bg-silver/10 border border-silver/20 text-center">
                    <div class="font-display text-3xl text-purple mb-1">
                      {{ result.coreNumbers.soul }}
                    </div>
                    <div class="text-xs font-display tracking-wider text-silver/70">灵魂数</div>
                  </div>
                  <div class="p-4 rounded-lg bg-silver/10 border border-silver/20 text-center">
                    <div class="font-display text-3xl text-purple mb-1">
                      {{ result.coreNumbers.personality }}
                    </div>
                    <div class="text-xs font-display tracking-wider text-silver/70">个性数</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 class="font-display text-xl text-gold mb-6 text-center tracking-wider">
                  完整预言
                </h3>
                <div class="p-6 rounded-xl bg-silver/5 border border-silver/20">
                  <div class="mb-6">
                    <h4 class="font-display text-lg text-gold mb-3">核心主题</h4>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="(theme, i) in result.prediction.keyThemes"
                        :key="i"
                        class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 text-sm"
                      >
                        {{ theme }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="mb-6">
                    <h4 class="font-display text-lg text-gold mb-3">预言摘要</h4>
                    <p class="font-body text-silver/90 leading-relaxed">
                      {{ result.prediction.summary }}
                    </p>
                  </div>
                  
                  <div class="mb-6">
                    <h4 class="font-display text-lg text-gold mb-3">可能的发展</h4>
                    <ul class="space-y-2">
                      <li
                        v-for="(outcome, i) in result.prediction.potentialOutcomes"
                        :key="i"
                        class="flex items-start gap-2 text-silver/80"
                      >
                        <span class="text-gold mt-1">✧</span>
                        <span>{{ outcome }}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div class="mb-6">
                    <h4 class="font-display text-lg text-gold mb-3">需要注意</h4>
                    <ul class="space-y-2">
                      <li
                        v-for="(warning, i) in result.prediction.warningSigns"
                        :key="i"
                        class="flex items-start gap-2 text-silver/80"
                      >
                        <span class="text-purple mt-1">⚠</span>
                        <span>{{ warning }}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 class="font-display text-lg text-gold mb-3">当时的指引</h4>
                    <p class="font-body text-silver/90 italic">
                      "{{ result.prediction.guidance }}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <CalculationTrace
            v-else-if="activeTab === 'trace'"
            :trace="result.calculationTrace"
            key="trace"
          />
        </transition>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <MysticButton variant="primary" size="lg" @click="goToCreate">
            ✦ 封存新胶囊
          </MysticButton>
          <MysticButton variant="secondary" size="lg" @click="goToList">
            ☰ 我的胶囊
          </MysticButton>
        </div>
      </div>
    </template>
  </div>
</template>
