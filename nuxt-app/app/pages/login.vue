<template>
  <v-container class="py-8 py-md-12 max-w-1200">
    <v-row align="center" justify="center">
      <!-- Left Hero Showcase Column (Desktop) -->
      <v-col cols="12" md="6" class="pr-md-8 mb-8 mb-md-0 d-none d-md-block">
        <div class="pe-lg-6">
          <v-avatar color="primary" size="64" class="elevation-2 mb-4">
            <v-icon color="#2c3534" size="36">mdi-school-outline</v-icon>
          </v-avatar>

          <h1 class="text-h4 font-weight-black text-color3 mb-4 line-height-12">
            Aprende, Colabora y Resuelve Dudas en Comunidad
          </h1>

          <p class="text-body-1 text-color3-muted mb-6">
            Tablero Digital es el lugar donde los estudiantes plantean preguntas de sus asignaturas y colaboran mutuamente para encontrar la mejor solución.
          </p>

          <div class="d-flex flex-column ga-4">
            <div class="d-flex align-start">
              <v-avatar color="secondary" size="40" class="mr-3">
                <v-icon color="#59554e" size="22">mdi-view-dashboard-variant-outline</v-icon>
              </v-avatar>
              <div>
                <h4 class="text-subtitle-2 font-weight-bold text-color3">
                  Tarjetas Estilo Padlet
                </h4>
                <p class="text-caption text-color3-muted mb-0">
                  Visualiza tus dudas organizadas por materias y cursos con una interfaz limpia e intuitiva.
                </p>
              </div>
            </div>

            <div class="d-flex align-start">
              <v-avatar color="secondary" size="40" class="mr-3">
                <v-icon color="#59554e" size="22">mdi-check-decagram-outline</v-icon>
              </v-avatar>
              <div>
                <h4 class="text-subtitle-2 font-weight-bold text-color3">
                  Interacción Tipo Brainly
                </h4>
                <p class="text-caption text-color3-muted mb-0">
                  Responde a preguntas, vota las explicaciones más útiles y marca las soluciones correctas.
                </p>
              </div>
            </div>

            <div class="d-flex align-start">
              <v-avatar color="secondary" size="40" class="mr-3">
                <v-icon color="#59554e" size="22">mdi-trophy-outline</v-icon>
              </v-avatar>
              <div>
                <h4 class="text-subtitle-2 font-weight-bold text-color3">
                  Reputación y Medallas
                </h4>
                <p class="text-caption text-color3-muted mb-0">
                  Acumula puntos por tu ayuda académica y desbloquea insignias de reconocimiento escolar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Right Form Column -->
      <v-col cols="12" sm="10" md="6" lg="5">
        <!-- Auth Tabs Toggle -->
        <v-card class="rounded-xl pa-2 mb-4 bg-white border-subtle elevation-0">
          <v-tabs
            v-model="activeTab"
            grow
            color="primary"
            align-tabs="center"
            density="comfortable"
          >
            <v-tab value="login" class="font-weight-bold text-none">
              Iniciar Sesión
            </v-tab>
            <v-tab value="register" class="font-weight-bold text-none">
              Registrarse
            </v-tab>
          </v-tabs>
        </v-card>

        <!-- Dynamic Form Rendering -->
        <v-window v-model="activeTab">
          <v-window-item value="login">
            <LoginForm />
          </v-window-item>
          <v-window-item value="register">
            <RegisterForm />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Iniciar Sesión | Tablero Digital',
  description: 'Accede a tu cuenta de estudiante para participar en el muro colaborativo educativo.',
})

const activeTab = ref<'login' | 'register'>('login')
</script>

<style scoped>
.max-w-1200 {
  max-width: 1200px;
}

.text-color3 {
  color: #59554e !important;
}

.text-color3-muted {
  color: rgba(89, 85, 78, 0.75) !important;
}

.line-height-12 {
  line-height: 1.2;
}

.border-subtle {
  border: 1px solid #e2e3d9 !important;
}
</style>