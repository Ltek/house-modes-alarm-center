// Modified from Alarmo (github.com/nielsfaber/alarmo, Apache License 2.0) for House Modes & Alarm Center; see NOTICE.
import { Unique } from '../helpers';
import { HmArea, EArmModes } from '../types';

export const modesByArea = (areaCfg: HmArea) =>
  (Object.keys(areaCfg.modes) as EArmModes[]).filter(mode => areaCfg.modes[mode].enabled);

export const getModesList = (config: Record<string, HmArea>) => {
  let modes: EArmModes[] = [];

  Object.values(config).forEach(area => {
    modes = [...modes, ...modesByArea(area)];
  });

  modes = Unique(modes);

  modes.sort((a, b) => {
    const modesList = Object.values(EArmModes);
    const indexA = modesList.findIndex(e => e == a);
    const indexB = modesList.findIndex(e => e == b);
    return indexA - indexB;
  });

  return modes;
};
