//Fernando urrutia, Bienvenidos a la opera
import { defineStore } from 'pinia'
import {
  type ViewMode,
  type SortOption,
  type StatusFilter,
  SUBJECTS_LIST,
  GRADES_LIST,
} from './types'

export const useBoardStore = defineStore('board', () => {
  const searchQuery = ref<string>('')
  const selectedSubject = ref<string>('Todas')
  const selectedGrade = ref<string>('Todos')
  const selectedStatus = ref<StatusFilter>('todos')
  const sortBy = ref<SortOption>('recent')
  const viewMode = ref<ViewMode>('grid')

  const activeFiltersCount = computed(() => {
    let count = 0
    if (selectedSubject.value !== 'Todas') count++
    if (selectedGrade.value !== 'Todos') count++
    if (selectedStatus.value !== 'todos') count++
    if (searchQuery.value.trim() !== '') count++
    return count
  })

  const resetFilters = () => {
    searchQuery.value = ''
    selectedSubject.value = 'Todas'
    selectedGrade.value = 'Todos'
    selectedStatus.value = 'todos'
    sortBy.value = 'recent'
  }

  const setSubject = (subject: string) => {
    selectedSubject.value = subject
  }

  const setGrade = (grade: string) => {
    selectedGrade.value = grade
  }

  const setStatus = (status: StatusFilter) => {
    selectedStatus.value = status
  }

  const setSort = (sort: SortOption) => {
    sortBy.value = sort
  }

  const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
  }

  const setViewMode = (mode: ViewMode) => {
    viewMode.value = mode
  }

  return {
    searchQuery,
    selectedSubject,
    selectedGrade,
    selectedStatus,
    sortBy,
    viewMode,
    activeFiltersCount,
    subjects: SUBJECTS_LIST,
    grades: GRADES_LIST,
    resetFilters,
    setSubject,
    setGrade,
    setStatus,
    setSort,
    toggleViewMode,
    setViewMode,
  }
})
