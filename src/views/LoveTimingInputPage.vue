<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoveTimingStore } from '@/stores/loveTiming'
import MysticButton from '@/components/common/MysticButton.vue'
import MysticInput from '@/components/common/MysticInput.vue'
import type { LoveTimingScenario } from '@/types'

const router = useRouter()
const store = useLoveTimingStore()
const showContent = ref(false)
const showButton = ref(false)

const scenarios: { value: LoveTimingScenario; label: string; icon: string; desc: string }[] = [
  { value: 'progression', label: '关系推进', icon: '♥', desc: '想要让关系更进一步' },
  { value: 'reconciliation', label: '复合时机', icon: '∞', desc: '希望修复破裂的关系' },
  { value: 'confession', label: '表白时机', icon: '♡', desc: '准备向心仪的人表白' }
]

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
    router.push(`/love-timing/result/${store.currentResult.id}`)
  }
})

const startLoveTiming = () => {
  store.startCalculation()
}

const goToArchive = () => {
  router.push('/archive')
}

const selectScenario = (s: LoveTimingScenario) => {
  store.setScenario(s)
}
</script>

<template>
  <div class="w-full h-full overflow-y-auto">
    <div class="max-w-5xl mx-auto px-6 py-12">
      <div class="text-center mb-12">
        <div
          :class="{ 'animate-fade-in': showContent }"
          style="opacity: 0"
        >
          <div class="font-mono text-xs text-gold/80 tracking-[0.3em] mb-4">
            LOVE TIMING DIVINATION
          </div>
          <h1 class="font-display text-4xl md:text-5xl text-gradient-gold tracking-wider mb-4">
            爱情时机占卜
          </h1>
          <div class="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mb-4" />
          <p class="font-body text-lg text-silver/70 leading-relaxed max-w-2xl mx-auto">
            在爱情的十字路口，每一个时机都决定着故事的走向。
            输入你和对方的信息，选择你想要探索的方向，让算法为你揭示
            最佳的行动时机、阶段建议与风险预警。
          </p>
        </div>
      </div>

      <transition
        enter-active-class="transition-all duration-1000 ease-out"
        enter-from-class="opacity-0 translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="showContent" class="mb-12">
          <div class="max-w-2xl mx-auto mb-12">
            <div class="text-center mb-8">
              <div class="font-display text-sm text-gold/80 tracking-wider mb-6">✧ 选择你想探索的方向 ✧</div>
            </div>
            <div class="grid md:grid-cols-3 gap-4">
              <button
                v-for="scenario in scenarios"
                :key="scenario.value"
                @click="selectScenario(scenario.value)"
                class="group relative p-6 rounded-xl border-2 transition-all duration-300 text-left"
                :class="{
                  'bg-gold/20 border-gold shadow-[0_0_20px_rgba(212,175,55,0.2)': store.scenario === scenario.value,
                  'bg-glass/30 border-silver/20 hover:border-gold/40': store.scenario !== scenario.value
                }"
              >
                <div class="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110"
                  :class="{ 'text-gold': store.scenario === scenario.value, 'text-silver/60': store.scenario !== scenario.value }"
                >
                  {{ scenario.icon }}
                </div>
                <div class="font-display text-lg mb-1"
                  :class="{ 'text-gold': store.scenario === scenario.value, 'text-silver': store.scenario !== scenario.value }"
                >
                  {{ scenario.label }}
                </div>
                <div class="text-sm text-silver/60">{{ scenario.desc }}</div>
                <div
                  v-if="store.scenario === scenario.value"
                  class="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold flex items-center justify-center text-cosmic-900 text-sm"
                >
                  ✓
                </div>
              </button>
            </div>
          </div>

          <div class="max-w-2xl mx-auto mb-12 p-6 rounded-xl bg-glass/30 border border-gold/20">
            <div class="text-center mb-6">
              <div class="font-display text-sm text-gold/80 tracking-wider mb-4">✧ 你的信息 ✧</div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <MysticInput
                v-model="store.yourName"
                label="你的姓名"
                placeholder="请输入你的姓名"
                :maxlength="30"
              />
              
              <MysticInput
                v-model="store.yourBirthDate"
                type="date"
                label="你的出生日期"
              />
            </div>
          </div>

          <div class="max-w-2xl mx-auto mb-12 p-6 rounded-xl bg-glass/30 border border-purple/20">
            <div class="text-center mb-6">
              <div class="font-display text-sm text-purple/80 tracking-wider mb-4">✧ 对方的信息 ✧</div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <MysticInput
                v-model="store.theirName"
                label="对方姓名"
                placeholder="请输入对方的姓名"
                :maxlength="30"
              />
              
              <MysticInput
                v-model="store.theirBirthDate"
                type="date"
                label="对方出生日期"
              />
            </div>
          </div>

          <div class="max-w-2xl mx-auto mb-12 p-6 rounded-xl bg-glass/30 border border-silver/20">
            <div class="text-center mb-6">
              <div class="font-display text-sm text-silver/80 tracking-wider mb-4">✧ 当前状况（选填）</div>
            </div>
            <MysticInput
              v-model="store.currentSituation"
              type="textarea"
              label="简单描述一下你们当前的关系状态"
              placeholder="例如：我们是认识三个月，目前处于暧昧阶段，想要确认关系..."
              :maxlength="300"
            />
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
                <span class="font-mono text-xs text-silver/60">正在解析你们的爱情能量...</span>
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
              @click="startLoveTiming"
            >
              <span class="text-xl">♥</span>
              开启爱情时机解析
              <span class="text-xl">♥</span>
            </MysticButton>
            
            <p v-if="!store.canStartCalculation" class="text-sm text-silver/50 font-mono">
              请填写你和对方的姓名及出生日期
            </p>

            <div class="mt-8">
              <MysticButton variant="ghost" size="sm" @click="goToArchive">
                ☰ 查看档案
              </MysticButton>
            </div>
          </div>

          <div class="mt-16 pt-8 border-t border-silver/20">
            <p class="font-mono text-xs text-silver/60 tracking-wider">
              时机解析基于你们的核心数字与关系能量共振生成
            </p>
            <p class="font-mono text-xs text-silver/50 tracking-wider mt-2">
              相同输入 → 相同输出 · 确定性算法 · 可独立验证
            </p>
          </div>
        </div>
      </transition>

      <div class="mt-16 grid grid-cols-3 gap-4 text-center">
        <div class="p-4 rounded-lg bg-gold/5 border border-gold/10">
          <div class="font-display text-2xl text-gold mb-2">☀</div>
          <div class="font-display text-sm text-gold/80 mb-1">阶段建议</div>
          <div class="font-mono text-xs text-silver/60">每个阶段的行动指南</div>
        </div>
        <div class="p-4 rounded-lg bg-red-500/5 border border-red-500/10">
          <div class="font-display text-2xl text-red-400 mb-2">⚠</div>
          <div class="font-display text-sm text-red-400/80 mb-1">风险预警</div>
          <div class="font-mono text-xs text-silver/60">需要注意的潜在问题</div>
        </div>
        <div class="p-4 rounded-lg bg-purple/5 border border-purple/10">
          <div class="font-display text-2xl text-purple mb-2">✦</div>
          <div class="font-display text-sm text-purple/80 mb-1">行动窗口</div>
          <div class="font-mono text-xs text-silver/60">最佳行动的黄金时间</div>
        </div>
      </div>
    </div>
  </div>
</template>
