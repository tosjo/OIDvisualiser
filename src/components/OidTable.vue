<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOidStore } from '../composables/useOidStore'

const store = useOidStore()
const searchQuery = ref('')

const filteredEntries = computed(() => {
  if (!searchQuery.value) {
    return store.entries.value
  }
  return store.searchEntries(searchQuery.value)
})

function selectRow(oid: string) {
  store.selectOid(oid)
}
</script>

<template>
  <div>
    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search OIDs..."
        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
    </div>

    <!-- Table -->
    <div v-if="filteredEntries.length === 0" class="text-gray-500 text-sm">
      {{ searchQuery ? 'No matching OIDs found.' : 'No OIDs yet. Click "Add OID" to get started.' }}
    </div>
    <div v-else class="space-y-1">
      <div
        v-for="entry in filteredEntries"
        :key="entry.oid"
        @click="selectRow(entry.oid)"
        :class="[
          'px-3 py-2 rounded cursor-pointer',
          store.selectedOid.value === entry.oid
            ? 'bg-blue-100 text-blue-900'
            : 'hover:bg-gray-100'
        ]"
      >
        <div class="font-mono text-xs text-gray-500">{{ entry.oid }}</div>
        <div class="text-sm font-medium truncate">{{ entry.name }}</div>
        <div v-if="entry.description" class="text-xs text-gray-500 truncate">
          {{ entry.description }}
        </div>
      </div>
    </div>
  </div>
</template>
