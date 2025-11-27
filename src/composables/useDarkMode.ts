import { ref, watch } from 'vue'

const STORAGE_KEY = 'oid-visualizer-dark-mode'

const isDark = ref(false)

// Initialize from localStorage or system preference
const stored = localStorage.getItem(STORAGE_KEY)
if (stored !== null) {
  isDark.value = stored === 'true'
} else {
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Apply dark class to document
function applyDarkMode(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Apply initial state
applyDarkMode(isDark.value)

// Watch for changes
watch(isDark, (newValue) => {
  localStorage.setItem(STORAGE_KEY, String(newValue))
  applyDarkMode(newValue)
})

export function useDarkMode() {
  function toggle() {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggle
  }
}
