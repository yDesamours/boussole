<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { PhaseDefinition } from '@/types/schema';
import GuideBlocks from './GuideBlocks.vue';
import { markdownToBlocks } from '@/lib/markdown';

/** L'explication de la phase, repliable. Ouverte par défaut tant que la phase n'est pas commencée. */
const props = defineProps<{ phase: PhaseDefinition; open: boolean }>();

const blocks = computed(() => markdownToBlocks(props.phase.explanation));
</script>

<template>
  <details class="intro" :open="open">
    <summary>Comprendre la phase {{ phase.title }}</summary>
    <div class="body">
      <GuideBlocks :blocks="blocks" />

      <h3>Pièges à éviter</h3>
      <ul class="pitfalls">
        <li v-for="pitfall in phase.pitfalls" :key="pitfall">{{ pitfall }}</li>
      </ul>

      <h3>Ce que la phase produit</h3>
      <p class="output">{{ phase.output }}</p>

      <p class="more">
        <RouterLink :to="{ name: 'guide', hash: `#${phase.id}` }">Lire la phase en détail dans le guide</RouterLink>
        <RouterLink :to="{ name: 'example', hash: `#v1-${phase.id}` }">Voir cette phase dans le projet exemple</RouterLink>
      </p>
    </div>
  </details>
</template>

<style scoped>
.intro {
  max-width: 46rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
}

summary {
  cursor: pointer;
  padding: var(--space-4) var(--space-5);
  font-family: var(--font-read);
  font-weight: 600;
  font-size: var(--step-1);
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: 0 var(--space-5) var(--space-5);
}

h3 {
  font-size: var(--step-1);
  margin-top: var(--space-2);
}

.pitfalls {
  margin: 0;
  padding-left: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-family: var(--font-read);
  line-height: 1.6;
}

.output {
  font-family: var(--font-read);
  line-height: 1.6;
  max-width: var(--measure);
}

.more {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-5);
  font-size: var(--step--1);
}
</style>
