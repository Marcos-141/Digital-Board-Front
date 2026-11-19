<template>
  <v-dialog
    :model-value="modelValue"
    max-width="540px"
    persistent
    @update:model-value="handleCloseRequest"
  >
    <v-card class="rounded-card border-soft pa-4 pa-sm-6">
      <div class="d-flex align-center justify-space-between mb-4">
        <v-card-title class="pa-0 font-weight-bold text-h6">
          <v-icon :icon="isEdit ? 'mdi-pencil-outline' : 'mdi-tag-plus-outline'" color="primary" class="mr-2" />
          {{ isEdit ? 'Editar temática' : 'Nueva temática' }}
        </v-card-title>
        <v-btn icon="mdi-close" variant="text" size="small" aria-label="Cerrar modal" @click="handleCloseRequest" />
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
        <!-- Topic Name -->
        <div class="mb-3">
          <label for="topic-name" class="text-caption font-weight-bold mb-1 d-block">
            Nombre de la temática *
          </label>
          <v-text-field
            id="topic-name"
            v-model="name"
            placeholder="Ej. Anuncios Generales, Dudas de Clase..."
            density="comfortable"
            variant="outlined"
            rounded="xl"
            counter="100"
            maxlength="100"
            autofocus
            :rules="[rules.required('El nombre de la temática'), rules.maxLength(100, 'El nombre')]"
            :error-messages="fieldErrors.topicName || fieldErrors.name"
            @update:model-value="clearErrors"
          />
        </div>

        <!-- Topic Description -->
        <div class="mb-4">
          <label for="topic-desc" class="text-caption font-weight-bold mb-1 d-block">
            Descripción de la temática *
          </label>
          <v-textarea
            id="topic-desc"
            v-model="description"
            placeholder="Describe brevemente el propósito de esta categoría para la comunidad..."
            density="comfortable"
            variant="outlined"
            rounded="xl"
            rows="3"
            counter="255"
            maxlength="255"
            :rules="[rules.required('La descripción'), rules.maxLength(255, 'La descripción')]"
            :error-messages="fieldErrors.topicDescription || fieldErrors.description"
            @update:model-value="clearErrors"
          />
        </div>

        <div class="d-flex justify-end ga-2 pt-2">
          <v-btn
            variant="tonal"
            rounded="xl"
            class="text-none px-4"
            :disabled="loading"
            @click="handleCloseRequest"
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
            {{ isEdit ? 'Guardar cambios' : 'Crear temática' }}
          </v-btn>
        </div>
      </form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { rules } from '~/utils/validators'
import { useTopicsStore } from '~/stores/topics'
import { useNotify } from '~/composables/useNotify'
import { useConfirm } from '~/composables/useConfirm'
import { isApiError } from '~/api/errors'
import type { Topic } from '~/types/domain'

const props = defineProps<{
  modelValue: boolean
  topic?: Topic | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved', topic: Topic): void
}>()

const topicsStore = useTopicsStore()
const notify = useNotify()
const { confirm } = useConfirm()

const name = ref('')
const description = ref('')
const loading = ref(false)
const fieldErrors = ref<Record<string, string>>({})
const generalError = ref<string | null>(null)

const isEdit = computed(() => !!props.topic?.id)

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      name.value = props.topic?.name || ''
      description.value = props.topic?.description || ''
      fieldErrors.value = {}
      generalError.value = null
    }
  },
  { immediate: true }
)

const isDirty = computed(() => {
  const origName = props.topic?.name || ''
  const origDesc = props.topic?.description || ''
  return name.value !== origName || description.value !== origDesc
})

const isFormValid = computed(() => {
  return (
    name.value.trim().length > 0 &&
    name.value.trim().length <= 100 &&
    description.value.trim().length > 0 &&
    description.value.trim().length <= 255
  )
})

function clearErrors(): void {
  fieldErrors.value = {}
  generalError.value = null
}

async function handleCloseRequest(): Promise<void> {
  if (isDirty.value && (name.value.trim() || description.value.trim())) {
    const ok = await confirm({
      title: 'Descartar cambios',
      message: 'Tienes información sin guardar. ¿Deseas cerrar el formulario?',
      confirmText: 'Descartar',
      cancelText: 'Continuar editando',
      destructive: true,
    })
    if (!ok) return
  }
  emit('update:modelValue', false)
}

async function handleSubmit(): Promise<void> {
  if (!isFormValid.value) return
  loading.value = true
  clearErrors()

  try {
    let result: Topic
    if (isEdit.value && props.topic) {
      result = await topicsStore.updateTopic(props.topic.id, {
        name: name.value,
        description: description.value,
      })
      notify.success('Temática actualizada correctamente.')
    } else {
      result = await topicsStore.createTopic({
        name: name.value,
        description: description.value,
      })
      notify.success('Temática creada con éxito.')
    }
    emit('saved', result)
    emit('update:modelValue', false)
  } catch (error: unknown) {
    if (isApiError(error)) {
      if (error.status === 409 || error.kind === 'conflict') {
        fieldErrors.value.topicName = 'Ya existe una temática con ese nombre.'
      } else if (error.kind === 'validation') {
        fieldErrors.value = { ...error.fieldErrors }
      } else {
        generalError.value = error.message
      }
    } else {
      generalError.value = 'Ocurrió un error al guardar la temática.'
    }
  } finally {
    loading.value = false
  }
}
</script>
