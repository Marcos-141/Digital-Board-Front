<template>
  <div class="post-answer-list">
    <!-- Header section -->
    <div class="d-flex align-center justify-space-between mb-4">
      <h3 class="text-h6 font-weight-bold text-color3 d-flex align-center">
        <v-icon color="primary-darken-1" class="mr-2">mdi-forum-outline</v-icon>
        Respuestas de la Comunidad ({{ answers.length }})
      </h3>

      <v-chip
        v-if="hasAcceptedAnswer"
        color="success"
        size="small"
        variant="flat"
        class="font-weight-bold"
      >
        <v-icon start size="14">mdi-check-decagram</v-icon>
        Duda Resuelta
      </v-chip>
    </div>

    <!-- New Answer Input Form -->
    <v-card class="rounded-xl pa-4 mb-6 bg-secondary border-subtle elevation-0">
      <div class="d-flex align-start ga-3 mb-3">
        <UserAvatar
          :name="user?.name || 'Estudiante'"
          :avatar="user?.avatar"
          :size="36"
        />
        <div class="flex-grow-1">
          <span class="text-caption font-weight-bold text-color3 d-block mb-1">
            Escribe tu explicación o solución paso a paso
          </span>
          <v-textarea
            v-model="newAnswerText"
            placeholder="Sé claro y respetuoso. Explica los pasos para que tus compañeros puedan entender la solución..."
            rows="3"
            variant="solo"
            flat
            density="comfortable"
            rounded="lg"
            hide-details
            class="answer-textarea"
          />
        </div>
      </div>

      <div class="d-flex align-center justify-space-between">
        <span class="text-caption text-color3-muted d-none d-sm-inline">
          💡 Ganarás <strong style="color: #7bb0a6">+15 puntos de reputación</strong> al enviar una respuesta.
        </span>

        <v-btn
          color="primary"
          variant="flat"
          rounded="xl"
          class="text-none font-weight-bold px-5 btn-submit ml-auto"
          :disabled="!newAnswerText.trim()"
          :loading="isSubmitting"
          prepend-icon="mdi-send"
          @click="handleSubmitAnswer"
        >
          Enviar Respuesta
        </v-btn>
      </div>
    </v-card>

    <!-- Empty Answers State -->
    <v-card
      v-if="answers.length === 0"
      class="rounded-xl pa-8 text-center bg-white border-subtle elevation-0 my-4"
    >
      <v-avatar color="secondary" size="56" class="mb-3">
        <v-icon color="#59554e" size="28">mdi-comment-question-outline</v-icon>
      </v-avatar>
      <h4 class="text-subtitle-1 font-weight-bold text-color3 mb-1">
        Aún no hay respuestas para esta duda
      </h4>
      <p class="text-body-2 text-color3-muted mb-0 max-w-400">
        ¿Sabes la respuesta? Ayuda a tu compañero escribiendo tu solución en el recuadro superior.
      </p>
    </v-card>

    <!-- Answers List -->
    <div v-else>
      <PostAnswerItem
        v-for="answer in sortedAnswers"
        :key="answer.id"
        :answer="answer"
        :can-accept="canAccept"
        @toggle-like="handleToggleLike"
        @accept="handleAccept"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Answer } from '~/composables/usePost'

const props = defineProps<{
  postId: string
  answers: Answer[]
  canAccept?: boolean
}>()

const { addAnswer, toggleLikeAnswer, acceptAnswer } = usePost()
const { user } = useAuth()

const newAnswerText = ref('')
const isSubmitting = ref(false)

const hasAcceptedAnswer = computed(() => props.answers.some((a) => a.isAccepted))

const sortedAnswers = computed(() => {
  return [...props.answers].sort((a, b) => {
    // Accepted solution always first
    if (a.isAccepted) return -1
    if (b.isAccepted) return 1
    // Then sorted by likes
    return b.likes - a.likes
  })
})

const handleSubmitAnswer = async () => {
  if (!newAnswerText.value.trim()) return
  isSubmitting.value = true
  await new Promise((r) => setTimeout(r, 400))
  addAnswer(props.postId, newAnswerText.value)
  newAnswerText.value = ''
  isSubmitting.value = false
}

const handleToggleLike = (answerId: string) => {
  toggleLikeAnswer(props.postId, answerId)
}

const handleAccept = (answerId: string) => {
  acceptAnswer(props.postId, answerId)
}
</script>

<style scoped>
.post-answer-list {
  width: 100%;
}

.text-color3 {
  color: #59554e !important;
}

.text-color3-muted {
  color: rgba(89, 85, 78, 0.75) !important;
}

.border-subtle {
  border: 1px solid #e2e3d9 !important;
}

.answer-textarea :deep(.v-field) {
  background-color: #ffffff !important;
  border-radius: 12px;
  border: 1px solid #e2e3d9;
}

.max-w-400 {
  max-width: 400px;
  margin: 0 auto;
}

.btn-submit {
  background-color: #a1c1be !important;
  color: #2c3534 !important;
}
</style>
