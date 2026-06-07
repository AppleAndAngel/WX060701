import { createRouter, createWebHistory } from 'vue-router'
import EntryPage from '@/views/EntryPage.vue'
import RitualPage from '@/views/RitualPage.vue'
import ResultPage from '@/views/ResultPage.vue'
import ArchivePage from '@/views/ArchivePage.vue'

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
    }
  ]
})

export default router
