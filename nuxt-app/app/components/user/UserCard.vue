<template>
  <v-card
    class="rounded-card border-soft overflow-hidden card-interactive d-flex flex-column fill-height"
    color="surface"
    elevation="0"
    :to="`/users/${user.userId}`"
  >
    <v-card-text class="pa-5 d-flex flex-column flex-grow-1">
      <div class="d-flex align-start justify-space-between mb-3">
        <UserAvatar
          :name="user.nombre"
          size="52"
        />

        <!-- Admin Delete Action -->
        <div v-if="authStore.isAdmin && authStore.user?.userId !== user.userId" @click.prevent.stop>
          <v-btn
            icon="mdi-delete-outline"
            color="error"
            variant="text"
            size="small"
            aria-label="Eliminar usuario"
            @click="$emit('delete', user)"
          />
        </div>
      </div>

      <div class="mb-2">
        <h3 class="text-subtitle-1 font-weight-bold text-truncate mb-1" :title="user.nombre">
          {{ user.nombre }}
        </h3>
        <v-chip
          size="x-small"
          :color="user.role === 'ADMIN' ? 'warning' : user.role === 'TEACHER' ? 'secondary-darken-1' : 'primary'"
          variant="tonal"
          class="font-weight-bold"
        >
          {{ user.role === 'ADMIN' ? 'Administrador' : user.role === 'TEACHER' ? 'Profesor' : 'Estudiante' }}
        </v-chip>
      </div>

      <!-- Email: ONLY shown to ADMIN (Requirement 9.7) -->
      <div v-if="authStore.isAdmin && user.email" class="text-caption text-muted text-truncate mb-2">
        <v-icon size="14" class="mr-1">mdi-email-outline</v-icon>
        {{ user.email }}
      </div>

      <div class="text-caption text-muted mt-auto pt-3 border-t d-flex align-center justify-space-between">
        <span>Miembro desde {{ formattedJoinDate }}</span>
        <v-icon size="16" color="medium-emphasis">mdi-chevron-right</v-icon>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useFormatDate } from '~/composables/useFormatDate'
import type { UserResponse } from '~/types/api'

const props = defineProps<{
  user: UserResponse
}>()

defineEmits<{
  (e: 'delete', user: UserResponse): void
}>()

const authStore = useAuthStore()
const { formatDate } = useFormatDate()

const formattedJoinDate = computed(() => formatDate(props.user.createdAt))
</script>
