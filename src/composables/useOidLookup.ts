import { ref } from 'vue'

interface LookupResult {
  oid: string
  name: string
  description?: string
  asnNotation?: string
  iriNotation?: string
}

export function useOidLookup() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

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
    } catch (e) {
      error.value = 'Network error. Make sure the proxy server is running (npm run server)'
      return null
    } finally {
      isLoading.value = false
    }
  }

  function openOidBase(oid: string) {
    window.open(`https://oid-base.com/get/${oid}`, '_blank')
  }

  return {
    lookupOid,
    openOidBase,
    isLoading,
    error
  }
}
