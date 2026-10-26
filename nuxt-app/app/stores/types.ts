export interface UserBadge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  grade: string
  favoriteSubject: string
  bio: string
  points: number
  questionsCount: number
  answersCount: number
  acceptedAnswersCount: number
  badges: UserBadge[]
}

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
  '5°',
  '6°',
  '7°',
  '8°',
  '9°',
  '10°',
  '11°',
] as const

export interface Answer {
  id: string
  postId: string
  author: {
    id: string
    name: string
    avatar?: string
    grade: string
    points?: number
  }
  content: string
  createdAt: string
  likes: number
  hasLiked?: boolean
  isAccepted: boolean
}

export interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    grade: string
  }
  subject: string
  grade: string
  status: 'pendiente' | 'resuelto'
  createdAt: string
  likes: number
  hasLiked?: boolean
  tags: string[]
  answers: Answer[]
  cardColor?: string
}

export interface CreatePostPayload {
  title: string
  content: string
  subject: string
  grade: string
  tags?: string[]
}

export interface RegisterPayload {
  name: string
  email: string
  grade: string
  favoriteSubject: string
}
