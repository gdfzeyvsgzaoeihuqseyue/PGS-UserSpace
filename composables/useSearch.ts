import { ref, computed } from 'vue'

/**
 * Composable pour gérer la recherche dans une liste d'éléments
 * @template T Type des éléments à rechercher
 */
export function useSearch<T extends Record<string, any>>(
  items: Ref<T[]> | ComputedRef<T[]>,
  searchableFields: (keyof T)[]
) {
  const searchQuery = ref('')

  const filteredItems = computed(() => {
    if (!searchQuery.value.trim()) {
      return items.value
    }

    const query = searchQuery.value.toLowerCase().trim()

    return items.value.filter(item => {
      return searchableFields.some(field => {
        const value = item[field]
        if (value === null || value === undefined) return false

        // Handle nested objects
        if (typeof value === 'object') {
          return JSON.stringify(value).toLowerCase().includes(query)
        }

        return String(value).toLowerCase().includes(query)
      })
    })
  })

  const clearSearch = () => {
    searchQuery.value = ''
  }

  const hasActiveSearch = computed(() => !!searchQuery.value.trim())

  return {
    searchQuery,
    filteredItems,
    clearSearch,
    hasActiveSearch
  }
}
