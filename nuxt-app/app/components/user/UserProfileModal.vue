<template>
  <v-dialog
    v-model="dialog"
    max-width="560"
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-xl pa-6 elevation-4 modal-card">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-4">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="44" class="mr-3">
            <v-icon color="#2c3534" size="24">mdi-account-edit-outline</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold text-color3 mb-0">
              Editar Perfil de Estudiante
            </h2>
            <span class="text-caption text-color3-muted">
              Actualiza tus datos académicos y preferencias
            </span>
          </div>
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          density="comfortable"
          color="#59554e"
          @click="dialog = false"
        />
      </div>

      <v-divider class="mb-5" />

      <!-- Form -->
      <v-form ref="formRef" v-model="isValid" @submit.prevent="handleSave">
        <v-row dense>
          <!-- Full Name -->
          <v-col cols="12">
            <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
              Nombre Completo
            </label>
            <v-text-field
              v-model="form.name"
              placeholder="Ej: Sofía Martínez"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="[rules.required]"
              class="mb-3"
            />
          </v-col>

          <!-- Email -->
          <v-col cols="12">
            <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
              Correo Electrónico Educativo
            </label>
            <v-text-field
              v-model="form.email"
              placeholder="estudiante@colegio.edu"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="[rules.required, rules.email]"
              class="mb-3"
            />
          </v-col>

          <!-- Academic Grade -->
          <v-col cols="12" sm="6">
            <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
              Curso / Grado Escolar
            </label>
            <v-select
              v-model="form.grade"
              :items="grades"
              prepend-inner-icon="mdi-school-outline"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="[rules.required]"
              class="mb-3"
            />
          </v-col>

          <!-- Favorite Subject -->
          <v-col cols="12" sm="6">
            <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
              Materia de Interés Principal
            </label>
            <v-select
              v-model="form.favoriteSubject"
              :items="subjects"
              prepend-inner-icon="mdi-book-open-variant"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="[rules.required]"
              class="mb-3"
            />
          </v-col>

          <!-- Bio -->
          <v-col cols="12">
            <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
              Biografía / Presentación Corta
            </label>
            <v-textarea
              v-model="form.bio"
              placeholder="Cuéntanos un poco sobre tus materias favoritas o cómo te gusta colaborar..."
              rows="3"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              class="mb-3"
            />
          </v-col>
        </v-row>

        <div class="d-flex align-center justify-end ga-3 mt-4">
          <v-btn
            variant="text"
            rounded="xl"
            class="text-none font-weight-medium"
            color="#59554e"
            @click="dialog = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            rounded="xl"
            class="text-none font-weight-bold px-6"
            :loading="isSaving"
            :disabled="!isValid"
          >
            Guardar Cambios
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { GRADES_LIST, SUBJECTS_LIST } from '~/composables/useBoard'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const { user, updateProfile } = useAuth()

const isValid = ref(true)
const isSaving = ref(false)

const grades = GRADES_LIST.filter((g) => g !== 'Todos')
const subjects = SUBJECTS_LIST.filter((s) => s !== 'Todas')

const form = reactive({
  name: '',
  email: '',
  grade: '3º ESO',
  favoriteSubject: 'Matemáticas',
  bio: '',
})

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && user.value) {
      form.name = user.value.name
      form.email = user.value.email
      form.grade = user.value.grade
      form.favoriteSubject = user.value.favoriteSubject
      form.bio = user.value.bio
    }
  },
  { immediate: true }
)

const rules = {
  required: (v: string) => !!v || 'Campo obligatorio',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Correo no válido',
}

const handleSave = async () => {
  if (!isValid.value) return
  isSaving.value = true
  await new Promise((r) => setTimeout(r, 600))
  updateProfile({
    name: form.name,
    email: form.email,
    grade: form.grade,
    favoriteSubject: form.favoriteSubject,
    bio: form.bio,
  })
  isSaving.value = false
  dialog.value = false
}
</script>

<style scoped>
.modal-card {
  background-color: #ffffff;
  border: 1px solid #e2e3d9;
}

.text-color3 {
  color: #59554e !important;
}

.text-color3-muted {
  color: rgba(89, 85, 78, 0.75) !important;
}
</style>
