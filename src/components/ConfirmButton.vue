<script setup lang="ts">
import { ref } from 'vue';

/** Bouton de suppression en deux temps, sans boîte de dialogue du navigateur. */
const props = defineProps<{ label: string; confirmLabel: string; warning: string }>();
const emit = defineEmits<{ confirm: [] }>();

const armed = ref(false);

function confirm() {
  armed.value = false;
  emit('confirm');
}
</script>

<template>
  <div class="confirm">
    <button v-if="!armed" type="button" class="btn btn-danger" @click="armed = true">{{ props.label }}</button>
    <div v-else class="armed" role="alert">
      <p>{{ props.warning }}</p>
      <div class="actions">
        <button type="button" class="btn btn-danger-solid" @click="confirm">{{ props.confirmLabel }}</button>
        <button type="button" class="btn" @click="armed = false">Annuler</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.armed {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: var(--measure);
}

.actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}
</style>
