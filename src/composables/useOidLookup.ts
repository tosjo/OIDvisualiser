import { ref } from 'vue'

interface LookupResult {
  oid: string
  name: string
  description?: string
  asnNotation?: string
  iriNotation?: string
}

interface ChildOid {
  oid: string
  name: string
  description?: string
}

interface ChildrenResult {
  parentOid: string
  children: ChildOid[]
  count: number
}

export function useOidLookup() {
  const isLoading = ref(false)
  const isLoadingChildren = ref(false)
  const error = ref<string | null>(null)
  const childrenError = ref<string | null>(null)

  async function lookupOid(oid: string): Promise<LookupResult | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`/api/lookup/${encodeURIComponent(oid)}`)

      if (!response.ok) {
        if (response.status === 404) {
          error.value = 'OID not found in oid-base.com'
        } else {
          error.value = 'Failed to fetch OID information'
        }
        return null
      }

      const data = await response.json()
      return data as LookupResult
    } catch {
      error.value = 'Network error. Make sure the proxy server is running (npm run server)'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchChildren(parentOid: string): Promise<ChildOid[]> {
    isLoadingChildren.value = true
    childrenError.value = null

    try {
      const response = await fetch(`/api/children/${encodeURIComponent(parentOid)}`)

      if (!response.ok) {
        if (response.status === 404) {
          childrenError.value = 'OID not found in oid-base.com'
        } else {
          childrenError.value = 'Failed to fetch children'
        }
        return []
      }

      const data: ChildrenResult = await response.json()
      return data.children
    } catch {
      childrenError.value = 'Network error. Make sure the proxy server is running (npm run server)'
      return []
    } finally {
      isLoadingChildren.value = false
    }
  }

  function openOidBase(oid: string) {
    window.open(`https://oid-base.com/get/${oid}`, '_blank')
  }

  return {
    lookupOid,
    fetchChildren,
    openOidBase,
    isLoading,
    isLoadingChildren,
    error,
    childrenError
  }
}
