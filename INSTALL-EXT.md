# Installing the Alarmo "ext" build in place

Coming from upstream Alarmo? After installing, read `MIGRATION.md`.

This build replaces the files of an existing Alarmo install. Your configuration
(`.storage/alarmo.storage`) is not converted and stays readable by upstream Alarmo.

## 1. Before you start: make a rollback copy

In your Home Assistant `/config` folder (Samba, SSH, or File editor):

1. Copy `custom_components/alarmo/` to somewhere outside `custom_components`,
   for example `/config/alarmo_rollback/alarmo/`.
2. Copy `.storage/alarmo.storage` to `/config/alarmo_rollback/alarmo.storage`.
3. Optional but recommended: create a full Home Assistant backup.

## 2. Install

1. Disarm all Alarmo areas.
2. Extract the ZIP and copy its `custom_components/alarmo/` folder over
   `/config/custom_components/alarmo/` (overwrite all files).
3. Restart Home Assistant.
4. Open the Alarmo panel and hard-refresh the browser (Ctrl+Shift+R / Cmd+Shift+R).
   The header should show **v1.10.19+ext.4** and the tabs General, Partitions, Arm Modes,
   Zones, Zones (legacy), Codes, Notifications, Actions and Backup.
   Upgrading from ext.1: copy the files over the same way; nothing else is needed.

## 3. Check it in your setup

- [ ] General / Sensors / Codes / Actions tabs look and behave as before.
- [ ] Arm and disarm each area with a user code; a wrong code is rejected.
- [ ] Your actions/notifications still fire (e.g. arm → notification).
- [ ] **Backup** tab → **Create backup now**. Two files appear in `/config/alarmo/backups/`.
- [ ] **Export (download YAML)** downloads a file; open it and check your areas/sensors.
- [ ] **Sensor table** shows every sensor in the right area and modes (compare with the
      Sensors tab).
- [ ] Change one mode checkbox → the cell is highlighted, the bar shows 1 change.
      Change it back → the highlight disappears.
- [ ] Make a real change and **Save** → a `sensor-table` backup appears; the old Sensors
      tab shows the change.
- [ ] **Import / restore…** → pick that backup → **Replace** → preview shows your change
      being undone → apply → the change is reverted.
- [ ] Arm an area, then try a restore → it is refused ("Disarm first").

## 3b. Checks new in ext.2

- [ ] English UI says **Partitions**, **Zones**, **Arm Modes**, **Cross-zone groups**;
      entity IDs (`alarm_control_panel.…`) and your automations are unchanged.
- [ ] **Zones → Add zones** lists `cover.gdo1_garage_door` / `cover.gdo2_garage_door`
      and your locks. Add a garage door, Save, arm, start opening the door → entry delay.
- [ ] **Zone rules → New rule → template "Perimeter label → …"**: if you have no Perimeter
      label, create one in HA (Settings → Areas, labels & zones → Labels) and put it on a
      few door/window entities first.
- [ ] Saving the rule changes nothing yet; the table shows "N pending rule changes".
      **Preview & apply** lists exactly the zones you expect; Apply creates a `rules` backup.
- [ ] Cells set by a rule show a blue icon (hover = rule name).
- [ ] Change one of those cells in the table and Save → it shows an orange override icon;
      the rule no longer changes it. Click the icon to clear it; the rule value returns on
      the next Apply.
- [ ] Two equally specific rules setting different partitions → red outline + conflict
      banner; nothing is applied for that field.
- [ ] Add the label to a new door entity in HA → after a couple of seconds the table shows a
      pending new zone (only if a rule sets its partition).

## 3c. Checks new in ext.4 (page layout)

- [ ] Each tab shows only its own section, starting with a title, a description and a role chip.
- [ ] Edit a partition (its dialog) and an alarm panel mode → saves as before.
- [ ] Notifications → open one, change something, save → you are back on Notifications.
- [ ] Actions → open one, save → you are back on Actions.
- [ ] The links on a Partitions card ("N zones", "N actions") still open the filtered lists.
- [ ] Old bookmarks: `/alarmo/sensors` opens Zones (legacy); `/alarmo/sensor_table` opens Zones.

## 3d. Phase 4: linking your Vista (shadow mode first)

1. On `alarm_control_panel.alarm_partition_1` open **Settings → entity settings** and make sure a
   **default code** is set (Envisalink normally copies its code there). Keypresses use it as `{code}`.
2. **Physical Panel** tab → *Link Alarmo…* your partition (after the migration: **Master**; before it: *All partitions*)
   to the Vista partition → mode **shadow** → Save.
   Your automations keep doing the work; Alarmo sends nothing.
3. Use the house as normal for a few days. In **Activity** check that every "Alarmo X → panel …"
   line is followed by "panel is X after N s" (sent by your automations). Note the learned exit
   delays.
4. Compare the key sequences with your automations (Stay Instant = `{code}7`, Away without exit
   delay = `{code}4`, Custom = bypass + `{code}7`) and adjust the table.
5. Optional: **Physical Panel → Panel zones** → Unlock, tick Mirror for the window zones, Save, then **Use mirrors in Alarmo** so the Alarmo zones
   follow the mirrors instead of `template_window_real_zone_*`.
6. When the log matches: disable the automations *House Mode 2: Alarmo set -> set Panel*,
   *House Modes 3: Alarmo Failed to Arm, Retry* and *Panel Disarms -> Disarm Selector*, set the link
   to **live**, Save, and test arm/disarm from Alarmo and from the keypad.

Moving from partitions-per-sensor-type to one partition: see `MIGRATION.md`, section 2.

## 3e. Phases 5–6: House Modes

Follow `HOUSE-MODES.md` (in the ZIP). Checks:

- [ ] House Modes tab → Add starter modes → adjust → Save; `select.alarmo_house_mode` shows the mode.
- [ ] Switching to Stay arms the partitions; Disarmed disarms them; the History lists both.
- [ ] Local: an automation calling `alarmo.set_house_mode` with `source: presence_away` is blocked.
- [ ] Spa: after 45 min it goes back to the previous mode (also after a restart of HA).
- [ ] With the input_select mirror set, changing `input_select.house_mode_selector` changes the House Mode.

Rolling back: `select.alarmo_house_mode` and the mirror sensors become unavailable (delete them);
automations that call `alarmo.set_house_mode` stop working — keep the old ones disabled, not deleted,
until you are sure.

## Backups

Since ext.11 a backup is three files in `/config/alarmo/backups/`: `<name>.storage.json` (the Alarmo
configuration, upstream format), `<name>.yaml` (readable copy) and `<name>.extras.json` (the ext settings).
The YAML export also carries the ext settings in an `extras:` block. Restoring brings everything back except the
current House Mode, its timers and history. Backups from ext.10 and older have no ext settings; restoring them
leaves the current ext settings alone.

## 4. Rolling back to upstream

1. Replace the files: copy `/config/alarmo_rollback/alarmo/` back to `/config/custom_components/alarmo/`
   (delete the ext folder first so no new files are left behind), or reinstall Alarmo
   from HACS.
2. Restart Home Assistant. Your current `.storage/alarmo.storage` keeps working with
   upstream — no restore is needed. Only if you want the exact pre-install
   configuration back, copy `alarmo_rollback/alarmo.storage` to `.storage/` while Home
   Assistant is stopped.
3. `.storage/alarmo_extras` (ext settings: House Modes, keypads, physical panel, mirrors, zone rules) and
   `/config/alarmo/backups/` can be left or deleted; upstream ignores them. Zones written by
   rules are ordinary Alarmo zones and stay as they are.
