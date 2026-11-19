<template>
  <v-dialog
    :model-value="modelValue"
    max-width="640px"
    persistent
    @update:model-value="handleCloseRequest"
  >
    <v-card class="rounded-card border-soft pa-4 pa-sm-6">
      <div class="d-flex align-center justify-space-between mb-4">
        <v-card-title class="pa-0 font-weight-bold text-h6">
          <v-icon
            :icon="isEdit ? 'mdi-pencil-box-outline' : 'mdi-plus-box-outline'"
            color="primary"
            class="mr-2"
          />
          {{ isEdit ? 'Editar publicación' : 'Nueva publicación' }}
        </v-card-title>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          aria-label="Cerrar modal"
          @click="handleCloseRequest"
        />
      </div>

      <!-- General error banner -->
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
        <!-- Topic Select -->
        <div class="mb-3">
          <label for="post-topic" class="text-caption font-weight-bold mb-1 d-block">
            Temática *
          </label>
          <v-select
            id="post-topic"
            v-model="topicId"
            :items="topicsStore.topics"
            item-title="name"
            item-value="id"
            placeholder="Selecciona la temática adecuada"
            density="comfortable"
            variant="outlined"
            rounded="xl"
            :disabled="!!lockedTopicId || isEdit"
            :rules="[rules.required('La temática')]"
            :error-messages="fieldErrors.topicId"
            @update:model-value="clearErrors"
          />
        </div>

        <!-- Title -->
        <div class="mb-3">
          <label for="post-title" class="text-caption font-weight-bold mb-1 d-block">
            Título *
          </label>
          <v-text-field
            id="post-title"
            v-model="title"
            placeholder="Escribe un título claro y descriptivo..."
            density="comfortable"
            variant="outlined"
            rounded="xl"
            counter="150"
            maxlength="150"
            autofocus
            :rules="[rules.required('El título'), rules.maxLength(150, 'El título')]"
            :error-messages="fieldErrors.title"
            @update:model-value="clearErrors"
          />
        </div>

        <!-- Description -->
        <div class="mb-3">
          <label for="post-desc" class="text-caption font-weight-bold mb-1 d-block">
            Contenido / Descripción *
          </label>
          <v-textarea
            id="post-desc"
            v-model="description"
            placeholder="Explica la idea, anuncio o debate con suficiente detalle..."
            density="comfortable"
            variant="outlined"
            rounded="xl"
            rows="4"
            auto-grow
            :rules="[rules.required('La descripción')]"
            :error-messages="fieldErrors.description"
            @update:model-value="clearErrors"
          />
        </div>

        <!-- Image URL (optional) -->
        <div class="mb-3">
          <label for="post-image" class="text-caption font-weight-bold mb-1 d-block">
            Imagen opcional (URL)
          </label>
          <v-text-field
            id="post-image"
            v-model="image"
            placeholder="https://ejemplo.com/imagen.jpg"
            prepend-inner-icon="mdi-image-outline"
            density="comfortable"
            variant="outlined"
            rounded="xl"
            clearable
            :rules="[(v: string | null | undefined) => rules.imageUrl(v)]"
            :error-messages="fieldErrors.image"
            @update:model-value="clearErrors"
          />
        </div>

        <!-- Live Image Preview -->
        <div v-if="isValidImageUrl" class="mb-4">
          <div class="text-caption font-weight-medium text-muted mb-1">
            Vista previa de la imagen:
          </div>
          <div style="max-height: 180px; max-width: 320px;">
            <ImagePreview
              :src="image"
              alt="Vista previa"
              :aspect="16 / 9"
              fallback-height="120px"
            />
          </div>
        </div>

        <div class="d-flex justify-end ga-2 pt-2 border-t">
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
            {{ isEdit ? 'Guardar cambios' : 'Publicar' }}
          </v-btn>
        </div>
      </form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { rules } from '~/utils/validators'
import { useAuthStore } from '~/stores/auth'
import { useTopicsStore } from '~/stores/topics'
import { usePostsStore } from '~/stores/posts'
import { useNotify } from '~/composables/useNotify'
import { useConfirm } from '~/composables/useConfirm'
import { isApiError } from '~/api/errors'
import type { PostRequest, PostResponse } from '~/types/api'

