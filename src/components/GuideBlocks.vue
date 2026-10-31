<script setup lang="ts">
import type { GuideBlock } from '@/types/guide';
import RichText from './RichText.vue';

defineProps<{ blocks: GuideBlock[] }>();
</script>

<template>
  <div class="blocks">
    <template v-for="(block, index) in blocks" :key="index">
      <h3 v-if="block.kind === 'heading'" class="heading">{{ block.text }}</h3>

      <p v-else-if="block.kind === 'paragraph'" class="paragraph"><RichText :text="block.text" /></p>

      <component :is="block.ordered ? 'ol' : 'ul'" v-else-if="block.kind === 'list'" class="list">
        <li v-for="(item, i) in block.items" :key="i"><RichText :text="item" /></li>
      </component>

      <p v-else-if="block.kind === 'rule'" class="rule"><RichText :text="block.text" /></p>

      <div v-else-if="block.kind === 'example'" class="example">
        <div class="version bad">
          <p class="version-label">{{ block.badLabel ?? 'À éviter' }}</p>
          <p class="version-text"><RichText :text="block.bad" /></p>
        </div>
        <div class="version good">
          <p class="version-label">{{ block.goodLabel ?? 'Mieux' }}</p>
          <p class="version-text"><RichText :text="block.good" /></p>
        </div>
        <p class="why"><RichText :text="block.why" /></p>
      </div>

      <div v-else-if="block.kind === 'table'" class="table-scroll">
        <table>
          <thead>
            <tr>
              <th v-for="header in block.headers" :key="header" scope="col">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, r) in block.rows" :key="r">
              <td v-for="(cell, c) in row" :key="c" :data-label="block.headers[c]"><RichText :text="cell" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="block.kind === 'answer'" class="answer">
        <p class="answer-label">{{ block.label }}</p>
        <p v-if="block.text" class="answer-text"><RichText :text="block.text" /></p>
        <component :is="block.ordered ? 'ol' : 'ul'" v-if="block.items" class="answer-items">
          <li v-for="(item, i) in block.items" :key="i"><RichText :text="item" /></li>
        </component>
      </div>

      <aside v-else-if="block.kind === 'remark'" class="remark">
        <p class="remark-label">À remarquer</p>
        <p><RichText :text="block.text" /></p>
      </aside>
    </template>
  </div>
</template>

<style scoped>
.blocks {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.heading {
  font-size: var(--step-1);
  margin-top: var(--space-2);
}

.paragraph,
.list {
  font-family: var(--font-read);
  font-size: var(--step-0);
  line-height: 1.7;
  max-width: var(--measure);
}

.list {
  margin: 0;
  padding-left: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.list li::marker {
  color: var(--ink-soft);
}

.rule {
  max-width: var(--measure);
  font-family: var(--font-read);
  font-size: var(--step-1);
  line-height: 1.5;
  padding-left: var(--space-4);
  border-left: 3px solid var(--brass);
}

/* Bon / mauvais exemple */
.example {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  max-width: 46rem;
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
}

.why {
  grid-column: 1 / -1;
  color: var(--ink-soft);
  max-width: var(--measure);
}

/* Tableaux */
.table-scroll {
  /* Contient les éléments masqués positionnés en absolu (en-têtes accessibles), sinon la page déborde. */
  position: relative;
  overflow-x: auto;
  max-width: 100%;
}

table {
  border-collapse: collapse;
  width: 100%;
  min-width: 34rem;
  font-size: var(--step--1);
  line-height: 1.5;
}

th {
  text-align: left;
  font-weight: 700;
  padding: var(--space-2) var(--space-3) var(--space-2) 0;
  border-bottom: 2px solid var(--ink-soft);
}

td {
  padding: var(--space-2) var(--space-3) var(--space-2) 0;
  border-bottom: 1px solid var(--line);
  vertical-align: top;
}

td:first-child {
  font-weight: 700;
}

/* Réponse du projet exemple */
.answer {
  max-width: 46rem;
  padding: var(--space-4);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.answer-label {
  font-size: var(--step--1);
  font-weight: 700;
  color: var(--ink-soft);
}

.answer-text,
.answer-items {
  font-family: var(--font-read);
  line-height: 1.65;
}

.answer-items {
  margin: 0;
  padding-left: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Commentaire pédagogique */
.remark {
  max-width: 46rem;
  padding: var(--space-3) var(--space-4);
  background: var(--brass-soft);
  border-left: 3px solid var(--brass);
  border-radius: 0 var(--radius-control) var(--radius-control) 0;
  line-height: 1.6;
}

.remark-label {
  font-size: var(--step--1);
  font-weight: 700;
  margin-bottom: var(--space-1);
}

@media (max-width: 40rem) {
  .example {
    grid-template-columns: 1fr;
  }

  /* Sur petit écran, chaque ligne de tableau devient une fiche, chaque cellule porte son en-tête. */
  table {
    min-width: 0;
  }

  thead {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  tr {
    display: block;
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--line);
  }

  td {
    display: block;
    border: 0;
    padding: var(--space-1) 0;
  }

  td::before {
    content: attr(data-label);
    display: block;
    font-weight: 400;
    font-size: 0.8rem;
    color: var(--ink-soft);
  }

  td:first-child::before {
    content: none;
  }

  td:first-child {
    font-size: var(--step-0);
  }
}
</style>
