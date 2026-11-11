// Button Menu sections and section permissions (card/src/data.ts)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { statusLayout, menuTargets, menuColumns, newMenuId, permissionText, menuButtonDefault } from '../card/src/data.ts';

const cfg = {
  status_sections: [{ id: 'house', name: 'House Mode Status' }],
  button_menus: [
    { id: 'm1', name: 'Menu', buttons: [{ section: 'keypad' }, { section: 'history', action: 'popup' }, { section: 'alarm', action: 'popup' }] },
    { id: 'm2', buttons: [{ section: 'alarm' }, { section: 'menu:m1' }] },
  ],
  section_order: ['menu:m1', 'status:house', 'alarm'],
};

test('menus are in the section order; missing ones appended', () => {
  const { order } = statusLayout(cfg);
  assert.deepEqual(order, ['menu:m1', 'status:house', 'alarm', 'menu:m2', 'house_modes', 'keypad', 'history']);
  // old configs (no status_sections) get the menus first
  const old = statusLayout({ button_menus: [{ id: 'm1' }] }).order;
  assert.equal(old[0], 'menu:m1');
});

test('targets: toggle wins over popup; menus cannot be targets; hidden menus ignored', () => {
  assert.deepEqual(menuTargets(cfg.button_menus), { keypad: 'toggle', history: 'popup', alarm: 'toggle' });
  assert.deepEqual(menuTargets([{ ...cfg.button_menus[0], show: false }]), {});
});

test('columns, ids, button defaults', () => {
  assert.equal(menuColumns({ id: 'x' }, 3), 3);
  assert.equal(menuColumns({ id: 'x' }, 8), 5);
  assert.equal(menuColumns({ id: 'x', columns: 2 }, 8), 2);
  assert.equal(newMenuId([{ id: 'm1' }, { id: 'm3' }]), 'm2');
  assert.deepEqual(menuButtonDefault('status:s1', 'Mine'), { label: 'Mine', icon: 'mdi:information-outline' });
  assert.equal(menuButtonDefault('keypad').label, 'Panel keypad');
});

test('permissions: All, admins, users, codes', () => {
  const p = { keypad: { mode: 'admins', users: [] }, alarm: { arm_code: false, disarm_code: true, arm_users: ['A'], disarm_users: ['A', 'B'] } };
  assert.equal(permissionText('history', p), 'All');
  assert.equal(permissionText('house_modes', p), 'All');
  assert.equal(permissionText('keypad', p), 'Administrators');
  assert.equal(permissionText('keypad', { ...p, keypad: { mode: 'users', users: ['Kim'] } }), 'Administrators, Kim');
  assert.equal(permissionText('keypad', { ...p, keypad: { mode: 'users', users: [] } }), 'Administrators');
  assert.equal(permissionText('keypad', { ...p, keypad: { mode: 'all', users: [] } }), 'All');
  assert.equal(permissionText('keypad', { ...p, keypad: { mode: 'off', users: [] } }), 'Nobody (keypad input is off)');
  assert.equal(permissionText('alarm', p), 'Arm: All · Disarm: codes of A, B');
  assert.equal(permissionText('alarm', { ...p, alarm: { ...p.alarm, disarm_code: false } }), 'All');
  assert.equal(permissionText('keypad'), '…');
});

test('menus inside a Status section; a missing Status section leaves the menu on its own', async () => {
  const { embeddedMenus } = await import('../card/src/data.ts');
  const menus = [{ id: 'm1', embed_in: 'status:house' }, { id: 'm2', embed_in: 'status:gone' }, { id: 'm3' }];
  assert.deepEqual(embeddedMenus(menus, ['status:house']), { 'status:house': [menus[0]] });
});
