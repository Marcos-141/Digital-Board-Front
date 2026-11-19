<template>
  <div class="comment-list">
    <div class="d-flex align-center justify-space-between mb-4">
      <h3 class="text-h6 font-weight-bold">
        Comentarios ({{ comments.length }})
      </h3>
    </div>

    <!-- Empty comments -->
    <div v-if="comments.length === 0" class="text-center py-6 text-muted border-soft rounded-card bg-surface mb-4">
      <v-icon icon="mdi-comment-outline" size="28" class="mb-2" />
      <div class="text-body-2 font-weight-medium">Aún no hay comentarios</div>
      <div class="text-caption">Sé el primero en compartir tu opinión o resolver dudas.</div>
    </div>

    <!-- List of comments -->
    <div v-else class="mb-4">
      <CommentItem
        v-for="comment in comments"
        :key="comment.commentId"
        :comment="comment"
        @updated="$emit('updated', $event)"
        @deleted="$emit('deleted', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommentResponse } from '~/types/api'

defineProps<{
  comments: CommentResponse[]
}>()

defineEmits<{
  (e: 'updated', comment: CommentResponse): void
  (e: 'deleted', commentId: number): void
}>()
</script>
