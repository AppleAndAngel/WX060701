<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: string
  type?: string
  placeholder?: string
  label?: string
  maxlength?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  label: '',
  maxlength: 100
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)
const isFocused = ref(false)
const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

const isFilled = computed(() => localValue.value.length > 0)

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  localValue.value = target.value
  emit('update:modelValue', target.value)
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}
</script>

<template>
  <div class="relative group">
    <label
      v-if="label"
      class="block mb-2 font-display text-sm tracking-wider text-silver/70 transition-colors duration-300"
      :class="{ 'text-gold': isFocused || isFilled }"
    >
      {{ label }}
    </label>
    
    <div class="relative">
      <div
        class="absolute inset-0 rounded-lg transition-all duration-500"
        :class="{
          'bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20': isFocused,
          'bg-silver/5': !isFocused
        }"
      />
      
      <div
        class="absolute inset-0 rounded-lg border transition-all duration-500"
        :class="{
          'border-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]': isFocused,
          'border-silver/20': !isFocused && !isFilled,
          'border-gold/50': !isFocused && isFilled
        }"
      />
      
      <input
        v-if="type !== 'textarea'"
        ref="inputRef"
        :type="type"
        :value="localValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        class="relative w-full px-4 py-3 bg-transparent font-body text-lg text-silver rounded-lg z-10"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <textarea
        v-else
        ref="inputRef"
        :value="localValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        rows="4"
        class="relative w-full px-4 py-3 bg-transparent font-body text-lg text-silver rounded-lg resize-none z-10"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <div
        v-if="isFocused"
        class="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
      />
      <div
        v-if="isFocused"
        class="absolute -bottom-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
      />
    </div>
    
    <div class="absolute -bottom-5 right-0 text-xs font-mono text-silver/60">
      {{ localValue.length }}/{{ maxlength }}
    </div>
  </div>
</template>
