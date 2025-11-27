<script setup lang="ts">
import { ref } from 'vue'
import { useOidStore } from './composables/useOidStore'
import { useDarkMode } from './composables/useDarkMode'
import OidTree from './components/OidTree.vue'
import OidTable from './components/OidTable.vue'
import OidDetail from './components/OidDetail.vue'
import OidForm from './components/OidForm.vue'

const store = useOidStore()
const { isDark, toggle: toggleDarkMode } = useDarkMode()
const activeView = ref<'tree' | 'table'>('tree')
const showForm = ref(false)
const editingOid = ref<string | null>(null)

function handleFileImport(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    store.loadFromFile(input.files[0])
    input.value = ''
  }
}

function openAddForm() {
  editingOid.value = null
  showForm.value = true
}

function openEditForm(oid: string) {
  editingOid.value = oid
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingOid.value = null
}
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white">OID Visualizer</h1>
      <div class="flex items-center gap-4">
        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <!-- Sun icon (shown in dark mode) -->
          <svg v-if="isDark" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Moon icon (shown in light mode) -->
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
        <label class="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
          Import
          <input type="file" accept=".json" class="hidden" @change="handleFileImport">
        </label>
        <button
          @click="store.saveToFile"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Export
        </button>
        <button
          @click="openAddForm"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add OID
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- View Toggle -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
            <button
              @click="activeView = 'tree'"
              :class="[
                'flex-1 px-4 py-2 text-sm font-medium',
                activeView === 'tree'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              Tree View
            </button>
            <button
              @click="activeView = 'table'"
              :class="[
                'flex-1 px-4 py-2 text-sm font-medium',
                activeView === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              Table View
            </button>
          </div>
        </div>

        <!-- Tree/Table View -->
        <div class="flex-1 overflow-auto p-4">
          <OidTree v-if="activeView === 'tree'" />
          <OidTable v-else />
        </div>
      </aside>

      <!-- Detail Panel -->
      <main class="flex-1 overflow-auto p-6">
        <OidDetail
          v-if="store.selectedEntry.value"
          :entry="store.selectedEntry.value"
          @edit="openEditForm"
          @delete="store.deleteEntry"
        />
        <div v-else class="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
          Select an OID to view details
        </div>
      </main>
    </div>

    <!-- Form Modal -->
    <OidForm
      v-if="showForm"
      :editing-oid="editingOid"
      @close="closeForm"
    />
  </div>
</template>
