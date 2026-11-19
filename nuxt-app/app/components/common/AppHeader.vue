<template>
  <header>
    <v-app-bar flat height="72" class="border-b" color="surface" elevation="0">
      <v-container class="d-flex align-center justify-space-between py-0 max-w-1400">
        <!-- Mobile hamburger -->
        <v-app-bar-nav-icon
          class="d-md-none mr-1"
          aria-label="Abrir menú de navegación"
          @click="drawer = !drawer"
        />

        <!-- Brand / Logo -->
        <NuxtLink to="/" class="d-flex align-center text-decoration-none logo-link mr-4">
          <v-avatar color="primary" size="40" class="mr-2">
            <v-icon color="on-primary" size="24">mdi-bulletin-board</v-icon>
          </v-avatar>
          <div class="d-flex flex-column">
            <span class="text-h6 font-weight-bold" style="line-height: 1.2;">
              Tablero<span class="text-primary-darken-1 font-weight-black">Digital</span>
            </span>
            <span class="text-caption text-muted d-none d-sm-inline" style="line-height: 1;">
              Muro colaborativo
            </span>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation Links -->
        <nav class="d-none d-md-flex align-center ga-1 ml-2 mr-4" aria-label="Navegación principal">
          <v-btn
            to="/"
            variant="text"
            rounded="xl"
            class="text-none font-weight-medium"
            active-color="primary"
          >
            Muro
          </v-btn>
          <v-btn
            to="/topics"
            variant="text"
            rounded="xl"
            class="text-none font-weight-medium"
            active-color="primary"
          >
            Temáticas
          </v-btn>
          <v-btn
            to="/users"
            variant="text"
            rounded="xl"
            class="text-none font-weight-medium"
            active-color="primary"
          >
            Miembros
          </v-btn>
        </nav>

        <!-- Search Bar (Desktop) -->
        <div class="d-none d-md-flex align-center flex-grow-1 mx-4" style="max-width: 440px;">
          <v-text-field
            v-model="boardStore.searchQuery"
            placeholder="Buscar por título, contenido, autor o temática..."
            prepend-inner-icon="mdi-magnify"
            clearable
            density="compact"
            variant="solo-filled"
            flat
            rounded="xl"
            hide-details
            class="search-input"
            aria-label="Buscar en el muro"
            @keydown.enter="handleSearchSubmit"
          />
        </div>

        <!-- Action Items -->
        <div class="d-flex align-center ga-2">
          <!-- Mobile Search Toggle -->
          <v-btn
            icon="mdi-magnify"
            variant="text"
            class="d-md-none"
            aria-label="Abrir buscador"
            @click="mobileSearchOpen = !mobileSearchOpen"
          />

          <!-- New Post Button -->
          <v-btn
            color="primary"
            variant="flat"
            rounded="xl"
            class="font-weight-bold text-none px-3 px-sm-4"
            prepend-icon="mdi-plus"
            @click="handleNewPost"
          >
            <span class="d-none d-sm-inline">Nueva publicación</span>
            <span class="d-inline d-sm-none">Publicar</span>
          </v-btn>

          <!-- User Menu or Login CTA -->
          <template v-if="authStore.isAuthenticated && authStore.user">
            <v-menu location="bottom end" offset="8" transition="scale-transition">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text"
                  rounded="pill"
                  class="pa-1 text-none"
                  aria-label="Menú de usuario"
                >
                  <div class="d-flex align-center ga-2">
                    <UserAvatar
                      :name="authStore.user.nombre"
                      size="36"
                    />
                    <div class="d-none d-lg-flex flex-column text-left">
                      <span class="text-subtitle-2 font-weight-bold line-clamp-1" style="line-height: 1.1; max-width: 120px;">
                        {{ authStore.user.nombre }}
                      </span>
                      <span class="text-caption text-muted" style="line-height: 1;">
                        {{ roleLabel }}
                      </span>
                    </div>
                    <v-icon size="18" color="medium-emphasis">mdi-chevron-down</v-icon>
                  </div>
                </v-btn>
              </template>

              <v-card class="rounded-card pa-3 border-soft elevation-4" width="260">
                <div class="d-flex align-center pa-2 mb-2 bg-grey-lighten-4 rounded-lg">
                  <UserAvatar :name="authStore.user.nombre" size="40" class="mr-3" />
                  <div class="overflow-hidden">
                    <div class="text-subtitle-2 font-weight-bold text-truncate">
                      {{ authStore.user.nombre }}
                    </div>
                    <div class="text-caption text-muted text-truncate">
                      {{ authStore.user.email }}
                    </div>
                  </div>
                </div>

                <div class="px-2 mb-2">
                  <v-chip
                    size="small"
                    :color="authStore.user.role === 'ADMIN' ? 'warning' : authStore.user.role === 'TEACHER' ? 'secondary-darken-1' : 'primary'"
                    variant="tonal"
                    class="font-weight-bold"
                  >
                    <v-icon start size="14">
                      {{ authStore.user.role === 'ADMIN' ? 'mdi-shield-crown-outline' : authStore.user.role === 'TEACHER' ? 'mdi-school-outline' : 'mdi-account-outline' }}
                    </v-icon>
                    {{ roleLabel }}
                  </v-chip>
                </div>

                <v-divider class="my-1" />

                <v-list density="compact" nav class="pa-0">
                  <v-list-item
                    to="/profile"
                    prepend-icon="mdi-account-circle-outline"
                    title="Mi perfil"
                    rounded="lg"
                  />
                  <v-list-item
                    prepend-icon="mdi-logout"
                    title="Cerrar sesión"
                    rounded="lg"
                    color="error"
                    @click="handleLogout"
                  />
                </v-list>
              </v-card>
            </v-menu>
          </template>

          <template v-else>
            <v-btn
              to="/login"
              color="primary"
              variant="outlined"
              rounded="xl"
              class="font-weight-bold text-none"
            >
              Iniciar sesión
            </v-btn>
          </template>
        </div>
      </v-container>

      <!-- Expandable Mobile Search Field -->
      <v-expand-transition>
        <div v-if="mobileSearchOpen" class="w-100 px-4 pb-3 bg-surface border-b d-md-none">
          <v-text-field
            v-model="boardStore.searchQuery"
            placeholder="Buscar en el muro..."
            prepend-inner-icon="mdi-magnify"
            clearable
            density="compact"
            variant="solo-filled"
            flat
            rounded="xl"
            hide-details
            aria-label="Buscar en el muro (móvil)"
            @keydown.enter="handleSearchSubmit"
          />
        </div>
      </v-expand-transition>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="left"
      class="pa-3"
    >
      <div class="d-flex align-center justify-space-between mb-4 px-2">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="36" class="mr-2">
            <v-icon color="on-primary" size="20">mdi-bulletin-board</v-icon>
          </v-avatar>
          <span class="text-subtitle-1 font-weight-bold">
            Tablero<span class="text-primary-darken-1 font-weight-black">Digital</span>
          </span>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="drawer = false" />
      </div>

      <v-divider class="mb-3" />

      <v-list nav density="comfortable">
        <v-list-item
          to="/"
          prepend-icon="mdi-view-dashboard-outline"
          title="Muro colaborativo"
          rounded="xl"
          @click="drawer = false"
        />
        <v-list-item
          to="/topics"
          prepend-icon="mdi-tag-multiple-outline"
          title="Temáticas"
          rounded="xl"
          @click="drawer = false"
        />
        <v-list-item
          to="/users"
          prepend-icon="mdi-account-group-outline"
          title="Miembros"
          rounded="xl"
          @click="drawer = false"
        />
      </v-list>

      <v-divider class="my-3" />

      <div v-if="authStore.isAuthenticated && authStore.user" class="pa-2">
        <v-list nav density="comfortable">
          <v-list-item
            to="/profile"
            prepend-icon="mdi-account-circle-outline"
            title="Mi perfil"
            rounded="xl"
            @click="drawer = false"
          />
          <v-list-item
            prepend-icon="mdi-logout"
            title="Cerrar sesión"
            rounded="xl"
            color="error"
            @click="handleLogout"
          />
        </v-list>
      </div>

      <div v-else class="pa-2">
        <v-btn
          to="/login"
          block
          color="primary"
          variant="flat"
          rounded="xl"
          class="font-weight-bold text-none"
          @click="drawer = false"
        >
          Iniciar sesión
        </v-btn>
      </div>
    </v-navigation-drawer>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useBoardStore } from '~/stores/board'
import { usePostDialog } from '~/composables/usePostDialog'

const authStore = useAuthStore()
const boardStore = useBoardStore()
const postDialog = usePostDialog()
const route = useRoute()
const router = useRouter()

const drawer = ref(false)
const mobileSearchOpen = ref(false)
const roleLabel = computed(() => ({
  ADMIN: 'Administrador',
  TEACHER: 'Profesor',
  STUDENT: 'Estudiante',
}[authStore.user?.role || 'STUDENT']))

function handleSearchSubmit(): void {
  if (route.path !== '/') {
    router.push({
      path: '/',
      query: { q: boardStore.searchQuery || undefined },
    })
  }
}

function handleNewPost(): void {
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  postDialog.open()
}

async function handleLogout(): Promise<void> {
  drawer.value = false
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.max-w-1400 {
  max-width: 1400px;
}

.logo-link {
  color: inherit;
}

.search-input :deep(.v-field) {
  background-color: var(--db-bg) !important;
  border-radius: 24px !important;
  border: 1px solid var(--db-border) !important;
}
</style>
