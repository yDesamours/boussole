<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { Iteration, PhaseStatus } from '@/types/schema';
import { getPhase, PHASE_OUTLINE } from '@/content';
import { phaseStatus } from '@/lib/project';

type StationStatus = PhaseStatus | 'unavailable';

const props = defineProps<{
  projectId: string;
  iteration: Iteration;
  compact?: boolean;
}>();

const LABELS: Record<StationStatus, string> = {
  notStarted: 'Pas commencée',
  incomplete: 'Incomplète',
  done: 'Terminée',
  unavailable: 'À venir',
};

const stations = computed(() => {
  const list = PHASE_OUTLINE.map((outline) => {
    const definition = getPhase(outline.id);
    const status: StationStatus = definition
      ? phaseStatus(definition, props.iteration.phases[outline.id])
      : 'unavailable';
    return { ...outline, status, label: LABELS[status] };
  });
  // La prochaine étape : la première phase disponible qui n'est pas terminée.
  const next = list.find((s) => s.status !== 'done' && s.status !== 'unavailable');
  return list.map((s) => ({ ...s, isNext: s === next }));
});

const summary = computed(() =>
  stations.value.map((s) => `${s.order}. ${s.title} : ${s.label.toLowerCase()}`).join(', '),
);
</script>

<template>
  <ol class="route" :class="{ compact }" :aria-label="compact ? `Avancement — ${summary}` : 'Les six phases'">
    <li
      v-for="station in stations"
      :key="station.id"
      class="station"
      :data-status="station.status"
      :class="{ 'is-next': station.isNext }"
    >
      <component
        :is="station.status === 'unavailable' || compact ? 'span' : RouterLink"
        class="station-body"
        v-bind="
          station.status === 'unavailable' || compact
            ? {}
            : { to: { name: 'phase', params: { projectId, iteration: iteration.number, phaseId: station.id } } }
        "
      >
        <span class="marker" aria-hidden="true"></span>
        <span class="text" :class="{ 'visually-hidden': compact }">
          <span class="title">{{ station.order }}. {{ station.title }}</span>
          <span class="status">{{ station.label }}</span>
        </span>
      </component>
    </li>
  </ol>
</template>

<style scoped>
.route {
  --marker: 1.35rem;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.station {
  position: relative;
  min-width: 0;
}

/* Le tracé : une ligne qui relie chaque station à la précédente. */
.station + .station::before {
  content: '';
  position: absolute;
  top: calc(var(--marker) / 2 - 1px);
  right: calc(50% + var(--marker) / 2 + 4px);
  width: calc(100% - var(--marker) - 8px);
  border-top: 2px solid var(--line);
}

.station[data-status='done'] + .station::before {
  border-top-color: var(--sage);
}

.station[data-status='unavailable']::before {
  border-top-style: dashed;
}

.station-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  text-align: center;
  text-decoration: none;
  color: inherit;
  padding: 0 var(--space-1) var(--space-2);
  border-radius: var(--radius-control);
}

a.station-body:hover .title {
  text-decoration: underline;
}

.marker {
  width: var(--marker);
  height: var(--marker);
  border-radius: 50%;
  border: 2px solid var(--ink-soft);
  background: var(--paper);
  flex: none;
}

.station[data-status='incomplete'] .marker {
  border-color: var(--brass);
  background: linear-gradient(90deg, var(--brass) 50%, var(--paper) 50%);
}

.station[data-status='done'] .marker {
  border-color: var(--sage);
  background: var(--sage);
  box-shadow: inset 0 0 0 3px var(--paper);
}

.station[data-status='unavailable'] .marker {
  border-style: dashed;
  border-color: var(--line);
}

/* La prochaine étape porte l'aiguille. */
.station.is-next .marker {
  outline: 2px solid var(--brass);
  outline-offset: 3px;
}

.text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.title {
  font-family: var(--font-read);
  font-weight: 600;
  font-size: var(--step-0);
  overflow-wrap: anywhere;
}

.status {
  font-size: var(--step--1);
  color: var(--ink-soft);
}

.station[data-status='unavailable'] .title {
  color: var(--ink-soft);
  font-weight: 400;
}

/* Version compacte : uniquement les marqueurs, pour la liste des projets. */
.compact {
  --marker: 0.8rem;
  display: flex;
  gap: 0.55rem;
}

.compact .station + .station::before {
  display: none;
}

.compact .station-body {
  padding: 0;
}

.compact .station.is-next .marker {
  outline-offset: 2px;
  outline-width: 1.5px;
}

/* Sur petit écran, le tracé devient vertical. */
@media (max-width: 40rem) {
  .route:not(.compact) {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .route:not(.compact) .station + .station::before {
    top: calc(-1 * var(--space-4) - 2px);
    left: calc(var(--marker) / 2 - 1px);
    right: auto;
    width: 0;
    height: calc(var(--space-4) + 4px);
    border-top: 0;
    border-left: 2px solid var(--line);
  }

  .route:not(.compact) .station[data-status='done'] + .station::before {
    border-left-color: var(--sage);
  }

  .route:not(.compact) .station[data-status='unavailable']::before {
    border-left-style: dashed;
  }

  .route:not(.compact) .station-body {
    flex-direction: row;
    text-align: left;
    gap: var(--space-3);
    padding: 0;
  }
}
</style>
