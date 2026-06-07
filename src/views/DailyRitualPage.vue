<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDailyRitualStore } from '@/stores/dailyRitual'
import MysticButton from '@/components/common/MysticButton.vue'
import { useDivinationStore } from '@/stores/divination'

const router = useRouter()
const store = useDailyRitualStore()
const divinationStore = useDivinationStore()
const showContent = ref(false)

const phases = [
  { key: 'intro', label: '开始', icon: '☀' },
  { key: 'mood', label: '心情', icon: '☺' },
  { key: 'intention', label: '意图', icon: '✦' },
  { key: 'rune', label: '符文', icon: 'ᚠ' },
  { key: 'calculating', label: '演算', icon: '∑' },
  { key: 'complete', label: '完成', icon: '✧' }
]

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

onMounted(() => {
  setTimeout(() => {
    showContent.value = true
  }, 300)
  if (divinationStore.name && divinationStore.birthDate) {
    store.setUserInfo(divinationStore.name, divinationStore.birthDate)
  }
  if (store.hasCheckedInToday) {
    store.loadTodayRecord()
  }
})

const getPhaseIndex = () => {
  return phases.findIndex(p => p.key === store.phase)
}

const canGoNext = () => {
  switch (store.phase) {
    case 'intro': return true
    case 'mood': return store.canProceedToIntention
    case 'intention': return true
    case 'rune': return store.canStartCalculation
    default: return false
  }
}

const canGoBack = () => {
  return ['mood', 'intention', 'rune'].includes(store.phase)
}

const getGeometryPath = computed(() => {
  if (!store.currentResult?.geometry?.vertices?.length) return ''
  const vertices = store.currentResult.geometry.vertices
  return vertices.map((v, i) =>
    `${i === 0 ? 'M' : 'L'} ${v.x} ${v.y}`
  ).join(' ') + ' Z'
})

const getEnergyColor = (level: number) => {
  if (level >= 70) return 'from-emerald-400 to-green-500'
  if (level >= 40) return 'from-gold to-yellow-500'
  return 'from-orange-400 to-red-500'
}

const getTrendIcon = (trend: string) => {
  if (trend === 'rising') return '↑'
  if (trend === 'falling') return '↓'
  return '→'
}

const getTrendText = (trend: string) => {
  if (trend === 'rising') return '上升'
  if (trend === 'falling') return '下降'
  return '平稳'
}

const getTrendColor = (trend: string) => {
  if (trend === 'rising') return 'text-emerald-400'
  if (trend === 'falling') return 'text-orange-400'
  return 'text-silver/70'
}

const goToArchive = () => {
  router.push('/archive')
}

const maxEnergyValue = computed(() => {
  const max = Math.max(...store.cycleData.weekEnergy, 100)
  return Math.ceil(max / 10) * 10
})

const selectedRuneInfo = computed(() => {
  if (!store.currentResult) return null
  return store.runes.find(r => r.id === store.currentResult!.input.selectedRune) || null
})
</script>

