<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useProjectsStore } from '@/stores/projects';

const { saveState } = storeToRefs(useProjectsStore());
</script>

<template>
  <p class="save" :data-state="saveState" role="status" aria-live="polite">
    <template v-if="saveState === 'saving'">Enregistrement…</template>
    <template v-else-if="saveState === 'saved'">Enregistré sur cet appareil</template>
    <template v-else-if="saveState === 'error'">
      Échec de l'enregistrement : tes dernières modifications ne sont pas sauvegardées. Vérifie que ton navigateur
      autorise le stockage pour ce site, puis modifie un champ pour réessayer.
    </template>
  </p>
</template>

<style scoped>
.save {
  font-size: var(--step--1);
  color: var(--ink-soft);
  min-height: 1.4em;
}

.save[data-state='error'] {
  color: var(--danger);
  font-weight: 700;
}
</style>
