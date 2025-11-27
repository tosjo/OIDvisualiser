<script setup lang="ts">
import type { OidEntry } from '../types/oid'

defineProps<{
  entry: OidEntry
}>()

const emit = defineEmits<{
  edit: [oid: string]
  delete: [oid: string]
}>()

function confirmDelete(oid: string) {
  if (confirm('Are you sure you want to delete this OID?')) {
    emit('delete', oid)
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString()
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">{{ entry.name }}</h2>
        <p class="font-mono text-sm text-gray-500 mt-1">{{ entry.oid }}</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="emit('edit', entry.oid)"
          class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          @click="confirmDelete(entry.oid)"
          class="px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Details -->
    <dl class="space-y-4">
      <div v-if="entry.description">
        <dt class="text-sm font-medium text-gray-500">Description</dt>
        <dd class="mt-1 text-sm text-gray-900">{{ entry.description }}</dd>
      </div>

      <div v-if="entry.asnNotation">
        <dt class="text-sm font-medium text-gray-500">ASN.1 Notation</dt>
        <dd class="mt-1 font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded">
          {{ entry.asnNotation }}
        </dd>
      </div>

      <div v-if="entry.iriNotation">
        <dt class="text-sm font-medium text-gray-500">IRI Notation</dt>
        <dd class="mt-1 font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded">
          {{ entry.iriNotation }}
        </dd>
      </div>

      <div v-if="entry.comments">
        <dt class="text-sm font-medium text-gray-500">Comments</dt>
        <dd class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ entry.comments }}</dd>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <div class="grid grid-cols-2 gap-4 text-xs text-gray-500">
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
</template>
