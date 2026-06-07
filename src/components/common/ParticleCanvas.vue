<script setup lang="ts">
import { ref } from 'vue'
import { useParticleSystem } from '@/composables/useParticleSystem'

const canvasRef = ref<HTMLCanvasElement | null>(null)
useParticleSystem(canvasRef)
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 z-0 pointer-events-auto"
  />
</template>
