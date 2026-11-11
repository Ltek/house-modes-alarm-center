// Modified from Alarmo (github.com/nielsfaber/alarmo, Apache License 2.0) for House Modes & Alarm Center; see NOTICE.
import {
  HmConfig,
  HmModeConfig,
  HmSensor,
  Dictionary,
  HmUser,
  EArmModes,
  HmAutomation,
  HmArea,
  SensorGroup,
  HomeAssistant,
} from '../types';

export const fetchConfig = (hass: HomeAssistant): Promise<HmConfig> =>
  hass.callWS({
    type: 'house_modes/config',
  });

export const fetchSensors = (hass: HomeAssistant): Promise<Dictionary<HmSensor>> =>
  hass.callWS({
    type: 'house_modes/sensors',
  });

export const fetchUsers = (hass: HomeAssistant): Promise<Dictionary<HmUser>> =>
  hass.callWS({
    type: 'house_modes/users',
  });

export const fetchAutomations = (hass: HomeAssistant): Promise<Dictionary<HmAutomation>> =>
  hass.callWS({
    type: 'house_modes/automations',
  });

export const fetchSensorGroups = (hass: HomeAssistant): Promise<Dictionary<SensorGroup>> =>
  hass.callWS({
    type: 'house_modes/sensor_groups',
  });

export const saveConfig = (hass: HomeAssistant, config: Partial<HmConfig>): Promise<boolean> => {
  return hass.callApi('POST', 'house_modes/config', config);
};

export const saveModeConfig = (
  hass: HomeAssistant,
  config: Partial<HmModeConfig> & { mode: EArmModes }
): Promise<boolean> => {
  return hass.callApi('POST', 'house_modes/mode', config);
};

export const saveSensor = (
  hass: HomeAssistant,
  config: Partial<HmSensor> & { entity_id: string }
): Promise<boolean> => {
  return hass.callApi('POST', 'house_modes/sensors', config);
};

export const deleteSensor = (hass: HomeAssistant, entity_id: string): Promise<boolean> => {
  return hass.callApi('POST', 'house_modes/sensors', {
    entity_id: entity_id,
    remove: true,
  });
};

type saveUserResult = { success: boolean, error?: string };
export const saveUser = (hass: HomeAssistant, config: Partial<HmUser>): Promise<saveUserResult> => {
  return hass.callApi('POST', 'house_modes/users', config);
};

export const deleteUser = (hass: HomeAssistant, user_id: string): Promise<boolean> => {
  return hass.callApi('POST', 'house_modes/users', {
    user_id: user_id,
    remove: true,
  });
};

export const saveAutomation = (hass: HomeAssistant, config: Partial<HmAutomation>): Promise<boolean> => {
  return hass.callApi('POST', 'house_modes/automations', config);
};

export const deleteAutomation = (hass: HomeAssistant, automation_id: string): Promise<boolean> => {
  return hass.callApi('POST', 'house_modes/automations', {
    automation_id: automation_id,
    remove: true,
  });
};

export const fetchAreas = (hass: HomeAssistant): Promise<Dictionary<HmArea>> =>
  hass.callWS({
    type: 'house_modes/areas',
  });

export const saveArea = (hass: HomeAssistant, config: Partial<HmArea>): Promise<boolean> => {
  return hass.callApi('POST', 'house_modes/area', config);
};

export const deleteArea = (hass: HomeAssistant, area_id: string): Promise<boolean> => {
  return hass.callApi('POST', 'house_modes/area', {
    area_id: area_id,
    remove: true,
  });
};

export const saveSensorGroup = (hass: HomeAssistant, config: Partial<SensorGroup>): Promise<boolean> => {
  return hass.callApi('POST', 'house_modes/sensor_groups', config);
};

export const deleteSensorGroup = (hass: HomeAssistant, group_id: string): Promise<boolean> => {
  return hass.callApi('POST', 'house_modes/sensor_groups', {
    group_id: group_id,
    remove: true,
  });
};
