import { createApp } from '@/app-multi'
import pageRouter from './router'
import Layout from '@/layout/pc/AppLayout.vue'

const { app, router } = createApp(pageRouter, Layout)

router.onReady(() => app.$mount('#app'))
