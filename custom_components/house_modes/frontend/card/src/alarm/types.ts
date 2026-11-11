// Modified from alarmo-card (github.com/nielsfaber/alarmo-card, Apache License 2.0, see card/LICENSE-alarmo-card) for House Modes & Alarm Center.
import { HassEvent, HassEntity } from 'home-assistant-js-websocket';
import { AlarmStates, HmEvents } from './const';

export type CardConfig = {
  type: string;
  entity: string;
  name: string;
  keep_keypad_visible: boolean;
  button_scale_keypad: number;
  button_scale_actions: number;
  states: Partial<Record<AlarmStates, Partial<StateConfig>>>;
  show_messages: boolean;
  show_ready_indicator: boolean;
  show_bypassed_sensors: boolean;
  use_code_dialog: boolean;
  hide_keypad: boolean;
};

export type HideOptions = 'always' | 'never' | 'disarmed' | 'armed';

export type StateConfig = {
  hide: boolean | HideOptions;
  button_label: string;
  button_icon: string;
  state_label: string;
  color: string;
  button_order: number;
};

export type HmEvent = HassEvent & {
  data: { [key: string]: any } & {
    event: HmEvents;
    area_id: string;
  };
};

export type HmEntity = HassEntity & {
  attributes: {
    arm_mode?: string;
    open_sensors?: null | { [key: string]: string };
    delay?: number;
    expiration?: string;
    code_format?: string;
    code_arm_required?: boolean;
    bypassed_sensors?: string[];
  };
};

export interface HmEntry {
  area_id: string | number;
  entity_id: string;
}

export interface HmConfig {
  code_arm_required: boolean;
  code_disarm_required: boolean;
  code_format: 'number' | 'text';
}

export interface CountdownConfig {
  delay: number;
  remaining: number;
}

export interface ReadyToArmModesConfig {
  modes: AlarmStates[] | null;
}
