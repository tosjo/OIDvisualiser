<script setup lang="ts">
import { ref } from 'vue'
import { useOidStore } from './composables/useOidStore'
import OidTree from './components/OidTree.vue'
import OidTable from './components/OidTable.vue'
import OidDetail from './components/OidDetail.vue'
import OidForm from './components/OidForm.vue'

const store = useOidStore()
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
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-900">OID Visualizer</h1>
      <div class="flex items-center gap-4">
        <label class="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Import
          <input type="file" accept=".json" class="hidden" @change="handleFileImport">
        </label>
        <button
          @click="store.saveToFile"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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
      <aside class="w-80 bg-white border-r border-gray-200 flex flex-col">
        <!-- View Toggle -->
        <div class="p-4 border-b border-gray-200">
          <div class="flex rounded-md overflow-hidden border border-gray-300">
            <button
              @click="activeView = 'tree'"
              :class="[
                'flex-1 px-4 py-2 text-sm font-medium',
                activeView === 'tree'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
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
                  : 'bg-white text-gray-700 hover:bg-gray-50'
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
        <div v-else class="h-full flex items-center justify-center text-gray-500">
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
