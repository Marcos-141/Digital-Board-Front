<template>
  <v-app-bar
    flat
    height="72"
    class="app-header px-md-4"
  >
    <v-container class="d-flex align-center justify-space-between py-0 max-w-1400">
      <!-- Logo & Brand Title -->
      <NuxtLink to="/" class="d-flex align-center text-decoration-none logo-wrapper">
        <v-avatar color="primary" size="44" class="elevation-1 mr-3 brand-avatar">
          <v-icon color="#2c3534" size="26">mdi-view-dashboard-variant-outline</v-icon>
        </v-avatar>
        <div class="d-flex flex-column">
          <span class="text-h6 font-weight-black brand-title line-height-1">
            Tablero<span class="brand-accent">Digital</span>
          </span>
          <span class="text-caption text-color3-muted line-height-1 mt-1 font-weight-medium">
            Muro Educativo Colaborativo
          </span>
        </div>
      </NuxtLink>

      <!-- Center Search Bar (Desktop) -->
      <div class="search-container d-none d-md-flex align-center flex-grow-1 mx-6 max-w-500">
        <v-text-field
          v-model="searchQuery"
          placeholder="Buscar por pregunta, materia, tema o etiqueta..."
          prepend-inner-icon="mdi-magnify"
          clearable
          density="compact"
          variant="solo-filled"
          flat
          hide-details
          class="custom-search-input rounded-xl"
        />
      </div>

      <!-- Action Items & User Profile Menu -->
      <div class="d-flex align-center ga-2 ga-sm-3">
        <!-- New Question Button -->
        <v-btn
          color="primary"
          variant="flat"
          rounded="xl"
          class="font-weight-bold px-4 elevation-1 action-btn text-none"
          prepend-icon="mdi-plus-circle-outline"
          @click="openCreateModal"
        >
          <span class="d-none d-sm-inline">Nueva Pregunta</span>
        </v-btn>

        <!-- Profile Modal Trigger / Navigation -->
        <template v-if="isAuthenticated && user">
          <v-menu location="bottom end" offset="8" transition="scale-transition">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                rounded="pill"
                class="user-menu-btn px-2 py-1"
              >
                <div class="d-flex align-center ga-2">
                  <v-avatar color="primary" size="38" class="elevation-1">
                    <v-img v-if="user.avatar" :src="user.avatar" alt="Avatar" />
                    <span v-else class="text-subtitle-2 font-weight-bold text-color3">
                      {{ user.name.charAt(0) }}
                    </span>
                  </v-avatar>

                  <div class="d-none d-lg-flex flex-column text-left">
                    <span class="text-subtitle-2 font-weight-bold text-color3 line-height-1">
                      {{ user.name }}
                    </span>
                    <span class="text-caption text-color3-muted line-height-1 mt-1">
                      {{ user.grade }} • {{ user.points }} pts
                    </span>
                  </div>
                  <v-icon color="#59554e" size="20">mdi-chevron-down</v-icon>
                </div>
              </v-btn>
            </template>

            <v-card class="rounded-xl pa-3 elevation-4 menu-card" width="260">
              <div class="d-flex align-center pa-2 mb-2 bg-secondary rounded-lg">
                <v-avatar color="primary" size="42" class="mr-3">
                  <v-img v-if="user.avatar" :src="user.avatar" alt="Avatar" />
                  <span v-else class="text-subtitle-1 font-weight-bold">
                    {{ user.name.charAt(0) }}
                  </span>
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-bold text-color3">
                    {{ user.name }}
                  </div>
                  <div class="text-caption text-color3-muted">
                    {{ user.email }}
                  </div>
                </div>
              </div>

              <v-chip size="small" color="primary" variant="flat" class="w-100 justify-center font-weight-bold mb-3">
                <v-icon start size="16">mdi-trophy-outline</v-icon>
                {{ user.points }} Puntos de Reputación
              </v-chip>

              <v-divider class="mb-2" />

              <v-list density="compact" nav class="pa-0">
                <v-list-item
                  to="/profile"
                  prepend-icon="mdi-account-circle-outline"
                  title="Mi Perfil y Medallas"
                  rounded="lg"
                  active-color="primary"
                />
                <v-list-item
                  prepend-icon="mdi-account-edit-outline"
                  title="Editar Información"
                  rounded="lg"
                  @click="isProfileModalOpen = true"
                />
                <v-divider class="my-2" />
                <v-list-item
                  prepend-icon="mdi-logout"
                  title="Cerrar Sesión"
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
            Iniciar Sesión
          </v-btn>
        </template>
      </div>
    </v-container>

    <!-- Profile Edit Modal component reference -->
    <UserProfileModal v-model="isProfileModalOpen" />
  </v-app-bar>
</template>

<script setup lang="ts">
const { searchQuery } = useBoard()
const { openCreateModal } = usePost()
const { user, isAuthenticated, logout } = useAuth()

const isProfileModalOpen = ref(false)

const handleLogout = () => {
  logout()
  useRouter().push('/login')
}
</script>

<style scoped>
.app-header {
  background-color: #ffffff !important;
  border-bottom: 1px solid #e2e3d9 !important;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.max-w-1400 {
  max-width: 1400px;
}

.max-w-500 {
  max-width: 500px;
}

.brand-avatar {
  background-color: #a1c1be !important;
  transition: transform 0.2s ease;
}

.logo-wrapper:hover .brand-avatar {
  transform: scale(1.06);
}

.brand-title {
  color: #59554e;
  letter-spacing: -0.5px;
}

.brand-accent {
  color: #7bb0a6;
}

.text-color3 {
  color: #59554e !important;
}

.text-color3-muted {
  color: rgba(89, 85, 78, 0.7) !important;
}

.line-height-1 {
  line-height: 1.1;
}

.custom-search-input :deep(.v-field) {
  background-color: #f3f4e5 !important;
  border-radius: 24px !important;
  border: 1px solid #e2e3d9 !important;
}

.action-btn {
  background-color: #a1c1be !important;
  color: #2c3534 !important;
}

.user-menu-btn {
  border: 1px solid #e2e3d9;
  background-color: #ffffff;
}

.menu-card {
  border: 1px solid #e2e3d9;
}
</style>
