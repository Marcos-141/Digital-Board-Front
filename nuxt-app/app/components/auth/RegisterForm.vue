<template>
  <form class="register-form" @submit.prevent="handleSubmit">
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

    <v-select
      v-model="role"
      class="mb-3"
      label="Tipo de cuenta"
      :items="[{ title: 'Estudiante', value: 'STUDENT' }, { title: 'Profesor', value: 'TEACHER' }]"
      item-title="title"
      item-value="value"
      variant="outlined"
      rounded="xl"
      density="comfortable"
    />

    <v-text-field
      v-if="role === 'TEACHER'"
      v-model="invitationCode"
      class="mb-3"
      label="Código de invitación de profesor"
      type="password"
      autocomplete="off"
      variant="outlined"
      rounded="xl"
      density="comfortable"
      :error-messages="fieldErrors.invitationCode"
      @update:model-value="clearFieldError('invitationCode')"
    />

    <!-- Nombre -->
    <div class="mb-3">
      <label for="reg-nombre" class="text-caption font-weight-bold mb-1 d-block">
        Nombre completo
      </label>
      <v-text-field
        id="reg-nombre"
        v-model="nombre"
        placeholder="Tu nombre y apellido"
        prepend-inner-icon="mdi-account-outline"
        autocomplete="name"
        density="comfortable"
        variant="outlined"
        rounded="xl"
        autofocus
        :rules="[rules.required('El nombre'), rules.maxLength(100, 'El nombre')]"
        :error-messages="fieldErrors.nombre"
        @update:model-value="clearFieldError('nombre')"
      />
    </div>

    <!-- Email -->
    <div class="mb-3">
      <label for="reg-email" class="text-caption font-weight-bold mb-1 d-block">
        Correo electrónico
      </label>
      <v-text-field
        id="reg-email"
        v-model="email"
        type="email"
        placeholder="ejemplo@correo.com"
        prepend-inner-icon="mdi-email-outline"
        autocomplete="email"
        density="comfortable"
        variant="outlined"
        rounded="xl"
        :rules="[rules.required('El correo'), rules.email]"
        :error-messages="fieldErrors.email"
        @update:model-value="clearFieldError('email')"
      />
    </div>

    <!-- Password -->
    <div class="mb-3">
      <label for="reg-password" class="text-caption font-weight-bold mb-1 d-block">
        Contraseña
      </label>
      <v-text-field
        id="reg-password"
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Mínimo 8 caracteres"
        prepend-inner-icon="mdi-lock-outline"
        :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        autocomplete="new-password"
        density="comfortable"
        variant="outlined"
        rounded="xl"
        :rules="[rules.required('La contraseña'), rules.password]"
        :error-messages="fieldErrors.password"
        @click:append-inner="showPassword = !showPassword"
        @update:model-value="clearFieldError('password')"
      />
    </div>

    <!-- Confirm Password -->
    <div class="mb-3">
      <label for="reg-confirm" class="text-caption font-weight-bold mb-1 d-block">
        Confirmar contraseña
      </label>
      <v-text-field
        id="reg-confirm"
        v-model="confirmPassword"
        :type="showConfirm ? 'text' : 'password'"
        placeholder="Repite tu contraseña"
        prepend-inner-icon="mdi-lock-check-outline"
        :append-inner-icon="showConfirm ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        autocomplete="new-password"
        density="comfortable"
        variant="outlined"
        rounded="xl"
        :rules="[
          rules.required('La confirmación'),
          (v) => v === password || 'Las contraseñas no coinciden.',
        ]"
        :error-messages="fieldErrors.confirmPassword"
        @click:append-inner="showConfirm = !showConfirm"
        @update:model-value="clearFieldError('confirmPassword')"
      />
    </div>

    <!-- Terms Checkbox -->
    <v-checkbox
      v-model="acceptTerms"
      density="compact"
      color="primary"
      hide-details
      class="mb-4"
    >
      <template #label>
        <span class="text-caption">
          Acepto las normas de convivencia y participación colaborativa del tablero.
        </span>
      </template>
    </v-checkbox>

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
      Crear mi cuenta
    </v-btn>
  </form>
</template>

<script setup lang="ts">
import { rules } from '~/utils/validators'
import { useAuthStore } from '~/stores/auth'
import { useNotify } from '~/composables/useNotify'
import { isApiError } from '~/api/errors'
import type { TeacherRegistrationRequest, UserRequest } from '~/types/api'

const emit = defineEmits<{
  (e: 'success'): void
}>()

const authStore = useAuthStore()
const notify = useNotify()

const nombre = ref('')
const role = ref<'STUDENT' | 'TEACHER'>('STUDENT')
const invitationCode = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)

const fieldErrors = ref<Record<string, string>>({})
const generalError = ref<string | null>(null)

const isFormValid = computed(() => {
  return (
    nombre.value.trim().length > 0 &&
    email.value.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) &&
    password.value.length >= 8 &&
    confirmPassword.value === password.value &&
    (role.value === 'STUDENT' || invitationCode.value.trim().length > 0) &&
    acceptTerms.value
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

  if (!nombre.value.trim()) {
    fieldErrors.value.nombre = 'El nombre es obligatorio.'
    return
  }
  if (!email.value.trim()) {
    fieldErrors.value.email = 'El correo electrónico es obligatorio.'
    return
  }
  if (password.value.length < 8) {
    fieldErrors.value.password = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }
  if (confirmPassword.value !== password.value) {
    fieldErrors.value.confirmPassword = 'Las contraseñas no coinciden.'
    return
  }
  if (!acceptTerms.value) {
    generalError.value = 'Debes aceptar las normas de participación para registrarte.'
    return
  }
  if (role.value === 'TEACHER' && !invitationCode.value.trim()) {
    fieldErrors.value.invitationCode = 'El código de invitación es obligatorio.'
    return
  }

  loading.value = true
  try {
    const userRequest: UserRequest = {
      nombre: nombre.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value,
    }
    if (role.value === 'TEACHER') {
      const teacherRequest: TeacherRegistrationRequest = {
        ...userRequest,
        invitationCode: invitationCode.value,
      }
      await authStore.registerTeacher(teacherRequest)
    } else {
      await authStore.register(userRequest)
    }
    notify.success('¡Cuenta creada exitosamente! Bienvenido(a).')
    emit('success')
  } catch (error: unknown) {
    if (isApiError(error)) {
      if (error.status === 409 || error.kind === 'conflict') {
        fieldErrors.value.email = 'Este correo ya está registrado.'
      } else if (error.kind === 'validation') {
        fieldErrors.value = { ...error.fieldErrors }
      } else {
        generalError.value = error.message
      }
    } else {
      generalError.value = 'No se pudo crear la cuenta. Intenta nuevamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-form :deep(.v-field__input),
.register-form :deep(.v-field__input input),
.register-form :deep(.v-label),
.register-form :deep(.v-checkbox .v-label) {
  color: #45423b !important;
  opacity: 1;
}

.register-form :deep(input::placeholder) {
  color: #625f56 !important;
  opacity: 1;
}

.register-form :deep(.v-btn--disabled) {
  background-color: #d4e0de !important;
  color: #303b39 !important;
  opacity: 1;
}
</style>
