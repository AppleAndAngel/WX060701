<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDivinationStore } from '@/stores/divination'
import GeometryChart from '@/components/result/GeometryChart.vue'
import InterpretationText from '@/components/result/InterpretationText.vue'
import CalculationTrace from '@/components/result/CalculationTrace.vue'
import ShareCardModal from '@/components/result/ShareCardModal.vue'
import MysticButton from '@/components/common/MysticButton.vue'
import { generateDivinationShareCard } from '@/utils/shareCard'
import type { ShareCardData } from '@/utils/shareCard'

const route = useRoute()
const router = useRouter()
const store = useDivinationStore()
const activeTab = ref<'interpretation' | 'trace'>('interpretation')
const isLoading = ref(true)
const notFound = ref(false)
const showShareModal = ref(false)
const shareCardData = ref<ShareCardData | null>(null)

const result = computed(() => store.currentResult)

const openShareModal = () => {
  if (result.value) {
    shareCardData.value = generateDivinationShareCard(result.value)
    showShareModal.value = true
  }
}

const closeShareModal = () => {
  showShareModal.value = false
}

onMounted(() => {
  const id = route.params.id as string
  if (store.currentResult?.id === id) {
    isLoading.value = false
    return
  }
  
  const loaded = store.loadResult(id)
  if (!loaded) {
    notFound.value = true
  }
  isLoading.value = false
})

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const newDivination = () => {
  store.reset()
  router.push('/ritual')
}

const goToArchive = () => {
  router.push('/archive')
}
</script>

<template>
  <div class="w-full h-full overflow-y-auto">
    <div v-if="isLoading" class="w-full h-full flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p class="font-display text-gold tracking-wider">加载中...</p>
      </div>
    </div>
    
    <div v-else-if="notFound" class="w-full h-full flex items-center justify-center px-6">
      <div class="text-center max-w-md">
        <div class="text-6xl mb-6">✧</div>
        <h2 class="font-display text-2xl text-gold mb-4 tracking-wider">记录未找到</h2>
        <p class="font-body text-silver/70 mb-8">
          该占卜记录可能已被清除或不存在。
        </p>
        <MysticButton @click="goToArchive">返回档案</MysticButton>
      </div>
    </div>
    
    <template v-else-if="result">
      <div class="max-w-6xl mx-auto px-6 py-12">
        <div class="text-center mb-12">
          <div class="font-mono text-xs text-silver/60 tracking-wider mb-4">
            {{ formatDate(result.createdAt) }}
          </div>
          <h1 class="font-display text-4xl md:text-5xl text-gradient-gold tracking-wider mb-4">
            占卜结果
          </h1>
          <div class="flex flex-wrap justify-center gap-3 text-sm">
            <span class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 font-mono">
              {{ result.input.name }}
            </span>
            <span class="px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 font-mono">
              {{ result.input.birthDate }}
            </span>
            <span
              v-if="result.input.query"
              class="px-3 py-1 rounded-full bg-purple/10 text-purple/80 border border-purple/20 font-mono"
            >
              {{ result.input.query }}
            </span>
          </div>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 class="font-display text-xl text-gold mb-6 text-center tracking-wider">
              你的命盘
            </h3>
            <GeometryChart
              :geometry="result.geometry"
              :core-numbers="result.coreNumbers"
            />
            
            <div class="grid grid-cols-2 gap-4 mt-8">
              <div class="p-4 rounded-lg bg-silver/10 border border-silver/20 text-center">
                <div class="font-display text-3xl text-gold mb-1">
                  {{ result.coreNumbers.lifePath }}
                </div>
                <div class="text-xs font-display tracking-wider text-silver/70">生命路径数</div>
              </div>
              <div class="p-4 rounded-lg bg-silver/10 border border-silver/20 text-center">
                <div class="font-display text-3xl text-gold mb-1">
                  {{ result.coreNumbers.destiny }}
                </div>
                <div class="text-xs font-display tracking-wider text-silver/70">命运数</div>
              </div>
              <div class="p-4 rounded-lg bg-silver/10 border border-silver/20 text-center">
                <div class="font-display text-3xl text-purple mb-1">
                  {{ result.coreNumbers.soul }}
                </div>
                <div class="text-xs font-display tracking-wider text-silver/70">灵魂数</div>
              </div>
              <div class="p-4 rounded-lg bg-silver/10 border border-silver/20 text-center">
                <div class="font-display text-3xl text-purple mb-1">
                  {{ result.coreNumbers.personality }}
                </div>
                <div class="text-xs font-display tracking-wider text-silver/70">个性数</div>
              </div>
            </div>
          </div>
          
          <div>
            <InterpretationText :interpretation="result.interpretation" />
          </div>
        </div>
        
        <div class="mb-12">
          <div class="flex justify-center gap-4 mb-8 border-b border-silver/20">
            <button
              @click="activeTab = 'interpretation'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'interpretation',
                'text-silver/70 hover:text-silver': activeTab !== 'interpretation'
              }"
            >
              诗意解读
              <div
                v-if="activeTab === 'interpretation'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'trace'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'trace',
                'text-silver/70 hover:text-silver': activeTab !== 'trace'
              }"
            >
              数据溯源
              <div
                v-if="activeTab === 'trace'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
          </div>
          
          <transition
            mode="out-in"
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="opacity-0 translate-y-4"
            leave-to-class="opacity-0 -translate-y-4"
          >
            <CalculationTrace
              v-if="activeTab === 'trace'"
              :trace="result.calculationTrace"
              key="trace"
            />
            <div v-else key="interpretation" class="max-w-2xl mx-auto">
              <div class="p-6 rounded-xl bg-silver/10 border border-silver/20">
                <h4 class="font-display text-lg text-gold mb-4">矩阵数据</h4>
                <div class="grid grid-cols-3 gap-2 font-mono text-center">
                  <template v-for="(row, i) in result.matrix" :key="i">
                    <div
                      v-for="(cell, j) in row"
                      :key="`${i}-${j}`"
                      class="p-3 rounded bg-cosmic-800/50 text-gold"
                    >
                      {{ cell.toFixed(2) }}
                    </div>
                  </template>
                </div>
                
                <h4 class="font-display text-lg text-gold mt-8 mb-4">星图数据</h4>
                <div class="space-y-2 font-mono text-sm">
                  <div class="flex justify-between text-silver/80">
                    <span>星体数量</span>
                    <span class="text-gold">{{ result.starMap.positions.length }}</span>
                  </div>
                  <div class="flex justify-between text-silver/80">
                    <span>连接数量</span>
                    <span class="text-gold">{{ result.starMap.connections.length }}</span>
                  </div>
                  <div class="flex justify-between text-silver/80">
                    <span>几何类型</span>
                    <span class="text-gold">{{ result.geometry.type }}</span>
                  </div>
                  <div class="flex justify-between text-silver/80">
                    <span>顶点数量</span>
                    <span class="text-gold">{{ result.geometry.vertices.length }}</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MysticButton variant="primary" size="lg" @click="newDivination">
            ✦ 再次占卜
          </MysticButton>
          <MysticButton variant="secondary" size="lg" @click="openShareModal">
            ✧ 生成分享卡
          </MysticButton>
          <MysticButton variant="secondary" size="lg" @click="goToArchive">
            ☰ 查看档案
          </MysticButton>
        </div>
      </div>
    </template>

    <ShareCardModal
      :show="showShareModal"
      :card-data="shareCardData"
      @close="closeShareModal"
    />
  </div>
</template>
