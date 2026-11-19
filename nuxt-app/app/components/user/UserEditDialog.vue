<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520px"
    persistent
    @update:model-value="$emit('update:modelValue', false)"
  >
    <v-card class="rounded-card border-soft pa-4 pa-sm-6">
      <div class="d-flex align-center justify-space-between mb-4">
        <v-card-title class="pa-0 font-weight-bold text-h6">
          <v-icon icon="mdi-account-edit-outline" color="primary" class="mr-2" />
          Editar perfil
        </v-card-title>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          aria-label="Cerrar modal"
          @click="$emit('update:modelValue', false)"
        />
      </div>

      <v-alert
        v-if="generalError"
        density="compact"
        type="error"
        variant="tonal"
        rounded="xl"
        class="mb-4 text-caption"
      >
        {{ generalError }}
      </v-alert>

      <form @submit.prevent="handleSubmit">
        <!-- Nombre -->
        <div class="mb-3">
          <label for="edit-nombre" class="text-caption font-weight-bold mb-1 d-block">
            Nombre completo *
          </label>
          <v-text-field
            id="edit-nombre"
            v-model="nombre"
            placeholder="Tu nombre y apellido"
            density="comfortable"
            variant="outlined"
            rounded="xl"
            :rules="[rules.required('El nombre'), rules.maxLength(100, 'El nombre')]"
            :error-messages="fieldErrors.nombre"
            @update:model-value="clearErrors"
          />
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label for="edit-email" class="text-caption font-weight-bold mb-1 d-block">
            Correo electrónico *
          </label>
          <v-text-field
            id="edit-email"
            v-model="email"
            type="email"
            placeholder="ejemplo@correo.com"
            density="comfortable"
            variant="outlined"
            rounded="xl"
            :rules="[rules.required('El correo'), rules.email]"
            :error-messages="fieldErrors.email"
            @update:model-value="clearErrors"
          />
        </div>

        <!-- Password (Required by backend PUT /users/{id}) -->
        <div class="mb-4">
          <div class="d-flex align-center justify-space-between mb-1">
            <label for="edit-password" class="text-caption font-weight-bold">
              Contraseña de confirmación *
            </label>
          </div>
          <v-text-field
            id="edit-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Ingresa al menos 8 caracteres"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            density="comfortable"
            variant="outlined"
            rounded="xl"
            :rules="[rules.required('La contraseña'), rules.password]"
            :error-messages="fieldErrors.password"
            @click:append-inner="showPassword = !showPassword"
            @update:model-value="clearErrors"
          />
          <div class="text-caption text-muted mt-1">
            El servidor requiere ingresar tu contraseña actual o una nueva (mínimo 8 caracteres) para guardar los cambios.
          </div>
        </div>

        <div class="d-flex justify-end ga-2 pt-2 border-t">
          <v-btn
            variant="tonal"
            rounded="xl"
            class="text-none px-4"
            :disabled="loading"
            @click="$emit('update:modelValue', false)"
          >
            Cancelar
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            rounded="xl"
            class="text-none font-weight-bold px-6"
            :loading="loading"
            :disabled="loading || !isFormValid"
          >
            Guardar cambios
          </v-btn>
        </div>
      </form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { rules } from '~/utils/validators'
import { useAuthStore } from '~/stores/auth'
import { useUsersStore } from '~/stores/users'
import { useNotify } from '~/composables/useNotify'
import { isApiError } from '~/api/errors'
import type { UserResponse } from '~/types/api'

const props = defineProps<{
  modelValue: boolean
  user: UserResponse
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved', user: UserResponse): void
}>()

const authStore = useAuthStore()
const usersStore = useUsersStore()
const notify = useNotify()

const nombre = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const fieldErrors = ref<Record<string, string>>({})
const generalError = ref<string | null>(null)

watch(
  () => props.modelValue,
  (val) => {
    if (val && props.user) {
      nombre.value = props.user.nombre || ''
      email.value = props.user.email || ''
      password.value = ''
      fieldErrors.value = {}
      generalError.value = null
    }
  },
  { immediate: true }
)

const isFormValid = computed(() => {
  return (
    nombre.value.trim().length > 0 &&
    email.value.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) &&
    password.value.length >= 8
  )
})

function clearErrors(): void {
  fieldErrors.value = {}
  generalError.value = null
}

async function handleSubmit(): Promise<void> {
  if (!isFormValid.value) return

  loading.value = true
  clearErrors()

  try {
    const updated = await usersStore.updateUser(props.user.userId, {
      nombre: nombre.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value,
    })

    if (authStore.user?.userId === props.user.userId) {
      authStore.updateCurrentUser(updated)
    }

    notify.success('Perfil actualizado correctamente.')
    emit('saved', updated)
    emit('update:modelValue', false)
  } catch (error: unknown) {
    if (isApiError(error)) {
      if (error.status === 409 || error.kind === 'conflict') {
        fieldErrors.value.email = 'Este correo ya está registrado por otro usuario.'
      } else if (error.kind === 'validation') {
        fieldErrors.value = { ...error.fieldErrors }
      } else {
        generalError.value = error.message
      }
    } else {
      generalError.value = 'No se pudo actualizar el perfil. Intenta más tarde.'
    }
  } finally {
    loading.value = false
  }
}
</script>
