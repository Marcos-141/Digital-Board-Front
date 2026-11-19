<template>
  <div class="comment-form-wrapper">
    <!-- CTA when user is not logged in -->
    <v-card
      v-if="!authStore.isAuthenticated"
      class="rounded-card border-soft pa-6 text-center bg-grey-lighten-4 elevation-0"
    >
      <v-icon icon="mdi-comment-account-outline" size="32" color="primary-darken-1" class="mb-2" />
      <h4 class="text-subtitle-1 font-weight-bold mb-1">
        Únete a la conversación
      </h4>
      <p class="text-body-2 text-muted mb-4">
        Inicia sesión o crea una cuenta para dejar comentarios, dudas o respuestas.
      </p>
      <v-btn
        :to="{ path: '/login', query: { redirect: route.fullPath } }"
        color="primary"
        variant="flat"
        rounded="xl"
        class="text-none font-weight-bold px-6"
      >
        Iniciar sesión para comentar
      </v-btn>
    </v-card>

    <!-- Comment Creation Form -->
    <v-card v-else class="rounded-card border-soft pa-5 elevation-0" color="surface">
      <div class="d-flex align-center mb-3">
        <UserAvatar :name="authStore.user?.nombre" size="32" class="mr-2" />
        <span class="text-subtitle-2 font-weight-bold">
          Comentar como {{ authStore.user?.nombre }}
        </span>
      </div>

      <form @submit.prevent="handleSubmit">
        <v-alert
          v-if="errorMessage"
          density="compact"
          type="error"
          variant="tonal"
          rounded="xl"
          class="mb-3 text-caption"
        >
          {{ errorMessage }}
        </v-alert>

        <!-- Content -->
        <div class="mb-3">
          <v-textarea
            v-model="content"
            placeholder="Escribe tu comentario o respuesta con claridad y respeto..."
            rows="3"
            auto-grow
            density="comfortable"
            variant="outlined"
            rounded="xl"
            hide-details="auto"
            :rules="[rules.required('El comentario')]"
          />
        </div>

        <!-- Optional Image URL -->
        <v-expand-transition>
          <div v-if="showImageField" class="mb-3">
            <v-text-field
              v-model="image"
              placeholder="https://ejemplo.com/captura.jpg (URL opcional)"
              prepend-inner-icon="mdi-image-outline"
              density="compact"
              variant="outlined"
              rounded="xl"
              clearable
              hide-details="auto"
              :rules="[(v: string | null | undefined) => rules.imageUrl(v)]"
            />

            <!-- Live image preview -->
            <div v-if="isValidImageUrl" class="mt-2" style="max-width: 240px; max-height: 140px;">
              <ImagePreview :src="image" alt="Vista previa de comentario" :aspect="16 / 9" fallback-height="90px" />
            </div>
          </div>
        </v-expand-transition>

        <div class="d-flex align-center justify-space-between pt-2">
          <!-- Toggle image field button -->
          <v-btn
            variant="text"
            size="small"
            rounded="xl"
            prepend-icon="mdi-image-plus-outline"
            class="text-none text-muted font-weight-medium"
            @click="showImageField = !showImageField"
          >
            {{ showImageField ? 'Ocultar campo de imagen' : 'Adjuntar imagen' }}
          </v-btn>

          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            rounded="xl"
            class="text-none font-weight-bold px-6"
            :loading="loading"
            :disabled="loading || !content.trim()"
          >
            Publicar comentario
          </v-btn>
        </div>
      </form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { rules } from '~/utils/validators'
import { useAuthStore } from '~/stores/auth'
import { useCommentsStore } from '~/stores/comments'
import { useNotify } from '~/composables/useNotify'
import type { CommentResponse } from '~/types/api'

const props = defineProps<{
  postId: number
}>()

const emit = defineEmits<{
  (e: 'created', comment: CommentResponse): void
}>()

const authStore = useAuthStore()
const commentsStore = useCommentsStore()
const notify = useNotify()
const route = useRoute()

const content = ref('')
const image = ref('')
const showImageField = ref(false)
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const isValidImageUrl = computed(() => {
  if (!image.value || !image.value.trim()) return false
  const t = image.value.trim()
  return t.startsWith('http://') || t.startsWith('https://')
})

async function handleSubmit(): Promise<void> {
  if (!content.value.trim()) return
  if (!authStore.user?.userId) {
    errorMessage.value = 'Debes iniciar sesión para comentar.'
    return
  }

  loading.value = true
  errorMessage.value = null

  try {
    const created = await commentsStore.createComment({
      content: content.value.trim(),
      image: image.value.trim() || null,
      postId: props.postId,
      userId: authStore.user.userId,
    })

    content.value = ''
    image.value = ''
    showImageField.value = false
    notify.success('Comentario agregado con éxito.')
    emit('created', created)
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'No se pudo publicar el comentario.'
  } finally {
    loading.value = false
  }
}
</script>
