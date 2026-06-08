<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTimeCapsuleStore } from '@/stores/timeCapsule'
import MysticInput from '@/components/common/MysticInput.vue'
import MysticButton from '@/components/common/MysticButton.vue'
import RuneSelector from '@/components/ritual/RuneSelector.vue'
import StarConnector from '@/components/ritual/StarConnector.vue'
import CalculationVisualizer from '@/components/ritual/CalculationVisualizer.vue'

const router = useRouter()
const store = useTimeCapsuleStore()

const phases = [
  { key: 'input', label: '信息', icon: '☰' },
  { key: 'runes', label: '符文', icon: '✧' },
  { key: 'stars', label: '星轨', icon: '☽' },
  { key: 'calculating', label: '封存', icon: '∑' },
  { key: 'complete', label: '完成', icon: '✦' }
]

watch(() => store.phase, (phase) => {
  if (phase === 'complete' && store.currentResult) {
    router.push(`/time-capsule/seal/${store.currentResult.id}`)
  }
})

const getPhaseIndex = () => {
  return phases.findIndex(p => p.key === store.phase)
}

const canGoNext = () => {
  switch (store.phase) {
    case 'input': return store.canProceedToRunes
    case 'runes': return store.canProceedToStars
    case 'stars': return store.canStartCalculation
    default: return false
  }
}

const canGoBack = () => {
  return ['runes', 'stars'].includes(store.phase)
}

const goToList = () => {
  router.push('/time-capsule/list')
}
</script>

<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div class="flex-none px-6 py-4 border-b border-silver/10 bg-cosmic-900/80 backdrop-blur-sm">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            v-for="(phase, index) in phases.slice(0, 4)"
            :key="phase.key"
            class="flex items-center"
          >
            <div
              class="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500"
              :class="{
                'bg-gold/20 text-gold': store.phase === phase.key,
                'text-gold/70': index < getPhaseIndex(),
                'text-silver/50': index > getPhaseIndex()
              }"
            >
              <span class="text-base">{{ phase.icon }}</span>
              <span class="text-xs font-display tracking-wider hidden sm:inline">
                {{ phase.label }}
              </span>
            </div>
            <div
              v-if="index < 3"
              class="w-8 h-px mx-1"
              :class="{
                'bg-gold/40': index < getPhaseIndex(),
                'bg-silver/20': index >= getPhaseIndex()
              }"
            />
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <MysticButton
            variant="ghost"
            size="sm"
            @click="goToList"
          >
            ☰ 我的胶囊
          </MysticButton>
          <MysticButton
            v-if="canGoBack()"
            variant="ghost"
            size="sm"
            @click="store.prevPhase()"
          >
            ← 上一步
          </MysticButton>
          <MysticButton
            v-if="canGoNext() && store.phase !== 'calculating'"
            variant="primary"
            size="sm"
            @click="store.nextPhase()"
          >
            {{ store.phase === 'stars' ? '封存时间胶囊 ✦' : '下一步 →' }}
          </MysticButton>
        </div>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto px-6 py-8">
      <transition
        mode="out-in"
        enter-active-class="transition-all duration-500 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="opacity-0 translate-x-8"
        leave-to-class="opacity-0 -translate-x-8"
      >
        <div v-if="store.phase === 'input'" key="input" class="max-w-2xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="font-display text-3xl text-gold mb-4 tracking-wider">
              封存你的时间胶囊
            </h2>
            <p class="font-body text-silver/80">
              为未来的自己写下一个问题，待到约定之日，再看命运的预言与现实的呼应
            </p>
          </div>
          
          <div class="space-y-8">
            <MysticInput
              v-model="store.name"
              label="姓名（英文拼音）"
              placeholder="请输入你的英文姓名或拼音"
              :maxlength="50"
            />
            
            <MysticInput
              v-model="store.birthDate"
              type="date"
              label="出生日期"
              :maxlength="10"
            />
            
            <MysticInput
              v-model="store.question"
              type="textarea"
              label="你想问未来的问题"
              placeholder="写下你此刻最想知道答案的问题..."
              :maxlength="300"
            />
            
            <MysticInput
              v-model="store.targetDate"
              type="date"
              label="约定开启日期"
              :min="store.getMinDate()"
              placeholder="选择未来的某一天"
            />
          </div>
          
          <div class="mt-12 p-6 rounded-xl bg-silver/10 border border-silver/20">
            <p class="font-mono text-xs text-silver/70 leading-relaxed">
              <span class="text-gold">时间胶囊说明：</span>
              你所写下的问题和占卜结果将被封存，直到约定日期才能开启。
              这是一个与未来对话的机会，请认真对待你的问题。
            </p>
          </div>
        </div>
        
        <div v-else-if="store.phase === 'runes'" key="runes">
          <div class="text-center mb-8">
            <h2 class="font-display text-2xl text-gold mb-4 tracking-wider">
              选择符文印记
            </h2>
            <p class="font-body text-silver/80">
              选择 3-5 个符文，它们将成为你时间胶囊的守护印记
            </p>
            <p class="font-mono text-sm text-gold mt-2">
              已选择 {{ store.selectedRunes.length }}/5 个符文
              <span v-if="store.selectedRunes.length >= 3" class="text-emerald-400 ml-2">✓ 可以继续</span>
              <span v-else class="text-silver/50 ml-2">还需选择 {{ 3 - store.selectedRunes.length }} 个</span>
            </p>
          </div>
          <RuneSelector :store="store" />
        </div>
        
        <div v-else-if="store.phase === 'stars'" key="stars">
          <div class="text-center mb-8">
            <h2 class="font-display text-2xl text-gold mb-4 tracking-wider">
              连接命运星轨
            </h2>
            <p class="font-body text-silver/80">
              拖动鼠标连接至少 2 条星轨，为你的时间胶囊注入宇宙能量
            </p>
            <p class="font-mono text-sm text-gold mt-2">
              已连接 {{ store.starConnections.length }} 条星轨
              <span v-if="store.starConnections.length >= 2" class="text-emerald-400 ml-2">✓ 可以封存</span>
              <span v-else class="text-silver/50 ml-2">还需连接 {{ 2 - store.starConnections.length }} 条</span>
            </p>
          </div>
          <StarConnector :store="store" />
        </div>
        
        <div v-else-if="store.phase === 'calculating'" key="calculating">
          <div class="text-center mb-12">
            <h2 class="font-display text-2xl text-gold mb-4 tracking-wider">
              正在封存时间胶囊...
            </h2>
            <p class="font-body text-silver/80">
              宇宙正在记录你的问题，生成命运的预言
            </p>
          </div>
          <CalculationVisualizer />
        </div>
      </transition>
    </div>
  </div>
</template>
