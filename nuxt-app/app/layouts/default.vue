<template>
  <div class="layout-wrapper">
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
    <AppHeader />
    <v-main id="main-content" class="main-canvas pb-12">
      <v-container class="max-w-1400 px-4 px-sm-6 pt-6">
        <slot />
      </v-container>
    </v-main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-canvas {
  flex: 1;
  background-color: var(--db-bg);
}

.max-w-1400 {
  max-width: 1400px;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 16px;
  background: var(--db-primary);
  color: var(--db-text);
  padding: 8px 16px;
  border-radius: 8px;
  z-index: 9999;
  font-weight: bold;
  text-decoration: none;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 16px;
}
</style>
