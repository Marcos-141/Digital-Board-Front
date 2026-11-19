<template>
  <v-chip
    :color="color"
    :variant="variant || 'flat'"
    :size="size || 'small'"
    rounded="pill"
    class="font-weight-bold"
    :style="{ color: textColor + ' !important' }"
    :to="to"
    @click="$emit('click')"
  >
    <v-icon start size="14" :icon="icon || 'mdi-tag-outline'" />
    {{ name }}
  </v-chip>
</template>

<script setup lang="ts">
import { useTopicColor } from '~/composables/useTopicColor'

const props = defineProps<{
  topicId?: number | null
  name: string
  variant?: 'flat' | 'tonal' | 'outlined'
  size?: 'x-small' | 'small' | 'default'
  icon?: string
  to?: string
}>()

defineEmits<{
  (e: 'click'): void
}>()

const { getTopicColor, getTopicTextColor } = useTopicColor()

const color = computed(() => getTopicColor(props.topicId))
const textColor = computed(() => getTopicTextColor(props.topicId))
</script>
