import { createRouter, createWebHashHistory } from 'vue-router';
import ProjectsView from '@/views/ProjectsView.vue';
import ProjectView from '@/views/ProjectView.vue';
import PhaseView from '@/views/PhaseView.vue';
import NewIterationView from '@/views/NewIterationView.vue';
import GuideView from '@/views/GuideView.vue';
import ExampleView from '@/views/ExampleView.vue';

/**
 * Historique par « hash » (#/projets/…) : fonctionne sur n'importe quel hébergement statique,
 * ou en ouvrant simplement le dossier compilé, sans configuration serveur.
 * Les ancres internes s'ajoutent derrière : #/guide#comprendre.
 */
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'projects', component: ProjectsView },
    { path: '/guide', name: 'guide', component: GuideView },
    { path: '/exemple', name: 'example', component: ExampleView },
    { path: '/projets/:projectId', name: 'project', component: ProjectView, props: true },
    { path: '/projets/:projectId/nouvelle-iteration', name: 'new-iteration', component: NewIterationView, props: true },
    {
      path: '/projets/:projectId/iterations/:iteration(\\d+)/:phaseId',
      name: 'phase',
      component: PhaseView,
      props: (route) => ({
        projectId: String(route.params.projectId),
        iteration: Number(route.params.iteration),
        phaseId: String(route.params.phaseId),
      }),
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) {
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      return { el: to.hash, top: 16, behavior: reduceMotion ? 'auto' : 'smooth' };
    }
    return { top: 0 };
  },
});
