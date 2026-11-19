<template>
  <footer class="app-footer border-t bg-surface py-8">
    <v-container class="max-w-1400">
      <v-row>
        <!-- Brand Info -->
        <v-col cols="12" md="5" class="mb-4 mb-md-0">
          <div class="d-flex align-center mb-2">
            <v-avatar color="primary" size="32" class="mr-2">
              <v-icon color="on-primary" size="18">mdi-bulletin-board</v-icon>
            </v-avatar>
            <span class="text-h6 font-weight-bold">
              Tablero<span class="text-primary-darken-1">Digital</span>
            </span>
          </div>
          <p class="text-body-2 text-muted mb-3" style="max-width: 380px;">
            Plataforma de comunicación y gestión de contenido colaborativo para aulas virtuales, equipos y comunidades de aprendizaje.
          </p>

          <!-- API Health Status -->
          <div class="d-inline-flex align-center bg-grey-lighten-4 rounded-pill px-3 py-1 border-soft">
            <span
              class="status-indicator-dot mr-2"
              :class="apiConnected ? 'dot-online' : 'dot-offline'"
            />
            <span class="text-caption font-weight-medium">
              {{ apiConnected ? 'Servidor conectado' : 'Sin conexión con el servidor' }}
            </span>
            <v-btn
              icon="mdi-refresh"
              size="x-small"
              variant="text"
              class="ml-1"
              :loading="checkingHealth"
              aria-label="Reintentar conexión con la API"
              @click="checkApiHealth"
            />
          </div>
        </v-col>

        <!-- Navigation Links -->
        <v-col cols="6" sm="3" md="3" offset-md="1">
          <div class="text-subtitle-2 font-weight-bold mb-3">Navegación</div>
          <ul class="list-unstyled pa-0 ma-0">
            <li class="mb-2">
              <NuxtLink to="/" class="footer-link text-body-2 text-muted">
                Muro colaborativo
              </NuxtLink>
            </li>
            <li class="mb-2">
              <NuxtLink to="/topics" class="footer-link text-body-2 text-muted">
                Temáticas
              </NuxtLink>
            </li>
            <li class="mb-2">
              <NuxtLink to="/users" class="footer-link text-body-2 text-muted">
                Directorio de miembros
              </NuxtLink>
            </li>
          </ul>
        </v-col>

        <!-- Project Info -->
        <v-col cols="6" sm="3" md="3">
          <div class="text-subtitle-2 font-weight-bold mb-3">Plataforma</div>
          <p class="text-caption text-muted mb-2">
            Organización estructurada por temáticas con trazabilidad de autoría.
          </p>
          <p class="text-caption text-muted mb-0">
            © {{ currentYear }} Tablero Digital. Todos los derechos reservados.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
import { topicsApi } from '~/api/topics.api'

const currentYear = new Date().getFullYear()
const apiConnected = ref(true)
const checkingHealth = ref(false)

async function checkApiHealth(): Promise<void> {
  checkingHealth.value = true
  try {
    await topicsApi.list()
    apiConnected.value = true
  } catch {
    apiConnected.value = false
  } finally {
    checkingHealth.value = false
  }
}

onMounted(() => {
  checkApiHealth()
})
</script>

<style scoped>
.max-w-1400 {
  max-width: 1400px;
}

.list-unstyled {
  list-style: none;
}

.footer-link {
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--db-primary-dark) !important;
}

.status-indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot-online {
  background-color: #4caf50;
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.6);
}

.dot-offline {
  background-color: #e53935;
  box-shadow: 0 0 6px rgba(229, 57, 53, 0.6);
}
</style>
