export type ViewMode = 'grid' | 'list'
export type SortOption = 'recent' | 'popular' | 'unanswered'
export type StatusFilter = 'todos' | 'pendiente' | 'resuelto'

export const SUBJECTS_LIST = [
  'Todas',
  'Matemáticas',
  'Historia',
  'Ciencias',
  'Lengua',
  'Inglés',
  'Arte',
  'Tecnología',
] as const

export const GRADES_LIST = [
  'Todos',
  '1º ESO',
  '2º ESO',
  '3º ESO',
  '4º ESO',
  '1º Bachillerato',
  '2º Bachillerato',
] as const

export const useBoard = () => {
  const searchQuery = useState<string>('board_search', () => '')
  const selectedSubject = useState<string>('board_subject', () => 'Todas')
  const selectedGrade = useState<string>('board_grade', () => 'Todos')
  const selectedStatus = useState<StatusFilter>('board_status', () => 'todos')
  const sortBy = useState<SortOption>('board_sort', () => 'recent')
  const viewMode = useState<ViewMode>('board_view_mode', () => 'grid')

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
  }
}
