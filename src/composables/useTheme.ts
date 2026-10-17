import { computed, ref, watchEffect } from 'vue'

export type ThemeMode = 'auto' | 'light' | 'dark'

const KEY = 'theme'
const media = window.matchMedia('(prefers-color-scheme: dark)')

function read(): ThemeMode {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : 'auto'
  } catch {
    return 'auto'
  }
}

const mode = ref<ThemeMode>(read())
const systemDark = ref(media.matches)
media.addEventListener('change', (e) => (systemDark.value = e.matches))

watchEffect(() => {
  const root = document.documentElement
  if (mode.value === 'auto') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', mode.value)
  try {
    if (mode.value === 'auto') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, mode.value)
  } catch {
    /* storage unavailable — the choice just won't persist */
  }
})

/** Dark-mode switch for Control Center. Toggling away from the system choice pins a theme. */
export function useTheme() {
  const isDark = computed(() => (mode.value === 'auto' ? systemDark.value : mode.value === 'dark'))
  function toggle() {
    const next = isDark.value ? 'light' : 'dark'
    // If the toggle lands back on what the system wants, return to "auto"
    mode.value = (next === 'dark') === systemDark.value ? 'auto' : next
  }
  return { isDark, toggle }
}
