<script setup lang="ts">
import { RouterLink } from 'vue-router';
import GuideBlocks from '@/components/GuideBlocks.vue';
import PageToc from '@/components/PageToc.vue';
import { guide } from '@/content/guide';
import type { TocEntry } from '@/types/guide';

const toc: TocEntry[] = guide.sections.map((section) => ({
  id: section.id,
  title: section.title,
  children: section.sections?.map((sub) => ({ id: sub.id, title: sub.title })),
}));
</script>

<template>
  <article class="doc-page">
    <header class="doc-head">
      <h1>{{ guide.title }}</h1>
      <GuideBlocks :blocks="guide.intro" />
      <p class="see-example">
        Tu préfères voir la démarche appliquée ?
        <RouterLink :to="{ name: 'example' }">Parcours le projet exemple</RouterLink>, du premier « pourquoi » à la
        deuxième itération.
      </p>
    </header>

    <div class="doc-layout">
      <PageToc :entries="toc" label="Sommaire" />

      <div class="doc-content">
        <section v-for="section in guide.sections" :id="section.id" :key="section.id" class="doc-section">
          <h2>{{ section.title }}</h2>
          <GuideBlocks :blocks="section.blocks" />

          <section v-for="sub in section.sections" :id="sub.id" :key="sub.id" class="doc-subsection">
            <h3>{{ sub.title }}</h3>
            <GuideBlocks :blocks="sub.blocks" />
          </section>
        </section>
      </div>
    </div>
  </article>
</template>

<style scoped>
.see-example {
  color: var(--ink-soft);
}
</style>
