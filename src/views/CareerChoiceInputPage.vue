<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCareerChoiceStore } from '@/stores/careerChoice'
import MysticButton from '@/components/common/MysticButton.vue'
import MysticInput from '@/components/common/MysticInput.vue'

const router = useRouter()
const store = useCareerChoiceStore()
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
    router.push(`/career-choice/result/${store.currentResult.id}`)
  }
})

const startCareerChoice = () => {
  store.startCalculation()
}

const goToArchive = () => {
  router.push('/archive')
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
            CAREER CROSSROADS DIVINATION
          </div>
          <h1 class="font-display text-4xl md:text-5xl text-gradient-gold tracking-wider mb-4">
            职业抉择占卜
          </h1>
          <div class="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mb-4" />
          <p class="font-body text-lg text-silver/70 leading-relaxed max-w-2xl mx-auto">
            人生的岔路口上，每一个选择都指向不同的未来。
            输入你的信息和两个待选方向，让算法为你揭示两条路径的能量图谱，
            看清各自的优势、代价与更适合行动的方向。
          </p>
        </div>
      </div>

      <transition
        enter-active-class="transition-all duration-1000 ease-out"
        enter-from-class="opacity-0 translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="showContent" class="mb-12">
          <div class="max-w-2xl mx-auto mb-12 p-6 rounded-xl bg-glass/30 border border-gold/20">
            <div class="text-center">
              <div class="font-display text-sm text-gold/80 tracking-wider mb-4">✧ 个人信息 ✧</div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <MysticInput
                v-model="store.name"
                label="姓名"
                placeholder="请输入你的姓名"
                :maxlength="30"
              />
              
              <MysticInput
                v-model="store.birthDate"
                type="date"
                label="出生日期"
              />
            </div>
          </div>

          <div class="relative">
            <div class="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent transform -translate-x-1/2" />
            
            <div class="grid md:grid-cols-2 gap-8 relative">
              <div class="space-y-6 p-8 rounded-2xl bg-glass/50 border border-gold/20 relative">
                <div class="absolute -top-3 left-8 px-4 bg-cosmic-900">
                  <span class="font-display text-gold tracking-wider text-sm">
                    ☽ 选项 A
                  </span>
                </div>
                
                <MysticInput
                  v-model="store.optionA.name"
                  label="选择名称"
                  placeholder="如：转行做产品经理"
                  :maxlength="30"
                />
                
                <MysticInput
                  v-model="store.optionA.description"
                  type="textarea"
                  label="详细描述"
                  placeholder="简要描述这个选择的具体内容、你对它的期待等..."
                  :maxlength="200"
                />
              </div>

              <div class="space-y-6 p-8 rounded-2xl bg-glass/50 border border-purple/30 relative">
                <div class="absolute -top-3 left-8 px-4 bg-cosmic-900">
                  <span class="font-display text-purple tracking-wider text-sm">
                    ☾ 选项 B
                  </span>
                </div>
                
                <MysticInput
                  v-model="store.optionB.name"
                  label="选择名称"
                  placeholder="如：继续做技术开发"
                  :maxlength="30"
                />
                
                <MysticInput
                  v-model="store.optionB.description"
                  type="textarea"
                  label="详细描述"
                  placeholder="简要描述这个选择的具体内容、你对它的期待等..."
                  :maxlength="200"
                />
              </div>
            </div>

            <div class="flex justify-center mt-6">
              <button
                @click="store.swapOptions"
                class="flex items-center gap-2 px-6 py-2 text-sm font-mono text-silver/60 hover:text-gold transition-colors duration-300 group"
              >
                <span class="transition-transform duration-300 group-hover:rotate-180">⇄</span>
                交换选项
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
                <span class="font-mono text-xs text-silver/60">正在推演两条路径的能量...</span>
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
              @click="startCareerChoice"
            >
              <span class="text-xl">⚖</span>
              开启抉择推演
              <span class="text-xl">⚖</span>
            </MysticButton>
            
            <p v-if="!store.canStartCalculation" class="text-sm text-silver/50 font-mono">
              请填写你的姓名、出生日期以及两个选项的名称
            </p>

            <div class="mt-8">
              <MysticButton variant="ghost" size="sm" @click="goToArchive">
                ☰ 查看档案
              </MysticButton>
            </div>
          </div>

          <div class="mt-16 pt-8 border-t border-silver/20">
            <p class="font-mono text-xs text-silver/60 tracking-wider">
              抉择结果基于你的核心数字与两个选项的能量共振生成
            </p>
            <p class="font-mono text-xs text-silver/50 tracking-wider mt-2">
              相同输入 → 相同输出 · 确定性算法 · 可独立验证
            </p>
          </div>
        </div>
      </transition>

      <div class="mt-16 grid grid-cols-3 gap-4 text-center">
        <div class="p-4 rounded-lg bg-gold/5 border border-gold/10">
          <div class="font-display text-2xl text-gold mb-2">✓</div>
          <div class="font-display text-sm text-gold/80 mb-1">路径优势</div>
          <div class="font-mono text-xs text-silver/60">每条道路的天赋礼物</div>
        </div>
        <div class="p-4 rounded-lg bg-purple/5 border border-purple/10">
          <div class="font-display text-2xl text-purple mb-2">⚠</div>
          <div class="font-display text-sm text-purple/80 mb-1">代价挑战</div>
          <div class="font-mono text-xs text-silver/60">需要付出的努力与牺牲</div>
        </div>
        <div class="p-4 rounded-lg bg-silver/5 border border-silver/10">
          <div class="font-display text-2xl text-silver mb-2">➤</div>
          <div class="font-display text-sm text-silver/80 mb-1">行动方向</div>
          <div class="font-mono text-xs text-silver/60">更适合的前进路径</div>
        </div>
      </div>
    </div>
  </div>
</template>
