<template>
  <div class="user-badges-container">
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h3 class="text-h6 font-weight-bold text-color3 d-flex align-center">
          <v-icon color="primary-darken-1" class="mr-2">mdi-shield-star-outline</v-icon>
          Insignias y Medallas Academicas
        </h3>
        <p class="text-body-2 text-color3-muted mb-0">
          Reconocimientos ganados por colaborar y ayudar a la comunidad educativa.
        </p>
      </div>

      <v-chip color="primary" variant="flat" class="font-weight-bold">
        {{ unlockedCount }} / {{ badges.length }} Desbloqueadas
      </v-chip>
    </div>

    <v-row dense>
      <v-col
        v-for="badge in badges"
        :key="badge.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="badge-card rounded-xl pa-4 h-100 border-subtle transition-all"
          :class="{ 'badge-unlocked': badge.unlocked, 'badge-locked': !badge.unlocked }"
          elevation="0"
        >
          <div class="d-flex align-start">
            <v-avatar
              :color="badge.unlocked ? badge.color : '#e2e3d9'"
              size="48"
              class="elevation-2 mr-3 badge-avatar"
            >
              <v-icon
                :color="badge.unlocked ? '#2c3534' : 'rgba(89,85,78,0.4)'"
                size="26"
              >
                {{ badge.icon }}
              </v-icon>
            </v-avatar>

            <div class="flex-grow-1">
              <div class="d-flex align-center justify-space-between">
                <span class="text-subtitle-2 font-weight-bold text-color3">
                  {{ badge.name }}
                </span>
                <v-icon
                  v-if="badge.unlocked"
                  color="success"
                  size="18"
                  title="Desbloqueada"
                >
                  mdi-check-circle
                </v-icon>
                <v-icon v-else color="rgba(89,85,78,0.4)" size="18" title="Bloqueada">
                  mdi-lock-outline
                </v-icon>
              </div>

              <p class="text-caption text-color3-muted mb-2 mt-1">
                {{ badge.description }}
              </p>

              <!-- Progress bar for locked badge if progress exists -->
              <div v-if="!badge.unlocked && badge.progress !== undefined" class="mt-2">
                <div class="d-flex justify-space-between text-caption text-color3-muted mb-1">
                  <span>Progreso</span>
                  <span>{{ badge.progress }}/{{ badge.maxProgress }}</span>
                </div>
                <v-progress-linear
                  :model-value="(badge.progress / (badge.maxProgress || 1)) * 100"
                  color="primary"
                  height="6"
                  rounded
                />
              </div>

              <span v-else-if="badge.unlocked && badge.unlockedAt" class="text-caption text-success font-weight-medium">
                Conseguida el {{ badge.unlockedAt }}
              </span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { UserBadge } from '~/composables/useAuth'

const props = withDefaults(
  defineProps<{
    badges: UserBadge[]
  }>(),
  {
    badges: () => [],
  }
)

const unlockedCount = computed(() => {
  return props.badges.filter((b) => b.unlocked).length
})
</script>

<style scoped>
.user-badges-container {
  width: 100%;
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

.badge-card {
  background-color: #ffffff;
}

.badge-unlocked {
  border-left: 4px solid #a1c1be !important;
}

.badge-locked {
  opacity: 0.75;
  background-color: #fafafa;
}

.badge-avatar {
  transition: transform 0.3s ease;
}

.badge-card:hover .badge-avatar {
  transform: scale(1.1) rotate(5deg);
}

.transition-all {
  transition: all 0.25s ease-in-out;
}
</style>
