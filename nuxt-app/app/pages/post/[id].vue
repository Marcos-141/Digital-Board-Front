<template>
  <v-container class="py-6 max-w-1200">
    <!-- Top Back Navigation Bar -->
    <div class="d-flex align-center justify-space-between mb-6">
      <v-btn
        to="/"
        variant="tonal"
        color="secondary-darken-1"
        rounded="xl"
        class="text-none font-weight-bold"
        prepend-icon="mdi-arrow-left"
      >
        Volver al Muro Principal
      </v-btn>

      <v-chip
        v-if="post"
        size="small"
        variant="flat"
        :color="post.status === 'resuelto' ? 'success' : 'warning'"
        class="font-weight-bold"
      >
        <v-icon start size="14">
          {{ post.status === 'resuelto' ? 'mdi-check-decagram' : 'mdi-clock-outline' }}
        </v-icon>
        {{ post.status === 'resuelto' ? 'Duda Resuelta' : 'Pendiente' }}
      </v-chip>
    </div>

    <!-- Post Not Found State -->
    <v-card
      v-if="!post"
      class="rounded-xl pa-10 text-center bg-white border-subtle elevation-1 my-6"
    >
      <v-avatar color="secondary" size="64" class="mb-4">
        <v-icon color="#59554e" size="32">mdi-alert-circle-outline</v-icon>
      </v-avatar>
      <h3 class="text-h6 font-weight-bold text-color3 mb-2">
        Pregunta no encontrada
      </h3>
      <p class="text-body-2 text-color3-muted mb-4 max-w-400">
        La duda académica que intentas ver no existe o ha sido movida.
      </p>
      <v-btn
        to="/"
        color="primary"
        variant="flat"
        rounded="xl"
        class="text-none font-weight-bold btn-primary-custom"
      >
        Ir al Muro Principal
      </v-btn>
    </v-card>

    <!-- Post Detail Content -->
    <v-row v-else dense>
      <v-col cols="12" md="8">
        <v-card class="rounded-xl pa-6 pa-md-8 bg-white border-subtle elevation-2 mb-6">
          <!-- Meta Header -->
          <div class="d-flex align-center flex-wrap ga-2 mb-3">
            <v-chip
              size="small"
              variant="flat"
              class="font-weight-bold text-caption text-color3"
              style="background-color: #e2e3d9"
            >
              <v-icon start size="14">{{ getSubjectIcon(post.subject) }}</v-icon>
              {{ post.subject }}
            </v-chip>

            <v-chip size="small" variant="outlined" color="#59554e" class="text-caption">
              {{ post.grade }}
            </v-chip>
          </div>

          <!-- Title -->
          <h1 class="text-h5 text-sm-h4 font-weight-bold text-color3 mb-4">
            {{ post.title }}
          </h1>

          <!-- Author Info Card -->
          <div class="d-flex align-center justify-space-between mb-6 pa-3 rounded-lg bg-secondary">
            <div class="d-flex align-center">
              <UserAvatar
                :name="post.author.name"
                :avatar="post.author.avatar"
                :size="40"
                class="mr-3"
              />
              <div>
                <div class="text-subtitle-2 font-weight-bold text-color3">
                  {{ post.author.name }}
                </div>
                <div class="text-caption text-color3-muted">
                  {{ post.author.grade }} • Publicado {{ post.createdAt }}
                </div>
              </div>
            </div>

            <v-btn
              variant="tonal"
              size="small"
              rounded="xl"
              :color="post.hasLiked ? 'error' : '#59554e'"
              class="font-weight-bold text-none"
              prepend-icon="mdi-heart"
              @click="toggleLikePost(post.id)"
            >
              {{ post.likes }} Likes
            </v-btn>
          </div>

          <!-- Content -->
          <div class="text-body-1 text-color3 question-body mb-6">
            {{ post.content }}
          </div>

          <!-- Tags -->
          <div v-if="post.tags && post.tags.length" class="d-flex flex-wrap ga-2 mb-6">
            <v-chip
              v-for="tag in post.tags"
              :key="tag"
              size="small"
              variant="tonal"
              color="primary"
              class="font-weight-medium"
            >
              #{{ tag }}
            </v-chip>
          </div>

          <v-divider class="my-6 border-subtle" />

          <!-- Answers List -->
          <PostAnswerList
            :post-id="post.id"
            :answers="post.answers"
            :can-accept="user?.id === post.author.id || user?.id === 'usr-1'"
          />
        </v-card>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" md="4">
        <v-card class="rounded-xl pa-5 bg-white border-subtle elevation-1 mb-6">
          <h3 class="text-subtitle-1 font-weight-bold text-color3 mb-3 d-flex align-center">
            <v-icon color="primary-darken-1" class="mr-2">mdi-lightbulb-on-outline</v-icon>
            Consejos para Responder
          </h3>
          <v-list density="compact" class="pa-0 text-caption text-color3-muted">
            <v-list-item
              prepend-icon="mdi-numeric-1-circle-outline"
              title="Sé claro y explica el procedimiento paso a paso."
            />
            <v-list-item
              prepend-icon="mdi-numeric-2-circle-outline"
              title="Utiliza ejemplos prácticos si la materia lo requiere."
            />
            <v-list-item
              prepend-icon="mdi-numeric-3-circle-outline"
              title="Evita dar la respuesta sin justificación académica."
            />
          </v-list>
        </v-card>

        <v-card class="rounded-xl pa-5 bg-secondary border-subtle elevation-0">
          <div class="d-flex align-center mb-2">
            <v-avatar color="primary" size="32" class="mr-2">
              <v-icon color="#2c3534" size="18">mdi-trophy-outline</v-icon>
            </v-avatar>
            <span class="text-subtitle-2 font-weight-bold text-color3">
              Sistema de Puntos
            </span>
          </div>
          <p class="text-caption text-color3-muted mb-0">
            Responder dudas te concede +15 puntos. Si el autor marca tu respuesta como la solución correcta, recibirás un bono de +25 puntos adicionales.
          </p>
        </v-card>
      </v-col>
    </row>
  </v-container>
</template>

<script setup lang="ts">
const route = useRoute()
const { getPostById, toggleLikePost } = usePost()
const { user } = useAuth()

const postId = computed(() => route.params.id as string)
const post = computed(() => getPostById(postId.value))

useSeoMeta({
  title: computed(() => (post.value ? `${post.value.title} | Tablero Digital` : 'Detalle de Duda')),
  description: computed(() => post.value?.content || 'Consulta la solución de esta duda en el Muro Educativo.'),
})

const getSubjectIcon = (subject: string) => {
  switch (subject) {
    case 'Matemáticas':
      return 'mdi-calculator'
    case 'Historia':
      return 'mdi-book-open-page-variant'
    case 'Ciencias':
      return 'mdi-atom'
    case 'Lengua':
      return 'mdi-text-box-search-outline'
    default:
      return 'mdi-school'
  }
}
</script>

<style scoped>
.max-w-1200 {
  max-width: 1200px;
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

.question-body {
  white-space: pre-line;
  line-height: 1.7;
}

.btn-primary-custom {
  background-color: #a1c1be !important;
  color: #2c3534 !important;
}

.max-w-400 {
  max-width: 400px;
  margin: 0 auto;
}
</style>
