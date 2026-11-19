<template>
  <v-avatar
    :size="size"
    :style="{ backgroundColor: avatarColor, color: '#2c3534' }"
    class="font-weight-bold text-center elevation-0 border-soft"
    :aria-label="name ? `Avatar de ${name}` : 'Avatar de usuario'"
  >
    <span :style="{ fontSize: `${Number(size) * 0.4}px`, lineHeight: 1 }">
      {{ initials }}
    </span>
  </v-avatar>
</template>

<script setup lang="ts">
import { getInitials } from '~/utils/strings'

const props = withDefaults(
  defineProps<{
    name?: string | null
    size?: number | string
    color?: string
  }>(),
  {
    name: 'Usuario',
    size: 40,
    color: undefined,
  }
)

const initials = computed(() => getInitials(props.name))

const AVATAR_PALETTE = [
  '#a1c1be',
  '#e0a96d',
  '#7bb0a6',
  '#74a2be',
  '#b08ebb',
  '#d98c8c',
  '#9fb67a',
  '#c7a27c',
]

const avatarColor = computed(() => {
  if (props.color) return props.color
  const cleanName = (props.name || 'Usuario').trim()
  let hash = 0
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length
  return AVATAR_PALETTE[index]
})
</script>
