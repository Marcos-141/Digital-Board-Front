<template>
  <v-dialog
    v-model="state.show"
    max-width="480px"
    persistent
    role="alertdialog"
    aria-labelledby="confirm-dialog-title"
    aria-describedby="confirm-dialog-desc"
  >
    <v-card class="rounded-card border-soft pa-4">
      <v-card-title id="confirm-dialog-title" class="d-flex align-center font-weight-bold text-h6">
        <v-icon
          :icon="state.destructive ? 'mdi-alert-octagon-outline' : 'mdi-help-circle-outline'"
          :color="state.destructive ? 'error' : 'primary'"
          class="mr-2"
        />
        {{ state.title }}
      </v-card-title>

      <v-card-text id="confirm-dialog-desc" class="pt-2 text-body-1 user-content">
        {{ state.message }}
      </v-card-text>

      <v-card-actions class="justify-end pt-4">
        <v-btn
          variant="tonal"
          rounded="xl"
          class="text-none px-4"
          @click="handleCancel"
        >
          {{ state.cancelText }}
        </v-btn>
        <v-btn
          :color="state.destructive ? 'error' : 'primary'"
          variant="flat"
          rounded="xl"
          class="text-none px-4 font-weight-bold"
          @click="handleConfirm"
        >
          {{ state.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useConfirm } from '~/composables/useConfirm'

const { state, handleConfirm, handleCancel } = useConfirm()
</script>
