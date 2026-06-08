<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTimeCapsuleStore } from '@/stores/timeCapsule'
import GeometryChart from '@/components/result/GeometryChart.vue'
import MysticButton from '@/components/common/MysticButton.vue'
import MysticInput from '@/components/common/MysticInput.vue'
import type { TimeCapsuleRealityCheck } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useTimeCapsuleStore()
const isLoading = ref(true)
const notFound = ref(false)
const isUnlocked = ref(false)
const showPrediction = ref(false)
const showRealityForm = ref(false)
const unlockAnimation = ref(false)

const actualSituation = ref('')
const accuracyRating = ref(50)
const unexpectedChanges = ref('')
const lessonsLearned = ref('')

const result = computed(() => store.currentResult)

const canSubmitReality = computed(() => {
  return actualSituation.value.trim().length > 0 &&
         unexpectedChanges.value.trim().length > 0 &&
         lessonsLearned.value.trim().length > 0
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

const getDaysBetween = (from: number, to: number) => {
  const diff = to - from
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const unlockCapsule = () => {
  const id = route.params.id as string
  if (store.unlockCapsule(id)) {
    unlockAnimation.value = true
    setTimeout(() => {
      isUnlocked.value = true
      showPrediction.value = true
    }, 1500)
  }
}

const submitRealityCheck = () => {
  if (!canSubmitReality.value || !result.value) return
  
  const realityCheck: TimeCapsuleRealityCheck = {
    actualSituation: actualSituation.value.trim(),
    accuracyRating: accuracyRating.value,
    unexpectedChanges: unexpectedChanges.value.trim(),
    lessonsLearned: lessonsLearned.value.trim(),
    completedAt: Date.now()
  }
  
  const success = store.submitRealityCheck(result.value.id, realityCheck)
  if (success) {
    router.push(`/time-capsule/view/${result.value.id}`)
  }
}

const goToList = () => {
  router.push('/time-capsule/list')
}

const goToRealityForm = () => {
  showRealityForm.value = true
}

onMounted(() => {
  const id = route.params.id as string
  if (store.currentResult?.id === id) {
    isLoading.value = false
    if (store.currentResult.isUnlocked) {
      isUnlocked.value = true
      showPrediction.value = true
    }
    return
  }
  
  const loaded = store.loadResult(id)
  if (!loaded) {
    notFound.value = true
  } else if (store.currentResult?.isUnlocked) {
    isUnlocked.value = true
    showPrediction.value = true
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
        <div v-if="!isUnlocked" class="text-center py-16">
          <div
            class="inline-block transition-all duration-1000"
            :class="{ 'scale-110': unlockAnimation, 'scale-100': !unlockAnimation }"
          >
            <div class="relative inline-block">
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-48 h-48 rounded-full border-2 border-gold/30"
                  :class="{ 'animate-ping': unlockAnimation, 'animate-pulse': !unlockAnimation }"
                />
              </div>
              <div class="relative z-10 w-40 h-40 flex items-center justify-center">
                <span class="text-7xl">{{ result.seal.sealSymbol }}</span>
              </div>
            </div>
          </div>
          
          <h1 class="font-display text-3xl md:text-4xl text-gradient-gold tracking-wider mt-8 mb-4">
            时间胶囊已到达约定之日
          </h1>
          
          <p class="font-body text-lg text-silver/80 mb-8 max-w-xl mx-auto">
            {{ result.seal.sealText }}
          </p>
          
          <div class="p-6 rounded-xl bg-silver/5 border border-silver/20 max-w-md mx-auto mb-8">
            <div class="space-y-3 font-mono text-sm">
              <div class="flex justify-between">
                <span class="text-silver/70">封存时间</span>
                <span class="text-gold">{{ formatDate(result.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-silver/70">约定开启</span>
                <span class="text-gold">{{ formatDate(result.unlockAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-silver/70">等待时长</span>
                <span class="text-gold">{{ getDaysBetween(result.createdAt, result.unlockAt) }} 天</span>
              </div>
            </div>
          </div>
          
          <div class="p-6 rounded-xl bg-gold/5 border border-gold/20 max-w-lg mx-auto mb-8">
            <h3 class="font-display text-lg text-gold mb-3">你当时的问题</h3>
            <p class="font-body text-silver/90 italic text-xl">
              "{{ result.input.question }}"
            </p>
          </div>
          
          <MysticButton variant="primary" size="lg" @click="unlockCapsule" :disabled="unlockAnimation">
            {{ unlockAnimation ? '正在解开封印...' : '✦ 解开时间胶囊封印' }}
          </MysticButton>
        </div>
        
        <template v-else-if="showPrediction">
          <div class="text-center mb-12">
            <div class="font-mono text-xs text-silver/60 tracking-wider mb-4">
              {{ formatDate(result.createdAt) }} 封存 · {{ formatDate(result.unlockAt) }} 开启
            </div>
            <h1 class="font-display text-4xl md:text-5xl text-gradient-gold tracking-wider mb-4">
              时间胶囊已开启
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
          
          <div class="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 class="font-display text-xl text-gold mb-6 text-center tracking-wider">
                当时的命盘
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
                当时的预言
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
          
          <div v-if="!showRealityForm" class="text-center mb-12">
            <div class="p-8 rounded-xl bg-gold/5 border border-gold/30 max-w-2xl mx-auto">
              <h3 class="font-display text-2xl text-gold mb-4 tracking-wider">
                现在，邀请你进行现实对照
              </h3>
              <p class="font-body text-silver/80 mb-6 leading-relaxed">
                回顾封存时的预言，对照此刻的现实。
                当时的命盘判断有多少与现实相呼应？
                发生了哪些意料之外的变化？
                你从这段经历中学到了什么？
              </p>
              <MysticButton variant="primary" size="lg" @click="goToRealityForm">
                ✦ 开始现实对照
              </MysticButton>
            </div>
          </div>
          
          <div v-else class="max-w-2xl mx-auto mb-12">
            <h2 class="font-display text-2xl text-gold mb-8 text-center tracking-wider">
              现实对照
            </h2>
            
            <div class="space-y-8">
              <MysticInput
                v-model="actualSituation"
                type="textarea"
                label="现在的实际情况是怎样的？"
                placeholder="描述一下你此刻的处境，与当时的问题相关的实际情况..."
                :maxlength="500"
              />
              
              <div>
                <label class="block font-display text-gold mb-3 tracking-wider">
                  你认为当时的预言准确度有多少？
                </label>
                <div class="text-center">
                  <div class="font-display text-5xl text-gold mb-4">
                    {{ accuracyRating }}%
                  </div>
                  <input
                    type="range"
                    v-model="accuracyRating"
                    min="0"
                    max="100"
                    class="w-full h-2 bg-silver/20 rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                  <div class="flex justify-between text-xs text-silver/60 mt-2">
                    <span>完全不准确</span>
                    <span>部分准确</span>
                    <span>非常准确</span>
                  </div>
                </div>
              </div>
              
              <MysticInput
                v-model="unexpectedChanges"
                type="textarea"
                label="发生了哪些意料之外的变化？"
                placeholder="描述那些当时没有预料到，但实际发生了的事情..."
                :maxlength="500"
              />
              
              <MysticInput
                v-model="lessonsLearned"
                type="textarea"
                label="你从这段经历中学到了什么？"
                placeholder="分享你的感悟、收获和成长..."
                :maxlength="500"
              />
            </div>
            
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <MysticButton
                variant="primary"
                size="lg"
                @click="submitRealityCheck"
                :disabled="!canSubmitReality"
              >
                ✦ 完成现实对照
              </MysticButton>
              <MysticButton variant="ghost" size="lg" @click="goToList">
                稍后再说
              </MysticButton>
            </div>
          </div>
          
          <div class="flex justify-center mt-8">
            <MysticButton variant="ghost" size="sm" @click="goToList">
              ← 返回胶囊列表
            </MysticButton>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
