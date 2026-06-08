<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTimeCapsuleStore } from '@/stores/timeCapsule'
import MysticButton from '@/components/common/MysticButton.vue'

const route = useRoute()
const router = useRouter()
const store = useTimeCapsuleStore()
const isLoading = ref(true)
const notFound = ref(false)
const showAnimation = ref(false)

const result = computed(() => store.currentResult)

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getDaysUntilUnlock = () => {
  if (!result.value) return 0
  const now = Date.now()
  const diff = result.value.unlockAt - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const goToCreate = () => {
  store.reset()
  router.push('/time-capsule')
}

const goToList = () => {
  router.push('/time-capsule/list')
}

const goHome = () => {
  router.push('/')
}

onMounted(() => {
  const id = route.params.id as string
  if (store.currentResult?.id === id) {
    isLoading.value = false
    setTimeout(() => {
      showAnimation.value = true
    }, 300)
    return
  }
  
  const loaded = store.loadResult(id)
  if (!loaded) {
    notFound.value = true
  }
  isLoading.value = false
  setTimeout(() => {
    showAnimation.value = true
  }, 300)
})
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
          该时间胶囊可能已被清除或不存在。
        </p>
        <MysticButton @click="goToList">返回胶囊列表</MysticButton>
      </div>
    </div>
    
    <template v-else-if="result">
      <div class="max-w-3xl mx-auto px-6 py-12">
        <div class="text-center mb-12">
          <div
            class="inline-block transition-all duration-1000"
            :class="{ 'opacity-100 scale-100': showAnimation, 'opacity-0 scale-50': !showAnimation }"
          >
            <div class="relative inline-block">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-40 h-40 rounded-full border-2 border-gold/30 animate-pulse" />
                <div class="absolute w-52 h-52 rounded-full border border-gold/20 animate-spin-slow" />
              </div>
              <div class="relative z-10 w-32 h-32 flex items-center justify-center">
                <span class="text-6xl">{{ result.seal.sealSymbol }}</span>
              </div>
            </div>
          </div>
          
          <h1
            class="font-display text-4xl md:text-5xl text-gradient-gold tracking-wider mt-8 mb-4"
            :class="{ 'animate-fade-in': showAnimation }"
            style="opacity: 0"
          >
            时间胶囊已封存
          </h1>
          
          <p
            class="font-body text-xl text-silver/80 italic"
            :class="{ 'animate-fade-in': showAnimation }"
            style="opacity: 0; animation-delay: 0.3s"
          >
            {{ result.seal.sealText }}
          </p>
        </div>
        
        <div
          class="space-y-6 mb-12"
          :class="{ 'animate-fade-in': showAnimation }"
          style="opacity: 0; animation-delay: 0.5s"
        >
          <div class="p-6 rounded-xl bg-silver/5 border border-silver/20">
            <h3 class="font-display text-lg text-gold mb-4 tracking-wider">封存信息</h3>
            <div class="space-y-3 font-mono text-sm">
              <div class="flex justify-between">
                <span class="text-silver/70">封存时间</span>
                <span class="text-gold">{{ formatDate(result.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-silver/70">约定开启</span>
                <span class="text-gold">{{ formatDate(result.unlockAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-silver/70">距离开启</span>
                <span class="text-gold">{{ getDaysUntilUnlock() }} 天</span>
              </div>
            </div>
          </div>
          
          <div class="p-6 rounded-xl bg-silver/5 border border-silver/20">
            <h3 class="font-display text-lg text-gold mb-4 tracking-wider">你留下的问题</h3>
            <div class="p-4 rounded-lg bg-cosmic-800/50 border border-gold/10">
              <p class="font-body text-silver/90 italic text-lg">
                "{{ result.input.question }}"
              </p>
            </div>
          </div>
          
          <div class="p-6 rounded-xl bg-gold/5 border border-gold/20">
            <h3 class="font-display text-lg text-gold mb-4 tracking-wider">封印印记</h3>
            <p class="font-mono text-xs text-gold/70 tracking-wider">
              {{ result.seal.encryptedHint }}
            </p>
          </div>
          
          <div class="p-6 rounded-xl bg-purple/5 border border-purple/20">
            <h3 class="font-display text-lg text-purple mb-4 tracking-wider">核心数字</h3>
            <div class="grid grid-cols-4 gap-3">
              <div class="text-center p-3 rounded-lg bg-cosmic-800/50">
                <div class="font-display text-2xl text-gold">{{ result.coreNumbers.lifePath }}</div>
                <div class="text-xs text-silver/60 mt-1">生命路径</div>
              </div>
              <div class="text-center p-3 rounded-lg bg-cosmic-800/50">
                <div class="font-display text-2xl text-gold">{{ result.coreNumbers.destiny }}</div>
                <div class="text-xs text-silver/60 mt-1">命运</div>
              </div>
              <div class="text-center p-3 rounded-lg bg-cosmic-800/50">
                <div class="font-display text-2xl text-purple">{{ result.coreNumbers.soul }}</div>
                <div class="text-xs text-silver/60 mt-1">灵魂</div>
              </div>
              <div class="text-center p-3 rounded-lg bg-cosmic-800/50">
                <div class="font-display text-2xl text-purple">{{ result.coreNumbers.personality }}</div>
                <div class="text-xs text-silver/60 mt-1">个性</div>
              </div>
            </div>
          </div>
        </div>
        
        <div
          class="p-6 rounded-xl bg-silver/5 border border-silver/20 mb-12"
          :class="{ 'animate-fade-in': showAnimation }"
          style="opacity: 0; animation-delay: 0.7s"
        >
          <p class="font-body text-silver/80 text-center leading-relaxed">
            这个时间胶囊已被数字矩阵封印，在 <span class="text-gold">{{ formatDate(result.unlockAt) }}</span> 之前，
            你无法查看其中的预言内容。请耐心等待时间的流逝，待到约定之日，
            你将看到此刻的命盘判断，并可与那时的现实进行对照。
          </p>
        </div>
        
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4"
          :class="{ 'animate-fade-in': showAnimation }"
          style="opacity: 0; animation-delay: 0.9s"
        >
          <MysticButton variant="primary" size="lg" @click="goToCreate">
            ✦ 再封存一个
          </MysticButton>
          <MysticButton variant="secondary" size="lg" @click="goToList">
            ☰ 查看我的胶囊
          </MysticButton>
          <MysticButton variant="ghost" size="lg" @click="goHome">
            ← 返回首页
          </MysticButton>
        </div>
      </div>
    </template>
  </div>
</template>
