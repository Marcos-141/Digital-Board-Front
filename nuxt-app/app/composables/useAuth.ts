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

const defaultUser: UserProfile = {
  id: 'usr-1',
  name: 'Sofía Martínez',
  email: 'sofia.martinez@estudiante.edu',
  avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
  grade: '3º ESO',
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

export const useAuth = () => {
  const user = useState<UserProfile | null>('auth_user', () => defaultUser)
  const loading = useState<boolean>('auth_loading', () => false)
  const error = useState<string | null>('auth_error', () => null)

  const isAuthenticated = computed(() => !!user.value)

  const login = async (email: string, pass: string): Promise<boolean> => {
    loading.value = true
    error.value = null
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (!email || !pass) {
      error.value = 'Por favor ingresa un correo y contraseña válidos.'
      loading.value = false
      return false
    }

    user.value = {
      ...defaultUser,
      email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase() || 'Estudiante Demo',
    }
    loading.value = false
    return true
  }

  const register = async (payload: {
    name: string
    email: string
    grade: string
    favoriteSubject: string
  }): Promise<boolean> => {
    loading.value = true
    error.value = null
    await new Promise((resolve) => setTimeout(resolve, 900))

    user.value = {
      id: `usr-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${payload.name}`,
      grade: payload.grade || '3º ESO',
      favoriteSubject: payload.favoriteSubject || 'Matemáticas',
      bio: '¡Nuevo estudiante explorando el Muro Educativo Tablero Digital!',
      points: 50,
      questionsCount: 0,
      answersCount: 0,
      acceptedAnswersCount: 0,
      badges: defaultUser.badges.map((b, i) => ({ ...b, unlocked: i === 0 })),
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

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    addPoints,
  }
}
