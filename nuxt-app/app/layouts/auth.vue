<template>
  <div class="auth-layout min-vh-100 d-flex flex-column justify-space-between pa-4">
    <div class="text-center pt-6 pb-4">
      <NuxtLink to="/" class="d-inline-flex align-center text-decoration-none">
        <v-avatar color="primary" size="44" class="mr-2">
          <v-icon color="on-primary" size="26">mdi-bulletin-board</v-icon>
        </v-avatar>
        <div class="text-left">
          <span class="text-h5 font-weight-bold" style="line-height: 1.2;">
            Tablero<span class="text-primary-darken-1 font-weight-black">Digital</span>
          </span>
          <div class="text-caption text-muted">Muro educativo colaborativo</div>
        </div>
      </NuxtLink>
    </div>

    <v-main class="d-flex align-center justify-center py-4">
      <v-container style="max-width: 960px;">
        <slot />
      </v-container>
    </v-main>

    <footer class="text-center py-4 text-caption text-muted">
      © {{ currentYear }} Tablero Digital • Organización y debate estructurado
    </footer>
  </div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background-color: var(--db-bg);
}
</style>
