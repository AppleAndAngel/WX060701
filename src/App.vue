<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import ParticleCanvas from '@/components/common/ParticleCanvas.vue'
import Navigation from '@/components/common/Navigation.vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
</script>

<template>
  <div class="relative w-full h-full overflow-hidden bg-cosmic-900">
    <ParticleCanvas />
    
    <Navigation />
    
    <main class="relative z-10 w-full h-full">
      <RouterView v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  clip-path: circle(0% at 50% 50%);
}

.page-leave-to {
  opacity: 0;
  clip-path: circle(150% at 50% 50%);
}
</style>
