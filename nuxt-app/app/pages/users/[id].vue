<template>
  <div class="user-detail-page">
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
      <v-skeleton-loader type="list-item-avatar-three-line" class="rounded-xl border-soft mb-6" />
      <v-row>
        <v-col v-for="i in 3" :key="i" cols="12" sm="6" lg="4">
          <v-skeleton-loader type="article" class="rounded-xl border-soft" />
        </v-col>
      </v-row>
    </div>

    <!-- Error State (404) -->
    <div v-else-if="error || !user">
      <ErrorState
        title="Miembro no encontrado"
        :message="error || 'El usuario que buscas no existe o fue dado de baja.'"
        action-label="Volver al directorio"
        @action="router.push('/users')"
      />
    </div>

    <!-- User Profile & Posts -->
    <div v-else>
      <UserProfileHeader
        :user="user"
        :show-email="authStore.isAdmin"
        :can-edit-profile="false"
      />

      <div class="d-flex align-center justify-space-between mb-4">
        <h2 class="text-h6 font-weight-bold">
          Publicaciones de {{ user.nombre }} ({{ userPosts.length }})
        </h2>
      </div>

      <!-- Empty state if member hasn't posted -->
      <div v-if="userPosts.length === 0" class="py-4">
        <EmptyState
          icon="mdi-pencil-outline"
          title="Sin publicaciones por ahora"
          message="Este miembro aún no ha compartido anuncios o dudas en el tablero."
        />
      </div>

      <!-- Member's Posts Grid -->
      <BoardGrid
        v-else
        :posts="userPosts"
        :view-mode="boardStore.viewMode"
        @edit="handleEditPost"
        @delete="handleDeletePost"
      />
    </div>

    <!-- Post Edit Dialog (if authorized) -->
    <PostFormDialog
      v-if="editingPost"
      v-model="editDialogOpen"
      :post="editingPost"
      @saved="handlePostSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { usersApi } from '~/api/users.api'
import { usePostsStore } from '~/stores/posts'
import { useAuthStore } from '~/stores/auth'
import { useBoardStore } from '~/stores/board'
import { useConfirm } from '~/composables/useConfirm'
import { useNotify } from '~/composables/useNotify'
import type { UserResponse, PostResponse } from '~/types/api'

const route = useRoute()
const router = useRouter()
const postsStore = usePostsStore()
const authStore = useAuthStore()
const boardStore = useBoardStore()
const { confirm } = useConfirm()
const notify = useNotify()

const userId = Number(route.params.id)

const user = ref<UserResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const editingPost = ref<PostResponse | null>(null)
const editDialogOpen = ref(false)

const breadcrumbs = computed(() => [
  { title: 'Inicio', href: '/' },
  { title: 'Miembros', href: '/users' },
  { title: user.value?.nombre || 'Perfil de miembro', disabled: true },
])

async function loadUserData(): Promise<void> {
  if (isNaN(userId)) {
    error.value = 'Identificador de usuario inválido.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const [fetchedUser] = await Promise.all([
      usersApi.get(userId),
      postsStore.fetchAll(),
    ])
    user.value = fetchedUser

    useSeoMeta({
      title: `Perfil de ${fetchedUser.nombre}`,
      description: `Publicaciones y actividad de ${fetchedUser.nombre} en Tablero Digital.`,
    })
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'No se pudo cargar la información del usuario.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUserData()
})

const userPosts = computed(() => {
  return postsStore.allPosts.filter((p) => p.userId === userId)
})

function handleEditPost(post: PostResponse): void {
  editingPost.value = post
  editDialogOpen.value = true
}

function handlePostSaved(): void {
  editingPost.value = null
  postsStore.fetchAll(true)
}

async function handleDeletePost(post: PostResponse): Promise<void> {
  const ok = await confirm({
    title: 'Eliminar publicación',
    message: `¿Estás seguro de que deseas eliminar "${post.title}"?`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    destructive: true,
  })

  if (!ok) return

  try {
    await postsStore.deletePost(post.postId, post.topicId)
    notify.success('Publicación eliminada correctamente.')
  } catch {
    notify.error('No se pudo eliminar la publicación.')
  }
}
</script>
