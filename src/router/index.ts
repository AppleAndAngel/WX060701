import { createRouter, createWebHistory } from 'vue-router'
import EntryPage from '@/views/EntryPage.vue'
import RitualPage from '@/views/RitualPage.vue'
import ResultPage from '@/views/ResultPage.vue'
import ArchivePage from '@/views/ArchivePage.vue'
import SynastryInputPage from '@/views/SynastryInputPage.vue'
import SynastryResultPage from '@/views/SynastryResultPage.vue'
import YearlyInputPage from '@/views/YearlyInputPage.vue'
import YearlyResultPage from '@/views/YearlyResultPage.vue'
import CareerChoiceInputPage from '@/views/CareerChoiceInputPage.vue'
import CareerChoiceResultPage from '@/views/CareerChoiceResultPage.vue'
import LoveTimingInputPage from '@/views/LoveTimingInputPage.vue'
import LoveTimingResultPage from '@/views/LoveTimingResultPage.vue'
import DailyRitualPage from '@/views/DailyRitualPage.vue'
import DreamInterpretationInputPage from '@/views/DreamInterpretationInputPage.vue'
import DreamInterpretationResultPage from '@/views/DreamInterpretationResultPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'entry',
      component: EntryPage
    },
    {
      path: '/ritual',
      name: 'ritual',
      component: RitualPage
    },
    {
      path: '/result/:id',
      name: 'result',
      component: ResultPage,
      props: true
    },
    {
      path: '/archive',
      name: 'archive',
      component: ArchivePage
    },
    {
      path: '/synastry',
      name: 'synastry',
      component: SynastryInputPage
    },
    {
      path: '/synastry/result/:id',
      name: 'synastry-result',
      component: SynastryResultPage,
      props: true
    },
    {
      path: '/yearly',
      name: 'yearly',
      component: YearlyInputPage
    },
    {
      path: '/yearly/result/:id',
      name: 'yearly-result',
      component: YearlyResultPage,
      props: true
    },
    {
      path: '/career-choice',
      name: 'career-choice',
      component: CareerChoiceInputPage
    },
    {
      path: '/career-choice/result/:id',
      name: 'career-choice-result',
      component: CareerChoiceResultPage,
      props: true
    },
    {
      path: '/love-timing',
      name: 'love-timing',
      component: LoveTimingInputPage
    },
    {
      path: '/love-timing/result/:id',
      name: 'love-timing-result',
      component: LoveTimingResultPage,
      props: true
    },
    {
      path: '/daily-ritual',
      name: 'daily-ritual',
      component: DailyRitualPage
    },
    {
      path: '/dream-interpretation',
      name: 'dream-interpretation',
      component: DreamInterpretationInputPage
    },
    {
      path: '/dream-interpretation/result/:id',
      name: 'dream-interpretation-result',
      component: DreamInterpretationResultPage,
      props: true
    }
  ]
})

export default router
