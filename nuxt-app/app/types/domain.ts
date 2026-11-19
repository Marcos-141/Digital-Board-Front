export interface Topic {
  id: number
  name: string
  description: string
}

export type BoardSortOption = 'recent' | 'oldest' | 'title_asc'
export type BoardViewMode = 'grid' | 'list'
