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

const initialPosts: Post[] = [
  {
    id: 'post-1',
    title: '¿Cómo se resuelve una ecuación de segundo grado incompleta sin fórmula general?',
    content: 'Tengo la ecuación 3x² - 12 = 0. Sé que se puede despejar x directamente sin usar la fórmula de (-b ± √(b² - 4ac)) / 2a, pero me confundo con las raíces cuadradas. ¿Alguien me explica el procedimiento paso a paso?',
    author: {
      id: 'usr-2',
      name: 'Carlos Ruiz',
      avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      grade: '3º ESO',
    },
    subject: 'Matemáticas',
    grade: '3º ESO',
    status: 'resuelto',
    createdAt: 'Hace 25 minutos',
    likes: 12,
    hasLiked: false,
    tags: ['Álgebra', 'Ecuaciones', 'PasoAPaso'],
    cardColor: '#ffffff',
    answers: [
      {
        id: 'ans-1',
        postId: 'post-1',
        author: {
          id: 'usr-1',
          name: 'Sofía Martínez',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          grade: '3º ESO',
          points: 340,
        },
        content: '¡Hola Carlos! Es súper sencillo. Sigue estos tres pasos:\n\n1. Despeja x² pasando el término independiente al otro lado: 3x² = 12\n2. Divide entre el coeficiente: x² = 12 / 3 -> x² = 4\n3. Aplica la raíz cuadrada a ambos lados recordando el signo ±: x = ±√4\n\nPor tanto, las dos soluciones son x₁ = 2 y x₂ = -2. ¡Espero que te sirva!',
        createdAt: 'Hace 18 minutos',
        likes: 9,
        hasLiked: true,
        isAccepted: true,
      },
      {
        id: 'ans-2',
        postId: 'post-1',
        author: {
          id: 'usr-3',
          name: 'Mateo Fernández',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          grade: '4º ESO',
          points: 190,
        },
        content: 'También puedes factorizarlo como una diferencia de cuadrados: 3(x² - 4) = 3(x - 2)(x + 2) = 0, de donde sale x = 2 o x = -2.',
        createdAt: 'Hace 10 minutos',
        likes: 4,
        hasLiked: false,
        isAccepted: false,
      },
    ],
  },
  {
    id: 'post-2',
    title: '¿Cuáles fueron las causas principales de la Segunda Revolución Industrial?',
    content: 'Estamos preparando un resumen para el examen de Historia de 4º ESO. ¿Me podrían sintetizar los factores clave (tecnología, fuentes de energía, capitalismo) que la diferenciaron de la primera?',
    author: {
      id: 'usr-4',
      name: 'Lucía Gómez',
      avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
      grade: '4º ESO',
    },
    subject: 'Historia',
    grade: '4º ESO',
    status: 'resuelto',
    createdAt: 'Hace 1 hora',
    likes: 8,
    hasLiked: false,
    tags: ['RevoluciónIndustrial', 'SigloXIX', 'Examen'],
    cardColor: '#ffffff',
    answers: [
      {
        id: 'ans-3',
        postId: 'post-2',
        author: {
          id: 'usr-5',
          name: 'Javier Navarro',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
          grade: '1º Bachillerato',
          points: 410,
        },
        content: 'Las causas y diferencias clave se dividen en 4 puntos principales:\n• Fuentes de energía: Paso del carbón/vapor al Petróleo y la Electricidad.\n• Nuevas industrias: Desarrollo de la industria química, del acero (Convertidor Bessemer) y automotriz.\n• Globalización financiera: Nacimiento del capitalismo financiero y concentración empresarial (Trust, Cártel).\n• Transportes: Invención del motor de combustión y difusión del ferrocarril y el automóvil.',
        createdAt: 'Hace 45 minutos',
        likes: 11,
        hasLiked: false,
        isAccepted: true,
      },
    ],
  },
  {
    id: 'post-3',
    title: 'Duda sobre la Fotosíntesis: Diferencia entre fase luminosa y fase oscura',
    content: 'Sé que la fotosíntesis ocurre en los cloroplastos, pero no entiendo bien donde actúa la clorofila y en qué fase se produce el O₂ y en cuál la glucosa.',
    author: {
      id: 'usr-6',
      name: 'Alejandro Torres',
      avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      grade: '2º ESO',
    },
    subject: 'Ciencias',
    grade: '2º ESO',
    status: 'pendiente',
    createdAt: 'Hace 3 horas',
    likes: 5,
    hasLiked: false,
    tags: ['Biología', 'Fotosíntesis', 'Plantas'],
    cardColor: '#ffffff',
    answers: [
      {
        id: 'ans-4',
        postId: 'post-3',
        author: {
          id: 'usr-1',
          name: 'Sofía Martínez',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          grade: '3º ESO',
          points: 340,
        },
        content: 'La fase luminosa ocurre en los tilacoides (donde está la clorofila), usa luz solar y agua para generar ATP, NADPH y libera el O₂.\nLa fase oscura (Ciclo de Calvin) ocurre en el estroma, no necesita luz directa y usa el ATP/NADPH + CO₂ para sintetizar la glucosa.',
        createdAt: 'Hace 2 horas',
        likes: 6,
        hasLiked: false,
        isAccepted: false,
      },
    ],
  },
  {
    id: 'post-4',
    title: '¿Diferencia entre Oración Subordinada Sustantiva y Adjetiva?',
    content: 'Necesito una regla rápida de sustitución para saber si una proposición es sustantiva o adjetiva en los análisis sintácticos.',
    author: {
      id: 'usr-7',
      name: 'Elena Ramos',
      avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
      grade: '1º Bachillerato',
    },
    subject: 'Lengua',
    grade: '1º Bachillerato',
    status: 'pendiente',
    createdAt: 'Hace 5 horas',
    likes: 15,
    hasLiked: true,
    tags: ['Sintaxis', 'Gramática', 'Bachillerato'],
    cardColor: '#ffffff',
    answers: [],
  },
  {
    id: 'post-5',
    title: 'Difference between Present Perfect and Past Simple in English essay?',
    content: 'When I write about personal experiences with specific years (e.g. in 2022), should I always use Past Simple? And when should I prefer Present Perfect?',
    author: {
      id: 'usr-8',
      name: 'Daniel Blanco',
      avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
      grade: '4º ESO',
    },
    subject: 'Inglés',
    grade: '4º ESO',
    status: 'resuelto',
    createdAt: 'Hace 1 día',
    likes: 7,
    hasLiked: false,
    tags: ['EnglishGrammar', 'Tenses', 'Writing'],
    cardColor: '#ffffff',
    answers: [
      {
        id: 'ans-5',
        postId: 'post-5',
        author: {
          id: 'usr-9',
          name: 'Emma Watson',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
          grade: '2º Bachillerato',
          points: 520,
        },
        content: 'Yes! If you mention a specific finished time (in 2022, yesterday, last week), ALWAYS use Past Simple (e.g., "I visited London in 2022").\nUse Present Perfect when the time is unfinished or unstated (e.g., "I have visited London three times").',
        createdAt: 'Hace 22 horas',
        likes: 14,
        hasLiked: true,
        isAccepted: true,
      },
    ],
  },
]

