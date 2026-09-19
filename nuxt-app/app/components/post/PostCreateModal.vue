<template>
  <v-dialog
    v-model="isCreateModalOpen"
    max-width="680"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="modal-card rounded-xl pa-6 elevation-4">
      <!-- Modal Header -->
      <div class="d-flex align-center justify-space-between mb-4">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="44" class="mr-3">
            <v-icon color="#2c3534" size="24">mdi-plus-box-outline</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold text-color3 mb-0">
              Publicar Nueva Duda Educativa
            </h2>
            <span class="text-caption text-color3-muted">
              Formula tu pregunta de forma clara para recibir ayuda rápida
            </span>
          </div>
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          density="comfortable"
          color="#59554e"
          @click="closeCreateModal"
        />
      </div>

      <v-divider class="mb-5" />

      <!-- Form -->
      <v-form ref="formRef" v-model="isValid" @submit.prevent="handleSubmit">
        <v-row dense>
          <!-- Title -->
          <v-col cols="12">
            <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
              Título de la Pregunta / Duda
            </label>
            <v-text-field
              v-model="form.title"
              placeholder="Ej: ¿Cómo se calcula la masa molar en química orgánica?"
              prepend-inner-icon="mdi-format-title"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="[rules.required, rules.minTitle]"
              class="mb-3"
            />
          </v-col>

          <!-- Subject -->
          <v-col cols="12" sm="6">
            <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
              Materia Académica
            </label>
            <v-select
              v-model="form.subject"
              :items="subjects"
              prepend-inner-icon="mdi-book-open-outline"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="[rules.required]"
              class="mb-3"
            />
          </v-col>

          <!-- Grade -->
          <v-col cols="12" sm="6">
            <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
              Curso / Grado
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

          <!-- Content Description -->
          <v-col cols="12">
            <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
              Descripción Detallada de la Duda
            </label>
            <v-textarea
              v-model="form.content"
              placeholder="Escribe el enunciado completo del problema o explica exactamente en qué paso te has atascado..."
              rows="4"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="[rules.required, rules.minContent]"
              class="mb-3"
            />
          </v-col>

          <!-- Tags input -->
          <v-col cols="12">
            <label class="text-caption font-weight-bold text-color3 mb-1 d-block">
              Etiquetas / Palabras Clave (Separadas por comas)
            </label>
            <v-text-field
              v-model="tagsInput"
              placeholder="Ej: Álgebra, Ecuaciones, Examen"
              prepend-inner-icon="mdi-tag-outline"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              class="mb-3"
            />
          </v-col>
        </v-row>

        <div class="d-flex align-center justify-space-between mt-4">
          <span class="text-caption text-color3-muted d-none d-sm-inline">
            🎉 Ganarás <strong style="color: #7bb0a6">+10 puntos</strong> al publicar tu duda.
          </span>

          <div class="d-flex align-center ga-3 ml-auto">
            <v-btn
              variant="text"
              rounded="xl"
              class="text-none font-weight-medium"
              color="#59554e"
              @click="closeCreateModal"
            >
              Cancelar
            </v-btn>

            <v-btn
              type="submit"
              color="primary"
              variant="flat"
              rounded="xl"
              class="text-none font-weight-bold px-6 btn-submit"
              :loading="isSubmitting"
              :disabled="!isValid"
            >
              Publicar Pregunta
            </v-btn>
          </div>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { GRADES_LIST, SUBJECTS_LIST } from '~/composables/useBoard'

const { isCreateModalOpen, closeCreateModal, createPost } = usePost()
const { user } = useAuth()

const isValid = ref(true)
const isSubmitting = ref(false)
const tagsInput = ref('')

const subjects = SUBJECTS_LIST.filter((s) => s !== 'Todas')
const grades = GRADES_LIST.filter((g) => g !== 'Todos')

const form = reactive({
  title: '',
  content: '',
  subject: 'Matemáticas',
  grade: user.value?.grade || '3º ESO',
})

const rules = {
  required: (v: string) => !!v || 'Este campo es obligatorio',
  minTitle: (v: string) => (v && v.length >= 10) || 'El título debe tener al menos 10 caracteres',
  minContent: (v: string) => (v && v.length >= 20) || 'La descripción debe tener al menos 20 caracteres',
}

const handleSubmit = async () => {
  if (!isValid.value) return
  isSubmitting.value = true
  await new Promise((r) => setTimeout(r, 600))

  const parsedTags = tagsInput.value
    ? tagsInput.value
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter((t) => t.length > 0)
    : [form.subject]

  createPost({
    title: form.title,
    content: form.content,
    subject: form.subject,
    grade: form.grade,
    tags: parsedTags,
  })

  // Reset form
  form.title = ''
  form.content = ''
  tagsInput.value = ''
  isSubmitting.value = false
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

.btn-submit {
  background-color: #a1c1be !important;
  color: #2c3534 !important;
}
</style>
