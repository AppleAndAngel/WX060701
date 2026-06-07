<script setup lang="ts">
import { computed } from 'vue'
import { useDivinationStore } from '@/stores/divination'
import type { Rune } from '@/types'

const store = useDivinationStore()

const isSelected = (runeId: number) => {
  return store.selectedRunes.includes(runeId)
}

const handleRuneClick = (rune: Rune) => {
  store.toggleRune(rune.id)
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <h3 class="font-display text-2xl text-gold mb-3 tracking-wider">选择符文</h3>
      <p class="font-body text-silver/70">
        请选择 <span class="text-gold">3-5</span> 个与你产生共鸣的符文
        <span class="ml-2 text-gold">{{ store.selectedRunes.length }}/5</span>
      </p>
    </div>
    
    <div class="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
      <button
        v-for="rune in store.runes"
        :key="rune.id"
        @click="handleRuneClick(rune)"
        class="group relative aspect-square flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-500"
        :class="{
          'bg-gold/20 border-2 border-gold glow-gold': isSelected(rune.id),
          'bg-silver/5 border border-silver/20 hover:border-gold/50 hover:bg-silver/10': !isSelected(rune.id)
        }"
      >
        <div
          class="text-4xl md:text-5xl mb-3 transition-all duration-500"
          :class="{
            'text-gold scale-110': isSelected(rune.id),
            'text-silver group-hover:text-gold': !isSelected(rune.id)
          }"
        >
          {{ rune.symbol }}
        </div>
        <div
          class="font-display text-sm tracking-wider transition-colors duration-300"
          :class="{
            'text-gold': isSelected(rune.id),
            'text-silver/70 group-hover:text-silver': !isSelected(rune.id)
          }"
        >
          {{ rune.name }}
        </div>
        <div
          class="text-xs text-center mt-1 font-body transition-opacity duration-300"
          :class="{
            'text-gold/70 opacity-100': isSelected(rune.id),
            'text-silver/40 opacity-0 group-hover:opacity-100': !isSelected(rune.id)
          }"
        >
          {{ rune.meaning }}
        </div>
        
        <div
          v-if="isSelected(rune.id)"
          class="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold flex items-center justify-center text-cosmic-900 font-bold text-sm"
        >
          {{ store.selectedRunes.indexOf(rune.id) + 1 }}
        </div>
        
        <div
          v-if="isSelected(rune.id)"
          class="absolute inset-0 rounded-xl animate-pulse-slow pointer-events-none"
          style="box-shadow: 0 0 30px rgba(212, 175, 55, 0.3), inset 0 0 30px rgba(212, 175, 55, 0.1)"
        />
      </button>
    </div>
  </div>
</template>
