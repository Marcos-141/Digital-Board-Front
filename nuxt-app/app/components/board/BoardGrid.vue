<template>
  <div class="board-grid-wrapper">
    <!-- Grid View -->
    <v-row v-if="viewMode === 'grid'">
      <v-col
        v-for="post in posts"
        :key="post.postId"
        cols="12"
        sm="6"
        lg="4"
        class="d-flex"
      >
        <PostCard
          :post="post"
          :is-list-view="false"
          class="w-100"
          @edit="$emit('edit', post)"
          @delete="$emit('delete', post)"
        />
      </v-col>
    </v-row>

    <!-- List View -->
    <div v-else class="d-flex flex-column ga-4">
      <div v-for="post in posts" :key="post.postId">
        <PostCard
          :post="post"
          :is-list-view="true"
          @edit="$emit('edit', post)"
          @delete="$emit('delete', post)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostResponse } from '~/types/api'
import type { BoardViewMode } from '~/types/domain'

defineProps<{
  posts: PostResponse[]
  viewMode: BoardViewMode
}>()

defineEmits<{
  (e: 'edit', post: PostResponse): void
  (e: 'delete', post: PostResponse): void
}>()
</script>
