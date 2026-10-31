<script setup lang="ts">
import { computed, ref } from 'vue';
import { useProjectsStore } from '@/stores/projects';
import { BackupError, countActions, parseBackup, planImport, type ImportAction, type ImportPlanItem } from '@/lib/backup';
import { downloadText } from '@/lib/download';

const store = useProjectsStore();

const fileInput = ref<HTMLInputElement | null>(null);
const plan = ref<ImportPlanItem[] | null>(null);
const fileName = ref('');
const error = ref('');
const result = ref('');
const busy = ref(false);

const ACTION_LABELS: Record<ImportAction, string> = {
  add: 'Nouveau : sera ajouté',
  update: 'Version plus récente que celle de cet appareil : la remplacera',
  skip: 'Déjà à jour : rien à faire',
  copy: 'La version de cet appareil est plus récente : celle du fichier sera ajoutée comme copie',
};

const counts = computed(() => (plan.value ? countActions(plan.value) : null));
const hasChanges = computed(() => plan.value?.some((item) => item.action !== 'skip') ?? false);

function reset() {
  plan.value = null;
  fileName.value = '';
  error.value = '';
  if (fileInput.value) fileInput.value.value = '';
}

async function exportAll() {
  result.value = '';
  error.value = '';
  try {
    const { fileName: name, content } = await store.exportBackup();
    downloadText(name, content);
    result.value = `${store.projects.length} projet${store.projects.length > 1 ? 's' : ''} exporté${store.projects.length > 1 ? 's' : ''} dans ${name}.`;
  } catch {
    error.value = 'L\'export a échoué. Réessaie ; si le problème persiste, recharge la page.';
  }
}

function chooseFile() {
  result.value = '';
  reset();
  fileInput.value?.click();
}

async function onFileChosen(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  fileName.value = file.name;
  try {
    const incoming = parseBackup(await file.text());
    if (incoming.length === 0) {
      error.value = 'Cette sauvegarde ne contient aucun projet.';
      return;
    }
    plan.value = planImport(store.projects, incoming);
  } catch (e) {
    error.value = e instanceof BackupError ? e.message : 'Le fichier n\'a pas pu être lu.';
  }
}

function summary(c: Record<ImportAction, number>): string {
  const parts = [
    c.add && `${c.add} ajouté${c.add > 1 ? 's' : ''}`,
    c.update && `${c.update} mis à jour`,
    c.copy && `${c.copy} ajouté${c.copy > 1 ? 's' : ''} comme copie`,
    c.skip && `${c.skip} déjà à jour`,
  ].filter(Boolean);
  return parts.join(', ');
}

async function confirmImport() {
  if (!plan.value || !counts.value) return;
  busy.value = true;
  try {
    await store.applyImport(plan.value);
    result.value = `Import terminé : ${summary(counts.value)}.`;
    reset();
  } catch {
    error.value =
      'L\'import n\'a pas pu être enregistré, et rien n\'a été modifié. Vérifie que ton navigateur autorise le stockage pour ce site.';
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <section class="backup" aria-labelledby="backup-title">
    <h2 id="backup-title">Sauvegarder et changer de navigateur</h2>
    <p class="explain">
      Tes projets ne vivent que dans ce navigateur. Exporte-les dans un fichier pour les sauvegarder, ou pour les
      retrouver ailleurs : importe ce fichier dans l'autre navigateur. Un import n'efface jamais un travail plus récent.
    </p>

    <div class="actions">
      <button type="button" class="btn" :disabled="store.projects.length === 0" @click="exportAll">
        Exporter tous mes projets
      </button>
      <button type="button" class="btn" @click="chooseFile">Importer une sauvegarde</button>
      <input
        ref="fileInput"
        type="file"
        accept=".json,application/json"
        class="visually-hidden"
        tabindex="-1"
        aria-hidden="true"
        @change="onFileChosen"
      />
    </div>

    <p v-if="result" class="result" role="status">{{ result }}</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <div v-if="plan && counts" class="preview" role="region" aria-labelledby="preview-title">
      <h3 id="preview-title">Aperçu de l'import</h3>
      <p class="preview-file">{{ fileName }} contient {{ plan.length }} projet{{ plan.length > 1 ? 's' : '' }}.</p>

      <ul class="items">
        <li v-for="item in plan" :key="item.sourceName + item.action + item.project.id" :data-action="item.action">
          <span class="name">{{ item.sourceName }}</span>
          <span class="action">{{ ACTION_LABELS[item.action] }}</span>
        </li>
      </ul>

      <p v-if="!hasChanges" class="nothing">Tout est déjà à jour sur cet appareil. Il n'y a rien à importer.</p>

      <div class="actions">
        <button v-if="hasChanges" type="button" class="btn btn-primary" :disabled="busy" @click="confirmImport">
          Importer
        </button>
        <button type="button" class="btn" @click="reset">{{ hasChanges ? 'Annuler' : 'Fermer' }}</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.backup {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 46rem;
}

h2 {
  font-size: var(--step-2);
}

.explain {
  color: var(--ink-soft);
  max-width: var(--measure);
}

.actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result {
  color: var(--sage);
  font-weight: 700;
}

.error {
  color: var(--danger);
  font-weight: 700;
}

.preview {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 3px solid var(--brass);
  border-radius: var(--radius-panel);
}

.preview h3 {
  font-size: var(--step-1);
}

.preview-file {
  color: var(--ink-soft);
  font-size: var(--step--1);
  overflow-wrap: anywhere;
}

.items {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--line);
}

.items li {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--line);
}

.name {
  font-family: var(--font-read);
  font-weight: 600;
}

.action {
  font-size: var(--step--1);
  color: var(--ink-soft);
}

[data-action='copy'] .action {
  color: var(--brass);
  font-weight: 700;
}

.nothing {
  color: var(--ink-soft);
}
</style>
