<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import CompassMark from '@/components/CompassMark.vue';
import { useProjectsStore } from '@/stores/projects';

const store = useProjectsStore();
const { loadState, persistent } = storeToRefs(store);
const route = useRoute();

/** Le guide et l'exemple restent lisibles même si le stockage local est indisponible. */
const needsStorage = computed(() => route.name !== 'guide' && route.name !== 'example');
</script>

<template>
  <header class="site-header">
    <RouterLink to="/" class="brand">
      <CompassMark :size="26" />
      <span>Boussole</span>
    </RouterLink>
    <nav class="main-nav" aria-label="Navigation principale">
      <RouterLink to="/" :class="{ active: needsStorage }">Mes projets</RouterLink>
      <RouterLink :to="{ name: 'guide' }" active-class="active">Guide</RouterLink>
      <RouterLink :to="{ name: 'example' }" active-class="active">Exemple</RouterLink>
    </nav>
  </header>

  <main class="page">
    <RouterView v-if="!needsStorage" />

    <p v-else-if="loadState === 'loading'" class="loading">Ouverture de tes projets…</p>

    <section v-else-if="loadState === 'error'" class="load-error" role="alert">
      <h1>Boussole n'a pas pu ouvrir son stockage local</h1>
      <p>
        Ton navigateur bloque peut-être le stockage pour ce site, par exemple en navigation privée ou si les données de
        site sont désactivées. Autorise le stockage, puis réessaie.
      </p>
      <button type="button" class="btn btn-primary" @click="store.load()">Réessayer</button>
    </section>

    <RouterView v-else />
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <p>
        Tes projets restent sur cet appareil, dans ce navigateur. Rien n'est envoyé ailleurs. Pour les sauvegarder ou
        les retrouver dans un autre navigateur, exporte-les depuis <RouterLink to="/">l'accueil</RouterLink>.
        <template v-if="persistent === false">
          Ton navigateur n'a pas garanti leur conservation : il pourrait les effacer s'il manque d'espace.
        </template>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-header {
  max-width: 64rem;
  margin: 0 auto;
  padding: var(--space-5) var(--space-4) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.main-nav {
  display: flex;
  gap: var(--space-4);
  font-size: var(--step--1);
  font-weight: 700;
}

.main-nav a {
  text-decoration: none;
  color: var(--ink-soft);
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
}

.main-nav a:hover {
  color: var(--ink);
}

.main-nav a.active {
  color: var(--ink);
  border-bottom-color: var(--brass);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-read);
  font-weight: 600;
  font-size: var(--step-1);
  text-decoration: none;
}

.page {
  max-width: 64rem;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4) var(--space-7);
}

.loading {
  color: var(--ink-soft);
}

.load-error {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: flex-start;
  max-width: var(--measure);
}

.load-error h1 {
  font-size: var(--step-2);
}

.site-footer {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 var(--space-4) var(--space-6);
  color: var(--ink-soft);
  font-size: var(--step--1);
}

.footer-inner {
  padding-top: var(--space-5);
  border-top: 1px solid var(--line);
}

.site-footer p {
  max-width: var(--measure);
}
</style>
