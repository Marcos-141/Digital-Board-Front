<template>
  <v-app class="tablero-digital-app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Global Dialogs & Notifications -->
    <AppSnackbar />
    <AppConfirmDialog />

    <!-- Global New Post Dialog (triggered via usePostDialog) -->
    <ClientOnly>
      <PostFormDialog
        v-if="isOpen"
        v-model="isOpen"
        :locked-topic-id="targetTopicId || undefined"
      />
    </ClientOnly>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useBoardStore } from '~/stores/board'
import { usePostDialog } from '~/composables/usePostDialog'

const authStore = useAuthStore()
const boardStore = useBoardStore()
const { isOpen, targetTopicId } = usePostDialog()

// Initialize auth session and board settings on app load
onMounted(async () => {
  await authStore.initSession()
  boardStore.initViewMode()
})

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Tablero Digital` : 'Tablero Digital - Muro Colaborativo'
  },
  htmlAttrs: {
    lang: 'es',
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      name: 'description',
      content: 'Plataforma colaborativa y tablón de anuncios estructurado para comunidades de aprendizaje y equipos.',
    },
  ],
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: '',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap',
    },
  ],
})
</script>
