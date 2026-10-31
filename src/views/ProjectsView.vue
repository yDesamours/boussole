<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink, useRouter } from 'vue-router';
import PhaseRoute from '@/components/PhaseRoute.vue';
import BackupPanel from '@/components/BackupPanel.vue';
import { useProjectsStore } from '@/stores/projects';
import { currentIteration } from '@/lib/project';
import { formatDate } from '@/lib/format';

const store = useProjectsStore();
const { sortedProjects } = storeToRefs(store);
const router = useRouter();

const name = ref('');
const idea = ref('');
const creating = ref(false);
const createError = ref('');
const canCreate = computed(() => name.value.trim() !== '' && idea.value.trim() !== '' && !creating.value);

async function create() {
  if (!canCreate.value) return;
  creating.value = true;
  createError.value = '';
  try {
    const id = await store.addProject(name.value, idea.value);
    await router.push({ name: 'project', params: { projectId: id } });
  } catch {
    createError.value =
      'Le projet n\'a pas pu être enregistré. Vérifie que ton navigateur autorise le stockage pour ce site, puis réessaie.';
  } finally {
    creating.value = false;
  }
}
</script>

<template>
  <div class="projects">
    <section class="intro">
      <h1>De l'idée vague au premier jour de code.</h1>
      <p>
        Boussole te guide en six phases pour savoir quoi construire, pour qui, et comment savoir si ça a marché. Puis
        elle recommence, à chaque nouvelle version de ton produit.
      </p>
      <p class="discover">
        Nouveau ici ? <RouterLink :to="{ name: 'guide' }">Lis le guide du framework</RouterLink> ou
        <RouterLink :to="{ name: 'example' }">parcours un projet exemple complet</RouterLink> avant de te lancer.
      </p>
    </section>

    <section class="new" aria-labelledby="new-title">
      <h2 id="new-title">Nouveau projet</h2>
      <form @submit.prevent="create">
        <div class="field">
          <label for="project-name">Nom du projet</label>
          <input id="project-name" v-model="name" type="text" autocomplete="off" />
        </div>
        <div class="field">
          <label for="project-idea">Ton idée de départ</label>
          <p id="project-idea-help" class="help">
            Écris-la telle qu'elle te vient, même vague. C'est exactement le point de départ attendu, et tu la
            retrouveras plus tard pour mesurer le chemin parcouru.
          </p>
          <textarea id="project-idea" v-model="idea" rows="3" aria-describedby="project-idea-help"></textarea>
        </div>
        <p v-if="createError" class="error" role="alert">{{ createError }}</p>
        <div>
          <button type="submit" class="btn btn-primary" :disabled="!canCreate">Créer le projet</button>
        </div>
      </form>
    </section>

    <section class="list" aria-labelledby="list-title">
      <h2 id="list-title">Tes projets</h2>
      <p v-if="sortedProjects.length === 0" class="empty">
        Aucun projet pour l'instant. Écris ton idée ci-dessus pour commencer, ou importe une sauvegarde ci-dessous.
      </p>
      <ul v-else class="rows">
        <li v-for="project in sortedProjects" :key="project.id" class="row">
          <div class="row-main">
            <RouterLink :to="{ name: 'project', params: { projectId: project.id } }" class="row-name">
              {{ project.name }}
            </RouterLink>
            <p class="row-idea">{{ project.iterations[0]?.startingPoint }}</p>
          </div>
          <div class="row-meta">
            <PhaseRoute :project-id="project.id" :iteration="currentIteration(project)" compact />
            <p class="row-date">
              <template v-if="project.iterations.length > 1">Itération {{ currentIteration(project).number }}, </template>
              modifié le {{ formatDate(project.updatedAt) }}
            </p>
          </div>
        </li>
      </ul>
    </section>

    <BackupPanel />
  </div>
</template>

<style scoped>
.projects {
  display: flex;
  flex-direction: column;
  gap: var(--space-7);
}

.intro {
  max-width: 40rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.intro h1 {
  font-size: var(--step-4);
  font-weight: 400;
  letter-spacing: -0.01em;
}

.intro p {
  font-family: var(--font-read);
  font-size: var(--step-1);
  line-height: 1.6;
  color: var(--ink-soft);
}

.intro .discover {
  font-family: var(--font-ui);
  font-size: var(--step-0);
  color: var(--ink);
}

h2 {
  font-size: var(--step-2);
  margin-bottom: var(--space-4);
}

.new form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  max-width: 40rem;
  padding: var(--space-5);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
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

.error {
  color: var(--danger);
  font-weight: 700;
}

.empty {
  color: var(--ink-soft);
}

.rows {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--line);
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-5);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--line);
}

.row-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.row-name {
  font-family: var(--font-read);
  font-weight: 600;
  font-size: var(--step-1);
  text-decoration: none;
}

.row-name:hover {
  text-decoration: underline;
}

.row-idea {
  color: var(--ink-soft);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 44ch;
}

.row-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-2);
  flex: none;
}

.row-date {
  font-size: var(--step--1);
  color: var(--ink-soft);
}

@media (max-width: 40rem) {
  .row {
    flex-direction: column;
    align-items: flex-start;
  }

  .row-meta {
    align-items: flex-start;
  }

  .intro h1 {
    font-size: var(--step-3);
  }
}
</style>
