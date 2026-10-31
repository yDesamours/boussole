<script setup lang="ts">
defineProps<{ size?: number }>();
</script>

<template>
  <!-- Une aiguille de boussole stylisée : moitié laiton (nord), moitié encre. -->
  <svg :width="size ?? 28" :height="size ?? 28" viewBox="0 0 32 32" aria-hidden="true" class="mark">
    <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" stroke-width="1.5" />
    <path d="M16 4 L20 16 L12 16 Z" fill="var(--brass)" />
    <path d="M16 28 L12 16 L20 16 Z" fill="currentColor" />
    <circle cx="16" cy="16" r="1.6" fill="var(--paper)" />
  </svg>
</template>

<style scoped>
.mark {
  flex: none;
}
</style>
