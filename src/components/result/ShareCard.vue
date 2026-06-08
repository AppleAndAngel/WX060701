<script setup lang="ts">
import { computed } from 'vue'
import type { ShareCardData } from '@/utils/shareCard'

interface Props {
  cardData: ShareCardData
}

const props = defineProps<Props>()

const numberLabels = ['生命路径', '命运', '灵魂', '个性']
const numbers = computed(() => [
  props.cardData.coreNumbers.lifePath,
  props.cardData.coreNumbers.destiny,
  props.cardData.coreNumbers.soul,
  props.cardData.coreNumbers.personality
])
</script>

<template>
  <div class="share-card-container w-full max-w-md mx-auto">
    <div class="share-card relative overflow-hidden rounded-2xl border-2 border-gold/30 bg-gradient-to-b from-cosmic-900 via-cosmic-700 to-cosmic-900 p-6 glow-gold">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute w-2 h-2 bg-gold/30 rounded-full animate-pulse" style="top: 10%; left: 15%;" />
        <div class="absolute w-1 h-1 bg-silver/30 rounded-full animate-pulse" style="top: 20%; left: 80%; animation-delay: 0.5s;" />
        <div class="absolute w-1.5 h-1.5 bg-gold/20 rounded-full animate-pulse" style="top: 70%; left: 10%; animation-delay: 1s;" />
        <div class="absolute w-2 h-2 bg-purple/20 rounded-full animate-pulse" style="top: 80%; left: 85%; animation-delay: 1.5s;" />
        <div class="absolute w-1 h-1 bg-silver/20 rounded-full animate-pulse" style="top: 40%; left: 5%; animation-delay: 0.3s;" />
        <div class="absolute w-1.5 h-1.5 bg-gold/25 rounded-full animate-pulse" style="top: 60%; left: 92%; animation-delay: 0.8s;" />
      </div>

      <div class="relative z-10">
        <div class="text-center mb-6">
          <div class="text-4xl text-gold mb-3">✧</div>
          <h2 class="font-display text-2xl text-gradient-gold tracking-wider mb-2">
            {{ cardData.cardTitle }}
          </h2>
          <p class="font-body text-silver/70 text-sm">{{ cardData.chartName }}</p>
        </div>

        <div class="grid grid-cols-4 gap-2 mb-6">
          <div
            v-for="(num, index) in numbers"
            :key="index"
            class="p-3 rounded-xl bg-gold/10 border border-gold/20 text-center"
          >
            <div class="font-display text-2xl text-gold mb-1">{{ num }}</div>
            <div class="text-[10px] font-display tracking-wider text-silver/60">{{ numberLabels[index] }}</div>
          </div>
        </div>

        <div v-if="cardData.secondaryInfo" class="mb-6">
          <div class="p-4 rounded-xl bg-purple/10 border border-purple/20 text-center">
            <div class="font-display text-3xl text-purple mb-1">{{ cardData.secondaryInfo.value }}</div>
            <div class="text-xs font-display tracking-wider text-silver/60">{{ cardData.secondaryInfo.label }}</div>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-silver/5 border border-silver/20 mb-6">
          <p class="font-body text-silver/80 text-sm leading-relaxed">
            {{ cardData.summary }}
          </p>
        </div>

        <div>
          <h4 class="font-display text-sm text-gold mb-3 text-center tracking-wider">关键词</h4>
          <div class="flex flex-wrap justify-center gap-2">
            <span
              v-for="kw in cardData.keywords"
              :key="kw"
              class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 text-xs font-mono border border-gold/20"
            >
              {{ kw }}
            </span>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gold/20 text-center">
          <p class="font-display text-xs text-silver/40 tracking-wider">
            ✧ 数字命理学 · 算法神谕 ✧
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.share-card {
  aspect-ratio: 3 / 4.8;
}
</style>
