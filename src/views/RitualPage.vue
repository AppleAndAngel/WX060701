<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDivinationStore } from '@/stores/divination'
import MysticInput from '@/components/common/MysticInput.vue'
import MysticButton from '@/components/common/MysticButton.vue'
import RuneSelector from '@/components/ritual/RuneSelector.vue'
import StarConnector from '@/components/ritual/StarConnector.vue'
import CalculationVisualizer from '@/components/ritual/CalculationVisualizer.vue'

const router = useRouter()
const store = useDivinationStore()

const phases = [
  { key: 'input', label: '信息', icon: '☰' },
  { key: 'runes', label: '符文', icon: '✧' },
  { key: 'stars', label: '星轨', icon: '☽' },
  { key: 'calculating', label: '演算', icon: '∑' },
  { key: 'complete', label: '完成', icon: '✦' }
]

watch(() => store.phase, (phase) => {
  if (phase === 'complete' && store.currentResult) {
    router.push(`/result/${store.currentResult.id}`)
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
            {{ store.phase === 'stars' ? '开始演算 ✦' : '下一步 →' }}
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
              输入你的信息
            </h2>
            <p class="font-body text-silver/80">
              这些信息将被用于构建你的专属能量矩阵
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
              v-model="store.query"
              type="textarea"
              label="你想探寻的问题（可选）"
              placeholder="在心中默念你的问题，或将其书写于此..."
              :maxlength="200"
            />
          </div>
          
          <div class="mt-12 p-6 rounded-xl bg-silver/10 border border-silver/20">
            <p class="font-mono text-xs text-silver/70 leading-relaxed">
              <span class="text-gold">隐私说明：</span>
              所有数据仅在你的本地浏览器中处理，不会上传至任何服务器。
              计算完成后，你可以选择保存结果到本地存储，或随时清除。
            </p>
          </div>
        </div>
        
        <RuneSelector v-else-if="store.phase === 'runes'" key="runes" />
        
        <StarConnector v-else-if="store.phase === 'stars'" key="stars" />
        
        <CalculationVisualizer v-else-if="store.phase === 'calculating'" key="calculating" />
      </transition>
    </div>
  </div>
</template>
