<template>
  <div class="image-preview-wrapper overflow-hidden rounded-lg">
    <template v-if="src && !hasError">
      <v-img
        :src="src"
        :alt="alt"
        :aspect-ratio="aspectRatio"
        cover
        loading="lazy"
        referrerpolicy="no-referrer"
        class="bg-grey-lighten-3 cursor-pointer"
        @error="hasError = true"
        @click="zoomable ? (dialogOpen = true) : undefined"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
            <v-progress-circular indeterminate color="primary" size="24" width="2" />
          </div>
        </template>
      </v-img>

      <v-dialog v-if="zoomable" v-model="dialogOpen" max-width="900px">
        <v-card class="pa-2 rounded-xl bg-black position-relative text-center">
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            class="position-absolute"
            style="top: 8px; right: 8px; z-index: 10;"
            aria-label="Cerrar imagen ampliada"
            @click="dialogOpen = false"
          />
          <v-img
            :src="src"
            :alt="alt"
            contain
            max-height="85vh"
            referrerpolicy="no-referrer"
          />
        </v-card>
      </v-dialog>
    </template>

    <div
      v-else-if="fallback"
      class="fallback-placeholder d-flex flex-column align-center justify-center pa-4 text-center bg-grey-lighten-4 text-muted border-soft rounded-lg"
      :style="{ minHeight: fallbackHeight }"
    >
      <v-icon icon="mdi-image-off-outline" size="28" class="mb-1" />
      <span class="text-caption">Imagen no disponible</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src?: string | null
    alt: string
    aspect?: number | string
    fallback?: boolean
    zoomable?: boolean
    fallbackHeight?: string
  }>(),
  {
    src: null,
    aspect: 16 / 9,
    fallback: true,
    zoomable: false,
    fallbackHeight: '120px',
  }
)

const hasError = ref(false)
const dialogOpen = ref(false)

watch(
  () => props.src,
  () => {
    hasError.value = false
  }
)

const aspectRatio = computed(() => {
  if (typeof props.aspect === 'number') return props.aspect
  return 16 / 9
})
</script>
