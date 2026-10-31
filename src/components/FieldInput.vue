<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import type { FieldDefinition, FieldValue, TableRow } from '@/types/schema';
import { framework } from '@/content';
import { detectVagueness, valueToText } from '@/lib/vagueness';

const props = defineProps<{
  field: FieldDefinition;
  modelValue: FieldValue | undefined;
  readonly?: boolean;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: FieldValue] }>();

const inputId = computed(() => `field-${props.field.id}`);
const helpId = computed(() => `field-${props.field.id}-help`);

// ── Texte ─────────────────────────────────────────────────────
const textValue = computed(() => (typeof props.modelValue === 'string' ? props.modelValue : ''));

// ── Liste ─────────────────────────────────────────────────────
// On affiche toujours au moins une ligne, même vide, pour inviter à écrire.
const items = computed<string[]>(() => {
  const value = Array.isArray(props.modelValue) ? (props.modelValue as string[]) : [];
  return value.length > 0 ? value : [''];
});
const listRoot = ref<HTMLElement | null>(null);

function updateItem(index: number, text: string) {
  const next = [...items.value];
  next[index] = text;
  emit('update:modelValue', next);
}

async function addItem(afterIndex = items.value.length - 1) {
  const next = [...items.value];
  next.splice(afterIndex + 1, 0, '');
  emit('update:modelValue', next);
  await nextTick();
  listRoot.value?.querySelectorAll<HTMLInputElement>('input')[afterIndex + 1]?.focus();
}

function removeItem(index: number) {
  emit('update:modelValue', items.value.filter((_, i) => i !== index));
}

// ── Tableau ───────────────────────────────────────────────────
const columns = computed(() => props.field.columns ?? []);
const emptyRow = (): TableRow => Object.fromEntries(columns.value.map((c) => [c.id, '']));
const rows = computed<TableRow[]>(() => {
  const value = Array.isArray(props.modelValue) ? (props.modelValue as TableRow[]) : [];
  return value.length > 0 ? value : [emptyRow()];
});

function updateCell(rowIndex: number, columnId: string, text: string) {
  emit(
    'update:modelValue',
    rows.value.map((row, i) => (i === rowIndex ? { ...row, [columnId]: text } : row)),
  );
}

function addRow() {
  emit('update:modelValue', [...rows.value, emptyRow()]);
}

function removeRow(index: number) {
  emit('update:modelValue', rows.value.filter((_, i) => i !== index));
}

// ── Alertes de flou ───────────────────────────────────────────
// Jamais bloquantes : elles signalent une formulation à vérifier, l'utilisateur reste juge.
const rules = computed(() => [...(props.field.vaguenessRules ?? []), ...framework.globalVaguenessRules]);
const alerts = computed(() => {
  if (props.readonly || props.modelValue === undefined) return [];
  return detectVagueness(valueToText(props.modelValue), rules.value);
});
</script>

<template>
  <div class="field" :data-type="field.type">
    <label :for="field.type === 'list' || field.type === 'table' ? undefined : inputId" :id="`${inputId}-label`">
      {{ field.label }}
      <span v-if="!field.required" class="optional">facultatif</span>
    </label>
    <p :id="helpId" class="help">{{ field.help }}</p>

    <input
      v-if="field.type === 'text'"
      :id="inputId"
      type="text"
      :value="textValue"
      :readonly="readonly"
      :aria-describedby="helpId"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <textarea
      v-else-if="field.type === 'longText'"
      :id="inputId"
      :value="textValue"
      :readonly="readonly"
      :aria-describedby="helpId"
      rows="5"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>

    <div
      v-else-if="field.type === 'list'"
      ref="listRoot"
      role="group"
      :aria-labelledby="`${inputId}-label`"
      :aria-describedby="helpId"
    >
      <component :is="field.ordered ? 'ol' : 'ul'" class="items" :class="{ ordered: field.ordered }">
        <li v-for="(item, index) in items" :key="index" class="item">
          <input
            type="text"
            :value="item"
            :readonly="readonly"
            :aria-label="`${field.label}, ligne ${index + 1}`"
            @input="updateItem(index, ($event.target as HTMLInputElement).value)"
            @keydown.enter.prevent="!readonly && addItem(index)"
          />
          <button
            v-if="!readonly && items.length > 1"
            type="button"
            class="btn btn-quiet remove"
            :aria-label="`Retirer la ligne ${index + 1}`"
            @click="removeItem(index)"
          >
            Retirer
          </button>
        </li>
      </component>
      <button v-if="!readonly" type="button" class="btn add" @click="addItem()">Ajouter une ligne</button>
    </div>

    <div v-else-if="field.type === 'table'" role="group" :aria-labelledby="`${inputId}-label`">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.id" scope="col">{{ column.label }}</th>
              <th v-if="!readonly"><span class="visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
              <td v-for="column in columns" :key="column.id">
                <input
                  type="text"
                  :value="row[column.id] ?? ''"
                  :readonly="readonly"
                  :aria-label="`${column.label}, ligne ${rowIndex + 1}`"
                  @input="updateCell(rowIndex, column.id, ($event.target as HTMLInputElement).value)"
                />
              </td>
              <td v-if="!readonly">
                <button
                  v-if="rows.length > 1"
                  type="button"
                  class="btn btn-quiet"
                  :aria-label="`Retirer la ligne ${rowIndex + 1}`"
                  @click="removeRow(rowIndex)"
                >
                  Retirer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button v-if="!readonly" type="button" class="btn add" @click="addRow">Ajouter une ligne</button>
    </div>

    <div v-if="alerts.length" class="alerts" role="status" aria-live="polite">
      <p class="alerts-title">À vérifier</p>
      <ul>
        <li v-for="message in alerts" :key="message">{{ message }}</li>
      </ul>
    </div>

    <details v-if="field.examples?.length && !readonly" class="examples">
      <summary>Voir un exemple</summary>
      <div v-for="(example, index) in field.examples" :key="index" class="example">
        <div class="version bad">
          <p class="version-label">À éviter</p>
          <p class="version-text">{{ example.bad }}</p>
        </div>
        <div class="version good">
          <p class="version-label">Mieux</p>
          <p class="version-text">{{ example.good }}</p>
        </div>
        <p class="why">{{ example.why }}</p>
      </div>
    </details>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.field > [role='group'] {
  min-width: 0;
}