export const usePost = () => {
  const posts = useState<Post[]>('posts_list', () => initialPosts)
  const selectedPostId = useState<string | null>('selected_post_id', () => null)
  const isCreateModalOpen = useState<boolean>('create_modal_open', () => false)
  const isDetailModalOpen = useState<boolean>('detail_modal_open', () => false)

  const { searchQuery, selectedSubject, selectedGrade, selectedStatus, sortBy } = useBoard()
  const { user, addPoints } = useAuth()

  // Computed filtered & sorted list
  const filteredPosts = computed(() => {
    return posts.value
      .filter((post) => {
        // Search filter
        if (searchQuery.value.trim() !== '') {
          const q = searchQuery.value.toLowerCase()
          const matchTitle = post.title.toLowerCase().includes(q)
          const matchContent = post.content.toLowerCase().includes(q)
          const matchAuthor = post.author.name.toLowerCase().includes(q)
          const matchTags = post.tags.some((t) => t.toLowerCase().includes(q))
          if (!matchTitle && !matchContent && !matchAuthor && !matchTags) return false
        }
        // Subject filter
        if (selectedSubject.value !== 'Todas' && post.subject !== selectedSubject.value) {
          return false
        }
        // Grade filter
        if (selectedGrade.value !== 'Todos' && post.grade !== selectedGrade.value) {
          return false
        }
        // Status filter
        if (selectedStatus.value !== 'todos' && post.status !== selectedStatus.value) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy.value === 'popular') {
          return b.likes - a.likes
        }
        if (sortBy.value === 'unanswered') {
          return a.answers.length - b.answers.length
        }
        // 'recent' by default (order of creation or id)
        return 0
      })
  })

  const currentPost = computed(() => {
    if (!selectedPostId.value) return null
    return posts.value.find((p) => p.id === selectedPostId.value) || null
  })

  const openPostDetail = (postId: string) => {
    selectedPostId.value = postId
    isDetailModalOpen.value = true
  }

  const closePostDetail = () => {
    isDetailModalOpen.value = false
    selectedPostId.value = null
  }

  const openCreateModal = () => {
    isCreateModalOpen.value = true
  }

  const closeCreateModal = () => {
    isCreateModalOpen.value = false
  }

  const getPostById = (id: string): Post | undefined => {
    return posts.value.find((p) => p.id === id)
  }

  const createPost = (data: {
    title: string
    content: string
    subject: string
    grade: string
    tags?: string[]
  }) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: data.title,
      content: data.content,
      subject: data.subject,
      grade: data.grade,
      status: 'pendiente',
      createdAt: 'Hace un momento',
      likes: 0,
      hasLiked: false,
      tags: data.tags && data.tags.length ? data.tags : [data.subject],
      author: {
        id: user.value?.id || 'usr-anon',
        name: user.value?.name || 'Estudiante Anónimo',
        avatar: user.value?.avatar,
        grade: data.grade,
      },
      answers: [],
      cardColor: '#ffffff',
    }

    posts.value.unshift(newPost)
    if (user.value) {
      user.value.questionsCount++
      addPoints(10) // 10 points for creating a question
    }
    closeCreateModal()
    return newPost
  }

  const addAnswer = (postId: string, content: string) => {
    const post = posts.value.find((p) => p.id === postId)
    if (!post || !content.trim()) return

    const newAnswer: Answer = {
      id: `ans-${Date.now()}`,
      postId,
      author: {
        id: user.value?.id || 'usr-anon',
        name: user.value?.name || 'Estudiante Anónimo',
        avatar: user.value?.avatar,
        grade: user.value?.grade || '3º ESO',
        points: user.value?.points || 50,
      },
      content: content.trim(),
      createdAt: 'Hace un momento',
      likes: 0,
      hasLiked: false,
      isAccepted: false,
    }

    post.answers.push(newAnswer)
    if (user.value) {
      user.value.answersCount++
      addPoints(15) // 15 points for providing an answer
    }
  }

  const toggleLikePost = (postId: string) => {
    const post = posts.value.find((p) => p.id === postId)
    if (!post) return
    if (post.hasLiked) {
      post.likes--
      post.hasLiked = false
    } else {
      post.likes++
      post.hasLiked = true
    }
  }

  const toggleLikeAnswer = (postId: string, answerId: string) => {
    const post = posts.value.find((p) => p.id === postId)
    if (!post) return
    const answer = post.answers.find((a) => a.id === answerId)
    if (!answer) return

    if (answer.hasLiked) {
      answer.likes--
      answer.hasLiked = false
    } else {
      answer.likes++
      answer.hasLiked = true
    }
  }

  const acceptAnswer = (postId: string, answerId: string) => {
    const post = posts.value.find((p) => p.id === postId)
    if (!post) return

    post.answers.forEach((ans) => {
      ans.isAccepted = ans.id === answerId
    })
    post.status = 'resuelto'

    if (user.value) {
      addPoints(25) // Bonus points for resolving a question
    }
  }

  return {
    posts,
    filteredPosts,
    currentPost,
    selectedPostId,
    isCreateModalOpen,
    isDetailModalOpen,
    openPostDetail,
    closePostDetail,
    openCreateModal,
    closeCreateModal,
    getPostById,
    createPost,
    addAnswer,
    toggleLikePost,
    toggleLikeAnswer,
    acceptAnswer,
  }
}
