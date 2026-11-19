<template>
  <v-card
    class="rounded-card border-soft overflow-hidden card-interactive d-flex flex-column fill-height"
    color="surface"
    elevation="0"
    :to="`/post/${post.postId}`"
  >
    <!-- Top colored bar by topic -->
    <div
      class="post-color-bar"
      :style="{ backgroundColor: topicColor, height: '6px' }"
    />

    <v-card-text class="pa-5 d-flex flex-column flex-grow-1">
      <!-- Header: Topic Chip + Actions Menu -->
      <div class="d-flex align-center justify-space-between mb-3">
        <TopicChip
          v-if="post.topicName"
          :topic-id="post.topicId"
          :name="post.topicName"
          size="x-small"
          @click.stop.prevent="handleTopicClick"
        />
        <span v-else class="text-caption text-muted">Sin temática</span>

        <!-- Actions Menu: Only if canEdit(post.userId) -->
        <div v-if="canEdit" class="ml-2" @click.prevent.stop>
          <v-menu location="bottom end">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                icon="mdi-dots-vertical"
                variant="text"
                size="small"
                aria-label="Opciones de publicación"
              />
            </template>
            <v-card class="rounded-lg pa-1 border-soft" elevation="3">
              <v-list density="compact" nav class="pa-0">
                <v-list-item
                  prepend-icon="mdi-pencil-outline"
                  title="Editar publicación"
                  @click="$emit('edit', post)"
                />
                <v-list-item
                  prepend-icon="mdi-delete-outline"
                  title="Eliminar publicación"
                  color="error"
                  @click="$emit('delete', post)"
                />
              </v-list>
            </v-card>
          </v-menu>
        </div>
      </div>

      <!-- Image Preview (if present) -->
      <div v-if="post.image" class="mb-3">
        <ImagePreview
          :src="post.image"
          :alt="post.title"
          :aspect="isListView ? 16 / 9 : 16 / 9"
          fallback-height="90px"
        />
      </div>

      <!-- Title -->
      <h3 class="text-subtitle-1 font-weight-bold mb-2 line-clamp-2" :title="post.title">
        {{ post.title }}
      </h3>

      <!-- Description: Plain text with pre-line, max 3 lines -->
      <p class="text-body-2 text-muted user-content line-clamp-3 mb-4 flex-grow-1">
        {{ post.description }}
      </p>

      <!-- Footer: Author + Date -->
      <div class="d-flex align-center justify-space-between pt-3 border-t mt-auto">
        <div class="d-flex align-center overflow-hidden mr-2">
          <UserAvatar
            :name="post.userName || 'Usuario'"
            size="28"
            class="mr-2 flex-shrink-0"
          />
          <span class="text-caption font-weight-medium text-truncate">
            {{ post.userName || 'Usuario eliminado' }}
          </span>
        </div>

        <span class="text-caption text-muted flex-shrink-0">
          {{ formattedDate }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useTopicColor } from '~/composables/useTopicColor'
import { useFormatDate } from '~/composables/useFormatDate'
import { useAuthStore } from '~/stores/auth'
import { useBoardStore } from '~/stores/board'
import type { PostResponse } from '~/types/api'

const props = defineProps<{
  post: PostResponse
  isListView?: boolean
}>()

defineEmits<{
  (e: 'edit', post: PostResponse): void
  (e: 'delete', post: PostResponse): void
}>()

const authStore = useAuthStore()
const boardStore = useBoardStore()
const router = useRouter()
const { getTopicColor } = useTopicColor()
const { formatDate } = useFormatDate()

const topicColor = computed(() => getTopicColor(props.post.topicId))
const formattedDate = computed(() => formatDate(props.post.createdAt))
const canEdit = computed(() => authStore.canEdit(props.post.userId))

function handleTopicClick(): void {
  if (props.post.topicId) {
    boardStore.selectedTopicId = props.post.topicId
    router.push({ path: '/', query: { topic: String(props.post.topicId) } })
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
