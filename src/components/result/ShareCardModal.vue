<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import ShareCard from './ShareCard.vue'
import MysticButton from '@/components/common/MysticButton.vue'
import type { ShareCardData } from '@/utils/shareCard'
import { generateCardImage } from '@/utils/shareCard'

interface Props {
  show: boolean
  cardData: ShareCardData | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isGenerating = ref(false)
const imageUrl = ref<string | null>(null)
const showSuccess = ref(false)

watch(
  () => props.show,
  async (newVal) => {
    if (newVal && props.cardData) {
      imageUrl.value = null
      showSuccess.value = false
    }
  }
)

const handleGenerateImage = async () => {
  if (!canvasRef.value || !props.cardData) return

  isGenerating.value = true
  try {
    const url = await generateCardImage(props.cardData, canvasRef.value)
    imageUrl.value = url
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('生成图片失败:', error)
  } finally {
    isGenerating.value = false
  }
}

const handleDownload = () => {
  if (!imageUrl.value) return

  const link = document.createElement('a')
  link.href = imageUrl.value
  link.download = `share-card-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleCopyImage = async () => {
  if (!imageUrl.value) return

  try {
    const response = await fetch(imageUrl.value)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('复制图片失败:', error)
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cosmic-900/95 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <div class="w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="bg-cosmic-800/80 rounded-2xl border border-gold/30 p-6 glow-gold">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-display text-xl text-gold tracking-wider">
                ✧ 生成分享卡
              </h3>
              <button
                @click="handleClose"
                class="w-8 h-8 flex items-center justify-center text-silver/60 hover:text-gold transition-colors rounded-full hover:bg-gold/10"
              >
                ✕
              </button>
            </div>

            <div v-if="cardData" class="mb-6">
              <ShareCard :card-data="cardData" />
            </div>

            <canvas ref="canvasRef" class="hidden" />

            <div v-if="imageUrl" class="mb-6">
              <div class="p-4 rounded-xl bg-green-500/10 border border-green-500/30 mb-4">
                <p class="text-green-400 text-sm text-center font-body">
                  ✓ 图片已生成，可以下载或复制
                </p>
              </div>
              <div class="rounded-xl overflow-hidden border border-gold/20">
                <img :src="imageUrl" alt="分享卡" class="w-full" />
              </div>
            </div>

            <div v-if="showSuccess" class="mb-4 p-3 rounded-lg bg-gold/10 border border-gold/30">
              <p class="text-gold text-sm text-center font-body">
                ✓ 操作成功
              </p>
            </div>

            <div class="space-y-3">
              <MysticButton
                variant="primary"
                size="lg"
                full-width
                :disabled="isGenerating"
                @click="handleGenerateImage"
              >
                <span v-if="isGenerating">
                  <span class="inline-block w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin mr-2" />
                  生成中...
                </span>
                <span v-else>✦ 生成分享图片</span>
              </MysticButton>

              <div v-if="imageUrl" class="grid grid-cols-2 gap-3">
                <MysticButton
                  variant="secondary"
                  size="md"
                  @click="handleDownload"
                >
                  ⬇ 下载图片
                </MysticButton>
                <MysticButton
                  variant="secondary"
                  size="md"
                  @click="handleCopyImage"
                >
                  📋 复制图片
                </MysticButton>
              </div>
            </div>

            <p class="mt-6 text-center text-xs text-silver/50 font-body">
              提示：生成的图片可以保存到相册或分享到社交媒体
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
