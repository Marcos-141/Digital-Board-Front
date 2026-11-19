<template>
  <div class="post-detail-page">
    <!-- Breadcrumbs & Back Button -->
    <div class="d-flex align-center justify-space-between mb-4">
      <v-breadcrumbs :items="breadcrumbs" class="pa-0 text-caption text-muted">
        <template #prepend>
          <v-icon size="16" class="mr-1">mdi-home-outline</v-icon>
        </template>
      </v-breadcrumbs>

      <v-btn variant="text" prepend-icon="mdi-arrow-left" rounded="xl" size="small" class="text-none font-weight-bold"
        @click="handleBack">
        Volver
      </v-btn>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-6">
      <v-skeleton-loader type="heading, list-item-avatar, paragraph, image" class="rounded-xl border-soft mb-6" />
      <v-skeleton-loader type="paragraph" class="rounded-xl border-soft" />
    </div>

    <!-- Error / 404 State -->
    <div v-else-if="error || !post">
      <ErrorState title="Publicación no encontrada"
        :message="error || 'La publicación que buscas no existe o ha sido eliminada.'"
        action-label="Ir al muro principal" @action="router.push('/')" />
    </div>

    <!-- Post Details & Layout -->
    <v-row v-else>
      <!-- Main Content Column -->
      <v-col cols="12" lg="8">
        <!-- Main Post Card -->
        <v-card class="rounded-card border-soft overflow-hidden pa-6 mb-6" color="surface" elevation="0">
          <!-- Top Accent Strip with Topic Color -->
          <div class="position-absolute"
            :style="{ top: 0, left: 0, right: 0, height: '6px', backgroundColor: topicColor }" />

          <!-- Topic Chip & Post Actions Menu -->
          <div class="d-flex align-center justify-space-between pt-2 mb-3">
            <TopicChip v-if="post.topicName" :topic-id="post.topicId" :name="post.topicName"
              :to="post.topicId ? `/topics/${post.topicId}` : undefined" />
            <span v-else class="text-caption text-muted">Sin temática</span>

            <!-- Actions Menu (canEdit) -->
            <div v-if="canEdit" class="ml-2">
              <v-menu location="bottom end">
                <template #activator="{ props: menuProps }">
                  <v-btn v-bind="menuProps" icon="mdi-dots-vertical" variant="text" size="small"
                    aria-label="Opciones de publicación" />
                </template>
                <v-card class="rounded-lg pa-1 border-soft" elevation="3">
                  <v-list density="compact" nav class="pa-0">
                    <v-list-item prepend-icon="mdi-pencil-outline" title="Editar publicación"
                      @click="editDialogOpen = true" />
                    <v-list-item prepend-icon="mdi-delete-outline" title="Eliminar publicación" color="error"
                      @click="handleDeletePost" />
                  </v-list>
                </v-card>
              </v-menu>
            </div>
          </div>

          <!-- Title (h1) -->
          <h1 class="text-h5 text-sm-h4 font-weight-bold mb-4">
            {{ post.title }}
          </h1>

          <!-- Author Info & Dates -->
          <div class="d-flex align-center mb-6 pb-4 border-b">
            <NuxtLink :to="post.userId ? `/users/${post.userId}` : undefined"
              class="d-flex align-center text-decoration-none text-current">
              <UserAvatar :name="post.userName || 'Usuario'" size="42" class="mr-3" />
              <div>
                <div class="text-subtitle-2 font-weight-bold">
                  {{ post.userName || 'Usuario eliminado' }}
                </div>
                <div class="text-caption text-muted">
                  Publicado el {{ formattedCreatedAt }}
                  <span v-if="isEdited">· Editado el {{ formattedUpdatedAt }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Featured Image (if present, with zoom dialog) -->
          <div v-if="post.image" class="mb-6">
            <ImagePreview :src="post.image" :alt="post.title" :aspect="16 / 9" zoomable />
          </div>

          <!-- Description (Plain text with pre-line, NO v-html) -->
          <div class="text-body-1 text-on-surface user-content mb-4" style="line-height: 1.7;">
            {{ post.description }}
          </div>
        </v-card>

        <!-- Comments Section -->
        <div class="comments-section mb-6">
          <CommentList :comments="comments" @updated="handleCommentUpdated" @deleted="handleCommentDeleted" />

          <!-- New Comment Form -->
          <CommentForm :post-id="postId" @created="handleCommentCreated" />
        </div>
      </v-col>

      <!-- Sidebar Column (Desktop) -->
      <v-col cols="12" lg="4" class="d-none d-lg-block">
        <!-- Topic Information Card -->
        <v-card v-if="topicInfo" class="rounded-card border-soft pa-5 mb-4" color="surface" elevation="0">
          <div class="d-flex align-center mb-3">
            <v-icon icon="mdi-tag-outline" color="primary-darken-1" class="mr-2" />
            <h3 class="text-subtitle-1 font-weight-bold mb-0">Sobre la temática</h3>
          </div>
          <div class="mb-2">
            <TopicChip :topic-id="topicInfo.id" :name="topicInfo.name" />
          </div>
          <p class="text-body-2 text-muted user-content mb-4">
            {{ topicInfo.description }}
          </p>
          <v-btn :to="`/topics/${topicInfo.id}`" variant="tonal" block rounded="xl" size="small"
            class="text-none font-weight-bold">
            Ver más en esta temática
          </v-btn>
        </v-card>

        <!-- Community Best Practices Card -->
        <v-card class="rounded-card border-soft pa-5 bg-surface-variant elevation-0">
          <div class="d-flex align-center mb-3">
            <v-icon icon="mdi-lightbulb-on-outline" color="warning" class="mr-2" />
            <h3 class="text-subtitle-1 font-weight-bold mb-0 text-on-surface-variant">Buenas prácticas</h3>
          </div>
          <ul class="text-body-2 text-on-surface-variant pa-0 ma-0" style="list-style: none;">
            <li class="mb-2 d-flex align-start">
              <v-icon size="16" color="success" class="mr-2 mt-1">mdi-check</v-icon>
              <span>Sé claro, constructivo y aporta contexto a tu intervención.</span>
            </li>
            <li class="mb-2 d-flex align-start">
              <v-icon size="16" color="success" class="mr-2 mt-1">mdi-check</v-icon>
              <span>Mantén el respeto hacia todos los miembros de la comunidad.</span>
            </li>
            <li class="d-flex align-start">
              <v-icon size="16" color="success" class="mr-2 mt-1">mdi-check</v-icon>
              <span>Si compartes enlaces o imágenes, verifica que sean pertinentes al tema.</span>
            </li>
          </ul>
        </v-card>
      </v-col>
    </v-row>

    <!-- Post Edit Dialog -->
    <PostFormDialog v-if="post && editDialogOpen" v-model="editDialogOpen" :post="post" @saved="handlePostUpdated" />
  </div>
</template>

<script setup lang="ts">
import { usePostsStore } from '~/stores/posts'
import { useTopicsStore } from '~/stores/topics'
import { useCommentsStore } from '~/stores/comments'
import { useAuthStore } from '~/stores/auth'
import { useTopicColor } from '~/composables/useTopicColor'
import { useFormatDate } from '~/composables/useFormatDate'
import { useConfirm } from '~/composables/useConfirm'
import { useNotify } from '~/composables/useNotify'
import type { PostResponse, CommentResponse } from '~/types/api'
import type { Topic } from '~/types/domain'

const route = useRoute()
const router = useRouter()
const postsStore = usePostsStore()
const topicsStore = useTopicsStore()
const commentsStore = useCommentsStore()
const authStore = useAuthStore()
const { getTopicColor } = useTopicColor()
const { formatDate } = useFormatDate()
const { confirm } = useConfirm()
const notify = useNotify()

const postId = Number(route.params.id)

const post = ref<PostResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const editDialogOpen = ref(false)

const topicColor = computed(() => getTopicColor(post.value?.topicId))
const formattedCreatedAt = computed(() => formatDate(post.value?.createdAt))
const formattedUpdatedAt = computed(() => formatDate(post.value?.updateAt))
const isEdited = computed(() => {
  return post.value?.updateAt && post.value.updateAt !== post.value.createdAt
})
const canEdit = computed(() => authStore.canEdit(post.value?.userId))

const comments = computed(() => commentsStore.commentsByPost[postId] || [])

const topicInfo = computed<Topic | undefined>(() => {
  if (!post.value?.topicId) return undefined
  return topicsStore.topicsMap.get(post.value.topicId)
})

const breadcrumbs = computed(() => [
  { title: 'Inicio', href: '/' },
  {
    title: post.value?.topicName || 'Temática',
    href: post.value?.topicId ? `/topics/${post.value.topicId}` : '/topics',
  },
  { title: post.value?.title || 'Detalle', disabled: true },
])

async function loadPostData(): Promise<void> {
  if (isNaN(postId)) {
    error.value = 'Identificador de publicación inválido.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const [fetchedPost] = await Promise.all([
      postsStore.fetchById(postId),
      commentsStore.fetchByPost(postId),
      topicsStore.fetchTopics(),
    ])
    post.value = fetchedPost

    useSeoMeta({
      title: `${fetchedPost.title} - Tablero Digital`,
      description: fetchedPost.description.slice(0, 160),
    })
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'No se pudo cargar la publicación.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPostData()
})

