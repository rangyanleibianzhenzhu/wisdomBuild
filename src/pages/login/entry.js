import { createApp } from '@/app-multi'
import pageRouter from './router'

const { app, router } = createApp(pageRouter)

router.onReady(() => app.$mount('#app'))
