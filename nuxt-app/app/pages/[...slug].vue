<template>
  <div class="not-found-page py-12 text-center">
    <v-card class="rounded-card border-soft pa-8 pa-sm-12 max-w-600 mx-auto" color="surface" elevation="0">
      <v-avatar color="primary" variant="tonal" size="80" class="mb-4">
        <v-icon icon="mdi-compass-off-outline" size="44" color="primary-darken-1" />
      </v-avatar>

      <h1 class="text-h4 font-weight-bold mb-2">
        Página no encontrada (404)
      </h1>

      <p class="text-body-1 text-muted mb-6">
        La ruta que intentas visitar no existe, cambió de dirección o fue eliminada.
      </p>

      <v-btn
        to="/"
        color="primary"
        variant="flat"
        rounded="xl"
        size="large"
        class="text-none font-weight-bold px-8"
        prepend-icon="mdi-home-outline"
      >
        Volver al muro principal
      </v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Página no encontrada',
  description: 'La página solicitada no fue encontrada en Tablero Digital.',
})
</script>

<style scoped>
.max-w-600 {
  max-width: 600px;
}
</style>
