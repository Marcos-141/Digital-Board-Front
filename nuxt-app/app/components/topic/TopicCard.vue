<template>
  <v-card
    class="rounded-card border-soft overflow-hidden card-interactive d-flex flex-column fill-height"
    color="surface"
    elevation="0"
    :to="`/topics/${topic.id}`"
  >
    <!-- Top colored bar -->
    <div
      class="topic-color-bar"
      :style="{ backgroundColor: topicColor, height: '6px' }"
    />

    <v-card-text class="pa-5 d-flex flex-column flex-grow-1">
      <div class="d-flex align-start justify-space-between mb-2">
        <h3 class="text-h6 font-weight-bold text-truncate" :title="topic.name">
          {{ topic.name }}
        </h3>

        <!-- Admin actions menu -->
        <div v-if="authStore.canManageTopics" class="ml-2" @click.prevent.stop>
          <v-menu location="bottom end">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-dots-vertical"
                variant="text"
                size="small"
                aria-label="Opciones de temática"
              />
            </template>
            <v-card class="rounded-lg pa-1 border-soft" elevation="3">
              <v-list density="compact" nav class="pa-0">
                <v-list-item
                  prepend-icon="mdi-pencil-outline"
                  title="Editar temática"
                  @click="$emit('edit', topic)"
                />
                <v-list-item
                  prepend-icon="mdi-delete-outline"
                  title="Eliminar temática"
                  color="error"
                  @click="$emit('delete', topic)"
                />
              </v-list>
            </v-card>
          </v-menu>
        </div>
      </div>

      <p class="text-body-2 text-muted user-content line-clamp-3 mb-4 flex-grow-1">
        {{ topic.description }}
      </p>

      <div class="d-flex align-center justify-space-between pt-3 border-t">
        <div class="d-flex align-center text-caption text-muted">
          <v-icon size="16" icon="mdi-file-document-outline" class="mr-1" />
          <span>{{ countText }}</span>
        </div>

        <span class="text-caption font-weight-bold text-primary-darken-1 d-inline-flex align-center">
          Ver publicaciones
          <v-icon size="14" icon="mdi-chevron-right" class="ml-1" />
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useTopicColor } from '~/composables/useTopicColor'
import { useAuthStore } from '~/stores/auth'
import type { Topic } from '~/types/domain'

const props = defineProps<{
  topic: Topic
  postCount?: number | null
}>()

defineEmits<{
  (e: 'edit', topic: Topic): void
  (e: 'delete', topic: Topic): void
}>()

const authStore = useAuthStore()
const { getTopicColor } = useTopicColor()

const topicColor = computed(() => getTopicColor(props.topic.id))

const countText = computed(() => {
  if (props.postCount === null || props.postCount === undefined) {
    return 'Publicaciones'
  }
  if (props.postCount === 1) {
    return '1 publicación'
  }
  return `${props.postCount} publicaciones`
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
