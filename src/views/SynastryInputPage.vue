<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSynastryStore } from '@/stores/synastry'
import MysticButton from '@/components/common/MysticButton.vue'
import MysticInput from '@/components/common/MysticInput.vue'

const router = useRouter()
const store = useSynastryStore()
const showContent = ref(false)
const showButton = ref(false)

onMounted(() => {
  store.reset()
  setTimeout(() => {
    showContent.value = true
  }, 300)
  setTimeout(() => {
    showButton.value = true
  }, 1500)
})

watch(() => store.phase, (phase) => {
  if (phase === 'complete' && store.currentResult) {
    router.push(`/synastry/result/${store.currentResult.id}`)
  }
})

const startSynastry = () => {
  store.startCalculation()
}

const goToArchive = () => {
  router.push('/archive')
}
</script>

<template>
  <div class="w-full h-full overflow-y-auto">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="text-center mb-12">
        <div
          :class="{ 'animate-fade-in': showContent }"
          style="opacity: 0"
        >
          <div class="font-mono text-xs text-gold/80 tracking-[0.3em] mb-4">
            RELATIONSHIP SYNASTRY
          </div>
          <h1 class="font-display text-4xl md:text-5xl text-gradient-gold tracking-wider mb-4">
            双人关系合盘
          </h1>
          <div class="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mb-4" />
          <p class="font-body text-lg text-silver/70 leading-relaxed max-w-xl mx-auto">
            当两个灵魂相遇，宇宙便编织出新的能量矩阵。输入两人信息，
            探索你们之间的吸引力、冲突点与相处节奏。
          </p>
        </div>
      </div>

      <transition
        enter-active-class="transition-all duration-1000 ease-out"
        enter-from-class="opacity-0 translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="showContent" class="mb-12">
          <div class="relative">
            <div class="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent transform -translate-x-1/2" />
            
            <div class="grid md:grid-cols-2 gap-8 relative">
              <div class="space-y-6 p-8 rounded-2xl bg-glass/50 border border-gold/20 relative">
                <div class="absolute -top-3 left-8 px-4 bg-cosmic-900">
                  <span class="font-display text-gold tracking-wider text-sm">
                    ☽ 甲方
                  </span>
                </div>
                
                <MysticInput
                  v-model="store.personA.name"
                  label="姓名"
                  placeholder="请输入姓名"
                  :maxlength="30"
                />
                
                <MysticInput
                  v-model="store.personA.birthDate"
                  type="date"
                  label="出生日期"
                />
              </div>

              <div class="space-y-6 p-8 rounded-2xl bg-glass/50 border border-purple/30 relative">
                <div class="absolute -top-3 left-8 px-4 bg-cosmic-900">
                  <span class="font-display text-purple tracking-wider text-sm">
                    ☾ 乙方
                  </span>
                </div>
                
                <MysticInput
                  v-model="store.personB.name"
                  label="姓名"
                  placeholder="请输入姓名"
                  :maxlength="30"
                />
                
                <MysticInput
                  v-model="store.personB.birthDate"
                  type="date"
                  label="出生日期"
                />
              </div>
            </div>

            <div class="flex justify-center mt-6">
              <button
                @click="store.swapPersons"
                class="flex items-center gap-2 px-6 py-2 text-sm font-mono text-silver/60 hover:text-gold transition-colors duration-300 group"
              >
                <span class="transition-transform duration-300 group-hover:rotate-180">⇄</span>
                交换双方
              </button>
            </div>
          </div>

          <div class="mt-12 p-6 rounded-xl bg-glass/30 border border-silver/20">
            <label class="block mb-4 font-display text-sm tracking-wider text-gold">
              关系类型
            </label>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="type in store.relationshipTypes"
                :key="type"
                @click="store.relationshipType = type"
                class="px-5 py-2 rounded-full font-body text-sm transition-all duration-300"
                :class="{
                  'bg-gold/20 text-gold border border-gold/50': store.relationshipType === type,
                  'bg-silver/10 text-silver/70 border border-silver/20 hover:border-gold/30 hover:text-silver': store.relationshipType !== type
                }"
              >
                {{ type }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <transition
        enter-active-class="transition-all duration-1000 ease-out delay-500"
        enter-from-class="opacity-0 translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="showButton" class="text-center">
          <div v-if="store.isCalculating" class="space-y-6">
            <div class="max-w-md mx-auto">
              <div class="flex justify-between mb-2">
                <span class="font-mono text-xs text-silver/60">正在计算合盘能量...</span>
                <span class="font-mono text-xs text-gold">{{ Math.round(store.calculationProgress) }}%</span>
              </div>
              <div class="h-2 bg-silver/20 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full transition-all duration-150"
                  :style="{ width: `${store.calculationProgress}%` }"
                />
              </div>
              <p class="mt-4 font-mono text-xs text-silver/50">
                正在分析第 {{ store.calculationStepIndex }} 层能量矩阵...
              </p>
            </div>
          </div>

          <div v-else class="space-y-4">
            <MysticButton
              size="lg"
              variant="primary"
              :disabled="!store.canStartCalculation"
              @click="startSynastry"
            >
              <span class="text-xl">∞</span>
              生成合盘
              <span class="text-xl">∞</span>
            </MysticButton>
            
            <p v-if="!store.canStartCalculation" class="text-sm text-silver/50 font-mono">
              请填写双方的姓名和出生日期
            </p>

            <div class="mt-8">
              <MysticButton variant="ghost" size="sm" @click="goToArchive">
                ☰ 查看档案
              </MysticButton>
            </div>
          </div>

          <div class="mt-16 pt-8 border-t border-silver/20">
            <p class="font-mono text-xs text-silver/60 tracking-wider">
              合盘结果基于双方核心数字的能量共振生成
            </p>
            <p class="font-mono text-xs text-silver/50 tracking-wider mt-2">
              相同输入 → 相同输出 · 确定性算法 · 可独立验证
            </p>
          </div>
        </div>
      </transition>

      <div class="mt-16 grid grid-cols-3 gap-4 text-center">
        <div class="p-4 rounded-lg bg-gold/5 border border-gold/10">
          <div class="font-display text-2xl text-gold mb-2">⟡</div>
          <div class="font-display text-sm text-gold/80 mb-1">吸引力</div>
          <div class="font-mono text-xs text-silver/60">灵魂共振的深度</div>
        </div>
        <div class="p-4 rounded-lg bg-purple/5 border border-purple/10">
          <div class="font-display text-2xl text-purple mb-2">⚡</div>
          <div class="font-display text-sm text-purple/80 mb-1">冲突点</div>
          <div class="font-mono text-xs text-silver/60">需要磨合的张力</div>
        </div>
        <div class="p-4 rounded-lg bg-silver/5 border border-silver/10">
          <div class="font-display text-2xl text-silver mb-2">≈</div>
          <div class="font-display text-sm text-silver/80 mb-1">相处节奏</div>
          <div class="font-mono text-xs text-silver/60">能量循环的规律</div>
        </div>
      </div>
    </div>
  </div>
</template>
