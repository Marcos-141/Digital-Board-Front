<template>
  <v-card class="board-toolbar-card rounded-xl pa-6 mb-6 elevation-1">
    <v-row align="center" justify="space-between" dense>
      <v-col cols="12" md="7">
        <div class="d-flex align-center flex-wrap ga-3 mb-2">
          <h1 class="text-h5 text-sm-h4 font-weight-black text-color3">
            Muro Colaborativo
          </h1>

          <v-chip
            color="primary"
            variant="flat"
            size="small"
            class="font-weight-bold"
          >
            <v-icon start size="14">mdi-help-box</v-icon>
            {{ totalPosts }} Dudas Publicadas
          </v-chip>

          <v-chip
            color="success"
            variant="tonal"
            size="small"
            class="font-weight-bold"
          >
            <v-icon start size="14">mdi-check-decagram</v-icon>
            {{ resolvedPostsCount }} Resueltas
          </v-chip>
        </div>

        <p class="text-body-2 text-color3-muted mb-0">
          Explora preguntas de tus compañeros, aporta tus respuestas para ganar reputación o publica nuevas dudas académicas.
        </p>
      </v-col>

      <v-col cols="12" md="5" class="d-flex align-center justify-start justify-md-end flex-wrap ga-3 mt-4 mt-md-0">
        <!-- View Mode Switcher -->
        <v-btn-toggle
          :model-value="viewMode"
          mandatory
          rounded="xl"
          density="comfortable"
          color="primary"
          variant="outlined"
          class="view-toggle"
          @update:model-value="toggleViewMode"
        >
          <v-btn value="grid" icon="mdi-view-grid-outline" title="Vista de Muro (Grid)" />
          <v-btn value="list" icon="mdi-view-headline" title="Vista de Lista" />
        </v-btn-toggle>

        <!-- Create Question Button -->
        <v-btn
          color="primary"
          variant="flat"
          rounded="xl"
          size="large"
          class="font-weight-bold text-none elevation-2 btn-create"
          prepend-icon="mdi-plus-circle"
          @click="openCreateModal"
        >
          Publicar Pregunta
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
const { viewMode, toggleViewMode } = useBoard()
const { posts, openCreateModal } = usePost()

const totalPosts = computed(() => posts.value.length)
const resolvedPostsCount = computed(() => posts.value.filter((p) => p.status === 'resuelto').length)
</script>

<style scoped>
.board-toolbar-card {
  background-color: #ffffff;
  border: 1px solid #e2e3d9;
}

.text-color3 {
  color: #59554e !important;
}

.text-color3-muted {
  color: rgba(89, 85, 78, 0.75) !important;
}

.view-toggle :deep(.v-btn) {
  border-color: #e2e3d9 !important;
}

.btn-create {
  background-color: #a1c1be !important;
  color: #2c3534 !important;
}
</style>