function handleBack(): void {
  if (post.value?.topicId) {
    router.push(`/topics/${post.value.topicId}`)
  } else {
    router.push('/')
  }
}

function handlePostUpdated(updated: PostResponse): void {
  post.value = updated
}

async function handleDeletePost(): Promise<void> {
  if (!post.value) return

  const ok = await confirm({
    title: 'Eliminar publicación',
    message: `¿Estás seguro de que deseas eliminar la publicación "${post.value.title}"? Esta acción borrará también todos los comentarios de forma definitiva.`,
    confirmText: 'Eliminar definitivamente',
    cancelText: 'Cancelar',
    destructive: true,
  })

  if (!ok) return

  try {
    await postsStore.deletePost(post.value.postId, post.value.topicId)
    notify.success('Publicación eliminada correctamente.')
    router.push(post.value.topicId ? `/topics/${post.value.topicId}` : '/')
  } catch {
    notify.error('No se pudo eliminar la publicación.')
  }
}

function handleCommentCreated(comment: CommentResponse): void {
  nextTick(() => {
    const el = document.getElementById(`comment-${comment.commentId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

function handleCommentUpdated(comment: CommentResponse): void {
  // Already updated in store
}

function handleCommentDeleted(commentId: number): void {
  // Already updated in store
}
</script>
