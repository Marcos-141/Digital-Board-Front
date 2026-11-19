import { defineStore } from 'pinia'
import type { BoardSortOption, BoardViewMode } from '~/types/domain'

export const useBoardStore = defineStore('board', () => {
  const searchQuery = ref('')
  const selectedTopicId = ref<number | null>(null)
  const selectedAuthorId = ref<number | null>(null)
  const sortBy = ref<BoardSortOption>('recent')
  const viewMode = ref<BoardViewMode>('grid')

  function initViewMode(): void {
    if (import.meta.client) {
      const saved = localStorage.getItem('db_view_mode') as BoardViewMode | null
      if (saved === 'grid' || saved === 'list') {
        viewMode.value = saved
      }
    }
  }

  function setViewMode(mode: BoardViewMode): void {
    viewMode.value = mode
    if (import.meta.client) {
      localStorage.setItem('db_view_mode', mode)
    }
  }

  function resetFilters(): void {
    searchQuery.value = ''
    selectedTopicId.value = null
    selectedAuthorId.value = null
    sortBy.value = 'recent'
  }

  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value.trim() !== '' ||
      selectedTopicId.value !== null ||
      selectedAuthorId.value !== null ||
      sortBy.value !== 'recent'
    )
  })

  return {
    searchQuery,
    selectedTopicId,
    selectedAuthorId,
    sortBy,
    viewMode,
    hasActiveFilters,
    initViewMode,
    setViewMode,
    resetFilters,
  }
})
