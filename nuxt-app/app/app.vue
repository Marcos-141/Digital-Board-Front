<template>
  <v-app class="tablero-digital-app">
    <AppHeader />
    <v-main class="main-content">
      <NuxtPage />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Tablero Digital` : 'Tablero Digital - Muro Educativo Colaborativo'
  },
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

<style>
/* Global Palette & Canvas Variables */
:root {
  --color-surface: #ffffff;
  --color-accent: #a1c1be;
  --color-text-primary: #59554e;
  --color-bg-canvas: #f3f4e5;
  --color-surface-sec: #e2e3d9;
}

html, body {
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
  background-color: #f3f4e5 !important;
  color: #59554e !important;
  margin: 0;
  padding: 0;
  scroll-behavior: smooth;
}

.v-application {
  font-family: 'Outfit', sans-serif !important;
  background-color: #f3f4e5 !important;
  color: #59554e !important;
}

.main-content {
  background-color: #f3f4e5 !important;
  min-height: calc(100vh - 72px - 140px);
}

/* Custom scrollbars */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #f3f4e5;
}
::-webkit-scrollbar-thumb {
  background: #a1c1be;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #7bb0a6;
}
</style>