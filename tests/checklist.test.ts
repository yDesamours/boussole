import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ExitChecklist from '@/components/ExitChecklist.vue';
import { comprendre } from '@/content/comprendre';

const allChecked = Object.fromEntries(comprendre.checklist.map((item) => [item.id, true]));

function mountChecklist(checked: Record<string, boolean>, readonly = false) {
  return mount(ExitChecklist, {
    props: { items: comprendre.checklist, checked, whenIsItDone: comprendre.whenIsItDone, readonly },
  });
}

describe('ExitChecklist', () => {
  it('affiche un point par élément de la checklist', () => {
    expect(mountChecklist({}).findAll('input[type="checkbox"]')).toHaveLength(comprendre.checklist.length);
  });

  it('émet toggle quand on coche un point', async () => {
    const wrapper = mountChecklist({});
    await wrapper.find('input[type="checkbox"]').setValue(true);
    expect(wrapper.emitted('toggle')?.[0]).toEqual([comprendre.checklist[0]!.id, true]);
  });

  it('indique la progression tant que tout n\'est pas coché, sans bloquer', () => {
    const text = mountChecklist({ [comprendre.checklist[0]!.id]: true }).find('.outcome').text();
    expect(text).toContain(`1 point validé sur ${comprendre.checklist.length}`);
    expect(text).toContain('Tu peux continuer quand même');
  });

  it('annonce la fin de phase quand tout est coché', () => {
    expect(mountChecklist(allChecked).find('.outcome').text()).toContain('Phase terminée');
  });

  it('désactive les cases en lecture seule', () => {
    const boxes = mountChecklist({}, true).findAll('input[type="checkbox"]');
    expect(boxes.every((box) => (box.element as HTMLInputElement).disabled)).toBe(true);
  });
});
