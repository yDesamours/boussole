<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { TocEntry } from '@/types/guide';

defineProps<{ entries: TocEntry[]; label: string }>();
</script>

<template>
  <nav class="toc" :aria-label="label">
    <p class="toc-title">{{ label }}</p>
    <ol class="level-1">
      <li v-for="entry in entries" :key="entry.id">
        <RouterLink :to="{ hash: `#${entry.id}` }">{{ entry.title }}</RouterLink>
        <ol v-if="entry.children?.length" class="level-2">
          <li v-for="child in entry.children" :key="child.id">
            <RouterLink :to="{ hash: `#${child.id}` }">{{ child.title }}</RouterLink>
          </li>
        </ol>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.toc {
  font-size: var(--step--1);
  line-height: 1.4;
}

.toc-title {
  font-weight: 700;
  margin-bottom: var(--space-2);
}

ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

.level-1 {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.level-2 {
  margin-top: var(--space-1);
  padding-left: var(--space-3);
  border-left: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

a {
  text-decoration: none;
  color: var(--ink);
}

.level-2 a {
  color: var(--ink-soft);
}

a:hover {
  text-decoration: underline;
}

/* Sur petit écran, seul le premier niveau reste visible. */
@media (max-width: 60rem) {
  .level-1 {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--space-2) var(--space-4);
  }

  .level-2 {
    display: none;
  }
}
</style>