<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div v-if="store.phase !== 'complete'" class="flex-none px-6 py-4 border-b border-silver/10 bg-cosmic-900/80 backdrop-blur-sm">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div
            v-for="(phase, index) in phases.slice(0, 5)"
            :key="phase.key"
            class="flex items-center"
          >
            <div
              class="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500"
              :class="{
                'bg-gold/20 text-gold': store.phase === phase.key,
                'text-gold/70': index < getPhaseIndex(),
                'text-silver/50': index > getPhaseIndex()
              }"
            >
              <span class="text-base">{{ phase.icon }}</span>
              <span class="text-xs font-display tracking-wider hidden sm:inline">
                {{ phase.label }}
              </span>
            </div>
            <div
              v-if="index < 4"
              class="w-6 h-px mx-1"
              :class="{
                'bg-gold/40': index < getPhaseIndex(),
                'bg-silver/20': index >= getPhaseIndex()
              }"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <MysticButton
            v-if="canGoBack()"
            variant="ghost"
            size="sm"
            @click="store.prevPhase()"
          >
            ← 上一步
          </MysticButton>
          <MysticButton
            v-if="canGoNext() && store.phase !== 'calculating'"
            variant="primary"
            size="sm"
            @click="store.nextPhase()"
          >
            {{ store.phase === 'rune' ? '开始演算 ✦' : store.phase === 'intro' ? '开始今日签到 ✧' : '下一步 →' }}
          </MysticButton>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-8">
      <transition
        mode="out-in"
        enter-active-class="transition-all duration-500 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="opacity-0 translate-x-8"
        leave-to-class="opacity-0 -translate-x-8"
      >
        <div v-if="store.phase === 'intro'" key="intro" class="max-w-2xl mx-auto">
          <div class="text-center mb-12">
            <div
              :class="{ 'animate-fade-in': showContent }"
              style="opacity: 0"
            >
              <div class="text-8xl mb-6 animate-breathing">☀</div>
              <h2 class="font-display text-4xl text-gradient-gold mb-4 tracking-wider">
                每日仪式签到
              </h2>
              <p class="font-body text-silver/80 text-lg mb-8">
                每一天都是新的开始，让我们通过简短的占卜连接宇宙能量
              </p>
            </div>

            <div v-if="store.totalRituals > 0" class="grid grid-cols-3 gap-6 mb-10">
              <div class="p-4 rounded-xl bg-glass">
                <div class="font-display text-3xl text-gold mb-1">{{ store.consecutiveStreak }}</div>
                <div class="text-xs text-silver/70 font-mono">连续签到</div>
              </div>
              <div class="p-4 rounded-xl bg-glass">
                <div class="font-display text-3xl text-purple mb-1">{{ store.totalRituals }}</div>
                <div class="text-xs text-silver/70 font-mono">累计仪式</div>
              </div>
              <div class="p-4 rounded-xl bg-glass">
                <div class="font-display text-3xl text-cyan-400 mb-1">{{ store.cycleData.averageEnergy }}</div>
                <div class="text-xs text-silver/70 font-mono">平均能量</div>
              </div>
            </div>

            <div v-if="store.hasCheckedInToday" class="p-6 rounded-xl bg-gold/10 border border-gold/30 mb-8">
              <p class="font-display text-gold text-lg mb-2">✓ 今日已完成签到</p>
              <p class="font-body text-silver/70 text-sm">你可以查看今日的仪式结果，或前往档案查看能量轨迹</p>
              <div class="flex justify-center gap-4 mt-4">
                <MysticButton variant="secondary" size="sm" @click="store.nextPhase()">
                  查看今日结果
                </MysticButton>
                <MysticButton variant="ghost" size="sm" @click="goToArchive">
                  查看能量轨迹
                </MysticButton>
              </div>
            </div>
          </div>

          <div class="p-6 rounded-xl bg-silver/10 border border-silver/20">
            <p class="font-mono text-xs text-silver/70 leading-relaxed">
              <span class="text-gold">仪式说明：</span>
              每日仪式通过心情、意图和符文的选择，计算你当天的能量状态与象征主题。
              这些数据将积累为你的个人能量轨迹，帮助你洞察周期变化与内在模式。
            </p>
          </div>
        </div>

        <div v-else-if="store.phase === 'mood'" key="mood" class="max-w-2xl mx-auto">
          <div class="text-center mb-10">
            <h2 class="font-display text-3xl text-gold mb-4 tracking-wider">
              此刻的心情
            </h2>
            <p class="font-body text-silver/80">
              选择最能代表你当前状态的情绪
            </p>
          </div>

          <div class="grid grid-cols-5 gap-4">
            <button
              v-for="mood in store.moods"
              :key="mood.value"
              @click="store.setMood(mood.value)"
              class="p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 border"
              :class="{
                'bg-gold/20 border-gold/40 scale-105': store.mood === mood.value,
                'bg-silver/10 border-transparent hover:border-gold/30 hover:bg-silver/20': store.mood !== mood.value
              }"
            >
              <span class="text-4xl">{{ mood.emoji }}</span>
              <span class="text-sm font-display" :class="store.mood === mood.value ? 'text-gold' : 'text-silver/80'">
                {{ mood.value }}
              </span>
            </button>
          </div>
        </div>

        <div v-else-if="store.phase === 'intention'" key="intention" class="max-w-2xl mx-auto">
          <div class="text-center mb-10">
            <h2 class="font-display text-3xl text-gold mb-4 tracking-wider">
              今日意图
            </h2>
            <p class="font-body text-silver/80">
              在心中默念今天想要达成或关注的事情，或书写于此
            </p>
          </div>

          <div class="space-y-4">
            <textarea
              v-model="store.intention"
              placeholder="今天我希望..."
              class="w-full h-40 p-6 rounded-xl bg-silver/10 border border-silver/20 text-silver placeholder-silver/40 font-body text-lg resize-none focus:outline-none focus:border-gold/50 transition-colors duration-300"
              maxlength="200"
            />
            <div class="text-right">
              <span class="text-xs text-silver/50 font-mono">{{ store.intention.length }}/200</span>
            </div>
          </div>

          <div class="mt-8 p-6 rounded-xl bg-silver/10 border border-silver/20">
            <p class="font-mono text-xs text-silver/70 leading-relaxed">
              <span class="text-purple">提示：</span>
              意图可以是具体的目标，也可以是一种状态，如「保持平静」、「充满创造力」或「与他人建立连接」。
              即使留白，宇宙也会接收到你当下的能量状态。
            </p>
          </div>
        </div>

        <div v-else-if="store.phase === 'rune'" key="rune" class="max-w-3xl mx-auto">
          <div class="text-center mb-10">
            <h2 class="font-display text-3xl text-gold mb-4 tracking-wider">
              选择今日符文
            </h2>
            <p class="font-body text-silver/80">
              直觉地选择一个与你今日能量共鸣的符文
            </p>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <button
              v-for="rune in store.runes"
              :key="rune.id"
              @click="store.selectRune(rune.id)"
              class="p-6 rounded-xl flex flex-col items-center gap-3 transition-all duration-300 border"
              :class="{
                'bg-gold/20 border-gold/40 scale-105': store.selectedRune === rune.id,
                'bg-silver/10 border-transparent hover:border-gold/30 hover:bg-silver/20': store.selectedRune !== rune.id
              }"
            >
              <span class="text-5xl font-display" :class="store.selectedRune === rune.id ? 'text-gold' : 'text-silver/90'">
                {{ rune.symbol }}
              </span>
              <div class="text-center">
                <div class="text-sm font-display" :class="store.selectedRune === rune.id ? 'text-gold' : 'text-silver/80'">
                  {{ rune.name }}
                </div>
                <div class="text-xs text-silver/60 font-mono">
                  {{ rune.meaning }}
                </div>
              </div>
            </button>
          </div>
        </div>

        <div v-else-if="store.phase === 'calculating'" key="calculating" class="max-w-2xl mx-auto">
          <div class="text-center py-20">
            <div class="relative inline-block mb-8">
              <div class="w-32 h-32 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="font-display text-2xl text-gold">{{ Math.round(store.calculationProgress) }}%</span>
              </div>
            </div>
            <h2 class="font-display text-2xl text-gold mb-4 tracking-wider">
              正在连接宇宙能量...
            </h2>
            <p class="font-body text-silver/70">
              符文正在解读你的能量轨迹
            </p>
            <div class="mt-8 max-w-md mx-auto">
              <div class="h-1 bg-silver/20 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-gold to-purple transition-all duration-300"
                  :style="{ width: `${store.calculationProgress}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="store.phase === 'complete' && store.currentResult" key="complete" class="max-w-4xl mx-auto">
          <div class="text-center mb-10">
            <div class="text-6xl mb-4">✧</div>
            <h2 class="font-display text-3xl text-gradient-gold mb-2 tracking-wider">
              {{ store.currentResult.interpretation.title }}
            </h2>
            <p class="font-mono text-sm text-silver/60">
              {{ store.currentResult.dateKey }} · 签到完成
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-8 mb-10">
            <div class="p-6 rounded-xl bg-glass">
              <h3 class="font-display text-xl text-gold mb-6 tracking-wider text-center">
                今日几何
              </h3>
              <div class="relative">
                <svg viewBox="0 0 400 400" class="w-full max-w-sm mx-auto">
                  <defs>
                    <filter id="dailyGlow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <radialGradient id="dailyCenterGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" style="stop-color:#d4af37;stop-opacity:0.3" />
                      <stop offset="100%" style="stop-color:#d4af37;stop-opacity:0" />
                    </radialGradient>
                  </defs>

                  <circle
                    :cx="store.currentResult.geometry.center.x"
                    :cy="store.currentResult.geometry.center.y"
                    r="80"
                    fill="url(#dailyCenterGlow)"
                    class="animate-pulse-slow"
                  />

                  <line
                    v-for="(v, idx) in store.currentResult.geometry.vertices"
                    :key="'line-' + idx"
                    :x1="store.currentResult.geometry.center.x"
                    :y1="store.currentResult.geometry.center.y"
                    :x2="v.x"
                    :y2="v.y"
                    stroke="rgba(212, 175, 55, 0.3)"
                    stroke-width="1"
                  />

                  <path
                    :d="getGeometryPath"
                    fill="none"
                    stroke="#d4af37"
                    stroke-width="2"
                    filter="url(#dailyGlow)"
                  />

                  <circle
                    v-for="(v, idx) in store.currentResult.geometry.vertices"
                    :key="'dot-' + idx"
                    :cx="v.x"
                    :cy="v.y"
                    r="5"
                    fill="#d4af37"
                    filter="url(#dailyGlow)"
                  />

                  <text
                    :x="store.currentResult.geometry.center.x"
                    :y="store.currentResult.geometry.center.y + 6"
                    text-anchor="middle"
                    class="text-2xl font-bold fill-gold font-display"
                  >
                    {{ store.currentResult.dailyNumber }}
                  </text>
                </svg>
              </div>
            </div>

            <div class="space-y-6">
              <div class="p-6 rounded-xl bg-glass">
                <h3 class="font-display text-xl text-gold mb-4 tracking-wider">
                  能量指数
                </h3>
                <div class="flex items-end gap-4 mb-4">
                  <div class="font-display text-5xl text-gold">
                    {{ store.currentResult.energyLevel }}
                  </div>
                  <div class="text-sm text-silver/60 mb-2">/ 100</div>
                </div>
                <div class="h-3 bg-silver/20 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r transition-all duration-1000"
                    :class="getEnergyColor(store.currentResult.energyLevel)"
                    :style="{ width: `${store.currentResult.energyLevel}%` }"
                  />
                </div>
                <div class="flex justify-between mt-2 text-xs text-silver/50 font-mono">
                  <span>低能量</span>
                  <span>高能量</span>
                </div>
              </div>

              <div class="p-6 rounded-xl bg-glass">
                <h3 class="font-display text-xl text-gold mb-4 tracking-wider">
                  今日关键词
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="kw in store.currentResult.interpretation.keywords"
                    :key="kw"
                    class="px-3 py-1 rounded-full bg-gold/10 text-gold/90 text-sm font-mono"
                  >
                    {{ kw }}
                  </span>
                </div>
              </div>

              <div class="p-6 rounded-xl bg-glass">
                <h3 class="font-display text-xl text-gold mb-4 tracking-wider">
                  符文启示
                </h3>
                <div class="flex items-center gap-4">
                  <span class="text-5xl text-gold">
                    {{ selectedRuneInfo?.symbol }}
                  </span>
                  <div>
                    <div class="font-display text-lg text-silver/90">
                      {{ selectedRuneInfo?.name }}
                    </div>
                    <div class="text-sm text-silver/60">
                      {{ selectedRuneInfo?.meaning }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 rounded-xl bg-glass mb-8">
            <h3 class="font-display text-xl text-gold mb-4 tracking-wider">
              今日解读
            </h3>
            <div class="space-y-4">
              <p
                v-for="(para, idx) in store.currentResult.interpretation.paragraphs"
                :key="idx"
                class="font-body text-silver/80 leading-relaxed"
              >
                {{ para }}
              </p>
            </div>
          </div>

          <div class="p-6 rounded-xl bg-purple/10 border border-purple/30 mb-8">
            <h3 class="font-display text-xl text-purple mb-4 tracking-wider">
              ✧ 今日指引
            </h3>
            <p class="font-body text-silver/90 leading-relaxed">
              {{ store.currentResult.interpretation.guidance }}
            </p>
          </div>

          <div class="p-6 rounded-xl bg-glass mb-8">
            <h3 class="font-display text-xl text-gold mb-6 tracking-wider">
              本周能量轨迹
            </h3>
            <div class="flex items-end justify-between gap-2 h-32 mb-4">
              <div
                v-for="(energy, idx) in store.cycleData.weekEnergy"
                :key="idx"
                class="flex-1 flex flex-col items-center gap-2"
              >
                <div class="w-full rounded-t-lg transition-all duration-700"
                  :class="energy > 0 ? `bg-gradient-to-t ${getEnergyColor(energy)}` : 'bg-silver/10'"
                  :style="{ height: energy > 0 ? `${(energy / maxEnergyValue) * 100}%` : '20%' }"
                />
                <span class="text-xs font-mono" :class="energy > 0 ? 'text-gold' : 'text-silver/40'">
                  {{ weekDays[idx] }}
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="text-silver/60">趋势：</span>
                <span class="font-display text-lg" :class="getTrendColor(store.cycleData.trend)">
                  {{ getTrendIcon(store.cycleData.trend) }} {{ getTrendText(store.cycleData.trend) }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-silver/60">平均能量：</span>
                <span class="font-display text-lg text-gold">
                  {{ store.cycleData.averageEnergy }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <MysticButton variant="primary" @click="goToArchive">
              查看完整能量轨迹 ✧
            </MysticButton>
            <MysticButton variant="secondary" @click="() => router.push('/')">
              返回首页
            </MysticButton>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
