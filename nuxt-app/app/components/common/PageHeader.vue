<template>
  <div class="page-header d-flex flex-wrap align-center justify-space-between mb-6 pb-2 border-bottom">
    <div class="d-flex align-center">
      <v-btn
        v-if="backTo"
        :to="backTo"
        icon="mdi-arrow-left"
        variant="tonal"
        size="small"
        rounded="xl"
        class="mr-3"
        aria-label="Volver"
      />
      <div>
        <h1 class="text-h5 text-sm-h4 font-weight-bold mb-1">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="text-body-2 text-muted mb-0">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <div v-if="$slots.actions" class="mt-3 mt-sm-0 d-flex align-center ga-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  backTo?: string
}>()
</script>
