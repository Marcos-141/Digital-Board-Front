<template>
  <v-card
    class="post-card rounded-xl border-subtle h-100 d-flex flex-column transition-all cursor-pointer elevation-1"
    :class="{ 'list-view-card': isListView }"
    @click="openPostDetail(post.id)"
  >
    <!-- Top Accent Bar / Subject Line -->
    <div
      class="top-color-bar"
      :style="{ backgroundColor: getSubjectColor(post.subject) }"
    />

    <div class="pa-5 flex-grow-1 d-flex flex-column">
      <!-- Header Meta: Subject Chip & Status -->
      <div class="d-flex align-center justify-space-between mb-3">
        <v-chip
          size="small"
          variant="flat"
          class="font-weight-bold text-caption text-color3"
          :style="{ backgroundColor: '#e2e3d9' }"
        >
          <v-icon start size="14">{{ getSubjectIcon(post.subject) }}</v-icon>
          {{ post.subject }}
        </v-chip>

        <!-- Status Chip -->
        <v-chip
          size="small"
          variant="flat"
          :color="post.status === 'resuelto' ? 'success' : 'warning'"
          class="font-weight-bold text-caption"
        >
          <v-icon start size="14">
            {{ post.status === 'resuelto' ? 'mdi-check-decagram' : 'mdi-clock-outline' }}
          </v-icon>
          {{ post.status === 'resuelto' ? 'Resuelto' : 'Pendiente' }}
        </v-chip>
      </div>

      <!-- Title -->
      <h2 class="text-subtitle-1 text-sm-h6 font-weight-bold text-color3 mb-2 title-truncate">
        {{ post.title }}
      </h2>

      <!-- Content Preview -->
      <p class="text-body-2 text-color3-muted mb-4 content-truncate flex-grow-1">
        {{ post.content }}
      </p>

      <!-- Tags -->
      <div v-if="post.tags && post.tags.length" class="d-flex flex-wrap ga-1 mb-4">
        <v-chip
          v-for="tag in post.tags"
          :key="tag"
          size="x-small"
          variant="outlined"
          color="#59554e"
          class="text-caption border-subtle"
        >
          #{{ tag }}
        </v-chip>
      </div>

      <v-divider class="my-2 border-subtle" />

      <!-- Footer: Author & Interaction Counters -->
      <div class="d-flex align-center justify-space-between pt-2">
        <div class="d-flex align-center">
          <UserAvatar
            :name="post.author.name"
            :avatar="post.author.avatar"
            :size="32"
            class="mr-2"
          />
          <div class="d-flex flex-column">
            <span class="text-caption font-weight-bold text-color3 line-height-1">
              {{ post.author.name }}
            </span>
            <span class="text-caption text-color3-muted line-height-1 mt-1">
              {{ post.author.grade }} • {{ post.createdAt }}
            </span>
          </div>
        </div>

        <div class="d-flex align-center ga-2">
          <!-- Answer Counter -->
          <v-chip
            size="small"
            variant="tonal"
            color="primary"
            class="font-weight-bold"
          >
            <v-icon start size="14">mdi-comment-text-multiple-outline</v-icon>
            {{ post.answers.length }}
          </v-chip>

          <!-- Like Button -->
          <v-btn
            icon
            density="comfortable"
            variant="text"
            :color="post.hasLiked ? 'error' : '#59554e'"
            title="Dar Like"
            @click.stop="toggleLikePost(post.id)"
          >
            <v-icon size="20">
              {{ post.hasLiked ? 'mdi-heart' : 'mdi-heart-outline' }}
            </v-icon>
            <span class="text-caption font-weight-bold ml-1">{{ post.likes }}</span>
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { Post } from '~/composables/usePost'

const props = defineProps<{
  post: Post
  isListView?: boolean
}>()

const { openPostDetail, toggleLikePost } = usePost()

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
    case 'Inglés':
      return 'mdi-translate'
    default:
      return 'mdi-school'
  }
}
</script>

<style scoped>
.post-card {
  background-color: #ffffff;
  position: relative;
  overflow: hidden;
  border: 1px solid #e2e3d9 !important;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(89, 85, 78, 0.12) !important;
  border-color: #a1c1be !important;
}

.top-color-bar {
  height: 6px;
  width: 100%;
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

.line-height-1 {
  line-height: 1.1;
}

.title-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-line;
}

.transition-all {
  transition: all 0.25s ease-in-out;
}
</style>
