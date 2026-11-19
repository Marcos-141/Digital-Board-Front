<template>
  <v-card
    class="rounded-card border-soft pa-8 text-center d-flex flex-column align-center justify-center elevation-0"
    :style="{ minHeight: `${height}px` }"
    color="surface"
  >
    <div class="position-relative d-inline-flex align-center justify-center mb-4">
      <v-progress-circular
        color="primary"
        indeterminate
        size="56"
        width="4"
      />
      <v-icon
        color="primary-darken-1"
        size="24"
        class="position-absolute"
      >
        mdi-bulletin-board
      </v-icon>
    </div>

    <h3 class="text-h6 font-weight-bold mb-2">
      {{ title }}
    </h3>
    <p class="text-body-2 text-muted text-center" style="max-width: 420px;">
      {{ message }}
    </p>

    <v-row v-if="showSkeletons" class="w-100 mt-6" dense>
      <v-col v-for="i in skeletonCount" :key="i" cols="12" sm="6" md="4">
        <v-skeleton-loader
          type="article"
          class="rounded-xl border-soft"
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
    showSkeletons?: boolean
    skeletonCount?: number
  }>(),
  {
    title: 'Cargando contenido...',
    message: 'Estamos consultando la información más reciente del servidor.',
    height: 300,
    showSkeletons: true,
    skeletonCount: 3,
  }
)
</script>
