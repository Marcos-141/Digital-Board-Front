<template>
  <v-card
    class="answer-item-card rounded-xl pa-5 mb-4 border-subtle transition-all"
    :class="{ 'accepted-solution-card': answer.isAccepted }"
    elevation="0"
  >
    <!-- Accepted Badge Header if applicable -->
    <div
      v-if="answer.isAccepted"
      class="accepted-header d-flex align-center bg-success-light rounded-lg px-3 py-1 mb-3"
    >
      <v-icon color="success" size="18" class="mr-2">mdi-check-decagram</v-icon>
      <span class="text-caption font-weight-bold text-success-dark">
        Solución Verificada y Aceptada por el Autor
      </span>
    </div>

    <!-- Author Bar -->
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="d-flex align-center">
        <UserAvatar
          :name="answer.author.name"
          :avatar="answer.author.avatar"
          :size="38"
          class="mr-3"
        />
        <div>
          <div class="d-flex align-center ga-2">
            <span class="text-subtitle-2 font-weight-bold text-color3">
              {{ answer.author.name }}
            </span>
            <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold">
              {{ answer.author.grade }}
            </v-chip>
          </div>
          <span class="text-caption text-color3-muted">
            {{ answer.createdAt }} • {{ answer.author.points || 50 }} pts de reputación
          </span>
        </div>
      </div>

      <!-- Accept Solution Toggle Button -->
      <v-btn
        v-if="canAccept"
        variant="tonal"
        :color="answer.isAccepted ? 'success' : '#59554e'"
        size="small"
        rounded="xl"
        class="text-none font-weight-bold"
        prepend-icon="mdi-check-circle-outline"
        @click="$emit('accept', answer.id)"
      >
        {{ answer.isAccepted ? 'Solución Aceptada' : 'Aceptar Solución' }}
      </v-btn>
    </div>

    <!-- Answer Content -->
    <div class="text-body-2 text-color3 content-text mb-4">
      {{ answer.content }}
    </div>

    <v-divider class="border-subtle mb-3" />

    <!-- Actions / Votes -->
    <div class="d-flex align-center justify-space-between">
      <span class="text-caption text-color3-muted">
        ¿Te ha resultado útil esta respuesta?
      </span>

      <v-btn
        variant="tonal"
        size="small"
        rounded="xl"
        :color="answer.hasLiked ? 'error' : '#59554e'"
        class="text-none font-weight-bold"
        prepend-icon="mdi-thumb-up-outline"
        @click="$emit('toggleLike', answer.id)"
      >
        {{ answer.likes }} útil
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { Answer } from '~/composables/usePost'

defineProps<{
  answer: Answer
  canAccept?: boolean
}>()

defineEmits<{
  (e: 'toggleLike', answerId: string): void
  (e: 'accept', answerId: string): void
}>()
</script>

<style scoped>
.answer-item-card {
  background-color: #ffffff;
  border: 1px solid #e2e3d9 !important;
}

.accepted-solution-card {
  border: 2px solid #7bb0a6 !important;
  background-color: #f7faf9 !important;
}

.bg-success-light {
  background-color: rgba(123, 176, 166, 0.15);
}

.text-success-dark {
  color: #3b6b62 !important;
}

.text-color3 {
  color: #59554e !important;
}

.text-color3-muted {
  color: rgba(89, 85, 78, 0.75) !important;
}

.border-subtle {
  border-color: #e2e3d9 !important;
}

.content-text {
  white-space: pre-line;
  line-height: 1.6;
}
</style>
