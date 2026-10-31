import { createApp } from 'vue';
import { createPinia } from 'pinia';

import '@fontsource/literata/400.css';
import '@fontsource/literata/400-italic.css';
import '@fontsource/literata/600.css';
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/doc.css';

import App from './App.vue';
import { router } from './router';
import { useProjectsStore } from './stores/projects';

const app = createApp(App);
app.use(createPinia());
app.use(router);

const store = useProjectsStore();
void store.load();

// Avant de changer d'écran ou de quitter, on écrit ce qui est en attente.
router.beforeEach(async () => {
  await store.flush();
});
window.addEventListener('pagehide', () => void store.flush());

app.mount('#app');
