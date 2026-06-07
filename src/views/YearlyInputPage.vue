<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useYearlyStore } from '@/stores/yearly'
import MysticInput from '@/components/common/MysticInput.vue'
import MysticButton from '@/components/common/MysticButton.vue'
import { yearNumberMeanings } from '@/algorithms/yearly'
import { calculateLifePath } from '@/algorithms/numerology'

const router = useRouter()
const store = useYearlyStore()
const showPreview = ref(false)

const currentYear = new Date().getFullYear()
const minYear = 1900
const maxYear = 2100

const yearStr = ref(store.targetYear.toString())

watch(yearStr, (val) => {
  const num = parseInt(val, 10)
  if (!isNaN(num) && num >= minYear && num <= maxYear) {
    store.targetYear = num
    showPreview.value = store.birthDate.length > 0
  }
})

watch(() => store.birthDate, () => {
  showPreview.value = store.birthDate.length > 0 && yearStr.value.length > 0
})

const previewYearNumber = computed(() => {
  if (!store.birthDate || !store.targetYear) return null
  
  try {
    const lifePath = calculateLifePath(store.birthDate).result
    const yearDigits = store.targetYear.toString().split('').map(d => parseInt(d, 10))
    const yearSum = yearDigits.reduce((acc, d) => acc + d, 0)
    
    const reduceNumber = (n: number): number => {
      if (n === 11 || n === 22 || n === 33) return n
      if (n < 10) return n
      return reduceNumber(n.toString().split('').map(d => parseInt(d, 10)).reduce((a, b) => a + b, 0))
    }
    
    const yearReduced = reduceNumber(yearSum)
    const totalSum = lifePath + yearReduced
    return reduceNumber(totalSum)
  } catch {
    return null
  }
})

const previewMeaning = computed(() => {
  if (previewYearNumber.value === null) return null
  return yearNumberMeanings[previewYearNumber.value] || null
})

const handleYearInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  yearStr.value = target.value
}

const startDivination = async () => {
  if (!store.canStartCalculation) return
  
  const result = await store.startCalculation()
  if (result) {
    router.push(`/yearly/result/${result.id}`)
  }
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center px-6 py-12">
    <div class="w-full max-w-2xl mx-auto">
      <div class="text-center mb-12">
        <div class="inline-block mb-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-32 h-32 rounded-full border border-gold/20 animate-spin-slow" />
            </div>
            <div class="relative z-10 p-8">
              <span class="text-5xl">☸</span>
            </div>
          </div>
        </div>
        
        <h1 class="font-display text-4xl md:text-5xl text-gradient-gold tracking-wider mb-4">
          年度流年占卜
        </h1>
        
        <div class="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mb-6" />
        
        <p class="font-body text-lg text-silver/80 leading-relaxed">
          选择你想探索的年份，算法将为你揭示<br />
          这一整年的能量主题、阶段走势与关键提醒
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
            选择流年年份
          </label>
          
          <div class="relative">
            <div class="absolute inset-0 rounded-lg bg-silver/5" />
            <div class="absolute inset-0 rounded-lg border border-silver/20 transition-all duration-500 hover:border-gold/50" />
            
            <input
              :value="yearStr"
              type="number"
              :min="minYear"
              :max="maxYear"
              :placeholder="currentYear.toString()"
              class="relative w-full px-4 py-3 bg-transparent font-body text-lg text-silver rounded-lg z-10"
              @input="handleYearInput"
            />
            
            <div class="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 z-20">
              <button
                class="w-8 h-8 flex items-center justify-center text-silver/60 hover:text-gold transition-colors duration-300"
                @click="yearStr = (parseInt(yearStr) - 1).toString()"
              >
                −
              </button>
              <button
                class="w-8 h-8 flex items-center justify-center text-silver/60 hover:text-gold transition-colors duration-300"
                @click="yearStr = (parseInt(yearStr) + 1).toString()"
              >
                +
              </button>
            </div>
          </div>
          
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              v-for="year in [currentYear - 1, currentYear, currentYear + 1, currentYear + 5]"
              :key="year"
              class="px-3 py-1 rounded-full text-sm font-mono transition-all duration-300"
              :class="parseInt(yearStr) === year ? 'bg-gold/20 text-gold border border-gold/50' : 'bg-silver/10 text-silver/70 border border-silver/20 hover:border-gold/50 hover:text-gold'"
              @click="yearStr = year.toString()"
            >
              {{ year }}
            </button>
          </div>
        </div>
        
        <transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-300 ease-in"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div v-if="showPreview && previewMeaning" class="p-6 rounded-xl bg-gold/5 border border-gold/20">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                <span class="font-display text-3xl text-gold">{{ previewYearNumber }}</span>
              </div>
              
              <div class="flex-1">
                <div class="font-display text-xl text-gold mb-2">
                  {{ store.targetYear }} 年流年预览
                </div>
                <div class="font-body text-silver/90 mb-3">
                  主题：{{ previewMeaning.theme }}
                </div>
                <div class="text-sm text-silver/70 leading-relaxed">
                  {{ previewMeaning.essence }}
                </div>
                <div class="flex flex-wrap gap-2 mt-3">
                  <span
                    v-for="keyword in previewMeaning.keywords.slice(0, 3)"
                    :key="keyword"
                    class="px-2 py-0.5 rounded-full text-xs bg-gold/10 text-gold/80"
                  >
                    {{ keyword }}
                  </span>
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
              <span class="animate-spin-slow">☸</span>
              演算中...
            </template>
            <template v-else>
              <span>☸</span>
              开始流年占卜
              <span>☸</span>
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
          流年数字 = 生命路径数 + 年份数位和，约简后得到 1-9 或主数字 (11, 22, 33)。
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
            正在解码 {{ store.targetYear }} 年的能量场域...
          </p>
          <p class="mt-2 font-mono text-xs text-silver/60">
            整合生命路径 · 计算流年数字 · 生成月度解读
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>
