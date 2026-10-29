// Native Home Assistant scenes: capture, edit, save — ported from the Color Light & Scene Manager card's Scene Manager.
// Scenes are written with HA's scene config API (config/scene/config/<id>), the endpoint HA's own scene editor uses,
// so they are ordinary scene.* entities. Pure helpers here are unit-tested; the API calls need hass.
import type { HomeAssistant } from '../types';

/** Domains that can be scene members, and the attributes captured per domain. */
export const SCENE_DOMAINS: Record<string, string[]> = {
  light: ['brightness', 'effect', 'color_temp_kelvin', 'rgb_color', 'rgbw_color', 'rgbww_color', 'xy_color', 'hs_color'],
  switch: [],
  fan: ['percentage', 'preset_mode', 'oscillating', 'direction'],
  cover: ['current_position', 'current_tilt_position'],
  climate: ['temperature', 'target_temp_low', 'target_temp_high', 'hvac_mode', 'fan_mode', 'preset_mode', 'swing_mode', 'humidity'],
  media_player: ['volume_level', 'source', 'sound_mode'],
  input_boolean: [],
  input_number: [],
  input_select: [],
  select: [],
  lock: [],
  humidifier: ['humidity', 'mode'],
};
export type SceneMember = Record<string, any>;
export type SceneConfig = { id: string; name: string; icon?: string; entities: Record<string, SceneMember> };
type StateLike = { state: string; attributes: Record<string, any> };

export const domainOf = (entityId: string) => String(entityId || '').split('.')[0];
export const sceneSupported = (entityId: string) => Object.prototype.hasOwnProperty.call(SCENE_DOMAINS, domainOf(entityId));

/** One entity's current state as a scene member (lights: on/off, brightness, one colour format, effect). */
export const captureMember = (entityId: string, st: StateLike | undefined, transition = 0): SceneMember | null => {
  if (!st || !sceneSupported(entityId)) return null;
  const a = st.attributes || {};
  if (domainOf(entityId) === 'light') {
    if (st.state !== 'on') return { state: 'off' };
    const e: SceneMember = { state: 'on' };
    if (a.brightness != null) e.brightness = a.brightness;
    if (a.color_mode === 'color_temp' && a.color_temp_kelvin != null) e.color_temp_kelvin = a.color_temp_kelvin;
    else if (Array.isArray(a.rgbww_color)) e.rgbww_color = a.rgbww_color;
    else if (Array.isArray(a.rgbw_color)) e.rgbw_color = a.rgbw_color;
    else if (Array.isArray(a.xy_color)) e.xy_color = a.xy_color;
    else if (Array.isArray(a.hs_color)) e.hs_color = a.hs_color;
    else if (Array.isArray(a.rgb_color)) e.rgb_color = a.rgb_color;
    else if (a.color_temp_kelvin != null) e.color_temp_kelvin = a.color_temp_kelvin;
    if (a.effect && a.effect !== 'None' && a.effect !== 'none') e.effect = a.effect;
    if (transition > 0) e.transition = transition;
    return e;
  }
  const e: SceneMember = { state: st.state };
  SCENE_DOMAINS[domainOf(entityId)].forEach(k => {
    if (a[k] !== undefined && a[k] !== null) e[k] = a[k];
  });
  return e;
};

/** Capture several entities. */
export const captureMembers = (ids: string[], states: Record<string, StateLike>, transition = 0) => {
  const out: Record<string, SceneMember> = {};
  ids.forEach(id => {
    const m = captureMember(id, states[id], transition);
    if (m) out[id] = m;
  });
  return out;
};

/** A member with a field set (undefined removes it). Light colour formats replace each other. */
export const patchMember = (m: SceneMember, patch: Record<string, any>): SceneMember => {
  const COLOR = ['color_temp_kelvin', 'rgb_color', 'rgbw_color', 'rgbww_color', 'xy_color', 'hs_color'];
  const out = { ...m };
  if (Object.keys(patch).some(k => COLOR.includes(k))) COLOR.forEach(k => delete out[k]);
  Object.keys(patch).forEach(k => {
    if (patch[k] === undefined) delete out[k];
    else out[k] = patch[k];
  });
  return out;
};

/** "#ff8800" <-> [255, 136, 0] */
export const hexToRgb = (hex: string): number[] => {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [255, 255, 255];
};
export const rgbToHex = (rgb: number[] | undefined): string =>
  '#' + (rgb && rgb.length >= 3 ? rgb : [255, 255, 255]).slice(0, 3).map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

/** Short summary of a member, e.g. "on · 60 % · 2700 K". */
export const describeMember = (m: SceneMember): string => {
  const parts = [String(m.state ?? '')];
  if (m.brightness != null) parts.push(`${Math.round((m.brightness / 255) * 100)} %`);
  if (m.color_temp_kelvin != null) parts.push(`${m.color_temp_kelvin} K`);
  else if (m.rgb_color) parts.push(rgbToHex(m.rgb_color));
  else if (m.hs_color || m.xy_color || m.rgbw_color || m.rgbww_color) parts.push('colour');
  if (m.current_position != null) parts.push(`${m.current_position} % open`);
  if (m.percentage != null) parts.push(`${m.percentage} %`);
  if (m.temperature != null) parts.push(`${m.temperature}°`);
  if (m.hvac_mode) parts.push(m.hvac_mode);
  if (m.volume_level != null) parts.push(`vol ${Math.round(m.volume_level * 100)} %`);
  return parts.filter(Boolean).join(' · ');
};

let SCENE_UID = 0;
export const newSceneId = () => `${Date.now()}${++SCENE_UID}`;

// ------------------------------------------------------------------ HA scene config API

export const loadScene = (hass: HomeAssistant, id: string) =>
  hass.callApi<{ name: string; icon?: string; entities: Record<string, SceneMember> }>('GET', `config/scene/config/${id}`).then(
    c => ({ id, name: c.name, icon: c.icon || '', entities: c.entities || {} }) as SceneConfig
  );

export const saveScene = async (hass: HomeAssistant, cfg: SceneConfig) => {
  if (!Object.keys(cfg.entities).length) throw new Error('A scene needs at least one entity');
  const body: Record<string, any> = { name: cfg.name, entities: cfg.entities };
  if (cfg.icon) body.icon = cfg.icon;
  await hass.callApi('POST', `config/scene/config/${cfg.id}`, body);
  await hass.callService('scene', 'reload', {}).catch(() => undefined);
};

export const deleteScene = async (hass: HomeAssistant, id: string) => {
  await hass.callApi('DELETE', `config/scene/config/${id}`);
  await hass.callService('scene', 'reload', {}).catch(() => undefined);
};

/** The scene.* entity whose config id is ``id`` (after a save it appears a moment later). */
export const sceneEntityFor = (hass: HomeAssistant, id: string): string | null =>
  Object.keys(hass.states).find(e => e.startsWith('scene.') && hass.states[e].attributes.id === id) || null;
