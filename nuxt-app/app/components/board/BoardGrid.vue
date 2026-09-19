<template>
  <div class="board-grid-wrapper">
    <!-- Empty State -->
    <v-card
      v-if="filteredPosts.length === 0"
      class="rounded-xl pa-10 text-center bg-white border-subtle elevation-1 my-6"
    >
      <v-avatar color="secondary" size="72" class="mb-4">
        <v-icon color="#59554e" size="36">mdi-text-search-of-file-outline</v-icon>
      </v-avatar>
      <h3 class="text-h6 font-weight-bold text-color3 mb-2">
        No se encontraron preguntas
      </h3>
      <p class="text-body-2 text-color3-muted max-w-400 mb-6">
        No hay ninguna duda publicada que coincida con los criterios de búsqueda o filtros seleccionados.
      </p>
      <div class="d-flex align-center justify-center ga-3">
        <v-btn
          color="primary"
          variant="outlined"
          rounded="xl"
          class="text-none font-weight-bold"
          prepend-icon="mdi-filter-off-outline"
          @click="resetFilters"
        >
          Limpiar Filtros
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          rounded="xl"
          class="text-none font-weight-bold btn-create"
          prepend-icon="mdi-plus"
          @click="openCreateModal"
        >
          Publicar Nueva Pregunta
        </v-btn>
      </div>
    </v-card>

    <!-- Grid Layout Mode (Padlet Style Masonry Grid) -->
    <v-row v-else-if="viewMode === 'grid'" dense>
      <v-col
        v-for="post in filteredPosts"
        :key="post.id"
        cols="12"
        sm="6"
        lg="4"
        class="pb-4"
      >
        <PostCard :post="post" />
      </v-col>
    </v-row>

    <!-- List Layout Mode -->
    <div v-else class="d-flex flex-column ga-4">
      <PostCard
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
        is-list-view
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { filteredPosts, openCreateModal } = usePost()
const { viewMode, resetFilters } = useBoard()
</script>

<style scoped>
.border-subtle {
  border: 1px solid #e2e3d9 !important;
}

.text-color3 {
  color: #59554e !important;
}

.text-color3-muted {
  color: rgba(89, 85, 78, 0.75) !important;
}

.max-w-400 {
  max-width: 400px;
  margin: 0 auto;
}

.btn-create {
  background-color: #a1c1be !important;
  color: #2c3534 !important;
}
</style>
