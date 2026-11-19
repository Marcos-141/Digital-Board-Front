<template>
  <div class="board-toolbar d-flex flex-wrap align-center justify-space-between mb-4 ga-3">
    <!-- Title and Counter Chips -->
    <div class="d-flex align-center flex-wrap ga-2">
      <h1 class="text-h5 text-sm-h4 font-weight-bold mb-0">
        Muro Colaborativo
      </h1>

      <v-chip size="small" variant="tonal" color="primary" class="font-weight-bold">
        {{ totalPostsText }}
      </v-chip>

      <v-chip size="small" variant="tonal" color="secondary-darken-1" class="font-weight-bold">
        {{ totalTopicsText }}
      </v-chip>
    </div>

    <!-- View Toggle -->
    <div class="d-flex align-center ga-2">
      <!-- Grid / List View Toggle -->
      <v-btn-toggle
        :model-value="boardStore.viewMode"
        mandatory
        rounded="xl"
        density="compact"
        color="primary"
        class="border-soft"
        aria-label="Selector de vista"
        @update:model-value="(val) => boardStore.setViewMode(val)"
      >
        <v-btn value="grid" icon="mdi-view-grid-outline" aria-label="Vista cuadrícula" />
        <v-btn value="list" icon="mdi-view-agenda-outline" aria-label="Vista lista" />
      </v-btn-toggle>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useBoardStore } from '~/stores/board'

const props = defineProps<{
  totalPosts: number
  totalTopics: number
}>()

const boardStore = useBoardStore()

const totalPostsText = computed(() => {
  if (props.totalPosts === 1) return '1 publicación'
  return `${props.totalPosts} publicaciones`
})

const totalTopicsText = computed(() => {
  if (props.totalTopics === 1) return '1 temática'
  return `${props.totalTopics} temáticas`
})

</script>
