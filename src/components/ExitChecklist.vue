<script setup lang="ts">
import { computed } from 'vue';
import type { ChecklistItem } from '@/types/schema';

/**
 * Checklist de sortie d'une phase. Jamais bloquante : elle indique seulement
 * si la phase peut être considérée comme terminée.
 */
const props = defineProps<{
  items: ChecklistItem[];
  checked: Record<string, boolean>;
  whenIsItDone: string;
  readonly?: boolean;
}>();

const emit = defineEmits<{ toggle: [itemId: string, checked: boolean] }>();

const doneCount = computed(() => props.items.filter((item) => props.checked[item.id]).length);
const allDone = computed(() => props.items.length > 0 && doneCount.value === props.items.length);
</script>

<template>
  <section class="checklist" :class="{ 'all-done': allDone }" aria-labelledby="checklist-title">
    <h2 id="checklist-title">Avant de passer à la suite</h2>
    <p class="when">{{ whenIsItDone }}</p>

    <ul class="items">
      <li v-for="item in items" :key="item.id" class="item">
        <input
          :id="`check-${item.id}`"
          type="checkbox"
          :checked="!!checked[item.id]"
          :disabled="readonly"
          :aria-describedby="item.hint ? `check-${item.id}-hint` : undefined"
          @change="emit('toggle', item.id, ($event.target as HTMLInputElement).checked)"
        />
        <div>
          <label :for="`check-${item.id}`">{{ item.label }}</label>
          <p v-if="item.hint" :id="`check-${item.id}-hint`" class="hint">{{ item.hint }}</p>
        </div>
      </li>
    </ul>

    <p class="outcome" role="status" aria-live="polite">
      <template v-if="allDone">Phase terminée. Tu peux passer à la suivante.</template>
      <template v-else>
        {{ doneCount }} point{{ doneCount > 1 ? 's' : '' }} validé{{ doneCount > 1 ? 's' : '' }} sur {{ items.length }}.
        Tu peux continuer quand même : la phase restera marquée comme incomplète.
      </template>
    </p>
  </section>
</template>

<style scoped>
.checklist {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 46rem;
  padding: var(--space-5);
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 3px solid var(--brass);
  border-radius: var(--radius-panel);
}

.checklist.all-done {
  border-left-color: var(--sage);
}

h2 {
  font-size: var(--step-2);
}

.when {
  color: var(--ink-soft);
  max-width: var(--measure);
}

.items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.item {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}

.item input {
  width: 1.15rem;
  height: 1.15rem;
  margin-top: 0.25rem;
  accent-color: var(--sage);
  flex: none;
}

.item label {
  font-weight: 400;
  cursor: pointer;
}

.item input:disabled + div label {
  cursor: default;
}

.hint {
  font-size: var(--step--1);
  color: var(--ink-soft);
  margin-top: var(--space-1);
}

.outcome {
  font-weight: 700;
  color: var(--ink-soft);
}

.all-done .outcome {
  color: var(--sage);
}
</style>
