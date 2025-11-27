import { computed, ref } from 'vue'
import type { OidEntry, OidTreeNode } from '../types/oid'

export function useOidTree(entries: () => OidEntry[]) {
  const expandedNodes = ref<Set<string>>(new Set())

  function getParentOid(oid: string): string | null {
    const parts = oid.split('.')
    if (parts.length <= 1) return null
    return parts.slice(0, -1).join('.')
  }

  function buildTreeNode(oid: string, name: string, entry: OidEntry | undefined, allEntries: OidEntry[]): OidTreeNode {
    const childEntries = allEntries.filter(e => {
      const parent = getParentOid(e.oid)
      return parent === oid
    })

    const children = childEntries.map(child =>
      buildTreeNode(child.oid, child.name, child, allEntries)
    )

    return {
      oid,
      name,
      entry,
      children,
      expanded: expandedNodes.value.has(oid)
    }
  }

  const tree = computed<OidTreeNode[]>(() => {
    const allEntries = entries()

    // Find root entries (those without parents in our data)
    const rootEntries = allEntries.filter(entry => {
      const parent = getParentOid(entry.oid)
      // It's a root if there's no parent or the parent doesn't exist in our data
      return parent === null || !allEntries.some(e => e.oid === parent)
    })

    return rootEntries.map(entry =>
      buildTreeNode(entry.oid, entry.name, entry, allEntries)
    )
  })

  function toggleExpand(oid: string) {
    if (expandedNodes.value.has(oid)) {
      expandedNodes.value.delete(oid)
    } else {
      expandedNodes.value.add(oid)
    }
    // Trigger reactivity
    expandedNodes.value = new Set(expandedNodes.value)
  }

  function expandAll() {
    const allOids = entries().map(e => e.oid)
    expandedNodes.value = new Set(allOids)
  }

  function collapseAll() {
    expandedNodes.value = new Set()
  }

  function getDescendants(oid: string): OidEntry[] {
    const prefix = oid + '.'
    return entries().filter(e => e.oid.startsWith(prefix))
  }

  function getAncestors(oid: string): string[] {
    const ancestors: string[] = []
    let current = getParentOid(oid)
    while (current) {
      ancestors.unshift(current)
      current = getParentOid(current)
    }
    return ancestors
  }

  function expandToOid(oid: string) {
    const ancestors = getAncestors(oid)
    ancestors.forEach(a => expandedNodes.value.add(a))
    expandedNodes.value = new Set(expandedNodes.value)
  }

  return {
    tree,
    expandedNodes,
    toggleExpand,
    expandAll,
    collapseAll,
    getParentOid,
    getDescendants,
    getAncestors,
    expandToOid
  }
}
