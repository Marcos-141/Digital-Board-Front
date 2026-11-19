<template>
  <v-snackbar
    v-model="state.show"
    :color="snackbarColor"
    :timeout="state.timeout"
    location="top right"
    rounded="xl"
    elevation="4"
  >
    <div class="d-flex align-center">
      <v-icon :icon="icon" class="mr-2" />
      <span>{{ state.message }}</span>
    </div>

    <template #actions>
      <v-btn
        variant="text"
        icon="mdi-close"
        size="small"
        aria-label="Cerrar notificación"
        @click="close"
      />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useNotify } from '~/composables/useNotify'

const { state, close } = useNotify()

const snackbarColor = computed(() => {
  switch (state.type) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
    default:
      return 'info'
  }
})

const icon = computed(() => {
  switch (state.type) {
    case 'success':
      return 'mdi-check-circle-outline'
    case 'error':
      return 'mdi-alert-circle-outline'
    case 'warning':
      return 'mdi-alert-outline'
    case 'info':
    default:
      return 'mdi-information-outline'
  }
})
</script>
