import { defineStore } from 'pinia'
import type { UserProfile, RegisterPayload, UserBadge } from './types'

export const defaultStudentUser: UserProfile = {
  id: 'usr-1',
  name: 'Sofía Martínez',
  email: 'sofia.martinez@estudiante.edu',
  avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
  grade: '10°',
  favoriteSubject: 'Matemáticas',
  bio: 'Apasionada por la ciencia y la resolución de problemas lógicos. ¡Siempre dispuesta a ayudar!',
  points: 340,
  questionsCount: 5,
  answersCount: 14,
  acceptedAnswersCount: 6,
  badges: [
    {
      id: 'badge-1',
      name: 'Primeros Pasos',
      description: 'Publicó su primera pregunta en el Tablero Digital.',
      icon: 'mdi-seed-outline',
      color: '#a1c1be',
      unlocked: true,
      unlockedAt: '12 de Feb, 2026',
    },
    {
      id: 'badge-2',
      name: 'Resolvedor Experto',
      description: 'Consiguió 5 respuestas marcadas como solución aceptada.',
      icon: 'mdi-check-decagram',
      color: '#7bb0a6',
      unlocked: true,
      unlockedAt: '03 de Mar, 2026',
    },
    {
      id: 'badge-3',
      name: 'Tutor Estrella',
      description: 'Superó los 300 puntos de reputación colaborativa.',
      icon: 'mdi-star-face',
      color: '#e0a96d',
      unlocked: true,
      unlockedAt: '15 de Mar, 2026',
    },
    {
      id: 'badge-4',
      name: 'Pensador Crítico',
      description: 'Aporta explicaciones detalladas con más de 10 likes en una respuesta.',
      icon: 'mdi-lightbulb-on-outline',
      color: '#74a2be',
      unlocked: false,
      progress: 7,
      maxProgress: 10,
    },
    {
      id: 'badge-5',
      name: 'Colaborador Top',
      description: 'Ha respondido preguntas en más de 4 materias distintas.',
      icon: 'mdi-trophy-variant-outline',
      color: '#b08ebb',
      unlocked: false,
      progress: 3,
      maxProgress: 4,
    },
  ],
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(defaultStudentUser)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const userPoints = computed(() => user.value?.points ?? 0)
  const unlockedBadgesCount = computed(() => {
    return user.value?.badges.filter((b) => b.unlocked).length ?? 0
  })

  const login = async (email: string, pass: string): Promise<boolean> => {
    loading.value = true
    error.value = null
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (!email || !pass) {
      error.value = 'Por favor ingresa un correo y contraseña válidos.'
      loading.value = false
      return false
    }

    const normalizedEmailName = email.split('@')[0]?.replace('.', ' ').toUpperCase() || 'Estudiante Demo'

    user.value = {
      ...defaultStudentUser,
      email,
      name: normalizedEmailName,
    }
    loading.value = false
    return true
  }

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    loading.value = true
    error.value = null
    await new Promise((resolve) => setTimeout(resolve, 900))

    user.value = {
      id: `usr-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(payload.name)}`,
      grade: payload.grade || '10°',
      favoriteSubject: payload.favoriteSubject || 'Matemáticas',
      bio: '¡Nuevo estudiante explorando el Muro Educativo Tablero Digital!',
      points: 50,
      questionsCount: 0,
      answersCount: 0,
      acceptedAnswersCount: 0,
      badges: defaultStudentUser.badges.map((b, i) => ({ ...b, unlocked: i === 0 })),
    }
    loading.value = false
    return true
  }

  const logout = () => {
    user.value = null
  }

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user.value) {
      user.value = { ...user.value, ...data }
    }
  }

  const addPoints = (amount: number) => {
    if (user.value) {
      user.value.points += amount
    }
  }

  const incrementQuestions = () => {
    if (user.value) {
      user.value.questionsCount += 1
    }
  }

  const incrementAnswers = () => {
    if (user.value) {
      user.value.answersCount += 1
    }
  }

  const incrementAcceptedAnswers = () => {
    if (user.value) {
      user.value.acceptedAnswersCount += 1
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    userPoints,
    unlockedBadgesCount,
    login,
    register,
    logout,
    updateProfile,
    addPoints,
    incrementQuestions,
    incrementAnswers,
    incrementAcceptedAnswers,
  }
})
