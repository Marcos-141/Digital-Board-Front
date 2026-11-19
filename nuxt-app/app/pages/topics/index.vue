<template>
  <div class="topics-page">
    <PageHeader
      title="Temáticas del Tablero"
      subtitle="Categorías estructuradas para organizar debates, anuncios y recursos educativos."
    >
      <template v-if="authStore.canManageTopics" #actions>
        <v-btn
          color="primary"
          variant="flat"
          rounded="xl"
          class="text-none font-weight-bold"
          prepend-icon="mdi-plus"
          @click="handleNewTopic"
        >
          Nueva temática
        </v-btn>
      </template>
    </PageHeader>

    <!-- Search filter -->
    <div class="mb-6" style="max-width: 440px;">
      <v-text-field
        v-model="searchQuery"
        placeholder="Buscar temática por nombre o descripción..."
        prepend-inner-icon="mdi-magnify"
        clearable
        density="compact"
        variant="outlined"
        rounded="xl"
        hide-details
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-4">
      <v-row>
        <v-col v-for="i in 4" :key="i" cols="12" sm="6" lg="4">
          <v-skeleton-loader
            type="article"
            class="rounded-xl border-soft"
            elevation="0"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Error State -->
    <div v-else-if="error">
      <ErrorState
        title="No pudimos cargar las temáticas"
        :message="error"
        action-label="Reintentar"
        @action="fetchData"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="topicsStore.topics.length === 0">
      <EmptyState
        icon="mdi-tag-plus-outline"
        title="No hay temáticas registradas"
        message="Sé el primero en crear una categoría para estructurar el contenido de la comunidad."
      >
        <template v-if="authStore.canManageTopics" #action>
          <div class="d-flex flex-wrap justify-center ga-2">
            <v-btn
              color="primary"
              variant="flat"
              rounded="xl"
              class="text-none font-weight-bold px-5"
              prepend-icon="mdi-plus"
              @click="handleNewTopic"
            >
              Crear temática
            </v-btn>
            <v-btn
              color="secondary-darken-1"
              variant="tonal"
              rounded="xl"
              class="text-none font-weight-bold px-5"
              prepend-icon="mdi-auto-fix"
              :loading="seedingTopics"
              @click="handleSeedSuggestedTopics"
            >
              Cargar temáticas sugeridas
            </v-btn>
          </div>
        </template>
      </EmptyState>
    </div>

    <!-- Filtered Empty State -->
    <div v-else-if="filteredTopics.length === 0">
      <EmptyState
        icon="mdi-filter-remove-outline"
        title="No encontramos temáticas con ese criterio"
        message="Intenta cambiar los términos de búsqueda."
        action-label="Limpiar búsqueda"
        @action="searchQuery = ''"
      />
    </div>

    <!-- Topics Grid -->
    <v-row v-else>
      <v-col
        v-for="topic in filteredTopics"
        :key="topic.id"
        cols="12"
        sm="6"
        lg="4"
        class="d-flex"
      >
        <TopicCard
          :topic="topic"
          :post-count="getPostCount(topic.id)"
          class="w-100"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </v-col>
    </v-row>

    <!-- Topic Form Dialog -->
    <TopicFormDialog
      v-model="dialogOpen"
      :topic="selectedTopic"
      @saved="selectedTopic = null"
    />
  </div>
</template>

<script setup lang="ts">
import { useTopicsStore } from '~/stores/topics'
import { usePostsStore } from '~/stores/posts'
import { useAuthStore } from '~/stores/auth'
import { useNotify } from '~/composables/useNotify'
import { useConfirm } from '~/composables/useConfirm'
import { normalizeText } from '~/utils/strings'
import { isApiError } from '~/api/errors'
import { DEFAULT_SUGGESTED_TOPICS } from '~/utils/default-topics'
import type { Topic } from '~/types/domain'

useSeoMeta({
  title: 'Temáticas',
  description: 'Explora y gestiona las diferentes temáticas organizadas en Tablero Digital.',
})

const topicsStore = useTopicsStore()
const postsStore = usePostsStore()
const authStore = useAuthStore()
const notify = useNotify()
const { confirm } = useConfirm()
const router = useRouter()
const route = useRoute()

const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const dialogOpen = ref(false)
const selectedTopic = ref<Topic | null>(null)
const seedingTopics = ref(false)

async function fetchData(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    await topicsStore.fetchTopics(true)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error al conectar con el servidor.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const filteredTopics = computed(() => {
  const q = normalizeText(searchQuery.value)
  if (!q) return topicsStore.topics
  return topicsStore.topics.filter((t) => {
    return normalizeText(t.name).includes(q) || normalizeText(t.description).includes(q)
  })
})

function getPostCount(topicId: number): number | null {
  if (postsStore.postsByTopic[topicId]) {
    return postsStore.postsByTopic[topicId].length
  }
  return null
}

function handleNewTopic(): void {
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  selectedTopic.value = null
  dialogOpen.value = true
}

function handleEdit(topic: Topic): void {
  selectedTopic.value = topic
  dialogOpen.value = true
}

async function handleDelete(topic: Topic): Promise<void> {
  const ok = await confirm({
    title: 'Eliminar temática',
    message: `¿Deseas eliminar la temática "${topic.name}"? Ten en cuenta que solo podrás eliminarla si no tiene publicaciones asociadas.`,
    confirmText: 'Eliminar temática',
    cancelText: 'Cancelar',
    destructive: true,
  })

  if (!ok) return

  try {
    await topicsStore.deleteTopic(topic.id)
    notify.success('Temática eliminada con éxito.')
  } catch (err: unknown) {
    if (isApiError(err) && err.status === 400) {
      notify.error(err.message || 'No se puede eliminar la temática porque contiene publicaciones activas.')
    } else {
      notify.error('No se pudo eliminar la temática.')
    }
  }
}

async function handleSeedSuggestedTopics(): Promise<void> {
  seedingTopics.value = true
  try {
    for (const item of DEFAULT_SUGGESTED_TOPICS) {
      await topicsStore.createTopic(item)
    }
    notify.success('¡Temáticas sugeridas creadas con éxito!')
    await fetchData()
  } catch {
    notify.error('No se pudieron crear las temáticas. Verifica que el servidor esté activo.')
  } finally {
    seedingTopics.value = false
  }
}
</script>
