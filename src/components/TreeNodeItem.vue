<script setup lang="ts">
import { computed } from 'vue'
import { useOidStore } from '../composables/useOidStore'
import type { OidTreeNode } from '../types/oid'

const props = defineProps<{
  node: OidTreeNode
  depth: number
}>()

const emit = defineEmits<{
  select: [node: OidTreeNode]
  toggle: [oid: string]
}>()

const store = useOidStore()

const hasChildren = computed(() => props.node.children.length > 0)
const isSelected = computed(() => store.selectedOid.value === props.node.oid)
const paddingLeft = computed(() => `${props.depth * 16 + 8}px`)

function handleClick() {
  emit('select', props.node)
}

function handleToggle(e: Event) {
  e.stopPropagation()
  emit('toggle', props.node.oid)
}

function handleChildSelect(node: OidTreeNode) {
  emit('select', node)
}

function handleChildToggle(oid: string) {
  emit('toggle', oid)
}
</script>

<template>
  <li class="select-none">
    <div
      :class="[
        'flex items-center gap-1 px-2 py-1 rounded cursor-pointer text-sm',
        isSelected ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      ]"
      :style="{ paddingLeft }"
      @click="handleClick"
    >
      <!-- Expand/collapse button -->
      <button
        v-if="hasChildren"
        class="w-4 h-4 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        @click="handleToggle"
      >
        {{ node.expanded ? '\u25BC' : '\u25B6' }}
      </button>
      <span v-else class="w-4 h-4"></span>

      <!-- Node content -->
      <span class="font-mono text-xs text-gray-500 dark:text-gray-400">{{ node.oid }}</span>
      <span class="ml-2 truncate dark:text-gray-200">{{ node.name }}</span>
    </div>

    <!-- Children -->
    <ul v-if="hasChildren && node.expanded" class="space-y-1">
      <TreeNodeItem
        v-for="child in node.children"
        :key="child.oid"
        :node="child"
        :depth="depth + 1"
        @select="handleChildSelect"
        @toggle="handleChildToggle"
      />
    </ul>
  </li>
</template>
