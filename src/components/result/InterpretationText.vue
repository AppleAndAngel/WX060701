<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import type { Interpretation } from '@/types'

interface Props {
  interpretation: Interpretation
}

const props = defineProps<Props>()
const displayedParagraphs = ref<string[]>([])
const displayedKeywords = ref<string[]>([])
const isAnimating = ref(false)
const currentParagraph = ref(0)
const currentChar = ref(0)

const typewriterEffect = async () => {
  if (!props.interpretation?.paragraphs?.length || isAnimating.value) return
  
  isAnimating.value = true
  displayedParagraphs.value = []
  displayedKeywords.value = []
  currentParagraph.value = 0
  currentChar.value = 0
  
  for (let p = 0; p < props.interpretation.paragraphs.length; p++) {
    const paragraph = props.interpretation.paragraphs[p]
    displayedParagraphs.value.push('')
    currentParagraph.value = p
    
    for (let c = 0; c < paragraph.length; c++) {
      displayedParagraphs.value[p] += paragraph[c]
      currentChar.value = c
      await new Promise(resolve => setTimeout(resolve, 20))
      await nextTick()
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  for (let k = 0; k < props.interpretation.keywords.length; k++) {
    displayedKeywords.value.push(props.interpretation.keywords[k])
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  isAnimating.value = false
}

onMounted(() => {
  setTimeout(typewriterEffect, 500)
})

watch(() => props.interpretation, () => {
  setTimeout(typewriterEffect, 300)
})

const skipAnimation = () => {
  if (!props.interpretation) return
  displayedParagraphs.value = [...props.interpretation.paragraphs]
  displayedKeywords.value = [...props.interpretation.keywords]
  isAnimating.value = false
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <div class="text-center mb-8">
      <h2 class="font-display text-3xl md:text-4xl text-gradient-gold mb-4 tracking-wider">
        {{ interpretation?.title }}
      </h2>
      
      <div class="flex flex-wrap justify-center gap-2 mb-6 min-h-[32px]">
        <span
          v-for="(keyword, idx) in displayedKeywords"
          :key="idx"
          class="px-3 py-1 text-xs font-display tracking-wider rounded-full bg-gold/10 text-gold border border-gold/30 animate-fade-in"
        >
          {{ keyword }}
        </span>
      </div>
    </div>
    
    <div class="space-y-6">
      <div
        v-for="(paragraph, idx) in displayedParagraphs"
        :key="idx"
        class="relative pl-6 border-l-2 border-gold/30"
      >
        <div
          class="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gold"
        />
        <p class="font-body text-lg leading-relaxed text-silver/90">
          {{ paragraph }}
          <span
            v-if="isAnimating && currentParagraph === idx && currentChar < interpretation.paragraphs[idx].length"
            class="inline-block w-0.5 h-5 ml-1 bg-gold animate-pulse"
          />
        </p>
      </div>
    </div>
    
    <div
      v-if="interpretation?.warning"
      class="mt-8 p-4 rounded-lg bg-mystic-red/10 border border-mystic-red/30"
    >
      <p class="font-body text-mystic-red/90 flex items-start gap-3">
        <span class="text-xl">⚠</span>
        <span>{{ interpretation.warning }}</span>
      </p>
    </div>
    
    <div
      v-if="isAnimating"
      class="mt-8 text-center"
    >
      <button
        @click="skipAnimation"
        class="text-sm font-display tracking-wider text-silver/50 hover:text-gold transition-colors duration-300"
      >
        点击跳过动画 →
      </button>
    </div>
  </div>
</template>