const props = defineProps<{
  modelValue: boolean
  post?: PostResponse | null
  lockedTopicId?: number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved', post: PostResponse): void
}>()

const authStore = useAuthStore()
const topicsStore = useTopicsStore()
const postsStore = usePostsStore()
const notify = useNotify()
const { confirm } = useConfirm()

const title = ref('')
const description = ref('')
const image = ref('')
const topicId = ref<number | null>(null)
const loading = ref(false)

const fieldErrors = ref<Record<string, string>>({})
const generalError = ref<string | null>(null)

const isEdit = computed(() => !!props.post?.postId)

// Load topics if not loaded
onMounted(async () => {
  if (topicsStore.topics.length === 0) {
    await topicsStore.fetchTopics()
  }
})

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (props.post) {
        title.value = props.post.title || ''
        description.value = props.post.description || ''
        image.value = props.post.image || ''
        topicId.value = props.post.topicId
      } else {
        title.value = ''
        description.value = ''
        image.value = ''
        topicId.value = props.lockedTopicId || topicsStore.topics[0]?.id || null
      }
      fieldErrors.value = {}
      generalError.value = null
    }
  },
  { immediate: true }
)

const isDirty = computed(() => {
  if (props.post) {
    return (
      title.value !== (props.post.title || '') ||
      description.value !== (props.post.description || '') ||
      image.value !== (props.post.image || '') ||
      topicId.value !== props.post.topicId
    )
  }
  return title.value.trim() !== '' || description.value.trim() !== '' || image.value.trim() !== ''
})

const isValidImageUrl = computed(() => {
  if (!image.value || !image.value.trim()) return false
  const t = image.value.trim()
  return t.startsWith('http://') || t.startsWith('https://')
})

const isFormValid = computed(() => {
  return (
    title.value.trim().length > 0 &&
    title.value.trim().length <= 150 &&
    description.value.trim().length > 0 &&
    topicId.value !== null &&
    (!image.value.trim() || isValidImageUrl.value)
  )
})

function clearErrors(): void {
  fieldErrors.value = {}
  generalError.value = null
}

async function handleCloseRequest(): Promise<void> {
  if (isDirty.value) {
    const ok = await confirm({
      title: 'Descartar cambios',
      message: 'Tienes cambios sin guardar en esta publicación. ¿Deseas descartarlos?',
      confirmText: 'Descartar',
      cancelText: 'Continuar editando',
      destructive: true,
    })
    if (!ok) return
  }
  emit('update:modelValue', false)
}

async function handleSubmit(): Promise<void> {
  if (!isFormValid.value || topicId.value === null) return
  if (!authStore.user?.userId && !props.post?.userId) {
    generalError.value = 'Debes iniciar sesión para publicar.'
    return
  }

  loading.value = true
  clearErrors()

  // On edit, always preserve the original author's userId (Requirement 2.3 item 3)
  const targetUserId = isEdit.value && props.post?.userId
    ? props.post.userId
    : authStore.user!.userId

  const payload: PostRequest = {
    title: title.value.trim(),
    description: description.value.trim(),
    image: image.value.trim() || null,
    topicId: topicId.value,
    userId: targetUserId,
  }

  try {
    let result: PostResponse
    if (isEdit.value && props.post) {
      result = await postsStore.updatePost(props.post.postId, payload)
      notify.success('Publicación actualizada correctamente.')
    } else {
      result = await postsStore.createPost(payload)
      notify.success('¡Publicación creada exitosamente!')
    }
    emit('saved', result)
    emit('update:modelValue', false)
  } catch (error: unknown) {
    if (isApiError(error)) {
      if (error.kind === 'validation') {
        fieldErrors.value = { ...error.fieldErrors }
      } else {
        generalError.value = error.message
      }
    } else {
      generalError.value = 'Ocurrió un error al guardar la publicación.'
    }
  } finally {
    loading.value = false
  }
}
</script>
