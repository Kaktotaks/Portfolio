import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// The page is a fixed stage; never let the browser restore a stale scroll offset on reload
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

/*
 * Chrome on iOS (and other WKWebView browsers with a collapsing toolbar) can come back from a
 * reload with the page laid out behind its address bar: everything shifted up, an empty strip at
 * the bottom. It only corrects that on a scroll, and this page never scrolls. So make the document
 * 1px taller for a moment, scroll down and back, and let the browser re-anchor the viewport.
 */
function reanchorViewport() {
  const body = document.body
  body.style.height = 'calc(100% + 1px)'
  window.scrollTo(0, 1)
  requestAnimationFrame(() => {
    window.scrollTo(0, 0)
    requestAnimationFrame(() => (body.style.height = ''))
  })
}

window.addEventListener('load', () => {
  reanchorViewport()
  // The browser may restore its own toolbar state a beat after load
  window.setTimeout(reanchorViewport, 350)
})
window.addEventListener('pageshow', (e) => {
  if (e.persisted) reanchorViewport()
})

createApp(App).mount('#app')
