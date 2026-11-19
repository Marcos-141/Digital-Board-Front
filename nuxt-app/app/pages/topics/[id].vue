<template>
  <div class="topic-detail-page">
    <!-- Breadcrumbs -->
    <v-breadcrumbs
      :items="breadcrumbs"
      class="pa-0 mb-4 text-caption text-muted"
    >
      <template #prepend>
        <v-icon size="16" class="mr-1">mdi-home-outline</v-icon>
      </template>
    </v-breadcrumbs>

    <!-- Loading State -->
    <div v-if="loading" class="py-6">
      <v-skeleton-loader type="heading, paragraph" class="mb-6 rounded-xl border-soft" />
      <v-row>
        <v-col v-for="i in 3" :key="i" cols="12" sm="6" lg="4">
          <v-skeleton-loader type="article" class="rounded-xl border-soft" />
        </v-col>
      </v-row>
    </div>

    <!-- Error State (e.g. 404 not found) -->
    <div v-else-if="error || !topic">
      <ErrorState
        title="Esta temática no existe o fue eliminada"
        :message="error || 'No encontramos la categoría solicitada.'"
        action-label="Volver a temáticas"
        @action="router.push('/topics')"
      />
    </div>

    <!-- Topic Content -->
    <div v-else>
      <!-- Topic Header Banner -->
      <v-card
        class="rounded-card border-soft overflow-hidden pa-6 mb-6 elevation-0"
        color="surface"
      >
        <div
          class="topic-accent-strip position-absolute"
          :style="{ top: 0, left: 0, right: 0, height: '6px', backgroundColor: topicColor }"
        />

        <div class="d-flex flex-wrap align-start justify-space-between pt-2 ga-4">
          <div style="max-width: 800px;">
            <div class="d-flex align-center ga-2 mb-2">
              <TopicChip
                :topic-id="topic.id"
                :name="topic.name"
                size="small"
              />
              <span class="text-caption text-muted">
                {{ posts.length === 1 ? '1 publicación' : `${posts.length} publicaciones` }}
              </span>
            </div>

            <h1 class="text-h5 text-sm-h4 font-weight-bold mb-2">
              {{ topic.name }}
            </h1>
            <p class="text-body-1 text-muted user-content mb-0">
              {{ topic.description }}
            </p>
          </div>

          <div class="d-flex align-center ga-2 mt-2 mt-sm-0">
            <v-btn
              color="primary"
              variant="flat"
              rounded="xl"
              class="font-weight-bold text-none px-4"
              prepend-icon="mdi-plus"
              @click="handlePublish"
            >
              Publicar en esta temática
            </v-btn>
          </div>
        </div>
      </v-card>

      <!-- Local search & toolbar -->
      <div class="d-flex flex-wrap align-center justify-space-between mb-4 ga-3">
        <div style="max-width: 380px;" class="w-100">
          <v-text-field
            v-model="localSearch"
            placeholder="Buscar dentro de esta temática..."
            prepend-inner-icon="mdi-magnify"
            clearable
            density="compact"
            variant="outlined"
            rounded="xl"
            hide-details
          />
        </div>

        <div class="d-flex align-center ga-2">
          <!-- View Toggle -->
          <v-btn-toggle
            :model-value="boardStore.viewMode"
            mandatory
            rounded="xl"
            density="compact"
            color="primary"
            class="border-soft"
            @update:model-value="(val) => boardStore.setViewMode(val)"
          >
            <v-btn value="grid" icon="mdi-view-grid-outline" aria-label="Vista cuadrícula" />
            <v-btn value="list" icon="mdi-view-agenda-outline" aria-label="Vista lista" />
          </v-btn-toggle>
        </div>
      </div>

      <!-- Empty Posts State -->
      <div v-if="posts.length === 0" class="py-4">
        <EmptyState
          icon="mdi-file-document-outline"
          title="Aún no hay publicaciones en esta temática"
          message="Inicia el debate o comparte el primer recurso para esta categoría."
          action-label="Publicar ahora"
          @action="handlePublish"
        />
      </div>

      <!-- Filtered Empty State -->
      <div v-else-if="filteredPosts.length === 0" class="py-4">
        <EmptyState
          icon="mdi-filter-remove-outline"
          title="No encontramos publicaciones con esa búsqueda"
          message="Intenta con otros términos dentro de esta temática."
          action-label="Limpiar búsqueda"
          @action="localSearch = ''"
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

    <!-- Post Dialog -->
    <PostFormDialog
      v-if="postDialogOpen"
      v-model="postDialogOpen"
      :post="editingPost"
      :locked-topic-id="topic ? topic.id : undefined"
      @saved="handlePostSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { topicsApi } from '~/api/topics.api'
import { usePostsStore } from '~/stores/posts'
import { useBoardStore } from '~/stores/board'
import { useAuthStore } from '~/stores/auth'
import { useTopicColor } from '~/composables/useTopicColor'
import { useNotify } from '~/composables/useNotify'
import { useConfirm } from '~/composables/useConfirm'
import { normalizeText } from '~/utils/strings'
import type { Topic } from '~/types/domain'
import type { PostResponse } from '~/types/api'

const route = useRoute()
const router = useRouter()
const postsStore = usePostsStore()
const boardStore = useBoardStore()
const authStore = useAuthStore()
const notify = useNotify()
const { confirm } = useConfirm()
const { getTopicColor } = useTopicColor()

const topicId = Number(route.params.id)

const topic = ref<Topic | null>(null)
const posts = ref<PostResponse[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const localSearch = ref('')

// Dialogs
const postDialogOpen = ref(false)
const editingPost = ref<PostResponse | null>(null)

const topicColor = computed(() => (topic.value ? getTopicColor(topic.value.id) : '#a1c1be'))

const breadcrumbs = computed(() => [
  { title: 'Inicio', href: '/' },
  { title: 'Temáticas', href: '/topics' },
  { title: topic.value?.name || 'Cargando...', disabled: true },
])

async function loadTopicData(): Promise<void> {
  if (isNaN(topicId)) {
    error.value = 'Identificador de temática inválido.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const [fetchedTopic, fetchedPosts] = await Promise.all([
      topicsApi.get(topicId),
      postsStore.fetchByTopic(topicId, true),
    ])
    topic.value = fetchedTopic
    posts.value = fetchedPosts

    useSeoMeta({
      title: `${fetchedTopic.name} - Temática`,
      description: fetchedTopic.description,
    })
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'No se pudo cargar la temática.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTopicData()
})

const filteredPosts = computed(() => {
  const q = normalizeText(localSearch.value)
  if (!q) return posts.value
  return posts.value.filter((p) => {
    return (
      normalizeText(p.title).includes(q) ||
      normalizeText(p.description).includes(q) ||
      normalizeText(p.userName).includes(q)
    )
  })
})

function handlePublish(): void {
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  editingPost.value = null
  postDialogOpen.value = true
}

function handleEditPost(post: PostResponse): void {
  editingPost.value = post
  postDialogOpen.value = true
}

async function handleDeletePost(post: PostResponse): Promise<void> {
  const ok = await confirm({
    title: 'Eliminar publicación',
    message: `¿Deseas eliminar la publicación "${post.title}"?`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    destructive: true,
  })

  if (!ok) return

  try {
    await postsStore.deletePost(post.postId, topicId)
    posts.value = posts.value.filter((p) => p.postId !== post.postId)
    notify.success('Publicación eliminada.')
  } catch {
    notify.error('No se pudo eliminar la publicación.')
  }
}

function handlePostSaved(): void {
  postDialogOpen.value = false
  loadTopicData()
}
</script>
