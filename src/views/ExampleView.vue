<script setup lang="ts">
import { RouterLink } from 'vue-router';
import GuideBlocks from '@/components/GuideBlocks.vue';
import PageToc from '@/components/PageToc.vue';
import { example } from '@/content/example';
import { PHASE_OUTLINE } from '@/content';
import type { PhaseId } from '@/types/schema';
import type { TocEntry } from '@/types/guide';

const phaseTitle = (id: PhaseId) => {
  const outline = PHASE_OUTLINE.find((p) => p.id === id);
  return outline ? `${outline.order}. ${outline.title}` : id;
};

const sectionId = (iteration: number, phaseId: PhaseId) => `v${iteration}-${phaseId}`;

const toc: TocEntry[] = example.iterations.map((iteration) => ({
  id: `iteration-${iteration.number}`,
  title: `Itération ${iteration.number}`,
  children: iteration.phases.map((phase) => ({
    id: sectionId(iteration.number, phase.phaseId),
    title: phaseTitle(phase.phaseId),
  })),
}));
</script>

<template>
  <article class="doc-page">
    <header class="doc-head">
      <p class="kicker">Projet exemple</p>
      <h1>{{ example.name }}</h1>
      <p class="pitch">{{ example.pitch }}</p>
      <p class="disclaimer">{{ example.disclaimer }}</p>
      <p class="how">
        Chaque phase montre les réponses du projet, des commentaires sur ce qu'il faut remarquer, et parfois une première
        version corrigée. Pour les règles derrière chaque choix, garde
        <RouterLink :to="{ name: 'guide' }">le guide</RouterLink> ouvert à côté.
      </p>
    </header>

    <div class="doc-layout">
      <PageToc :entries="toc" label="Parcours" />

      <div class="doc-content">
        <section
          v-for="iteration in example.iterations"
          :id="`iteration-${iteration.number}`"
          :key="iteration.number"
          class="doc-section"
        >
          <h2>Itération {{ iteration.number }}</h2>

          <figure class="starting-point">
            <figcaption>{{ iteration.startingPointLabel }}</figcaption>
            <blockquote>{{ iteration.startingPoint }}</blockquote>
          </figure>
          <p v-if="iteration.status" class="status">{{ iteration.status }}</p>

          <section
            v-for="phase in iteration.phases"
            :id="sectionId(iteration.number, phase.phaseId)"
            :key="phase.phaseId"
            class="doc-subsection"
          >
            <div class="phase-head">
              <h3>{{ phaseTitle(phase.phaseId) }}</h3>
              <RouterLink :to="{ name: 'guide', hash: `#${phase.phaseId}` }" class="guide-link">
                Revoir cette phase dans le guide
              </RouterLink>
            </div>
            <GuideBlocks :blocks="phase.blocks" />
          </section>
        </section>
      </div>
    </div>
  </article>
</template>

<style scoped>
.kicker {
  color: var(--brass);
  font-weight: 700;
  font-size: var(--step--1);
}

.doc-head h1 {
  margin-top: calc(-1 * var(--space-3));
}

.pitch {
  font-family: var(--font-read);
  font-size: var(--step-1);
  line-height: 1.5;
}

.disclaimer,
.how {
  color: var(--ink-soft);
  max-width: var(--measure);
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
}

.status {
  font-weight: 700;
  color: var(--brass);
}

.phase-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.guide-link {
  font-size: var(--step--1);
}
</style>
