<template>
  <div class="users-page">
    <PageHeader
      title="Miembros de la Comunidad"
      subtitle="Directorio de estudiantes y administradores que participan en Tablero Digital."
    />

    <!-- Search filter -->
    <div class="mb-6" style="max-width: 440px;">
      <v-text-field
        v-model="searchQuery"
        placeholder="Buscar miembros por nombre..."
        prepend-inner-icon="mdi-magnify"
        clearable
        density="compact"
        variant="outlined"
        rounded="xl"
        hide-details
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-4">
      <v-row>
        <v-col v-for="i in 6" :key="i" cols="12" sm="6" lg="4">
          <v-skeleton-loader
            type="list-item-avatar-two-line"
            class="rounded-xl border-soft"
            elevation="0"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Error State -->
    <div v-else-if="error">
      <ErrorState
        title="No pudimos cargar el directorio de miembros"
        :message="error"
        action-label="Reintentar"
        @action="fetchUsers"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="usersStore.users.length === 0">
      <EmptyState
        icon="mdi-account-group-outline"
        title="No hay miembros registrados"
        message="Aún no se han registrado usuarios en la plataforma."
      />
    </div>

    <!-- Filtered Empty State -->
    <div v-else-if="filteredUsers.length === 0">
      <EmptyState
        icon="mdi-account-search-outline"
        title="No encontramos miembros con ese nombre"
        message="Verifica la ortografía o intenta buscar con otro término."
        action-label="Limpiar búsqueda"
        @action="searchQuery = ''"
      />
    </div>

    <!-- Members Grid -->
    <v-row v-else>
      <v-col
        v-for="user in filteredUsers"
        :key="user.userId"
        cols="12"
        sm="6"
        lg="4"
        class="d-flex"
      >
        <UserCard
          :user="user"
          class="w-100"
          @delete="handleAdminDeleteUser"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from '~/stores/users'
import { useAuthStore } from '~/stores/auth'
import { useConfirm } from '~/composables/useConfirm'
import { useNotify } from '~/composables/useNotify'
import { normalizeText } from '~/utils/strings'
import type { UserResponse } from '~/types/api'

useSeoMeta({
  title: 'Miembros',
  description: 'Conoce y conecta con los miembros de la comunidad educativa en Tablero Digital.',
})

const usersStore = useUsersStore()
const authStore = useAuthStore()
const { confirm } = useConfirm()
const notify = useNotify()

const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')

async function fetchUsers(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    await usersStore.fetchUsers(true)
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Error al conectar con el servidor.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const filteredUsers = computed(() => {
  const q = normalizeText(searchQuery.value)
  if (!q) return usersStore.users
  return usersStore.users.filter((u) => normalizeText(u.nombre).includes(q))
})

async function handleAdminDeleteUser(user: UserResponse): Promise<void> {
  const ok = await confirm({
    title: 'Eliminar usuario (Acción de Administrador)',
    message: `¿Estás seguro de que deseas eliminar la cuenta de "${user.nombre}"? Esta acción borrará permanentemente sus publicaciones y comentarios.`,
    confirmText: 'Eliminar usuario',
    cancelText: 'Cancelar',
    destructive: true,
  })

  if (!ok) return

  try {
    await usersStore.deleteUser(user.userId)
    notify.success('Usuario eliminado del sistema.')
  } catch {
    notify.error('No se pudo eliminar el usuario.')
  }
}
</script>
