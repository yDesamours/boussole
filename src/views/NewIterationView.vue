<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useProjectsStore } from '@/stores/projects';
import { currentIteration, phaseStatus } from '@/lib/project';
import { getPhase } from '@/content';

const props = defineProps<{ projectId: string }>();

const store = useProjectsStore();
const router = useRouter();

const project = computed(() => store.getProject(props.projectId));
const current = computed(() => (project.value ? currentIteration(project.value) : undefined));
const nextNumber = computed(() => (current.value?.number ?? 0) + 1);

/** Non bloquant : on signale seulement si la boucle actuelle n'a pas été confrontée à la réalité. */
const confronterDone = computed(
  () => current.value !== undefined && phaseStatus(getPhase('confronter'), current.value.phases.confronter) === 'done',
);

/** Ce que la phase Confronter a appris devient la proposition de départ de la nouvelle boucle. */
const fromConfronter = (() => {
  const value = current.value?.phases.confronter.answers.apprentissages;
  return typeof value === 'string' ? value.trim() : '';
})();
const learned = ref(fromConfronter);
const carryOver = ref(true);
const starting = ref(false);
const startError = ref('');
const canStart = computed(() => learned.value.trim() !== '' && !starting.value);

async function start() {
  if (!canStart.value) return;
  starting.value = true;
  startError.value = '';
  try {
    const number = await store.startIteration(props.projectId, learned.value, carryOver.value);
    await router.push({ name: 'phase', params: { projectId: props.projectId, iteration: number, phaseId: 'comprendre' } });
  } catch {
    startError.value =
      'L\'itération n\'a pas pu être enregistrée. Vérifie que ton navigateur autorise le stockage pour ce site, puis réessaie.';
  } finally {
    starting.value = false;
  }
}
</script>

<template>
  <div v-if="!project || !current" class="missing">
    <h1>Ce projet n'existe pas</h1>
    <RouterLink to="/" class="btn">Voir tous les projets</RouterLink>
  </div>

  <div v-else class="new-iteration">
    <nav aria-label="Fil d'Ariane" class="crumbs">
      <RouterLink to="/">Tous les projets</RouterLink>
      <span aria-hidden="true">/</span>
      <RouterLink :to="{ name: 'project', params: { projectId: project.id } }">{{ project.name }}</RouterLink>
    </nav>

    <header class="head">
      <h1>Démarrer l'itération {{ nextNumber }}</h1>
      <p>
        Une nouvelle boucle repart de la phase Comprendre. La première partait d'hypothèses ; celle-ci part de ce que tu
        as observé.
      </p>
    </header>

    <div v-if="!confronterDone" class="warning" role="note">
      La phase Confronter de l'itération {{ current.number }} n'est pas terminée. Tu peux démarrer une nouvelle
      itération quand même, mais elle reposera davantage sur des hypothèses que sur des faits.
    </div>

    <form class="form" @submit.prevent="start">
      <div class="field">
        <label for="learned">Ce que l'itération {{ current.number }} t'a appris</label>
        <p id="learned-help" class="help">
          Qu'as-tu observé en confrontant ton produit à de vrais utilisateurs ? Ce qui a marché, ce qui n'a pas marché, ce
          que ton persona a réellement fait. C'est le point de départ de cette nouvelle boucle.
          <template v-if="fromConfronter">Le texte ci-dessous est repris de ta phase Confronter ; tu peux l'ajuster.</template>
        </p>
        <textarea id="learned" v-model="learned" rows="6" aria-describedby="learned-help"></textarea>
      </div>

      <div class="check">
        <input id="carry-over" v-model="carryOver" type="checkbox" aria-describedby="carry-over-help" />
        <div>
          <label for="carry-over">Reprendre les réponses de l'itération {{ current.number }} pour les affiner</label>
          <p id="carry-over-help" class="help">
            Les checklists repartent toujours à zéro : chaque critère devra être revérifié avec ce que tu as appris.
          </p>
        </div>
      </div>

      <p v-if="startError" class="error" role="alert">{{ startError }}</p>

      <div class="actions">
        <button type="submit" class="btn btn-primary" :disabled="!canStart">
          Démarrer l'itération {{ nextNumber }}
        </button>
        <RouterLink :to="{ name: 'project', params: { projectId: project.id } }" class="btn btn-quiet">
          Annuler
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.new-iteration {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  max-width: 46rem;
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
}

.head h1 {
  font-size: var(--step-3);
  font-weight: 400;
}

.head p {
  font-family: var(--font-read);
  font-size: var(--step-1);
  color: var(--ink-soft);
  line-height: 1.6;
}

.warning {
  padding: var(--space-4);
  border-left: 3px solid var(--brass);
  background: var(--brass-soft);
  border-radius: 0 var(--radius-control) var(--radius-control) 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.help {
  color: var(--ink-soft);
  font-size: var(--step--1);
}

.check {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}

.check input {
  width: 1.15rem;
  height: 1.15rem;
  margin-top: 0.2rem;
  accent-color: var(--brass);
  flex: none;
}

.check label {
  font-weight: 700;
}

.error {
  color: var(--danger);
  font-weight: 700;
}

.actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  align-items: center;
}

.missing {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
}
</style>
