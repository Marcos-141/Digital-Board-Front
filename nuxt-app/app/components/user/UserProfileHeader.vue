<template>
  <v-card class="rounded-card border-soft pa-6 mb-6" color="surface" elevation="0">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4">
      <div class="d-flex align-center">
        <UserAvatar
          :name="user.nombre"
          size="72"
          class="mr-4"
        />
        <div>
          <div class="d-flex align-center flex-wrap ga-2 mb-1">
            <h1 class="text-h5 font-weight-bold mb-0">
              {{ user.nombre }}
            </h1>
            <v-chip
              size="small"
              :color="roleColor"
              variant="tonal"
              class="font-weight-bold"
            >
              <v-icon start size="14">
                {{ roleIcon }}
              </v-icon>
              {{ roleLabel }}
            </v-chip>
          </div>

          <div v-if="showEmail && user.email" class="text-body-2 text-muted mb-1">
            <v-icon size="16" class="mr-1">mdi-email-outline</v-icon>
            {{ user.email }}
          </div>

          <div class="text-caption text-muted">
            <v-icon size="14" class="mr-1">mdi-calendar-check-outline</v-icon>
            Miembro desde {{ formattedJoinDate }}
          </div>
        </div>
      </div>

      <div v-if="canEditProfile" class="d-flex align-center ga-2">
        <v-btn
          color="primary"
          variant="tonal"
          rounded="xl"
          class="text-none font-weight-bold"
          prepend-icon="mdi-account-edit-outline"
          @click="$emit('edit')"
        >
          Editar perfil
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useFormatDate } from '~/composables/useFormatDate'
import type { UserResponse } from '~/types/api'

const props = withDefaults(
  defineProps<{
    user: UserResponse
    showEmail?: boolean
    canEditProfile?: boolean
  }>(),
  {
    showEmail: true,
    canEditProfile: false,
  }
)

defineEmits<{
  (e: 'edit'): void
}>()

const { formatDate } = useFormatDate()

const roleLabel = computed(() => {
  if (props.user.role === 'ADMIN') return 'Administrador'
  if (props.user.role === 'TEACHER') return 'Profesor'
  return 'Estudiante'
})
const roleIcon = computed(() => {
  if (props.user.role === 'ADMIN') return 'mdi-shield-crown-outline'
  if (props.user.role === 'TEACHER') return 'mdi-school-outline'
  return 'mdi-account-outline'
})
const roleColor = computed(() => props.user.role === 'ADMIN' ? 'warning' : props.user.role === 'TEACHER' ? 'secondary-darken-1' : 'primary')

const formattedJoinDate = computed(() => formatDate(props.user.createdAt))
</script>
