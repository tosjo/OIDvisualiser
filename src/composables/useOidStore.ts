import { ref, computed, watch } from 'vue'
import type { OidEntry, OidDataStore } from '../types/oid'

const STORAGE_KEY = 'oid-visualizer-data'

const entries = ref<OidEntry[]>([])
const selectedOid = ref<string | null>(null)
const isLoading = ref(false)

// Load from localStorage on init
const storedData = localStorage.getItem(STORAGE_KEY)
if (storedData) {
  try {
    const parsed: OidDataStore = JSON.parse(storedData)
    entries.value = parsed.entries || []
  } catch {
    console.warn('Failed to parse stored OID data')
  }
}

// Auto-save to localStorage
watch(entries, (newEntries) => {
  const store: OidDataStore = {
    version: '1.0',
    lastModified: new Date().toISOString(),
    entries: newEntries
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}, { deep: true })

export function useOidStore() {
  const selectedEntry = computed(() => {
    if (!selectedOid.value) return null
    return entries.value.find(e => e.oid === selectedOid.value) || null
  })

  const sortedEntries = computed(() => {
    return [...entries.value].sort((a, b) => a.oid.localeCompare(b.oid))
  })

  function addEntry(entry: Omit<OidEntry, 'createdAt' | 'modifiedAt'>) {
    const now = new Date().toISOString()
    const newEntry: OidEntry = {
      ...entry,
      createdAt: now,
      modifiedAt: now
    }
    entries.value.push(newEntry)
    return newEntry
  }

  function updateEntry(oid: string, updates: Partial<OidEntry>) {
    const index = entries.value.findIndex(e => e.oid === oid)
    if (index !== -1) {
      entries.value[index] = {
        ...entries.value[index],
        ...updates,
        modifiedAt: new Date().toISOString()
      }
    }
  }

  function deleteEntry(oid: string) {
    const index = entries.value.findIndex(e => e.oid === oid)
    if (index !== -1) {
      entries.value.splice(index, 1)
      if (selectedOid.value === oid) {
        selectedOid.value = null
      }
    }
  }

  function selectOid(oid: string | null) {
    selectedOid.value = oid
  }

  function getEntry(oid: string): OidEntry | undefined {
    return entries.value.find(e => e.oid === oid)
  }

  function importData(data: OidDataStore) {
    entries.value = data.entries || []
  }

  function exportData(): OidDataStore {
    return {
      version: '1.0',
      lastModified: new Date().toISOString(),
      entries: entries.value
    }
  }

  async function loadFromFile(file: File): Promise<void> {
    isLoading.value = true
    try {
      const text = await file.text()
      const data: OidDataStore = JSON.parse(text)
      importData(data)
    } finally {
      isLoading.value = false
    }
  }

  function saveToFile() {
    const data = exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'oid-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function searchEntries(query: string): OidEntry[] {
    const q = query.toLowerCase()
    return entries.value.filter(e =>
      e.oid.includes(q) ||
      e.name.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.comments?.toLowerCase().includes(q)
    )
  }

  return {
    entries: sortedEntries,
    selectedOid,
    selectedEntry,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    selectOid,
    getEntry,
    importData,
    exportData,
    loadFromFile,
    saveToFile,
    searchEntries
  }
}