label {
  font-family: var(--font-read);
  font-size: var(--step-1);
  font-weight: 600;
}

.optional {
  font-family: var(--font-ui);
  font-size: var(--step--1);
  font-weight: 400;
  color: var(--ink-soft);
  margin-left: var(--space-2);
}

.help {
  color: var(--ink-soft);
  max-width: var(--measure);
  margin-bottom: var(--space-1);
}

input[readonly],
textarea[readonly] {
  background: transparent;
  border-style: dashed;
}

.items {
  margin: 0 0 var(--space-3);
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  counter-reset: item;
}

.item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.ordered .item {
  counter-increment: item;
}

.ordered .item::before {
  content: counter(item) '.';
  font-family: var(--font-read);
  color: var(--ink-soft);
  min-width: 1.5rem;
  text-align: right;
}

.add {
  align-self: flex-start;
}

.table-scroll {
  /* Contient les éléments masqués positionnés en absolu (en-têtes accessibles), sinon la page déborde. */
  position: relative;
  overflow-x: auto;
  max-width: 100%;
  margin-bottom: var(--space-3);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 32rem;
}

th {
  text-align: left;
  font-size: var(--step--1);
  color: var(--ink-soft);
  font-weight: 700;
  padding: 0 var(--space-2) var(--space-2) 0;
}

td {
  padding: 0 var(--space-2) var(--space-2) 0;
  vertical-align: top;
}
/* Alertes de flou */
.alerts {
  margin-top: var(--space-1);
  padding: var(--space-3) var(--space-4);
  background: var(--brass-soft);
  border-left: 3px solid var(--brass);
  border-radius: 0 var(--radius-control) var(--radius-control) 0;
  max-width: var(--measure);
}

.alerts-title {
  font-size: var(--step--1);
  font-weight: 700;
  margin-bottom: var(--space-1);
}

.alerts ul {
  margin: 0;
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

/* Exemples bon / mauvais */
.examples summary {
  cursor: pointer;
  font-size: var(--step--1);
  font-weight: 700;
  color: var(--ink-soft);
  width: fit-content;
}

.examples summary:hover {
  color: var(--ink);
}

.example {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  margin-top: var(--space-3);
}

.version {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-control);
  background: var(--surface);
  border: 1px solid var(--line);
}

.version.bad {
  border-top: 3px solid var(--danger);
}

.version.good {
  border-top: 3px solid var(--sage);
}

.version-label {
  font-size: var(--step--1);
  font-weight: 700;
  margin-bottom: var(--space-1);
}

.bad .version-label {
  color: var(--danger);
}

.good .version-label {
  color: var(--sage);
}

.version-text {
  font-family: var(--font-read);
  font-style: italic;
  line-height: 1.6;
  white-space: pre-line;
}

.why {
  grid-column: 1 / -1;
  color: var(--ink-soft);
  font-size: var(--step--1);
  max-width: var(--measure);
}

@media (max-width: 40rem) {
  .example {
    grid-template-columns: 1fr;
  }
}
</style>
