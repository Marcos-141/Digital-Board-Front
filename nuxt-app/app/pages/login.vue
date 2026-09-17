<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="4" rounded="xl" class="pa-6">
          
          <!-- Encabezado -->
          <div class="text-center mb-6">
            <v-icon icon="mdi-bulletin-board" color="primary" size="48" class="mb-2" />
            <h1 class="text-h5 font-weight-bold">Tablero Digital</h1>
            <p class="text-body-2 text-medium-emphasis">Plataforma colaborativa de aprendizaje</p>
          </div>

          <!-- Pestañas -->
          <v-tabs v-model="activeTab" grow color="primary" class="mb-6">
            <v-tab value="signin">Iniciar Sesión</v-tab>
            <v-tab value="signup">Registrarse</v-tab>
          </v-tabs>

          <!-- Contenido alternado -->
          <v-window v-model="activeTab">
            <v-window-item value="signin">
              <LoginForm />
            </v-window-item>

            <v-window-item value="signup">
              <RegisterForm />
            </v-window-item>
          </v-window>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '~/components/login/LoginForm.vue';
import RegisterForm from '~/components/login/RegisterForm.vue';
const activeTab = ref('signin')
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>