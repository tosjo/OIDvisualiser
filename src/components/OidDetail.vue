<script setup lang="ts">
import { ref } from 'vue'
import type { OidEntry } from '../types/oid'
import { useOidLookup } from '../composables/useOidLookup'
import { useOidStore } from '../composables/useOidStore'

const props = defineProps<{
  entry: OidEntry
}>()

const emit = defineEmits<{
  edit: [oid: string]
  delete: [oid: string]
}>()

const store = useOidStore()
const { fetchChildren, isLoadingChildren, childrenError } = useOidLookup()

interface FetchedChild {
  oid: string
  name: string
  description?: string
  selected: boolean
  exists: boolean
}

const fetchedChildren = ref<FetchedChild[]>([])
const showChildren = ref(false)

function confirmDelete(oid: string) {
  if (confirm('Are you sure you want to delete this OID?')) {
    emit('delete', oid)
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString()
}

async function handleFetchChildren() {
  showChildren.value = true
  const children = await fetchChildren(props.entry.oid)
  fetchedChildren.value = children.map(child => ({
    ...child,
    selected: !store.getEntry(child.oid), // Pre-select if not already in store
    exists: !!store.getEntry(child.oid)
  }))
}

function toggleChild(oid: string) {
  const child = fetchedChildren.value.find(c => c.oid === oid)
  if (child && !child.exists) {
    child.selected = !child.selected
  }
}

function selectAll() {
  fetchedChildren.value.forEach(child => {
    if (!child.exists) child.selected = true
  })
}

function selectNone() {
  fetchedChildren.value.forEach(child => {
    child.selected = false
  })
}

function addSelectedChildren() {
  const toAdd = fetchedChildren.value.filter(c => c.selected && !c.exists)
  toAdd.forEach(child => {
    store.addEntry({
      oid: child.oid,
      name: child.name,
      description: child.description
    })
  })
  // Update exists status
  fetchedChildren.value.forEach(child => {
    if (child.selected) {
      child.exists = true
      child.selected = false
    }
  })
}

const selectedCount = () => fetchedChildren.value.filter(c => c.selected && !c.exists).length
const newCount = () => fetchedChildren.value.filter(c => !c.exists).length
</script>

<template>
  <div class="space-y-4">
    <!-- Main Details Card -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ entry.name }}</h2>
          <p class="font-mono text-sm text-gray-500 dark:text-gray-400 mt-1">{{ entry.oid }}</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="emit('edit', entry.oid)"
            class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Edit
          </button>
          <button
            @click="confirmDelete(entry.oid)"
            class="px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 border border-red-300 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            Delete
          </button>
        </div>
      </div>

      <!-- Details -->
      <dl class="space-y-4">
        <div v-if="entry.description">
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ entry.description }}</dd>
        </div>

        <div v-if="entry.asnNotation">
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">ASN.1 Notation</dt>
          <dd class="mt-1 font-mono text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-2 rounded">
            {{ entry.asnNotation }}
          </dd>
        </div>

        <div v-if="entry.iriNotation">
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">IRI Notation</dt>
          <dd class="mt-1 font-mono text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-2 rounded">
            {{ entry.iriNotation }}
          </dd>
        </div>

        <div v-if="entry.comments">
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Comments</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{{ entry.comments }}</dd>
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div>
              <span class="font-medium">Created:</span>
              {{ formatDate(entry.createdAt) }}
            </div>
            <div>
              <span class="font-medium">Modified:</span>
              {{ formatDate(entry.modifiedAt) }}
            </div>
          </div>
        </div>
      </dl>
    </div>

    <!-- Fetch Children Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Child OIDs</h3>
        <button
          @click="handleFetchChildren"
          :disabled="isLoadingChildren"
          class="px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50"
        >
          {{ isLoadingChildren ? 'Fetching...' : 'Fetch from oid-base.com' }}
        </button>
      </div>

      <!-- Error message -->
      <p v-if="childrenError" class="text-sm text-amber-600 dark:text-amber-400 mb-4">
        {{ childrenError }}
      </p>

      <!-- Children list -->
      <div v-if="showChildren && fetchedChildren.length > 0" class="space-y-3">
        <!-- Selection controls -->
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">
            Found {{ fetchedChildren.length }} children
            <span v-if="newCount() > 0">({{ newCount() }} new)</span>
          </span>
          <div class="flex gap-2">
            <button
              @click="selectAll"
              class="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Select all
            </button>
            <button
              @click="selectNone"
              class="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Select none
            </button>
          </div>
        </div>

        <!-- List -->
        <div class="max-h-64 overflow-auto space-y-1">
          <div
            v-for="child in fetchedChildren"
            :key="child.oid"
            @click="toggleChild(child.oid)"
            :class="[
              'flex items-center gap-3 px-3 py-2 rounded cursor-pointer',
              child.exists
                ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
                : child.selected
                  ? 'bg-blue-50 dark:bg-blue-900/30'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
          >
            <!-- Checkbox -->
            <input
              type="checkbox"
              :checked="child.selected"
              :disabled="child.exists"
              class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              @click.stop="toggleChild(child.oid)"
            >
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs text-gray-500 dark:text-gray-400">{{ child.oid }}</span>
                <span v-if="child.exists" class="text-xs text-green-600 dark:text-green-400">(already added)</span>
              </div>
              <div class="text-sm truncate dark:text-gray-200">{{ child.name }}</div>
            </div>
          </div>
        </div>

        <!-- Add button -->
        <button
          v-if="selectedCount() > 0"
          @click="addSelectedChildren"
          class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add {{ selectedCount() }} selected OID{{ selectedCount() > 1 ? 's' : '' }}
        </button>
      </div>

      <!-- Empty state -->
      <p v-else-if="showChildren && !isLoadingChildren" class="text-sm text-gray-500 dark:text-gray-400">
        No child OIDs found on oid-base.com
      </p>
    </div>
  </div>
</template>
