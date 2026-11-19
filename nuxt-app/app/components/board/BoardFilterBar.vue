<template>
  <div class="board-filter-bar mb-6">
    <!-- Topics Chip Carousel / Horizontal Scroll -->
    <div class="topics-chip-row d-flex align-center ga-2 overflow-x-auto pb-2 mb-3">
      <!-- "Todas" chip -->
      <v-chip
        :variant="boardStore.selectedTopicId === null ? 'flat' : 'outlined'"
        :color="boardStore.selectedTopicId === null ? 'primary' : undefined"
        rounded="pill"
        size="small"
        class="font-weight-bold flex-shrink-0"
        @click="boardStore.selectedTopicId = null"
      >
        Todas las temáticas
      </v-chip>

      <!-- Topic chips -->
      <TopicChip
        v-for="topic in topicsStore.topics"
        :key="topic.id"
        :topic-id="topic.id"
        :name="topic.name"
        :variant="boardStore.selectedTopicId === topic.id ? 'flat' : 'tonal'"
        size="small"
        class="flex-shrink-0 cursor-pointer"
        @click="handleSelectTopic(topic.id)"
      />
    </div>

    <!-- Secondary Filters Row (Search summary, Author select, Sort select, Clear filters) -->
    <v-row dense align="center">
      <!-- Author filter -->
      <v-col cols="12" sm="5" md="4">
        <v-select
          v-model="boardStore.selectedAuthorId"
          :items="authorOptions"
          item-title="name"
          item-value="id"
          label="Filtrar por autor"
          density="compact"
          variant="outlined"
          rounded="xl"
          hide-details
          clearable
        />
      </v-col>

      <!-- Sort by select -->
      <v-col cols="12" sm="5" md="4">
        <v-select
          v-model="boardStore.sortBy"
          :items="sortOptions"
          item-title="label"
          item-value="value"
          label="Ordenar por"
          density="compact"
          variant="outlined"
          rounded="xl"
          hide-details
        />
      </v-col>

      <!-- Active filters & Clear button -->
      <v-col cols="12" sm="2" md="4" class="d-flex align-center justify-sm-end mt-2 mt-sm-0">
        <v-btn
          v-if="boardStore.hasActiveFilters"
          variant="text"
          color="primary-darken-1"
          size="small"
          rounded="xl"
          prepend-icon="mdi-filter-remove-outline"
          class="text-none font-weight-bold"
          @click="boardStore.resetFilters()"
        >
          Limpiar filtros
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useBoardStore } from '~/stores/board'
import { useTopicsStore } from '~/stores/topics'
import type { PostResponse } from '~/types/api'
import type { BoardSortOption } from '~/types/domain'

const props = defineProps<{
  posts: PostResponse[]
}>()

const boardStore = useBoardStore()
const topicsStore = useTopicsStore()

const sortOptions: { label: string; value: BoardSortOption }[] = [
  { label: 'Más recientes', value: 'recent' },
  { label: 'Más antiguas', value: 'oldest' },
  { label: 'Título A–Z', value: 'title_asc' },
]

const authorOptions = computed(() => {
  const map = new Map<number, string>()
  for (const p of props.posts) {
    if (p.userId && p.userName) {
      map.set(p.userId, p.userName)
    }
  }
  return Array.from(map.entries()).map(([id, name]) => ({
    id,
    name,
  }))
})

function handleSelectTopic(id: number): void {
  if (boardStore.selectedTopicId === id) {
    boardStore.selectedTopicId = null
  } else {
    boardStore.selectedTopicId = id
  }
}
</script>

<style scoped>
.topics-chip-row::-webkit-scrollbar {
  height: 4px;
}
</style>
