<template>
  <div class="board-page">
    <!-- Toolbar with Counters and Mode Switcher -->
    <BoardToolbar
      :total-posts="postsStore.allPosts.length"
      :total-topics="topicsStore.topics.length"
    />

    <!-- Partial Failures Notice (if some topic failed to fetch) -->
    <v-alert
      v-if="postsStore.partialFailures.length > 0"
      density="compact"
      type="warning"
      variant="tonal"
      rounded="xl"
      class="mb-4 text-caption"
      icon="mdi-alert-outline"
      closable
    >
      Una o más temáticas no pudieron responder en este momento. Mostramos las disponibles.
    </v-alert>

    <!-- Initial Loading State -->
    <div v-if="loading && postsStore.allPosts.length === 0" class="py-4">
      <v-row>
        <v-col v-for="i in 6" :key="i" cols="12" sm="6" lg="4">
          <v-skeleton-loader
            type="article"
            class="rounded-xl border-soft"
            elevation="0"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Error State -->
    <div v-else-if="error && postsStore.allPosts.length === 0">
      <ErrorState
        title="No pudimos cargar el muro"
        :message="error"
        action-label="Reintentar carga"
        @action="loadData(true)"
      />
    </div>

    <!-- Empty State: No Topics exist yet -->
    <div v-else-if="!loading && topicsStore.topics.length === 0">
      <EmptyState
        icon="mdi-tag-plus-outline"
        title="Aún no hay temáticas creadas"
        message="Para comenzar a publicar en el tablero, es necesario contar con al menos una temática (ej. Anuncios Generales o Dudas de Clase)."
      >
        <template #action>
          <div v-if="authStore.canManageTopics" class="d-flex flex-wrap justify-center ga-2">
            <v-btn
              color="primary"
              variant="flat"
              rounded="xl"
              class="text-none font-weight-bold px-5"
              prepend-icon="mdi-plus"
              @click="topicFormOpen = true"
            >
              Crear temática personalizada
            </v-btn>
            <v-btn
              color="secondary-darken-1"
              variant="tonal"
              rounded="xl"
              class="text-none font-weight-bold px-5"
              prepend-icon="mdi-auto-fix"
              :loading="seedingTopics"
              @click="handleSeedSuggestedTopics"
            >
              Cargar temáticas sugeridas
            </v-btn>
          </div>
        </template>
      </EmptyState>
    </div>

    <!-- Empty State: Topics exist, but no posts anywhere -->
    <div v-else-if="!loading && postsStore.allPosts.length === 0">
      <EmptyState
        icon="mdi-bulletin-board"
        title="El muro está listo para comenzar"
        message="Sé el primero en compartir un anuncio, duda o recurso de aprendizaje con la comunidad."
        action-label="Crear publicación"
        @action="handleCreatePost"
      />
    </div>

    <!-- Content: Filter Bar + Filtered Posts -->
    <div v-else>
      <BoardFilterBar :posts="postsStore.allPosts" />

      <!-- Filtered Results Empty State -->
      <div v-if="filteredPosts.length === 0" class="py-4">
        <EmptyState
          icon="mdi-filter-remove-outline"
          title="Ningún resultado coincide con tus filtros"
          message="Intenta cambiar los términos de búsqueda o limpiar los filtros seleccionados."
          action-label="Restablecer filtros"
          @action="boardStore.resetFilters()"
        />
      </div>

      <!-- Posts Grid/List -->
      <BoardGrid
        v-else
        :posts="filteredPosts"
        :view-mode="boardStore.viewMode"
        @edit="handleEditPost"
        @delete="handleDeletePost"
      />
    </div>

    <!-- Post Edit Dialog -->
    <PostFormDialog
      v-if="editingPost"
      v-model="editDialogOpen"
      :post="editingPost"
      @saved="editingPost = null"
    />

    <!-- Topic Form Dialog (for empty state CTA) -->
    <TopicFormDialog
      v-model="topicFormOpen"
      @saved="handleTopicCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { usePostsStore } from '~/stores/posts'
import { useTopicsStore } from '~/stores/topics'
import { useBoardStore } from '~/stores/board'
import { useAuthStore } from '~/stores/auth'
import { useNotify } from '~/composables/useNotify'
import { useConfirm } from '~/composables/useConfirm'
import { usePostDialog } from '~/composables/usePostDialog'
import { normalizeText } from '~/utils/strings'
import { DEFAULT_SUGGESTED_TOPICS } from '~/utils/default-topics'
import type { PostResponse } from '~/types/api'

