<template>
  <v-card
    class="loading-state-card rounded-xl pa-8 text-center d-flex flex-column align-center justify-center elevation-1"
    :style="{ minHeight: `${height}px` }"
    color="surface"
  >
    <div class="loading-spinner-wrapper mb-4">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
        width="5"
      />
      <v-icon
        color="primary-darken-1"
        size="28"
        class="spinner-center-icon"
      >
        mdi-school-outline
      </v-icon>
    </div>

    <h3 class="text-h6 font-weight-bold text-color3 mb-2">
      {{ title }}
    </h3>
    <p class="text-body-2 text-color3-light text-center max-w-400">
      {{ message }}
    </p>

    <v-row class="w-100 mt-6" dense>
      <v-col v-for="i in 3" :key="i" cols="12" md="4">
        <v-skeleton-loader
          type="article"
          class="rounded-lg border-subtle"
          elevation="0"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message?: string
    height?: number
  }>(),
  {
    title: 'Cargando Tablero Digital...',
    message: 'Obteniendo las preguntas y respuestas más recientes de la comunidad educativa.',
    height: 320,
  }
)
</script>

<style scoped>
.loading-state-card {
  border: 1px solid rgba(161, 193, 190, 0.3);
  background-color: #ffffff;
}

.loading-spinner-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spinner-center-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.text-color3 {
  color: #59554e !important;
}

.text-color3-light {
  color: rgba(89, 85, 78, 0.75) !important;
}

.max-w-400 {
  max-width: 400px;
  margin: 0 auto;
}

.border-subtle {
  border: 1px solid #e2e3d9 !important;
}
</style>
