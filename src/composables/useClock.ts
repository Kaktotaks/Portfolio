import { computed, onMounted, onUnmounted, ref } from 'vue'

/** Live clock in a fixed time zone, so visitors see Leonid's local time. */
export function useClock(timeZone: string) {
  const now = ref(new Date())
  let timer: number | undefined

  onMounted(() => {
    // Align ticks to the start of each minute
    const tick = () => (now.value = new Date())
    timer = window.setTimeout(function loop() {
      tick()
      timer = window.setTimeout(loop, 60_000 - (Date.now() % 60_000))
    }, 60_000 - (Date.now() % 60_000))
  })
  onUnmounted(() => window.clearTimeout(timer))

  const time = computed(() =>
    new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false }).format(now.value),
  )
  const date = computed(() =>
    new Intl.DateTimeFormat('en-GB', { timeZone, weekday: 'long', day: 'numeric', month: 'long' }).format(now.value),
  )

  return { time, date }
}
