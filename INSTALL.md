# Checks, backups and restoring

Installing and moving over from Alarmo: [README.md](README.md) → Install, and [MIGRATION.md](MIGRATION.md).

## 1. After installing or updating

Restart Home Assistant after an update, then open **House Modes & Alarm Center** and hard-refresh the browser
(Ctrl+Shift+R / Cmd+Shift+R). The header shows the version.

- [ ] Arm and disarm each partition with a user code; a wrong code is refused.
- [ ] Notifications and Alarm Events still fire (e.g. arm → notification).
- [ ] **Integrations & Backup** tab → **Create backup now**: two files appear in `/config/house_modes/backups/`.
- [ ] **Export (download YAML)** downloads a file with your partitions and zones.
- [ ] **Zones** shows every zone in the right partition with the right Arm Modes.
- [ ] Change a zone and **Save** → a `sensor-table` backup appears. **Import / restore…** → that backup → **Replace** →
      the preview shows the change being undone → apply → it is reverted.
- [ ] Arm a partition, then try a restore → it is refused ("Disarm first").

## 2. Linking a Vista (Shadow first)

1. On `alarm_control_panel.alarm_partition_1` open **Settings → entity settings** and make sure a
   **default code** is set (Envisalink normally copies its code there). Keypresses use it as `{code}`.
2. **Physical Panel** tab → *Link a partition…* your partition (after the migration: **Master**; before it: *All partitions*)
   to the Vista partition → mode **shadow** → Save.
   Your automations keep doing the work; nothing is sent.
3. Use the house as normal for a few days. In **Activity** check that every "Alarm X → panel …"
   line is followed by "panel is X after N s" (sent by your automations). Note the learned exit
   delays.
4. Compare the key sequences with your automations (Stay Instant = `{code}7`, Away without exit
   delay = `{code}4`, Custom = bypass + `{code}7`) and adjust the table.
5. Optional: **Physical Panel → Panel zones** → Unlock, tick Mirror for the window zones, Save, then **Use mirrors as zones** so the zones
   follow the mirrors instead of `template_window_real_zone_*`.
6. When the log matches: disable your own automations that do the same (for example *House Mode 2: Alarmo set -> set
   Panel*, *House Modes 3: Alarmo Failed to Arm, Retry* and *Panel Disarms -> Disarm Selector*, set the link
   to **live**, Save, and test arm/disarm from the alarm and from the keypad.

Moving from partitions-per-sensor-type to one partition: see `MIGRATION.md`, section 4.

## 3. House Modes

Follow `HOUSE-MODES.md`. Checks:

- [ ] House Modes tab → Add starter modes → adjust → Save; `select.house_mode` shows the mode.
- [ ] Switching to Stay arms the partitions; Disarmed disarms them; the History lists both.
- [ ] Local: an automation calling `house_modes.set_house_mode` with `source: presence_away` is blocked.
- [ ] Spa: after 45 min it goes back to the previous mode (also after a restart of HA).
- [ ] With the input_select mirror set, changing `input_select.house_mode_selector` changes the House Mode.


## Backups

A backup is two files in `/config/house_modes/backups/`: `<name>.storage.json` (a copy of `.storage/house_modes`: the
alarm configuration and every other setting) and `<name>.yaml` (the same, readable). Restoring brings everything back
except the current House Mode, its timers and history. Backups copied from Alarmo by the import (`alarmo_…`, with an
`.extras.json`) are listed too and can be restored the same way.

**Deleting the integration** (Settings → Devices & services → House Modes & Alarm Center → Delete) wipes the alarm
configuration. A backup named `…_before-integration-removed` is made first; after adding the integration again,
restore it from the Backup tab. To stop using it for a while, **Disable** it instead.
