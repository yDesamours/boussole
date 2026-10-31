<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import FieldInput from '@/components/FieldInput.vue';
import ExitChecklist from '@/components/ExitChecklist.vue';
import SaveIndicator from '@/components/SaveIndicator.vue';
import PhaseIntro from '@/components/PhaseIntro.vue';
import PersonaReminder from '@/components/PersonaReminder.vue';
import ExportMenu from '@/components/ExportMenu.vue';
import { useProjectsStore } from '@/stores/projects';
import { currentIteration, findIteration, isCurrentIteration, phaseStatus } from '@/lib/project';
import { getPhase, isPhaseId, PHASE_OUTLINE } from '@/content';
import type { FieldValue } from '@/types/schema';

const props = defineProps<{ projectId: string; iteration: number; phaseId: string }>();

const store = useProjectsStore();

const project = computed(() => store.getProject(props.projectId));
const iterationData = computed(() => (project.value ? findIteration(project.value, props.iteration) : undefined));
const phaseId = computed(() => (isPhaseId(props.phaseId) ? props.phaseId : undefined));
const outline = computed(() => PHASE_OUTLINE.find((p) => p.id === phaseId.value));
const definition = computed(() => (phaseId.value ? getPhase(phaseId.value) : undefined));
const progress = computed(() =>
  iterationData.value && phaseId.value ? iterationData.value.phases[phaseId.value] : undefined,
);

const status = computed(() => phaseStatus(definition.value, progress.value));

/** Les itérations précédentes se consultent, mais ne se modifient pas. */
const readonly = computed(
  () => !project.value || !iterationData.value || !isCurrentIteration(project.value, iterationData.value),
);
const currentNumber = computed(() => (project.value ? currentIteration(project.value).number : undefined));

const neighbours = computed(() => {
  const index = PHASE_OUTLINE.findIndex((p) => p.id === phaseId.value);
  const wrap = (i: number) => {
    const p = PHASE_OUTLINE[i];
    return p ? { ...p, available: getPhase(p.id) !== undefined } : undefined;
  };
  return { previous: wrap(index - 1), next: wrap(index + 1) };
});

function update(fieldId: string, value: FieldValue) {
  if (readonly.value || !phaseId.value) return;
  store.setAnswer(props.projectId, phaseId.value, fieldId, value);
}

function toggle(itemId: string, checked: boolean) {
  if (readonly.value || !phaseId.value) return;
  store.setChecklistItem(props.projectId, phaseId.value, itemId, checked);
}
</script>

<template>
  <div v-if="!project || !iterationData || !outline" class="missing">
    <h1>Cette page n'existe pas</h1>
    <p>Le projet, l'itération ou la phase demandés sont introuvables.</p>
    <RouterLink to="/" class="btn">Voir tous les projets</RouterLink>
  </div>

  <div v-else class="phase">
    <nav aria-label="Fil d'Ariane" class="crumbs">
      <RouterLink to="/">Tous les projets</RouterLink>
      <span aria-hidden="true">/</span>
      <RouterLink :to="{ name: 'project', params: { projectId: project.id } }">{{ project.name }}</RouterLink>
    </nav>

    <header class="head">
      <p class="position">Itération {{ iterationData.number }}, phase {{ outline.order }} sur 6</p>
      <h1>{{ outline.title }}</h1>
      <p v-if="definition" class="objective">{{ definition.objective }}</p>
    </header>

    <div v-if="readonly" class="readonly-note" role="note">
      <p>
        Tu consultes l'itération {{ iterationData.number }}, qui est terminée : ses réponses sont en lecture seule.
      </p>
      <RouterLink
        :to="{ name: 'phase', params: { projectId: project.id, iteration: currentNumber, phaseId: outline.id } }"
      >
        Aller à l'itération en cours ({{ currentNumber }})
      </RouterLink>
    </div>

    <PhaseIntro v-if="definition" :key="definition.id" :phase="definition" :open="status === 'notStarted' && !readonly" />

    <PersonaReminder
      v-if="outline.order > 1"
      :project-id="project.id"
      :iteration="iterationData"
      :emphasize-metric="outline.id === 'confronter'"
    />

    <div v-if="!definition" class="unavailable">
      <p>Le contenu de cette phase n'est pas encore disponible.</p>
      <p class="summary">{{ outline.summary }}</p>
    </div>

    <form v-else class="fields" @submit.prevent>
      <FieldInput
        v-for="field in definition.fields"
        :key="field.id"
        :field="field"
        :model-value="progress?.answers[field.id]"
        :readonly="readonly"
        @update:model-value="update(field.id, $event)"
      />
    </form>

    <ExitChecklist
      v-if="definition && definition.checklist.length > 0"
      :items="definition.checklist"
      :checked="progress?.checklist ?? {}"
      :when-is-it-done="definition.whenIsItDone"
      :readonly="readonly"
      @toggle="toggle"
    />

    <ExportMenu
      v-if="definition"
      :project="project"
      :iteration="iterationData"
      :phase-id="outline.id"
      :label="`Le document de la phase ${outline.title}`"
    />

    <div v-if="!readonly && definition" class="save-bar">
      <SaveIndicator />
    </div>

    <nav class="neighbours" aria-label="Phases voisines">
      <RouterLink
        v-if="neighbours.previous?.available"
        :to="{ name: 'phase', params: { projectId: project.id, iteration: iterationData.number, phaseId: neighbours.previous.id } }"
        class="btn"
      >
        Phase précédente : {{ neighbours.previous.title }}
      </RouterLink>
      <span v-else></span>

      <RouterLink
        v-if="neighbours.next?.available"
        :to="{ name: 'phase', params: { projectId: project.id, iteration: iterationData.number, phaseId: neighbours.next.id } }"
        class="btn btn-primary"
      >
        Phase suivante : {{ neighbours.next.title }}
      </RouterLink>
      <p v-else-if="neighbours.next" class="next-later">Phase suivante : {{ neighbours.next.title }}, pas encore disponible</p>
      <RouterLink
        v-else-if="!readonly"
        :to="{ name: 'new-iteration', params: { projectId: project.id } }"
        class="btn btn-primary"
      >
        Démarrer l'itération {{ iterationData.number + 1 }}
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.phase {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.crumbs {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  font-size: var(--step--1);
  margin-bottom: calc(-1 * var(--space-5));
}

.crumbs span {
  color: var(--ink-soft);
}

.head {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: var(--measure);
}

.position {
  color: var(--ink-soft);
  font-size: var(--step--1);
}

.head h1 {
  font-size: var(--step-4);
  font-weight: 400;
}

.objective {
  font-family: var(--font-read);
  font-size: var(--step-1);
  line-height: 1.6;
}

.readonly-note {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  border-left: 3px solid var(--brass);
  background: var(--brass-soft);
  border-radius: 0 var(--radius-control) var(--radius-control) 0;
  max-width: var(--measure);
}

.unavailable {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  color: var(--ink-soft);
}

.summary {
  font-family: var(--font-read);
  font-style: italic;
}

.fields {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  max-width: 46rem;
}

.save-bar {
  position: sticky;
  bottom: 0;
  padding: var(--space-3) 0;
  background: var(--paper);
  border-top: 1px solid var(--line);
  margin-top: calc(-1 * var(--space-4));
}

.neighbours {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.next-later {
  color: var(--ink-soft);
  font-size: var(--step--1);
}

.missing {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
}

@media (max-width: 40rem) {
  .head h1 {
    font-size: var(--step-3);
  }
}
</style>
