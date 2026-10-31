<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { Iteration } from '@/types/schema';
import { isAnswered } from '@/lib/project';

/**
 * Rappel du persona dans les phases qui suivent Comprendre :
 * chaque décision s'y confronte, il faut l'avoir sous les yeux.
 */
const props = defineProps<{ projectId: string; iteration: Iteration; emphasizeMetric?: boolean }>();

const answers = computed(() => props.iteration.phases.comprendre.answers);
const text = (id: string) => {
  const value = answers.value[id];
  return typeof value === 'string' && isAnswered(value) ? value.trim() : '';
};

const need = computed(() => text('besoinPrincipal'));
const problem = computed(() => text('problemeReel'));
const metric = computed(() => text('metrique'));
const empty = computed(() => !need.value && !problem.value && !metric.value);
</script>

<template>
  <aside class="reminder" aria-labelledby="reminder-title">
    <h2 id="reminder-title">Le juge de cette phase : ton persona</h2>

    <p v-if="empty" class="empty">
      Ta phase Comprendre n'est pas encore remplie. Sans persona, cette phase n'a pas de juge pour trancher.
      <RouterLink
        :to="{ name: 'phase', params: { projectId, iteration: iteration.number, phaseId: 'comprendre' } }"
      >
        Revenir à Comprendre
      </RouterLink>
    </p>

    <dl v-else>
      <div v-if="need" class="need">
        <dt>Son besoin principal</dt>
        <dd>{{ need }}</dd>
      </div>
      <div v-if="problem">
        <dt>Le problème réel</dt>
        <dd>{{ problem }}</dd>
      </div>
      <div v-if="metric" :class="{ need: emphasizeMetric }">
        <dt>Comment saura-t-on qu'il est résolu</dt>
        <dd>{{ metric }}</dd>
      </div>
    </dl>
  </aside>
</template>

<style scoped>
.reminder {
  max-width: 46rem;
  padding: var(--space-4) var(--space-5);
  border-left: 3px solid var(--sage);
  background: color-mix(in srgb, var(--sage) 9%, var(--paper));
  border-radius: 0 var(--radius-panel) var(--radius-panel) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

h2 {
  font-size: var(--step-0);
  font-family: var(--font-ui);
  font-weight: 700;
}

dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

dt {
  font-size: var(--step--1);
  color: var(--ink-soft);
  font-weight: 700;
}

dd {
  margin: var(--space-1) 0 0;
  font-family: var(--font-read);
  line-height: 1.55;
  white-space: pre-line;
}

.need dd {
  font-size: var(--step-1);
}

.empty {
  color: var(--ink-soft);
}
</style>
