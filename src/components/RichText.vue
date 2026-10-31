<script setup lang="ts">
import { computed } from 'vue';

/**
 * Affiche un texte où **double astérisque** met en gras et *astérisque simple* en italique.
 * Aucun HTML n'est interprété.
 */
const props = defineProps<{ text: string }>();

type Segment = { part: string; style: 'plain' | 'bold' | 'italic' };

const segments = computed<Segment[]>(() =>
  props.text
    .split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g)
    .filter((part) => part !== '')
    .map((part) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return { part: part.slice(2, -2), style: 'bold' };
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return { part: part.slice(1, -1), style: 'italic' };
      return { part, style: 'plain' };
    }),
);
</script>

<template>
  <template v-for="(segment, index) in segments" :key="index">
    <strong v-if="segment.style === 'bold'">{{ segment.part }}</strong>
    <em v-else-if="segment.style === 'italic'">{{ segment.part }}</em>
    <template v-else>{{ segment.part }}</template>
  </template>
</template>
