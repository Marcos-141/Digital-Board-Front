<template>
  <v-card class="auth-card rounded-xl pa-6 pa-md-8 elevation-3">
    <!-- Header -->
    <div class="text-center mb-6">
      <v-avatar color="primary" size="56" class="elevation-2 mb-3">
        <v-icon color="#2c3534" size="32">mdi-account-plus-outline</v-icon>
      </v-avatar>
      <h2 class="text-h5 font-weight-bold text-color3 mb-1">
        Únete a Tablero Digital
      </h2>
      <p class="text-body-2 text-color3-muted">
        Crea tu cuenta de estudiante y empieza a hacer preguntas y ayudar a tus compañeros.
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
          Nombre y Apellidos
        </label>
        <v-text-field
          v-model="name"
          placeholder="Ej: Mateo Fernández"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          :rules="[rules.required]"
          hide-details="auto"
        />
      </div>

      <div class="mb-4">
        <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
          Correo Electrónico Educativo
        </label>
        <v-text-field
          v-model="email"
          placeholder="mateo.fernandez@estudiante.edu"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          :rules="[rules.required, rules.email]"
          hide-details="auto"
        />
      </div>

      <v-row dense class="mb-2">
        <v-col cols="12" sm="6">
          <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
            Curso Escolar
          </label>
          <v-select
            v-model="grade"
            :items="grades"
            prepend-inner-icon="mdi-school-outline"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            :rules="[rules.required]"
            hide-details="auto"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
            Materia Favorita
          </label>
          <v-select
            v-model="favoriteSubject"
            :items="subjects"
            prepend-inner-icon="mdi-book-open-outline"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            :rules="[rules.required]"
            hide-details="auto"
          />
        </v-col>
      </v-row>

      <div class="mb-4">
        <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
          Contraseña
        </label>
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
        v-model="agreeTerms"
        density="compact"
        color="primary"
        :rules="[rules.mustAgree]"
        hide-details="auto"
        class="mb-5 text-body-2"
      >
        <template #label>
          <span class="text-caption text-color3">
            Acepto las <a href="#" @click.prevent class="text-primary-darken">normas de convivencia educativa</a> y política de privacidad.
          </span>
        </template>
      </v-checkbox>

      <v-btn
        type="submit"
        block
        color="primary"
        size="large"
        rounded="xl"
        class="font-weight-bold text-none elevation-1 btn-primary-custom"
        :loading="loading"
        :disabled="!isValid"
      >
        Crear Cuenta de Estudiante
      </v-btn>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { GRADES_LIST, SUBJECTS_LIST } from '~/composables/useBoard'

const { register, loading, error } = useAuth()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const grade = ref('3º ESO')
const favoriteSubject = ref('Matemáticas')
const agreeTerms = ref(false)
const showPassword = ref(false)
const isValid = ref(true)

const grades = GRADES_LIST.filter((g) => g !== 'Todos')
const subjects = SUBJECTS_LIST.filter((s) => s !== 'Todas')

const rules = {
  required: (v: string) => !!v || 'Campo obligatorio',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Correo no válido',
  minLength: (v: string) => (v && v.length >= 6) || 'Mínimo 6 caracteres',
  mustAgree: (v: boolean) => !!v || 'Debes aceptar las normas de convivencia',
}

const handleSubmit = async () => {
  if (!isValid.value) return
  const success = await register({
    name: name.value,
    email: email.value,
    grade: grade.value,
    favoriteSubject: favoriteSubject.value,
  })
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

.btn-primary-custom {
  background-color: #a1c1be !important;
  color: #2c3534 !important;
}
</style>
