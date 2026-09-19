<template>
  <footer class="app-footer mt-12 py-8">
    <v-container class="max-w-1400">
      <v-row align="center" justify="space-between" dense>
        <v-col cols="12" md="5" class="mb-4 mb-md-0">
          <div class="d-flex align-center mb-2">
            <v-avatar color="primary" size="32" class="mr-2">
              <v-icon color="#2c3534" size="18">mdi-school</v-icon>
            </v-avatar>
            <span class="text-h6 font-weight-bold text-color3">
              Tablero<span style="color: #7bb0a6">Digital</span>
            </span>
          </div>
          <p class="text-body-2 text-color3-muted max-w-450 mb-0">
            Muro colaborativo educativo interactivo para estudiantes y tutores. Combina tarjetas dinámicas de aprendizaje con la resolución participativa de dudas académicas.
          </p>
        </v-col>

        <v-col cols="12" sm="6" md="4" class="mb-4 mb-sm-0">
          <div class="d-flex flex-wrap ga-4 text-body-2 font-weight-medium text-color3">
            <NuxtLink to="/" class="footer-link">Muro Principal</NuxtLink>
            <NuxtLink to="/profile" class="footer-link">Perfil y Medallas</NuxtLink>
            <a href="#" @click.prevent class="footer-link">Normas de la Comunidad</a>
            <a href="#" @click.prevent class="footer-link">Guía de Puntos</a>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="text-sm-right">
          <v-chip
            color="success"
            size="small"
            variant="flat"
            class="font-weight-bold mb-2"
          >
            <v-icon start size="12">mdi-circle</v-icon>
            Comunidad Educativa Activa
          </v-chip>
          <div class="text-caption text-color3-muted">
            © {{ new Date().getFullYear() }} Tablero Digital. Todos los derechos reservados.
          </div>
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
// Basic footer component
</script>

<style scoped>
.app-footer {
  background-color: #e2e3d9 !important;
  border-top: 1px solid #d4d5ca;
}

.max-w-1400 {
  max-width: 1400px;
}

.max-w-450 {
  max-width: 450px;
}

.text-color3 {
  color: #59554e !important;
}

.text-color3-muted {
  color: rgba(89, 85, 78, 0.8) !important;
}

.footer-link {
  color: #59554e;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #7bb0a6;
  text-decoration: underline;
}
</style>
