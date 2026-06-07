<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDreamInterpretationStore } from '@/stores/dreamInterpretation'
import MysticInput from '@/components/common/MysticInput.vue'
import MysticButton from '@/components/common/MysticButton.vue'
import { numberDreamMeanings } from '@/algorithms/dreamInterpretation'
import { calculateLifePath } from '@/algorithms/numerology'
import { reduceNumber } from '@/utils/math'

const router = useRouter()
const store = useDreamInterpretationStore()
const showPreview = ref(false)

const previewDreamNumber = computed(() => {
  if (!store.birthDate || !store.dreamContent || !store.dreamMood) return null

  try {
    const lifePath = calculateLifePath(store.birthDate).result

    const cleanContent = store.dreamContent.toLowerCase().replace(/[^a-z\u4e00-\u9fa5]/g, '')
    const cleanMood = store.dreamMood.toLowerCase().replace(/[^a-z\u4e00-\u9fa5]/g, '')

    let contentSum = 0
    for (let i = 0; i < cleanContent.length; i++) {
      const code = cleanContent.charCodeAt(i)
      contentSum += code % 9 || 9
    }

    let moodSum = 0
    for (let i = 0; i < cleanMood.length; i++) {
      const code = cleanMood.charCodeAt(i)
      moodSum += code % 9 || 9
    }

    const contentReduced = reduceNumber(contentSum)
    const moodReduced = reduceNumber(moodSum)
    const timestamp = Date.now()
    const timestampDigits = timestamp.toString().slice(-8)
    const timestampSum = timestampDigits.split('').reduce((acc, d) => acc + parseInt(d, 10), 0)
    const timestampReduced = reduceNumber(timestampSum)

    const totalSum = contentReduced + moodReduced + timestampReduced + lifePath
    return reduceNumber(totalSum)
  } catch {
    return null
  }
})

const previewMeaning = computed(() => {
  if (previewDreamNumber.value === null) return null
  return numberDreamMeanings[previewDreamNumber.value] || null
})

const startDivination = async () => {
  if (!store.canStartCalculation) return

  const result = await store.startCalculation()
  if (result) {
    router.push(`/dream-interpretation/result/${result.id}`)
  }
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
    <div class="w-full max-w-2xl mx-auto">
      <div class="text-center mb-12">
        <div class="inline-block mb-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-32 h-32 rounded-full border border-gold/20 animate-spin-slow" />
            </div>
            <div class="relative z-10 p-8">
              <span class="text-5xl">☽</span>
            </div>
          </div>
        </div>

        <h1 class="font-display text-4xl md:text-5xl text-gradient-gold tracking-wider mb-4">
          梦境解读占卜
        </h1>

        <div class="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mb-6" />

        <p class="font-body text-lg text-silver/80 leading-relaxed">
          记录你的梦境片段，算法将结合数字命盘与符文象征<br />
          为你解读潜意识的讯息、情绪暗流与行动指引
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

        <div class="relative group">
          <label class="block mb-2 font-display text-sm tracking-wider text-silver/70">
            梦中的情绪基调
          </label>

          <div class="relative">
            <div class="absolute inset-0 rounded-lg bg-silver/5" />
            <div class="absolute inset-0 rounded-lg border border-silver/20 transition-all duration-500 hover:border-gold/50" />

            <select
              v-model="store.dreamMood"
              class="relative w-full px-4 py-3 bg-transparent font-body text-lg text-silver rounded-lg z-10 appearance-none cursor-pointer"
            >
              <option
                v-for="option in store.moodOptions"
                :key="option.value"
                :value="option.value"
                class="bg-cosmic-900"
              >
                {{ option.label }}
              </option>
            </select>

            <div class="absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <span class="text-silver/60">▾</span>
            </div>
          </div>
        </div>

        <MysticInput
          v-model="store.dreamContent"
          type="textarea"
          label="梦境内容描述"
          placeholder="请尽可能详细地描述你的梦境，包括场景、人物、事件、感受等（至少10个字）"
          :maxlength="500"
        />

        <transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-300 ease-in"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div
            v-if="showPreview && previewMeaning && store.dreamContent.length >= 10"
            class="p-6 rounded-xl bg-gold/5 border border-gold/20"
          >
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                <span class="font-display text-3xl text-gold">{{ previewDreamNumber }}</span>
              </div>

              <div class="flex-1">
                <div class="font-display text-xl text-gold mb-2">
                  梦境数字预览
                </div>
                <div class="font-body text-silver/90 mb-3">
                  主题：{{ previewMeaning.theme }}
                </div>
                <div class="text-sm text-silver/70 leading-relaxed">
                  {{ previewMeaning.essence }}
                </div>
              </div>
            </div>
          </div>
        </transition>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <MysticButton
            variant="ghost"
            size="lg"
            @click="goBack"
          >
            ← 返回
          </MysticButton>

          <MysticButton
            variant="primary"
            size="lg"
            :disabled="!store.canStartCalculation || store.isCalculating"
            @click="startDivination"
          >
            <template v-if="store.isCalculating">
              <span class="animate-spin-slow">☽</span>
              解码中...
            </template>
            <template v-else>
              <span>☽</span>
              开始梦境解读
              <span>☽</span>
            </template>
          </MysticButton>
        </div>
      </div>

      <div class="mt-12 p-6 rounded-xl bg-silver/10 border border-silver/20">
        <p class="font-mono text-xs text-silver/70 leading-relaxed">
          <span class="text-gold">隐私说明：</span>
          所有数据仅在你的本地浏览器中处理，不会上传至任何服务器。
          计算完成后，结果将自动保存到本地档案。
        </p>
        <p class="font-mono text-xs text-silver/60 leading-relaxed mt-2">
          <span class="text-gold/80">算法说明：</span>
          梦境数字 = 内容编码 + 情绪编码 + 时间能量 + 灵魂数字，约简后得到 1-9 或主数字 (11, 22, 33)。
          相同输入将产生完全相同的输出。
        </p>
      </div>
    </div>

    <transition
      v-if="store.isCalculating"
      enter-active-class="transition-all duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-300"
      leave-to-class="opacity-0"
    >
      <div class="fixed inset-0 bg-cosmic-900/95 backdrop-blur-md flex items-center justify-center z-50">
        <div class="text-center">
          <div class="relative w-32 h-32 mx-auto mb-8">
            <div class="absolute inset-0 rounded-full border-2 border-gold/20 animate-spin-slow" />
            <div class="absolute inset-4 rounded-full border-2 border-gold/30 animate-spin-slow" style="animation-direction: reverse; animation-duration: 4s" />
            <div class="absolute inset-8 rounded-full border-2 border-gold/40 animate-spin-slow" style="animation-duration: 6s" />
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="font-display text-2xl text-gold animate-pulse-slow">
                {{ Math.round(store.calculationProgress) }}%
              </span>
            </div>
          </div>

          <div class="w-64 h-1 bg-silver/20 rounded-full overflow-hidden mx-auto">
            <div
              class="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full transition-all duration-300"
              :style="{ width: `${store.calculationProgress}%` }"
            />
          </div>

          <p class="mt-6 font-display text-lg text-gold/80 tracking-wider">
            正在解码潜意识的讯息...
          </p>
          <p class="mt-2 font-mono text-xs text-silver/60">
            分析梦境符号 · 计算情绪能量 · 整合数字命盘
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>
