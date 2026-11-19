<template>
  <v-card
    class="rounded-card border-soft pa-8 text-center d-flex flex-column align-center justify-center elevation-0 my-4"
    color="surface"
  >
    <v-avatar color="error" variant="tonal" size="64" class="mb-4">
      <v-icon :icon="icon || 'mdi-alert-circle-outline'" size="32" color="error" />
    </v-avatar>

    <h3 class="text-h6 font-weight-bold mb-2">
      {{ title || 'Ocurrió un inconveniente' }}
    </h3>

    <p class="text-body-2 text-muted mb-6" style="max-width: 480px;">
      {{ message || 'No pudimos completar la operación. Por favor verifica tu conexión y vuelve a intentarlo.' }}
    </p>

    <slot name="action">
      <v-btn
        v-if="actionLabel !== ''"
        color="primary"
        variant="flat"
        prepend-icon="mdi-refresh"
        rounded="xl"
        class="text-none font-weight-bold px-6"
        @click="$emit('action')"
      >
        {{ actionLabel || 'Reintentar' }}
      </v-btn>
    </slot>
  </v-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message?: string
    icon?: string
    actionLabel?: string
  }>(),
  {
    title: 'Ocurrió un inconveniente',
    message: 'No pudimos completar la operación. Por favor verifica tu conexión y vuelve a intentarlo.',
    icon: 'mdi-alert-circle-outline',
    actionLabel: 'Reintentar',
  }
)

defineEmits<{
  (e: 'action'): void
}>()
</script>
