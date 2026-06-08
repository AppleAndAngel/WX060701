<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTimeCapsuleStore } from '@/stores/timeCapsule'
import MysticButton from '@/components/common/MysticButton.vue'
import type { TimeCapsuleResult } from '@/types'

const router = useRouter()
const store = useTimeCapsuleStore()
const activeTab = ref<'locked' | 'available' | 'completed'>('locked')
const isLoading = ref(true)

const lockedCapsules = ref<TimeCapsuleResult[]>([])
const availableCapsules = ref<TimeCapsuleResult[]>([])
const completedCapsules = ref<TimeCapsuleResult[]>([])

const currentList = computed(() => {
  switch (activeTab.value) {
    case 'locked': return lockedCapsules.value
    case 'available': return availableCapsules.value
    case 'completed': return completedCapsules.value
    default: return []
  }
})

const tabCounts = computed(() => ({
  locked: lockedCapsules.value.length,
  available: availableCapsules.value.length,
  completed: completedCapsules.value.length
}))

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDaysRemaining = (unlockAt: number) => {
  const now = Date.now()
  const diff = unlockAt - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const getDaysSinceCreation = (createdAt: number) => {
  const now = Date.now()
  const diff = now - createdAt
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const goToCreate = () => {
  store.reset()
  router.push('/time-capsule')
}

const goToUnlock = (id: string) => {
  router.push(`/time-capsule/unlock/${id}`)
}

const goToView = (id: string) => {
  router.push(`/time-capsule/view/${id}`)
}

const viewCapsule = (capsule: TimeCapsuleResult) => {
  if (capsule.isUnlocked) {
    goToView(capsule.id)
  } else if (Date.now() >= capsule.unlockAt) {
    goToUnlock(capsule.id)
  }
}

const loadCapsules = () => {
  lockedCapsules.value = store.getLockedCapsules()
  availableCapsules.value = store.getAvailableCapsules()
  completedCapsules.value = store.getCompletedCapsules()
}

onMounted(() => {
  loadCapsules()
  isLoading.value = false
})
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-none px-6 py-4 border-b border-silver/10 bg-cosmic-900/80 backdrop-blur-sm">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <h1 class="font-display text-2xl text-gold tracking-wider">
          ⏳ 我的时间胶囊
        </h1>
        <MysticButton variant="primary" size="sm" @click="goToCreate">
          ✦ 封存新胶囊
        </MysticButton>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto px-6 py-8">
      <div v-if="isLoading" class="w-full h-full flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p class="font-display text-gold tracking-wider">加载中...</p>
        </div>
      </div>
      
      <template v-else>
        <div class="max-w-4xl mx-auto">
          <div class="flex justify-center gap-2 mb-8 border-b border-silver/20">
            <button
              @click="activeTab = 'available'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'available',
                'text-silver/70 hover:text-silver': activeTab !== 'available'
              }"
            >
              可解锁 ({{ tabCounts.available }})
              <div
                v-if="activeTab === 'available'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'locked'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'locked',
                'text-silver/70 hover:text-silver': activeTab !== 'locked'
              }"
            >
              封存中 ({{ tabCounts.locked }})
              <div
                v-if="activeTab === 'locked'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
            <button
              @click="activeTab = 'completed'"
              class="px-6 py-3 font-display tracking-wider text-sm transition-all duration-300 relative"
              :class="{
                'text-gold': activeTab === 'completed',
                'text-silver/70 hover:text-silver': activeTab !== 'completed'
              }"
            >
              已完成 ({{ tabCounts.completed }})
              <div
                v-if="activeTab === 'completed'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
              />
            </button>
          </div>
          
          <div v-if="currentList.length === 0" class="text-center py-16">
            <div class="text-6xl mb-6 opacity-50">⏳</div>
            <h3 class="font-display text-xl text-gold mb-4">
              {{ activeTab === 'available' ? '暂无可解锁的胶囊' : 
                 activeTab === 'locked' ? '暂无封存中的胶囊' : '暂无已完成的胶囊' }}
            </h3>
            <p class="font-body text-silver/70 mb-8">
              {{ activeTab === 'available' ? '请耐心等待封存中的胶囊到达约定日期' :
                 activeTab === 'locked' ? '封存你的第一个时间胶囊，与未来的自己对话' :
                 '解锁时间胶囊并完成现实对照后，将显示在这里' }}
            </p>
            <MysticButton variant="primary" @click="goToCreate">
              ✦ 封存时间胶囊
            </MysticButton>
          </div>
          
          <div v-else class="grid md:grid-cols-2 gap-6">
            <div
              v-for="capsule in currentList"
              :key="capsule.id"
              class="p-6 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.02]"
              :class="{
                'bg-gold/5 border-gold/30 hover:border-gold/50': activeTab === 'available',
                'bg-silver/5 border-silver/20 hover:border-silver/40': activeTab === 'locked',
                'bg-purple/5 border-purple/30 hover:border-purple/50': activeTab === 'completed'
              }"
              @click="viewCapsule(capsule)"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="text-4xl">{{ capsule.seal.sealSymbol }}</div>
                <div
                  class="px-3 py-1 rounded-full text-xs font-mono"
                  :class="{
                    'bg-gold/20 text-gold': activeTab === 'available',
                    'bg-silver/20 text-silver/70': activeTab === 'locked',
                    'bg-purple/20 text-purple': activeTab === 'completed'
                  }"
                >
                  {{ activeTab === 'available' ? '可解锁' :
                     activeTab === 'locked' ? '封存中' : '已完成' }}
                </div>
              </div>
              
              <h3 class="font-display text-lg text-gold mb-2 line-clamp-1">
                {{ capsule.input.question }}
              </h3>
              
              <div class="space-y-2 text-sm font-mono mb-4">
                <div class="flex justify-between text-silver/70">
                  <span>封存日期</span>
                  <span class="text-silver/90">{{ formatDate(capsule.createdAt) }}</span>
                </div>
                <div class="flex justify-between text-silver/70">
                  <span>约定开启</span>
                  <span class="text-gold">{{ formatDate(capsule.unlockAt) }}</span>
                </div>
                <div v-if="activeTab === 'locked'" class="flex justify-between text-silver/70">
                  <span>距离开启</span>
                  <span class="text-gold">{{ getDaysRemaining(capsule.unlockAt) }} 天</span>
                </div>
                <div v-else-if="activeTab === 'available'" class="flex justify-between text-silver/70">
                  <span>已等待</span>
                  <span class="text-gold">{{ getDaysSinceCreation(capsule.createdAt) }} 天</span>
                </div>
                <div v-else-if="activeTab === 'completed' && capsule.realityCheck" class="flex justify-between text-silver/70">
                  <span>预测准确度</span>
                  <span class="text-gold">{{ capsule.realityCheck.accuracyRating }}%</span>
                </div>
              </div>
              
              <div class="flex items-center gap-2 text-xs text-silver/60">
                <span class="px-2 py-0.5 rounded bg-cosmic-800/50">
                  生命路径 {{ capsule.coreNumbers.lifePath }}
                </span>
                <span class="px-2 py-0.5 rounded bg-cosmic-800/50">
                  命运 {{ capsule.coreNumbers.destiny }}
                </span>
                <span class="px-2 py-0.5 rounded bg-cosmic-800/50">
                  {{ capsule.geometry.type }}
                </span>
              </div>
              
              <div v-if="activeTab === 'available'" class="mt-4">
                <MysticButton variant="primary" size="sm" class="w-full" @click.stop="goToUnlock(capsule.id)">
                  ✦ 开启胶囊
                </MysticButton>
              </div>
              <div v-else-if="activeTab === 'completed'" class="mt-4">
                <MysticButton variant="secondary" size="sm" class="w-full" @click.stop="goToView(capsule.id)">
                  查看详情
                </MysticButton>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
