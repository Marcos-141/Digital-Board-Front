<template>
  <v-form ref="loginFormRef" @submit.prevent="handleLogin">
    <v-text-field
      v-model="email"
      label="Correo electrónico"
      placeholder="estudiante@correo.com"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      density="comfortable"
      :rules="[rules.required, rules.email]"
      required
      class="mb-2"
    />

    <v-text-field
      v-model="password"
      :type="showPassword ? 'text' : 'password'"
      label="Contraseña"
      prepend-inner-icon="mdi-lock-outline"
      :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
      @click:append-inner="showPassword = !showPassword"
      variant="outlined"
      density="comfortable"
      :rules="[rules.required]"
      required
      class="mb-4"
    />

    <v-btn
      type="submit"
      color="primary"
      size="large"
      block
      :loading="loading"
      rounded="lg"
      elevation="2"
    >
      Iniciar Sesión
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const loginFormRef = ref<any>(null)

const rules = {
  required: (v: string) => !!v || 'Campo obligatorio',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Correo electrónico no válido'
}

const handleLogin = async () => {
  const { valid } = await loginFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    console.log('Inicio de sesión:', { email: email.value, password: password.value })
    // Conectar con la autenticación y redirigir al index (Tablero)
    navigateTo('/')
  } finally {
    loading.value = false
  }
}
</script>