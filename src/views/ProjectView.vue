<script setup lang="ts">
import { computed, ref } from 'vue';
import { downloadText } from '@/lib/download';
import { RouterLink, useRouter } from 'vue-router';
import PhaseRoute from '@/components/PhaseRoute.vue';
import ConfirmButton from '@/components/ConfirmButton.vue';
import ExportMenu from '@/components/ExportMenu.vue';
import { useProjectsStore } from '@/stores/projects';
import { currentIteration, phaseStatus } from '@/lib/project';
import { formatDate } from '@/lib/format';
import { getPhase, PHASE_OUTLINE } from '@/content';

const props = defineProps<{ projectId: string }>();

const store = useProjectsStore();
const router = useRouter();

const project = computed(() => store.getProject(props.projectId));
const current = computed(() => (project.value ? currentIteration(project.value) : undefined));
const pastIterations = computed(() => (project.value ? project.value.iterations.slice(0, -1).reverse() : []));

/** La prochaine phase à travailler : la première disponible qui n'est pas terminée. */
const nextPhase = computed(() => {
  const iteration = current.value;
  if (!iteration) return undefined;
  return PHASE_OUTLINE.find((outline) => {
    const definition = getPhase(outline.id);
    return definition && phaseStatus(definition, iteration.phases[outline.id]) !== 'done';
  });
});

const exported = ref('');

async function exportThis() {
  const { fileName, content } = await store.exportBackup([props.projectId]);
  downloadText(fileName, content);
  exported.value = `Exporté dans ${fileName}.`;
}

async function remove() {
  await store.deleteProject(props.projectId);
  await router.push({ name: 'projects' });
}
</script>

<template>
  <div v-if="!project || !current" class="missing">
    <h1>Ce projet n'existe pas</h1>
    <p>Il a peut-être été supprimé, ou le lien est incorrect.</p>
    <RouterLink to="/" class="btn">Voir tous les projets</RouterLink>
  </div>

  <div v-else class="project">
    <nav aria-label="Fil d'Ariane" class="crumbs">
      <RouterLink to="/">Tous les projets</RouterLink>
    </nav>

    <header class="head">
      <h1>{{ project.name }}</h1>
      <p class="meta">Créé le {{ formatDate(project.createdAt) }}</p>
    </header>

    <section class="current" aria-labelledby="current-title">
      <h2 id="current-title">Itération {{ current.number }}</h2>

      <figure class="starting-point">
        <figcaption>{{ current.number === 1 ? 'L\'idée de départ' : `Ce que l'itération ${current.number - 1} a appris` }}</figcaption>
        <blockquote>{{ current.startingPoint }}</blockquote>
      </figure>

      <PhaseRoute :project-id="project.id" :iteration="current" />

      <div class="continue">
        <RouterLink
          v-if="nextPhase"
          class="btn btn-primary"
          :to="{ name: 'phase', params: { projectId: project.id, iteration: current.number, phaseId: nextPhase.id } }"
        >
          Continuer : {{ nextPhase.title }}
        </RouterLink>
        <p v-else class="all-done">
          Les six phases de cette itération sont terminées. Démarre l'itération suivante avec ce que tu as appris.
        </p>
      </div>

      <ExportMenu :project="project" :iteration="current" :label="`Le document complet de l'itération ${current.number}`" />
    </section>

    <section class="loop" aria-labelledby="loop-title">
      <h2 id="loop-title">Nouvelle itération</h2>
      <p>
        Quand la phase Confronter t'a appris quelque chose, démarre une nouvelle boucle. Tu repars de Comprendre, mais
        avec des faits plutôt que des hypothèses.
      </p>
      <RouterLink class="btn" :to="{ name: 'new-iteration', params: { projectId: project.id } }">
        Démarrer l'itération {{ current.number + 1 }}
      </RouterLink>
    </section>

    <section v-if="pastIterations.length > 0" class="history" aria-labelledby="history-title">
      <h2 id="history-title">Itérations précédentes</h2>
      <ol class="past" reversed>
        <li v-for="iteration in pastIterations" :key="iteration.id" class="past-item">
          <div class="past-head">
            <h3>Itération {{ iteration.number }}</h3>
            <p class="meta">Démarrée le {{ formatDate(iteration.createdAt) }}</p>
          </div>
          <p class="past-start">{{ iteration.startingPoint }}</p>
          <div class="past-foot">
            <PhaseRoute :project-id="project.id" :iteration="iteration" compact />
            <RouterLink
              :to="{ name: 'phase', params: { projectId: project.id, iteration: iteration.number, phaseId: 'comprendre' } }"
            >
              Consulter l'itération {{ iteration.number }}
            </RouterLink>
          </div>
        </li>
      </ol>
    </section>

    <section class="export" aria-labelledby="export-title">
      <h2 id="export-title" class="visually-hidden">Exporter le projet</h2>
      <button type="button" class="btn" @click="exportThis">Exporter ce projet</button>
      <p class="export-help">
        Un fichier de sauvegarde, à importer depuis l'accueil dans un autre navigateur.
        <span v-if="exported" role="status">{{ exported }}</span>
      </p>
    </section>

    <section class="danger" aria-labelledby="danger-title">
      <h2 id="danger-title" class="visually-hidden">Supprimer le projet</h2>
      <ConfirmButton
        label="Supprimer le projet"
        confirm-label="Supprimer définitivement"
        :warning="`« ${project.name} » et ses ${project.iterations.length} itération(s) seront effacés de cet appareil. Cette action est irréversible.`"
        @confirm="remove"
      />
    </section>
  </div>
</template>

<style scoped>
.project {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.crumbs {
  font-size: var(--step--1);
  margin-bottom: calc(-1 * var(--space-5));
}

.head h1 {
  font-size: var(--step-4);
  font-weight: 400;
}

.meta {
  color: var(--ink-soft);
  font-size: var(--step--1);
  margin-top: var(--space-2);
}

h2 {
  font-size: var(--step-2);
}

.current {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-5);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
}

.starting-point {
  margin: 0;
  max-width: var(--measure);
}

.starting-point figcaption {
  font-size: var(--step--1);
  color: var(--ink-soft);
  margin-bottom: var(--space-2);
}

.starting-point blockquote {
  margin: 0;
  padding-left: var(--space-4);
  border-left: 3px solid var(--brass);
  font-family: var(--font-read);
  font-style: italic;
  font-size: var(--step-1);
  line-height: 1.6;
  white-space: pre-line;
}

.continue {
  padding-top: var(--space-2);
}

.all-done {
  color: var(--sage);
  font-weight: 700;
}

.loop {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
}

.loop p {
  max-width: var(--measure);
  color: var(--ink-soft);
}

.past {
  list-style: none;
  margin: var(--space-4) 0 0;
  padding: 0;
  border-top: 1px solid var(--line);
}

.past-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--line);
}

.past-head {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.past-head h3 {
  font-size: var(--step-1);
}

.past-head .meta {
  margin: 0;
}

.past-start {
  font-family: var(--font-read);
  font-style: italic;
  color: var(--ink-soft);
  max-width: var(--measure);
  white-space: pre-line;
}

.past-foot {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.export {
  display: flex;
  align-items: center;
  gap: var(--space-3) var(--space-4);
  flex-wrap: wrap;
  padding-top: var(--space-5);
  border-top: 1px solid var(--line);
}

.export-help {
  color: var(--ink-soft);
  font-size: var(--step--1);
  max-width: 40ch;
}

.export-help span {
  display: block;
  color: var(--sage);
  font-weight: 700;
}

.danger {
  padding-top: var(--space-2);
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

  .current {
    padding: var(--space-4);
  }
}
</style>
