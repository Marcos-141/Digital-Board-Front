<template>
  <div class="user-avatar-container position-relative d-inline-block">
    <v-avatar
      :size="size"
      :color="color || 'primary'"
      class="elevation-1 border-white"
    >
      <v-img v-if="avatar" :src="avatar" :alt="name" />
      <span v-else class="font-weight-bold text-color3" :style="{ fontSize: `${size * 0.4}px` }">
        {{ initials }}
      </span>
    </v-avatar>

    <!-- Online Status Dot -->
    <span
      v-if="showStatus"
      class="status-dot"
      :style="{
        width: `${Math.max(10, size * 0.28)}px`,
        height: `${Math.max(10, size * 0.28)}px`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string
    avatar?: string
    size?: number
    color?: string
    showStatus?: boolean
  }>(),
  {
    size: 40,
    showStatus: false,
  }
)

const initials = computed(() => {
  if (!props.name) return '?'
  const parts = props.name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return props.name.slice(0, 2).toUpperCase()
})
</script>

<style scoped>
.user-avatar-container {
  vertical-align: middle;
}

.border-white {
  border: 2px solid #ffffff !important;
}

.text-color3 {
  color: #59554e !important;
}

.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #81c784;
  border: 2px solid #ffffff;
  border-radius: 50%;
  z-index: 2;
}
</style>
