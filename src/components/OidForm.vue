<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOidStore } from '../composables/useOidStore'
import { useOidLookup } from '../composables/useOidLookup'

const props = defineProps<{
  editingOid: string | null
}>()

const emit = defineEmits<{
  close: []
}>()

const store = useOidStore()
const { lookupOid, isLoading: isLookupLoading, error: lookupError } = useOidLookup()

const form = ref({
  oid: '',
  name: '',
  description: '',
  comments: '',
  asnNotation: '',
  iriNotation: ''
})

const errors = ref<Record<string, string>>({})

onMounted(() => {
  if (props.editingOid) {
    const entry = store.getEntry(props.editingOid)
    if (entry) {
      form.value = {
        oid: entry.oid,
        name: entry.name,
        description: entry.description || '',
        comments: entry.comments || '',
        asnNotation: entry.asnNotation || '',
        iriNotation: entry.iriNotation || ''
      }
    }
  }
})

function validateOid(oid: string): boolean {
  return /^[0-9]+(\.[0-9]+)*$/.test(oid)
}

function validate(): boolean {
  errors.value = {}

  if (!form.value.oid) {
    errors.value.oid = 'OID is required'
  } else if (!validateOid(form.value.oid)) {
    errors.value.oid = 'Invalid OID format (e.g., 1.2.840.113549)'
  } else if (!props.editingOid && store.getEntry(form.value.oid)) {
    errors.value.oid = 'This OID already exists'
  }

  if (!form.value.name) {
    errors.value.name = 'Name is required'
  }

  return Object.keys(errors.value).length === 0
}

function save() {
  if (!validate()) return

  if (props.editingOid) {
    store.updateEntry(props.editingOid, {
      name: form.value.name,
      description: form.value.description || undefined,
      comments: form.value.comments || undefined,
      asnNotation: form.value.asnNotation || undefined,
      iriNotation: form.value.iriNotation || undefined
    })
  } else {
    store.addEntry({
      oid: form.value.oid,
      name: form.value.name,
      description: form.value.description || undefined,
      comments: form.value.comments || undefined,
      asnNotation: form.value.asnNotation || undefined,
      iriNotation: form.value.iriNotation || undefined
    })
    store.selectOid(form.value.oid)
  }

  emit('close')
}

async function fetchFromOidBase() {
  if (!form.value.oid || !validateOid(form.value.oid)) {
    errors.value.oid = 'Enter a valid OID first'
    return
  }

  const result = await lookupOid(form.value.oid)
  if (result) {
    if (result.name && !form.value.name) form.value.name = result.name
    if (result.description && !form.value.description) form.value.description = result.description
    if (result.asnNotation && !form.value.asnNotation) form.value.asnNotation = result.asnNotation
    if (result.iriNotation && !form.value.iriNotation) form.value.iriNotation = result.iriNotation
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ editingOid ? 'Edit OID' : 'Add OID' }}
        </h2>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none"
        >
          &times;
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="save" class="p-6 space-y-4">
        <!-- OID -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">OID</label>
          <div class="flex gap-2">
            <input
              v-model="form.oid"
              type="text"
              :disabled="!!editingOid"
              placeholder="1.2.840.113549"
              :class="[
                'flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                errors.oid ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600',
                editingOid ? 'bg-gray-100 dark:bg-gray-600' : ''
              ]"
            >
            <button
              v-if="!editingOid"
              type="button"
              @click="fetchFromOidBase"
              :disabled="isLookupLoading"
              class="px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50"
            >
              {{ isLookupLoading ? 'Loading...' : 'Lookup' }}
            </button>
          </div>
          <p v-if="errors.oid" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.oid }}</p>
          <p v-if="lookupError" class="mt-1 text-xs text-amber-600 dark:text-amber-400">{{ lookupError }}</p>
        </div>

        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Short name"
            :class="[
              'w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
              errors.name ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
            ]"
          >
          <p v-if="errors.name" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.name }}</p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <input
            v-model="form.description"
            type="text"
            placeholder="Full description"
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <!-- ASN.1 Notation -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ASN.1 Notation</label>
          <input
            v-model="form.asnNotation"
            type="text"
            placeholder="{iso(1) member-body(2) ...}"
            class="w-full px-3 py-2 text-sm font-mono border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <!-- IRI Notation -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IRI Notation</label>
          <input
            v-model="form.iriNotation"
            type="text"
            placeholder="/ISO/Member-Body/..."
            class="w-full px-3 py-2 text-sm font-mono border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <!-- Comments -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comments</label>
          <textarea
            v-model="form.comments"
            rows="3"
            placeholder="Your notes..."
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {{ editingOid ? 'Save Changes' : 'Add OID' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
