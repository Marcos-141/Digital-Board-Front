<template>
  <v-container class="py-6 max-w-1200">
    <template v-if="user">
      <!-- Profile Header Hero Card -->
      <v-card class="profile-hero-card rounded-xl pa-6 pa-md-8 mb-8 border-subtle elevation-2">
        <v-row align="center" dense>
          <!-- Avatar Column -->
          <v-col cols="12" sm="auto" class="text-center text-sm-left mb-4 mb-sm-0">
            <UserAvatar
              :name="user.name"
              :avatar="user.avatar"
              :size="96"
              show-status
            />
          </v-col>

          <!-- Main Info Column -->
          <v-col cols="12" sm="grow" class="pl-sm-4 text-center text-sm-left mb-4 mb-sm-0">
            <div class="d-flex align-center justify-center justify-sm-start flex-wrap ga-2 mb-1">
              <h1 class="text-h5 text-sm-h4 font-weight-black text-color3">
                {{ user.name }}
              </h1>
              <v-chip color="primary" variant="flat" size="small" class="font-weight-bold">
                {{ user.grade }}
              </v-chip>
              <v-chip color="secondary-darken-1" variant="tonal" size="small" class="font-weight-medium">
                {{ user.favoriteSubject }}
              </v-chip>
            </div>

            <p class="text-body-2 text-color3-muted mb-3 max-w-600">
              {{ user.bio }}
            </p>

            <!-- Stats Chips Row -->
            <div class="d-flex align-center justify-center justify-sm-start flex-wrap ga-3">
              <div class="stat-badge py-1 px-3 rounded-lg bg-secondary">
                <span class="text-caption text-color3-muted d-block">Puntos Reputación</span>
                <span class="text-subtitle-1 font-weight-black text-color3">{{ user.points }}</span>
              </div>

              <div class="stat-badge py-1 px-3 rounded-lg bg-secondary">
                <span class="text-caption text-color3-muted d-block">Preguntas Dudas</span>
                <span class="text-subtitle-1 font-weight-black text-color3">{{ user.questionsCount }}</span>
              </div>

              <div class="stat-badge py-1 px-3 rounded-lg bg-secondary">
                <span class="text-caption text-color3-muted d-block">Respuestas Dadas</span>
                <span class="text-subtitle-1 font-weight-black text-color3">{{ user.answersCount }}</span>
              </div>

              <div class="stat-badge py-1 px-3 rounded-lg bg-secondary">
                <span class="text-caption text-color3-muted d-block">Soluciones Aceptadas</span>
                <span class="text-subtitle-1 font-weight-black text-success">{{ user.acceptedAnswersCount }}</span>
              </div>
            </div>
          </v-col>

          <!-- Edit Profile Button -->
          <v-col cols="12" sm="auto" class="text-center text-sm-right">
            <v-btn
              color="primary"
              variant="outlined"
              rounded="xl"
              class="font-weight-bold text-none"
              prepend-icon="mdi-account-edit-outline"
              @click="isEditModalOpen = true"
            >
              Editar Perfil
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- Tabs Section: Badges vs Activity -->
      <v-card class="rounded-xl pa-2 mb-6 bg-white border-subtle elevation-0">
        <v-tabs
          v-model="activeTab"
          color="primary"
          density="comfortable"
        >
          <v-tab value="badges" class="font-weight-bold text-none">
            <v-icon start>mdi-shield-star-outline</v-icon>
            Insignias y Medallas ({{ user.badges.length }})
          </v-tab>
          <v-tab value="my-posts" class="font-weight-bold text-none">
            <v-icon start>mdi-format-list-bulleted</v-icon>
            Mis Dudas Publicadas ({{ myPosts.length }})
          </v-tab>
        </v-tabs>
      </v-card>

      <!-- Tab Content -->
      <v-window v-model="activeTab">
        <!-- Badges Tab -->
        <v-window-item value="badges">
          <v-card class="rounded-xl pa-6 bg-white border-subtle elevation-1">
            <UserBadges :badges="user.badges" />
          </v-card>
        </v-window-item>

        <!-- My Posts Tab -->
        <v-window-item value="my-posts">
          <div v-if="myPosts.length === 0" class="text-center py-10 bg-white rounded-xl border-subtle">
            <v-avatar color="secondary" size="64" class="mb-3">
              <v-icon color="#59554e" size="32">mdi-help-circle-outline</v-icon>
            </v-avatar>
            <h3 class="text-subtitle-1 font-weight-bold text-color3">
              Aún no has publicado preguntas
            </h3>
            <p class="text-caption text-color3-muted mb-4">
              ¿Tienes alguna duda sobre tus tareas o exámenes? Publica tu primera pregunta en el muro.
            </p>
            <v-btn
              color="primary"
              variant="flat"
              rounded="xl"
              class="font-weight-bold text-none btn-primary-custom"
              prepend-icon="mdi-plus"
              @click="openCreateModal"
            >
              Publicar Pregunta
            </v-btn>
          </div>

          <v-row v-else dense>
            <v-col
              v-for="post in myPosts"
              :key="post.id"
              cols="12"
              sm="6"
              md="4"
            >
              <PostCard :post="post" />
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>

      <!-- Edit Modal -->
      <UserProfileModal v-model="isEditModalOpen" />
      <PostCreateModal />
      <PostDetailModal />
    </template>

    <template v-else>
      <v-card class="rounded-xl pa-10 text-center bg-white border-subtle my-8">
        <h3 class="text-h6 font-weight-bold text-color3 mb-3">
          Debes iniciar sesión para ver tu perfil
        </h3>
        <v-btn
          to="/login"
          color="primary"
          variant="flat"
          rounded="xl"
          class="font-weight-bold text-none btn-primary-custom"
        >
          Ir a Iniciar Sesión
        </v-btn>
      </v-card>
    </template>
  </v-container>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Mi Perfil de Estudiante | Tablero Digital',
  description: 'Consulta tus estadísticas, insignias académicas y preguntas publicadas.',
})

const { user } = useAuth()
const { posts, openCreateModal } = usePost()

const activeTab = ref<'badges' | 'my-posts'>('badges')
const isEditModalOpen = ref(false)

const myPosts = computed(() => {
  if (!user.value) return []
  return posts.value.filter((p) => p.author.id === user.value?.id || p.author.name === user.value?.name)
})
</script>

<style scoped>
.max-w-1200 {
  max-width: 1200px;
}

.profile-hero-card {
  background-color: #ffffff;
  border: 1px solid #e2e3d9;
}

.text-color3 {
  color: #59554e !important;
}

.text-color3-muted {
  color: rgba(89, 85, 78, 0.75) !important;
}

.border-subtle {
  border: 1px solid #e2e3d9 !important;
}

.stat-badge {
  border: 1px solid #e2e3d9;
  min-width: 110px;
}

.btn-primary-custom {
  background-color: #a1c1be !important;
  color: #2c3534 !important;
}

.max-w-600 {
  max-width: 600px;
}
</style>
