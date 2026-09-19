<template>
  <div class="board-filter-bar mb-6">
    <!-- Subject Chips Scrollable Bar -->
    <div class="d-flex align-center overflow-x-auto py-1 px-1 mb-4 hide-scrollbar">
      <v-chip-group
        :model-value="selectedSubject"
        selected-class="chip-selected"
        mandatory
        class="ga-2"
        @update:model-value="setSubject"
      >
        <v-chip
          v-for="subject in subjects"
          :key="subject"
          :value="subject"
          variant="flat"
          rounded="xl"
          class="subject-chip font-weight-medium text-caption text-sm-body-2"
          :class="{ 'active-chip': selectedSubject === subject }"
        >
          <v-icon start size="16">{{ getSubjectIcon(subject) }}</v-icon>
          {{ subject }}
        </v-chip>
      </v-chip-group>
    </div>

    <!-- Secondary Filters Row (Grade, Status, Sort, Reset) -->
    <v-card class="rounded-xl pa-3 pa-sm-4 bg-white border-subtle elevation-0">
      <v-row align="center" dense>
        <!-- Grade Select -->
        <v-col cols="12" sm="6" md="3">
          <v-select
            :model-value="selectedGrade"
            :items="grades"
            label="Curso / Grado"
            prepend-inner-icon="mdi-school-outline"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
            class="custom-filter-select"
            @update:model-value="setGrade"
          />
        </v-col>

        <!-- Status Select -->
        <v-col cols="6" sm="6" md="3">
          <v-select
            :model-value="selectedStatus"
            :items="statusOptions"
            item-title="text"
            item-value="value"
            label="Estado de la Duda"
            prepend-inner-icon="mdi-checkbox-marked-circle-outline"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
            class="custom-filter-select"
            @update:model-value="setStatus"
          />
        </v-col>

        <!-- Sort Select -->
        <v-col cols="6" sm="6" md="3">
          <v-select
            :model-value="sortBy"
            :items="sortOptions"
            item-title="text"
            item-value="value"
            label="Ordenar por"
            prepend-inner-icon="mdi-sort"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
            class="custom-filter-select"
            @update:model-value="setSort"
          />
        </v-col>

        <!-- Reset & Active Filters Badge -->
        <v-col cols="12" sm="6" md="3" class="d-flex align-center justify-end ga-2">
          <v-chip
            v-if="activeFiltersCount > 0"
            color="primary"
            variant="tonal"
            size="small"
            class="font-weight-bold"
          >
            {{ activeFiltersCount }} Filtro(s) Activo(s)
          </v-chip>

          <v-btn
            v-if="activeFiltersCount > 0"
            variant="text"
            color="error"
            density="comfortable"
            rounded="lg"
            class="text-none font-weight-bold text-caption"
            prepend-icon="mdi-filter-off-outline"
            @click="resetFilters"
          >
            Limpiar
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { SortOption, StatusFilter } from '~/composables/useBoard'

const {
  selectedSubject,
  selectedGrade,
  selectedStatus,
  sortBy,
  subjects,
  grades,
  activeFiltersCount,
  setSubject,
  setGrade,
  setStatus,
  setSort,
  resetFilters,
} = useBoard()

const statusOptions = [
  { text: 'Todos los estados', value: 'todos' as StatusFilter },
  { text: 'Pendientes de respuesta', value: 'pendiente' as StatusFilter },
  { text: 'Resueltos', value: 'resuelto' as StatusFilter },
]

const sortOptions = [
  { text: 'Más recientes', value: 'recent' as SortOption },
  { text: 'Más votados', value: 'popular' as SortOption },
  { text: 'Sin respuesta', value: 'unanswered' as SortOption },
]

const getSubjectIcon = (subject: string) => {
  switch (subject) {
    case 'Matemáticas':
      return 'mdi-calculator'
    case 'Historia':
      return 'mdi-book-open-page-variant'
    case 'Ciencias':
      return 'mdi-atom'
    case 'Lengua':
      return 'mdi-text-box-search-outline'
    case 'Inglés':
      return 'mdi-translate'
    case 'Arte':
      return 'mdi-palette'
    case 'Tecnología':
      return 'mdi-laptop'
    default:
      return 'mdi-format-list-bulleted'
  }
}
</script>

<style scoped>
.border-subtle {
  border: 1px solid #e2e3d9 !important;
}

.subject-chip {
  background-color: #ffffff !important;
  color: #59554e !important;
  border: 1px solid #e2e3d9 !important;
  transition: all 0.2s ease;
}

.active-chip {
  background-color: #a1c1be !important;
  color: #2c3534 !important;
  font-weight: 700 !important;
  border-color: #89aba8 !important;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.custom-filter-select :deep(.v-field) {
  border-radius: 8px;
  background-color: #f3f4e5;
}
</style>
