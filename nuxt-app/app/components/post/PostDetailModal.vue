<template>
  <v-dialog
    v-model="isDetailModalOpen"
    max-width="840"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card v-if="currentPost" class="modal-card rounded-xl overflow-hidden elevation-4">
      <!-- Subject Header Accent Bar -->
      <div
        class="header-accent-bar"
        :style="{ backgroundColor: getSubjectColor(currentPost.subject) }"
      />

      <!-- Dialog Header -->
      <div class="pa-6 pb-4 border-subtle-bottom bg-white d-flex align-start justify-space-between">
        <div>
          <div class="d-flex align-center flex-wrap ga-2 mb-2">
            <v-chip
              size="small"
              variant="flat"
              class="font-weight-bold text-caption text-color3"
              style="background-color: #e2e3d9"
            >
              <v-icon start size="14">{{ getSubjectIcon(currentPost.subject) }}</v-icon>
              {{ currentPost.subject }}
            </v-chip>

            <v-chip
              size="small"
              variant="flat"
              :color="currentPost.status === 'resuelto' ? 'success' : 'warning'"
              class="font-weight-bold text-caption"
            >
              <v-icon start size="14">
                {{ currentPost.status === 'resuelto' ? 'mdi-check-decagram' : 'mdi-clock-outline' }}
              </v-icon>
              {{ currentPost.status === 'resuelto' ? 'Duda Resuelta' : 'Pendiente' }}
            </v-chip>

            <v-chip size="small" variant="outlined" color="#59554e" class="text-caption">
              {{ currentPost.grade }}
            </v-chip>
          </div>

          <h2 class="text-h6 text-sm-h5 font-weight-bold text-color3">
            {{ currentPost.title }}
          </h2>
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          density="comfortable"
          color="#59554e"
          @click="closePostDetail"
        />
      </div>

      <v-card-text class="pa-6 pt-4 bg-white">
        <!-- Author info bar -->
        <div class="d-flex align-center justify-space-between mb-4 pa-3 rounded-lg bg-secondary">
          <div class="d-flex align-center">
            <UserAvatar
              :name="currentPost.author.name"
              :avatar="currentPost.author.avatar"
              :size="40"
              class="mr-3"
            />
            <div>
              <div class="text-subtitle-2 font-weight-bold text-color3">
                {{ currentPost.author.name }}
              </div>
              <div class="text-caption text-color3-muted">
                {{ currentPost.author.grade }} • Publicado {{ currentPost.createdAt }}
              </div>
            </div>
          </div>

          <v-btn
            variant="tonal"
            size="small"
            rounded="xl"
            :color="currentPost.hasLiked ? 'error' : '#59554e'"
            class="font-weight-bold text-none"
            prepend-icon="mdi-heart"
            @click="toggleLikePost(currentPost.id)"
          >
            {{ currentPost.likes }} Likes
          </v-btn>
        </div>

        <!-- Question Content -->
        <div class="text-body-1 text-color3 question-body mb-6">
          {{ currentPost.content }}
        </div>

        <!-- Tags -->
        <div v-if="currentPost.tags && currentPost.tags.length" class="d-flex flex-wrap ga-2 mb-6">
          <v-chip
            v-for="tag in currentPost.tags"
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

        <!-- Answers Section -->
        <PostAnswerList
          :post-id="currentPost.id"
          :answers="currentPost.answers"
          :can-accept="user?.id === currentPost.author.id || user?.id === 'usr-1'"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const { currentPost, isDetailModalOpen, closePostDetail, toggleLikePost } = usePost()
const { user } = useAuth()

const getSubjectColor = (subject: string) => {
  switch (subject) {
    case 'Matemáticas':
      return '#a1c1be'
    case 'Historia':
      return '#e0a96d'
    case 'Ciencias':
      return '#7bb0a6'
    case 'Lengua':
      return '#74a2be'
    case 'Inglés':
      return '#b08ebb'
    default:
      return '#a1c1be'
  }
}

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
.modal-card {
  background-color: #ffffff;
  border: 1px solid #e2e3d9;
}

.header-accent-bar {
  height: 6px;
  width: 100%;
}

.border-subtle-bottom {
  border-bottom: 1px solid #e2e3d9;
}

.border-subtle {
  border-color: #e2e3d9 !important;
}

.text-color3 {
  color: #59554e !important;
}

.text-color3-muted {
  color: rgba(89, 85, 78, 0.75) !important;
}

.question-body {
  white-space: pre-line;
  line-height: 1.7;
}
</style>
