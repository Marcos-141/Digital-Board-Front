<template>
  <v-form ref="registerFormRef" @submit.prevent="handleRegister">
    <!-- Nombre Completo -->
    <v-text-field
      v-model="name"
      label="Nombre completo"
      placeholder="Ej: Juan Pérez"
      prepend-inner-icon="mdi-account-outline"
      variant="outlined"
      density="comfortable"
      :rules="[rules.required]"
      required
      class="mb-2"
    />

    <!-- Grado / Nivel -->
    <v-select
      v-model="grade"
      :items="gradeOptions"
      label="Grado / Nivel"
      placeholder="Selecciona tu grado"
      prepend-inner-icon="mdi-school-outline"
      variant="outlined"
      density="comfortable"
      :rules="[rules.required]"
      required
      class="mb-2"
    />

    <!-- Correo institucional / personal -->
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

    <!-- Contraseña -->
    <v-text-field
      v-model="password"
      :type="showPassword ? 'text' : 'password'"
      label="Contraseña"
      prepend-inner-icon="mdi-lock-outline"
      :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
      @click:append-inner="showPassword = !showPassword"
      variant="outlined"
      density="comfortable"
      :rules="[rules.required, rules.minLength]"
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
      Crear Cuenta
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const grade = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const registerFormRef = ref<any>(null)

const gradeOptions = ['10º Grado A', '10º Grado B', '11º Grado A', '11º Grado B']

const rules = {
  required: (v: string) => !!v || 'Campo obligatorio',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Correo electrónico no válido',
  minLength: (v: string) => (v && v.length >= 6) || 'Mínimo 6 caracteres'
}

const handleRegister = async () => {
  const { valid } = await registerFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const payload = {
      name: name.value,
      grade: grade.value,
      email: email.value,
      password: password.value
    }
    console.log('Registro de estudiante:', payload)
    // Redirigir al tablero o mostrar éxito
  } finally {
    loading.value = false
  }
}
</script>