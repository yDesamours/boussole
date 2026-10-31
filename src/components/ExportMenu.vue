<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ExportFormat, Iteration, PhaseId, Project } from '@/types/schema';
import { useProjectsStore } from '@/stores/projects';
import { buildIterationDocument, buildPhaseDocument, documentFileBase } from '@/lib/document';
import { EXPORT_FORMATS, getExporter } from '@/lib/exporters';
import { downloadBlob } from '@/lib/download';

/** Exporte le document d'une phase, ou d'une itération entière si aucune phase n'est donnée. */
const props = defineProps<{ project: Project; iteration: Iteration; phaseId?: PhaseId; label: string }>();

const store = useProjectsStore();
const STORAGE_KEY = 'boussole.exportFormat';

function rememberedFormat(): ExportFormat {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (EXPORT_FORMATS.some((f) => f.format === saved)) return saved as ExportFormat;
  } catch {
    // Stockage indisponible : on garde le format par défaut.
  }
  return 'markdown';
}

const format = ref<ExportFormat>(rememberedFormat());
const busy = ref(false);
const message = ref('');
const error = ref('');
const selectId = computed(() => `export-format-${props.phaseId ?? 'iteration'}`);

watch(format, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Préférence non retenue : sans conséquence.
  }
});

async function exportDocument() {
  busy.value = true;
  message.value = '';
  error.value = '';
  try {
    await store.flush();
    const doc = props.phaseId
      ? buildPhaseDocument(props.project, props.iteration, props.phaseId)
      : buildIterationDocument(props.project, props.iteration);
    const exporter = await getExporter(format.value);
    const fileName = `${documentFileBase(props.project, props.iteration, props.phaseId)}.${exporter.fileExtension}`;
    downloadBlob(fileName, await exporter.export(doc));
    message.value = `Document téléchargé : ${fileName}`;
  } catch {
    error.value = 'Le document n\'a pas pu être généré. Réessaie, ou choisis un autre format.';
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <section class="export" :aria-label="label">
    <h2 class="title">{{ label }}</h2>
    <p class="help">
      Toutes les réponses, avec les champs non remplis et les critères de sortie non validés signalés.
    </p>
    <div class="controls">
      <label :for="selectId" class="visually-hidden">Format du document</label>
      <select :id="selectId" v-model="format">
        <option v-for="f in EXPORT_FORMATS" :key="f.format" :value="f.format">{{ f.label }}</option>
      </select>
      <button type="button" class="btn" :disabled="busy" @click="exportDocument">
        {{ busy ? 'Préparation…' : 'Télécharger le document' }}
      </button>
    </div>
    <p v-if="message" class="message" role="status">{{ message }}</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
  </section>
</template>

<style scoped>
.export {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 46rem;
}

.title {
  font-size: var(--step-1);
}

.help {
  color: var(--ink-soft);
  font-size: var(--step--1);
}

.controls {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  align-items: center;
  margin-top: var(--space-1);
}

select {
  font: inherit;
  font-size: var(--step--1);
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  padding: var(--space-2) var(--space-3);
  min-height: 2.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: progress;
}

.message {
  color: var(--sage);
  font-weight: 700;
  font-size: var(--step--1);
  overflow-wrap: anywhere;
}

.error {
  color: var(--danger);
  font-weight: 700;
}
</style>
