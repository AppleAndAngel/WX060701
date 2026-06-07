<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MysticButton from '@/components/common/MysticButton.vue'
import { useDivinationStore } from '@/stores/divination'

const router = useRouter()
const store = useDivinationStore()
const showContent = ref(false)
const showButton = ref(false)

const startDivination = () => {
  store.reset()
  router.push('/ritual')
}

const goToSynastry = () => {
  router.push('/synastry')
}

const goToYearly = () => {
  router.push('/yearly')
}

const goToCareerChoice = () => {
  router.push('/career-choice')
}

const goToLoveTiming = () => {
  router.push('/love-timing')
}

const goToArchive = () => {
  router.push('/archive')
}

onMounted(() => {
  setTimeout(() => {
    showContent.value = true
  }, 500)
  setTimeout(() => {
    showButton.value = true
  }, 2000)
})
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center px-6">
    <div class="text-center max-w-2xl mx-auto">
      <div class="relative mb-12">
        <div
          class="absolute inset-0 flex items-center justify-center"
        >
          <div
            class="w-48 h-48 rounded-full border border-gold/20 animate-spin-slow"
          />
          <div
            class="absolute w-64 h-64 rounded-full border border-gold/10 animate-spin-slow"
            style="animation-direction: reverse; animation-duration: 30s"
          />
          <div
            class="absolute w-32 h-32 rounded-full animate-breathing"
            style="background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)"
          />
        </div>
        
        <div class="relative z-10 py-20">
          <div
            class="inline-block"
            :class="{ 'animate-fade-in': showContent }"
            style="opacity: 0"
          >
            <div class="text-xs font-mono text-gold/80 tracking-[0.3em] mb-4">
              ALGORITHM DIVINATION HOUSE
            </div>
            
            <h1
              class="font-display text-5xl md:text-7xl text-gradient-gold tracking-wider mb-6"
            >
              算法占卜屋
            </h1>
            
            <div class="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mb-6" />
            
            <p class="font-body text-xl text-silver/90 leading-relaxed">
              在确定性与神秘性的边界，<br class="hidden md:block" />
              以算法为媒介，探索理性与感性的交汇点
            </p>
          </div>
        </div>
      </div>
      
      <transition
        enter-active-class="transition-all duration-1000 ease-out"
        enter-from-class="opacity-0 translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="showButton" class="space-y-6">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MysticButton
                size="lg"
                variant="primary"
                @click="startDivination"
              >
                <span class="text-xl">✧</span>
                个人占卜
                <span class="text-xl">✧</span>
              </MysticButton>
              
              <MysticButton
                size="lg"
                variant="secondary"
                @click="goToSynastry"
              >
                <span class="text-xl">∞</span>
                双人合盘
                <span class="text-xl">∞</span>
              </MysticButton>
              
              <MysticButton
                size="lg"
                variant="secondary"
                @click="goToYearly"
              >
                <span class="text-xl">☸</span>
                年度流年
                <span class="text-xl">☸</span>
              </MysticButton>
              
              <MysticButton
                size="lg"
                variant="secondary"
                @click="goToCareerChoice"
              >
                <span class="text-xl">⚖</span>
                职业抉择
                <span class="text-xl">⚖</span>
              </MysticButton>
              
              <MysticButton
                size="lg"
                variant="secondary"
                @click="goToLoveTiming"
              >
                <span class="text-xl">♥</span>
                爱情时机
                <span class="text-xl">♥</span>
              </MysticButton>
              
              <MysticButton
                size="lg"
                variant="ghost"
                @click="goToArchive"
              >
                ☰ 查看档案
              </MysticButton>
            </div>
          
          <div class="mt-16 pt-8 border-t border-silver/20">
            <p class="font-mono text-xs text-silver/70 tracking-wider">
              所有结果基于确定性数学算法生成
            </p>
            <p class="font-mono text-xs text-silver/60 tracking-wider mt-2">
              相同输入 → 相同输出 · 无随机性 · 可独立验证
            </p>
          </div>
        </div>
      </transition>
    </div>
    
    <div class="absolute bottom-8 left-0 right-0 flex justify-center gap-8 text-silver/60">
      <div class="text-center">
        <div class="font-display text-2xl text-gold/80 mb-1">数值</div>
        <div class="font-mono text-xs">生命路径 · 命运 · 灵魂 · 个性</div>
      </div>
      <div class="w-px bg-silver/30" />
      <div class="text-center">
        <div class="font-display text-2xl text-gold/80 mb-1">矩阵</div>
        <div class="font-mono text-xs">变换 · 特征值 · 特征向量</div>
      </div>
      <div class="w-px bg-silver/30" />
      <div class="text-center">
        <div class="font-display text-2xl text-gold/80 mb-1">几何</div>
        <div class="font-mono text-xs">黄金分割 · 神圣几何 · 星图</div>
      </div>
    </div>
  </div>
</template>
