<template>
  <v-card
    class="rounded-card border-soft pa-8 text-center d-flex flex-column align-center justify-center elevation-0 my-4"
    color="surface"
  >
    <v-avatar color="secondary" size="64" class="mb-4">
      <v-icon :icon="icon || 'mdi-inbox-outline'" size="32" color="on-secondary" />
    </v-avatar>

    <h3 class="text-h6 font-weight-bold mb-2">
      {{ title }}
    </h3>

    <p v-if="message" class="text-body-2 text-muted mb-6" style="max-width: 460px;">
      {{ message }}
    </p>

    <slot name="action">
      <v-btn
        v-if="actionLabel"
        color="primary"
        variant="flat"
        rounded="xl"
        class="text-none font-weight-bold px-6"
        @click="$emit('action')"
      >
        {{ actionLabel }}
      </v-btn>
    </slot>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message?: string
  icon?: string
  actionLabel?: string
}>()

defineEmits<{
  (e: 'action'): void
}>()
</script>
