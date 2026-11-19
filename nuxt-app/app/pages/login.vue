<template>
  <div class="login-page">
    <v-card class="rounded-card border-soft elevation-2 overflow-hidden mx-auto" max-width="840">
      <v-row no-gutters>
        <!-- Descriptive Side Panel (Desktop only) -->
        <v-col
          cols="12"
          md="5"
          class="d-none d-md-flex flex-column justify-space-between pa-8 bg-surface-variant text-on-surface"
        >
          <div>
            <div class="d-flex align-center mb-4">
              <v-avatar color="primary" size="36" class="mr-2">
                <v-icon color="on-primary" size="20">mdi-bulletin-board</v-icon>
              </v-avatar>
              <span class="text-subtitle-1 font-weight-bold">Tablero Digital</span>
            </div>

            <h2 class="text-h6 font-weight-bold mb-3">
              Organiza la conversación de tu comunidad
            </h2>
            <p class="text-body-2 text-muted mb-4">
              Evita que los anuncios, debates y recursos clave se pierdan en chats informales. Centraliza ideas en un tablón temático claro y estructurado.
            </p>

            <ul class="text-body-2 text-muted pa-0 ma-0" style="list-style: none;">
              <li class="d-flex align-center mb-2">
                <v-icon color="primary-darken-1" size="18" class="mr-2">mdi-check-circle-outline</v-icon>
                <span>Temáticas organizadas y categorizadas</span>
              </li>
              <li class="d-flex align-center mb-2">
                <v-icon color="primary-darken-1" size="18" class="mr-2">mdi-check-circle-outline</v-icon>
                <span>Trazabilidad de autoría en cada publicación</span>
              </li>
              <li class="d-flex align-center">
                <v-icon color="primary-darken-1" size="18" class="mr-2">mdi-check-circle-outline</v-icon>
                <span>Comentarios y debates en contexto</span>
              </li>
            </ul>
          </div>

          <div class="pt-6 border-t">
            <span class="text-caption text-muted">¿Solo quieres ver el contenido?</span>
            <div>
              <NuxtLink to="/" class="text-caption font-weight-bold text-decoration-none">
                Explorar el muro sin cuenta →
              </NuxtLink>
            </div>
          </div>
        </v-col>

        <!-- Form Card (Login / Register Tabs) -->
        <v-col cols="12" md="7" class="pa-6 pa-sm-8 bg-surface">
          <div class="mb-4">
            <v-tabs
              v-model="activeTab"
              color="primary"
              align-tabs="start"
              grow
              class="border-b"
            >
              <v-tab value="login" class="text-none font-weight-bold">
                Iniciar sesión
              </v-tab>
              <v-tab value="register" class="text-none font-weight-bold">
                Registrarse
              </v-tab>
            </v-tabs>
          </div>

          <v-window v-model="activeTab">
            <!-- Tab Iniciar Sesión -->
            <v-window-item value="login" class="pt-2">
              <LoginForm @success="handleSuccess" />
            </v-window-item>

            <!-- Tab Registrarse -->
            <v-window-item value="register" class="pt-2">
              <RegisterForm @success="handleSuccess" />
            </v-window-item>
          </v-window>

          <!-- Mobile Explore Link -->
          <div class="d-md-none text-center pt-4 border-t mt-4">
            <NuxtLink to="/" class="text-caption font-weight-bold text-muted text-decoration-none">
              Explorar el muro sin cuenta →
            </NuxtLink>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useSeoMeta({
  title: 'Acceso a la plataforma',
  description: 'Inicia sesión o regístrate en Tablero Digital para participar activamente.',
})

const route = useRoute()
const activeTab = ref<'login' | 'register'>('login')

// Support ?tab=register in query string
if (route.query.tab === 'register') {
  activeTab.value = 'register'
}

function handleSuccess(): void {
  const redirectTarget = (route.query.redirect as string) || '/'
  navigateTo(redirectTarget)
}
</script>
