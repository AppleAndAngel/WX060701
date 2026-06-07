<script setup lang="ts">
import { ref } from 'vue'
import type { CalculationStep } from '@/types'

interface Props {
  trace: CalculationStep[]
}

const props = defineProps<Props>()
const expandedSteps = ref<Set<number>>(new Set())
const showAll = ref(false)

const toggleStep = (step: number) => {
  if (expandedSteps.value.has(step)) {
    expandedSteps.value.delete(step)
  } else {
    expandedSteps.value.add(step)
  }
}

const isExpanded = (step: number) => {
  return expandedSteps.value.has(step) || showAll.value
}

const formatOutput = (output: unknown): string => {
  if (typeof output === 'object' && output !== null) {
    return JSON.stringify(output, null, 2)
  }
  return String(output)
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-display text-2xl text-gold tracking-wider">
        数据溯源 · 算法透明性
      </h3>
      <button
        @click="showAll = !showAll"
        class="text-sm font-mono text-silver/60 hover:text-gold transition-colors"
      >
        {{ showAll ? '收起全部' : '展开全部' }}
      </button>
    </div>
    
    <p class="font-body text-silver/60 mb-8 text-sm">
      所有占卜结果均基于确定性数学算法生成。以下是完整的计算过程，可独立验证。
    </p>
    
    <div class="space-y-3">
      <div
        v-for="step in trace"
        :key="step.step"
        class="rounded-lg overflow-hidden border transition-all duration-300"
        :class="{
          'border-gold/30 bg-cosmic-800/50': isExpanded(step.step),
          'border-silver/20 bg-cosmic-900/50 hover:border-gold/20': !isExpanded(step.step)
        }"
      >
        <button
          @click="toggleStep(step.step)"
          class="w-full px-4 py-3 flex items-center justify-between text-left"
        >
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono bg-gold/20 text-gold">
              {{ step.step }}
            </span>
            <span class="font-display tracking-wider text-sm" :class="isExpanded(step.step) ? 'text-gold' : 'text-silver/80'">
              {{ step.name }}
            </span>
          </div>
          <span
            class="text-gold transition-transform duration-300"
            :class="{ 'rotate-180': isExpanded(step.step) }"
          >
            ▼
          </span>
        </button>
        
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 max-h-0"
          leave-to-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-[500px]"
        >
          <div v-show="isExpanded(step.step)" class="overflow-hidden">
            <div class="px-4 pb-4 space-y-3">
              <div>
                <div class="text-xs font-mono text-silver/60 mb-1">公式</div>
                <div class="px-3 py-2 rounded bg-cosmic-900/80 font-mono text-sm text-purple">
                  {{ step.formula }}
                </div>
              </div>
              
              <div class="grid md:grid-cols-2 gap-3">
                <div>
                  <div class="text-xs font-mono text-silver/60 mb-1">输入</div>
                  <pre class="px-3 py-2 rounded bg-cosmic-900/80 font-mono text-xs text-silver/70 overflow-x-auto whitespace-pre-wrap break-all">
{{ formatOutput(step.input) }}
                  </pre>
                </div>
                <div>
                  <div class="text-xs font-mono text-silver/60 mb-1">输出</div>
                  <pre class="px-3 py-2 rounded bg-cosmic-900/80 font-mono text-xs text-gold overflow-x-auto whitespace-pre-wrap break-all">
{{ formatOutput(step.output) }}
                  </pre>
                </div>
              </div>
              
              <div>
                <div class="text-xs font-mono text-silver/60 mb-1">说明</div>
                <p class="font-body text-sm text-silver/70">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    
    <div class="mt-8 p-4 rounded-lg bg-silver/10 border border-silver/20">
      <p class="font-mono text-xs text-silver/70 leading-relaxed">
        <span class="text-gold">算法声明：</span>
        本系统所有"占卜"结果均基于确定性数学算法（数值约简、矩阵变换、特征值计算、几何生成）生成。
        相同的输入将始终产生相同的输出，不存在任何随机性。本系统仅供艺术体验与哲学思考，不构成任何决策建议。
      </p>
    </div>
  </div>
</template>
