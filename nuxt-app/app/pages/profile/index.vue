<template>
  <div class="profile-page">
    <div v-if="!authStore.user" class="py-6">
      <LoadingState title="Cargando perfil..." message="Obteniendo la información de tu cuenta." />
    </div>

    <div v-else>
      <!-- Profile Header -->
      <UserProfileHeader
        :user="authStore.user"
        :show-email="true"
        :can-edit-profile="true"
        @edit="editDialogOpen = true"
      />

      <!-- Real Derived Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6">
          <v-card class="rounded-card border-soft pa-4 bg-surface elevation-0 text-center">
            <v-avatar color="primary" size="44" class="mb-2">
              <v-icon color="on-primary" size="24">mdi-file-document-edit-outline</v-icon>
            </v-avatar>
            <div class="text-h4 font-weight-bold mb-1">
              {{ myPosts.length }}
            </div>
            <div class="text-body-2 text-muted">
              {{ myPosts.length === 1 ? 'Publicación compartida' : 'Publicaciones compartidas' }}
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <v-card class="rounded-card border-soft pa-4 bg-surface elevation-0 text-center">
            <v-avatar color="secondary-darken-1" size="44" class="mb-2">
              <v-icon color="white" size="24">mdi-tag-multiple-outline</v-icon>
            </v-avatar>
            <div class="text-h4 font-weight-bold mb-1">
              {{ distinctTopicsCount }}
            </div>
            <div class="text-body-2 text-muted">
              {{ distinctTopicsCount === 1 ? 'Temática participada' : 'Temáticas participadas' }}
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Profile Tabs -->
      <v-card class="rounded-card border-soft elevation-0 overflow-hidden mb-6" color="surface">
        <v-tabs v-model="tab" color="primary" class="border-b px-4">
          <v-tab value="posts" class="text-none font-weight-bold">
            <v-icon start icon="mdi-bulletin-board" />
            Mis publicaciones ({{ myPosts.length }})
          </v-tab>
          <v-tab value="account" class="text-none font-weight-bold">
            <v-icon start icon="mdi-shield-account-outline" />
            Mi cuenta y seguridad
          </v-tab>
        </v-tabs>

        <v-window v-model="tab" class="pa-4 pa-sm-6">
          <!-- Tab 1: Mis Publicaciones -->
          <v-window-item value="posts">
            <div v-if="loadingPosts" class="py-4">
              <v-row>
                <v-col v-for="i in 3" :key="i" cols="12" sm="6">
                  <v-skeleton-loader type="article" class="rounded-xl border-soft" />
                </v-col>
              </v-row>
            </div>

            <div v-else-if="myPosts.length === 0">
              <EmptyState
                icon="mdi-pencil-outline"
                title="Aún no has publicado nada"
                message="Comparte tus preguntas, anuncios o materiales de estudio en el muro."
                action-label="Crear publicación"
                @action="postDialog.open()"
              />
            </div>

            <v-row v-else>
              <v-col
                v-for="post in myPosts"
                :key="post.postId"
                cols="12"
                sm="6"
                lg="4"
                class="d-flex"
              >
                <PostCard
                  :post="post"
                  class="w-100"
                  @edit="handleEditPost"
                  @delete="handleDeletePost"
                />
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Tab 2: Mi Cuenta y Zona de Peligro -->
          <v-window-item value="account">
            <div class="account-details mb-6">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">
                Datos de la cuenta
              </h3>
              <v-table density="comfortable" class="border-soft rounded-lg">
                <tbody>
                  <tr>
                    <td class="font-weight-medium text-muted" style="width: 200px;">Nombre</td>
                    <td>{{ authStore.user.nombre }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium text-muted">Correo electrónico</td>
                    <td>{{ authStore.user.email }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium text-muted">Rol asignado</td>
                    <td>
                      <v-chip
                        size="small"
                        :color="authStore.user.role === 'ADMIN' ? 'warning' : authStore.user.role === 'TEACHER' ? 'secondary-darken-1' : 'primary'"
                        variant="tonal"
                      >
                        {{ authStore.user.role === 'ADMIN' ? 'Administrador' : authStore.user.role === 'TEACHER' ? 'Profesor' : 'Estudiante' }}
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium text-muted">Fecha de registro</td>
                    <td>{{ authStore.user.createdAt || '—' }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>

            <!-- Danger Zone -->
            <v-card class="rounded-lg border pa-5 bg-red-lighten-5 elevation-0">
              <div class="d-flex align-center mb-2 text-error font-weight-bold">
                <v-icon icon="mdi-alert-octagon-outline" color="error" class="mr-2" />
                Zona de peligro
              </div>
              <p class="text-body-2 text-muted mb-4">
                Al eliminar tu cuenta, se borrarán de forma irreversible todos tus datos personales, así como todas las publicaciones y comentarios que hayas realizado en el tablero.
              </p>

              <v-btn
                color="error"
                variant="flat"
                rounded="xl"
                class="text-none font-weight-bold"
                prepend-icon="mdi-account-remove-outline"
                @click="deleteAccountDialogOpen = true"
              >
                Eliminar mi cuenta
              </v-btn>
            </v-card>
          </v-window-item>
        </v-window>
      </v-card>
    </div>

    <!-- Edit User Dialog -->
    <UserEditDialog
      v-if="authStore.user"
      v-model="editDialogOpen"
      :user="authStore.user"
      @saved="handleUserSaved"
    />

    <!-- Post Edit Dialog -->
    <PostFormDialog
      v-if="editingPost"
      v-model="postEditDialogOpen"
      :post="editingPost"
      @saved="handlePostSaved"
    />

    <!-- Delete Account Confirmation Dialog -->
    <v-dialog v-model="deleteAccountDialogOpen" max-width="480px" persistent>
      <v-card class="rounded-card border-soft pa-6">
        <v-card-title class="pa-0 font-weight-bold text-h6 text-error d-flex align-center mb-2">
          <v-icon icon="mdi-alert-outline" color="error" class="mr-2" />
          ¿Confirmas la eliminación de tu cuenta?
        </v-card-title>
        <p class="text-body-2 text-muted mb-3">
          Esta acción es permanente. Para confirmar, escribe tu correo electrónico (<strong>{{ authStore.user?.email }}</strong>):
        </p>

        <v-text-field
          v-model="confirmEmailInput"
          placeholder="Escribe tu correo para confirmar"
          density="comfortable"
          variant="outlined"
          rounded="xl"
          class="mb-4"
          hide-details
        />

        <div class="d-flex justify-end ga-2">
          <v-btn
            variant="tonal"
            rounded="xl"
            class="text-none px-4"
            :disabled="deletingAccount"
            @click="deleteAccountDialogOpen = false; confirmEmailInput = ''"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            rounded="xl"
            class="text-none font-weight-bold px-4"
            :loading="deletingAccount"
            :disabled="confirmEmailInput.trim().toLowerCase() !== authStore.user?.email.trim().toLowerCase()"
            @click="handleConfirmDeleteAccount"
          >
            Eliminar cuenta definitivamente
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { usePostsStore } from '~/stores/posts'
import { useUsersStore } from '~/stores/users'
import { usePostDialog } from '~/composables/usePostDialog'
import { useNotify } from '~/composables/useNotify'
import { useConfirm } from '~/composables/useConfirm'
import type { PostResponse, UserResponse } from '~/types/api'

definePageMeta({
  middleware: 'auth',
})

useSeoMeta({
  title: 'Mi Perfil',
  description: 'Gestiona tu perfil, publicaciones e información de cuenta en Tablero Digital.',
})

const authStore = useAuthStore()
const postsStore = usePostsStore()
const usersStore = useUsersStore()
const postDialog = usePostDialog()
const notify = useNotify()
const { confirm } = useConfirm()
const router = useRouter()

const tab = ref<'posts' | 'account'>('posts')
const loadingPosts = ref(false)

const editDialogOpen = ref(false)
const editingPost = ref<PostResponse | null>(null)
const postEditDialogOpen = ref(false)

const deleteAccountDialogOpen = ref(false)
const confirmEmailInput = ref('')
const deletingAccount = ref(false)

onMounted(async () => {
  if (postsStore.allPosts.length === 0) {
    loadingPosts.value = true
    try {
      await postsStore.fetchAll()
    } finally {
      loadingPosts.value = false
    }
  }
})

// Real derived statistics
const myPosts = computed(() => {
  if (!authStore.user?.userId) return []
  return postsStore.allPosts.filter((p) => p.userId === authStore.user!.userId)
})

const distinctTopicsCount = computed(() => {
  const topicsSet = new Set<number>()
  for (const p of myPosts.value) {
    if (p.topicId) {
      topicsSet.add(p.topicId)
    }
  }
  return topicsSet.size
})

function handleUserSaved(updated: UserResponse): void {
  authStore.updateCurrentUser(updated)
}

function handleEditPost(post: PostResponse): void {
  editingPost.value = post
  postEditDialogOpen.value = true
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

async function handleConfirmDeleteAccount(): Promise<void> {
  if (!authStore.user?.userId) return

  deletingAccount.value = true
  try {
    await usersStore.deleteUser(authStore.user.userId)
    notify.success('Tu cuenta ha sido eliminada.')
    deleteAccountDialogOpen.value = false
    authStore.logout()
    router.push('/login')
  } catch {
    notify.error('No fue posible eliminar la cuenta. Intenta más tarde.')
  } finally {
    deletingAccount.value = false
  }
}
</script>
