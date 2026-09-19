<template>
  <v-card class="auth-card rounded-xl pa-6 pa-md-8 elevation-3">
    <!-- Header -->
    <div class="text-center mb-6">
      <v-avatar color="primary" size="56" class="elevation-2 mb-3">
        <v-icon color="#2c3534" size="32">mdi-account-lock-outline</v-icon>
      </v-avatar>
      <h2 class="text-h5 font-weight-bold text-color3 mb-1">
        ¡Bienvenido de Nuevo!
      </h2>
      <p class="text-body-2 text-color3-muted">
        Ingresa a tu cuenta de Tablero Digital para continuar aprendiendo y colaborando.
      </p>
    </div>

    <!-- Error Alert -->
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      density="compact"
      rounded="lg"
      class="mb-4"
      closable
    >
      {{ error }}
    </v-alert>

    <!-- Form -->
    <v-form ref="formRef" v-model="isValid" @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
          Correo Electrónico
        </label>
        <v-text-field
          v-model="email"
          placeholder="sofia.martinez@estudiante.edu"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          :rules="[rules.required, rules.email]"
          hide-details="auto"
        />
      </div>

      <div class="mb-5">
        <div class="d-flex justify-space-between align-center mb-1">
          <label class="text-caption font-weight-bold text-color3">
            Contraseña
          </label>
          <a href="#" @click.prevent class="text-caption text-primary-darken font-weight-medium">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <v-text-field
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          :rules="[rules.required, rules.minLength]"
          hide-details="auto"
          @click:append-inner="showPassword = !showPassword"
        />
      </div>

      <v-checkbox
        v-model="rememberMe"
        label="Recordar mis datos en este dispositivo"
        density="compact"
        color="primary"
        hide-details
        class="mb-5 text-body-2"
      />

      <v-btn
        type="submit"
        block
        color="primary"
        size="large"
        rounded="xl"
        class="font-weight-bold text-none elevation-1 mb-4 btn-primary-custom"
        :loading="loading"
        :disabled="!isValid"
      >
        Iniciar Sesión
      </v-btn>

      <!-- Quick Demo Login Preset -->
      <v-btn
        block
        variant="tonal"
        color="secondary-darken-1"
        size="comfortable"
        rounded="xl"
        class="text-none font-weight-medium"
        prepend-icon="mdi-account-star-outline"
        @click="fillDemoCredentials"
      >
        Probar como Estudiante Demo
      </v-btn>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
const { login, loading, error } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(true)
const showPassword = ref(false)
const isValid = ref(true)

const rules = {
  required: (v: string) => !!v || 'Este campo es obligatorio',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Ingresa un correo electrónico válido',
  minLength: (v: string) => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres',
}

const fillDemoCredentials = () => {
  email.value = 'sofia.martinez@estudiante.edu'
  password.value = '123456'
}

const handleSubmit = async () => {
  if (!isValid.value) return
  const success = await login(email.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>

<style scoped>
.auth-card {
  background-color: #ffffff;
  border: 1px solid #e2e3d9;
}

.text-color3 {
  color: #59554e !important;
}

.text-color3-muted {
  color: rgba(89, 85, 78, 0.75) !important;
}

.text-primary-darken {
  color: #7bb0a6 !important;
  text-decoration: none;
}

.text-primary-darken:hover {
  text-decoration: underline;
}

.btn-primary-custom {
  background-color: #a1c1be !important;
  color: #2c3534 !important;
}
</style>
