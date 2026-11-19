<template>
  <form @submit.prevent="handleSubmit">
    <!-- General error banner -->
    <v-alert
      v-if="generalError"
      density="compact"
      type="error"
      variant="tonal"
      rounded="xl"
      class="mb-4 text-caption"
      icon="mdi-alert-circle-outline"
    >
      {{ generalError }}
    </v-alert>

    <div class="mb-3">
      <label for="login-email" class="text-caption font-weight-bold mb-1 d-block">
        Correo electrónico
      </label>
      <v-text-field
        id="login-email"
        v-model="email"
        type="email"
        placeholder="ejemplo@correo.com"
        prepend-inner-icon="mdi-email-outline"
        autocomplete="email"
        density="comfortable"
        variant="outlined"
        rounded="xl"
        autofocus
        :rules="[rules.required('El correo'), rules.email]"
        :error-messages="fieldErrors.email"
        @update:model-value="clearFieldError('email')"
      />
    </div>

    <div class="mb-4">
      <label for="login-password" class="text-caption font-weight-bold mb-1 d-block">
        Contraseña
      </label>
      <v-text-field
        id="login-password"
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Mínimo 8 caracteres"
        prepend-inner-icon="mdi-lock-outline"
        :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        autocomplete="current-password"
        density="comfortable"
        variant="outlined"
        rounded="xl"
        :rules="[rules.required('La contraseña'), rules.password]"
        :error-messages="fieldErrors.password"
        @click:append-inner="showPassword = !showPassword"
        @update:model-value="clearFieldError('password')"
      />
    </div>

    <v-btn
      type="submit"
      color="primary"
      variant="flat"
      block
      size="large"
      rounded="xl"
      class="text-none font-weight-bold mb-3"
      :loading="loading"
      :disabled="loading || !isFormValid"
    >
      Ingresar a mi cuenta
    </v-btn>
  </form>
</template>

<script setup lang="ts">
import { rules } from '~/utils/validators'
import { useAuthStore } from '~/stores/auth'
import { useNotify } from '~/composables/useNotify'
import { isApiError } from '~/api/errors'

const emit = defineEmits<{
  (e: 'success'): void
}>()

const authStore = useAuthStore()
const notify = useNotify()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const fieldErrors = ref<Record<string, string>>({})
const generalError = ref<string | null>(null)

const isFormValid = computed(() => {
  return (
    email.value.trim().length > 0 &&
    password.value.length >= 8 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
  )
})

function clearFieldError(field: string): void {
  if (fieldErrors.value[field]) {
    delete fieldErrors.value[field]
  }
  generalError.value = null
}

async function handleSubmit(): Promise<void> {
  fieldErrors.value = {}
  generalError.value = null

  if (!email.value.trim()) {
    fieldErrors.value.email = 'El correo electrónico es obligatorio.'
    return
  }
  if (password.value.length < 8) {
    fieldErrors.value.password = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }

  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    notify.success('¡Bienvenido(a) a Tablero Digital!')
    emit('success')
  } catch (error: unknown) {
    if (isApiError(error)) {
      if (error.status === 404) {
        fieldErrors.value.email = 'No encontramos una cuenta con ese correo.'
      } else {
        generalError.value = error.message
      }
    } else {
      generalError.value = 'No fue posible iniciar sesión. Verifica tu conexión.'
    }
  } finally {
    loading.value = false
  }
}
</script>
