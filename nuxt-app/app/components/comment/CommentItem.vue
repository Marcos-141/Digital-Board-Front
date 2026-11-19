<template>
  <div class="comment-item pa-4 rounded-card border-soft bg-surface mb-3" :id="`comment-${comment.commentId}`">
    <div class="d-flex align-start justify-space-between mb-2">
      <!-- Author info + Date -->
      <div class="d-flex align-center">
        <NuxtLink
          :to="comment.userId ? `/users/${comment.userId}` : undefined"
          class="text-decoration-none text-current d-flex align-center mr-2"
        >
          <UserAvatar
            :name="comment.userName || 'Usuario'"
            size="32"
            class="mr-2"
          />
          <div>
            <div class="text-subtitle-2 font-weight-bold" style="line-height: 1.1;">
              {{ comment.userName || 'Usuario eliminado' }}
            </div>
            <div class="text-caption text-muted">
              {{ formattedDate }}
              <span v-if="isEdited" class="font-italic">· (editado)</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Actions Menu (Only if canEdit) -->
      <div v-if="canEdit && !isEditing" class="ml-2">
        <v-menu location="bottom end">
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              icon="mdi-dots-vertical"
              variant="text"
              size="x-small"
              aria-label="Opciones de comentario"
            />
          </template>
          <v-card class="rounded-lg pa-1 border-soft" elevation="3">
            <v-list density="compact" nav class="pa-0">
              <v-list-item
                prepend-icon="mdi-pencil-outline"
                title="Editar"
                @click="startEditing"
              />
              <v-list-item
                prepend-icon="mdi-delete-outline"
                title="Eliminar"
                color="error"
                @click="handleDelete"
              />
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </div>

    <!-- Inline Edit Form -->
    <div v-if="isEditing" class="mt-2">
      <v-textarea
        v-model="editContent"
        rows="2"
        auto-grow
        density="comfortable"
        variant="outlined"
        rounded="xl"
        autofocus
        class="mb-2"
        hide-details
      />

      <div class="d-flex justify-end ga-2 pt-2">
        <v-btn
          variant="tonal"
          size="small"
          rounded="xl"
          class="text-none"
          :disabled="loading"
          @click="cancelEditing"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          size="small"
          rounded="xl"
          class="text-none font-weight-bold"
          :loading="loading"
          :disabled="loading || !editContent.trim()"
          @click="saveEditing"
        >
          Guardar cambios
        </v-btn>
      </div>
    </div>

    <!-- Normal View Mode -->
    <div v-else>
      <!-- Plain text description with pre-line (NO v-html) -->
      <p class="text-body-2 text-on-surface user-content mb-2">
        {{ comment.content }}
      </p>

      <!-- Optional Image -->
      <div v-if="comment.image" class="mt-2" style="max-width: 320px;">
        <ImagePreview
          :src="comment.image"
          alt="Imagen adjunta al comentario"
          :aspect="16 / 9"
          fallback-height="90px"
          zoomable
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCommentsStore } from '~/stores/comments'
import { useFormatDate } from '~/composables/useFormatDate'
import { useConfirm } from '~/composables/useConfirm'
import { useNotify } from '~/composables/useNotify'
import type { CommentResponse, CommentRequest } from '~/types/api'

const props = defineProps<{
  comment: CommentResponse
}>()

const emit = defineEmits<{
  (e: 'updated', comment: CommentResponse): void
  (e: 'deleted', commentId: number): void
}>()

const authStore = useAuthStore()
const commentsStore = useCommentsStore()
const { formatDate } = useFormatDate()
const { confirm } = useConfirm()
const notify = useNotify()

const isEditing = ref(false)
const editContent = ref('')
const loading = ref(false)

const canEdit = computed(() => authStore.canEdit(props.comment.userId))
const formattedDate = computed(() => formatDate(props.comment.createdAt))
const isEdited = computed(() => {
  return props.comment.updatedAt && props.comment.updatedAt !== props.comment.createdAt
})

function startEditing(): void {
  editContent.value = props.comment.content
  isEditing.value = true
}

function cancelEditing(): void {
  isEditing.value = false
  editContent.value = ''
}

async function saveEditing(): Promise<void> {
  if (!editContent.value.trim()) return
  if (!props.comment.postId || !props.comment.userId) return

  loading.value = true
  try {
    // Preserve original postId and userId as per Requirement 2.3 item 3!
    const payload: CommentRequest = {
      content: editContent.value.trim(),
      image: props.comment.image,
      postId: props.comment.postId,
      userId: props.comment.userId,
    }

    const updated = await commentsStore.updateComment(props.comment.commentId, payload)
    notify.success('Comentario actualizado.')
    isEditing.value = false
    emit('updated', updated)
  } catch {
    notify.error('No se pudo actualizar el comentario.')
  } finally {
    loading.value = false
  }
}

async function handleDelete(): Promise<void> {
  const ok = await confirm({
    title: 'Eliminar comentario',
    message: '¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    destructive: true,
  })

  if (!ok || !props.comment.postId) return

  try {
    await commentsStore.deleteComment(props.comment.commentId, props.comment.postId)
    notify.success('Comentario eliminado.')
    emit('deleted', props.comment.commentId)
  } catch {
    notify.error('No se pudo eliminar el comentario.')
  }
}
</script>
