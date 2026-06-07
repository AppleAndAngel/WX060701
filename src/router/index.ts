import { createRouter, createWebHistory } from 'vue-router'
import EntryPage from '@/views/EntryPage.vue'
import RitualPage from '@/views/RitualPage.vue'
import ResultPage from '@/views/ResultPage.vue'
import ArchivePage from '@/views/ArchivePage.vue'
import SynastryInputPage from '@/views/SynastryInputPage.vue'
import SynastryResultPage from '@/views/SynastryResultPage.vue'
import YearlyInputPage from '@/views/YearlyInputPage.vue'
import YearlyResultPage from '@/views/YearlyResultPage.vue'

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
    }
  ]
})

export default router
