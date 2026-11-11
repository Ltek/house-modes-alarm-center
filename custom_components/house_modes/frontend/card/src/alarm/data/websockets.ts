// Modified from alarmo-card (github.com/nielsfaber/alarmo-card, Apache License 2.0, see card/LICENSE-alarmo-card) for House Modes & Alarm Center.
import { HomeAssistant } from '../lib/types';
import { HmEntry, HmConfig, CountdownConfig, ReadyToArmModesConfig } from '../types';

export const fetchEntities = (hass: HomeAssistant): Promise<HmEntry[]> =>
  hass.callWS({
    type: 'house_modes/entities',
  });

export const fetchConfig = (hass: HomeAssistant): Promise<HmConfig> =>
  hass.callWS({
    type: 'house_modes/config',
  });

export const fetchCountdown = (hass: HomeAssistant, entity_id: string): Promise<CountdownConfig> =>
  hass.callWS({
    type: 'house_modes/countdown',
    entity_id: entity_id,
  });

export const fetchReadyToArmModes = (hass: HomeAssistant, entity_id: string): Promise<ReadyToArmModesConfig> =>
  hass.callWS({
    type: 'house_modes/ready_to_arm_modes',
    entity_id: entity_id,
  });
