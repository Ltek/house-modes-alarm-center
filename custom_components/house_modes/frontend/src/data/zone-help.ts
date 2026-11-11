// Plain-language help for every zone setting (tooltips + the ⓘ help panel).
// Pure data, shared by the zone table and the rule editor.

export type HelpEntry = { title: string; text: string };

export const ZONE_HELP: Record<string, HelpEntry> = {
  zone: {
    title: 'Zone',
    text:
      'A Home Assistant entity used as an alarm zone: a door or window contact, motion sensor, ' +
      'garage door, lock, smoke detector, etc.',
  },
  type: {
    title: 'Zone type',
    text:
      'What kind of zone this is (Door, Window, Motion, Tamper, Environmental, Generic). In the ' +
      'Zones tab it pre-fills sensible options; in this table changing it does not change the ' +
      'other options by itself.',
  },
  area: {
    title: 'Partition',
    text:
      'The partition this zone belongs to. Arming a partition only watches its own zones. Most ' +
      'homes have a single partition.',
  },
  modes: {
    title: 'Arm Modes',
    text:
      'Checked = this zone is watched while its partition is armed in that mode (Away, Home/Stay, ' +
      'Night, Vacation, Custom). A greyed-out box means the mode is turned off for the partition.',
  },
  enabled: {
    title: 'Enabled',
    text:
      'Unchecked = the zone is ignored completely, as if it were removed, but it keeps its ' +
      'settings so you can turn it back on later.',
  },
  always_on: {
    title: 'Always on',
    text:
      'The zone is watched all the time, even when the alarm is disarmed, and triggers ' +
      'immediately. Use it for smoke, CO, water leak and tamper zones.',
  },
  use_entry_delay: {
    title: 'Entry delay',
    text:
      'Checked: when this zone opens while armed, the alarm first waits for the entry delay so you ' +
      'can disarm (typical for the door you come in through). Unchecked: the alarm triggers ' +
      'immediately (an "instant" zone, typical for windows).',
  },
  use_exit_delay: {
    title: 'Exit delay',
    text:
      'Checked: this zone may be open during the exit delay after you arm, e.g. the door you leave ' +
      'through. Unchecked: if it is open while arming, the arming is stopped.',
  },
  auto_bypass: {
    title: 'Auto-bypass',
    text:
      'If this zone is open when you arm, it is left out ("bypassed") for that arming instead of ' +
      'blocking it, e.g. a window you left open. It only happens in the modes chosen under ' +
      '"Bypass in" (click › at the end of the row). The zone is watched again the next time you arm.',
  },
  auto_bypass_modes: {
    title: 'Bypass in',
    text: 'The Arm Modes in which this zone may be bypassed automatically when it is open while arming.',
  },
  allow_open: {
    title: 'Allow open initially',
    text:
      'The zone may be open (active) when you arm. It is ignored until it closes, and triggers if it ' +
      'opens again after that. Typical for motion sensors that are still active when you leave.',
  },
  arm_on_close: {
    title: 'Arm after closing',
    text:
      'When this zone closes during the exit delay, the rest of the delay is skipped and the alarm ' +
      'arms right away, e.g. the front door shutting behind you.',
  },
  trigger_unavailable: {
    title: 'Trigger when unavailable',
    text:
      'If the entity becomes "unavailable" while armed (device offline, flat battery, cut wire), ' +
      'treat it as open. Safer, but a flaky device can cause false alarms.',
  },
  entry_delay: {
    title: 'Entry delay override',
    text:
      "Seconds of entry delay for this zone only, instead of the partition's entry delay for the " +
      'current mode. Leave empty to use the partition setting.',
  },
  delay_on: {
    title: 'Delay on',
    text:
      'The zone must stay open for this many seconds before it counts, which filters out short ' +
      'glitches. Resets if it closes again. Leave empty for no delay.',
  },
  group: {
    title: 'Cross-zone group',
    text:
      'Zones in a cross-zone group only trigger the alarm when several of them (the group setting, ' +
      "e.g. 2) trigger within the group's time window; one zone on its own is ignored. Use it to " +
      'avoid false alarms, e.g. two motion sensors in the same room. Groups are created on the ' +
      'Zones tab ("Set up cross-zone groups").',
  },
  partition: {
    title: 'Partition',
    text: 'The partition the matching zones are put in.',
  },
};

/** Help text, or '' if unknown. */
export const helpText = (key: string) => ZONE_HELP[key]?.text || '';