useSeoMeta({
  title: 'Muro Colaborativo',
  description: 'Explora y participa en las publicaciones organizadas por temáticas en Tablero Digital.',
})

const postsStore = usePostsStore()
const topicsStore = useTopicsStore()
const boardStore = useBoardStore()
const authStore = useAuthStore()
const notify = useNotify()
const { confirm } = useConfirm()
const postDialog = usePostDialog()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref<string | null>(null)
const seedingTopics = ref(false)

// Dialogs
const editingPost = ref<PostResponse | null>(null)
const editDialogOpen = ref(false)
const topicFormOpen = ref(false)

// Sync query params (?q= and ?topic=) on initial load
onMounted(() => {
  if (route.query.q) {
    boardStore.searchQuery = String(route.query.q)
  }
  if (route.query.topic) {
    boardStore.selectedTopicId = Number(route.query.topic)
  }
})

// Sync boardStore changes to URL query
watch(
  [() => boardStore.searchQuery, () => boardStore.selectedTopicId],
  ([q, topic]) => {
    const query: Record<string, string> = {}
    if (q && q.trim()) query.q = q.trim()
    if (topic !== null && topic !== undefined) query.topic = String(topic)
    router.replace({ path: '/', query })
  }
)

async function loadData(force = false): Promise<void> {
  loading.value = true
  error.value = null
  try {
    await topicsStore.fetchTopics(force)
    await postsStore.fetchAll(force)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// Filtered and Sorted Posts
const filteredPosts = computed(() => {
  let list = [...postsStore.allPosts]

  // Filter by topic
  if (boardStore.selectedTopicId !== null) {
    list = list.filter((p) => p.topicId === boardStore.selectedTopicId)
  }

  // Filter by author
  if (boardStore.selectedAuthorId !== null) {
    list = list.filter((p) => p.userId === boardStore.selectedAuthorId)
  }

  // Filter by search query (accent insensitive, case insensitive)
  const q = normalizeText(boardStore.searchQuery)
  if (q) {
    list = list.filter((p) => {
      const matchTitle = normalizeText(p.title).includes(q)
      const matchDesc = normalizeText(p.description).includes(q)
      const matchAuthor = normalizeText(p.userName).includes(q)
      const matchTopic = normalizeText(p.topicName).includes(q)
      return matchTitle || matchDesc || matchAuthor || matchTopic
    })
  }

  // Sorting
  if (boardStore.sortBy === 'recent') {
    list.sort((a, b) => {
      const dateA = a.createdAt || ''
      const dateB = b.createdAt || ''
      if (dateA !== dateB) return dateB.localeCompare(dateA)
      return (b.postId || 0) - (a.postId || 0)
    })
  } else if (boardStore.sortBy === 'oldest') {
    list.sort((a, b) => {
      const dateA = a.createdAt || ''
      const dateB = b.createdAt || ''
      if (dateA !== dateB) return dateA.localeCompare(dateB)
      return (a.postId || 0) - (b.postId || 0)
    })
  } else if (boardStore.sortBy === 'title_asc') {
    list.sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }))
  }

  return list
})

function handleCreatePost(): void {
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: '/' } })
    return
  }
  postDialog.open()
}

function handleTopicCreated(): void {
  loadData(true)
}

async function handleSeedSuggestedTopics(): Promise<void> {
  seedingTopics.value = true
  try {
    for (const item of DEFAULT_SUGGESTED_TOPICS) {
      await topicsStore.createTopic(item)
    }
    notify.success('¡Temáticas sugeridas creadas con éxito!')
    await loadData(true)
  } catch {
    notify.error('No se pudieron crear las temáticas. Verifica que el servidor esté activo.')
  } finally {
    seedingTopics.value = false
  }
}

function handleEditPost(post: PostResponse): void {
  editingPost.value = post
  editDialogOpen.value = true
}

async function handleDeletePost(post: PostResponse): Promise<void> {
  const ok = await confirm({
    title: 'Eliminar publicación',
    message: `¿Estás seguro de que deseas eliminar la publicación "${post.title}"? Esta acción borrará también sus comentarios asociados de forma permanente.`,
    confirmText: 'Eliminar definitivamente',
    cancelText: 'Cancelar',
    destructive: true,
  })

  if (!ok) return

  try {
    await postsStore.deletePost(post.postId, post.topicId)
    notify.success('Publicación eliminada correctamente.')
  } catch {
    notify.error('No se pudo eliminar la publicación. Verifica tu conexión.')
  }
}
</script>
