<script setup lang="ts">
import { useOidStore } from '../composables/useOidStore'
import { useOidTree } from '../composables/useOidTree'
import TreeNodeItem from './TreeNodeItem.vue'
import type { OidTreeNode } from '../types/oid'

const store = useOidStore()
const { tree, toggleExpand, expandAll, collapseAll } = useOidTree(() => store.entries.value)

function selectNode(node: OidTreeNode) {
  store.selectOid(node.oid)
}
</script>

<template>
  <div>
    <!-- Controls -->
    <div class="flex gap-2 mb-4">
      <button
        @click="expandAll"
        class="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        Expand All
      </button>
      <button
        @click="collapseAll"
        class="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        Collapse All
      </button>
    </div>

    <!-- Tree -->
    <div v-if="tree.length === 0" class="text-gray-500 dark:text-gray-400 text-sm">
      No OIDs yet. Click "Add OID" to get started.
    </div>
    <ul v-else class="space-y-1">
      <TreeNodeItem
        v-for="node in tree"
        :key="node.oid"
        :node="node"
        :depth="0"
        @select="selectNode"
        @toggle="toggleExpand"
      />
    </ul>
  </div>
</template>
