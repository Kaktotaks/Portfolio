import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// The page is a fixed stage; never let the browser restore a stale scroll offset on reload
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
const resetScroll = () => window.scrollTo(0, 0)
window.addEventListener('pageshow', resetScroll)
window.visualViewport?.addEventListener('resize', resetScroll)

createApp(App).mount('#app')
