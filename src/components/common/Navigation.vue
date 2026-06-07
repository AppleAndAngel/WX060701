<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isOpen = ref(false)

const navItems = [
    { path: '/', label: '入口', symbol: '☽' },
    { path: '/ritual', label: '占卜', symbol: '✧' },
    { path: '/synastry', label: '合盘', symbol: '∞' },
    { path: '/yearly', label: '流年', symbol: '☸' },
    { path: '/archive', label: '档案', symbol: '☰' }
  ]

const currentIndex = computed(() => {
  return navItems.findIndex(item => item.path === route.path)
})

const navigateTo = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
  isOpen.value = false
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 px-8 py-6">
    <div class="flex items-center justify-between">
      <button
        @click="navigateTo('/')"
        class="font-display text-xl tracking-widest text-gold hover:text-white transition-colors duration-300"
      >
        算法占卜屋
      </button>
      
      <div class="hidden md:flex items-center gap-8">
        <button
          v-for="(item, index) in navItems"
          :key="item.path"
          @click="navigateTo(item.path)"
          class="group flex items-center gap-2 transition-all duration-300"
          :class="currentIndex === index ? 'text-gold' : 'text-silver hover:text-gold'"
        >
          <span class="text-lg transition-transform duration-300 group-hover:scale-125">{{ item.symbol }}</span>
          <span class="font-display tracking-wider text-sm">{{ item.label }}</span>
          <span
            v-if="currentIndex === index"
            class="block w-1.5 h-1.5 rounded-full bg-gold animate-pulse-slow"
          />
        </button>
      </div>
      
      <button
        @click="isOpen = !isOpen"
        class="md:hidden flex flex-col gap-1.5 p-2"
      >
        <span
          class="w-6 h-0.5 bg-gold transition-all duration-300"
          :class="isOpen ? 'rotate-45 translate-y-2' : ''"
        />
        <span
          class="w-6 h-0.5 bg-gold transition-all duration-300"
          :class="isOpen ? 'opacity-0' : ''"
        />
        <span
          class="w-6 h-0.5 bg-gold transition-all duration-300"
          :class="isOpen ? '-rotate-45 -translate-y-2' : ''"
        />
      </button>
    </div>
    
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-4"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="isOpen"
        class="md:hidden absolute top-full left-0 right-0 mt-2 px-8 py-6 bg-glass rounded-b-2xl"
      >
        <div class="flex flex-col gap-4">
          <button
            v-for="item in navItems"
            :key="item.path"
            @click="navigateTo(item.path)"
            class="flex items-center gap-3 py-3 text-left transition-colors duration-300"
            :class="route.path === item.path ? 'text-gold' : 'text-silver hover:text-gold'"
          >
            <span class="text-xl w-8">{{ item.symbol }}</span>
            <span class="font-display tracking-wider">{{ item.label }}</span>
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>
