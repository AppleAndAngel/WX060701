<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  fullWidth: false
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const base = 'relative font-display tracking-wider transition-all duration-500 overflow-hidden group'
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-12 py-4 text-lg'
  }
  const variants = {
    primary: 'bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-cosmic-900',
    secondary: 'bg-transparent border border-silver/30 text-silver hover:border-gold hover:text-gold',
    ghost: 'bg-transparent text-silver hover:text-gold border-none'
  }
  const width = props.fullWidth ? 'w-full' : ''
  const disabled = props.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
  
  return `${base} ${sizes[props.size]} ${variants[props.variant]} ${width} ${disabled}`
})

const handleClick = (e: MouseEvent) => {
  if (!props.disabled) {
    emit('click', e)
  }
}
</script>

<template>
  <button :class="buttonClasses" @click="handleClick">
    <span class="relative z-10 flex items-center justify-center gap-2">
      <slot />
    </span>
    <span
      v-if="variant === 'primary'"
      class="absolute inset-0 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
    />
    <span
      class="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style="background: radial-gradient(circle at center, rgba(212, 175, 55, 0.3), transparent 70%)"
    />
  </button>
</template>
