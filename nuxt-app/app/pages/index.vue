<template>
  <v-container class="py-6 max-w-1400">
    <!-- Header Banner / Toolbar -->
    <BoardToolbar />

    <!-- Filter Bar -->
    <BoardFilterBar />

    <!-- Main Grid / List of Posts -->
    <BoardGrid />

    <!-- Modals -->
    <PostCreateModal />
    <PostDetailModal />
  </v-container>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Tablero Digital - Muro Educativo Colaborativo',
  description: 'Muro interactivo para realizar preguntas y resolver dudas de tus compañeros en matemáticas, historia, ciencias, lengua y más.',
})
</script>

<style scoped>
.max-w-1400 {
  max-width: 1400px;
}
</style>